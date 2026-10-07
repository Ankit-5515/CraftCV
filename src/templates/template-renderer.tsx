'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ResumeData } from '@/types/resume';
import { getTemplateById } from './index';
import { getPageSizeConfig } from '@/lib/page-sizes';
import { getEffectiveMarginPx } from './template-helper';

export interface PageSlice {
  pageNumber: number;
  startY: number;
  endY: number;
  topInsetPx: number;
}

interface TemplateRendererProps {
  resume: ResumeData;
  onSelectSection?: (section: string) => void;
  /** If provided, only renders this 1-indexed page number (used in single-page modal view) */
  activePage?: number;
  /** Callback fired whenever the computed page count or slices change */
  onPageCountChange?: (count: number, slices: PageSlice[]) => void;
  /** Marks the rendered pages as export targets for PDF/PNG/JPG */
  isExportTarget?: boolean;
}

export const TemplateRenderer: React.FC<TemplateRendererProps> = ({
  resume,
  onSelectSection,
  activePage,
  onPageCountChange,
  isExportTarget = false,
}) => {
  const currentTemplate = getTemplateById(resume.settings.templateId);
  const Component = currentTemplate.component;
  const pageSize = getPageSizeConfig(resume.settings.pageSize);
  const effectiveSpacing =
    resume.settings.templateId === 'compact' ? 'compact' : resume.settings.spacing;
  const marginPx = getEffectiveMarginPx(
    resume.settings.margins,
    effectiveSpacing,
    pageSize.scaleFactor
  );

  const measureRef = useRef<HTMLDivElement>(null);
  const [slices, setSlices] = useState<PageSlice[]>([
    { pageNumber: 1, startY: 0, endY: pageSize.heightPx, topInsetPx: 0 },
  ]);

  const computePageSlices = useCallback(() => {
    const container = measureRef.current;
    if (!container) return;

    const pageEl = container.querySelector('[data-resume-canvas="true"]') as HTMLElement | null;
    if (!pageEl) return;

    const pageH = pageSize.heightPx;
    const containerRect = pageEl.getBoundingClientRect();
    const scaleRatio = containerRect.width > 0 ? containerRect.width / pageSize.widthPx : 1;

    // Measure atomic content elements and entry blocks
    const rawNodes = Array.from(
      pageEl.querySelectorAll(
        'h1, h2, h3, h4, p, li, img, [data-entry-row="true"], [data-entry-subrow="true"], [data-skill-row="true"], [data-contact-line="true"], .page-break-avoid'
      )
    ) as HTMLElement[];

    interface BoxInterval {
      top: number;
      bottom: number;
      isHeading: boolean;
      isAtomicLine: boolean;
    }

    const boxes: BoxInterval[] = rawNodes
      .map((node) => {
        const r = node.getBoundingClientRect();
        const top = (r.top - containerRect.top) / scaleRatio;
        const bottom = (r.bottom - containerRect.top) / scaleRatio;
        const tag = node.tagName.toLowerCase();
        const isHeading = tag === 'h1' || tag === 'h2' || tag === 'h3' || tag === 'h4';
        const isAtomicLine =
          isHeading ||
          tag === 'p' ||
          tag === 'li' ||
          node.hasAttribute('data-entry-row') ||
          node.hasAttribute('data-entry-subrow') ||
          node.hasAttribute('data-skill-row') ||
          node.hasAttribute('data-contact-line');
        return {
          top,
          bottom,
          isHeading,
          isAtomicLine,
        };
      })
      .filter((b) => b.bottom - b.top > 2 && b.bottom - b.top < pageH * 0.65)
      .sort((a, b) => a.top - b.top);

    const maxContentBottom =
      boxes.length > 0
        ? Math.max(...boxes.map((b) => b.bottom))
        : pageEl.scrollHeight;

    // If all content fits inside Page 1's bottom margin
    if (maxContentBottom <= pageH - marginPx + 4) {
      const single: PageSlice[] = [
        { pageNumber: 1, startY: 0, endY: pageH - marginPx, topInsetPx: 0 },
      ];
      setSlices(single);
      onPageCountChange?.(1, single);
      return;
    }

    const computedSlices: PageSlice[] = [];
    let currentStartY = 0;
    let pageNum = 1;

    while (currentStartY < maxContentBottom - 8 && pageNum <= 12) {
      const topInset = pageNum === 1 ? 0 : marginPx;
      const bottomReserve = marginPx;
      const usableHeight = pageH - topInset - bottomReserve;
      const targetEndY = currentStartY + usableHeight;

      if (targetEndY >= maxContentBottom - 4) {
        computedSlices.push({
          pageNumber: pageNum,
          startY: currentStartY,
          endY: Math.min(maxContentBottom + 4, currentStartY + usableHeight),
          topInsetPx: topInset,
        });
        break;
      }

      // 1. Avoid cutting through any entry (.page-break-avoid) or atomic line box
      let safeEndY = targetEndY;
      for (const box of boxes) {
        if (box.top > currentStartY + 32 && box.top < safeEndY && box.bottom > safeEndY) {
          safeEndY = Math.min(safeEndY, Math.floor(box.top) - 4);
        }
      }

      // Verify no atomic line is still straddling safeEndY
      for (const box of boxes) {
        if (
          box.isAtomicLine &&
          box.top > currentStartY + 16 &&
          box.top < safeEndY &&
          box.bottom > safeEndY - 2
        ) {
          safeEndY = Math.min(safeEndY, Math.floor(box.top) - 3);
        }
      }

      // 2. Avoid stranding a section heading at the bottom of the page (break-after: avoid)
      for (const box of boxes) {
        if (
          box.isHeading &&
          box.top > currentStartY + 32 &&
          box.bottom <= safeEndY &&
          safeEndY - box.top < Math.round(85 * pageSize.scaleFactor)
        ) {
          safeEndY = Math.min(safeEndY, Math.floor(box.top) - 6);
        }
      }

      // Guard against zero-progress on extremely tall entries
      if (safeEndY <= currentStartY + 80) {
        safeEndY = targetEndY;
        for (const box of boxes) {
          if (
            box.isAtomicLine &&
            box.top > currentStartY + 24 &&
            box.top < safeEndY &&
            box.bottom > safeEndY
          ) {
            safeEndY = Math.min(safeEndY, Math.floor(box.top) - 2);
          }
        }
      }

      computedSlices.push({
        pageNumber: pageNum,
        startY: currentStartY,
        endY: safeEndY,
        topInsetPx: topInset,
      });

      currentStartY = safeEndY;
      pageNum += 1;
    }

    if (computedSlices.length === 0) {
      computedSlices.push({
        pageNumber: 1,
        startY: 0,
        endY: pageH - marginPx,
        topInsetPx: 0,
      });
    }

    setSlices(computedSlices);
    onPageCountChange?.(computedSlices.length, computedSlices);
  }, [pageSize.heightPx, pageSize.widthPx, pageSize.scaleFactor, marginPx, onPageCountChange]);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (typeof document !== 'undefined' && 'fonts' in document) {
        try {
          await document.fonts.ready;
        } catch {
          // ignore
        }
      }
      if (!cancelled) {
        computePageSlices();
      }
    };
    const timer = requestAnimationFrame(() => {
      run();
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(timer);
    };
  }, [resume, computePageSlices]);

  const cssVars = {
    '--page-width': `${pageSize.widthPx}px`,
    '--page-height': `${pageSize.heightPx}px`,
    '--page-scale': String(pageSize.scaleFactor),
  } as React.CSSProperties;

  const visibleSlices = activePage
    ? slices.filter((s) => s.pageNumber === activePage)
    : slices;

  return (
    <div className="relative flex flex-col items-center" style={cssVars}>
      {/* Hidden measurement container at true 1:1 width to compute clean multi-page breaks */}
      <div
        ref={measureRef}
        aria-hidden="true"
        className="pointer-events-none fixed -left-[99999px] top-0 opacity-0 overflow-visible"
        style={{
          ...cssVars,
          width: `${pageSize.widthPx}px`,
        }}
      >
        <Component resume={resume} />
      </div>

      {/* Rendered Page Sheets */}
      <div className="flex flex-col items-center gap-6">
        {visibleSlices.map((slice) => {
          const sliceHeight = slice.endY - slice.startY;
          return (
            <div
              key={slice.pageNumber}
              data-export-page={isExportTarget ? String(slice.pageNumber) : undefined}
              data-page-number={slice.pageNumber}
              data-slice-start={slice.startY}
              data-slice-end={slice.endY}
              data-top-inset={slice.topInsetPx}
              data-margin-px={marginPx}
              className="relative bg-[#FFFFFF] text-[#111827] overflow-hidden"
              style={{
                ...cssVars,
                width: `${pageSize.widthPx}px`,
                height: `${pageSize.heightPx}px`,
                boxSizing: 'border-box',
                boxShadow: isExportTarget
                  ? 'none'
                  : '0 2px 10px rgba(15, 23, 42, 0.12), 0 0 0 1px rgba(15, 23, 42, 0.08)',
              }}
            >
              {/* Top margin spacer on page 2+ */}
              {slice.topInsetPx > 0 && (
                <div
                  style={{
                    height: `${slice.topInsetPx}px`,
                    width: '100%',
                    backgroundColor: '#FFFFFF',
                  }}
                />
              )}

              {/* Clipped viewport for this page's vertical slice */}
              <div
                data-page-viewport="true"
                style={{
                  width: `${pageSize.widthPx}px`,
                  height: `${Math.min(
                    sliceHeight,
                    pageSize.heightPx - slice.topInsetPx - marginPx
                  )}px`,
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    marginTop: `-${slice.startY}px`,
                    width: `${pageSize.widthPx}px`,
                  }}
                >
                  <Component resume={resume} onSelectSection={onSelectSection} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
