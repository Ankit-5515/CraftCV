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

export const ModernMinimalTemplate: React.FC<TemplateProps> = ({
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
    customSections,
    sectionVisibility,
  } = resume;
  const fontClass = getFontClass(settings.fontFamily);
  const size = getSizeClasses(settings.fontSize);
  const spacing = getSpacingClasses(settings.spacing, settings.margins);
  const accent = settings.accentColor || '#2563eb';

  return (
    <div
      className={`a4-page ${fontClass} ${size.root} ${spacing.pagePadding} text-[#111827] bg-[#FFFFFF]`}
      data-resume-canvas="true"
    >
      {/* Header */}
      <header
        className={`pb-4 border-b border-[#CBD5E1] ${spacing.sectionGap} cursor-pointer rounded`}
        onClick={() => onSelectSection?.('personal')}
      >
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-1 flex-1 min-w-0">
            <h1 className={`${size.name} font-extrabold text-[#111827]`}>
              {personalInfo.fullName || 'Your Name'}
            </h1>
            {personalInfo.jobTitle && (
              <p
                className={`${size.title} font-semibold uppercase tracking-wider`}
                style={{ color: accent }}
              >
                {personalInfo.jobTitle}
              </p>
            )}
          </div>
          {settings.showPhoto && personalInfo.photoUrl && (
            <img
              src={personalInfo.photoUrl}
              alt={personalInfo.fullName}
              className="w-16 h-16 rounded-full object-cover border-2 shrink-0"
              style={{ borderColor: accent }}
            />
          )}
        </div>

        <ContactLine
          align="left"
          className={`${size.meta} mt-2.5`}
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
          className={`${spacing.sectionGap} cursor-pointer rounded`}
          onClick={() => onSelectSection?.('summary')}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-1.5 h-4 rounded-full shrink-0" style={{ backgroundColor: accent }} />
            <h2 className={`${size.sectionHeading} font-bold text-[#111827] uppercase tracking-wider`}>
              Professional Summary
            </h2>
          </div>
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
          <div className="flex items-center gap-2 mb-2.5">
            <span className="w-1.5 h-4 rounded-full shrink-0" style={{ backgroundColor: accent }} />
            <h2 className={`${size.sectionHeading} font-bold text-[#111827] uppercase tracking-wider`}>
              Experience
            </h2>
          </div>
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
                  dateClassName={`${size.meta} font-semibold text-[#374151]`}
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

      {/* Skills */}
      {skills.length > 0 && sectionVisibility.skills && (
        <section
          className={`${spacing.sectionGap} cursor-pointer rounded`}
          onClick={() => onSelectSection?.('skills')}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-4 rounded-full shrink-0" style={{ backgroundColor: accent }} />
            <h2 className={`${size.sectionHeading} font-bold text-[#111827] uppercase tracking-wider`}>
              Skills & Expertise
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

      {/* Projects */}
      {projects.length > 0 && sectionVisibility.projects && (
        <section
          className={`${spacing.sectionGap} cursor-pointer rounded`}
          onClick={() => onSelectSection?.('projects')}
        >
          <div className="flex items-center gap-2 mb-2.5">
            <span className="w-1.5 h-4 rounded-full shrink-0" style={{ backgroundColor: accent }} />
            <h2 className={`${size.sectionHeading} font-bold text-[#111827] uppercase tracking-wider`}>
              Projects
            </h2>
          </div>
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
                    subtitleClassName={`${size.meta} font-medium text-[#4B5563]`}
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
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-4 rounded-full shrink-0" style={{ backgroundColor: accent }} />
            <h2 className={`${size.sectionHeading} font-bold text-[#111827] uppercase tracking-wider`}>
              Education
            </h2>
          </div>
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
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-4 rounded-full shrink-0" style={{ backgroundColor: accent }} />
            <h2 className={`${size.sectionHeading} font-bold text-[#111827] uppercase tracking-wider`}>
              Certifications
            </h2>
          </div>
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

      {/* Achievements */}
      {achievements.length > 0 && sectionVisibility.achievements && (
        <section
          className={`${spacing.sectionGap} cursor-pointer rounded`}
          onClick={() => onSelectSection?.('achievements')}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-4 rounded-full shrink-0" style={{ backgroundColor: accent }} />
            <h2 className={`${size.sectionHeading} font-bold text-[#111827] uppercase tracking-wider`}>
              Achievements
            </h2>
          </div>
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

      {/* Languages */}
      {languages.length > 0 && sectionVisibility.languages && (
        <section
          className={`${spacing.sectionGap} cursor-pointer rounded`}
          onClick={() => onSelectSection?.('languages')}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-1.5 h-4 rounded-full shrink-0" style={{ backgroundColor: accent }} />
            <h2 className={`${size.sectionHeading} font-bold text-[#111827] uppercase tracking-wider`}>
              Languages
            </h2>
          </div>
          <p className={`${size.body} text-[#1F2937]`}>
            {languages.map((l) => `${l.language} (${l.proficiency})`).join(' • ')}
          </p>
        </section>
      )}

      {/* Custom Sections */}
      {customSections.length > 0 && sectionVisibility.custom && (
        <div className="space-y-3">
          {customSections.map((sec) => (
            <section
              key={sec.id}
              className="cursor-pointer rounded"
              onClick={() => onSelectSection?.('custom')}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="w-1.5 h-4 rounded-full shrink-0" style={{ backgroundColor: accent }} />
                <h2 className={`${size.sectionHeading} font-bold text-[#111827] uppercase tracking-wider`}>
                  {sec.sectionTitle}
                </h2>
              </div>
              <div className="space-y-2">
                {sec.items.map((item) => (
                  <div key={item.id} className="page-break-avoid">
                    <EntryRow
                      title={item.title}
                      subtitle={item.subtitle}
                      date={item.date ? formatDate(item.date) : undefined}
                      titleClassName={`${size.itemHeading} font-bold text-[#111827]`}
                      subtitleClassName={`${size.meta} font-medium text-[#374151]`}
                      dateClassName={`${size.meta} font-medium text-[#4B5563]`}
                    />
                    {item.description && (
                      <p className={`${size.body} text-[#1F2937] mt-0.5`}>
                        {item.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
};
