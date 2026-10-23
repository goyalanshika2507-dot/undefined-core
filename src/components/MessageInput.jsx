import React, { useRef, useEffect } from 'react';
import { PenLine, Trash2, Sparkles, AlertCircle, CornerDownLeft } from 'lucide-react';
import { countWords, countCharacters } from '../lib/diff';
import { MAX_WORD_LIMIT } from '../lib/validation';

export const SAMPLE_PROMPTS = [
  {
    label: 'Deadline Update',
    text: "Hi, the report is late again. I asked for it yesterday and still don't have it. I need the final version by 5 PM today because the client meeting is tomorrow. Please send an update ASAP.",
  },
  {
    label: 'Follow-up',
    text: "Hey, checking in on the deliverables we agreed on during Monday's standup. We're getting close to sprint end so let me know if there are any blockers or if you need an extra pair of hands.",
  },
  {
    label: 'Leave Request',
    text: "Hi team, I won't be able to log in next Monday and Tuesday due to an unavoidable personal family event. I have pre-scheduled my tasks and handed off the critical tickets to Alex. Thanks!",
  },
  {
    label: 'Apology',
    text: "Sorry for abruptly dropping off the customer call this morning. My local power went out unexpectedly. I have reviewed the call recording and prepared the required summary action items attached here.",
  },
  {
    label: 'Feedback',
    text: "Your slides were too dense and you rushed through the architecture diagram without explaining the data flow. The stakeholders looked confused. We need to streamline the deck before presenting to VP.",
  },
];

export default function MessageInput({
  message,
  onChangeMessage,
  validationError,
  onTriggerGenerate,
  disabled = false,
}) {
  const textareaRef = useRef(null);

  const wordCount = countWords(message);
  const charCount = countCharacters(message);
  const isOverLimit = wordCount > MAX_WORD_LIMIT;

  // Handle Ctrl+Enter or Cmd+Enter to generate
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (!disabled && onTriggerGenerate) {
        onTriggerGenerate();
      }
    }
  };

  const handleClear = () => {
    onChangeMessage('');
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleApplySample = (sampleText) => {
    onChangeMessage(sampleText);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-vibe-darkCard dark:bg-vibe-darkCard border border-vibe-darkBorder/70 shadow-card-dark transition-all">
      {/* Title & Description */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-vibe-textMain flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-vibe-purple/20 text-vibe-purple text-xs font-black flex items-center justify-center border border-vibe-purple/30">
              1
            </span>
            Your Message
          </h2>
          <p className="text-xs text-vibe-textSecondary mt-0.5">
            Write your message, paste a rough draft, or start with an example.
          </p>
        </div>

        {message && (
          <button
            type="button"
            onClick={handleClear}
            disabled={disabled}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
            title="Clear message draft"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* Main Textarea */}
      <div className="relative group">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => onChangeMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          rows={6}
          placeholder="Write your message here, paste a rough draft, or pick a sample below..."
          className={`w-full p-4 rounded-xl text-sm leading-relaxed bg-vibe-darkCardSecondary/70 text-vibe-textMain placeholder-vibe-textSecondary/50 border transition-all resize-y focus:outline-none focus:ring-2 ${
            isOverLimit || validationError
              ? 'border-rose-500/80 focus:ring-rose-500/40'
              : 'border-vibe-darkBorder/70 focus:border-vibe-purple focus:ring-vibe-purple/40 group-hover:border-vibe-darkBorder'
          }`}
        />

        {/* Live Counter Pill inside Textarea Corner */}
        <div className="absolute right-3 bottom-3 flex items-center gap-2 pointer-events-none">
          <div
            className={`text-[11px] font-mono px-2 py-0.5 rounded-md backdrop-blur-md border ${
              isOverLimit
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-bold'
                : 'bg-vibe-darkCard/90 text-vibe-textSecondary border-vibe-darkBorder/80'
            }`}
          >
            <span className={wordCount > 0 ? 'text-vibe-textMain font-semibold' : ''}>
              {wordCount}
            </span>
            <span className="text-vibe-textSecondary/60"> / {MAX_WORD_LIMIT} words</span>
            <span className="mx-1 text-vibe-darkBorder">•</span>
            <span>{charCount} chars</span>
          </div>
        </div>
      </div>

      {/* Inline Validation Error Banner */}
      {validationError && (
        <div className="mt-2.5 flex items-center gap-2 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs animate-fadeIn">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Sample Templates Strip */}
      <div className="mt-4 pt-3.5 border-t border-vibe-darkBorder/60 flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-vibe-textSecondary flex items-center gap-1.5 mr-1">
          <Sparkles className="w-3.5 h-3.5 text-vibe-purple" />
          Try a sample:
        </span>

        {SAMPLE_PROMPTS.map((sample) => (
          <button
            key={sample.label}
            type="button"
            onClick={() => handleApplySample(sample.text)}
            disabled={disabled}
            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-vibe-darkCardSecondary/80 hover:bg-vibe-purple/20 text-vibe-textSecondary hover:text-white border border-vibe-darkBorder/60 hover:border-vibe-purple/40 transition-all active:scale-95"
          >
            {sample.label}
          </button>
        ))}
      </div>
    </div>
  );
}
