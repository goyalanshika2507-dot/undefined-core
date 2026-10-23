import React, { useState } from 'react';
import { Sparkles, Edit3, RotateCcw, Check, Copy } from 'lucide-react';
import VersionCard from './VersionCard';
import OutputActions from './OutputActions';
import { calculateMetrics } from '../lib/metrics';

export default function OutputPanel({
  versions,
  selectedVersionId,
  onSelectVersion,
  originalDraft,
  editedTexts,
  onUpdateEditedText,
  onResetVersion,
  onCopyVersion,
  onCopyAll,
  onRegenerate,
  isLoading,
  onShowToast,
}) {
  const [copiedId, setCopiedId] = useState(null);

  const selectedVersion = versions.find((v) => v.id === selectedVersionId) || versions[0];
  const activeText = editedTexts[selectedVersion?.id] ?? selectedVersion?.text ?? '';
  const isEdited = activeText !== selectedVersion?.text;

  const currentMetrics = calculateMetrics(originalDraft, activeText);

  const handleCopySingle = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    onShowToast?.({ message: 'Copied to clipboard!', type: 'success' });
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-2 border-b border-vibe-darkBorder/60">
        <div className="flex items-center gap-2">
          <h2 className="text-base sm:text-lg font-bold text-vibe-textMain flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-vibe-purple" />
            Generated Versions
          </h2>
          <span className="text-xs px-2 py-0.5 rounded-full bg-vibe-purple/15 text-vibe-purple border border-vibe-purple/30 font-medium">
            {versions.length} variations
          </span>
        </div>

        <div className="text-xs text-vibe-textSecondary hidden sm:block">
          Select any version to preview, edit & compare
        </div>
      </div>

      {/* Version Tab Switcher (Inspired by reference image Option 1, Option 2, Option 3) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 rounded-xl bg-vibe-darkCard/80 border border-vibe-darkBorder/60">
        {versions.map((ver, idx) => {
          const isSelected = ver.id === selectedVersionId;
          return (
            <button
              key={ver.id}
              type="button"
              onClick={() => onSelectVersion(ver.id)}
              className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all truncate ${
                isSelected
                  ? 'bg-vibe-purple text-white shadow-glow-purple'
                  : 'text-vibe-textSecondary hover:text-white hover:bg-white/5'
              }`}
            >
              Option {idx + 1}
            </button>
          );
        })}
      </div>

      {/* Output Cards Grid / Stack */}
      <div className="grid grid-cols-1 gap-3">
        {versions.map((ver) => (
          <VersionCard
            key={ver.id}
            version={{
              ...ver,
              text: editedTexts[ver.id] ?? ver.text,
            }}
            originalDraft={originalDraft}
            isSelected={ver.id === selectedVersionId}
            onSelect={() => onSelectVersion(ver.id)}
            onCopyVersion={(text) => handleCopySingle(text, ver.id)}
            hasCopied={copiedId === ver.id}
          />
        ))}
      </div>

      {/* Selected Version Live Editor Card */}
      {selectedVersion && (
        <div className="p-4 sm:p-5 rounded-2xl bg-vibe-darkCardSecondary/90 border border-vibe-purple/40 shadow-card-dark relative group">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-vibe-purple" />
              <span className="text-xs font-bold text-vibe-textMain">
                Refine Selected Output
              </span>
              {isEdited && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  Edited
                </span>
              )}
            </div>

            {isEdited && (
              <button
                type="button"
                onClick={() => onResetVersion(selectedVersion.id)}
                className="flex items-center gap-1 text-[11px] text-vibe-textSecondary hover:text-white transition-colors"
                title="Reset to AI original"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset to AI version</span>
              </button>
            )}
          </div>

          <textarea
            value={activeText}
            onChange={(e) => onUpdateEditedText(selectedVersion.id, e.target.value)}
            rows={5}
            className="w-full p-3.5 rounded-xl text-xs sm:text-sm leading-relaxed bg-vibe-darkCard text-vibe-textMain border border-vibe-darkBorder/80 focus:outline-none focus:border-vibe-purple focus:ring-1 focus:ring-vibe-purple transition-all"
            placeholder="Edit selected output directly here..."
          />

          <div className="mt-2 flex items-center justify-between text-[11px] text-vibe-textSecondary">
            <span className="italic">
              Changes reflect instantly in the comparison and metrics.
            </span>
            <span className="font-mono text-vibe-purple">
              {currentMetrics.rewrittenWordCount} words • {currentMetrics.changePercentage}% change
            </span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <OutputActions
        selectedVersionText={activeText}
        allVersions={versions.map((v) => ({
          ...v,
          text: editedTexts[v.id] ?? v.text,
        }))}
        onCopySelected={() => handleCopySingle(activeText, 'active')}
        onCopyAll={onCopyAll}
        onRegenerate={onRegenerate}
        isLoading={isLoading}
        onShowToast={onShowToast}
      />
    </div>
  );
}
