import React from 'react';
import { UserCheck, GraduationCap, BookOpen, Users, ShieldAlert, Award } from 'lucide-react';

const AUDIENCES = [
  { id: 'Manager', label: 'Manager', icon: UserCheck },
  { id: 'Executive / C-Level', label: 'Executive / C-Level', icon: Award },
  { id: 'Professor', label: 'Professor', icon: GraduationCap },
  { id: 'Teacher', label: 'Teacher', icon: BookOpen },
  { id: 'Friend', label: 'Friend / Peer', icon: Users },
  { id: 'Legal / Compliance', label: 'Legal / Compliance', icon: ShieldAlert },
];

export default function AudienceSelector({ selectedAudience, onChange }) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold text-vibe-textSecondary flex items-center gap-1.5 uppercase tracking-wider">
        <Users className="w-3.5 h-3.5 text-vibe-purple" />
        Audience
      </label>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {AUDIENCES.map((item) => {
          const Icon = item.icon;
          const isSelected = selectedAudience === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-left text-xs font-medium transition-all ${
                isSelected
                  ? 'bg-vibe-indigo/25 border-vibe-indigo text-white shadow-glow-indigo ring-1 ring-vibe-indigo/50'
                  : 'bg-vibe-darkCard/70 border-vibe-darkBorder/60 text-vibe-textSecondary hover:text-vibe-textMain hover:border-vibe-darkBorder hover:bg-vibe-darkHover'
              }`}
            >
              <Icon
                className={`w-3.5 h-3.5 shrink-0 ${
                  isSelected ? 'text-white' : 'text-vibe-textSecondary'
                }`}
              />
              <span className={`truncate ${isSelected ? 'text-white font-semibold' : 'text-vibe-textMain'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
