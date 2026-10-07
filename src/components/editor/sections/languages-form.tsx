'use client';

import React from 'react';
import { useResumeStore } from '@/store/resume-store';
import { LanguageItem } from '@/types/resume';
import { Languages, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const LanguagesForm: React.FC = () => {
  const { resume, addLanguage, updateLanguage, removeLanguage } = useResumeStore();
  const languages = resume.languages;

  return (
    <div className="space-y-4">
      <div className="border-b border-white/[0.08] pb-3 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Languages className="w-4 h-4 text-indigo-400" />
            Languages
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Add languages and your proficiency level.
          </p>
        </div>
        <Button size="sm" variant="secondary" onClick={() => addLanguage()}>
          <Plus className="w-3.5 h-3.5" />
          <span>Add Language</span>
        </Button>
      </div>

      {languages.length === 0 ? (
        <div className="text-center py-6 border border-dashed border-white/10 rounded-xl">
          <p className="text-xs text-slate-400">No languages added yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {languages.map((l) => (
            <div
              key={l.id}
              className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center gap-2"
            >
              <input
                type="text"
                value={l.language}
                onChange={(e) => updateLanguage(l.id, { language: e.target.value })}
                placeholder="e.g. English"
                className="w-1/2 bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <select
                value={l.proficiency}
                onChange={(e) =>
                  updateLanguage(l.id, {
                    proficiency: e.target.value as LanguageItem['proficiency'],
                  })
                }
                className="w-1/2 bg-[var(--surface)] border border-[var(--border)] rounded-lg px-2 py-1.5 text-xs text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
              >
                <option value="Native">Native</option>
                <option value="Fluent">Fluent</option>
                <option value="Professional">Professional</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Basic">Basic</option>
              </select>
              <button
                onClick={() => removeLanguage(l.id)}
                className="p-1 text-rose-400 hover:text-rose-300"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
