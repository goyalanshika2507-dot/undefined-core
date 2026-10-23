import React from 'react';
import { Briefcase, HeartHandshake, ShieldCheck, Flame, Sparkles } from 'lucide-react';

export const PRESETS = [
  {
    id: 'Executive C-Level',
    name: 'Executive C-Level',
    icon: Briefcase,
    color: 'from-purple-500 to-indigo-600',
    description: 'Outcome-first, 3 crisp lines, zero filler',
    settings: {
      tone: 'Professional',
      audience: 'Executive / C-Level',
      length: 'Shorter',
      channel: 'Email',
    },
  },
  {
    id: 'Supportive Peer',
    name: 'Supportive Peer',
    icon: HeartHandshake,
    color: 'from-emerald-500 to-teal-600',
    description: 'Constructive, honest, empathetic & warm',
    settings: {
      tone: 'Friendly',
      audience: 'Friend',
      length: 'Same',
      channel: 'Chat / Direct Message',
    },
  },
  {
    id: 'Legal / Compliance',
    name: 'Legal / Compliance',
    icon: ShieldCheck,
    color: 'from-amber-500 to-orange-600',
    description: 'Neutral, factual, precise, risk-aware',
    settings: {
      tone: 'Generic',
      audience: 'Legal / Compliance',
      length: 'Same',
      channel: 'Email',
    },
  },
  {
    id: 'Gen-Z Hype',
    name: 'Gen-Z Hype',
    icon: Flame,
    color: 'from-pink-500 to-rose-600',
    description: 'Energetic, casual, emojis & crisp vibes',
    settings: {
      tone: 'Friendly',
      audience: 'Friend',
      length: 'Shorter',
      channel: 'Chat / Direct Message',
    },
  },
];

export default function VibePresets({ activePreset, onSelectPreset }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-vibe-textSecondary flex items-center gap-1.5 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-vibe-purple" />
          Quick Vibe Presets
        </label>
        {activePreset && (
          <span className="text-[10px] font-semibold text-vibe-purple bg-vibe-purple/15 border border-vibe-purple/30 px-2 py-0.5 rounded-full">
            Active: {activePreset}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {PRESETS.map((preset) => {
          const Icon = preset.icon;
          const isSelected = activePreset === preset.id;

          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelectPreset(preset)}
              className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden group ${
                isSelected
                  ? 'bg-vibe-darkCardSecondary border-vibe-purple shadow-glow-purple ring-1 ring-vibe-purple'
                  : 'bg-vibe-darkCard/70 border-vibe-darkBorder/60 hover:border-vibe-darkBorder hover:bg-vibe-darkHover'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <div
                  className={`w-6 h-6 rounded-lg bg-gradient-to-tr ${preset.color} flex items-center justify-center text-white shrink-0 shadow-sm`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-vibe-textMain'}`}>
                  {preset.name}
                </div>
              </div>

              <p className="text-[10px] text-vibe-textSecondary leading-tight line-clamp-2 mt-1">
                {preset.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
