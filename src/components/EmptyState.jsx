import React from 'react';
import { Sparkles } from 'lucide-react';

export default function EmptyState({
  icon: Icon = Sparkles,
  title = 'No content yet',
  description = 'Start typing a draft and click Generate to see results.',
  actionLabel,
  onAction,
  badgeText,
  className = '',
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-2xl border border-dashed border-vibe-darkBorder/80 dark:border-vibe-darkBorder/80 bg-vibe-darkCard/40 dark:bg-vibe-darkCard/40 text-vibe-textSecondary dark:text-vibe-textSecondary ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-vibe-purple/20 to-vibe-indigo/20 border border-vibe-purple/30 flex items-center justify-center mb-4 text-vibe-purple shadow-glow-purple">
        <Icon className="w-7 h-7" />
      </div>

      {badgeText && (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-vibe-purple/15 text-vibe-purple border border-vibe-purple/20 mb-3">
          {badgeText}
        </span>
      )}

      <h3 className="text-base sm:text-lg font-semibold text-vibe-textMain dark:text-vibe-textMain mb-2">
        {title}
      </h3>

      <p className="text-xs sm:text-sm text-vibe-textSecondary dark:text-vibe-textSecondary max-w-sm mb-6 leading-relaxed">
        {description}
      </p>

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium bg-gradient-to-r from-vibe-purple to-vibe-indigo hover:from-vibe-purple/90 hover:to-vibe-indigo/90 text-white shadow-lg shadow-vibe-purple/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <Sparkles className="w-4 h-4" />
          {actionLabel}
        </button>
      )}
    </div>
  );
}
