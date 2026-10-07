'use client';

import React from 'react';
import { useResumeStore } from '@/store/resume-store';
import { Layers, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const CustomSectionForm: React.FC = () => {
  const {
    resume,
    addCustomSection,
    updateCustomSection,
    removeCustomSection,
    addCustomSectionItem,
    removeCustomSectionItem,
  } = useResumeStore();
  const customSections = resume.customSections;

  return (
    <div className="space-y-5">
      <div className="border-b border-white/[0.08] pb-3 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            Custom Sections
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Add custom categories like Publications, Volunteer Work, Speaking, or Patents.
          </p>
        </div>
        <Button size="sm" variant="secondary" onClick={() => addCustomSection()}>
          <Plus className="w-3.5 h-3.5" />
          <span>New Section</span>
        </Button>
      </div>

      {customSections.length === 0 ? (
        <div className="text-center py-6 border border-dashed border-white/10 rounded-xl">
          <p className="text-xs text-slate-400">No custom sections added yet.</p>
          <Button size="sm" className="mt-2" onClick={() => addCustomSection('Publications & Speaking')}>
            <Plus className="w-3.5 h-3.5" /> Add Publications Section
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {customSections.map((sec) => (
            <div
              key={sec.id}
              className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] space-y-3"
            >
              <div className="flex justify-between items-center">
                <input
                  type="text"
                  value={sec.sectionTitle}
                  onChange={(e) => updateCustomSection(sec.id, { sectionTitle: e.target.value })}
                  placeholder="Section Title (e.g. Publications)"
                  className="bg-transparent border-b border-white/20 focus:border-indigo-500 font-bold text-sm text-white px-1 py-0.5 focus:outline-none flex-1"
                />
                <button
                  onClick={() => removeCustomSection(sec.id)}
                  className="p-1 text-rose-400 hover:text-rose-300 ml-2"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Items */}
              <div className="space-y-2">
                {sec.items.map((item) => (
                  <div
                    key={item.id}
                    className="p-2.5 rounded-lg bg-white/5 border border-white/10 space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => {
                          const updated = sec.items.map((it) =>
                            it.id === item.id ? { ...it, title: e.target.value } : it
                          );
                          updateCustomSection(sec.id, { items: updated });
                        }}
                        placeholder="Item Title"
                        className="bg-transparent border-b border-white/10 text-xs font-semibold text-white px-1 py-0.5 focus:outline-none flex-1"
                      />
                      <button
                        onClick={() => removeCustomSectionItem(sec.id, item.id)}
                        className="p-1 text-rose-400 hover:text-rose-300 ml-2"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={item.subtitle || ''}
                        onChange={(e) => {
                          const updated = sec.items.map((it) =>
                            it.id === item.id ? { ...it, subtitle: e.target.value } : it
                          );
                          updateCustomSection(sec.id, { items: updated });
                        }}
                        placeholder="Subtitle / Org"
                        className="bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-white placeholder-slate-500 focus:outline-none"
                      />
                      <input
                        type="text"
                        value={item.date || ''}
                        onChange={(e) => {
                          const updated = sec.items.map((it) =>
                            it.id === item.id ? { ...it, date: e.target.value } : it
                          );
                          updateCustomSection(sec.id, { items: updated });
                        }}
                        placeholder="Date"
                        className="bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-white placeholder-slate-500 focus:outline-none"
                      />
                    </div>

                    <textarea
                      rows={2}
                      value={item.description}
                      onChange={(e) => {
                        const updated = sec.items.map((it) =>
                          it.id === item.id ? { ...it, description: e.target.value } : it
                        );
                        updateCustomSection(sec.id, { items: updated });
                      }}
                      placeholder="Description..."
                      className="w-full bg-white/5 border border-white/10 rounded p-1.5 text-xs text-white placeholder-slate-500 focus:outline-none resize-y"
                    />
                  </div>
                ))}

                <button
                  onClick={() => addCustomSectionItem(sec.id)}
                  className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 mt-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" /> Add item to {sec.sectionTitle}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
