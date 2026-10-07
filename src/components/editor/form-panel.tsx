'use client';

import React from 'react';
import { useResumeStore } from '@/store/resume-store';
import { SectionKey } from '@/types/resume';
import {
  User,
  FileText,
  Briefcase,
  GraduationCap,
  Wrench,
  FolderGit2,
  Award,
  Languages,
  Trophy,
  Layers,
  ArrowUpDown,
} from 'lucide-react';
import { PersonalInfoForm } from './sections/personal-info-form';
import { SummaryForm } from './sections/summary-form';
import { ExperienceForm } from './sections/experience-form';
import { EducationForm } from './sections/education-form';
import { SkillsForm } from './sections/skills-form';
import { ProjectsForm } from './sections/projects-form';
import { CertificationsForm } from './sections/certifications-form';
import { LanguagesForm } from './sections/languages-form';
import { AchievementsForm } from './sections/achievements-form';
import { CustomSectionForm } from './sections/custom-section-form';
import { SectionOrderManager } from './sections/section-order-manager';

interface TabItem {
  id: SectionKey | 'layout';
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}

const TABS: TabItem[] = [
  { id: 'personal', name: 'Personal', icon: User },
  { id: 'summary', name: 'Summary', icon: FileText },
  { id: 'experience', name: 'Experience', icon: Briefcase },
  { id: 'education', name: 'Education', icon: GraduationCap },
  { id: 'skills', name: 'Skills', icon: Wrench },
  { id: 'projects', name: 'Projects', icon: FolderGit2 },
  { id: 'certifications', name: 'Certifications', icon: Award },
  { id: 'languages', name: 'Languages', icon: Languages },
  { id: 'achievements', name: 'Awards', icon: Trophy },
  { id: 'custom', name: 'Custom', icon: Layers },
  { id: 'layout', name: 'Section Order', icon: ArrowUpDown },
];

export const FormPanel: React.FC = () => {
  const { activeSection, setActiveSection } = useResumeStore();

  return (
    <div className="flex flex-col h-full bg-[var(--surface)] border-r border-[var(--border)] transition-colors duration-150 form-panel-root">
      {/* Horizontal Scrollable Section Tabs */}
      <div className="border-b border-[var(--border)] px-3 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar bg-[var(--surface-muted)] sticky top-0 z-20">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSection(tab.id as SectionKey)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? 'bg-[var(--accent)] text-white'
                  : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface)]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* Form Content Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
        {activeSection === 'personal' && <PersonalInfoForm />}
        {activeSection === 'summary' && <SummaryForm />}
        {activeSection === 'experience' && <ExperienceForm />}
        {activeSection === 'education' && <EducationForm />}
        {activeSection === 'skills' && <SkillsForm />}
        {activeSection === 'projects' && <ProjectsForm />}
        {activeSection === 'certifications' && <CertificationsForm />}
        {activeSection === 'languages' && <LanguagesForm />}
        {activeSection === 'achievements' && <AchievementsForm />}
        {activeSection === 'custom' && <CustomSectionForm />}
        {(activeSection as string) === 'layout' && <SectionOrderManager />}
      </div>
    </div>
  );
};
