'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { useResumeStore } from '@/store/resume-store';
import { Button } from '@/components/ui/button';
import { getPageSizeConfig } from '@/lib/page-sizes';
import {
  Plus,
  Copy,
  Trash2,
  Edit,
  Calendar,
  FolderOpen,
  FileText,
} from 'lucide-react';

export default function MyResumesPage() {
  const router = useRouter();
  const {
    savedResumes,
    loadFromLibrary,
    duplicateResume,
    deleteFromLibrary,
    renameResume,
    clearResume,
  } = useResumeStore();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitleText, setEditTitleText] = useState<string>('');

  const handleOpenResume = (id: string) => {
    loadFromLibrary(id);
    router.push('/editor');
  };

  const handleStartRename = (id: string, currentTitle: string) => {
    setEditingId(id);
    setEditTitleText(currentTitle);
  };

  const handleSaveRename = (id: string) => {
    if (editTitleText.trim()) {
      renameResume(id, editTitleText.trim());
    }
    setEditingId(null);
  };

  const handleCreateNew = () => {
    clearResume();
    router.push('/editor');
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col transition-colors duration-150">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 border-b border-[var(--border)] gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--border)] mb-2">
              <FolderOpen className="w-3.5 h-3.5" />
              <span>Saved Resumes</span>
            </div>
            <h1 className="text-3xl font-bold text-[var(--text)] tracking-tight">
              My Resumes
            </h1>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Open, rename, duplicate, or export your saved resumes. Each resume remembers its own template and page size.
            </p>
          </div>

          <Button variant="primary" onClick={handleCreateNew}>
            <Plus className="w-4 h-4" />
            <span>Create New Resume</span>
          </Button>
        </div>

        {/* Resumes Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedResumes.map((resume) => {
            const isEditing = editingId === resume.id;
            const pageSizeConfig = getPageSizeConfig(resume.settings?.pageSize);

            return (
              <div
                key={resume.id}
                className="p-5 rounded-xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)] transition-colors flex flex-col justify-between space-y-4 shadow-xs"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-10 h-10 rounded-lg bg-[var(--accent-soft)] flex items-center justify-center text-[var(--accent)]">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[var(--surface-muted)] text-[var(--text)] border border-[var(--border)]">
                        {pageSizeConfig.shortLabel}
                      </span>
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-[var(--surface-muted)] text-[var(--text-muted)] border border-[var(--border)]">
                        {resume.settings.templateId}
                      </span>
                    </div>
                  </div>

                  <div>
                    {isEditing ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editTitleText}
                          onChange={(e) => setEditTitleText(e.target.value)}
                          className="bg-[var(--bg)] border border-[var(--border)] rounded-lg px-2.5 py-1 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)] flex-1"
                        />
                        <button
                          onClick={() => handleSaveRename(resume.id)}
                          className="text-xs text-[var(--accent)] font-semibold cursor-pointer px-2 py-1"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <h2
                        onClick={() => handleStartRename(resume.id, resume.title)}
                        className="text-base font-bold text-[var(--text)] hover:text-[var(--accent)] transition-colors cursor-pointer truncate"
                        title="Click to rename"
                      >
                        {resume.title}
                      </h2>
                    )}
                    <p className="text-xs text-[var(--text-muted)] truncate mt-0.5">
                      {resume.personalInfo.fullName || 'Unnamed'} • {resume.personalInfo.jobTitle || 'No Title'}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Edited {new Date(resume.lastModified).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between">
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => handleOpenResume(resume.id)}
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Open Editor</span>
                  </Button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => duplicateResume(resume.id)}
                      className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-muted)] cursor-pointer transition-colors"
                      title="Duplicate Resume"
                      aria-label="Duplicate Resume"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    {savedResumes.length > 1 && (
                      <button
                        onClick={() => {
                          if (confirm('Delete this resume from your library?')) {
                            deleteFromLibrary(resume.id);
                          }
                        }}
                        className="p-2 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 cursor-pointer transition-colors"
                        title="Delete Resume"
                        aria-label="Delete Resume"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}

