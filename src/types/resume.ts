export type TemplateId = 
  | 'classic'
  | 'modern'
  | 'executive'
  | 'tech'
  | 'fresher'
  | 'twocolumn'
  | 'creative'
  | 'compact';

export type FontFamily = 'inter' | 'lora' | 'source-sans' | 'merriweather';

export type FontSize = 'sm' | 'base' | 'lg';

export type Spacing = 'compact' | 'normal' | 'relaxed';

export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
  photoUrl?: string;
  summary: string;
}

export interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  highlights: string[];
}

export interface EducationItem {
  id: string;
  degree: string;
  fieldOfStudy: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  gpa?: string;
  honors?: string;
}

export interface SkillCategory {
  id: string;
  category: string;
  skills: string[]; // e.g. ["TypeScript", "React", "Next.js"]
}

export interface ProjectItem {
  id: string;
  title: string;
  subtitle?: string;
  link?: string;
  github?: string;
  startDate?: string;
  endDate?: string;
  description: string;
  technologies: string[];
  highlights: string[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  url?: string;
}

export interface LanguageItem {
  id: string;
  language: string;
  proficiency: 'Native' | 'Fluent' | 'Professional' | 'Intermediate' | 'Basic';
}

export interface AchievementItem {
  id: string;
  title: string;
  date?: string;
  description: string;
}

export interface CustomSectionItem {
  id: string;
  title: string;
  subtitle?: string;
  date?: string;
  description: string;
}

export interface CustomSection {
  id: string;
  sectionTitle: string;
  items: CustomSectionItem[];
}

export type SectionKey = 
  | 'personal'
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'certifications'
  | 'languages'
  | 'achievements'
  | 'custom';

export type PageSizeId = 'A4' | 'A3' | 'A5' | 'A2' | 'Letter' | 'Legal';

export type MarginPreset = 'narrow' | 'normal' | 'wide';

export interface ResumeSettings {
  templateId: TemplateId;
  fontFamily: FontFamily;
  fontSize: FontSize;
  spacing: Spacing;
  accentColor: string;
  showPhoto: boolean;
  showIcons: boolean;
  pageSize: PageSizeId;
  margins: MarginPreset | 'compact' | 'spacious';
}

export interface ResumeData {
  id: string;
  title: string;
  lastModified: number;
  settings: ResumeSettings;
  personalInfo: PersonalInfo;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: SkillCategory[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  languages: LanguageItem[];
  achievements: AchievementItem[];
  customSections: CustomSection[];
  sectionOrder: SectionKey[];
  sectionVisibility: Record<SectionKey, boolean>;
}

export interface ATSFeedbackItem {
  id: string;
  category: 'contact' | 'headings' | 'content' | 'formatting' | 'keywords';
  severity: 'good' | 'warning' | 'critical';
  title: string;
  description: string;
  fixSuggestion?: string;
}

export interface ATSAnalysis {
  overallScore: number;
  categoryScores: {
    contact: number; // max 20
    headings: number; // max 20
    bullets: number; // max 20
    summary: number; // max 15
    formatting: number; // max 15
    keywordMatch: number; // max 10
  };
  feedback: ATSFeedbackItem[];
  matchedKeywords: string[];
  missingKeywords: string[];
  actionVerbsFound: string[];
  quantifiableMetricsCount: number;
  totalWords: number;
  estimatedPages: number;
}

export interface SavedResumeMeta {
  id: string;
  title: string;
  templateId: TemplateId;
  lastModified: number;
  targetRole?: string;
}
