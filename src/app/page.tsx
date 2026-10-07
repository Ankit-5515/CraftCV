'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { TEMPLATES } from '@/templates';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Zap,
  FileCheck2,
  ChevronDown,
  Star,
} from 'lucide-react';

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Is CraftCV genuinely 100% free with no watermark?',
      a: 'Yes, completely free forever. There are no paywalls, no hidden subscriptions, and no watermarks on your downloaded PDF, PNG, or JPG files.',
    },
    {
      q: 'Will my downloaded PDF pass ATS systems like Workday and Greenhouse?',
      a: 'Yes. CraftCV exports vector, selectable-text PDFs with standard headings (Experience, Education, Skills, Projects) and clean semantic structure.',
    },
    {
      q: 'Do I have to sign up or create an account to download?',
      a: 'No. You can choose a template, add your details, check your ATS score, preview pages, and download your resume without logging in.',
    },
    {
      q: 'What page sizes can I export?',
      a: 'You can switch between A4 (default), US Letter, US Legal, A5, A3, and A2 at any time. All templates automatically scale fonts, margins, and multi-page breaks to match.',
    },
    {
      q: 'Can I preview my exact pages before downloading?',
      a: 'Yes. Clicking Preview & Download opens a full-screen paper preview showing your exact page count, zoom controls, and format options before you save.',
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col overflow-x-hidden transition-colors duration-150">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full flex flex-col items-center text-center">
        {/* Simple Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[var(--surface)] border border-[var(--border)] shadow-xs mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-600" />
          <span className="text-[var(--text)]">Free ATS Resume Builder • No Sign-Up Required</span>
        </div>

        {/* Clean Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[var(--text)] max-w-4xl leading-[1.12]">
          Create a clean, job-ready resume in{' '}
          <span className="text-[var(--accent)]">under 5 minutes.</span>
        </h1>

        <p className="mt-5 text-base sm:text-lg text-[var(--text-muted)] max-w-2xl leading-relaxed">
          Built for students, professionals, and career switchers. Pick from 8 ATS-friendly templates, customize page size (A4, Letter, Legal), check your ATS score, and download a crisp, selectable-text PDF.
        </p>

        {/* 4-Step Workflow Pill */}
        <div className="mt-8 inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3 px-4 py-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-xs font-medium text-[var(--text-muted)]">
          <span className="font-semibold text-[var(--text)]">1. Choose template</span>
          <span>→</span>
          <span className="font-semibold text-[var(--text)]">2. Add details</span>
          <span>→</span>
          <span className="font-semibold text-[var(--text)]">3. Preview</span>
          <span>→</span>
          <span className="font-semibold text-[var(--accent)]">4. Download</span>
        </div>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
          <Link href="/editor">
            <Button size="lg" variant="primary" className="px-7 py-3 text-base">
              <span>Build My Resume</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/templates">
            <Button size="lg" variant="outline" className="px-6 py-3 text-base">
              <span>Browse 8 Templates</span>
            </Button>
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs text-[var(--text-muted)] font-medium">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
            <span>100% Free • No Watermark</span>
          </div>
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-[var(--accent)]" />
            <span>Selectable-Text Vector PDF</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>Live ATS Score & Fixes</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
            <span>A4, Letter, Legal & More</span>
          </div>
        </div>

        {/* Clean Template & Preview Showcase */}
        <div className="mt-14 w-full max-w-5xl">
          <div className="rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-xs p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="w-full lg:w-1/2 text-left space-y-4">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>ATS Score: 96 / 100</span>
              </div>
              <h2 className="text-2xl font-bold text-[var(--text)]">
                Formatted for both hiring managers and ATS software
              </h2>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                Every template uses clean headings, high-contrast solid colors, and real selectable text so your experience, education, and skills read clearly on screen and on paper.
              </p>
              <ul className="space-y-2 pt-1 text-xs text-[var(--text)]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[var(--accent)] shrink-0" />
                  <span>Action-verb and measurable bullet guidance</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[var(--accent)] shrink-0" />
                  <span>Job description keyword matcher</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[var(--accent)] shrink-0" />
                  <span>Exact page-by-page preview before you download</span>
                </li>
              </ul>
            </div>

            {/* Right Mini Resume Paper Card (Always crisp white paper) */}
            <div className="w-full lg:w-1/2 flex justify-center">
              <div className="w-72 sm:w-80 bg-white rounded-lg shadow-sm p-5 text-[#111827] text-left border border-slate-200">
                <div className="border-b-2 border-[#2563EB] pb-2 mb-3">
                  <h3 className="font-bold text-base tracking-tight text-[#111827]">
                    ALEX RIVERA
                  </h3>
                  <p className="text-[11px] font-semibold text-[#2563EB] uppercase">
                    Senior Platform Architect
                  </p>
                </div>
                <div className="space-y-2.5 text-[11px] text-[#1F2937]">
                  <div>
                    <p className="font-bold text-[#111827] uppercase tracking-wider text-[10px] border-b border-slate-200 pb-0.5 mb-1">
                      Summary
                    </p>
                    <p className="leading-snug text-[#374151]">
                      Senior engineer with 8+ years leading distributed systems. Led Kubernetes migration reducing annual cloud costs by $140,000.
                    </p>
                  </div>
                  <div>
                    <p className="font-bold text-[#111827] uppercase tracking-wider text-[10px] border-b border-slate-200 pb-0.5 mb-1">
                      Skills
                    </p>
                    <p className="leading-snug text-[#374151]">
                      TypeScript, Go, React, Next.js, Kafka, AWS, Kubernetes, PostgreSQL
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Step "How It Works" Section */}
      <section className="py-16 border-t border-[var(--border)] bg-[var(--surface)] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
              Simple 4-Step Process
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text)]">
              How it works
            </h2>
            <p className="text-sm text-[var(--text-muted)]">
              Everything you need to build and download a polished resume without clutter.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-xl bg-[var(--bg)] border border-[var(--border)] space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-[var(--accent-soft)] text-[var(--accent)] font-bold text-sm flex items-center justify-center">
                1
              </div>
              <h3 className="text-base font-bold text-[var(--text)]">Choose template</h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Pick from 8 clean templates for students, developers, managers, and executives.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[var(--bg)] border border-[var(--border)] space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-[var(--accent-soft)] text-[var(--accent)] font-bold text-sm flex items-center justify-center">
                2
              </div>
              <h3 className="text-base font-bold text-[var(--text)]">Add details</h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Fill in your experience, education, and skills, or click any section on the paper to edit.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[var(--bg)] border border-[var(--border)] space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-[var(--accent-soft)] text-[var(--accent)] font-bold text-sm flex items-center justify-center">
                3
              </div>
              <h3 className="text-base font-bold text-[var(--text)]">Preview</h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Inspect every page at true paper size (A4, Letter, Legal, A5) and check your ATS score.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[var(--bg)] border border-[var(--border)] space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-[var(--accent-soft)] text-[var(--accent)] font-bold text-sm flex items-center justify-center">
                4
              </div>
              <h3 className="text-base font-bold text-[var(--text)]">Download</h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Export as a selectable-text PDF, high-resolution PNG/JPG, or print-ready document.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Templates Showcase */}
      <section className="py-16 border-t border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
                ATS-Safe Layouts
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text)] mt-1">
                8 Professional Templates
              </h2>
            </div>
            <Link href="/templates">
              <Button variant="outline" size="sm">
                <span>View All 8 Templates</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEMPLATES.slice(0, 4).map((tmpl) => (
              <div
                key={tmpl.id}
                className="rounded-xl bg-[var(--surface)] border border-[var(--border)] p-5 flex flex-col justify-between shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-[var(--text-muted)]">{tmpl.category}</span>
                    {tmpl.badge && (
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[var(--accent-soft)] text-[var(--accent)]">
                        {tmpl.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-[var(--text)]">
                    {tmpl.name}
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] mt-1 line-clamp-2">
                    {tmpl.description}
                  </p>
                </div>
                <Link href="/editor" className="mt-4">
                  <Button size="sm" variant="secondary" className="w-full">
                    <span>Use Template</span>
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why ATS-Friendly Section */}
      <section className="py-16 border-t border-[var(--border)] bg-[var(--surface)] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-5">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                Built for Real Hiring Pipelines
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text)] leading-tight">
                Clean formatting that passes automated resume screening.
              </h2>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                Many resume tools export rasterized images or complex tables that applicant tracking systems cannot read. CraftCV keeps your layout clean and text-selectable.
              </p>

              <div className="space-y-3 pt-1">
                <div className="p-3.5 rounded-xl bg-[var(--bg)] border border-[var(--border)] flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--text)]">Selectable Vector PDF Text</h3>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">Every heading, bullet, and link is written as real PDF text at exact page coordinates.</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[var(--bg)] border border-[var(--border)] flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--text)]">Standard Section Headings</h3>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">Experience, Education, Skills, and Projects follow standard ATS conventions.</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[var(--bg)] border border-[var(--border)] flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--text)]">Actionable ATS Feedback</h3>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">Spot missing contact fields, weak bullets, or missing job description keywords right away.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial Box */}
            <div className="p-6 sm:p-8 rounded-xl bg-[var(--bg)] border border-[var(--border)] space-y-5 shadow-xs">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
                <span className="text-xs font-bold text-[var(--text)] ml-2">4.9 / 5.0 User Rating</span>
              </div>
              <blockquote className="text-sm text-[var(--text)] leading-relaxed">
                “CraftCV helped me clean up my two-page engineering resume, match keywords for backend roles, and export a crisp PDF without any paywall surprises.”
              </blockquote>
              <div className="flex items-center gap-3 pt-3 border-t border-[var(--border)]">
                <div className="w-9 h-9 rounded-full bg-[var(--accent-soft)] border border-[var(--border)] flex items-center justify-center font-bold text-xs text-[var(--accent)]">
                  MR
                </div>
                <div>
                  <div className="text-xs font-bold text-[var(--text)]">Marcus R.</div>
                  <p className="text-xs text-[var(--text-muted)]">Senior Distributed Systems Engineer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 border-t border-[var(--border)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
              Common Questions
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text)]">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl bg-[var(--surface)] border border-[var(--border)] overflow-hidden shadow-xs"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between text-sm font-semibold text-[var(--text)] hover:bg-[var(--surface-muted)] transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[var(--text-muted)] transition-transform ${
                        isOpen ? 'rotate-180 text-[var(--accent)]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="p-4 pt-2 text-xs text-[var(--text-muted)] leading-relaxed border-t border-[var(--border)]">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="py-16 border-t border-[var(--border)] bg-[var(--surface)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <h2 className="text-2xl sm:text-4xl font-bold text-[var(--text)]">
            Ready to build your resume?
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-muted)] max-w-xl mx-auto">
            Pick a template, add your details, preview your pages, and download for free.
          </p>
          <div className="pt-1">
            <Link href="/editor">
              <Button size="lg" variant="primary" className="px-8 py-3 text-base">
                <span>Start Building My Resume</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

