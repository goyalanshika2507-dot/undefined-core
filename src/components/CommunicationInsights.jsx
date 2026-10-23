import React from 'react';
import { Sparkles, MessageCircle, CheckCircle, ArrowRight, Eye, ShieldAlert } from 'lucide-react';
import MeaningReview from './MeaningReview';

export default function CommunicationInsights({ insights, isBackendConnected = false }) {
  if (!insights) {
    return (
      <div className="p-5 sm:p-6 rounded-2xl bg-vibe-darkCard border border-vibe-darkBorder/70 shadow-card-dark transition-all">
        <div className="flex items-center gap-2 pb-3 mb-3 border-b border-vibe-darkBorder/60">
          <Sparkles className="w-4 h-4 text-vibe-purple" />
          <h3 className="text-sm sm:text-base font-bold text-vibe-textMain">
            Communication Insights
          </h3>
        </div>

        <div className="p-6 rounded-xl bg-vibe-darkCardSecondary/40 border border-dashed border-vibe-darkBorder/60 text-center">
          <p className="text-xs sm:text-sm text-vibe-textSecondary leading-relaxed">
            Communication insights will appear after the backend is connected.
          </p>
          <p className="text-[11px] text-vibe-textSecondary/60 mt-1">
            Backend will evaluate tone shift, clarity, audience fit, and fact preservation.
          </p>
        </div>
      </div>
    );
  }

  const {
    toneShift,
    clarity,
    directness,
    audienceFit,
    keyChanges = [],
    howItMightComeAcross,
    meaningCheck,
  } = insights;

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-vibe-darkCard border border-vibe-darkBorder/70 shadow-card-dark transition-all space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between pb-3 border-b border-vibe-darkBorder/60">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-vibe-textMain flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-vibe-purple" />
            Communication Insights
          </h3>
          <p className="text-xs text-vibe-textSecondary mt-0.5">
            Nuanced perception analysis and tone impact review
          </p>
        </div>

        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-vibe-purple/15 text-vibe-purple border border-vibe-purple/25">
          AI Analysis
        </span>
      </div>

      {/* Grid of 4 Key Assessment Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Tone Shift */}
        <div className="p-3 rounded-xl bg-vibe-darkCardSecondary/60 border border-vibe-darkBorder/60">
          <div className="text-[11px] font-semibold text-vibe-textSecondary uppercase tracking-wider mb-1">
            Tone Shift
          </div>
          <div className="text-xs font-bold text-vibe-purple flex items-center gap-1.5">
            <span>{toneShift || 'Standard adjustment'}</span>
          </div>
        </div>

        {/* Clarity */}
        <div className="p-3 rounded-xl bg-vibe-darkCardSecondary/60 border border-vibe-darkBorder/60">
          <div className="text-[11px] font-semibold text-vibe-textSecondary uppercase tracking-wider mb-1">
            Clarity
          </div>
          <div className="text-xs font-semibold text-emerald-400">
            {clarity || 'Preserved'}
          </div>
        </div>

        {/* Directness */}
        <div className="p-3 rounded-xl bg-vibe-darkCardSecondary/60 border border-vibe-darkBorder/60">
          <div className="text-[11px] font-semibold text-vibe-textSecondary uppercase tracking-wider mb-1">
            Directness
          </div>
          <div className="text-xs font-semibold text-vibe-textMain">
            {directness || 'Balanced'}
          </div>
        </div>

        {/* Audience Fit */}
        <div className="p-3 rounded-xl bg-vibe-darkCardSecondary/60 border border-vibe-darkBorder/60">
          <div className="text-[11px] font-semibold text-vibe-textSecondary uppercase tracking-wider mb-1">
            Audience Fit
          </div>
          <div className="text-xs font-semibold text-vibe-textMain">
            {audienceFit || 'Tailored to recipient'}
          </div>
        </div>
      </div>

      {/* Key Changes Section */}
      {keyChanges.length > 0 && (
        <div className="space-y-2 pt-1">
          <h4 className="text-xs font-bold text-vibe-textMain uppercase tracking-wider">
            Key Changes
          </h4>
          <ul className="space-y-1.5">
            {keyChanges.slice(0, 3).map((change, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-xs text-vibe-textSecondary leading-snug"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-vibe-purple shrink-0 mt-1.5" />
                <span>{change}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* How Might This Come Across? */}
      {howItMightComeAcross && (
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-vibe-purple/10 to-vibe-indigo/10 border border-vibe-purple/20">
          <div className="flex items-center gap-1.5 text-xs font-bold text-vibe-purple mb-1">
            <Eye className="w-3.5 h-3.5" />
            <span>How Might This Come Across?</span>
          </div>
          <p className="text-xs text-vibe-textMain/90 leading-relaxed italic">
            "{howItMightComeAcross}"
          </p>
        </div>
      )}

      {/* Meaning & Fact Check Checklist */}
      <MeaningReview meaningCheck={meaningCheck} />
    </div>
  );
}
