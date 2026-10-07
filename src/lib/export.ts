import type { jsPDF } from 'jspdf';
import { ResumeData } from '@/types/resume';
import { getPageSizeConfig } from '@/lib/page-sizes';
import { getEffectiveMarginPx } from '@/templates/template-helper';

export function getResumeFileName(resume: ResumeData, ext: 'pdf' | 'png' | 'jpg' | 'txt'): string {
  const nameParts = (resume.personalInfo.fullName || 'Resume')
    .trim()
    .replace(/[^a-zA-Z0-9\s_-]/g, '')
    .split(/\s+/)
    .filter(Boolean);

  const baseName = nameParts.length > 0 ? nameParts.join('_') : 'Resume';
  return `${baseName}_Resume.${ext}`;
}

/**
 * Wait for all web fonts to finish loading before measuring or capturing
 */
async function ensureFontsReady(): Promise<void> {
  if (typeof document !== 'undefined' && 'fonts' in document) {
    try {
      await document.fonts.ready;
    } catch {
      // continue safely if fonts API rejects
    }
  }
}

/**
 * Parse CSS rgb/rgba/hex color string into [r, g, b, a]
 */
function parseCssColor(colorStr: string | null | undefined): [number, number, number, number] {
  if (!colorStr || colorStr === 'transparent' || colorStr === 'none') {
    return [0, 0, 0, 0];
  }
  const trimmed = colorStr.trim();
  if (trimmed.startsWith('#')) {
    const hex = trimmed.slice(1);
    if (hex.length === 3) {
      return [
        parseInt(hex[0] + hex[0], 16),
        parseInt(hex[1] + hex[1], 16),
        parseInt(hex[2] + hex[2], 16),
        1,
      ];
    }
    if (hex.length >= 6) {
      return [
        parseInt(hex.slice(0, 2), 16),
        parseInt(hex.slice(2, 4), 16),
        parseInt(hex.slice(4, 6), 16),
        1,
      ];
    }
  }
  const match = trimmed.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*[,/]\s*([\d.]+))?\s*\)/i);
  if (match) {
    return [
      Math.round(Number(match[1])),
      Math.round(Number(match[2])),
      Math.round(Number(match[3])),
      match[4] !== undefined ? Number(match[4]) : 1,
    ];
  }
  return [17, 24, 39, 1]; // Default #111827
}

/**
 * Ensure text color is never dim on light paper (unless intentionally light text on a dark banner like Executive)
 */
function enforceSolidTextColor(r: number, g: number, b: number): [number, number, number] {
  if (r > 230 && g > 230 && b > 230) {
    return [255, 255, 255];
  }
  const isGrayish = Math.abs(r - g) < 25 && Math.abs(g - b) < 25;
  if (isGrayish && r > 90 && g > 95 && b > 105) {
    return [75, 85, 99]; // #4B5563 solid secondary text floor
  }
  return [r, g, b];
}

/**
 * Normalize text spacing so separators (•, —, –) and opening parentheses "("
 * are never glued to adjacent words in exported PDF text.
 */
export function normalizePdfTextSpacing(input: string): string {
  return input
    .replace(/\s+/g, ' ')
    // Ensure bullet • always has spaces around it when adjacent to non-whitespace
    .replace(/(\S)•/g, '$1 •')
    .replace(/•(\S)/g, '• $1')
    // Ensure em-dash — always has spaces around it
    .replace(/(\S)—/g, '$1 —')
    .replace(/—(\S)/g, '— $1')
    // Ensure en-dash – between alphanumeric tokens has spaces around it
    .replace(/([A-Za-z0-9])–/g, '$1 –')
    .replace(/–([A-Za-z0-9])/g, '– $1')
    // Ensure a letter/digit/closing-paren immediately followed by "(" has a space before "("
    .replace(/([A-Za-z0-9)])\(/g, '$1 (')
    // Ensure ")" immediately followed by a letter/digit or "•" has a space after ")"
    .replace(/\)([A-Za-z0-9•])/g, ') $1')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Locate all untransformed page elements from the export container (or fallback to element)
 */
export function getExportPageElements(fallbackElement?: HTMLElement | null): HTMLElement[] {
  if (fallbackElement) {
    const directPages = Array.from(
      fallbackElement.querySelectorAll('[data-export-page], [data-page-number]')
    ) as HTMLElement[];
    if (directPages.length > 0) return directPages;
  }
  const exportRoot = document.querySelector('[data-resume-export-root="true"]');
  if (exportRoot) {
    const pages = Array.from(exportRoot.querySelectorAll('[data-export-page]')) as HTMLElement[];
    if (pages.length > 0) return pages;
  }
  if (fallbackElement) {
    return [fallbackElement];
  }
  const anyPages = Array.from(document.querySelectorAll('[data-page-number]')) as HTMLElement[];
  if (anyPages.length > 0) return anyPages;
  const anyPage = document.querySelector('[data-resume-canvas="true"]') as HTMLElement | null;
  return anyPage ? [anyPage] : [];
}

/**
 * High-resolution canvas render of a single untransformed page element with image smoothing
 */
export async function capturePageCanvas(
  pageElement: HTMLElement,
  scale = 3,
  widthPx = 794,
  heightPx = 1123
): Promise<HTMLCanvasElement> {
  await ensureFontsReady();
  const { default: html2canvas } = await import('html2canvas-pro');

  const rawCanvas = await html2canvas(pageElement, {
    scale,
    useCORS: true,
    allowTaint: true,
    logging: false,
    backgroundColor: '#FFFFFF',
    width: widthPx,
    height: heightPx,
    windowWidth: widthPx,
    windowHeight: heightPx,
    onclone: (clonedDoc) => {
      const previewDoc = clonedDoc.getElementById('resume-preview-document');
      if (previewDoc) {
        previewDoc.style.transform = 'none';
        previewDoc.style.boxShadow = 'none';
        previewDoc.style.margin = '0';
      }
    },
  });

  const ctx = rawCanvas.getContext('2d');
  if (ctx) {
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
  }
  return rawCanvas;
}

/**
 * Render an <img> element into a dataURL for embedding in vector PDF
 */
function imageElementToDataUrl(imgEl: HTMLImageElement, borderRadiusPx: number): string | null {
  try {
    const w = Math.max(1, Math.round(imgEl.naturalWidth || imgEl.width || 120));
    const h = Math.max(1, Math.round(imgEl.naturalHeight || imgEl.height || 120));
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    if (borderRadiusPx >= 16) {
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, Math.min(w, h) / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
    }
    ctx.drawImage(imgEl, 0, 0, w, h);
    return canvas.toDataURL('image/png');
  } catch {
    return null;
  }
}

interface RawDomFragment {
  text: string;
  leftPx: number;
  rightPx: number;
  topPx: number;
  bottomPx: number;
  heightPx: number;
  pdfFont: 'helvetica' | 'times' | 'courier';
  pdfFontStyle: 'normal' | 'bold' | 'italic' | 'bolditalic';
  fontSizePt: number;
  color: [number, number, number];
  isUnderline: boolean;
  inlineGroupEl: HTMLElement;
  rowGroupEl: HTMLElement;
}

interface PdfPlacedRun {
  text: string;
  xMm: number;
  widthMm: number;
  baselineYMm: number;
  fontHeightMm: number;
  pdfFont: 'helvetica' | 'times' | 'courier';
  pdfFontStyle: 'normal' | 'bold' | 'italic' | 'bolditalic';
  fontSizePt: number;
  color: [number, number, number];
  isUnderline: boolean;
  rowGroupEl: HTMLElement;
  rowLineKey: number;
}

/**
 * Render a single untransformed page DOM element into the jsPDF instance using
 * true vector shapes, vector borders, and selectable vector text with guaranteed
 * non-overlapping bounding boxes, preserved spacing, and strict page margin bounds.
 */
function renderDomPageToVectorPdf(
  pdf: jsPDF,
  pageEl: HTMLElement,
  widthMm: number,
  heightMm: number,
  widthPx: number,
  heightPx: number,
  fallbackMarginPx: number
): void {
  const pageRect = pageEl.getBoundingClientRect();
  const scaleX = pageRect.width > 0 ? pageRect.width / widthPx : 1;
  const scaleY = pageRect.height > 0 ? pageRect.height / heightPx : 1;

  const pxToMmX = widthMm / widthPx;
  const pxToMmY = heightMm / heightPx;
  const ptToMm = 25.4 / 72;

  const attrMarginPx = Number(pageEl.getAttribute('data-margin-px'));
  const marginPx = Number.isFinite(attrMarginPx) && attrMarginPx > 0 ? attrMarginPx : fallbackMarginPx;

  // Safe inner margin boundaries in mm (with 1.2mm safety buffer inside the page margins)
  const minXMm = marginPx * pxToMmX + 1.2;
  const maxXMm = widthMm - marginPx * pxToMmX - 1.2;
  const minYMm = marginPx * pxToMmY + 1.2;
  const maxYMm = heightMm - marginPx * pxToMmY - 1.2;

  const viewportEl = pageEl.querySelector('[data-page-viewport="true"]') as HTMLElement | null;
  const vpRect = viewportEl ? viewportEl.getBoundingClientRect() : pageRect;
  const vpTopPx = (vpRect.top - pageRect.top) / scaleY;
  const vpBottomPx = (vpRect.bottom - pageRect.top) / scaleY;

  // Fill white paper background
  pdf.setFillColor(255, 255, 255);
  pdf.rect(0, 0, widthMm, heightMm, 'F');

  // 1. Walk elements to render vector backgrounds, borders, legacy list bullets, and photos
  const allElements = Array.from(pageEl.querySelectorAll('*')) as HTMLElement[];

  for (const el of allElements) {
    const r = el.getBoundingClientRect();
    if (r.width <= 0 || r.height <= 0) continue;

    let elTop = (r.top - pageRect.top) / scaleY;
    let elBottom = (r.bottom - pageRect.top) / scaleY;
    const elLeft = (r.left - pageRect.left) / scaleX;
    const elWidth = r.width / scaleX;

    if (elBottom <= vpTopPx + 0.5 || elTop >= vpBottomPx - 0.5) continue;
    elTop = Math.max(elTop, vpTopPx);
    elBottom = Math.min(elBottom, vpBottomPx);

    const elHeight = elBottom - elTop;
    if (elHeight <= 0) continue;

    const style = window.getComputedStyle(el);

    // Background fills (headers, sidebars, skill badges, accent bars)
    const [bgR, bgG, bgB, bgA] = parseCssColor(style.backgroundColor);
    const isWhitePaperRoot =
      el.classList.contains('a4-page') ||
      el.hasAttribute('data-export-page') ||
      el.hasAttribute('data-page-viewport');

    if (bgA > 0.05 && !isWhitePaperRoot && !(bgR === 255 && bgG === 255 && bgB === 255 && elWidth > widthPx * 0.9)) {
      pdf.setFillColor(bgR, bgG, bgB);
      const radiusPx = parseFloat(style.borderTopLeftRadius) || 0;
      const radiusMm = Math.min(radiusPx * pxToMmX, (elWidth * pxToMmX) / 2, (elHeight * pxToMmY) / 2);
      if (radiusMm > 0.3) {
        pdf.roundedRect(elLeft * pxToMmX, elTop * pxToMmY, elWidth * pxToMmX, elHeight * pxToMmY, radiusMm, radiusMm, 'F');
      } else {
        pdf.rect(elLeft * pxToMmX, elTop * pxToMmY, elWidth * pxToMmX, elHeight * pxToMmY, 'F');
      }
    }

    // Borders (dividers, left accent lines, tag borders)
    const bt = parseFloat(style.borderTopWidth) || 0;
    const bb = parseFloat(style.borderBottomWidth) || 0;
    const bl = parseFloat(style.borderLeftWidth) || 0;
    const br = parseFloat(style.borderRightWidth) || 0;

    if (bt > 0 && bb > 0 && bl > 0 && br > 0) {
      const [cR, cG, cB, cA] = parseCssColor(style.borderTopColor);
      if (cA > 0.05) {
        pdf.setDrawColor(cR, cG, cB);
        pdf.setLineWidth(Math.max(0.15, bt * pxToMmX));
        const radiusPx = parseFloat(style.borderTopLeftRadius) || 0;
        const radiusMm = Math.min(radiusPx * pxToMmX, (elWidth * pxToMmX) / 2, (elHeight * pxToMmY) / 2);
        if (radiusMm > 0.3) {
          pdf.roundedRect(elLeft * pxToMmX, elTop * pxToMmY, elWidth * pxToMmX, elHeight * pxToMmY, radiusMm, radiusMm, 'S');
        } else {
          pdf.rect(elLeft * pxToMmX, elTop * pxToMmY, elWidth * pxToMmX, elHeight * pxToMmY, 'S');
        }
      }
    } else {
      if (bt > 0) {
        const [cR, cG, cB, cA] = parseCssColor(style.borderTopColor);
        if (cA > 0.05) {
          pdf.setDrawColor(cR, cG, cB);
          pdf.setLineWidth(Math.max(0.2, bt * pxToMmY));
          pdf.line(elLeft * pxToMmX, elTop * pxToMmY, (elLeft + elWidth) * pxToMmX, elTop * pxToMmY);
        }
      }
      if (bb > 0) {
        const [cR, cG, cB, cA] = parseCssColor(style.borderBottomColor);
        if (cA > 0.05) {
          pdf.setDrawColor(cR, cG, cB);
          pdf.setLineWidth(Math.max(0.2, bb * pxToMmY));
          pdf.line(elLeft * pxToMmX, elBottom * pxToMmY, (elLeft + elWidth) * pxToMmX, elBottom * pxToMmY);
        }
      }
      if (bl > 0) {
        const [cR, cG, cB, cA] = parseCssColor(style.borderLeftColor);
        if (cA > 0.05) {
          pdf.setDrawColor(cR, cG, cB);
          pdf.setLineWidth(Math.max(0.2, bl * pxToMmX));
          pdf.line(elLeft * pxToMmX, elTop * pxToMmY, elLeft * pxToMmX, elBottom * pxToMmY);
        }
      }
      if (br > 0) {
        const [cR, cG, cB, cA] = parseCssColor(style.borderRightColor);
        if (cA > 0.05) {
          pdf.setDrawColor(cR, cG, cB);
          pdf.setLineWidth(Math.max(0.2, br * pxToMmX));
          pdf.line((elLeft + elWidth) * pxToMmX, elTop * pxToMmY, (elLeft + elWidth) * pxToMmX, elBottom * pxToMmY);
        }
      }
    }

    // Legacy <li> bullets (skip for BulletList which renders real "• " text nodes)
    if (
      el.tagName === 'LI' &&
      style.listStyleType !== 'none' &&
      !el.closest('[data-bullet-list="true"]')
    ) {
      const [tR, tG, tB] = enforceSolidTextColor(
        ...(parseCssColor(style.color).slice(0, 3) as [number, number, number])
      );
      pdf.setFillColor(tR, tG, tB);
      const bulletX = (elLeft - 8) * pxToMmX;
      const bulletY = (elTop + (parseFloat(style.fontSize) || 12) * 0.6) * pxToMmY;
      pdf.circle(bulletX, bulletY, 0.45, 'F');
    }

    // Profile image (<img>)
    if (el.tagName === 'IMG') {
      const imgEl = el as HTMLImageElement;
      const radiusPx = parseFloat(style.borderTopLeftRadius) || 0;
      const dataUrl = imageElementToDataUrl(imgEl, radiusPx);
      if (dataUrl) {
        pdf.addImage(dataUrl, 'PNG', elLeft * pxToMmX, elTop * pxToMmY, elWidth * pxToMmX, elHeight * pxToMmY);
      }
    }
  }

  // 2. Collect all visible text fragments from DOM Text nodes
  const rawFragments: RawDomFragment[] = [];
  const walker = document.createTreeWalker(pageEl, NodeFilter.SHOW_TEXT);
  let currentNode = walker.nextNode();

  while (currentNode) {
    const textNode = currentNode as Text;
    currentNode = walker.nextNode();

    const rawText = textNode.nodeValue || '';
    if (!rawText.trim()) continue;

    const parentEl = textNode.parentElement;
    if (!parentEl) continue;

    const style = window.getComputedStyle(parentEl);
    if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') continue;

    interface WordLine {
      words: string[];
      leftPx: number;
      rightPx: number;
      topPx: number;
      bottomPx: number;
    }

    const wordLines: WordLine[] = [];
    const wordRegex = /\S+/g;
    let match: RegExpExecArray | null;
    const range = document.createRange();

    while ((match = wordRegex.exec(rawText)) !== null) {
      const startOffset = match.index;
      const endOffset = startOffset + match[0].length;
      range.setStart(textNode, startOffset);
      range.setEnd(textNode, endOffset);

      const rect = range.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) continue;

      const tokenLeft = (rect.left - pageRect.left) / scaleX;
      const tokenRight = (rect.right - pageRect.left) / scaleX;
      const tokenTop = (rect.top - pageRect.top) / scaleY;
      const tokenBottom = (rect.bottom - pageRect.top) / scaleY;

      const lastLine = wordLines[wordLines.length - 1];
      if (lastLine && Math.abs(lastLine.topPx - tokenTop) < 3.5) {
        lastLine.words.push(match[0]);
        lastLine.leftPx = Math.min(lastLine.leftPx, tokenLeft);
        lastLine.rightPx = Math.max(lastLine.rightPx, tokenRight);
        lastLine.topPx = Math.min(lastLine.topPx, tokenTop);
        lastLine.bottomPx = Math.max(lastLine.bottomPx, tokenBottom);
      } else {
        wordLines.push({
          words: [match[0]],
          leftPx: tokenLeft,
          rightPx: tokenRight,
          topPx: tokenTop,
          bottomPx: tokenBottom,
        });
      }
    }

    if (wordLines.length === 0) continue;

    const fontFamilyStr = style.fontFamily.toLowerCase();
    let pdfFont: 'helvetica' | 'times' | 'courier' = 'helvetica';
    if (
      fontFamilyStr.includes('lora') ||
      fontFamilyStr.includes('merriweather') ||
      fontFamilyStr.includes('georgia') ||
      fontFamilyStr.includes('serif')
    ) {
      if (!fontFamilyStr.includes('sans-serif')) {
        pdfFont = 'times';
      }
    } else if (fontFamilyStr.includes('mono') || fontFamilyStr.includes('courier')) {
      pdfFont = 'courier';
    }

    const weightNum = parseInt(style.fontWeight, 10) || (style.fontWeight === 'bold' ? 700 : 400);
    const isBold = weightNum >= 600;
    const isItalic = style.fontStyle === 'italic';
    const pdfFontStyle = isBold && isItalic ? 'bolditalic' : isBold ? 'bold' : isItalic ? 'italic' : 'normal';

    const fontSizePx = parseFloat(style.fontSize) || 12;
    const fontSizePt = Math.max(6.5, Number((fontSizePx * 0.75).toFixed(2)));

    const [rawR, rawG, rawB] = parseCssColor(style.color);
    const color = enforceSolidTextColor(rawR, rawG, rawB);
    const isUppercase = style.textTransform === 'uppercase';
    const isUnderline = style.textDecorationLine.includes('underline');

    const inlineGroupEl = (parentEl.closest(
      '[data-contact-line="true"], [data-entry-left="true"], [data-entry-subrow="true"], [data-entry-date="true"], [data-skill-label="true"], [data-skill-value="true"], [data-bullet-marker="true"], [data-bullet-text="true"], h1, h2, h3, h4, p'
    ) || parentEl) as HTMLElement;

    const rowGroupEl = (parentEl.closest(
      '[data-contact-line="true"], [data-entry-row="true"], [data-entry-subrow="true"], [data-skill-row="true"], [data-bullet-item="true"], header, li, h1, h2, h3, h4, p'
    ) || inlineGroupEl) as HTMLElement;

    for (const wl of wordLines) {
      const heightPx = wl.bottomPx - wl.topPx;
      const midY = wl.topPx + heightPx * 0.5;
      if (midY < vpTopPx + 1 || midY > vpBottomPx - 1) continue;

      let text = wl.words.join(' ');
      if (isUppercase) {
        text = text.toUpperCase();
      }
      text = normalizePdfTextSpacing(text);
      if (!text) continue;

      rawFragments.push({
        text,
        leftPx: wl.leftPx,
        rightPx: wl.rightPx,
        topPx: wl.topPx,
        bottomPx: wl.bottomPx,
        heightPx,
        pdfFont,
        pdfFontStyle,
        fontSizePt,
        color,
        isUnderline,
        inlineGroupEl,
        rowGroupEl,
      });
    }
  }

  if (rawFragments.length === 0) return;

  // Helper to measure text width with a 2.5% safety factor for PDF viewer glyph metric variance
  const measureSafeWidthMm = (
    font: 'helvetica' | 'times' | 'courier',
    fontStyle: 'normal' | 'bold' | 'italic' | 'bolditalic',
    sizePt: number,
    str: string
  ): number => {
    pdf.setFont(font, fontStyle);
    pdf.setFontSize(sizePt);
    return pdf.getTextWidth(str) * 1.025;
  };

  // 3. Phase 1: Merge fragments that belong to the same (inlineGroupEl, visualLine)
  interface InlineLineCluster {
    inlineGroupEl: HTMLElement;
    rowGroupEl: HTMLElement;
    topPx: number;
    bottomPx: number;
    fragments: RawDomFragment[];
  }

  const inlineClusters: InlineLineCluster[] = [];
  for (const frag of rawFragments) {
    const existing = inlineClusters.find(
      (c) =>
        c.inlineGroupEl === frag.inlineGroupEl &&
        Math.abs((c.topPx + c.bottomPx) * 0.5 - (frag.topPx + frag.bottomPx) * 0.5) <
          Math.min(c.bottomPx - c.topPx, frag.heightPx) * 0.55
    );
    if (existing) {
      existing.fragments.push(frag);
      existing.topPx = Math.min(existing.topPx, frag.topPx);
      existing.bottomPx = Math.max(existing.bottomPx, frag.bottomPx);
    } else {
      inlineClusters.push({
        inlineGroupEl: frag.inlineGroupEl,
        rowGroupEl: frag.rowGroupEl,
        topPx: frag.topPx,
        bottomPx: frag.bottomPx,
        fragments: [frag],
      });
    }
  }

  const placedRuns: PdfPlacedRun[] = [];
  for (const cluster of inlineClusters) {
    cluster.fragments.sort((a, b) => a.leftPx - b.leftPx);
    const first = cluster.fragments[0];

    const combinedText = normalizePdfTextSpacing(
      cluster.fragments.map((f) => f.text).join(' ')
    );
    if (!combinedText) continue;

    const lineHeightPx = cluster.bottomPx - cluster.topPx;
    const fontSizePt = first.fontSizePt;
    const fontHeightMm = fontSizePt * ptToMm;
    const xMm = first.leftPx * pxToMmX;
    const baselineYMm = (cluster.topPx + lineHeightPx * 0.78) * pxToMmY;
    const widthMm = measureSafeWidthMm(first.pdfFont, first.pdfFontStyle, fontSizePt, combinedText);

    placedRuns.push({
      text: combinedText,
      xMm,
      widthMm,
      baselineYMm,
      fontHeightMm,
      pdfFont: first.pdfFont,
      pdfFontStyle: first.pdfFontStyle,
      fontSizePt,
      color: first.color,
      isUnderline: cluster.fragments.length === 1 ? first.isUnderline : false,
      rowGroupEl: cluster.rowGroupEl,
      rowLineKey: Math.round(cluster.topPx / 4),
    });
  }

  // 4. Phase 2: Group runs that share the same rowGroupEl and overlapping vertical line
  // (using 0.95 * max(fontHeightMm) so 12px title + 10px date in the same EntryRow always pair!)
  interface RowLineGroup {
    rowGroupEl: HTMLElement;
    baselineYMm: number;
    runs: PdfPlacedRun[];
  }

  const rowGroups: RowLineGroup[] = [];
  for (const run of placedRuns) {
    const existing = rowGroups.find(
      (g) =>
        g.rowGroupEl === run.rowGroupEl &&
        Math.abs(g.baselineYMm - run.baselineYMm) <
          Math.max(g.runs[0].fontHeightMm, run.fontHeightMm) * 0.95
    );
    if (existing) {
      existing.runs.push(run);
    } else {
      rowGroups.push({
        rowGroupEl: run.rowGroupEl,
        baselineYMm: run.baselineYMm,
        runs: [run],
      });
    }
  }

  const minGapMm = 1.45; // ~4.1pt (~5.5px) gap guarantees both 0px overlap and pdfjs space synthesis

  const layoutHorizontalRowRuns = (runs: PdfPlacedRun[]) => {
    runs.sort((a, b) => a.xMm - b.xMm);
    runs[0].xMm = Math.max(minXMm, runs[0].xMm);

    const recomputeWidths = () => {
      for (const r of runs) {
        r.widthMm = measureSafeWidthMm(r.pdfFont, r.pdfFontStyle, r.fontSizePt, r.text);
        r.fontHeightMm = r.fontSizePt * ptToMm;
      }
    };
    recomputeWidths();

    const availableRowWidth = maxXMm - runs[0].xMm;
    const totalGaps = Math.max(0, runs.length - 1) * minGapMm;
    const totalTextWidth = runs.reduce((sum, r) => sum + r.widthMm, 0);

    if (totalTextWidth + totalGaps > availableRowWidth && totalTextWidth > 0) {
      const maxFullWidth = maxXMm - minXMm;
      if (runs.length === 1 && totalTextWidth <= maxFullWidth) {
        runs[0].xMm = Math.max(minXMm, maxXMm - totalTextWidth);
      } else {
        const usableForText = Math.max(10, availableRowWidth - totalGaps);
        const scale = Math.min(1, (usableForText / totalTextWidth) * 0.96);
        for (const r of runs) {
          r.fontSizePt = Math.max(4.5, Number((r.fontSizePt * scale).toFixed(2)));
        }
        recomputeWidths();
      }
    }

    // Forward pass: guarantee r[i+1].xMm >= r[i].xMm + r[i].widthMm + minGapMm
    for (let i = 0; i < runs.length - 1; i++) {
      const reqNextX = runs[i].xMm + runs[i].widthMm + minGapMm;
      if (runs[i + 1].xMm < reqNextX) {
        runs[i + 1].xMm = reqNextX;
      }
    }

    // Backward pass: if last run exceeds maxXMm, shift runs leftward into available slack
    const lastIdx = runs.length - 1;
    if (runs[lastIdx].xMm + runs[lastIdx].widthMm > maxXMm) {
      runs[lastIdx].xMm = Math.max(minXMm, maxXMm - runs[lastIdx].widthMm);
      for (let i = lastIdx - 1; i >= 0; i--) {
        const maxAllowedX = runs[i + 1].xMm - minGapMm - runs[i].widthMm;
        if (runs[i].xMm > maxAllowedX) {
          runs[i].xMm = Math.max(minXMm, maxAllowedX);
        }
      }
      // If backward pass hit minXMm and still overflows, scale down proportionally
      const endRight = runs[lastIdx].xMm + runs[lastIdx].widthMm;
      if (endRight > maxXMm || (runs.length > 1 && runs[1].xMm < runs[0].xMm + runs[0].widthMm + minGapMm)) {
        const currentTotalText = runs.reduce((sum, r) => sum + r.widthMm, 0);
        const usable = Math.max(10, maxXMm - minXMm - totalGaps);
        const scale = Math.min(0.95, (usable / Math.max(1, currentTotalText)) * 0.95);
        for (const r of runs) {
          r.fontSizePt = Math.max(4.5, Number((r.fontSizePt * scale).toFixed(2)));
        }
        recomputeWidths();
        runs[0].xMm = minXMm;
        for (let i = 0; i < runs.length - 1; i++) {
          runs[i + 1].xMm = Math.max(runs[i + 1].xMm, runs[i].xMm + runs[i].widthMm + minGapMm);
        }
        if (runs[lastIdx].xMm + runs[lastIdx].widthMm > maxXMm) {
          runs[lastIdx].xMm = Math.max(minXMm, maxXMm - runs[lastIdx].widthMm);
        }
      }
    }
  };

  for (const group of rowGroups) {
    const unifiedBaseline =
      group.runs.reduce((acc, r) => acc + r.baselineYMm, 0) / group.runs.length;
    for (const r of group.runs) {
      r.baselineYMm = unifiedBaseline;
    }
    layoutHorizontalRowRuns(group.runs);
  }

  // 5. Phase 3: Global 2D non-overlap & vertical margin pass
  interface HorizontalRowBand {
    baselineYMm: number;
    maxFontHeightMm: number;
    minXMm: number;
    maxXMm: number;
    runs: PdfPlacedRun[];
  }

  const bands: HorizontalRowBand[] = [];
  for (const group of rowGroups) {
    const minX = Math.min(...group.runs.map((r) => r.xMm));
    const maxX = Math.max(...group.runs.map((r) => r.xMm + r.widthMm));
    const maxH = Math.max(...group.runs.map((r) => r.fontHeightMm));
    bands.push({
      baselineYMm: group.runs[0].baselineYMm,
      maxFontHeightMm: maxH,
      minXMm: minX,
      maxXMm: maxX,
      runs: group.runs,
    });
  }

  bands.sort((a, b) => a.baselineYMm - b.baselineYMm);

  for (const band of bands) {
    const minBaseline = minYMm + band.maxFontHeightMm;
    if (band.baselineYMm < minBaseline) {
      band.baselineYMm = minBaseline;
    }
  }

  const verticalPadMm = 0.25;
  for (let i = 0; i < bands.length; i++) {
    for (let j = 0; j < i; j++) {
      const prev = bands[j];
      const curr = bands[i];
      const horizOverlap = Math.min(prev.maxXMm, curr.maxXMm) - Math.max(prev.minXMm, curr.minXMm);
      if (horizOverlap > -0.2) {
        const minBaselineDiff = Math.max(prev.maxFontHeightMm, curr.maxFontHeightMm) + verticalPadMm;
        if (curr.baselineYMm < prev.baselineYMm + minBaselineDiff) {
          curr.baselineYMm = prev.baselineYMm + minBaselineDiff;
        }
      }
    }
  }

  const maxBandBottom =
    bands.length > 0 ? Math.max(...bands.map((b) => b.baselineYMm + b.maxFontHeightMm * 0.22)) : 0;
  if (maxBandBottom > maxYMm && bands.length > 0) {
    const firstTop = Math.min(...bands.map((b) => b.baselineYMm - b.maxFontHeightMm));
    const currentSpan = maxBandBottom - firstTop;
    const targetSpan = maxYMm - minYMm;
    if (currentSpan > 0 && targetSpan > 0) {
      const vScale = Math.min(1, (targetSpan / currentSpan) * 0.97);
      for (const band of bands) {
        band.baselineYMm =
          minYMm + band.maxFontHeightMm + (band.baselineYMm - firstTop - band.maxFontHeightMm) * vScale;
        for (const r of band.runs) {
          r.fontSizePt = Math.max(4.5, Number((r.fontSizePt * vScale).toFixed(2)));
        }
        layoutHorizontalRowRuns(band.runs);
        band.minXMm = Math.min(...band.runs.map((r) => r.xMm));
        band.maxXMm = Math.max(...band.runs.map((r) => r.xMm + r.widthMm));
        band.maxFontHeightMm = Math.max(...band.runs.map((r) => r.fontHeightMm));
      }
      for (let i = 0; i < bands.length; i++) {
        for (let j = 0; j < i; j++) {
          const prev = bands[j];
          const curr = bands[i];
          const horizOverlap = Math.min(prev.maxXMm, curr.maxXMm) - Math.max(prev.minXMm, curr.minXMm);
          if (horizOverlap > -0.2) {
            const minDiff = Math.max(prev.maxFontHeightMm, curr.maxFontHeightMm) + 0.15;
            if (curr.baselineYMm < prev.baselineYMm + minDiff) {
              curr.baselineYMm = prev.baselineYMm + minDiff;
            }
          }
        }
      }
    }
  }

  // Apply final band baselineYMm back to runs and draw each run into the PDF
  for (const band of bands) {
    for (const run of band.runs) {
      run.baselineYMm = Math.min(
        maxYMm - run.fontHeightMm * 0.22,
        Math.max(minYMm + run.fontHeightMm, band.baselineYMm)
      );
      // Final right-margin safety clamp for single or trailing runs
      if (run.xMm + run.widthMm > maxXMm) {
        run.xMm = Math.max(minXMm, maxXMm - run.widthMm);
      }

      pdf.setFont(run.pdfFont, run.pdfFontStyle);
      pdf.setFontSize(run.fontSizePt);
      pdf.setTextColor(run.color[0], run.color[1], run.color[2]);

      pdf.text(run.text, run.xMm, run.baselineYMm);

      if (run.isUnderline) {
        pdf.setDrawColor(run.color[0], run.color[1], run.color[2]);
        pdf.setLineWidth(0.18);
        const underlineY = run.baselineYMm + 0.55;
        pdf.line(run.xMm, underlineY, run.xMm + run.widthMm, underlineY);
      }
    }
  }
}

/**
 * Build the complete jsPDF document for the given resume and DOM container.
 */
export async function buildResumeJsPdf(
  element: HTMLElement | null,
  resume: ResumeData
): Promise<jsPDF | null> {
  await ensureFontsReady();
  const { jsPDF } = await import('jspdf');

  const pageSize = getPageSizeConfig(resume.settings.pageSize);
  const effectiveSpacing =
    resume.settings.templateId === 'compact' ? 'compact' : resume.settings.spacing;
  const fallbackMarginPx = getEffectiveMarginPx(
    resume.settings.margins,
    effectiveSpacing,
    pageSize.scaleFactor
  );

  const pages = getExportPageElements(element);
  if (pages.length === 0) return null;

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [pageSize.widthMm, pageSize.heightMm],
    compress: true,
  });

  pages.forEach((pageEl, idx) => {
    if (idx > 0) {
      pdf.addPage([pageSize.widthMm, pageSize.heightMm], 'portrait');
    }
    renderDomPageToVectorPdf(
      pdf,
      pageEl,
      pageSize.widthMm,
      pageSize.heightMm,
      pageSize.widthPx,
      pageSize.heightPx,
      fallbackMarginPx
    );
  });

  return pdf;
}

/**
 * Generate raw PDF bytes (Uint8Array) for automated verification or programmatic download
 */
export async function generateResumePdfBytes(
  element: HTMLElement | null,
  resume: ResumeData
): Promise<Uint8Array> {
  const pdf = await buildResumeJsPdf(element, resume);
  if (!pdf) return new Uint8Array(0);
  const arrayBuffer = pdf.output('arraybuffer');
  return new Uint8Array(arrayBuffer);
}

/**
 * Export resume as a vector, selectable-text PDF matching the selected page size
 * across all pages with zero overlapping lines and solid contrast.
 */
export async function exportToPDF(element: HTMLElement | null, resume: ResumeData): Promise<void> {
  const pdf = await buildResumeJsPdf(element, resume);
  if (!pdf) return;
  pdf.save(getResumeFileName(resume, 'pdf'));
}

/**
 * Capture all pages into a single high-res canvas (2x-3x scale with image smoothing) for PNG/JPG export
 */
async function captureAllPagesCanvas(
  element: HTMLElement | null,
  resume: ResumeData,
  scale = 3
): Promise<HTMLCanvasElement> {
  await ensureFontsReady();
  const pageSize = getPageSizeConfig(resume.settings.pageSize);
  const pages = getExportPageElements(element);

  if (pages.length === 0 && element) {
    return capturePageCanvas(element, scale, pageSize.widthPx, pageSize.heightPx);
  }

  const pageCanvases: HTMLCanvasElement[] = [];
  for (const pageEl of pages) {
    const c = await capturePageCanvas(pageEl, scale, pageSize.widthPx, pageSize.heightPx);
    pageCanvases.push(c);
  }

  if (pageCanvases.length === 1) {
    return pageCanvases[0];
  }

  const singleW = pageCanvases[0].width;
  const singleH = pageCanvases[0].height;
  const combined = document.createElement('canvas');
  combined.width = singleW;
  combined.height = singleH * pageCanvases.length;

  const ctx = combined.getContext('2d');
  if (ctx) {
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, combined.width, combined.height);

    pageCanvases.forEach((pc, idx) => {
      ctx.drawImage(pc, 0, idx * singleH);
      if (idx > 0) {
        ctx.strokeStyle = '#CBD5E1';
        ctx.lineWidth = Math.max(1, scale);
        ctx.beginPath();
        ctx.moveTo(0, idx * singleH);
        ctx.lineTo(singleW, idx * singleH);
        ctx.stroke();
      }
    });
  }

  return combined;
}

/**
 * Export resume as high-res PNG (2x-3x scale with image smoothing)
 */
export async function exportToPNG(element: HTMLElement | null, resume: ResumeData, scale = 3): Promise<void> {
  const canvas = await captureAllPagesCanvas(element, resume, scale);
  const dataUrl = canvas.toDataURL('image/png', 1.0);
  const link = document.createElement('a');
  link.download = getResumeFileName(resume, 'png');
  link.href = dataUrl;
  link.click();
}

/**
 * Export resume as high-res JPG (2x-3x scale with image smoothing)
 */
export async function exportToJPG(
  element: HTMLElement | null,
  resume: ResumeData,
  quality = 0.95,
  scale = 3
): Promise<void> {
  const canvas = await captureAllPagesCanvas(element, resume, scale);
  const dataUrl = canvas.toDataURL('image/jpeg', quality);
  const link = document.createElement('a');
  link.download = getResumeFileName(resume, 'jpg');
  link.href = dataUrl;
  link.click();
}

/**
 * Print resume using browser's print dialog with dynamic @page size matching selected page size
 */
export function printResume(resume?: ResumeData): void {
  if (typeof document !== 'undefined' && resume) {
    const pageSize = getPageSizeConfig(resume.settings.pageSize);
    let styleEl = document.getElementById('dynamic-print-page-size') as HTMLStyleElement | null;
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'dynamic-print-page-size';
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = `@media print { @page { size: ${pageSize.widthMm}mm ${pageSize.heightMm}mm; margin: 0; } }`;
  }
  window.print();
}

/**
 * Generate formatted plain text of the entire resume for ATS direct paste
 */
export function generatePlainText(resume: ResumeData): string {
  const p = resume.personalInfo;
  const lines: string[] = [];

  lines.push((p.fullName || 'RESUME').toUpperCase());
  if (p.jobTitle) lines.push(p.jobTitle);
  const contacts: string[] = [];
  if (p.email) contacts.push(p.email);
  if (p.phone) contacts.push(p.phone);
  if (p.location) contacts.push(p.location);
  if (p.linkedin) contacts.push(p.linkedin);
  if (p.github) contacts.push(p.github);
  if (p.website) contacts.push(p.website);
  if (contacts.length > 0) lines.push(contacts.join(' | '));
  lines.push('');

  if (p.summary && resume.sectionVisibility.summary) {
    lines.push('PROFESSIONAL SUMMARY');
    lines.push('---------------------');
    lines.push(p.summary);
    lines.push('');
  }

  if (resume.experience.length > 0 && resume.sectionVisibility.experience) {
    lines.push('WORK EXPERIENCE');
    lines.push('---------------');
    resume.experience.forEach((exp) => {
      const dates = `${exp.startDate} – ${exp.current ? 'Present' : exp.endDate}`;
      lines.push(`${exp.title} — ${exp.company} (${exp.location}) ${dates}`);
      if (exp.description) lines.push(exp.description);
      if (exp.highlights && exp.highlights.length > 0) {
        exp.highlights.forEach((h) => lines.push(`• ${h}`));
      }
      lines.push('');
    });
  }

  if (resume.skills.length > 0 && resume.sectionVisibility.skills) {
    lines.push('SKILLS');
    lines.push('------');
    resume.skills.forEach((cat) => {
      lines.push(`${cat.category}: ${cat.skills.join(', ')}`);
    });
    lines.push('');
  }

  if (resume.projects.length > 0 && resume.sectionVisibility.projects) {
    lines.push('KEY PROJECTS');
    lines.push('------------');
    resume.projects.forEach((proj) => {
      lines.push(`${proj.title} ${proj.subtitle ? `— ${proj.subtitle}` : ''}`);
      if (proj.technologies?.length > 0) {
        lines.push(`Technologies: ${proj.technologies.join(', ')}`);
      }
      if (proj.link || proj.github) {
        lines.push(`Link: ${proj.link || proj.github}`);
      }
      if (proj.description) lines.push(proj.description);
      if (proj.highlights?.length > 0) {
        proj.highlights.forEach((h) => lines.push(`• ${h}`));
      }
      lines.push('');
    });
  }

  if (resume.education.length > 0 && resume.sectionVisibility.education) {
    lines.push('EDUCATION');
    lines.push('---------');
    resume.education.forEach((edu) => {
      lines.push(`${edu.degree} in ${edu.fieldOfStudy}`);
      lines.push(`${edu.institution} (${edu.startDate} – ${edu.current ? 'Present' : edu.endDate})${edu.gpa ? ` • GPA: ${edu.gpa}` : ''}`);
      if (edu.honors) lines.push(`Honors: ${edu.honors}`);
      lines.push('');
    });
  }

  if (resume.certifications.length > 0 && resume.sectionVisibility.certifications) {
    lines.push('CERTIFICATIONS');
    lines.push('--------------');
    resume.certifications.forEach((c) => {
      lines.push(`${c.name} — ${c.issuer} (${c.issueDate})`);
    });
    lines.push('');
  }

  if (resume.languages.length > 0 && resume.sectionVisibility.languages) {
    lines.push('LANGUAGES');
    lines.push('---------');
    lines.push(resume.languages.map((l) => `${l.language} (${l.proficiency})`).join(', '));
    lines.push('');
  }

  if (resume.achievements.length > 0 && resume.sectionVisibility.achievements) {
    lines.push('HONORS & AWARDS');
    lines.push('---------------');
    resume.achievements.forEach((a) => {
      lines.push(`${a.title} ${a.date ? `(${a.date})` : ''}: ${a.description}`);
    });
    lines.push('');
  }

  if (resume.customSections.length > 0 && resume.sectionVisibility.custom) {
    resume.customSections.forEach((cSec) => {
      lines.push(cSec.sectionTitle.toUpperCase());
      lines.push('-------------------------');
      cSec.items.forEach((item) => {
        lines.push(`${item.title} ${item.subtitle ? `— ${item.subtitle}` : ''} ${item.date ? `(${item.date})` : ''}`);
        if (item.description) lines.push(item.description);
      });
      lines.push('');
    });
  }

  return lines.join('\n');
}

/**
 * Copy plain text to clipboard
 */
export async function copyPlainTextToClipboard(resume: ResumeData): Promise<boolean> {
  try {
    const text = generatePlainText(resume);
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy to clipboard', err);
    return false;
  }
}
