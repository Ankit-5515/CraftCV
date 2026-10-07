'use client';

import React from 'react';
import { useResumeStore } from '@/store/resume-store';
import { Award, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const CertificationsForm: React.FC = () => {
  const { resume, addCertification, updateCertification, removeCertification } = useResumeStore();
  const certifications = resume.certifications;

  return (
    <div className="space-y-4">
      <div className="border-b border-white/[0.08] pb-3 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-indigo-400" />
            Certifications & Licenses
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Add recognized certifications (AWS, GCP, CKA, PMP, Cisco, etc.).
          </p>
        </div>
        <Button size="sm" variant="secondary" onClick={() => addCertification()}>
          <Plus className="w-3.5 h-3.5" />
          <span>Add Cert</span>
        </Button>
      </div>

      {certifications.length === 0 ? (
        <div className="text-center py-6 border border-dashed border-white/10 rounded-xl">
          <p className="text-xs text-slate-400">No certifications added yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {certifications.map((c) => (
            <div
              key={c.id}
              className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] space-y-2.5"
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-300">Certification Entry</span>
                <button
                  onClick={() => removeCertification(c.id)}
                  className="p-1 text-rose-400 hover:text-rose-300"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Name</label>
                  <input
                    type="text"
                    value={c.name}
                    onChange={(e) => updateCertification(c.id, { name: e.target.value })}
                    placeholder="e.g. AWS Certified Solutions Architect"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Issuer</label>
                  <input
                    type="text"
                    value={c.issuer}
                    onChange={(e) => updateCertification(c.id, { issuer: e.target.value })}
                    placeholder="e.g. Amazon Web Services"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Date</label>
                  <input
                    type="text"
                    value={c.issueDate}
                    onChange={(e) => updateCertification(c.id, { issueDate: e.target.value })}
                    placeholder="e.g. 2023"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Credential URL (Optional)</label>
                  <input
                    type="text"
                    value={c.url || ''}
                    onChange={(e) => updateCertification(c.id, { url: e.target.value })}
                    placeholder="https://..."
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
