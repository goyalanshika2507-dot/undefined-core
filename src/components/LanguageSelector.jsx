import React from 'react';
import { Languages } from 'lucide-react';

const LANGUAGES = [
  { code: 'English', label: 'English', native: 'English' },
  { code: 'Hindi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'Hinglish', label: 'Hinglish', native: 'Hinglish' },
  { code: 'Spanish', label: 'Spanish', native: 'Español' },
  { code: 'French', label: 'French', native: 'Français' },
  { code: 'German', label: 'German', native: 'Deutsch' },
  { code: 'Arabic', label: 'Arabic', native: 'العربية' },
  { code: 'Japanese', label: 'Japanese', native: '日本語' },
];

export default function LanguageSelector({ selectedLanguage, onChange }) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold text-vibe-textSecondary flex items-center gap-1.5 uppercase tracking-wider">
        <Languages className="w-3.5 h-3.5 text-vibe-purple" />
        Language
      </label>

      <div className="relative">
        <select
          value={selectedLanguage}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl bg-vibe-darkCard/80 border border-vibe-darkBorder/60 text-xs text-vibe-textMain focus:outline-none focus:border-vibe-purple focus:ring-1 focus:ring-vibe-purple appearance-none cursor-pointer transition-all pr-10"
        >
          {LANGUAGES.map((lang) => (
            <option
              key={lang.code}
              value={lang.code}
              className="bg-vibe-darkCard text-white py-1"
            >
              {lang.label} ({lang.native})
            </option>
          ))}
        </select>

        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-vibe-textSecondary">
          <Languages className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}
