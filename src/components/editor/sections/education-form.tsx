'use client';

import React from 'react';
import { useResumeStore } from '@/store/resume-store';
import { GraduationCap, Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const EducationForm: React.FC = () => {
  const { resume, addEducation, updateEducation, removeEducation, reorderEducation } = useResumeStore();
  const educations = resume.education;

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newItems = [...educations];
    const temp = newItems[index];
    newItems[index] = newItems[index - 1];
    newItems[index - 1] = temp;
    reorderEducation(newItems);
  };

  const moveDown = (index: number) => {
    if (index === educations.length - 1) return;
    const newItems = [...educations];
    const temp = newItems[index];
    newItems[index] = newItems[index + 1];
    newItems[index + 1] = temp;
    reorderEducation(newItems);
  };

  return (
    <div className="space-y-5">
      <div className="border-b border-white/[0.08] pb-3 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-indigo-400" />
            Education & Degrees
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Add your degrees, universities, bootcamps, or secondary education.
          </p>
        </div>
        <Button size="sm" variant="secondary" onClick={() => addEducation()}>
          <Plus className="w-3.5 h-3.5" />
          <span>Add Education</span>
        </Button>
      </div>

      {educations.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-white/10 rounded-xl">
          <GraduationCap className="w-8 h-8 text-slate-500 mx-auto mb-2" />
          <p className="text-sm text-slate-300 font-medium">No education added yet</p>
          <p className="text-xs text-slate-500 mt-1 mb-3">Add your university degree or highest qualification.</p>
          <Button size="sm" onClick={() => addEducation()}>
            <Plus className="w-3.5 h-3.5" /> Add Degree
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {educations.map((edu, index) => (
            <div
              key={edu.id}
              className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-white/20 transition-all space-y-3"
            >
              {/* Controls */}
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                  Degree #{index + 1}
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
                    disabled={index === educations.length - 1}
                    onClick={() => moveDown(index)}
                    className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-20 cursor-pointer"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeEducation(edu.id)}
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
                    Degree Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                    placeholder="e.g. Bachelor of Science"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Field of Study / Major
                  </label>
                  <input
                    type="text"
                    value={edu.fieldOfStudy}
                    onChange={(e) => updateEducation(edu.id, { fieldOfStudy: e.target.value })}
                    placeholder="e.g. Computer Science & Software Engineering"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    School / University <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
                    placeholder="e.g. University of California, Berkeley"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={edu.location}
                    onChange={(e) => updateEducation(edu.id, { location: e.target.value })}
                    placeholder="e.g. Berkeley, CA"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Start Year / Date
                    </label>
                    <input
                      type="text"
                      value={edu.startDate}
                      onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })}
                      placeholder="e.g. 2018"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      End Year / Date
                    </label>
                    <input
                      type="text"
                      value={edu.endDate}
                      onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })}
                      placeholder="e.g. 2022"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      GPA (Optional)
                    </label>
                    <input
                      type="text"
                      value={edu.gpa || ''}
                      onChange={(e) => updateEducation(edu.id, { gpa: e.target.value })}
                      placeholder="e.g. 3.9 / 4.0"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Honors / Awards
                    </label>
                    <input
                      type="text"
                      value={edu.honors || ''}
                      onChange={(e) => updateEducation(edu.id, { honors: e.target.value })}
                      placeholder="e.g. Magna Cum Laude"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
