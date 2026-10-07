import { FontFamily, FontSize, MarginPreset, Spacing } from '@/types/resume';

export function getFontClass(font: FontFamily): string {
  switch (font) {
    case 'lora':
      return 'font-lora';
    case 'source-sans':
      return 'font-source-sans';
    case 'merriweather':
      return 'font-merriweather';
    case 'inter':
    default:
      return 'font-inter';
  }
}

/**
 * Returns the exact pixel margin (at scaleFactor = 1.0) for the given margin preset and spacing,
 * multiplied by `scaleFactor` for the active page size.
 */
export function getEffectiveMarginPx(
  margins?: MarginPreset | 'compact' | 'spacious',
  spacing: Spacing = 'normal',
  scaleFactor = 1
): number {
  const effectiveMargin =
    margins === 'narrow' || margins === 'compact'
      ? 'narrow'
      : margins === 'wide' || margins === 'spacious'
      ? 'wide'
      : margins === 'normal'
      ? 'normal'
      : spacing === 'compact'
      ? 'narrow'
      : spacing === 'relaxed'
      ? 'wide'
      : 'normal';

  const basePx =
    effectiveMargin === 'narrow' ? 28 : effectiveMargin === 'wide' ? 54 : 40;

  return Math.round(basePx * scaleFactor);
}

/**
 * Uses integer base pixel sizes multiplied by `--page-scale` (1.0 on A4/Letter/Legal,
 * 0.705 on A5, 1.414 on A3, 2.0 on A2) with explicit unitless line-heights to prevent
 * sub-pixel font overlapping or clipping during PDF/Canvas export.
 */
export function getSizeClasses(size: FontSize) {
  switch (size) {
    case 'sm':
      return {
        root: 'text-[calc(12px*var(--page-scale,1))] leading-[1.45]',
        name: 'text-[calc(21px*var(--page-scale,1))] leading-[1.25]',
        title: 'text-[calc(12px*var(--page-scale,1))] leading-[1.4]',
        sectionHeading: 'text-[calc(13px*var(--page-scale,1))] leading-[1.4]',
        itemHeading: 'text-[calc(12px*var(--page-scale,1))] leading-[1.4]',
        body: 'text-[calc(11px*var(--page-scale,1))] leading-[1.45]',
        meta: 'text-[calc(10px*var(--page-scale,1))] leading-[1.45]',
      };
    case 'lg':
      return {
        root: 'text-[calc(14px*var(--page-scale,1))] leading-[1.5]',
        name: 'text-[calc(26px*var(--page-scale,1))] leading-[1.25]',
        title: 'text-[calc(15px*var(--page-scale,1))] leading-[1.4]',
        sectionHeading: 'text-[calc(16px*var(--page-scale,1))] leading-[1.4]',
        itemHeading: 'text-[calc(14px*var(--page-scale,1))] leading-[1.45]',
        body: 'text-[calc(13px*var(--page-scale,1))] leading-[1.5]',
        meta: 'text-[calc(12px*var(--page-scale,1))] leading-[1.45]',
      };
    case 'base':
    default:
      return {
        root: 'text-[calc(13px*var(--page-scale,1))] leading-[1.45]',
        name: 'text-[calc(23px*var(--page-scale,1))] leading-[1.25]',
        title: 'text-[calc(13px*var(--page-scale,1))] leading-[1.4]',
        sectionHeading: 'text-[calc(14px*var(--page-scale,1))] leading-[1.4]',
        itemHeading: 'text-[calc(13px*var(--page-scale,1))] leading-[1.45]',
        body: 'text-[calc(12px*var(--page-scale,1))] leading-[1.45]',
        meta: 'text-[calc(11px*var(--page-scale,1))] leading-[1.45]',
      };
  }
}

export function getSpacingClasses(
  spacing: Spacing,
  margins?: MarginPreset | 'compact' | 'spacious'
) {
  const effectiveMargin =
    margins === 'narrow' || margins === 'compact'
      ? 'narrow'
      : margins === 'wide' || margins === 'spacious'
      ? 'wide'
      : margins === 'normal'
      ? 'normal'
      : spacing === 'compact'
      ? 'narrow'
      : spacing === 'relaxed'
      ? 'wide'
      : 'normal';

  const pagePadding =
    effectiveMargin === 'narrow'
      ? 'p-[calc(28px*var(--page-scale,1))]'
      : effectiveMargin === 'wide'
      ? 'p-[calc(54px*var(--page-scale,1))]'
      : 'p-[calc(40px*var(--page-scale,1))]';

  switch (spacing) {
    case 'compact':
      return {
        pagePadding,
        sectionGap: 'mb-[calc(10px*var(--page-scale,1))]',
        itemGap: 'mb-[calc(8px*var(--page-scale,1))]',
        bulletGap: 'space-y-[calc(3px*var(--page-scale,1))]',
      };
    case 'relaxed':
      return {
        pagePadding,
        sectionGap: 'mb-[calc(18px*var(--page-scale,1))]',
        itemGap: 'mb-[calc(12px*var(--page-scale,1))]',
        bulletGap: 'space-y-[calc(6px*var(--page-scale,1))]',
      };
    case 'normal':
    default:
      return {
        pagePadding,
        sectionGap: 'mb-[calc(14px*var(--page-scale,1))]',
        itemGap: 'mb-[calc(10px*var(--page-scale,1))]',
        bulletGap: 'space-y-[calc(4px*var(--page-scale,1))]',
      };
  }
}
