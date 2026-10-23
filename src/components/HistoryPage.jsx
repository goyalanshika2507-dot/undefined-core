import React, { useState } from 'react';
import { History, Trash2, ArrowRight, Clock, Sparkles, MessageSquare, AlertCircle } from 'lucide-react';
import EmptyState from './EmptyState';

export default function HistoryPage({
  history,
  onRestoreTransformation,
  onDeleteTransformation,
  onClearHistory,
  onNavigateToWrite,
}) {
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const formatTimestamp = (date) => {
    if (!date) return 'Just now';
    const d = new Date(date);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-vibe-darkBorder/60">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-vibe-textMain tracking-tight flex items-center gap-2.5">
            <History className="w-6 h-6 text-vibe-purple" />
            Session History
          </h2>
          <p className="text-xs sm:text-sm text-vibe-textSecondary mt-1">
            Review and restore previous draft transformations from this browser session.
          </p>
        </div>

        {history.length > 0 && (
          <button
            type="button"
            onClick={() => setShowClearConfirm(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/30 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* History Items List or Empty State */}
      {history.length === 0 ? (
        <EmptyState
          icon={History}
          title="Your transformations will appear here."
          description="Generate your first rewrite to start building your session history. Drafts are safely stored in memory for this session only."
          actionLabel="Start Writing"
          onAction={onNavigateToWrite}
        />
      ) : (
        <div className="space-y-3">
          {history.map((item, index) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-vibe-darkCard hover:bg-vibe-darkHover/60 border border-vibe-darkBorder/70 hover:border-vibe-purple/50 shadow-sm transition-all group flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-vibe-textMain group-hover:text-vibe-purple transition-colors">
                    {item.title}
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-vibe-purple/15 text-vibe-purple border border-vibe-purple/30 font-medium">
                    {item.settings?.tone || 'Professional'}
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/5 text-vibe-textSecondary border border-white/10 font-medium">
                    {item.settings?.audience || 'Manager'}
                  </span>
                  <span className="text-[10px] text-vibe-textSecondary/70 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatTimestamp(item.createdAt)}
                  </span>
                </div>

                <p className="text-xs text-vibe-textSecondary line-clamp-2 italic">
                  "{item.originalDraft}"
                </p>

                <div className="text-[11px] text-vibe-textSecondary/80">
                  {item.versions?.length || 4} generated variations available
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <button
                  type="button"
                  onClick={() => onRestoreTransformation(item)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-vibe-purple to-vibe-indigo hover:from-vibe-purple/90 hover:to-vibe-indigo/90 text-white shadow-sm transition-all"
                >
                  <span>Restore</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => onDeleteTransformation(item.id)}
                  className="p-2 rounded-xl text-vibe-textSecondary hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Remove from history"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm rounded-2xl bg-vibe-darkCard border border-vibe-darkBorder p-5 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400 mb-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <h3 className="text-sm font-bold text-vibe-textMain">
                Clear Session History?
              </h3>
            </div>
            <p className="text-xs text-vibe-textSecondary mb-5 leading-relaxed">
              This will remove all {history.length} transformation records from this session. This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="px-3.5 py-2 rounded-xl text-xs font-medium text-vibe-textSecondary hover:text-white hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => {
                  onClearHistory();
                  setShowClearConfirm(false);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-500 hover:bg-rose-600 text-white shadow-sm transition-colors"
              >
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
