'use client';

import React, { useState } from 'react';
import { useResumeStore } from '@/store/resume-store';
import { Wrench, Plus, X, Trash2, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const SkillsForm: React.FC = () => {
  const { resume, addSkillCategory, updateSkillCategory, removeSkillCategory } = useResumeStore();
  const skillCategories = resume.skills;
  const [newTagInput, setNewTagInput] = useState<{ [catId: string]: string }>({});

  const handleAddTag = (catId: string, currentSkills: string[]) => {
    const rawVal = newTagInput[catId]?.trim();
    if (!rawVal) return;

    // Support comma separated input
    const newItems = rawVal.split(',').map((s) => s.trim()).filter(Boolean);
    const combined = Array.from(new Set([...currentSkills, ...newItems]));

    updateSkillCategory(catId, { skills: combined });
    setNewTagInput((prev) => ({ ...prev, [catId]: '' }));
  };

  const handleRemoveTag = (catId: string, currentSkills: string[], tagToRemove: string) => {
    const filtered = currentSkills.filter((s) => s !== tagToRemove);
    updateSkillCategory(catId, { skills: filtered });
  };

  const handleKeyDown = (e: React.KeyboardEvent, catId: string, currentSkills: string[]) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag(catId, currentSkills);
    }
  };

  return (
    <div className="space-y-5">
      <div className="border-b border-white/[0.08] pb-3 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Wrench className="w-4 h-4 text-indigo-400" />
            Skills & Competencies
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Group your skills by category (e.g. Languages, Cloud, Frameworks). ATS engines match these directly.
          </p>
        </div>
        <Button size="sm" variant="secondary" onClick={() => addSkillCategory()}>
          <Plus className="w-3.5 h-3.5" />
          <span>Add Category</span>
        </Button>
      </div>

      {skillCategories.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-white/10 rounded-xl">
          <Wrench className="w-8 h-8 text-slate-500 mx-auto mb-2" />
          <p className="text-sm text-slate-300 font-medium">No skill categories added</p>
          <p className="text-xs text-slate-500 mt-1 mb-3">Add categories like Frontend, Backend, Cloud, or Tools.</p>
          <Button size="sm" onClick={() => addSkillCategory()}>
            <Plus className="w-3.5 h-3.5" /> Add Category
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {skillCategories.map((cat) => (
            <div
              key={cat.id}
              className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-white/20 transition-all space-y-3"
            >
              <div className="flex items-center justify-between gap-3">
                <input
                  type="text"
                  value={cat.category}
                  onChange={(e) => updateSkillCategory(cat.id, { category: e.target.value })}
                  placeholder="e.g. Technical Skills"
                  className="bg-transparent border-b border-white/20 focus:border-indigo-500 font-bold text-sm text-white px-1 py-0.5 focus:outline-none flex-1"
                />
                <button
                  onClick={() => removeSkillCategory(cat.id)}
                  className="p-1 rounded text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 cursor-pointer"
                  title="Remove Category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Tag Badges */}
              <div className="flex flex-wrap items-center gap-1.5 min-h-[32px]">
                {cat.skills.map((skill, sIdx) => (
                  <span
                    key={sIdx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-white/10 text-white border border-white/10 group"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(cat.id, cat.skills, skill)}
                      className="text-slate-400 hover:text-rose-400 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              {/* Add Tag Input */}
              <div className="flex items-center gap-2 pt-1">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={newTagInput[cat.id] || ''}
                    onChange={(e) =>
                      setNewTagInput((prev) => ({ ...prev, [cat.id]: e.target.value }))
                    }
                    onKeyDown={(e) => handleKeyDown(e, cat.id, cat.skills)}
                    placeholder="Type skill & press Enter or comma (e.g. React, Next.js, Go)"
                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleAddTag(cat.id, cat.skills)}
                >
                  Add
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
