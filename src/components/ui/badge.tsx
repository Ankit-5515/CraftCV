import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'purple' | 'outline';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  children,
  ...props
}) => {
  const variants = {
    default: 'bg-[var(--surface-muted)] text-[var(--text)] border-[var(--border)]',
    success: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700',
    warning: 'bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700',
    purple: 'bg-blue-50 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-700',
    outline: 'bg-transparent text-[var(--text)] border-[var(--border)]',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
