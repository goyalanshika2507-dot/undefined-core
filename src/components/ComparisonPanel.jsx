import React, { useState } from 'react';
import { GitCompare, Eye, EyeOff, Sparkles } from 'lucide-react';
import { calculateDiff } from '../lib/diff';
import EmptyState from './EmptyState';

export default function ComparisonPanel({ originalDraft, rewrittenText }) {
  const [highlightChanges, setHighlightChanges] = useState(true);

  if (!rewrittenText) {
    return (
      <div className="p-5 rounded-2xl bg-vibe-darkCard border border-vibe-darkBorder/70">
        <h3 className="text-sm font-bold text-vibe-textMain mb-4 flex items-center gap-2">
          <GitCompare className="w-4 h-4 text-vibe-purple" />
          Original vs Rewritten
        </h3>
        <EmptyState
          icon={GitCompare}
          title="No comparison yet"
          description="Generate or select a rewritten version to inspect word-level diffs and additions side-by-side."
        />
      </div>
    );
  }

  const diffResult = calculateDiff(originalDraft, rewrittenText);

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-vibe-darkCard border border-vibe-darkBorder/70 shadow-card-dark transition-all">
      {/* Title & Toggle Switch */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-vibe-darkBorder/60">
        <div>
          <h3 className="text-base font-bold text-vibe-textMain flex items-center gap-2">
            <GitCompare className="w-4 h-4 text-vibe-purple" />
            Original vs Rewritten
          </h3>
          <p className="text-xs text-vibe-textSecondary mt-0.5">
            Side-by-side word comparison and transformation analysis
          </p>
        </div>

        {/* Working Highlight Changes Toggle */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setHighlightChanges(!highlightChanges)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              highlightChanges
                ? 'bg-vibe-purple/20 border-vibe-purple text-white shadow-glow-purple'
                : 'bg-vibe-darkCardSecondary border-vibe-darkBorder text-vibe-textSecondary hover:text-white'
            }`}
          >
            {highlightChanges ? (
              <>
                <Eye className="w-3.5 h-3.5 text-vibe-purple" />
                <span>Highlighting Changes</span>
              </>
            ) : (
              <>
                <EyeOff className="w-3.5 h-3.5" />
                <span>Plain View</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Side-by-Side Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Original Draft Column */}
        <div className="p-4 rounded-xl bg-vibe-darkCardSecondary/60 border border-vibe-darkBorder/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-vibe-darkBorder/40">
              <span className="text-xs font-bold text-vibe-textSecondary uppercase tracking-wider">
                Original Draft
              </span>
              <span className="text-[11px] font-mono text-vibe-textSecondary">
                {diffResult.originalWordCount} words
              </span>
            </div>

            <div className="text-xs sm:text-sm text-vibe-textMain leading-relaxed whitespace-pre-line">
              {highlightChanges ? (
                <span>
                  {diffResult.originalSegments.map((seg) => {
                    if (seg.type === 'removed') {
                      return (
                        <span
                          key={seg.id}
                          className="line-through text-rose-300 bg-rose-500/20 px-1 py-0.5 rounded mx-0.5 font-medium decoration-rose-400"
                          title="Removed or replaced"
                        >
                          {seg.text}
                        </span>
                      );
                    }
                    return <span key={seg.id}>{seg.text}</span>;
                  })}
                </span>
              ) : (
                <span>{originalDraft}</span>
              )}
            </div>
          </div>

          {highlightChanges && diffResult.removedWords > 0 && (
            <div className="mt-4 pt-2 border-t border-vibe-darkBorder/40 text-[11px] text-rose-400 flex items-center gap-1 font-medium">
              <span>−{diffResult.removedWords} words removed or simplified</span>
            </div>
          )}
        </div>

        {/* Rewritten Column */}
        <div className="p-4 rounded-xl bg-vibe-darkCardSecondary/60 border border-vibe-darkBorder/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-vibe-darkBorder/40">
              <span className="text-xs font-bold text-vibe-purple uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Rewritten Version
              </span>
              <span className="text-[11px] font-mono text-vibe-textSecondary">
                {diffResult.rewrittenWordCount} words
              </span>
            </div>

            <div className="text-xs sm:text-sm text-vibe-textMain leading-relaxed whitespace-pre-line">
              {highlightChanges ? (
                <span>
                  {diffResult.rewrittenSegments.map((seg) => {
                    if (seg.type === 'added') {
                      return (
                        <span
                          key={seg.id}
                          className="text-emerald-300 bg-emerald-500/20 px-1 py-0.5 rounded mx-0.5 font-medium"
                          title="Added phrasing"
                        >
                          {seg.text}
                        </span>
                      );
                    }
                    return <span key={seg.id}>{seg.text}</span>;
                  })}
                </span>
              ) : (
                <span>{rewrittenText}</span>
              )}
            </div>
          </div>

          {highlightChanges && diffResult.addedWords > 0 && (
            <div className="mt-4 pt-2 border-t border-vibe-darkBorder/40 text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
              <span>+{diffResult.addedWords} words polished or added</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
