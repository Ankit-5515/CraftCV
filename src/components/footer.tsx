import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Download, CheckCircle2, FileText } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] text-sm mt-auto transition-colors duration-150">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[var(--accent)] flex items-center justify-center text-white font-bold text-xs">
                CV
              </div>
              <span className="font-bold tracking-tight text-[var(--text)] text-base">
                Craft<span className="text-[var(--accent)]">CV</span>
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Simple, clean, ATS-friendly resume builder for students, professionals, and career switchers.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Free • No Paywall • No Watermark</span>
            </div>
          </div>

          {/* Templates */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text)] mb-3">
              Templates
            </h3>
            <ul className="space-y-2 text-xs">
              <li><Link href="/templates" className="hover:text-[var(--text)] transition-colors">Modern Minimal</Link></li>
              <li><Link href="/templates" className="hover:text-[var(--text)] transition-colors">Classic Professional</Link></li>
              <li><Link href="/templates" className="hover:text-[var(--text)] transition-colors">Executive</Link></li>
              <li><Link href="/templates" className="hover:text-[var(--text)] transition-colors">Tech Developer</Link></li>
              <li><Link href="/templates" className="hover:text-[var(--text)] transition-colors">Two-Column Smart</Link></li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text)] mb-3">
              Features
            </h3>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[var(--accent)]" /> Live ATS Score & Fixes</li>
              <li className="flex items-center gap-1.5"><Download className="w-3.5 h-3.5 text-[var(--accent)]" /> Selectable-Text Vector PDF</li>
              <li className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5 text-[var(--accent)]" /> A4, Letter, Legal, A5, A3 & A2 Sizes</li>
              <li>Full-Screen Print Preview Before Download</li>
              <li>Autosave & Saved Resumes Library</li>
            </ul>
          </div>

          {/* Compliance & Standards */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text)] mb-3">
              ATS Readability
            </h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-3">
              Uses real selectable text, standard section headings, and clean structure with no layout tables or text inside images.
            </p>
            <div className="p-2.5 rounded-lg bg-[var(--surface-muted)] border border-[var(--border)] text-xs text-[var(--text)]">
              Compatible with Workday, Greenhouse, Lever, and Taleo resume parsers.
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--text-muted)]">
          <p>© {new Date().getFullYear()} CraftCV. Free for job seekers everywhere.</p>
          <span>Simple • Accessible • Print-Ready</span>
        </div>
      </div>
    </footer>
  );
};

