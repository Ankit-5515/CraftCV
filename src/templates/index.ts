import { ResumeData, TemplateId } from '@/types/resume';
import { ClassicProfessionalTemplate } from './classic-professional';
import { ModernMinimalTemplate } from './modern-minimal';
import { ExecutiveTemplate } from './executive';
import { TechDeveloperTemplate } from './tech-developer';
import { FresherStudentTemplate } from './fresher-student';
import { TwoColumnSmartTemplate } from './twocolumn-smart';
import { CreativeCleanTemplate } from './creative-clean';
import { CompactOnePagerTemplate } from './compact-one-pager';

export interface TemplateDefinition {
  id: TemplateId;
  name: string;
  category: 'Modern' | 'Classic' | 'Creative' | 'ATS-Simple' | 'Tech';
  description: string;
  bestFor: string;
  component: React.ComponentType<{
    resume: ResumeData;
    onSelectSection?: (section: string) => void;
  }>;
  badge?: string;
  accentDefault: string;
}

export const TEMPLATES: TemplateDefinition[] = [
  {
    id: 'modern',
    name: 'Modern Minimal',
    category: 'Modern',
    description: 'Clean single-column geometric layout with subtle accent lines and tag pills.',
    bestFor: 'General Tech, Design, Consulting, All Career Levels',
    component: ModernMinimalTemplate,
    badge: 'Popular',
    accentDefault: '#4f46e5',
  },
  {
    id: 'classic',
    name: 'Classic Professional',
    category: 'Classic',
    description: 'Timeless single column layout with traditional serif headings and divider rules.',
    bestFor: 'Finance, Law, Healthcare, Traditional Corporations',
    component: ClassicProfessionalTemplate,
    badge: 'ATS Gold',
    accentDefault: '#1e293b',
  },
  {
    id: 'executive',
    name: 'Executive Leadership',
    category: 'Classic',
    description: 'Distinguished header banner with high-impact executive summary and leadership metrics.',
    bestFor: 'Directors, VPs, C-Suite, Senior Managers',
    component: ExecutiveTemplate,
    badge: 'Senior',
    accentDefault: '#0f172a',
  },
  {
    id: 'tech',
    name: 'Tech Developer',
    category: 'Tech',
    description: 'Skills-forward architecture with code-styled tags and highlighted GitHub repositories.',
    bestFor: 'Software Engineers, DevOps, Full-Stack, Data Scientists',
    component: TechDeveloperTemplate,
    badge: 'Dev Choice',
    accentDefault: '#0284c7',
  },
  {
    id: 'fresher',
    name: 'Fresher / Graduate',
    category: 'ATS-Simple',
    description: 'Prioritizes academic credentials, GPA, capstone coursework, and internships.',
    bestFor: 'College Students, Recent Grads, Career Switchers',
    component: FresherStudentTemplate,
    badge: 'Entry Level',
    accentDefault: '#0d9488',
  },
  {
    id: 'twocolumn',
    name: 'Two-Column Smart',
    category: 'Modern',
    description: 'Structured sidebar for contact and skills, paired with a spacious experience column.',
    bestFor: 'Designers, Product Managers, Marketing Technologists',
    component: TwoColumnSmartTemplate,
    badge: 'Balanced',
    accentDefault: '#6366f1',
  },
  {
    id: 'creative',
    name: 'Creative Clean',
    category: 'Creative',
    description: 'Refined modern color blocks with soft borders while preserving 100% ATS text parseability.',
    bestFor: 'UX/UI, Copywriters, Media, Startup Founders',
    component: CreativeCleanTemplate,
    badge: 'Stylized',
    accentDefault: '#ec4899',
  },
  {
    id: 'compact',
    name: 'Compact One-Pager',
    category: 'ATS-Simple',
    description: 'High-density typography engineered to fit 10+ years of dense experience on 1 pristine page.',
    bestFor: 'Experienced Pros targeting strict 1-page limits',
    component: CompactOnePagerTemplate,
    badge: 'Dense',
    accentDefault: '#1e3a8a',
  },
];

export function getTemplateById(id: TemplateId): TemplateDefinition {
  const found = TEMPLATES.find((t) => t.id === id);
  return found || TEMPLATES[0];
}

export {
  ClassicProfessionalTemplate,
  ModernMinimalTemplate,
  ExecutiveTemplate,
  TechDeveloperTemplate,
  FresherStudentTemplate,
  TwoColumnSmartTemplate,
  CreativeCleanTemplate,
  CompactOnePagerTemplate,
};
