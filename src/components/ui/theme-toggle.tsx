'use client';

import React from 'react';
import { useTheme } from '@/components/theme-provider';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors duration-150 border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--text)] hover:border-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] cursor-pointer ${
        className || ''
      }`}
      title={theme === 'dark' ? 'Switch to Light theme' : 'Switch to Dark theme'}
      aria-label={theme === 'dark' ? 'Switch to Light theme' : 'Switch to Dark theme'}
    >
      {theme === 'dark' ? (
        <>
          <Sun className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Light</span>
        </>
      ) : (
        <>
          <Moon className="w-3.5 h-3.5 text-[var(--text-muted)]" />
          <span className="hidden sm:inline">Dark</span>
        </>
      )}
    </button>
  );
};
