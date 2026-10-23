import React from 'react';
import { BarChart3, Clock, ArrowRightLeft, Percent, Layers } from 'lucide-react';
import { calculateMetrics, getChangeIntensity } from '../lib/metrics';

export default function ChangeMetrics({ originalDraft, rewrittenText }) {
  if (!rewrittenText) return null;

  const metrics = calculateMetrics(originalDraft, rewrittenText);
  const intensity = getChangeIntensity(metrics.changePercentage);

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-vibe-darkCard border border-vibe-darkBorder/70 shadow-card-dark transition-all">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-vibe-darkBorder/60">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-vibe-textMain flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-vibe-purple" />
            Change Metrics
          </h3>
          <p className="text-xs text-vibe-textSecondary">
            Real-time client-side word metrics and transformation delta
          </p>
        </div>

        <span className="text-xs px-2.5 py-1 rounded-full bg-vibe-purple/15 text-vibe-purple border border-vibe-purple/30 font-semibold">
          {intensity}
        </span>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Original Words */}
        <div className="p-3.5 rounded-xl bg-vibe-darkCardSecondary/60 border border-vibe-darkBorder/60">
          <div className="text-[11px] font-semibold text-vibe-textSecondary uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            Original
          </div>
          <div className="text-lg sm:text-xl font-black text-vibe-textMain font-mono">
            {metrics.originalWordCount}
          </div>
          <div className="text-[10px] text-vibe-textSecondary mt-0.5">
            {metrics.originalCharCount} characters
          </div>
        </div>

        {/* Rewritten Words */}
        <div className="p-3.5 rounded-xl bg-vibe-darkCardSecondary/60 border border-vibe-darkBorder/60">
          <div className="text-[11px] font-semibold text-vibe-purple uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-vibe-purple" />
            Rewritten
          </div>
          <div className="text-lg sm:text-xl font-black text-vibe-purple font-mono">
            {metrics.rewrittenWordCount}
          </div>
          <div className="text-[10px] text-vibe-textSecondary mt-0.5">
            {metrics.rewrittenCharCount} characters
          </div>
        </div>

        {/* Length Difference */}
        <div className="p-3.5 rounded-xl bg-vibe-darkCardSecondary/60 border border-vibe-darkBorder/60">
          <div className="text-[11px] font-semibold text-vibe-textSecondary uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <ArrowRightLeft className="w-3.5 h-3.5" />
            Difference
          </div>
          <div
            className={`text-lg sm:text-xl font-black font-mono ${
              metrics.lengthDifference > 0
                ? 'text-emerald-400'
                : metrics.lengthDifference < 0
                ? 'text-amber-400'
                : 'text-vibe-textMain'
            }`}
          >
            {metrics.lengthDiffLabel}
          </div>
          <div className="text-[10px] text-vibe-textSecondary mt-0.5">
            {metrics.addedWords} added / {metrics.removedWords} removed
          </div>
        </div>

        {/* Change Percentage */}
        <div className="p-3.5 rounded-xl bg-vibe-darkCardSecondary/60 border border-vibe-darkBorder/60">
          <div className="text-[11px] font-semibold text-vibe-textSecondary uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Percent className="w-3.5 h-3.5" />
            Change %
          </div>
          <div className="text-lg sm:text-xl font-black text-vibe-textMain font-mono flex items-baseline gap-1">
            <span>{metrics.changePercentage}%</span>
          </div>
          <div className="text-[10px] text-vibe-textSecondary mt-0.5">
            Word-level edit distance
          </div>
        </div>
      </div>

      {/* Reading Time Estimation */}
      <div className="mt-3 pt-3 border-t border-vibe-darkBorder/40 flex items-center justify-between text-xs text-vibe-textSecondary">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-vibe-purple" />
          <span>Estimated recipient reading time:</span>
        </div>
        <span className="font-semibold text-vibe-textMain">
          ~{metrics.readingTimeSeconds} sec (at 200 wpm)
        </span>
      </div>
    </div>
  );
}
