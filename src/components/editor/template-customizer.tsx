'use client';

import React from 'react';
import { useResumeStore } from '@/store/resume-store';
import { FontFamily, FontSize, MarginPreset, PageSizeId, Spacing } from '@/types/resume';
import { PAGE_SIZE_LIST, getPageSizeConfig, getMarginConfig } from '@/lib/page-sizes';
import { Type, Sliders, Palette, Image as ImageIcon, FileText, Maximize, Info } from 'lucide-react';

const ACCENT_COLORS = [
  '#2563eb', // blue
  '#0d9488', // teal
  '#4f46e5', // indigo
  '#0284c7', // sky
  '#059669', // emerald
  '#e11d48', // rose
  '#7c3aed', // violet
  '#d97706', // amber
  '#1e293b', // slate
  '#0f172a', // midnight
];

export const TemplateCustomizer: React.FC = () => {
  const { resume, updateSettings } = useResumeStore();
  const { settings } = resume;
  const currentPageSize = getPageSizeConfig(settings.pageSize);
  const currentMargin = getMarginConfig(settings.margins);

  return (
    <div className="bg-[var(--surface)] border-b border-[var(--border)] px-4 py-2 text-xs text-[var(--text)] flex flex-col gap-1.5 transition-colors duration-150">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        {/* Page Size Selector */}
        <div className="flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-[var(--text-muted)]" />
          <label htmlFor="page-size-select" className="text-[var(--text-muted)] font-semibold">
            Page size:
          </label>
          <select
            id="page-size-select"
            value={currentPageSize.id}
            onChange={(e) => updateSettings({ pageSize: e.target.value as PageSizeId })}
            className="bg-[var(--surface-muted)] border border-[var(--border)] text-[var(--text)] font-medium rounded-md px-2 py-1 text-xs focus:outline-none focus:border-[var(--accent)] cursor-pointer"
          >
            {PAGE_SIZE_LIST.map((ps) => (
              <option key={ps.id} value={ps.id} className="bg-[var(--surface)] text-[var(--text)]">
                {ps.name} — {ps.widthMm}×{ps.heightMm}mm
              </option>
            ))}
          </select>
        </div>

        {/* Margin Presets (Narrow / Normal / Wide) */}
        <div className="flex items-center gap-1.5">
          <Maximize className="w-3.5 h-3.5 text-[var(--text-muted)]" />
          <span className="text-[var(--text-muted)] font-semibold">Margins:</span>
          {(['narrow', 'normal', 'wide'] as MarginPreset[]).map((m) => {
            const isSelected = currentMargin.id === m;
            return (
              <button
                key={m}
                type="button"
                onClick={() => updateSettings({ margins: m })}
                className={`px-2 py-1 rounded-md capitalize font-semibold text-xs transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[var(--accent)] text-white'
                    : 'bg-[var(--surface-muted)] text-[var(--text-muted)] hover:text-[var(--text)] border border-[var(--border)]'
                }`}
              >
                {m}
              </button>
            );
          })}
        </div>

        {/* Font Family */}
        <div className="flex items-center gap-1.5">
          <Type className="w-3.5 h-3.5 text-[var(--text-muted)]" />
          <label htmlFor="font-family-select" className="text-[var(--text-muted)] font-semibold">
            Font:
          </label>
          <select
            id="font-family-select"
            value={settings.fontFamily}
            onChange={(e) => updateSettings({ fontFamily: e.target.value as FontFamily })}
            className="bg-[var(--surface-muted)] border border-[var(--border)] text-[var(--text)] font-medium rounded-md px-2 py-1 text-xs focus:outline-none focus:border-[var(--accent)] cursor-pointer"
          >
            <option value="inter" className="bg-[var(--surface)] text-[var(--text)]">Inter (Sans)</option>
            <option value="source-sans" className="bg-[var(--surface)] text-[var(--text)]">Source Sans 3</option>
            <option value="lora" className="bg-[var(--surface)] text-[var(--text)]">Lora (Serif)</option>
            <option value="merriweather" className="bg-[var(--surface)] text-[var(--text)]">Merriweather</option>
          </select>
        </div>

        {/* Font Size */}
        <div className="flex items-center gap-1.5">
          <span className="text-[var(--text-muted)] font-semibold">Text size:</span>
          {(
            [
              { id: 'sm', label: 'Small' },
              { id: 'base', label: 'Medium' },
              { id: 'lg', label: 'Large' },
            ] as const
          ).map((sz) => (
            <button
              key={sz.id}
              type="button"
              onClick={() => updateSettings({ fontSize: sz.id as FontSize })}
              className={`px-2 py-1 rounded-md font-semibold text-xs transition-colors cursor-pointer ${
                settings.fontSize === sz.id
                  ? 'bg-[var(--accent)] text-white'
                  : 'bg-[var(--surface-muted)] text-[var(--text-muted)] hover:text-[var(--text)] border border-[var(--border)]'
              }`}
            >
              {sz.label}
            </button>
          ))}
        </div>

        {/* Line Spacing */}
        <div className="flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5 text-[var(--text-muted)]" />
          <span className="text-[var(--text-muted)] font-semibold">Spacing:</span>
          {(['compact', 'normal', 'relaxed'] as Spacing[]).map((sp) => (
            <button
              key={sp}
              type="button"
              onClick={() => updateSettings({ spacing: sp })}
              className={`px-2 py-1 rounded-md capitalize font-semibold text-xs transition-colors cursor-pointer ${
                settings.spacing === sp
                  ? 'bg-[var(--accent)] text-white'
                  : 'bg-[var(--surface-muted)] text-[var(--text-muted)] hover:text-[var(--text)] border border-[var(--border)]'
              }`}
            >
              {sp}
            </button>
          ))}
        </div>

        {/* Accent Color Palettes */}
        <div className="flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5 text-[var(--text-muted)]" />
          <span className="text-[var(--text-muted)] font-semibold">Color:</span>
          <div className="flex items-center gap-1">
            {ACCENT_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => updateSettings({ accentColor: c })}
                className={`w-4 h-4 rounded-full transition-transform cursor-pointer ${
                  settings.accentColor === c
                    ? 'scale-125 ring-2 ring-[var(--text)]'
                    : 'hover:scale-110'
                }`}
                style={{ backgroundColor: c }}
                title={`Accent color ${c}`}
                aria-label={`Select accent color ${c}`}
              />
            ))}
            <input
              type="color"
              value={settings.accentColor}
              onChange={(e) => updateSettings({ accentColor: e.target.value })}
              className="w-5 h-5 rounded cursor-pointer bg-transparent border-0 ml-1"
              title="Custom accent color"
              aria-label="Custom accent color"
            />
          </div>
        </div>

        {/* Photo Toggle */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            type="button"
            onClick={() => updateSettings({ showPhoto: !settings.showPhoto })}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border transition-colors cursor-pointer ${
              settings.showPhoto
                ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                : 'bg-[var(--surface-muted)] text-[var(--text-muted)] hover:text-[var(--text)] border-[var(--border)]'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>{settings.showPhoto ? 'Photo: Shown' : 'Photo: Hidden'}</span>
          </button>
        </div>
      </div>

      {/* Poster-Size Hint for A2 and A3 */}
      {currentPageSize.isPosterSize && (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 text-xs font-medium">
          <Info className="w-3.5 h-3.5 shrink-0 text-amber-700 dark:text-amber-400" />
          <span>
            <strong>{currentPageSize.shortLabel}</strong> ({currentPageSize.dimensionsLabel}) is poster-size.{' '}
            <strong>A4</strong> or <strong>Letter</strong> is recommended for standard job applications.
          </span>
          <button
            type="button"
            onClick={() => updateSettings({ pageSize: 'A4' })}
            className="ml-auto underline font-semibold hover:text-amber-950 dark:hover:text-white cursor-pointer"
          >
            Switch to A4
          </button>
        </div>
      )}
    </div>
  );
};
