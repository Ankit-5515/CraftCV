'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Mail, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !isSupabaseConfigured || !supabase) return;

    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/resumes`,
        },
      });

      if (error) {
        setStatusMessage(`Error: ${error.message}`);
      } else {
        setStatusMessage('Check your email for the sign-in link!');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to authenticate';
      setStatusMessage(`Error: ${msg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleAuth = async () => {
    if (!isSupabaseConfigured || !supabase) return;

    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/resumes`,
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col transition-colors duration-150">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md space-y-6">
          {/* Card Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--border)] mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Optional Cloud Backup</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text)]">
              {isSupabaseConfigured ? 'Save Your Resumes Online' : 'Local Browser Autosave Active'}
            </h1>
            <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto leading-relaxed">
              Signing in is <span className="text-[var(--text)] font-semibold">completely optional</span>. You can build and download resumes anytime without an account.
            </p>
          </div>

          {isSupabaseConfigured ? (
            <div className="p-6 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-5">
              {/* Google OAuth Button */}
              <button
                onClick={handleGoogleAuth}
                type="button"
                className="w-full py-2.5 px-4 rounded-lg bg-[var(--surface-muted)] hover:opacity-90 border border-[var(--border)] flex items-center justify-center gap-2.5 text-xs font-semibold text-[var(--text)] transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="flex items-center gap-3">
                <div className="h-[1px] bg-[var(--border)] flex-1" />
                <span className="text-xs font-medium text-[var(--text-muted)]">Or with email</span>
                <div className="h-[1px] bg-[var(--border)] flex-1" />
              </div>

              {/* Email Magic Link Form */}
              <form onSubmit={handleEmailAuth} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text)] mb-1 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[var(--text-muted)]" /> Email address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full py-2.5"
                  isLoading={isSubmitting}
                >
                  <span>Send Sign-In Link</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </form>

              {statusMessage && (
                <div className="p-3 rounded-lg bg-[var(--surface-muted)] border border-[var(--border)] text-xs text-[var(--text)] leading-relaxed">
                  {statusMessage}
                </div>
              )}
            </div>
          ) : (
            <div className="p-6 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-4 text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Your resumes are automatically saved in your browser storage. Cloud sync is disabled on this instance.
              </p>
              <Link href="/editor" className="block">
                <Button variant="primary" className="w-full">
                  <span>Open Resume Editor</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          )}

          {/* Skip CTA */}
          <div className="text-center">
            <Link
              href="/editor"
              className="text-xs text-[var(--accent)] hover:underline font-semibold inline-flex items-center gap-1"
            >
              <span>Continue to resume editor without signing in</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
