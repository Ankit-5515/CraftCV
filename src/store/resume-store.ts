import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  ResumeData,
  ResumeSettings,
  PersonalInfo,
  ExperienceItem,
  EducationItem,
  SkillCategory,
  ProjectItem,
  CertificationItem,
  LanguageItem,
  AchievementItem,
  CustomSection,
  SectionKey,
} from '@/types/resume';
import { SAMPLE_RESUME, BLANK_RESUME } from './sample-data';
import { generateId } from '@/lib/utils';

const MAX_HISTORY_STEPS = 20;

interface ResumeState {
  resume: ResumeData;
  history: {
    past: ResumeData[];
    future: ResumeData[];
  };
  savedResumes: ResumeData[];
  activeSection: SectionKey;
  activeMobileTab: 'edit' | 'preview';
  jobDescriptionText: string;
  isDirty: boolean;
  lastSavedAt: number | null;

  // Actions
  setResume: (resume: ResumeData) => void;
  updateSettings: (settings: Partial<ResumeSettings>) => void;
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void;
  
  // Experience
  addExperience: (item?: Partial<ExperienceItem>) => void;
  updateExperience: (id: string, item: Partial<ExperienceItem>) => void;
  removeExperience: (id: string) => void;
  reorderExperience: (items: ExperienceItem[]) => void;

  // Education
  addEducation: (item?: Partial<EducationItem>) => void;
  updateEducation: (id: string, item: Partial<EducationItem>) => void;
  removeEducation: (id: string) => void;
  reorderEducation: (items: EducationItem[]) => void;

  // Skills
  addSkillCategory: (category?: Partial<SkillCategory>) => void;
  updateSkillCategory: (id: string, category: Partial<SkillCategory>) => void;
  removeSkillCategory: (id: string) => void;

  // Projects
  addProject: (item?: Partial<ProjectItem>) => void;
  updateProject: (id: string, item: Partial<ProjectItem>) => void;
  removeProject: (id: string) => void;
  reorderProjects: (items: ProjectItem[]) => void;

  // Certifications
  addCertification: (item?: Partial<CertificationItem>) => void;
  updateCertification: (id: string, item: Partial<CertificationItem>) => void;
  removeCertification: (id: string) => void;

  // Languages
  addLanguage: (item?: Partial<LanguageItem>) => void;
  updateLanguage: (id: string, item: Partial<LanguageItem>) => void;
  removeLanguage: (id: string) => void;

  // Achievements
  addAchievement: (item?: Partial<AchievementItem>) => void;
  updateAchievement: (id: string, item: Partial<AchievementItem>) => void;
  removeAchievement: (id: string) => void;

  // Custom Sections
  addCustomSection: (title?: string) => void;
  updateCustomSection: (id: string, section: Partial<CustomSection>) => void;
  removeCustomSection: (id: string) => void;
  addCustomSectionItem: (sectionId: string) => void;
  removeCustomSectionItem: (sectionId: string, itemId: string) => void;

  // Section Ordering & Visibility
  reorderSections: (newOrder: SectionKey[]) => void;
  toggleSectionVisibility: (sectionKey: SectionKey) => void;

  // Global / UI Actions
  setActiveSection: (section: SectionKey) => void;
  setActiveMobileTab: (tab: 'edit' | 'preview') => void;
  setJobDescriptionText: (text: string) => void;
  
  // History
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;

  // Library / Multiple Resumes
  loadSampleData: () => void;
  clearResume: () => void;
  saveCurrentToLibrary: () => void;
  loadFromLibrary: (id: string) => void;
  duplicateResume: (id: string) => void;
  deleteFromLibrary: (id: string) => void;
  renameResume: (id: string, newTitle: string) => void;
}

export const useResumeStore = create<ResumeState>()(
  persist(
    (set, get) => {
      const pushHistory = (currentResume: ResumeData) => {
        const { history } = get();
        const newPast = [...history.past, JSON.parse(JSON.stringify(currentResume))];
        if (newPast.length > MAX_HISTORY_STEPS) {
          newPast.shift();
        }
        return {
          past: newPast,
          future: [],
        };
      };

      return {
        resume: SAMPLE_RESUME,
        history: {
          past: [],
          future: [],
        },
        savedResumes: [SAMPLE_RESUME],
        activeSection: 'personal',
        activeMobileTab: 'edit',
        jobDescriptionText: '',
        isDirty: false,
        lastSavedAt: Date.now(),

        setResume: (newResume) => {
          const current = get().resume;
          set({
            history: pushHistory(current),
            resume: { ...newResume, lastModified: Date.now() },
            isDirty: true,
            lastSavedAt: Date.now(),
          });
        },

        updateSettings: (newSettings) => {
          const current = get().resume;
          const updatedResume: ResumeData = {
            ...current,
            lastModified: Date.now(),
            settings: {
              ...current.settings,
              pageSize: current.settings.pageSize || 'A4',
              margins: current.settings.margins || 'normal',
              ...newSettings,
            },
          };
          const updatedSaved = get().savedResumes.map((r) =>
            r.id === current.id ? updatedResume : r
          );
          set({
            history: pushHistory(current),
            resume: updatedResume,
            savedResumes: updatedSaved,
            isDirty: true,
            lastSavedAt: Date.now(),
          });
        },

        updatePersonalInfo: (info) => {
          const current = get().resume;
          set({
            history: pushHistory(current),
            resume: {
              ...current,
              lastModified: Date.now(),
              personalInfo: {
                ...current.personalInfo,
                ...info,
              },
            },
            isDirty: true,
            lastSavedAt: Date.now(),
          });
        },

        // Experience
        addExperience: (item) => {
          const current = get().resume;
          const newItem: ExperienceItem = {
            id: generateId(),
            title: item?.title || 'Job Title',
            company: item?.company || 'Company Name',
            location: item?.location || 'City, Country',
            startDate: item?.startDate || '2022',
            endDate: item?.endDate || 'Present',
            current: item?.current ?? true,
            description: item?.description || '',
            highlights: item?.highlights || ['Accomplished XYZ as measured by ABC by doing DEF.'],
          };
          set({
            history: pushHistory(current),
            resume: {
              ...current,
              lastModified: Date.now(),
              experience: [newItem, ...current.experience],
            },
            isDirty: true,
            lastSavedAt: Date.now(),
          });
        },

        updateExperience: (id, item) => {
          const current = get().resume;
          set({
            history: pushHistory(current),
            resume: {
              ...current,
              lastModified: Date.now(),
              experience: current.experience.map((exp) =>
                exp.id === id ? { ...exp, ...item } : exp
              ),
            },
            isDirty: true,
            lastSavedAt: Date.now(),
          });
        },

        removeExperience: (id) => {
          const current = get().resume;
          set({
            history: pushHistory(current),
            resume: {
              ...current,
              lastModified: Date.now(),
              experience: current.experience.filter((exp) => exp.id !== id),
            },
            isDirty: true,
            lastSavedAt: Date.now(),
          });
        },

        reorderExperience: (items) => {
          const current = get().resume;
          set({
            history: pushHistory(current),
            resume: {
              ...current,
              lastModified: Date.now(),
              experience: items,
            },
            isDirty: true,
            lastSavedAt: Date.now(),
          });
        },

        // Education
        addEducation: (item) => {
          const current = get().resume;
          const newItem: EducationItem = {
            id: generateId(),
            degree: item?.degree || 'Bachelor of Science in Computer Science',
            fieldOfStudy: item?.fieldOfStudy || 'Software Engineering',
            institution: item?.institution || 'University Name',
            location: item?.location || 'City, State',
            startDate: item?.startDate || '2018',
            endDate: item?.endDate || '2022',
            current: item?.current ?? false,
            gpa: item?.gpa || '3.8 / 4.0',
            honors: item?.honors || '',
          };
          set({
            history: pushHistory(current),
            resume: {
              ...current,
              lastModified: Date.now(),
              education: [newItem, ...current.education],
            },
            isDirty: true,
            lastSavedAt: Date.now(),
          });
        },

        updateEducation: (id, item) => {
          const current = get().resume;
          set({
            history: pushHistory(current),
            resume: {
              ...current,
              lastModified: Date.now(),
              education: current.education.map((edu) =>
                edu.id === id ? { ...edu, ...item } : edu
              ),
            },
            isDirty: true,
            lastSavedAt: Date.now(),
          });
        },

        removeEducation: (id) => {
          const current = get().resume;
          set({
            history: pushHistory(current),
            resume: {
              ...current,
              lastModified: Date.now(),
              education: current.education.filter((edu) => edu.id !== id),
            },
            isDirty: true,
            lastSavedAt: Date.now(),
          });
        },

        reorderEducation: (items) => {
          const current = get().resume;
          set({
            history: pushHistory(current),
            resume: {
              ...current,
              lastModified: Date.now(),
              education: items,
            },
            isDirty: true,
            lastSavedAt: Date.now(),
          });
        },

        // Skills
        addSkillCategory: (category) => {
          const current = get().resume;
          const newCategory: SkillCategory = {
            id: generateId(),
            category: category?.category || 'Technical Skills',
            skills: category?.skills || ['JavaScript', 'React', 'Node.js'],
          };
          set({
            history: pushHistory(current),
            resume: {
              ...current,
              lastModified: Date.now(),
              skills: [...current.skills, newCategory],
            },
            isDirty: true,
            lastSavedAt: Date.now(),
          });
        },

        updateSkillCategory: (id, category) => {
          const current = get().resume;
          set({
            history: pushHistory(current),
            resume: {
              ...current,
              lastModified: Date.now(),
              skills: current.skills.map((cat) =>
                cat.id === id ? { ...cat, ...category } : cat
              ),
            },
            isDirty: true,
            lastSavedAt: Date.now(),
          });
        },

        removeSkillCategory: (id) => {
          const current = get().resume;
          set({
            history: pushHistory(current),
            resume: {
              ...current,
              lastModified: Date.now(),
              skills: current.skills.filter((cat) => cat.id !== id),
            },
            isDirty: true,
            lastSavedAt: Date.now(),
          });
        },

        // Projects
        addProject: (item) => {
          const current = get().resume;
          const newItem: ProjectItem = {
            id: generateId(),
            title: item?.title || 'Open Source Project',
            subtitle: item?.subtitle || 'Full-Stack Web App',
            link: item?.link || 'https://github.com/project',
            github: item?.github || 'github.com/username/project',
            startDate: item?.startDate || '2023',
            endDate: item?.endDate || '2023',
            description: item?.description || 'Built an interactive tool used by 1,000+ developers.',
            technologies: item?.technologies || ['React', 'TypeScript', 'Tailwind CSS'],
            highlights: item?.highlights || ['Optimized performance and load times by 40%.'],
          };
          set({
            history: pushHistory(current),
            resume: {
              ...current,
              lastModified: Date.now(),
              projects: [newItem, ...current.projects],
            },
            isDirty: true,
            lastSavedAt: Date.now(),
          });
        },

        updateProject: (id, item) => {
          const current = get().resume;
          set({
            history: pushHistory(current),
            resume: {
              ...current,
              lastModified: Date.now(),
              projects: current.projects.map((proj) =>
                proj.id === id ? { ...proj, ...item } : proj
              ),
            },
            isDirty: true,
            lastSavedAt: Date.now(),
          });
        },

        removeProject: (id) => {
          const current = get().resume;
          set({
            history: pushHistory(current),
            resume: {
              ...current,
              lastModified: Date.now(),
              projects: current.projects.filter((proj) => proj.id !== id),
            },
            isDirty: true,
            lastSavedAt: Date.now(),
          });
        },

        reorderProjects: (items) => {
          const current = get().resume;
          set({
            history: pushHistory(current),
            resume: {
              ...current,
              lastModified: Date.now(),
              projects: items,
            },
            isDirty: true,
            lastSavedAt: Date.now(),
          });
        },

        // Certifications
        addCertification: (item) => {
          const current = get().resume;
          const newItem: CertificationItem = {
            id: generateId(),
            name: item?.name || 'Certification Name',
            issuer: item?.issuer || 'Issuing Body (e.g. AWS, Google)',
            issueDate: item?.issueDate || '2023',
            expiryDate: item?.expiryDate || '',
            credentialId: item?.credentialId || '',
            url: item?.url || '',
          };
          set({
            history: pushHistory(current),
            resume: {
              ...current,
              lastModified: Date.now(),
              certifications: [...current.certifications, newItem],
            },
            isDirty: true,
            lastSavedAt: Date.now(),
          });
        },

        updateCertification: (id, item) => {
          const current = get().resume;
          set({
            history: pushHistory(current),
            resume: {
              ...current,
              lastModified: Date.now(),
              certifications: current.certifications.map((cert) =>
                cert.id === id ? { ...cert, ...item } : cert
              ),
            },
            isDirty: true,
            lastSavedAt: Date.now(),
          });
        },

        removeCertification: (id) => {
          const current = get().resume;
          set({
            history: pushHistory(current),
            resume: {
              ...current,
              lastModified: Date.now(),
              certifications: current.certifications.filter((cert) => cert.id !== id),
            },
            isDirty: true,
            lastSavedAt: Date.now(),
          });
        },

        // Languages
        addLanguage: (item) => {
          const current = get().resume;
          const newItem: LanguageItem = {
            id: generateId(),
            language: item?.language || 'Language',
            proficiency: item?.proficiency || 'Professional',
          };
          set({
            history: pushHistory(current),
            resume: {
              ...current,
              lastModified: Date.now(),
              languages: [...current.languages, newItem],
            },
            isDirty: true,
            lastSavedAt: Date.now(),
          });
        },

        updateLanguage: (id, item) => {
          const current = get().resume;
          set({
            history: pushHistory(current),
            resume: {
              ...current,
              lastModified: Date.now(),
              languages: current.languages.map((l) =>
                l.id === id ? { ...l, ...item } : l
              ),
            },
            isDirty: true,
            lastSavedAt: Date.now(),
          });
        },

        removeLanguage: (id) => {
          const current = get().resume;
          set({
            history: pushHistory(current),
            resume: {
              ...current,
              lastModified: Date.now(),
              languages: current.languages.filter((l) => l.id !== id),
            },
            isDirty: true,
            lastSavedAt: Date.now(),
          });
        },

        // Achievements
        addAchievement: (item) => {
          const current = get().resume;
          const newItem: AchievementItem = {
            id: generateId(),
            title: item?.title || 'Notable Award or Recognition',
            date: item?.date || '2023',
            description: item?.description || 'Honored for exceptional technical leadership and innovation.',
          };
          set({
            history: pushHistory(current),
            resume: {
              ...current,
              lastModified: Date.now(),
              achievements: [...current.achievements, newItem],
            },
            isDirty: true,
            lastSavedAt: Date.now(),
          });
        },

        updateAchievement: (id, item) => {
          const current = get().resume;
          set({
            history: pushHistory(current),
            resume: {
              ...current,
              lastModified: Date.now(),
              achievements: current.achievements.map((ach) =>
                ach.id === id ? { ...ach, ...item } : ach
              ),
            },
            isDirty: true,
            lastSavedAt: Date.now(),
          });
        },

        removeAchievement: (id) => {
          const current = get().resume;
          set({
            history: pushHistory(current),
            resume: {
              ...current,
              lastModified: Date.now(),
              achievements: current.achievements.filter((ach) => ach.id !== id),
            },
            isDirty: true,
            lastSavedAt: Date.now(),
          });
        },

        // Custom Sections
        addCustomSection: (title) => {
          const current = get().resume;
          const newSection: CustomSection = {
            id: generateId(),
            sectionTitle: title || 'Additional Experience & Leadership',
            items: [
              {
                id: generateId(),
                title: 'Section Item Title',
                subtitle: 'Organization or Role',
                date: '2023',
                description: 'Key highlights, outcomes, and responsibilities.',
              },
            ],
          };
          set({
            history: pushHistory(current),
            resume: {
              ...current,
              lastModified: Date.now(),
              customSections: [...current.customSections, newSection],
            },
            isDirty: true,
            lastSavedAt: Date.now(),
          });
        },

        updateCustomSection: (id, section) => {
          const current = get().resume;
          set({
            history: pushHistory(current),
            resume: {
              ...current,
              lastModified: Date.now(),
              customSections: current.customSections.map((sec) =>
                sec.id === id ? { ...sec, ...section } : sec
              ),
            },
            isDirty: true,
            lastSavedAt: Date.now(),
          });
        },

        removeCustomSection: (id) => {
          const current = get().resume;
          set({
            history: pushHistory(current),
            resume: {
              ...current,
              lastModified: Date.now(),
              customSections: current.customSections.filter((sec) => sec.id !== id),
            },
            isDirty: true,
            lastSavedAt: Date.now(),
          });
        },

        addCustomSectionItem: (sectionId) => {
          const current = get().resume;
          set({
            history: pushHistory(current),
            resume: {
              ...current,
              lastModified: Date.now(),
              customSections: current.customSections.map((sec) => {
                if (sec.id !== sectionId) return sec;
                return {
                  ...sec,
                  items: [
                    ...sec.items,
                    {
                      id: generateId(),
                      title: 'Item Title',
                      subtitle: '',
                      date: '2023',
                      description: 'Description of key milestone or engagement.',
                    },
                  ],
                };
              }),
            },
            isDirty: true,
            lastSavedAt: Date.now(),
          });
        },

        removeCustomSectionItem: (sectionId, itemId) => {
          const current = get().resume;
          set({
            history: pushHistory(current),
            resume: {
              ...current,
              lastModified: Date.now(),
              customSections: current.customSections.map((sec) => {
                if (sec.id !== sectionId) return sec;
                return {
                  ...sec,
                  items: sec.items.filter((item) => item.id !== itemId),
                };
              }),
            },
            isDirty: true,
            lastSavedAt: Date.now(),
          });
        },

        // Section Ordering & Visibility
        reorderSections: (newOrder) => {
          const current = get().resume;
          set({
            history: pushHistory(current),
            resume: {
              ...current,
              lastModified: Date.now(),
              sectionOrder: newOrder,
            },
            isDirty: true,
            lastSavedAt: Date.now(),
          });
        },

        toggleSectionVisibility: (sectionKey) => {
          const current = get().resume;
          const currentVal = current.sectionVisibility[sectionKey] ?? true;
          set({
            history: pushHistory(current),
            resume: {
              ...current,
              lastModified: Date.now(),
              sectionVisibility: {
                ...current.sectionVisibility,
                [sectionKey]: !currentVal,
              },
            },
            isDirty: true,
            lastSavedAt: Date.now(),
          });
        },

        // Global / UI Actions
        setActiveSection: (section) => set({ activeSection: section }),
        setActiveMobileTab: (tab) => set({ activeMobileTab: tab }),
        setJobDescriptionText: (text) => set({ jobDescriptionText: text }),

        // History
        undo: () => {
          const { history, resume } = get();
          if (history.past.length === 0) return;
          const previous = history.past[history.past.length - 1];
          const newPast = history.past.slice(0, history.past.length - 1);
          set({
            resume: previous,
            history: {
              past: newPast,
              future: [resume, ...history.future],
            },
            isDirty: true,
            lastSavedAt: Date.now(),
          });
        },

        redo: () => {
          const { history, resume } = get();
          if (history.future.length === 0) return;
          const next = history.future[0];
          const newFuture = history.future.slice(1);
          set({
            resume: next,
            history: {
              past: [...history.past, resume],
              future: newFuture,
            },
            isDirty: true,
            lastSavedAt: Date.now(),
          });
        },

        canUndo: () => get().history.past.length > 0,
        canRedo: () => get().history.future.length > 0,

        // Sample / Clear / Library
        loadSampleData: () => {
          const current = get().resume;
          const sample = {
            ...SAMPLE_RESUME,
            id: generateId(),
            title: 'Senior Software Engineer (Sample)',
            lastModified: Date.now(),
          };
          set({
            history: pushHistory(current),
            resume: sample,
            isDirty: true,
            lastSavedAt: Date.now(),
          });
        },

        clearResume: () => {
          const current = get().resume;
          const blank = {
            ...BLANK_RESUME,
            id: generateId(),
            title: 'My Clean Resume',
            lastModified: Date.now(),
          };
          set({
            history: pushHistory(current),
            resume: blank,
            isDirty: true,
            lastSavedAt: Date.now(),
          });
        },

        saveCurrentToLibrary: () => {
          const current = get().resume;
          const { savedResumes } = get();
          const existingIdx = savedResumes.findIndex((r) => r.id === current.id);
          let updated: ResumeData[];
          if (existingIdx >= 0) {
            updated = [...savedResumes];
            updated[existingIdx] = { ...current, lastModified: Date.now() };
          } else {
            updated = [{ ...current, lastModified: Date.now() }, ...savedResumes];
          }
          set({ savedResumes: updated, isDirty: false, lastSavedAt: Date.now() });
        },

        loadFromLibrary: (id: string) => {
          const { savedResumes, resume: current } = get();
          const target = savedResumes.find((r) => r.id === id);
          if (target) {
            set({
              history: pushHistory(current),
              resume: JSON.parse(JSON.stringify(target)),
              isDirty: false,
              lastSavedAt: Date.now(),
            });
          }
        },

        duplicateResume: (id: string) => {
          const { savedResumes } = get();
          const target = savedResumes.find((r) => r.id === id);
          if (target) {
            const copy: ResumeData = {
              ...JSON.parse(JSON.stringify(target)),
              id: generateId(),
              title: `${target.title} (Copy)`,
              lastModified: Date.now(),
            };
            set({ savedResumes: [copy, ...savedResumes] });
          }
        },

        deleteFromLibrary: (id: string) => {
          const { savedResumes } = get();
          const filtered = savedResumes.filter((r) => r.id !== id);
          set({ savedResumes: filtered });
        },

        renameResume: (id: string, newTitle: string) => {
          const { savedResumes, resume: current } = get();
          const updated = savedResumes.map((r) =>
            r.id === id ? { ...r, title: newTitle, lastModified: Date.now() } : r
          );
          set({
            savedResumes: updated,
            resume: current.id === id ? { ...current, title: newTitle } : current,
          });
        },
      };
    },
    {
      name: 'craftcv_resume_storage_v1',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        resume: state.resume,
        savedResumes: state.savedResumes,
        jobDescriptionText: state.jobDescriptionText,
      }),
    }
  )
);
