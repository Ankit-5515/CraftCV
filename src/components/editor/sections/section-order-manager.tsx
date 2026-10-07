'use client';

import React from 'react';
import { useResumeStore } from '@/store/resume-store';
import { SectionKey } from '@/types/resume';
import { GripVertical, Eye, EyeOff, ChevronUp, ChevronDown } from 'lucide-react';

const SECTION_LABELS: Record<SectionKey, string> = {
  personal: 'Personal Information',
  summary: 'Professional Summary',
  experience: 'Work Experience',
  education: 'Education',
  skills: 'Skills & Competencies',
  projects: 'Key Projects',
  certifications: 'Certifications',
  languages: 'Languages',
  achievements: 'Honors & Awards',
  custom: 'Custom Sections',
};

export const SectionOrderManager: React.FC = () => {
  const { resume, reorderSections, toggleSectionVisibility } = useResumeStore();
  const order = resume.sectionOrder;
  const visibility = resume.sectionVisibility;

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newOrder = [...order];
    const temp = newOrder[index];
    newOrder[index] = newOrder[index - 1];
    newOrder[index - 1] = temp;
    reorderSections(newOrder);
  };

  const moveDown = (index: number) => {
    if (index === order.length - 1) return;
    const newOrder = [...order];
    const temp = newOrder[index];
    newOrder[index] = newOrder[index + 1];
    newOrder[index + 1] = temp;
    reorderSections(newOrder);
  };

  return (
    <div className="space-y-4">
      <div className="border-b border-white/[0.08] pb-3">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <GripVertical className="w-4 h-4 text-indigo-400" />
          Section Order & Visibility
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Reorder sections to best highlight your unique strengths (e.g. freshers put Education first).
        </p>
      </div>

      <div className="space-y-2">
        {order.map((key, index) => {
          const isVisible = visibility[key] ?? true;
          return (
            <div
              key={key}
              className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                isVisible
                  ? 'bg-white/[0.04] border-white/10 text-white'
                  : 'bg-white/[0.01] border-white/5 text-slate-500 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-5 text-center text-xs font-mono text-slate-500">
                  {index + 1}
                </span>
                <span className="text-sm font-medium">
                  {SECTION_LABELS[key] || key}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Reorder Buttons */}
                <button
                  disabled={index === 0}
                  onClick={() => moveUp(index)}
                  className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-20 cursor-pointer"
                  title="Move Up"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button
                  disabled={index === order.length - 1}
                  onClick={() => moveDown(index)}
                  className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-20 cursor-pointer"
                  title="Move Down"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>

                {/* Visibility Toggle */}
                <button
                  onClick={() => toggleSectionVisibility(key)}
                  className={`p-1.5 rounded transition-colors ml-1 cursor-pointer ${
                    isVisible
                      ? 'text-indigo-400 hover:bg-indigo-500/10'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                  title={isVisible ? 'Hide Section' : 'Show Section'}
                >
                  {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
