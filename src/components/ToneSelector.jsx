import React from 'react';
import { Briefcase, Heart, Scale, Feather } from 'lucide-react';

const TONES = [
  { id: 'Professional', label: 'Professional', icon: Briefcase, desc: 'Polite, clear, business-appropriate' },
  { id: 'Friendly', label: 'Friendly', icon: Heart, desc: 'Warm, personable, encouraging' },
  { id: 'Diplomatic', label: 'Diplomatic', icon: Scale, desc: 'Tactful, considerate, non-confrontational' },
  { id: 'Generic', label: 'Generic', icon: Feather, desc: 'Neutral, objective, straightforward' },
];

export default function ToneSelector({ selectedTone, onChange }) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold text-vibe-textSecondary flex items-center gap-1.5 uppercase tracking-wider">
        <Scale className="w-3.5 h-3.5 text-vibe-purple" />
        Tone
      </label>

      <div className="grid grid-cols-2 gap-2">
        {TONES.map((tone) => {
          const Icon = tone.icon;
          const isSelected = selectedTone === tone.id;

          return (
            <button
              key={tone.id}
              type="button"
              onClick={() => onChange(tone.id)}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-left text-xs font-medium transition-all ${
                isSelected
                  ? 'bg-vibe-purple/20 border-vibe-purple text-white shadow-glow-purple ring-1 ring-vibe-purple/50'
                  : 'bg-vibe-darkCard/70 border-vibe-darkBorder/60 text-vibe-textSecondary hover:text-vibe-textMain hover:border-vibe-darkBorder hover:bg-vibe-darkHover'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                  isSelected ? 'bg-vibe-purple text-white' : 'bg-vibe-darkCardSecondary text-vibe-textSecondary'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div className="truncate">
                <div className={`font-semibold ${isSelected ? 'text-white' : 'text-vibe-textMain'}`}>
                  {tone.label}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
