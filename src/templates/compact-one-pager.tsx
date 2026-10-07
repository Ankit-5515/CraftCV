'use client';

import React from 'react';
import { ResumeData } from '@/types/resume';
import { getFontClass, getSizeClasses, getSpacingClasses } from './template-helper';
import {
  ContactLine,
  EntryRow,
  SkillsGrid,
  BulletList,
  formatDateRange,
} from './resume-primitives';
import { formatDate } from '@/lib/utils';

interface TemplateProps {
  resume: ResumeData;
  onSelectSection?: (section: string) => void;
}

export const CompactOnePagerTemplate: React.FC<TemplateProps> = ({
  resume,
  onSelectSection,
}) => {
  const {
    settings,
    personalInfo,
    experience,
    education,
    skills,
    projects,
    certifications,
    sectionVisibility,
  } = resume;
  const fontClass = getFontClass(settings.fontFamily);
  const size = getSizeClasses('sm');
  const spacing = getSpacingClasses('compact', settings.margins);
  const accent = settings.accentColor || '#1e3a8a';

  return (
    <div
      className={`a4-page ${fontClass} ${size.root} ${spacing.pagePadding} text-[#111827] bg-[#FFFFFF]`}
      data-resume-canvas="true"
    >
      {/* Dense Header */}
      <header
        className="border-b border-[#CBD5E1] pb-2 mb-2.5 cursor-pointer rounded"
        onClick={() => onSelectSection?.('personal')}
      >
        <div className="flex flex-wrap justify-between items-baseline gap-x-4 gap-y-0.5">
          <h1
            className={`${size.name} font-black text-[#111827] uppercase shrink-0`}
            style={{ color: accent }}
          >
            {personalInfo.fullName || 'Candidate Name'}
          </h1>
          {personalInfo.jobTitle && (
            <p className={`${size.title} font-bold text-[#374151] uppercase`}>
              {personalInfo.jobTitle}
            </p>
          )}
        </div>

        <ContactLine
          align="left"
          className={`${size.meta} mt-1.5 pt-1 border-t border-[#E2E8F0]`}
          textColor="#374151"
          separatorColor="#4B5563"
          items={[
            personalInfo.email,
            personalInfo.phone,
            personalInfo.location,
            personalInfo.linkedin,
            personalInfo.github,
            personalInfo.website,
          ]}
        />
      </header>

      {/* Summary */}
      {personalInfo.summary && sectionVisibility.summary && (
        <section
          className="mb-2.5 cursor-pointer rounded"
          onClick={() => onSelectSection?.('summary')}
        >
          <p className={`text-[#1F2937] ${size.body}`}>
            {personalInfo.summary}
          </p>
        </section>
      )}

      {/* Skills Block */}
      {skills.length > 0 && sectionVisibility.skills && (
        <section
          className="mb-2.5 cursor-pointer rounded"
          onClick={() => onSelectSection?.('skills')}
        >
          <div className="border-b border-[#CBD5E1] pb-0.5 mb-1.5">
            <h2
              className={`${size.itemHeading} font-bold uppercase tracking-wider text-[#111827]`}
              style={{ color: accent }}
            >
              Key Technical Skills
            </h2>
          </div>
          <SkillsGrid
            skills={skills}
            bodyClass={size.body}
            labelColor="#111827"
            valueColor="#1F2937"
          />
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && sectionVisibility.experience && (
        <section
          className="mb-2.5 cursor-pointer rounded"
          onClick={() => onSelectSection?.('experience')}
        >
          <div className="border-b border-[#CBD5E1] pb-0.5 mb-1.5">
            <h2
              className={`${size.itemHeading} font-bold uppercase tracking-wider text-[#111827]`}
              style={{ color: accent }}
            >
              Work Experience
            </h2>
          </div>
          <div className="space-y-2">
            {experience.map((exp) => (
              <div key={exp.id} className="page-break-avoid">
                <EntryRow
                  title={exp.title}
                  subtitle={exp.company}
                  location={exp.location}
                  date={formatDateRange(exp.startDate, exp.endDate, exp.current)}
                  titleClassName={`font-bold text-[#111827] ${size.itemHeading}`}
                  subtitleClassName={`font-medium text-[#374151] ${size.body}`}
                  dateClassName={`${size.meta} text-[#4B5563] font-medium`}
                />
                {exp.highlights && exp.highlights.length > 0 && (
                  <BulletList
                    items={exp.highlights}
                    bodyClass={size.body}
                    gapClass="space-y-0.5"
                    markerColor="#111827"
                    textColor="#1F2937"
                    className="mt-0.5"
                  />
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && sectionVisibility.projects && (
        <section
          className="mb-2.5 cursor-pointer rounded"
          onClick={() => onSelectSection?.('projects')}
        >
          <div className="border-b border-[#CBD5E1] pb-0.5 mb-1.5">
            <h2
              className={`${size.itemHeading} font-bold uppercase tracking-wider text-[#111827]`}
              style={{ color: accent }}
            >
              Highlighted Projects
            </h2>
          </div>
          <div className="space-y-1.5">
            {projects.map((proj) => {
              const techStr =
                proj.technologies && proj.technologies.length > 0
                  ? proj.technologies.slice(0, 5).join(', ')
                  : undefined;
              const linkMeta = [proj.link, proj.github].filter(Boolean).join(' • ');
              return (
                <div key={proj.id} className={`page-break-avoid ${size.body}`}>
                  <EntryRow
                    title={proj.title}
                    subtitle={proj.subtitle}
                    location={techStr}
                    extraMeta={linkMeta}
                    date={formatDateRange(proj.startDate, proj.endDate)}
                    titleClassName={`font-bold text-[#111827] ${size.itemHeading}`}
                    subtitleClassName={`font-medium text-[#374151] ${size.meta}`}
                    dateClassName={`${size.meta} text-[#4B5563]`}
                  />
                  {proj.description && (
                    <p className="text-[#1F2937] mt-0.5">{proj.description}</p>
                  )}
                  {proj.highlights && proj.highlights.length > 0 && (
                    <BulletList
                      items={proj.highlights}
                      bodyClass={size.body}
                      gapClass="space-y-0.5"
                      markerColor="#111827"
                      textColor="#1F2937"
                      className="mt-0.5"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && sectionVisibility.education && (
        <section
          className="mb-2 cursor-pointer rounded"
          onClick={() => onSelectSection?.('education')}
        >
          <div className="border-b border-[#CBD5E1] pb-0.5 mb-1">
            <h2
              className={`${size.itemHeading} font-bold uppercase tracking-wider text-[#111827]`}
              style={{ color: accent }}
            >
              Education
            </h2>
          </div>
          <div className="space-y-1">
            {education.map((edu) => {
              const degreeLine = edu.fieldOfStudy
                ? `${edu.degree} in ${edu.fieldOfStudy}`
                : edu.degree;
              const extraParts = [
                edu.gpa ? `GPA ${edu.gpa}` : '',
                edu.honors ? edu.honors : '',
              ].filter(Boolean);

              return (
                <div key={edu.id} className="page-break-avoid">
                  <EntryRow
                    title={degreeLine}
                    subtitle={edu.institution}
                    location={edu.location}
                    extraMeta={extraParts.join(' • ')}
                    date={formatDateRange(edu.startDate, edu.endDate, edu.current)}
                    titleClassName={`font-bold text-[#111827] ${size.body}`}
                    subtitleClassName={`font-medium text-[#374151] ${size.meta}`}
                    dateClassName={`${size.meta} text-[#4B5563] font-medium`}
                  />
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Certifications */}
      {certifications.length > 0 && sectionVisibility.certifications && (
        <section
          className="mb-2 cursor-pointer rounded"
          onClick={() => onSelectSection?.('certifications')}
        >
          <div className="border-b border-[#CBD5E1] pb-0.5 mb-1">
            <h2
              className={`${size.itemHeading} font-bold uppercase tracking-wider text-[#111827]`}
              style={{ color: accent }}
            >
              Certifications & Credentials
            </h2>
          </div>
          <div className="space-y-1">
            {certifications.map((c) => (
              <div key={c.id} className="page-break-avoid">
                <EntryRow
                  title={c.name}
                  subtitle={c.issuer}
                  date={c.issueDate ? formatDate(c.issueDate) : undefined}
                  titleClassName={`font-bold text-[#111827] ${size.body}`}
                  subtitleClassName={`font-medium text-[#374151] ${size.meta}`}
                  dateClassName={`${size.meta} text-[#4B5563]`}
                />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
