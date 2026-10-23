import React from 'react';
import { AlignLeft, Minimize2, Equal, Maximize2 } from 'lucide-react';

export default function LengthControl({
  selectedLength,
  onChangeLength,
  targetWords,
  onChangeTargetWords,
}) {
  const options = [
    { id: 'Shorter', label: 'Shorter', icon: Minimize2 },
    { id: 'Same', label: 'Same Length', icon: Equal },
    { id: 'Longer', label: 'Longer', icon: Maximize2 },
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-vibe-textSecondary flex items-center gap-1.5 uppercase tracking-wider">
          <AlignLeft className="w-3.5 h-3.5 text-vibe-purple" />
          Length & Target
        </label>
        {targetWords && (
          <span className="text-[11px] text-vibe-purple font-medium">
            Goal: ~{targetWords} words
          </span>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        {/* Segmented Length Control */}
        <div className="flex-1 p-1 rounded-xl bg-vibe-darkCard/80 border border-vibe-darkBorder/60 flex items-center gap-1">
          {options.map((opt) => {
            const Icon = opt.icon;
            const isSelected = selectedLength === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onChangeLength(opt.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-vibe-purple to-vibe-indigo text-white shadow-sm font-semibold'
                    : 'text-vibe-textSecondary hover:text-vibe-textMain hover:bg-white/5'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>

        {/* Optional Target Word Count Input */}
        <div className="sm:w-36 relative">
          <input
            type="number"
            min="5"
            max="2000"
            placeholder="Target words"
            value={targetWords || ''}
            onChange={(e) => {
              const val = e.target.value ? parseInt(e.target.value, 10) : '';
              onChangeTargetWords(val);
            }}
            className="w-full h-full py-1.5 px-3 rounded-xl bg-vibe-darkCard/80 border border-vibe-darkBorder/60 text-xs text-vibe-textMain placeholder-vibe-textSecondary/60 focus:outline-none focus:border-vibe-purple focus:ring-1 focus:ring-vibe-purple transition-all"
          />
        </div>
      </div>
    </div>
  );
}
