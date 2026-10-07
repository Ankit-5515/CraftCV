'use client';

import React from 'react';
import { useResumeStore } from '@/store/resume-store';
import { Briefcase, Plus, Trash2, ChevronUp, ChevronDown, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const ExperienceForm: React.FC = () => {
  const { resume, addExperience, updateExperience, removeExperience, reorderExperience } = useResumeStore();
  const experiences = resume.experience;

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newItems = [...experiences];
    const temp = newItems[index];
    newItems[index] = newItems[index - 1];
    newItems[index - 1] = temp;
    reorderExperience(newItems);
  };

  const moveDown = (index: number) => {
    if (index === experiences.length - 1) return;
    const newItems = [...experiences];
    const temp = newItems[index];
    newItems[index] = newItems[index + 1];
    newItems[index + 1] = temp;
    reorderExperience(newItems);
  };

  const handleAddHighlight = (expId: string, currentHighlights: string[] = []) => {
    updateExperience(expId, {
      highlights: [...currentHighlights, ''],
    });
  };

  const handleUpdateHighlight = (expId: string, currentHighlights: string[], hIndex: number, value: string) => {
    const updated = [...currentHighlights];
    updated[hIndex] = value;
    updateExperience(expId, { highlights: updated });
  };

  const handleRemoveHighlight = (expId: string, currentHighlights: string[], hIndex: number) => {
    const updated = currentHighlights.filter((_, i) => i !== hIndex);
    updateExperience(expId, { highlights: updated });
  };

  return (
    <div className="space-y-5">
      <div className="border-b border-white/[0.08] pb-3 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-indigo-400" />
            Work Experience
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Add relevant roles in reverse chronological order. Focus on achievements with metrics.
          </p>
        </div>
        <Button size="sm" variant="secondary" onClick={() => addExperience()}>
          <Plus className="w-3.5 h-3.5" />
          <span>Add Position</span>
        </Button>
      </div>

      {experiences.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-white/10 rounded-xl">
          <Briefcase className="w-8 h-8 text-slate-500 mx-auto mb-2" />
          <p className="text-sm text-slate-300 font-medium">No experience added yet</p>
          <p className="text-xs text-slate-500 mt-1 mb-3">Add your first job, internship, or freelance contract.</p>
          <Button size="sm" onClick={() => addExperience()}>
            <Plus className="w-3.5 h-3.5" /> Add Role
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {experiences.map((exp, index) => (
            <div
              key={exp.id}
              className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-white/20 transition-all space-y-3.5"
            >
              {/* Header Controls */}
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                  Role #{index + 1}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    disabled={index === 0}
                    onClick={() => moveUp(index)}
                    className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-20 cursor-pointer"
                    title="Move Up"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    disabled={index === experiences.length - 1}
                    onClick={() => moveDown(index)}
                    className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-20 cursor-pointer"
                    title="Move Down"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeExperience(exp.id)}
                    className="p-1 rounded text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 cursor-pointer ml-2"
                    title="Delete Position"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Position Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Job Title <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={exp.title}
                    onChange={(e) => updateExperience(exp.id, { title: e.target.value })}
                    placeholder="e.g. Senior Software Engineer"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Company Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                    placeholder="e.g. Acme Corp"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={exp.location}
                    onChange={(e) => updateExperience(exp.id, { location: e.target.value })}
                    placeholder="e.g. Austin, TX (or Remote)"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Start Date
                    </label>
                    <input
                      type="text"
                      value={exp.startDate}
                      onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                      placeholder="e.g. 2021-03"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-medium text-slate-300">End Date</label>
                      <label className="flex items-center gap-1 text-[10px] text-slate-400 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={exp.current}
                          onChange={(e) => updateExperience(exp.id, { current: e.target.checked })}
                          className="rounded border-white/20 bg-white/5 text-indigo-600 focus:ring-0"
                        />
                        <span>Current</span>
                      </label>
                    </div>
                    <input
                      type="text"
                      disabled={exp.current}
                      value={exp.current ? 'Present' : exp.endDate}
                      onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                      placeholder="e.g. 2023-08"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 disabled:opacity-40"
                    />
                  </div>
                </div>
              </div>

              {/* Bullet Points Highlights */}
              <div className="pt-2">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    Key Accomplishments & Bullets
                  </span>
                  <button
                    onClick={() => handleAddHighlight(exp.id, exp.highlights)}
                    className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> Add Bullet
                  </button>
                </div>

                <div className="space-y-2">
                  {(exp.highlights || []).map((highlight, hIdx) => {
                    const hasNumber = /\d+|%|\$/.test(highlight);
                    return (
                      <div key={hIdx} className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500 font-mono">•</span>
                          <input
                            type="text"
                            value={highlight}
                            onChange={(e) =>
                              handleUpdateHighlight(exp.id, exp.highlights, hIdx, e.target.value)
                            }
                            placeholder="e.g. Spearheaded migration to Kubernetes, decreasing cloud infrastructure cost by 35%."
                            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                          />
                          <button
                            onClick={() => handleRemoveHighlight(exp.id, exp.highlights, hIdx)}
                            className="p-1 text-slate-500 hover:text-rose-400 cursor-pointer"
                            title="Remove Bullet"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        {highlight.length > 10 && (
                          <div className="ml-5 flex items-center gap-2 text-[10.5px]">
                            {hasNumber ? (
                              <span className="text-emerald-400 flex items-center gap-0.5">
                                <CheckCircle2 className="w-2.5 h-2.5" /> Quantified metric detected
                              </span>
                            ) : (
                              <span className="text-amber-400/90">
                                Tip: Add a metric (% or $) to show quantifiable impact
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
