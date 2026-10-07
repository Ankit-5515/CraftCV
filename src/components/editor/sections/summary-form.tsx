'use client';

import React from 'react';
import { useResumeStore } from '@/store/resume-store';
import { FileText, Sparkles } from 'lucide-react';

export const SummaryForm: React.FC = () => {
  const { resume, updatePersonalInfo } = useResumeStore();
  const summary = resume.personalInfo.summary || '';

  const wordCount = summary.trim() ? summary.trim().split(/\s+/).length : 0;
  const charCount = summary.length;

  const isOptimal = wordCount >= 30 && wordCount <= 120;

  return (
    <div className="space-y-4">
      <div className="border-b border-white/[0.08] pb-3 flex items-start justify-between">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-400" />
            Professional Summary
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            A concise 3-4 sentence elevator pitch highlighting your core value, years of experience, and signature strengths.
          </p>
        </div>
        <div className="text-right">
          <span
            className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
              isOptimal
                ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                : 'bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700'
            }`}
          >
            {wordCount} words {isOptimal ? '✓ Good length' : '(Aim for 30–100 words)'}
          </span>
        </div>
      </div>

      <div>
        <textarea
          rows={6}
          value={summary}
          onChange={(e) => updatePersonalInfo({ summary: e.target.value })}
          placeholder="e.g. Senior Full-Stack Engineer with 8+ years building web applications and distributed systems..."
          className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg p-3 text-sm text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] leading-relaxed resize-y"
        />
        <div className="flex justify-between items-center text-xs text-[var(--text-muted)] mt-1">
          <span>{charCount} characters</span>
          <span>Tip: Mention your role, years of experience, and top skills.</span>
        </div>
      </div>

      {/* Suggested Formula Card */}
      <div className="p-3.5 rounded-lg bg-[var(--surface-muted)] border border-[var(--border)] text-xs text-[var(--text)] space-y-1.5">
        <div className="font-bold flex items-center gap-1.5 text-[var(--accent)]">
          <Sparkles className="w-3.5 h-3.5" /> Helpful Summary Structure:
        </div>
        <p className="text-[var(--text-muted)] leading-normal">
          [Job Title] with [X+ years] of experience in [Key Skills]. Proven track record of [Key Achievement with number or %], helping teams deliver [Result].
        </p>
      </div>
    </div>
  );
};
