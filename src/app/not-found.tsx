import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Sparkles } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#07080B] text-slate-900 dark:text-white flex flex-col items-center justify-center p-4 text-center transition-colors duration-200">
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center mb-6 shadow-xl shadow-violet-600/30">
        <Sparkles className="w-6 h-6 text-white" />
      </div>

      <span className="text-xs font-mono font-bold text-violet-600 dark:text-violet-400 uppercase tracking-widest mb-2">
        Error 404
      </span>

      <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4 font-playfair">
        Page Not Found
      </h1>

      <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mb-8 leading-relaxed">
        The page you are looking for doesn’t exist or has been moved. Head back to the studio to keep building your resume.
      </p>

      <div className="flex items-center gap-3">
        <Link href="/">
          <Button variant="secondary" size="md">
            <ArrowLeft className="w-4 h-4" />
            <span>Go to Home</span>
          </Button>
        </Link>
        <Link href="/editor">
          <Button variant="accent" size="md">
            <span>Open Resume Builder</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
