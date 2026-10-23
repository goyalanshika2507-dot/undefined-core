import React from 'react';
import { Copy, Check, CheckCircle2, Circle, Sparkles, Briefcase, Heart, Scale } from 'lucide-react';
import { calculateMetrics } from '../lib/metrics';

export default function VersionCard({
  version,
  originalDraft,
  isSelected,
  onSelect,
  onCopyVersion,
  hasCopied,
}) {
  const metrics = calculateMetrics(originalDraft, version.text);

  return (
    <div
      onClick={onSelect}
      className={`p-4 sm:p-5 rounded-2xl border text-left cursor-pointer transition-all relative group ${
        isSelected
          ? 'bg-vibe-darkCardSecondary/95 border-vibe-purple shadow-glow-purple ring-1 ring-vibe-purple/80'
          : 'bg-vibe-darkCard/80 border-vibe-darkBorder/70 hover:border-vibe-darkBorder hover:bg-vibe-darkHover/60'
      }`}
    >
      {/* Top Header of Card */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                isSelected
                  ? 'bg-vibe-purple/25 text-white border-vibe-purple/50'
                  : 'bg-vibe-darkCardSecondary text-vibe-textMain border-vibe-darkBorder/60'
              }`}
            >
              {version.label || 'Version'}
            </span>

            {version.tone && (
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-white/5 text-vibe-textSecondary border border-white/10 font-medium">
                {version.tone}
              </span>
            )}

            {version.audience && (
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-white/5 text-vibe-textSecondary border border-white/10 font-medium">
                {version.audience}
              </span>
            )}
          </div>

          {version.styleDescription && (
            <p className="text-xs text-vibe-textSecondary/80 mt-1.5 italic">
              {version.styleDescription}
            </p>
          )}
        </div>

        {/* Selection Indicator & Quick Copy Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onCopyVersion(version.text);
            }}
            className="p-1.5 rounded-lg text-vibe-textSecondary hover:text-white hover:bg-white/10 transition-colors"
            title="Copy this version"
            aria-label="Copy version text"
          >
            {hasCopied ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>

          <div className="text-vibe-purple">
            {isSelected ? (
              <CheckCircle2 className="w-5 h-5 fill-vibe-purple text-white shadow-sm" />
            ) : (
              <Circle className="w-5 h-5 text-vibe-darkBorder group-hover:text-vibe-textSecondary/40" />
            )}
          </div>
        </div>
      </div>

      {/* Generated Text */}
      <div className="text-xs sm:text-sm text-vibe-textMain leading-relaxed whitespace-pre-line py-1">
        {version.text}
      </div>

      {/* Footer Metrics */}
      <div className="mt-4 pt-3 border-t border-vibe-darkBorder/50 flex flex-wrap items-center justify-between text-[11px] text-vibe-textSecondary gap-2">
        <div className="flex items-center gap-3">
          <span className="font-mono">{metrics.rewrittenWordCount} words</span>
          <span>•</span>
          <span className="text-vibe-purple font-semibold font-mono">
            {metrics.changePercentage}% change
          </span>
          <span>•</span>
          <span className="text-vibe-textSecondary/80">
            {metrics.lengthDiffLabel}
          </span>
        </div>

        <span
          className={`text-[10px] font-semibold uppercase tracking-wider ${
            isSelected ? 'text-vibe-purple' : 'text-vibe-textSecondary/60'
          }`}
        >
          {isSelected ? 'Active Selection' : 'Click to Select'}
        </span>
      </div>
    </div>
  );
}
