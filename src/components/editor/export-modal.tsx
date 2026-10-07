'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useResumeStore } from '@/store/resume-store';
import { TemplateRenderer } from '@/templates/template-renderer';
import { getPageSizeConfig } from '@/lib/page-sizes';
import { Button } from '@/components/ui/button';
import {
  exportToPDF,
  exportToPNG,
  exportToJPG,
  printResume,
  copyPlainTextToClipboard,
  getResumeFileName,
} from '@/lib/export';
import {
  ArrowLeft,
  Download,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Printer,
  Copy,
  Check,
  FileText,
  Image as ImageIcon,
} from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export type ExportFormatChoice = 'pdf' | 'png' | 'jpg' | 'print';

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const { resume } = useResumeStore();
  const pageSize = getPageSizeConfig(resume.settings.pageSize);

  const [selectedFormat, setSelectedFormat] = useState<ExportFormatChoice>('pdf');
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoom, setZoom] = useState<number>(0.85);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [hasCopiedText, setHasCopiedText] = useState<boolean>(false);

  const viewportContainerRef = useRef<HTMLDivElement>(null);

  const handlePageCountChange = useCallback((count: number) => {
    setTotalPages(count);
    setCurrentPage((prev) => Math.min(prev, Math.max(1, count)));
  }, []);

  // Calculate Fit-to-Width zoom factor based on available viewport width and selected page widthPx
  const handleFitToWidth = useCallback(() => {
    const viewport = viewportContainerRef.current;
    if (!viewport) {
      setZoom(0.85);
      return;
    }
    const availableWidth = viewport.clientWidth - 64;
    const computedZoom = Math.min(1.25, Math.max(0.3, Number((availableWidth / pageSize.widthPx).toFixed(2))));
    setZoom(computedZoom);
  }, [pageSize.widthPx]);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setCurrentPage(1);
        handleFitToWidth();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen, pageSize.id, handleFitToWidth]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft' && currentPage > 1) {
        setCurrentPage((p) => p - 1);
      } else if (e.key === 'ArrowRight' && currentPage < totalPages) {
        setCurrentPage((p) => p + 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, currentPage, totalPages]);

  if (!isOpen) return null;

  const handleZoomIn = () => setZoom((z) => Math.min(1.6, Number((z + 0.1).toFixed(2))));
  const handleZoomOut = () => setZoom((z) => Math.max(0.3, Number((z - 0.1).toFixed(2))));

  const handleDownloadAction = async () => {
    if (selectedFormat === 'print') {
      printResume(resume);
      return;
    }

    const exportContainer = document.querySelector('[data-resume-export-root="true"]') as HTMLElement | null;
    try {
      setIsExporting(true);
      if (selectedFormat === 'pdf') {
        await exportToPDF(exportContainer, resume);
      } else if (selectedFormat === 'png') {
        await exportToPNG(exportContainer, resume, 3);
      } else if (selectedFormat === 'jpg') {
        await exportToJPG(exportContainer, resume, 0.95, 3);
      }
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyPlainText = async () => {
    const ok = await copyPlainTextToClipboard(resume);
    if (ok) {
      setHasCopiedText(true);
      setTimeout(() => setHasCopiedText(false), 2500);
    }
  };

  const formatLabels: Record<ExportFormatChoice, string> = {
    pdf: 'PDF (Selectable Text)',
    png: 'PNG (3x High-Res)',
    jpg: 'JPG (Compressed)',
    print: 'Print / Plain Text',
  };

  const fileExt = selectedFormat === 'print' ? 'pdf' : selectedFormat;
  const generatedFileName = getResumeFileName(resume, fileExt);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-[var(--bg)] text-[var(--text)]"
      role="dialog"
      aria-modal="true"
      aria-label="Preview and Download Resume"
    >
      {/* Top Action Header */}
      <header className="border-b border-[var(--border)] bg-[var(--surface)] px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Back to edit button + Title */}
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={onClose}
            aria-label="Back to edit"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to edit</span>
          </Button>

          <div className="hidden sm:block h-5 w-[1px] bg-[var(--border)]" />

          <div>
            <h2 className="text-sm sm:text-base font-bold text-[var(--text)]">
              Preview & Download your resume
            </h2>
            <p className="text-xs text-[var(--text-muted)]">
              File: <span className="font-mono font-medium text-[var(--text)]">{generatedFileName}</span>
            </p>
          </div>
        </div>

        {/* Center: Summary Badges (Page Size, Number of Pages, Chosen Format) */}
        <div className="hidden lg:flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-md bg-[var(--surface-muted)] border border-[var(--border)] font-medium text-[var(--text)]">
            Page size: <strong>{pageSize.shortLabel}</strong> ({pageSize.dimensionsLabel})
          </span>
          <span className="px-2.5 py-1 rounded-md bg-[var(--surface-muted)] border border-[var(--border)] font-medium text-[var(--text)]">
            Pages: <strong>{totalPages} {totalPages === 1 ? 'page' : 'pages'}</strong>
          </span>
          <span className="px-2.5 py-1 rounded-md bg-[var(--surface-muted)] border border-[var(--border)] font-medium text-[var(--text)]">
            Format: <strong>{formatLabels[selectedFormat]}</strong>
          </span>
        </div>

        {/* Right: Format Choice + Primary Download Button */}
        <div className="flex items-center gap-2 flex-wrap">
          <div
            className="inline-flex items-center rounded-lg bg-[var(--surface-muted)] p-1 border border-[var(--border)]"
            role="group"
            aria-label="Choose export format"
          >
            {(
              [
                { id: 'pdf', label: 'PDF', icon: FileText },
                { id: 'png', label: 'PNG', icon: ImageIcon },
                { id: 'jpg', label: 'JPG', icon: ImageIcon },
                { id: 'print', label: 'Print / Text', icon: Printer },
              ] as const
            ).map((fmt) => {
              const Icon = fmt.icon;
              const isSelected = selectedFormat === fmt.id;
              return (
                <button
                  key={fmt.id}
                  type="button"
                  onClick={() => setSelectedFormat(fmt.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[var(--accent)] text-white'
                      : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{fmt.label}</span>
                </button>
              );
            })}
          </div>

          {selectedFormat === 'print' && (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleCopyPlainText}
            >
              {hasCopiedText ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Copied plain text</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy plain text</span>
                </>
              )}
            </Button>
          )}

          <Button
            variant="primary"
            size="md"
            isLoading={isExporting}
            onClick={handleDownloadAction}
          >
            {selectedFormat === 'print' ? (
              <>
                <Printer className="w-4 h-4" />
                <span>Print resume</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download {selectedFormat.toUpperCase()}</span>
              </>
            )}
          </Button>
        </div>
      </header>

      {/* Secondary Toolbar: Page Navigation & Zoom Controls */}
      <div className="border-b border-[var(--border)] bg-[var(--surface-muted)] px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Mobile/Tablet Summary Info */}
        <div className="flex items-center gap-2 text-[var(--text-muted)] font-medium">
          <span>
            Size: <strong className="text-[var(--text)]">{pageSize.shortLabel} ({pageSize.widthMm}×{pageSize.heightMm}mm)</strong>
          </span>
          <span>•</span>
          <span>
            Total: <strong className="text-[var(--text)]">{totalPages} {totalPages === 1 ? 'page' : 'pages'}</strong>
          </span>
          <span>•</span>
          <span>
            Format: <strong className="text-[var(--text)]">{formatLabels[selectedFormat]}</strong>
          </span>
        </div>

        {/* Page-by-Page Navigation */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] disabled:opacity-40 hover:bg-[var(--surface-muted)] transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Previous page</span>
          </button>

          <span className="px-2.5 py-1 font-semibold text-[var(--text)]">
            Page {currentPage} of {totalPages}
          </span>

          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] disabled:opacity-40 hover:bg-[var(--surface-muted)] transition-colors cursor-pointer"
          >
            <span>Next page</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Zoom & Fit-to-Width Controls */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleZoomOut}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] hover:bg-[var(--surface-muted)] transition-colors cursor-pointer"
            title="Zoom out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Zoom out</span>
          </button>

          <span className="font-mono font-semibold text-[var(--text)] min-w-[46px] text-center">
            {Math.round(zoom * 100)}%
          </span>

          <button
            type="button"
            onClick={handleZoomIn}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] hover:bg-[var(--surface-muted)] transition-colors cursor-pointer"
            title="Zoom in"
          >
            <ZoomIn className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Zoom in</span>
          </button>

          <button
            type="button"
            onClick={handleFitToWidth}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] hover:bg-[var(--surface-muted)] transition-colors cursor-pointer ml-1"
            title="Fit paper to screen width"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Fit to width</span>
          </button>
        </div>
      </div>

      {/* Main Scrollable Paper Preview Area */}
      <div
        ref={viewportContainerRef}
        className="flex-1 overflow-auto p-6 sm:p-10 flex justify-center items-start bg-[var(--canvas-bg)]"
      >
        <div
          className="origin-top transition-transform duration-150"
          style={{
            transform: `scale(${zoom})`,
            marginBottom: `${Math.max(0, (zoom - 1) * pageSize.heightPx + 40)}px`,
          }}
        >
          <TemplateRenderer
            resume={resume}
            activePage={currentPage}
            onPageCountChange={handlePageCountChange}
          />
        </div>
      </div>
    </div>
  );
};
