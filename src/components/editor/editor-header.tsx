'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useResumeStore } from '@/store/resume-store';
import { TEMPLATES } from '@/templates';
import { analyzeResumeATS } from '@/lib/ats';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import {
  FileText,
  Undo2,
  Redo2,
  Download,
  LayoutGrid,
  CheckCircle2,
  Eye,
  Edit3,
  ChevronDown,
  BarChart3,
} from 'lucide-react';

interface EditorHeaderProps {
  onOpenATS: () => void;
  onOpenExport: () => void;
}

export const EditorHeader: React.FC<EditorHeaderProps> = ({ onOpenATS, onOpenExport }) => {
  const {
    resume,
    renameResume,
    undo,
    redo,
    canUndo,
    canRedo,
    loadSampleData,
    clearResume,
    activeMobileTab,
    setActiveMobileTab,
    updateSettings,
    jobDescriptionText,
  } = useResumeStore();

  const [isTemplateMenuOpen, setIsTemplateMenuOpen] = useState(false);

  const analysis = useMemo(() => {
    return analyzeResumeATS(resume, jobDescriptionText);
  }, [resume, jobDescriptionText]);

  const score = analysis.overallScore;
  const scoreColor =
    score >= 80
      ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
      : score >= 60
      ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700'
      : 'bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-700';

  const currentTemplate = TEMPLATES.find((t) => t.id === resume.settings.templateId) || TEMPLATES[0];

  return (
    <header className="min-h-16 border-b border-[var(--border)] bg-[var(--surface)] px-4 py-2 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-30 transition-colors duration-150">
      {/* Left: Brand, Resume Title & Step Indicator */}
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center text-white">
            <FileText className="w-4 h-4" />
          </div>
          <span className="font-bold text-base text-[var(--text)] hidden sm:inline">
            CraftCV
          </span>
        </Link>

        <div className="h-4 w-[1px] bg-[var(--border)] hidden sm:block" />

        {/* Inline editable resume title */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={resume.title}
            onChange={(e) => renameResume(resume.id, e.target.value)}
            aria-label="Resume title"
            className="bg-[var(--surface-muted)] hover:border-[var(--border)] focus:bg-[var(--surface)] border border-transparent focus:border-[var(--accent)] rounded-md px-2.5 py-1 text-sm font-semibold text-[var(--text)] focus:outline-none max-w-[150px] sm:max-w-[200px] truncate"
            title="Click to rename resume"
          />
          <span className="hidden xl:inline-flex items-center gap-1 text-xs text-emerald-700 dark:text-emerald-400 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" /> Saved
          </span>
        </div>

        {/* 4-Step Workflow Indicator */}
        <nav
          aria-label="Resume building steps"
          className="hidden 2xl:flex items-center gap-1.5 ml-2 px-3 py-1 rounded-lg bg-[var(--surface-muted)] border border-[var(--border)] text-xs"
        >
          <Link
            href="/templates"
            className="text-[var(--text-muted)] hover:text-[var(--text)] font-medium transition-colors"
          >
            1. Choose template
          </Link>
          <span className="text-[var(--text-muted)]">→</span>
          <span className="font-bold text-[var(--accent)]">
            2. Add details
          </span>
          <span className="text-[var(--text-muted)]">→</span>
          <button
            type="button"
            onClick={onOpenExport}
            className="text-[var(--text-muted)] hover:text-[var(--text)] font-medium transition-colors cursor-pointer"
          >
            3. Preview
          </button>
          <span className="text-[var(--text-muted)]">→</span>
          <button
            type="button"
            onClick={onOpenExport}
            className="text-[var(--text-muted)] hover:text-[var(--text)] font-medium transition-colors cursor-pointer"
          >
            4. Download
          </button>
        </nav>
      </div>

      {/* Middle: Undo / Redo & Sample Data (with clear text labels) */}
      <div className="hidden md:flex items-center gap-1.5">
        <button
          type="button"
          disabled={!canUndo()}
          onClick={() => undo()}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium text-[var(--text)] bg-[var(--surface-muted)] border border-[var(--border)] hover:border-[var(--accent)] disabled:opacity-40 cursor-pointer transition-colors"
          title="Undo (Ctrl+Z)"
        >
          <Undo2 className="w-3.5 h-3.5" />
          <span>Undo</span>
        </button>
        <button
          type="button"
          disabled={!canRedo()}
          onClick={() => redo()}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium text-[var(--text)] bg-[var(--surface-muted)] border border-[var(--border)] hover:border-[var(--accent)] disabled:opacity-40 cursor-pointer transition-colors"
          title="Redo (Ctrl+Y)"
        >
          <Redo2 className="w-3.5 h-3.5" />
          <span>Redo</span>
        </button>

        <div className="h-4 w-[1px] bg-[var(--border)] mx-1" />

        <button
          type="button"
          onClick={loadSampleData}
          className="px-2.5 py-1.5 rounded-md text-xs font-medium text-[var(--text)] bg-[var(--surface-muted)] hover:border-[var(--accent)] border border-[var(--border)] transition-colors cursor-pointer"
        >
          Fill sample data
        </button>

        <button
          type="button"
          onClick={() => {
            if (confirm('Clear all resume details and start fresh?')) {
              clearResume();
            }
          }}
          className="px-2.5 py-1.5 rounded-md text-xs font-medium text-[var(--text-muted)] hover:text-rose-700 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
        >
          Reset
        </button>
      </div>

      {/* Mobile Tab Switcher */}
      <div className="flex md:hidden items-center bg-[var(--surface-muted)] rounded-lg p-0.5 border border-[var(--border)]">
        <button
          type="button"
          onClick={() => setActiveMobileTab('edit')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
            activeMobileTab === 'edit'
              ? 'bg-[var(--accent)] text-white'
              : 'text-[var(--text-muted)] hover:text-[var(--text)]'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" /> Edit
        </button>
        <button
          type="button"
          onClick={() => setActiveMobileTab('preview')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
            activeMobileTab === 'preview'
              ? 'bg-[var(--accent)] text-white'
              : 'text-[var(--text-muted)] hover:text-[var(--text)]'
          }`}
        >
          <Eye className="w-3.5 h-3.5" /> Preview
        </button>
      </div>

      {/* Right: Choose Template, ATS Score, Preview & Download CTA, and Theme Toggle */}
      <div className="flex items-center gap-2">
        {/* Template Selector */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsTemplateMenuOpen((prev) => !prev)}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--surface-muted)] hover:border-[var(--accent)] border border-[var(--border)] text-xs font-semibold text-[var(--text)] transition-colors cursor-pointer"
          >
            <LayoutGrid className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span className="truncate max-w-[130px]">Template: {currentTemplate.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-[var(--text-muted)]" />
          </button>

          {isTemplateMenuOpen && (
            <div
              className="absolute right-0 top-full mt-1.5 w-60 rounded-xl bg-[var(--surface)] border border-[var(--border)] p-1.5 shadow-lg z-50"
              onMouseLeave={() => setIsTemplateMenuOpen(false)}
            >
              <div className="px-2.5 py-1.5 text-xs font-bold text-[var(--text-muted)] border-b border-[var(--border)] mb-1">
                Choose a template
              </div>
              {TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => {
                    updateSettings({ templateId: tmpl.id, accentColor: tmpl.accentDefault });
                    setIsTemplateMenuOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                    resume.settings.templateId === tmpl.id
                      ? 'bg-[var(--accent)] text-white font-semibold'
                      : 'text-[var(--text)] hover:bg-[var(--surface-muted)]'
                  }`}
                >
                  <span>{tmpl.name}</span>
                  {tmpl.badge && (
                    <span className="text-[10px] opacity-85 font-medium">
                      {tmpl.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ATS Check Button */}
        <button
          type="button"
          onClick={onOpenATS}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-colors cursor-pointer ${scoreColor}`}
          title="Check ATS score and suggestions"
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>ATS Score: {score}/100</span>
        </button>

        {/* Primary CTA: Preview & Download */}
        <Button variant="primary" size="sm" onClick={onOpenExport}>
          <Download className="w-3.5 h-3.5" />
          <span>Download your resume</span>
        </Button>

        {/* Theme Mode Toggle */}
        <ThemeToggle />
      </div>
    </header>
  );
};
