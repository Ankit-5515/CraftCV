'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { TEMPLATES, TemplateDefinition } from '@/templates';
import { useResumeStore } from '@/store/resume-store';
import { Button } from '@/components/ui/button';
import { PAGE_SIZE_LIST, getPageSizeConfig } from '@/lib/page-sizes';
import { PageSizeId } from '@/types/resume';
import { ArrowRight, Maximize2, Info } from 'lucide-react';

export default function TemplatesPage() {
  const router = useRouter();
  const { resume, updateSettings } = useResumeStore();
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const currentPageSize = getPageSizeConfig(resume.settings.pageSize);
  const aspectRatio = currentPageSize.widthMm / currentPageSize.heightMm;

  const categories = ['All', 'Modern', 'Classic', 'Creative', 'ATS-Simple', 'Tech'];

  const filteredTemplates = activeFilter === 'All'
    ? TEMPLATES
    : TEMPLATES.filter((t) => t.category === activeFilter);

  const handleSelectTemplate = (template: TemplateDefinition) => {
    updateSettings({
      templateId: template.id,
      accentColor: template.accentDefault,
    });
    router.push('/editor');
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col transition-colors duration-150">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* 4-Step Progress Bar */}
        <div className="flex items-center justify-center mb-8">
          <div className="inline-flex flex-wrap items-center gap-2 px-4 py-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-xs">
            <span className="px-2 py-0.5 rounded bg-[var(--accent)] text-white font-semibold">
              1. Choose template
            </span>
            <span className="text-[var(--text-muted)]">→</span>
            <span className="text-[var(--text-muted)] font-medium">2. Add details</span>
            <span className="text-[var(--text-muted)]">→</span>
            <span className="text-[var(--text-muted)] font-medium">3. Preview</span>
            <span className="text-[var(--text-muted)]">→</span>
            <span className="text-[var(--text-muted)] font-medium">4. Download</span>
          </div>
        </div>

        {/* Gallery Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text)]">
            Choose a Resume Template
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
            All 8 templates use clean, selectable text and automatically scale to your chosen paper size ({currentPageSize.shortLabel} — {currentPageSize.dimensionsLabel}).
          </p>

          {/* Filter Pills & Page Size Selector */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${
                    activeFilter === cat
                      ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                      : 'bg-[var(--surface)] text-[var(--text-muted)] border-[var(--border)] hover:text-[var(--text)] hover:bg-[var(--surface-muted)]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 bg-[var(--surface)] border border-[var(--border)] rounded-lg px-2.5 py-1">
              <Maximize2 className="w-3.5 h-3.5 text-[var(--text-muted)]" />
              <label htmlFor="gallery-page-size" className="text-xs font-medium text-[var(--text-muted)]">
                Page size:
              </label>
              <select
                id="gallery-page-size"
                value={currentPageSize.id}
                onChange={(e) => updateSettings({ pageSize: e.target.value as PageSizeId })}
                className="bg-transparent text-xs font-semibold text-[var(--text)] focus:outline-none cursor-pointer"
              >
                {PAGE_SIZE_LIST.map((size) => (
                  <option key={size.id} value={size.id} className="bg-[var(--surface)] text-[var(--text)]">
                    {size.shortLabel} ({size.dimensionsLabel})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {currentPageSize.isPosterSize && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs font-medium">
              <Info className="w-3.5 h-3.5 shrink-0" />
              <span>{currentPageSize.id} is poster-sized. A4 or Letter (US) is recommended for job applications.</span>
            </div>
          )}
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredTemplates.map((template) => {
            const thumbHeight = 220;
            const thumbWidth = Math.round(thumbHeight * aspectRatio);

            return (
              <div
                key={template.id}
                className="group rounded-xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)] transition-colors flex flex-col overflow-hidden shadow-xs"
              >
                {/* Visual Representation Canvas Preview Thumbnail */}
                <div
                  className="h-64 bg-[var(--surface-muted)] p-4 flex items-center justify-center relative overflow-hidden cursor-pointer border-b border-[var(--border)]"
                  onClick={() => handleSelectTemplate(template)}
                >
                  {/* Miniature representation scaled to active page aspect ratio */}
                  <div
                    className="bg-white rounded shadow-xs p-3 text-[5px] text-[#111827] leading-tight select-none pointer-events-none border border-slate-300 flex flex-col justify-between"
                    style={{
                      width: `${thumbWidth}px`,
                      height: `${thumbHeight}px`,
                      borderTopWidth: '3px',
                      borderTopColor: template.accentDefault,
                    }}
                  >
                    <div>
                      <div className="border-b pb-1 mb-1.5" style={{ borderColor: template.accentDefault }}>
                        <div className="font-bold text-[7px]" style={{ color: template.accentDefault }}>
                          ALEX RIVERA
                        </div>
                        <div className="text-[4.5px] text-[#4B5563] uppercase tracking-wider">
                          Senior Software Architect
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="w-16 h-1 rounded-xs" style={{ backgroundColor: template.accentDefault }} />
                        <div className="w-full h-1 bg-slate-200 rounded-xs" />
                        <div className="w-5/6 h-1 bg-slate-200 rounded-xs" />
                        <div className="w-3/4 h-1 bg-slate-200 rounded-xs" />
                      </div>
                      <div className="mt-2 space-y-1">
                        <div className="w-12 h-1 rounded-xs" style={{ backgroundColor: template.accentDefault }} />
                        <div className="w-full h-1 bg-slate-200 rounded-xs" />
                        <div className="w-4/5 h-1 bg-slate-200 rounded-xs" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[4px] text-[#4B5563]">
                      <span>{currentPageSize.shortLabel}</span>
                      <span>{currentPageSize.dimensionsLabel}</span>
                    </div>
                  </div>

                  {/* Badges */}
                  {template.badge && (
                    <span className="absolute top-3 right-3 text-[10px] font-semibold px-2 py-0.5 rounded bg-[var(--surface)] text-[var(--accent)] border border-[var(--border)] shadow-2xs">
                      {template.badge}
                    </span>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h2 className="text-base font-bold text-[var(--text)]">
                        {template.name}
                      </h2>
                      <span className="text-xs font-medium text-[var(--text-muted)]">
                        {template.category}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                      {template.description}
                    </p>
                    <div className="pt-1 text-xs text-[var(--text-muted)]">
                      <span className="font-semibold text-[var(--text)]">Best for:</span> {template.bestFor}
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant="primary"
                    className="w-full mt-2"
                    onClick={() => handleSelectTemplate(template)}
                  >
                    <span>Use This Template</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}

