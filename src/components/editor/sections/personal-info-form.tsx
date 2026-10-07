'use client';

import React from 'react';
import { useResumeStore } from '@/store/resume-store';
import { User, Mail, Phone, MapPin, Globe, Upload, AlertCircle, Link as LinkIcon, Code2 } from 'lucide-react';

export const PersonalInfoForm: React.FC = () => {
  const { resume, updatePersonalInfo } = useResumeStore();
  const p = resume.personalInfo;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          updatePersonalInfo({ photoUrl: event.target.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const isEmailValid = !p.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email);

  return (
    <div className="space-y-4">
      <div className="border-b border-white/[0.08] pb-3">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <User className="w-4 h-4 text-indigo-400" />
          Personal Information
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Enter your professional contact information. ATS parsers read this first.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Full Name <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            value={p.fullName}
            onChange={(e) => updatePersonalInfo({ fullName: e.target.value })}
            placeholder="e.g. Alex Rivera"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Job Title */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Professional Title / Role
          </label>
          <input
            type="text"
            value={p.jobTitle}
            onChange={(e) => updatePersonalInfo({ jobTitle: e.target.value })}
            placeholder="e.g. Senior Software Engineer"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Email */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1">
              <Mail className="w-3 h-3 text-slate-400" /> Email <span className="text-rose-400">*</span>
            </label>
            {!isEmailValid && (
              <span className="text-[10px] text-amber-400 flex items-center gap-0.5">
                <AlertCircle className="w-2.5 h-2.5" /> Invalid format
              </span>
            )}
          </div>
          <input
            type="email"
            value={p.email}
            onChange={(e) => updatePersonalInfo({ email: e.target.value })}
            placeholder="alex.rivera@example.com"
            className={`w-full bg-white/5 border rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 ${
              !isEmailValid
                ? 'border-amber-500/50 focus:border-amber-500 focus:ring-amber-500'
                : 'border-white/10 focus:border-indigo-500 focus:ring-indigo-500'
            }`}
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1">
            <Phone className="w-3 h-3 text-slate-400" /> Phone Number
          </label>
          <input
            type="tel"
            value={p.phone}
            onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
            placeholder="+1 (555) 000-0000"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-slate-400" /> Location
          </label>
          <input
            type="text"
            value={p.location}
            onChange={(e) => updatePersonalInfo({ location: e.target.value })}
            placeholder="San Francisco, CA (or Remote)"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Website / Portfolio */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1">
            <Globe className="w-3 h-3 text-slate-400" /> Website / Portfolio
          </label>
          <input
            type="url"
            value={p.website}
            onChange={(e) => updatePersonalInfo({ website: e.target.value })}
            placeholder="https://yourportfolio.dev"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* LinkedIn */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1">
            <LinkIcon className="w-3 h-3 text-slate-400" /> LinkedIn Profile
          </label>
          <input
            type="text"
            value={p.linkedin}
            onChange={(e) => updatePersonalInfo({ linkedin: e.target.value })}
            placeholder="linkedin.com/in/username"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* GitHub */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1">
            <Code2 className="w-3 h-3 text-slate-400" /> GitHub / Git Profile
          </label>
          <input
            type="text"
            value={p.github}
            onChange={(e) => updatePersonalInfo({ github: e.target.value })}
            placeholder="github.com/username"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Optional Photo Upload */}
      <div className="pt-2">
        <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1">
          <Upload className="w-3 h-3 text-slate-400" /> Profile Picture (Optional)
        </label>
        <div className="flex items-center gap-4">
          {p.photoUrl && (
            <img
              src={p.photoUrl}
              alt="Profile"
              className="w-12 h-12 rounded-full object-cover border border-white/20"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 cursor-pointer"
          />
          {p.photoUrl && (
            <button
              type="button"
              onClick={() => updatePersonalInfo({ photoUrl: '' })}
              className="text-xs text-rose-400 hover:text-rose-300 underline"
            >
              Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
