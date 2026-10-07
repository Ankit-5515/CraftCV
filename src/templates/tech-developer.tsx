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

export const TechDeveloperTemplate: React.FC<TemplateProps> = ({
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
    languages,
    achievements,
    sectionVisibility,
  } = resume;
  const fontClass = getFontClass(settings.fontFamily);
  const size = getSizeClasses(settings.fontSize);
  const spacing = getSpacingClasses(settings.spacing, settings.margins);
  const accent = settings.accentColor || '#0284c7';

  return (
    <div
      className={`a4-page ${fontClass} ${size.root} ${spacing.pagePadding} text-[#111827] bg-[#FFFFFF]`}
      data-resume-canvas="true"
    >
      {/* Header */}
      <header
        className={`border-b-2 border-[#0F172A] pb-3.5 ${spacing.sectionGap} cursor-pointer rounded`}
        onClick={() => onSelectSection?.('personal')}
      >
        <div className="flex justify-between items-baseline gap-4">
          <div className="flex-1 min-w-0">
            <h1 className={`${size.name} font-black text-[#111827]`}>
              {personalInfo.fullName || 'Developer Candidate'}
            </h1>
            {personalInfo.jobTitle && (
              <p className={`${size.title} font-bold text-[#374151] mt-0.5`}>
                {personalInfo.jobTitle}
              </p>
            )}
          </div>
          <div className="shrink-0">
            <span
              className="inline-block px-2.5 py-0.5 text-[calc(11px*var(--page-scale,1))] font-bold rounded bg-[#F1F5F9]"
              style={{ color: accent }}
            >
              ATS Verified
            </span>
          </div>
        </div>

        <ContactLine
          align="left"
          className={`${size.meta} mt-2`}
          textColor="#374151"
          separatorColor="#4B5563"
          items={[
            personalInfo.email,
            personalInfo.phone,
            personalInfo.location,
            personalInfo.github,
            personalInfo.linkedin,
            personalInfo.website,
          ]}
        />
      </header>

      {/* Skills Forward: Placed right after header */}
      {skills.length > 0 && sectionVisibility.skills && (
        <section
          className={`${spacing.sectionGap} cursor-pointer rounded p-2.5 bg-[#F8FAFC] border border-[#CBD5E1]`}
          onClick={() => onSelectSection?.('skills')}
        >
          <h2
            className={`${size.sectionHeading} font-bold uppercase tracking-wider text-[#111827] mb-2`}
            style={{ color: accent }}
          >
            Technical Skills & Stack
          </h2>
          <SkillsGrid
            skills={skills}
            bodyClass={size.body}
            labelColor="#111827"
            valueColor="#1F2937"
          />
        </section>
      )}

      {/* Summary */}
      {personalInfo.summary && sectionVisibility.summary && (
        <section
          className={`${spacing.sectionGap} cursor-pointer rounded`}
          onClick={() => onSelectSection?.('summary')}
        >
          <p className={`${size.body} text-[#1F2937]`}>
            {personalInfo.summary}
          </p>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && sectionVisibility.experience && (
        <section
          className={`${spacing.sectionGap} cursor-pointer rounded`}
          onClick={() => onSelectSection?.('experience')}
        >
          <h2
            className={`${size.sectionHeading} font-bold uppercase tracking-wider border-b-2 border-[#CBD5E1] pb-1 mb-2.5`}
            style={{ color: accent }}
          >
            Work Experience
          </h2>
          <div className="space-y-3">
            {experience.map((exp) => (
              <div key={exp.id} className="page-break-avoid">
                <EntryRow
                  title={exp.title}
                  subtitle={exp.company}
                  location={exp.location}
                  date={formatDateRange(exp.startDate, exp.endDate, exp.current)}
                  titleClassName={`${size.itemHeading} font-bold text-[#111827]`}
                  subtitleClassName={`${size.body} font-medium text-[#374151]`}
                  dateClassName={`${size.meta} font-medium text-[#4B5563]`}
                />
                {exp.description && (
                  <p className={`${size.body} text-[#374151] mt-0.5 mb-1`}>
                    {exp.description}
                  </p>
                )}
                {exp.highlights && exp.highlights.length > 0 && (
                  <BulletList
                    items={exp.highlights}
                    bodyClass={size.body}
                    gapClass={spacing.bulletGap}
                    markerColor={accent}
                    textColor="#1F2937"
                    className="mt-1"
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
          className={`${spacing.sectionGap} cursor-pointer rounded`}
          onClick={() => onSelectSection?.('projects')}
        >
          <h2
            className={`${size.sectionHeading} font-bold uppercase tracking-wider border-b-2 border-[#CBD5E1] pb-1 mb-2.5`}
            style={{ color: accent }}
          >
            Open Source & Engineering Projects
          </h2>
          <div className="space-y-3">
            {projects.map((proj) => {
              const linkMeta = [proj.link, proj.github].filter(Boolean).join(' • ');
              return (
                <div key={proj.id} className="page-break-avoid">
                  <EntryRow
                    title={proj.title}
                    subtitle={proj.subtitle}
                    extraMeta={linkMeta}
                    date={formatDateRange(proj.startDate, proj.endDate)}
                    titleClassName={`${size.itemHeading} font-bold text-[#111827]`}
                    subtitleClassName={`${size.meta} font-medium text-[#374151]`}
                    dateClassName={`${size.meta} font-medium text-[#4B5563]`}
                  />
                  {proj.technologies && proj.technologies.length > 0 && (
                    <p className={`${size.meta} text-[#4B5563] mt-0.5`}>
                      <span className="font-semibold text-[#111827]">{'Stack: '}</span>
                      <span>{proj.technologies.join(', ')}</span>
                    </p>
                  )}
                  {proj.description && (
                    <p className={`${size.body} text-[#1F2937] mt-0.5`}>
                      {proj.description}
                    </p>
                  )}
                  {proj.highlights && proj.highlights.length > 0 && (
                    <BulletList
                      items={proj.highlights}
                      bodyClass={size.body}
                      gapClass={spacing.bulletGap}
                      markerColor={accent}
                      textColor="#1F2937"
                      className="mt-1"
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
          className={`${spacing.sectionGap} cursor-pointer rounded`}
          onClick={() => onSelectSection?.('education')}
        >
          <h2
            className={`${size.sectionHeading} font-bold uppercase tracking-wider border-b-2 border-[#CBD5E1] pb-1 mb-2`}
            style={{ color: accent }}
          >
            Education
          </h2>
          <div className="space-y-2">
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
                    stackSubtitle={true}
                    titleClassName={`${size.itemHeading} font-bold text-[#111827]`}
                    subtitleClassName={`${size.meta} font-medium text-[#374151]`}
                    dateClassName={`${size.meta} font-medium text-[#4B5563]`}
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
          className={`${spacing.sectionGap} cursor-pointer rounded`}
          onClick={() => onSelectSection?.('certifications')}
        >
          <h2
            className={`${size.sectionHeading} font-bold uppercase tracking-wider border-b-2 border-[#CBD5E1] pb-1 mb-2`}
            style={{ color: accent }}
          >
            Certifications
          </h2>
          <div className="space-y-1.5">
            {certifications.map((c) => (
              <div key={c.id} className="page-break-avoid">
                <EntryRow
                  title={c.name}
                  subtitle={c.issuer}
                  date={c.issueDate ? formatDate(c.issueDate) : undefined}
                  titleClassName={`${size.body} font-bold text-[#111827]`}
                  subtitleClassName={`${size.body} font-medium text-[#374151]`}
                  dateClassName={`${size.meta} font-medium text-[#4B5563]`}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Achievements & Languages */}
      {achievements.length > 0 && sectionVisibility.achievements && (
        <section
          className={`${spacing.sectionGap} cursor-pointer rounded`}
          onClick={() => onSelectSection?.('achievements')}
        >
          <h2
            className={`${size.sectionHeading} font-bold uppercase tracking-wider border-b-2 border-[#CBD5E1] pb-1 mb-2`}
            style={{ color: accent }}
          >
            Achievements
          </h2>
          <div className="space-y-1.5">
            {achievements.map((a) => (
              <div key={a.id} className="page-break-avoid">
                <EntryRow
                  title={a.title}
                  subtitle={a.description}
                  date={a.date ? formatDate(a.date) : undefined}
                  titleClassName={`${size.body} font-bold text-[#111827]`}
                  subtitleClassName={`${size.body} text-[#1F2937]`}
                  dateClassName={`${size.meta} font-medium text-[#4B5563]`}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {languages.length > 0 && sectionVisibility.languages && (
        <section
          className="cursor-pointer rounded"
          onClick={() => onSelectSection?.('languages')}
        >
          <h2
            className={`${size.sectionHeading} font-bold uppercase tracking-wider border-b-2 border-[#CBD5E1] pb-1 mb-1.5`}
            style={{ color: accent }}
          >
            Languages
          </h2>
          <p className={`${size.body} text-[#1F2937]`}>
            {languages.map((l) => `${l.language} (${l.proficiency})`).join(' • ')}
          </p>
        </section>
      )}
    </div>
  );
};
