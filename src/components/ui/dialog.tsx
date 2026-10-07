'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Content Modal */}
      <div
        className={cn(
          'relative w-full max-w-xl rounded-xl bg-[var(--surface)] border border-[var(--border)] p-6 shadow-lg z-10 text-[var(--text)] dialog-content-root',
          className
        )}
      >
        <div className="flex items-start justify-between pb-3 border-b border-[var(--border)]">
          <div>
            <h2 className="text-lg font-bold text-[var(--text)]">{title}</h2>
            {description && <p className="text-sm text-[var(--text-muted)] mt-1">{description}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-muted)] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
            <span>Close</span>
          </button>
        </div>

        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
};
