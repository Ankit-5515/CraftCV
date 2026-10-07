'use client';

import React, { useMemo } from 'react';
import { useResumeStore } from '@/store/resume-store';
import { analyzeResumeATS } from '@/lib/ats';
import { Dialog } from '@/components/ui/dialog';
import { CheckCircle2, AlertTriangle, AlertCircle, BarChart3 } from 'lucide-react';

interface ATSScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ATSScoreModal: React.FC<ATSScoreModalProps> = ({ isOpen, onClose }) => {
  const { resume, jobDescriptionText, setJobDescriptionText } = useResumeStore();

  const analysis = useMemo(() => {
    return analyzeResumeATS(resume, jobDescriptionText);
  }, [resume, jobDescriptionText]);

  const { overallScore, categoryScores, feedback, matchedKeywords, missingKeywords } = analysis;

  const strokeHex =
    overallScore >= 80 ? '#059669' :
    overallScore >= 60 ? '#d97706' :
    '#e11d48';

  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (overallScore / 100) * circumference;

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="ATS Resume Quality Check"
      description="Live check of your resume's structure, keywords, and readability for applicant tracking systems."
      className="max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar"
    >
      <div className="space-y-6">
        {/* Score Ring Header */}
        <div className="p-5 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)] flex flex-col sm:flex-row items-center gap-6">
          <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#CBD5E1"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke={strokeHex}
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-300 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-extrabold text-[var(--text)] font-mono">
                {overallScore}
              </span>
              <span className="text-[10px] text-[var(--text-muted)] font-semibold uppercase">out of 100</span>
            </div>
          </div>

          <div className="space-y-1.5 text-center sm:text-left flex-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[var(--surface)] border border-[var(--border)] text-[var(--text)]">
              <BarChart3 className="w-3.5 h-3.5 text-[var(--accent)]" />
              {overallScore >= 85 ? 'Ready to apply' : overallScore >= 70 ? 'Good foundation' : 'Needs improvement'}
            </div>
            <h4 className="text-base font-bold text-[var(--text)]">
              {overallScore >= 85
                ? 'Your resume is well-structured and easy for hiring software to read.'
                : overallScore >= 70
                ? 'Your resume covers the essentials. Review the suggestions below to strengthen it.'
                : 'A few key details, section headings, or measurable results are missing.'}
            </h4>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Checked across 6 areas: contact info, standard section headings, action verbs & measurable results, summary length, formatting safety, and job description keywords.
            </p>
          </div>
        </div>

        {/* Category Breakdown Bars */}
        <div className="space-y-3">
          <h5 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
            Score Breakdown by Category
          </h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-[var(--surface-muted)] border border-[var(--border)] space-y-1.5">
              <div className="flex justify-between font-semibold">
                <span className="text-[var(--text)]">Contact Details</span>
                <span className="text-[var(--text)] font-bold">{categoryScores.contact} / 20</span>
              </div>
              <div className="w-full h-2 bg-[var(--border)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--accent)] rounded-full"
                  style={{ width: `${(categoryScores.contact / 20) * 100}%` }}
                />
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[var(--surface-muted)] border border-[var(--border)] space-y-1.5">
              <div className="flex justify-between font-semibold">
                <span className="text-[var(--text)]">Standard Headings</span>
                <span className="text-[var(--text)] font-bold">{categoryScores.headings} / 20</span>
              </div>
              <div className="w-full h-2 bg-[var(--border)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-600 rounded-full"
                  style={{ width: `${(categoryScores.headings / 20) * 100}%` }}
                />
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[var(--surface-muted)] border border-[var(--border)] space-y-1.5">
              <div className="flex justify-between font-semibold">
                <span className="text-[var(--text)]">Action Verbs & Results</span>
                <span className="text-[var(--text)] font-bold">{categoryScores.bullets} / 20</span>
              </div>
              <div className="w-full h-2 bg-[var(--border)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-teal-600 rounded-full"
                  style={{ width: `${(categoryScores.bullets / 20) * 100}%` }}
                />
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[var(--surface-muted)] border border-[var(--border)] space-y-1.5">
              <div className="flex justify-between font-semibold">
                <span className="text-[var(--text)]">Summary Length</span>
                <span className="text-[var(--text)] font-bold">{categoryScores.summary} / 15</span>
              </div>
              <div className="w-full h-2 bg-[var(--border)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full"
                  style={{ width: `${(categoryScores.summary / 15) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Job Description Matcher */}
        <div className="space-y-2.5 pt-2 border-t border-[var(--border)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <label htmlFor="jd-matcher-input" className="text-xs font-bold uppercase tracking-wider text-[var(--text)]">
              Compare with a Job Description (Optional)
            </label>
            <span className="text-xs text-[var(--text-muted)]">Paste a job posting to spot missing keywords</span>
          </div>

          <textarea
            id="jd-matcher-input"
            rows={3}
            value={jobDescriptionText}
            onChange={(e) => setJobDescriptionText(e.target.value)}
            placeholder="Paste the job description here to see which skills and keywords appear in your resume..."
            className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg p-3 text-xs text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] resize-y"
          />

          {jobDescriptionText.trim().length > 20 && (
            <div className="space-y-3 p-3.5 rounded-lg bg-[var(--surface-muted)] border border-[var(--border)]">
              {matchedKeywords.length > 0 && (
                <div>
                  <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1 mb-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Found in your resume ({matchedKeywords.length}):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {matchedKeywords.map((kw, i) => (
                      <span
                        key={i}
                        className="text-xs px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 font-medium"
                      >
                        ✓ {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {missingKeywords.length > 0 && (
                <div>
                  <span className="text-xs font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1 mb-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" /> Missing keywords ({missingKeywords.length}):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {missingKeywords.slice(0, 12).map((kw, i) => (
                      <span
                        key={i}
                        className="text-xs px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-700 font-medium"
                      >
                        + {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Actionable Fixes List */}
        <div className="space-y-3 pt-2 border-t border-[var(--border)]">
          <h5 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
            Suggested Improvements ({feedback.length})
          </h5>

          {feedback.length === 0 ? (
            <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 text-xs text-emerald-900 dark:text-emerald-200 flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-700 dark:text-emerald-400" />
              <span>Everything looks great! Your resume has complete contact info, clear headings, and measurable results.</span>
            </div>
          ) : (
            <div className="space-y-2.5">
              {feedback.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-lg bg-[var(--surface-muted)] border border-[var(--border)] text-xs space-y-1"
                >
                  <div className="flex items-center gap-2">
                    {item.severity === 'critical' ? (
                      <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                    )}
                    <span className="font-bold text-[var(--text)]">{item.title}</span>
                  </div>
                  <p className="text-[var(--text-muted)] pl-6 leading-relaxed">{item.description}</p>
                  {item.fixSuggestion && (
                    <p className="text-[var(--accent)] font-semibold pl-6 pt-0.5">
                      How to fix: {item.fixSuggestion}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Dialog>
  );
};
