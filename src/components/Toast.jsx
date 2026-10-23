import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, toast.duration || 3000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fadeIn">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl backdrop-blur-md border text-sm font-medium transition-all ${
          isSuccess
            ? 'bg-vibe-darkCard/95 dark:bg-vibe-darkCard/95 border-emerald-500/40 text-emerald-300'
            : isError
            ? 'bg-vibe-darkCard/95 dark:bg-vibe-darkCard/95 border-rose-500/40 text-rose-300'
            : 'bg-vibe-darkCard/95 dark:bg-vibe-darkCard/95 border-vibe-purple/40 text-vibe-textMain'
        }`}
      >
        {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
        {isError && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
        {!isSuccess && !isError && <Info className="w-5 h-5 text-vibe-purple shrink-0" />}

        <span>{toast.message}</span>

        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-white/10 text-vibe-textSecondary hover:text-white transition-colors ml-2"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
