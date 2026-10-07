'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useResumeStore } from '@/store/resume-store';
import { EditorHeader } from '@/components/editor/editor-header';
import { TemplateCustomizer } from '@/components/editor/template-customizer';
import { FormPanel } from '@/components/editor/form-panel';
import { PreviewCanvas } from '@/components/editor/preview-canvas';
import { ATSScoreModal } from '@/components/editor/ats-score-modal';
import { ExportModal } from '@/components/editor/export-modal';
import { TemplateRenderer } from '@/templates/template-renderer';
import { getPageSizeConfig } from '@/lib/page-sizes';
import { getEffectiveMarginPx } from '@/templates/template-helper';
import { generateResumePdfBytes, capturePageCanvas } from '@/lib/export';
import { PageSizeId, ResumeData, TemplateId } from '@/types/resume';

export default function EditorPage() {
  const { resume, setResume, activeMobileTab, undo, redo, canUndo, canRedo } = useResumeStore();
  const [isATSOpen, setIsATSOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const exportRootRef = useRef<HTMLDivElement>(null);

  const pageSize = getPageSizeConfig(resume.settings.pageSize);

  // Global keyboard shortcuts (Ctrl+Z, Ctrl+Y)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        if (e.shiftKey) {
          if (canRedo()) redo();
        } else {
          if (canUndo()) undo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        if (canRedo()) redo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, canUndo, canRedo]);

  // Expose deterministic test harness for automated Playwright PDF & PNG verification
  useEffect(() => {
    const win = window as unknown as Record<string, unknown>;
    win.__CRAFTCV_TEST__ = {
      renderAndExport: async (
        fixtureData: ResumeData,
        templateId: TemplateId,
        pageSizeId: PageSizeId,
        capturePngScale = 1.5
      ) => {
        const nextResume: ResumeData = {
          ...fixtureData,
          settings: {
            ...fixtureData.settings,
            templateId,
            pageSize: pageSizeId,
          },
        };
        setResume(nextResume);

        // Wait for React state flush, font readiness, and TemplateRenderer slice calculation
        if ('fonts' in document) {
          await document.fonts.ready;
        }
        await new Promise((r) => setTimeout(r, 120));
        await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
        await new Promise((r) => setTimeout(r, 80));

        const rootEl = exportRootRef.current;
        const sizeCfg = getPageSizeConfig(pageSizeId);
        const effectiveSpacing =
          templateId === 'compact' ? 'compact' : nextResume.settings.spacing;
        const marginPx = getEffectiveMarginPx(
          nextResume.settings.margins,
          effectiveSpacing,
          sizeCfg.scaleFactor
        );

        const pdfBytes = await generateResumePdfBytes(rootEl, nextResume);

        const pageEls = rootEl
          ? (Array.from(rootEl.querySelectorAll('[data-export-page]')) as HTMLElement[])
          : [];

        const pagePngDataUrls: string[] = [];
        for (const pageEl of pageEls) {
          const canvas = await capturePageCanvas(
            pageEl,
            capturePngScale,
            sizeCfg.widthPx,
            sizeCfg.heightPx
          );
          pagePngDataUrls.push(canvas.toDataURL('image/png'));
        }

        return {
          pdfBytes: Array.from(pdfBytes),
          pageCount: pageEls.length,
          widthMm: sizeCfg.widthMm,
          heightMm: sizeCfg.heightMm,
          widthPx: sizeCfg.widthPx,
          heightPx: sizeCfg.heightPx,
          scaleFactor: sizeCfg.scaleFactor,
          marginPx,
          pagePngDataUrls,
        };
      },
    };
  }, [setResume]);

  return (
    <div className="flex flex-col h-screen w-screen bg-[var(--bg)] text-[var(--text)] overflow-hidden transition-colors duration-150">
      {/* Editor Top Navigation Header */}
      <EditorHeader
        onOpenATS={() => setIsATSOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
      />

      {/* Page Size, Margins, Template & Typography Toolbar */}
      <TemplateCustomizer />

      {/* Main Studio Split Workspace */}
      <main className="flex-1 flex overflow-hidden relative">
        {/* Left: Form Panel (Desktop visible, or on mobile when 'edit' tab active) */}
        <div
          className={`h-full w-full md:w-[45%] lg:w-[42%] xl:w-[40%] shrink-0 flex flex-col z-10 ${
            activeMobileTab === 'edit' ? 'block' : 'hidden md:flex'
          }`}
        >
          <FormPanel />
        </div>

        {/* Right: Live Page-Size Preview Canvas (Desktop visible, or on mobile when 'preview' tab active) */}
        <div
          className={`h-full flex-1 overflow-hidden ${
            activeMobileTab === 'preview' ? 'block' : 'hidden md:block'
          }`}
        >
          <PreviewCanvas />
        </div>
      </main>

      {/* Modals */}
      <ATSScoreModal
        isOpen={isATSOpen}
        onClose={() => setIsATSOpen(false)}
      />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />

      {/* Dedicated Hidden Untransformed 1:1 Export Container (renders ALL pages at true pixel size) */}
      <div
        ref={exportRootRef}
        data-resume-export-root="true"
        aria-hidden="true"
        className="pointer-events-none fixed -left-[99999px] top-0 opacity-0 overflow-visible"
        style={{
          transform: 'none',
          width: `${pageSize.widthPx}px`,
        }}
      >
        <TemplateRenderer
          resume={resume}
          isExportTarget={true}
        />
      </div>
    </div>
  );
}
