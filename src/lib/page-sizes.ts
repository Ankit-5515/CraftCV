import { PageSizeId, MarginPreset } from '@/types/resume';

export interface PageSizeConfig {
  id: PageSizeId;
  name: string;
  shortLabel: string;
  dimensionsLabel: string;
  widthMm: number;
  heightMm: number;
  widthPx: number;  // at 96 DPI (1mm = 3.779527559px)
  heightPx: number; // at 96 DPI
  scaleFactor: number; // relative to A4 width (210mm)
  isPosterSize: boolean;
  recommendationNote?: string;
}

export const PAGE_SIZES: Record<PageSizeId, PageSizeConfig> = {
  A4: {
    id: 'A4',
    name: 'A4 (Standard)',
    shortLabel: 'A4',
    dimensionsLabel: '210 × 297 mm',
    widthMm: 210,
    heightMm: 297,
    widthPx: 794,
    heightPx: 1123,
    scaleFactor: 1,
    isPosterSize: false,
  },
  Letter: {
    id: 'Letter',
    name: 'Letter (US)',
    shortLabel: 'Letter (US)',
    dimensionsLabel: '215.9 × 279.4 mm (8.5 × 11 in)',
    widthMm: 215.9,
    heightMm: 279.4,
    widthPx: 816,
    heightPx: 1056,
    scaleFactor: 1,
    isPosterSize: false,
  },
  Legal: {
    id: 'Legal',
    name: 'Legal (US)',
    shortLabel: 'Legal (US)',
    dimensionsLabel: '215.9 × 355.6 mm (8.5 × 14 in)',
    widthMm: 215.9,
    heightMm: 355.6,
    widthPx: 816,
    heightPx: 1344,
    scaleFactor: 1,
    isPosterSize: false,
  },
  A5: {
    id: 'A5',
    name: 'A5 (Compact)',
    shortLabel: 'A5',
    dimensionsLabel: '148 × 210 mm',
    widthMm: 148,
    heightMm: 210,
    widthPx: 559,
    heightPx: 794,
    scaleFactor: 0.705,
    isPosterSize: false,
  },
  A3: {
    id: 'A3',
    name: 'A3 (Large Poster)',
    shortLabel: 'A3',
    dimensionsLabel: '297 × 420 mm',
    widthMm: 297,
    heightMm: 420,
    widthPx: 1123,
    heightPx: 1587,
    scaleFactor: 1.414,
    isPosterSize: true,
    recommendationNote: 'A3 is poster-size. A4 or Letter is recommended for job applications.',
  },
  A2: {
    id: 'A2',
    name: 'A2 (Extra Large Poster)',
    shortLabel: 'A2',
    dimensionsLabel: '420 × 594 mm',
    widthMm: 420,
    heightMm: 594,
    widthPx: 1587,
    heightPx: 2245,
    scaleFactor: 2.0,
    isPosterSize: true,
    recommendationNote: 'A2 is poster-size. A4 or Letter is recommended for job applications.',
  },
};

export const PAGE_SIZE_LIST: PageSizeConfig[] = [
  PAGE_SIZES.A4,
  PAGE_SIZES.Letter,
  PAGE_SIZES.Legal,
  PAGE_SIZES.A5,
  PAGE_SIZES.A3,
  PAGE_SIZES.A2,
];

export function getPageSizeConfig(pageSize?: PageSizeId | string): PageSizeConfig {
  if (pageSize && pageSize in PAGE_SIZES) {
    return PAGE_SIZES[pageSize as PageSizeId];
  }
  return PAGE_SIZES.A4;
}

export interface MarginConfig {
  id: MarginPreset;
  label: string;
  paddingMm: number;
  paddingPx: number; // base padding at scaleFactor = 1.0
}

export const MARGIN_PRESETS: Record<MarginPreset, MarginConfig> = {
  narrow: {
    id: 'narrow',
    label: 'Narrow',
    paddingMm: 10,
    paddingPx: 38,
  },
  normal: {
    id: 'normal',
    label: 'Normal',
    paddingMm: 15,
    paddingPx: 56,
  },
  wide: {
    id: 'wide',
    label: 'Wide',
    paddingMm: 21,
    paddingPx: 80,
  },
};

export function getMarginConfig(margin?: MarginPreset | 'compact' | 'spacious' | string): MarginConfig {
  if (margin === 'narrow' || margin === 'compact') return MARGIN_PRESETS.narrow;
  if (margin === 'wide' || margin === 'spacious') return MARGIN_PRESETS.wide;
  return MARGIN_PRESETS.normal;
}
