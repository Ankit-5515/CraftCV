'use client';

import React from 'react';
import { useResumeStore } from '@/store/resume-store';
import { FolderGit2, Plus, Trash2, ChevronUp, ChevronDown, Link as LinkIcon, Code2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const ProjectsForm: React.FC = () => {
  const { resume, addProject, updateProject, removeProject, reorderProjects } = useResumeStore();
  const projects = resume.projects;

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newItems = [...projects];
    const temp = newItems[index];
    newItems[index] = newItems[index - 1];
    newItems[index - 1] = temp;
    reorderProjects(newItems);
  };

  const moveDown = (index: number) => {
    if (index === projects.length - 1) return;
    const newItems = [...projects];
    const temp = newItems[index];
    newItems[index] = newItems[index + 1];
    newItems[index + 1] = temp;
    reorderProjects(newItems);
  };

  return (
    <div className="space-y-5">
      <div className="border-b border-white/[0.08] pb-3 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <FolderGit2 className="w-4 h-4 text-indigo-400" />
            Key Projects & Open Source
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Highlight high-impact projects, open-source work, or production apps with live links.
          </p>
        </div>
        <Button size="sm" variant="secondary" onClick={() => addProject()}>
          <Plus className="w-3.5 h-3.5" />
          <span>Add Project</span>
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-white/10 rounded-xl">
          <FolderGit2 className="w-8 h-8 text-slate-500 mx-auto mb-2" />
          <p className="text-sm text-slate-300 font-medium">No projects added yet</p>
          <p className="text-xs text-slate-500 mt-1 mb-3">Add portfolio projects or GitHub repositories.</p>
          <Button size="sm" onClick={() => addProject()}>
            <Plus className="w-3.5 h-3.5" /> Add Project
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((proj, index) => (
            <div
              key={proj.id}
              className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-white/20 transition-all space-y-3"
            >
              {/* Controls */}
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                  Project #{index + 1}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    disabled={index === 0}
                    onClick={() => moveUp(index)}
                    className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-20 cursor-pointer"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    disabled={index === projects.length - 1}
                    onClick={() => moveDown(index)}
                    className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-20 cursor-pointer"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeProject(proj.id)}
                    className="p-1 rounded text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 cursor-pointer ml-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Project Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={proj.title}
                    onChange={(e) => updateProject(proj.id, { title: e.target.value })}
                    placeholder="e.g. HyperTrace Observability"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Subtitle / Summary Tagline
                  </label>
                  <input
                    type="text"
                    value={proj.subtitle || ''}
                    onChange={(e) => updateProject(proj.id, { subtitle: e.target.value })}
                    placeholder="e.g. Distributed Tracing Tool"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1">
                    <LinkIcon className="w-3 h-3 text-slate-400" /> Live Demo URL
                  </label>
                  <input
                    type="text"
                    value={proj.link || ''}
                    onChange={(e) => updateProject(proj.id, { link: e.target.value })}
                    placeholder="https://example.com"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1">
                    <Code2 className="w-3 h-3 text-slate-400" /> GitHub Repository
                  </label>
                  <input
                    type="text"
                    value={proj.github || ''}
                    onChange={(e) => updateProject(proj.id, { github: e.target.value })}
                    placeholder="github.com/user/project"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Technologies Used (Comma-separated)
                </label>
                <input
                  type="text"
                  value={proj.technologies ? proj.technologies.join(', ') : ''}
                  onChange={(e) =>
                    updateProject(proj.id, {
                      technologies: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
                    })
                  }
                  placeholder="e.g. TypeScript, React, Next.js, Go, PostgreSQL"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Description & Impact
                </label>
                <textarea
                  rows={2}
                  value={proj.description}
                  onChange={(e) => updateProject(proj.id, { description: e.target.value })}
                  placeholder="Describe the challenge solved, scale handled, or user adoption..."
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-y"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
