import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const FIXTURE_PATH = path.join(ROOT_DIR, 'tests', 'fixtures', 'alex-rivera.json');
const OUTPUT_DIR = path.join(ROOT_DIR, 'test-output');

const TEMPLATES = [
  'classic',
  'modern',
  'executive',
  'tech',
  'fresher',
  'twocolumn',
  'creative',
  'compact',
];

const PAGE_SIZES = ['A4', 'A3', 'A5', 'A2', 'Letter', 'Legal'];

const GLUED_PATTERNS = [
  { name: 'letter_before_paren', regex: /[A-Za-z]\(/ },
  { name: 'paren_before_word_or_bullet', regex: /\)[A-Za-z0-9•]/ },
  { name: 'glued_em_dash', regex: /\S—|—\S/ },
  { name: 'glued_en_dash', regex: /[A-Za-z0-9]–|–[A-Za-z0-9]/ },
  { name: 'glued_bullet', regex: /\S•|•\S/ },
];

async function verifyPdfBuffer(pdfBytes, meta) {
  const { widthPx, heightPx, widthMm, heightMm, marginPx } = meta;
  const ptToMm = 25.4 / 72;
  const mmToPxX = widthPx / widthMm;
  const mmToPxY = heightPx / heightMm;
  const ptToPxX = ptToMm * mmToPxX;
  const ptToPxY = ptToMm * mmToPxY;

  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(pdfBytes),
    verbosity: 0,
  });
  const pdfDoc = await loadingTask.promise;

  const overlapFailures = [];
  const gluedFailures = [];
  const marginFailures = [];
  let totalTextItems = 0;
  let totalBulletsFound = 0;

  for (let p = 1; p <= pdfDoc.numPages; p++) {
    const page = await pdfDoc.getPage(p);
    const textContent = await page.getTextContent();

    // 1. Reconstruct full extracted text for this page
    const pageText = textContent.items
      .map((item) => item.str + (item.hasEOL ? '\n' : ''))
      .join('');

    for (const pat of GLUED_PATTERNS) {
      const m = pageText.match(pat.regex);
      if (m) {
        const idx = m.index || 0;
        const snippet = pageText.slice(Math.max(0, idx - 20), Math.min(pageText.length, idx + 30));
        gluedFailures.push(`Page ${p} [${pat.name}]: "${snippet.replace(/\n/g, ' ')}"`);
      }
    }

    // 2. Extract bounding boxes in 96-DPI page pixels for all visible text items
    const boxes = [];
    for (const item of textContent.items) {
      if (!item.str || !item.str.trim() || item.height <= 0) continue;
      totalTextItems++;

      if (item.str.includes('•')) {
        totalBulletsFound += (item.str.match(/•/g) || []).length;
      }

      for (const pat of GLUED_PATTERNS) {
        if (pat.regex.test(item.str)) {
          gluedFailures.push(`Page ${p} item [${pat.name}]: "${item.str}"`);
        }
      }

      const txPt = item.transform[4];
      const tyPt = item.transform[5];
      const wPt = item.width;
      const hPt = item.height || Math.abs(item.transform[3]);

      const leftPx = txPt * ptToPxX;
      const rightPx = (txPt + wPt) * ptToPxX;
      const baselineYPx = heightPx - tyPt * ptToPxY;
      const topPx = baselineYPx - hPt * ptToPxY;
      const bottomPx = baselineYPx;

      boxes.push({
        str: item.str,
        leftPx,
        rightPx,
        topPx,
        bottomPx,
      });

      // 3. Check page margins (allow 1.5px float tolerance)
      const tol = 1.5;
      if (
        leftPx < marginPx - tol ||
        rightPx > widthPx - marginPx + tol ||
        topPx < marginPx - tol ||
        bottomPx > heightPx - marginPx + tol
      ) {
        marginFailures.push(
          `Page ${p}: "${item.str.slice(0, 32)}" box=[${leftPx.toFixed(1)}, ${topPx.toFixed(
            1
          )}, ${rightPx.toFixed(1)}, ${bottomPx.toFixed(1)}] outside margin=${marginPx}px on ${widthPx}x${heightPx}px`
        );
      }
    }

    // 4. Pairwise 2D bounding-box overlap check (> 1px in both X and Y)
    for (let i = 0; i < boxes.length; i++) {
      for (let j = i + 1; j < boxes.length; j++) {
        const a = boxes[i];
        const b = boxes[j];
        const overlapX = Math.min(a.rightPx, b.rightPx) - Math.max(a.leftPx, b.leftPx);
        const overlapY = Math.min(a.bottomPx, b.bottomPx) - Math.max(a.topPx, b.topPx);
        if (overlapX > 1.0 && overlapY > 1.0) {
          overlapFailures.push(
            `Page ${p}: "${a.str.slice(0, 25)}" overlaps "${b.str.slice(0, 25)}" by ${overlapX.toFixed(
              2
            )}px × ${overlapY.toFixed(2)}px`
          );
        }
      }
    }
  }

  if (totalBulletsFound === 0) {
    gluedFailures.push('No bullet characters (•) found in extracted PDF text');
  }

  return {
    numPages: pdfDoc.numPages,
    totalTextItems,
    totalBulletsFound,
    overlapFailures,
    gluedFailures,
    marginFailures,
  };
}

async function main() {
  const serverUrl = process.env.TEST_URL || 'http://localhost:3000/editor';
  const fixtureRaw = fs.readFileSync(FIXTURE_PATH, 'utf-8');
  const fixtureData = JSON.parse(fixtureRaw);

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  console.log(`Launching Playwright Chromium against ${serverUrl}...`);
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
  } catch {
    try {
      browser = await chromium.launch({ headless: true, channel: 'msedge' });
    } catch {
      browser = await chromium.launch({ headless: true, channel: 'chrome' });
    }
  }
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  await page.goto(serverUrl, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForFunction(() => Boolean(window.__CRAFTCV_TEST__), { timeout: 30000 });

  const results = [];
  let allPassed = true;

  for (const templateId of TEMPLATES) {
    for (const pageSizeId of PAGE_SIZES) {
      const exportResult = await page.evaluate(
        async ({ fixtureData, templateId, pageSizeId }) => {
          return await window.__CRAFTCV_TEST__.renderAndExport(
            fixtureData,
            templateId,
            pageSizeId,
            1.5
          );
        },
        { fixtureData, templateId, pageSizeId }
      );

      // Save PDF and PNGs to /test-output
      const pdfFilePath = path.join(OUTPUT_DIR, `${templateId}-${pageSizeId}.pdf`);
      fs.writeFileSync(pdfFilePath, Buffer.from(exportResult.pdfBytes));

      exportResult.pagePngDataUrls.forEach((dataUrl, idx) => {
        const base64 = dataUrl.replace(/^data:image\/png;base64,/, '');
        const pngPath = path.join(OUTPUT_DIR, `${templateId}-${pageSizeId}-page-${idx + 1}.png`);
        fs.writeFileSync(pngPath, Buffer.from(base64, 'base64'));
      });

      const check = await verifyPdfBuffer(exportResult.pdfBytes, exportResult);
      const passed =
        check.overlapFailures.length === 0 &&
        check.gluedFailures.length === 0 &&
        check.marginFailures.length === 0 &&
        check.totalTextItems > 10;

      if (!passed) {
        allPassed = false;
      }

      results.push({
        templateId,
        pageSizeId,
        pages: check.numPages,
        items: check.totalTextItems,
        bullets: check.totalBulletsFound,
        overlaps: check.overlapFailures.length,
        glued: check.gluedFailures.length,
        marginOut: check.marginFailures.length,
        status: passed ? 'PASS' : 'FAIL',
        details: [
          ...check.overlapFailures,
          ...check.gluedFailures,
          ...check.marginFailures,
        ],
      });

      const badge = passed ? 'PASS' : 'FAIL';
      console.log(
        `[${badge}] ${templateId.padEnd(10)} | ${pageSizeId.padEnd(6)} | pages=${check.numPages} | items=${String(
          check.totalTextItems
        ).padEnd(4)} | bullets=${String(check.totalBulletsFound).padEnd(2)} | overlaps=${
          check.overlapFailures.length
        } | glued=${check.gluedFailures.length} | marginOut=${check.marginFailures.length}`
      );
      if (!passed) {
        for (const d of results[results.length - 1].details.slice(0, 5)) {
          console.error(`   -> ${d}`);
        }
      }
    }
  }

  await browser.close();

  console.log('\n=========================================================================================');
  console.log('| Template   | Size   | Pages | Text Boxes | Bullets | Overlaps | Glued | Out-of-Margin | Status |');
  console.log('|------------|--------|-------|------------|---------|----------|-------|---------------|--------|');
  for (const r of results) {
    console.log(
      `| ${r.templateId.padEnd(10)} | ${r.pageSizeId.padEnd(6)} | ${String(r.pages).padEnd(5)} | ${String(
        r.items
      ).padEnd(10)} | ${String(r.bullets).padEnd(7)} | ${String(r.overlaps).padEnd(8)} | ${String(
        r.glued
      ).padEnd(5)} | ${String(r.marginOut).padEnd(13)} | ${r.status.padEnd(6)} |`
    );
  }
  console.log('=========================================================================================\n');

  const summaryPath = path.join(OUTPUT_DIR, 'verification-summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify({ allPassed, totalCases: results.length, results }, null, 2));

  if (!allPassed) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
