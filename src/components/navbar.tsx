'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileText, LayoutGrid, FolderOpen, ArrowRight, Cloud } from 'lucide-react';
import { Button } from './ui/button';
import { ThemeToggle } from './ui/theme-toggle';
import { isSupabaseConfigured } from '@/lib/supabase';

export const Navbar: React.FC = () => {
  const pathname = usePathname();

  const navLinks = [
    { name: '1. Choose template', href: '/templates', icon: LayoutGrid },
    { name: '2. Edit & preview', href: '/editor', icon: FileText },
    { name: 'Saved resumes', href: '/resumes', icon: FolderOpen },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--border)] bg-[var(--surface)] transition-colors duration-150">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center text-white font-bold text-sm">
            CV
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold tracking-tight text-lg text-[var(--text)]">
              Craft<span className="text-[var(--accent)]">CV</span>
            </span>
            <span className="hidden sm:inline-flex px-2 py-0.5 rounded text-[11px] font-semibold bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--border)]">
              Free • No watermark
            </span>
          </div>
        </Link>

        {/* Links */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-[var(--accent)] bg-[var(--accent-soft)] font-semibold'
                    : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-muted)]'
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA & Theme Toggle */}
        <div className="flex items-center gap-2.5">
          {isSupabaseConfigured && (
            <Link href="/login" className="hidden sm:inline-flex">
              <button className="text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text)] px-2.5 py-1.5 rounded-lg hover:bg-[var(--surface-muted)] transition-colors flex items-center gap-1.5 cursor-pointer">
                <Cloud className="w-3.5 h-3.5" />
                <span>Account</span>
              </button>
            </Link>
          )}

          <Link href="/editor">
            <Button variant="primary" size="sm">
              <span>Build My Resume</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

