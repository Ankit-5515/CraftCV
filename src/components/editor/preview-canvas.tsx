'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useResumeStore } from '@/store/resume-store';
import { TemplateRenderer } from '@/templates/template-renderer';
import { getPageSizeConfig } from '@/lib/page-sizes';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { SectionKey } from '@/types/resume';

export const PreviewCanvas: React.FC = () => {
  const { resume, setActiveSection } = useResumeStore();
  const pageSize = getPageSizeConfig(resume.settings.pageSize);
  const [scale, setScale] = useState<number>(0.8);
  const [pageCount, setPageCount] = useState<number>(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const fitCanvasToWidth = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const availableW = container.clientWidth - 48;
    if (availableW > 200) {
      const targetScale = Math.min(1.1, Math.max(0.32, Number((availableW / pageSize.widthPx).toFixed(2))));
      setScale(targetScale);
    }
  }, [pageSize.widthPx]);

  useEffect(() => {
    fitCanvasToWidth();
  }, [pageSize.id, fitCanvasToWidth]);

  const handleZoomIn = () => setScale((s) => Math.min(1.5, Number((s + 0.1).toFixed(2))));
  const handleZoomOut = () => setScale((s) => Math.max(0.3, Number((s - 0.1).toFixed(2))));

  const handleSelectSection = (section: string) => {
    setActiveSection(section as SectionKey);
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-[var(--canvas-bg)] overflow-hidden select-none transition-colors duration-150">
      {/* Top Preview Info & Zoom Bar */}
      <div className="border-b border-[var(--border)] bg-[var(--surface)] px-4 py-2 flex items-center justify-between gap-2 text-xs z-20">
        <div className="flex items-center gap-2 text-[var(--text-muted)]">
          <span className="font-semibold text-[var(--text)]">Live Preview</span>
          <span>•</span>
          <span>
            {pageSize.shortLabel} ({pageSize.dimensionsLabel})
          </span>
          <span>•</span>
          <span className="font-medium text-[var(--text)]">
            {pageCount} {pageCount === 1 ? 'page' : 'pages'}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleZoomOut}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[var(--surface-muted)] border border-[var(--border)] text-[var(--text)] hover:border-[var(--accent)] transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-xs font-mono font-semibold text-[var(--text)] px-1.5 min-w-[44px] text-center">
            {Math.round(scale * 100)}%
          </span>
          <button
            type="button"
            onClick={handleZoomIn}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[var(--surface-muted)] border border-[var(--border)] text-[var(--text)] hover:border-[var(--accent)] transition-colors cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={fitCanvasToWidth}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[var(--surface-muted)] border border-[var(--border)] text-[var(--text)] hover:border-[var(--accent)] transition-colors cursor-pointer"
            title="Fit paper to width"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Fit</span>
          </button>
        </div>
      </div>

      {/* Canvas Scrollable Workspace */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto p-4 sm:p-8 flex justify-center items-start custom-scrollbar"
      >
        <div
          id="resume-preview-document"
          className="transition-transform duration-150 origin-top my-2"
          style={{
            transform: `scale(${scale})`,
            marginBottom: `${Math.max(0, (scale - 1) * pageSize.heightPx * pageCount + 32)}px`,
          }}
        >
          <TemplateRenderer
            resume={resume}
            onSelectSection={handleSelectSection}
            onPageCountChange={(count) => setPageCount(count)}
          />
        </div>
      </div>
    </div>
  );
};
