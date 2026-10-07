import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
}

export function formatDate(dateString: string): string {
  if (!dateString) return '';
  // Check if already in 'MMM YYYY' or 'YYYY' format
  if (/^[A-Za-z]+\s+\d{4}$/.test(dateString) || /^\d{4}$/.test(dateString)) {
    return dateString;
  }
  // Try parsing YYYY-MM
  const parts = dateString.split('-');
  if (parts.length >= 2) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthIdx = parseInt(parts[1], 10) - 1;
    if (monthIdx >= 0 && monthIdx < 12) {
      return `${months[monthIdx]} ${parts[0]}`;
    }
  }
  return dateString;
}

export function getInitials(name: string): string {
  if (!name) return 'CV';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
