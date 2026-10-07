'use client';

import React from 'react';
import { useResumeStore } from '@/store/resume-store';
import { Trophy, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const AchievementsForm: React.FC = () => {
  const { resume, addAchievement, updateAchievement, removeAchievement } = useResumeStore();
  const achievements = resume.achievements;

  return (
    <div className="space-y-4">
      <div className="border-b border-white/[0.08] pb-3 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Trophy className="w-4 h-4 text-indigo-400" />
            Key Achievements & Awards
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Highlight hackathons, patents, competitive awards, or leadership honors.
          </p>
        </div>
        <Button size="sm" variant="secondary" onClick={() => addAchievement()}>
          <Plus className="w-3.5 h-3.5" />
          <span>Add Honor</span>
        </Button>
      </div>

      {achievements.length === 0 ? (
        <div className="text-center py-6 border border-dashed border-white/10 rounded-xl">
          <p className="text-xs text-slate-400">No honors added yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] space-y-2.5"
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-300">Award Entry</span>
                <button
                  onClick={() => removeAchievement(ach.id)}
                  className="p-1 text-rose-400 hover:text-rose-300"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] text-slate-400 mb-1">Title</label>
                  <input
                    type="text"
                    value={ach.title}
                    onChange={(e) => updateAchievement(ach.id, { title: e.target.value })}
                    placeholder="e.g. 1st Place - Global Hackathon"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Date</label>
                  <input
                    type="text"
                    value={ach.date || ''}
                    onChange={(e) => updateAchievement(ach.id, { date: e.target.value })}
                    placeholder="e.g. 2023"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={ach.description}
                  onChange={(e) => updateAchievement(ach.id, { description: e.target.value })}
                  placeholder="Detail the recognition, scope of competition, or distinction..."
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-y"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
