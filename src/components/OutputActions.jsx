import React, { useState } from 'react';
import { Copy, Share2, RotateCw, Layers, Check, ExternalLink, Mail, MessageCircle } from 'lucide-react';

export default function OutputActions({
  selectedVersionText,
  allVersions,
  onCopySelected,
  onCopyAll,
  onRegenerate,
  isLoading,
  onShowToast,
}) {
  const [showShareModal, setShowShareModal] = useState(false);

  // Web Share API handler with fallbacks
  const handleShare = async () => {
    if (!selectedVersionText) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'VibeShift Transformation',
          text: selectedVersionText,
        });
        onShowToast?.({ message: 'Shared successfully!', type: 'success' });
        return;
      } catch (err) {
        if (err.name !== 'AbortError') {
          setShowShareModal(true);
        }
      }
    } else {
      setShowShareModal(true);
    }
  };

  const handleShareWhatsApp = () => {
    const encoded = encodeURIComponent(selectedVersionText);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
    setShowShareModal(false);
  };

  const handleShareEmail = () => {
    const subject = encodeURIComponent('VibeShift Rewritten Message');
    const body = encodeURIComponent(selectedVersionText);
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
    setShowShareModal(false);
  };

  return (
    <div className="relative">
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 p-3 rounded-2xl bg-vibe-darkCard/90 border border-vibe-darkBorder/70 shadow-sm">
        {/* Main Copy Selected Output */}
        <button
          type="button"
          onClick={onCopySelected}
          disabled={!selectedVersionText || isLoading}
          className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-vibe-purple to-vibe-indigo hover:from-vibe-purple/90 hover:to-vibe-indigo/90 text-white shadow-glow-purple transition-all active:scale-95 disabled:opacity-50"
        >
          <Copy className="w-4 h-4" />
          <span>Copy</span>
        </button>

        {/* Copy All 4 Versions */}
        <button
          type="button"
          onClick={onCopyAll}
          disabled={!allVersions?.length || isLoading}
          className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium bg-vibe-darkCardSecondary/80 hover:bg-vibe-darkHover text-vibe-textMain border border-vibe-darkBorder/70 transition-all hover:border-vibe-purple/40 disabled:opacity-50"
          title="Copy all 4 versions with labels"
        >
          <Layers className="w-4 h-4 text-vibe-purple" />
          <span className="hidden sm:inline">Copy All Versions</span>
          <span className="sm:hidden">All</span>
        </button>

        {/* Share Button */}
        <button
          type="button"
          onClick={handleShare}
          disabled={!selectedVersionText || isLoading}
          className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium bg-vibe-darkCardSecondary/80 hover:bg-vibe-darkHover text-vibe-textMain border border-vibe-darkBorder/70 transition-all hover:border-vibe-purple/40 disabled:opacity-50"
          title="Share via Web Share, WhatsApp, or Email"
        >
          <Share2 className="w-4 h-4 text-vibe-purple" />
          <span>Share</span>
        </button>

        {/* Regenerate All */}
        <button
          type="button"
          onClick={onRegenerate}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium bg-vibe-darkCardSecondary/80 hover:bg-vibe-darkHover text-vibe-textMain border border-vibe-darkBorder/70 transition-all hover:border-vibe-purple/40 disabled:opacity-50"
          title="Regenerate all variations"
        >
          <RotateCw className={`w-4 h-4 text-vibe-purple ${isLoading ? 'animate-spin' : ''}`} />
          <span>Regenerate</span>
        </button>

        {/* Regenerate This Version (Disabled per specification until backend single-version API exists) */}
        <button
          type="button"
          disabled
          className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium bg-vibe-darkCardSecondary/40 text-vibe-textSecondary/40 border border-vibe-darkBorder/30 cursor-not-allowed"
          title="Regenerating a single version will be available once the backend API supports it."
        >
          <span className="text-[11px]">Regenerate This (API v2)</span>
        </button>
      </div>

      {/* Share Fallback Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm rounded-2xl bg-vibe-darkCard border border-vibe-darkBorder p-5 shadow-2xl">
            <h3 className="text-sm font-bold text-vibe-textMain mb-1">
              Share Rewritten Message
            </h3>
            <p className="text-xs text-vibe-textSecondary mb-4">
              Select your preferred sharing destination:
            </p>

            <div className="space-y-2">
              <button
                type="button"
                onClick={handleShareWhatsApp}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-vibe-darkCardSecondary/80 hover:bg-emerald-500/10 border border-vibe-darkBorder text-left text-xs font-semibold text-emerald-400 transition-colors"
              >
                <MessageCircle className="w-4 h-4 shrink-0" />
                <span>Share via WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={handleShareEmail}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-vibe-darkCardSecondary/80 hover:bg-vibe-purple/10 border border-vibe-darkBorder text-left text-xs font-semibold text-vibe-purple transition-colors"
              >
                <Mail className="w-4 h-4 shrink-0" />
                <span>Share via Email</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onCopySelected();
                  setShowShareModal(false);
                }}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-vibe-darkCardSecondary/80 hover:bg-white/5 border border-vibe-darkBorder text-left text-xs font-semibold text-vibe-textMain transition-colors"
              >
                <Copy className="w-4 h-4 shrink-0" />
                <span>Copy to Clipboard</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowShareModal(false)}
              className="mt-4 w-full py-2 rounded-xl text-xs font-medium text-vibe-textSecondary hover:text-white hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
