'use client';

import React from 'react';
import { formatDate } from '@/lib/utils';

/**
 * Format a start/end date range with guaranteed spaces around the en-dash (" – ").
 */
export function formatDateRange(
  startDate?: string,
  endDate?: string,
  current?: boolean
): string {
  const start = startDate ? formatDate(startDate).trim() : '';
  const end = current ? 'Present' : endDate ? formatDate(endDate).trim() : '';
  if (start && end) {
    return `${start} – ${end}`;
  }
  return start || end || '';
}

/**
 * Explicit separator component for header contact items with fixed spacing on both sides
 * and real surrounding spaces in the text node so PDF text extraction never glues tokens.
 */
export const ContactSeparator: React.FC<{ color?: string }> = ({
  color = '#4B5563',
}) => (
  <span
    data-contact-separator="true"
    style={{
      display: 'inline-block',
      marginLeft: 'calc(6px * var(--page-scale, 1))',
      marginRight: 'calc(6px * var(--page-scale, 1))',
      color,
      whiteSpace: 'pre',
    }}
  >
    {' • '}
  </span>
);

export interface ContactLineProps {
  items: Array<string | undefined | null>;
  align?: 'left' | 'center';
  className?: string;
  textColor?: string;
  separatorColor?: string;
}

/**
 * Shared Header Contact Line component:
 * Renders non-empty contact items joined by ContactSeparator with fixed spacing on both sides,
 * wrapping cleanly to a second line when long instead of overflowing or gluing text.
 */
export const ContactLine: React.FC<ContactLineProps> = ({
  items,
  align = 'left',
  className = '',
  textColor = '#374151',
  separatorColor = '#4B5563',
}) => {
  const validItems = items
    .map((item) => (item ? item.trim() : ''))
    .filter(Boolean);

  if (validItems.length === 0) return null;

  return (
    <div
      data-contact-line="true"
      className={`flex flex-wrap items-center ${
        align === 'center' ? 'justify-center' : 'justify-start'
      } gap-y-1 ${className}`}
      style={{
        color: textColor,
        boxSizing: 'border-box',
        overflowWrap: 'anywhere',
      }}
    >
      {validItems.map((item, idx) => {
        const isLast = idx === validItems.length - 1;
        const isUrl =
          item.startsWith('http://') ||
          item.startsWith('https://') ||
          item.includes('linkedin.com') ||
          item.includes('github.com');

        return (
          <React.Fragment key={`${idx}-${item}`}>
            <span
              data-contact-item="true"
              className={isUrl ? 'underline' : ''}
              style={{
                whiteSpace: 'nowrap',
                color: textColor,
              }}
            >
              {item}
            </span>
            {!isLast && <ContactSeparator color={separatorColor} />}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export interface EntryRowProps {
  /** Primary title (e.g., Job Title, Degree, Project Title, Certification Name) */
  title: string;
  /** Secondary organization / company / institution / issuer */
  subtitle?: string;
  /** Location string (rendered as " (Location)" with a guaranteed leading space) */
  location?: string;
  /** Extra metadata on the same or secondary line (e.g., "GPA 3.89 / 4.0") */
  extraMeta?: string;
  /** Right-aligned date range (rendered with white-space: nowrap and minimum 12px left gap) */
  date?: string;
  /** If true, places subtitle + location + extraMeta on a clean second line below the title row */
  stackSubtitle?: boolean;
  /** Separator between title and subtitle when inline (defaults to " — ") */
  separator?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  dateClassName?: string;
  className?: string;
}

/**
 * Shared, tested layout primitive for "entry rows":
 * Title — Company (Location) ........ Date
 * - Left block: { flex: 1, minWidth: 0, overflowWrap: 'anywhere' }
 * - Right date: { flexShrink: 0, whiteSpace: 'nowrap', marginLeft: '12px' }
 * - Guarantees spaces around separators (" — ", " (", " • ", " – ") so text never glues or overlaps.
 */
export const EntryRow: React.FC<EntryRowProps> = ({
  title,
  subtitle,
  location,
  extraMeta,
  date,
  stackSubtitle = false,
  separator = ' — ',
  titleClassName = 'font-bold text-[#111827]',
  subtitleClassName = 'font-medium text-[#374151]',
  dateClassName = 'font-medium text-[#4B5563]',
  className = '',
}) => {
  const cleanTitle = (title || '').trim();
  const cleanSubtitle = (subtitle || '').trim();
  const cleanLocation = (location || '').trim();
  const cleanExtra = (extraMeta || '').trim();
  const cleanDate = (date || '').trim();

  // Ensure separator always has leading and trailing spaces
  const normalizedSep = ` ${separator.trim()} `;

  // Build inline suffix with guaranteed spaces before "(" and around "•"
  const buildSuffixParts = (includeLeadingSep: boolean): string => {
    let result = '';
    if (cleanSubtitle) {
      result += includeLeadingSep ? `${normalizedSep}${cleanSubtitle}` : cleanSubtitle;
    }
    if (cleanLocation) {
      result += result || includeLeadingSep ? ` (${cleanLocation})` : `(${cleanLocation})`;
    }
    if (cleanExtra) {
      result += result || includeLeadingSep ? ` • ${cleanExtra}` : cleanExtra;
    }
    return result;
  };

  const inlineSuffix = !stackSubtitle ? buildSuffixParts(true) : '';
  const stackedLine = stackSubtitle ? buildSuffixParts(false) : '';

  return (
    <div
      data-entry-row="true"
      className={`w-full ${className}`}
      style={{ boxSizing: 'border-box' }}
    >
      <div
        className="flex items-baseline justify-between w-full"
        style={{
          gap: 'calc(12px * var(--page-scale, 1))',
          boxSizing: 'border-box',
        }}
      >
        <div
          data-entry-left="true"
          style={{
            flex: '1 1 0%',
            minWidth: 0,
            overflowWrap: 'anywhere',
            wordBreak: 'break-word',
            boxSizing: 'border-box',
          }}
        >
          <span className={titleClassName}>{cleanTitle}</span>
          {inlineSuffix && (
            <span className={subtitleClassName} style={{ whiteSpace: 'pre-wrap' }}>
              {inlineSuffix}
            </span>
          )}
        </div>

        {cleanDate && (
          <div
            data-entry-date="true"
            className={dateClassName}
            style={{
              flexShrink: 0,
              whiteSpace: 'nowrap',
              marginLeft: '12px',
              textAlign: 'right',
              boxSizing: 'border-box',
            }}
          >
            {cleanDate}
          </div>
        )}
      </div>

      {stackSubtitle && stackedLine && (
        <div
          data-entry-subrow="true"
          className={`${subtitleClassName} mt-0.5`}
          style={{
            overflowWrap: 'anywhere',
            wordBreak: 'break-word',
            boxSizing: 'border-box',
          }}
        >
          {stackedLine}
        </div>
      )}
    </div>
  );
};

export interface SkillsGridProps {
  skills: Array<{
    id: string;
    category: string;
    skills: string[];
  }>;
  bodyClass?: string;
  labelColor?: string;
  valueColor?: string;
  className?: string;
}

/**
 * Shared Skills Grid primitive:
 * Uses a 2-column layout with a fixed label column (max 28% width) and a flexible
 * value column (min 72% width) with comma-separated values that wrap naturally.
 */
export const SkillsGrid: React.FC<SkillsGridProps> = ({
  skills,
  bodyClass = '',
  labelColor = '#111827',
  valueColor = '#1F2937',
  className = '',
}) => {
  if (!skills || skills.length === 0) return null;

  return (
    <div
      data-skills-grid="true"
      className={`space-y-1.5 w-full ${className}`}
      style={{ boxSizing: 'border-box' }}
    >
      {skills.map((cat) => {
        const cleanCat = (cat.category || '').trim();
        const cleanSkills = (cat.skills || [])
          .map((s) => s.trim())
          .filter(Boolean)
          .join(', ');

        if (!cleanCat && !cleanSkills) return null;

        return (
          <div
            key={cat.id}
            data-skill-row="true"
            className={`page-break-avoid flex items-baseline w-full ${bodyClass}`}
            style={{
              gap: 'calc(10px * var(--page-scale, 1))',
              boxSizing: 'border-box',
              breakInside: 'avoid',
              pageBreakInside: 'avoid',
            }}
          >
            <div
              data-skill-label="true"
              className="font-bold"
              style={{
                width: '26%',
                maxWidth: '28%',
                flexShrink: 0,
                color: labelColor,
                overflowWrap: 'anywhere',
                wordBreak: 'break-word',
                boxSizing: 'border-box',
              }}
            >
              {`${cleanCat}: `}
            </div>
            <div
              data-skill-value="true"
              style={{
                flex: '1 1 0%',
                minWidth: 0,
                color: valueColor,
                overflowWrap: 'anywhere',
                wordBreak: 'break-word',
                boxSizing: 'border-box',
              }}
            >
              {cleanSkills}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export interface BulletListProps {
  items: string[];
  bodyClass?: string;
  gapClass?: string;
  markerColor?: string;
  textColor?: string;
  className?: string;
}

/**
 * Shared Bullets primitive:
 * Renders real list markers ("• ") with a hanging indent (marker outside the text block),
 * consistent in both preview and vector PDF export.
 */
export const BulletList: React.FC<BulletListProps> = ({
  items,
  bodyClass = '',
  gapClass = 'space-y-1',
  markerColor = '#111827',
  textColor = '#1F2937',
  className = '',
}) => {
  const validItems = (items || []).map((item) => item.trim()).filter(Boolean);
  if (validItems.length === 0) return null;

  return (
    <ul
      data-bullet-list="true"
      className={`list-none m-0 p-0 ${gapClass} ${className}`}
      style={{ boxSizing: 'border-box' }}
    >
      {validItems.map((item, idx) => (
        <li
          key={idx}
          data-bullet-item="true"
          className={`page-break-avoid flex items-start ${bodyClass}`}
          style={{
            boxSizing: 'border-box',
            breakInside: 'avoid',
            pageBreakInside: 'avoid',
          }}
        >
          <span
            data-bullet-marker="true"
            className="shrink-0 font-bold select-text"
            style={{
              width: 'calc(14px * var(--page-scale, 1))',
              minWidth: '10px',
              color: markerColor,
              lineHeight: 'inherit',
              whiteSpace: 'pre',
              boxSizing: 'border-box',
            }}
          >
            {'• '}
          </span>
          <span
            data-bullet-text="true"
            className="flex-1 min-w-0"
            style={{
              color: textColor,
              overflowWrap: 'anywhere',
              wordBreak: 'break-word',
              boxSizing: 'border-box',
            }}
          >
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
};
