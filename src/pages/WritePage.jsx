import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Lightbulb,
  AlertCircle,
  CheckCircle2,
  ServerOff,
  Cpu,
  Layers,
  HelpCircle,
} from 'lucide-react';
import MessageInput, { SAMPLE_PROMPTS } from '../components/MessageInput';
import ToneSelector from '../components/ToneSelector';
import AudienceSelector from '../components/AudienceSelector';
import ChannelSelector from '../components/ChannelSelector';
import VibePresets, { PRESETS } from '../components/VibePresets';
import LengthControl from '../components/LengthControl';
import LanguageSelector from '../components/LanguageSelector';
import OutputPanel from '../components/OutputPanel';
import ComparisonPanel from '../components/ComparisonPanel';
import ChangeMetrics from '../components/ChangeMetrics';
import CommunicationInsights from '../components/CommunicationInsights';
import EmptyState from '../components/EmptyState';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { validateMessage } from '../lib/validation';
import { generateRewrites, SAMPLE_CONTRACT_PREVIEW } from '../lib/api';

export default function WritePage({
  onAddHistory,
  onShowToast,
  restoredItem,
  onClearRestoredItem,
}) {
  // Input and settings state
  const [message, setMessage] = useState(
    restoredItem?.originalDraft || SAMPLE_PROMPTS[0].text
  );
  const [tone, setTone] = useState(restoredItem?.settings?.tone || 'Professional');
  const [audience, setAudience] = useState(restoredItem?.settings?.audience || 'Manager');
  const [channel, setChannel] = useState(restoredItem?.settings?.channel || 'Email');
  const [length, setLength] = useState(restoredItem?.settings?.length || 'Same');
  const [targetWords, setTargetWords] = useState(restoredItem?.settings?.targetWords || null);
  const [language, setLanguage] = useState(restoredItem?.settings?.language || 'English');
  const [activePreset, setActivePreset] = useState(restoredItem?.settings?.preset || null);

  // Validation & UI states
  const [validationError, setValidationError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [backendError, setBackendError] = useState(null);

  // Generated results state
  const [versions, setVersions] = useState(restoredItem?.versions || null);
  const [selectedVersionId, setSelectedVersionId] = useState(
    restoredItem?.selectedVersionId || null
  );
  const [insights, setInsights] = useState(restoredItem?.insights || null);

  // User edits to versions (preserved separately from AI original)
  const [editedTexts, setEditedTexts] = useState({});

  // Sync if restoredItem changed
  React.useEffect(() => {
    if (restoredItem) {
      setMessage(restoredItem.originalDraft);
      setTone(restoredItem.settings?.tone || 'Professional');
      setAudience(restoredItem.settings?.audience || 'Manager');
      setChannel(restoredItem.settings?.channel || 'Email');
      setLength(restoredItem.settings?.length || 'Same');
      setTargetWords(restoredItem.settings?.targetWords || null);
      setLanguage(restoredItem.settings?.language || 'English');
      setActivePreset(restoredItem.settings?.preset || null);
      setVersions(restoredItem.versions);
      setSelectedVersionId(restoredItem.selectedVersionId || restoredItem.versions?.[0]?.id);
      setInsights(restoredItem.insights);
      setEditedTexts({});
      setBackendError(null);
      setValidationError(null);
      onClearRestoredItem?.();
    }
  }, [restoredItem, onClearRestoredItem]);

  // Handle Preset Selection
  const handleSelectPreset = (preset) => {
    setActivePreset(preset.id);
    setTone(preset.settings.tone);
    setAudience(preset.settings.audience);
    setLength(preset.settings.length);
    setChannel(preset.settings.channel);
  };

  // Helper when user modifies any setting manually
  const handleManualSettingChange = (setter, value) => {
    setter(value);
    // If the setting diverges from current active preset, clear active preset badge
    if (activePreset) {
      const currentPreset = PRESETS.find((p) => p.id === activePreset);
      if (currentPreset) {
        setActivePreset(null);
      }
    }
  };

  // Trigger Generation Flow
  const handleGenerate = async () => {
    setValidationError(null);
    setBackendError(null);

    // Validate Input
    const validation = validateMessage(message);
    if (!validation.isValid) {
      setValidationError(validation.error);
      return;
    }

    setIsLoading(true);

    const payload = {
      message: message.trim(),
      tone,
      audience,
      channel,
      length,
      targetWords: targetWords || null,
      language,
      preset: activePreset || null,
    };

    try {
      // Call isolated API client
      const response = await generateRewrites(payload);

      if (response && response.versions && response.versions.length > 0) {
        setVersions(response.versions);
        setSelectedVersionId(response.versions[0].id);
        setInsights(response.insights || null);
        setEditedTexts({});

        // Add to session history
        onAddHistory?.({
          originalDraft: message.trim(),
          settings: payload,
          versions: response.versions,
          selectedVersionId: response.versions[0].id,
          insights: response.insights || null,
        });

        onShowToast?.({
          message: 'Transformed into 3 versions successfully!',
          type: 'success',
        });
      }
    } catch (err) {
      console.warn('API Call Notice:', err);
      if (err.code === 'BACKEND_NOT_CONNECTED') {
        setBackendError(
          'Frontend is ready. Connect the backend to generate AI rewrites.'
        );
      } else {
        setBackendError(err.message || 'An error occurred while contacting the server.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Development / Preview helper to load the sample response
  // Explicitly labeled so judges/reviewers and Anshika can test the complete UI
  const handleLoadSamplePreview = () => {
    setBackendError(null);
    setValidationError(null);
    setVersions(SAMPLE_CONTRACT_PREVIEW.versions);
    setSelectedVersionId(SAMPLE_CONTRACT_PREVIEW.versions[0].id);
    setInsights(SAMPLE_CONTRACT_PREVIEW.insights);
    setEditedTexts({});

    onAddHistory?.({
      originalDraft: message.trim(),
      settings: { tone, audience, channel, length, targetWords, language, preset: activePreset },
      versions: SAMPLE_CONTRACT_PREVIEW.versions,
      selectedVersionId: SAMPLE_CONTRACT_PREVIEW.versions[0].id,
      insights: SAMPLE_CONTRACT_PREVIEW.insights,
    });

    onShowToast?.({
      message: 'Loaded contract preview response (Integration Preview Mode)',
      type: 'info',
    });
  };

  // Edited texts handlers
  const handleUpdateEditedText = (versionId, newText) => {
    setEditedTexts((prev) => ({
      ...prev,
      [versionId]: newText,
    }));
  };

  const handleResetVersion = (versionId) => {
    setEditedTexts((prev) => {
      const next = { ...prev };
      delete next[versionId];
      return next;
    });
    onShowToast?.({ message: 'Reset to original AI generation', type: 'info' });
  };

  // Copy all versions handler
  const handleCopyAll = () => {
    if (!versions) return;
    const allFormatted = versions
      .map((v, i) => {
        const text = editedTexts[v.id] ?? v.text;
        return `=== ${v.label || `Version ${i + 1}`} ===\n${text}\n`;
      })
      .join('\n');

    navigator.clipboard.writeText(allFormatted);
    onShowToast?.({ message: `All ${versions.length} versions copied to clipboard!`, type: 'success' });
  };

  // Determine active selected text for comparison and metrics
  const activeSelectedVersion = versions?.find((v) => v.id === selectedVersionId) || versions?.[0];
  const activeSelectedText = activeSelectedVersion
    ? editedTexts[activeSelectedVersion.id] ?? activeSelectedVersion.text
    : '';

  return (
    <div className="space-y-6 pb-16 animate-fadeIn">
      {/* Two-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Input, Customization, & Actions (5 or 6 cols on desktop) */}
        <div className="lg:col-span-5 space-y-5">
          {/* 1. Message Input Card */}
          <MessageInput
            message={message}
            onChangeMessage={(val) => {
              setMessage(val);
              if (validationError) setValidationError(null);
            }}
            validationError={validationError}
            onTriggerGenerate={handleGenerate}
            disabled={isLoading}
          />

          {/* 2. Customization Controls Card */}
          <div className="p-5 sm:p-6 rounded-2xl bg-vibe-darkCard border border-vibe-darkBorder/70 shadow-card-dark space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-vibe-darkBorder/60">
              <h2 className="text-base sm:text-lg font-bold text-vibe-textMain flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-vibe-purple/20 text-vibe-purple text-xs font-black flex items-center justify-center border border-vibe-purple/30">
                  2
                </span>
                Customize Your Output
              </h2>
              <span className="text-[11px] text-vibe-textSecondary">
                Fine-tune tone & context
              </span>
            </div>

            {/* Quick Presets */}
            <VibePresets
              activePreset={activePreset}
              onSelectPreset={handleSelectPreset}
            />

            {/* Tone Selector */}
            <ToneSelector
              selectedTone={tone}
              onChange={(val) => handleManualSettingChange(setTone, val)}
            />

            {/* Audience Selector */}
            <AudienceSelector
              selectedAudience={audience}
              onChange={(val) => handleManualSettingChange(setAudience, val)}
            />

            {/* Communication Channel */}
            <ChannelSelector
              selectedChannel={channel}
              onChange={(val) => handleManualSettingChange(setChannel, val)}
            />

            {/* Length Control */}
            <LengthControl
              selectedLength={length}
              onChangeLength={(val) => handleManualSettingChange(setLength, val)}
              targetWords={targetWords}
              onChangeTargetWords={setTargetWords}
            />

            {/* Language Selector */}
            <LanguageSelector
              selectedLanguage={language}
              onChange={(val) => handleManualSettingChange(setLanguage, val)}
            />

            {/* Generate Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isLoading}
                className="w-full py-3.5 px-6 rounded-xl font-bold text-sm sm:text-base text-white bg-gradient-to-r from-vibe-purple via-vibe-indigo to-vibe-purple bg-[length:200%_auto] hover:bg-right transition-all duration-300 shadow-glow-purple flex items-center justify-center gap-2 transform active:scale-[0.99] disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Analyzing & Transforming...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 fill-white/20 animate-pulseSubtle" />
                    <span>Generate Versions</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>

              <div className="mt-2 text-center text-[11px] text-vibe-textSecondary/70">
                Tip: Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-[10px]">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-[10px]">Enter</kbd> to generate
              </div>
            </div>

            {/* Pro Tip Card */}
            <div className="p-3 rounded-xl bg-vibe-darkCardSecondary/60 border border-vibe-darkBorder/60 flex items-start gap-2.5 text-xs text-vibe-textSecondary">
              <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p>
                <strong className="text-vibe-textMain">Pro Tip:</strong> Be specific about your audience and tone for the most natural, tailored results.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Generated Results, Comparison & Insights (7 cols on desktop) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Backend Connection Error Notice per Section 9 */}
          {backendError && (
            <div className="p-5 rounded-2xl bg-vibe-darkCard border border-amber-500/40 shadow-xl space-y-3 animate-fadeIn">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0 border border-amber-500/30">
                  <ServerOff className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-white">
                    {backendError}
                  </h3>
                  <p className="text-xs text-vibe-textSecondary mt-1 leading-relaxed">
                    Member 1 (Agrim) has completed the frontend. Dilbahar & Shreya are developing the backend service, which will be connected by Anshika.
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-vibe-darkBorder/60 flex flex-wrap items-center justify-between gap-2">
                <span className="text-[11px] text-vibe-textSecondary font-mono">
                  Endpoint: POST /api/rewrite
                </span>

                <button
                  type="button"
                  onClick={handleLoadSamplePreview}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-vibe-purple/20 hover:bg-vibe-purple/30 text-vibe-purple border border-vibe-purple/40 transition-colors"
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Preview with Sample Contract Schema</span>
                </button>
              </div>
            </div>
          )}

          {/* Loading Skeleton */}
          {isLoading && <LoadingSkeleton />}

          {/* Generated Results Panel or Clean Initial Empty State */}
          {!isLoading && !versions && (
            <div className="p-6 sm:p-10 rounded-2xl bg-vibe-darkCard border border-vibe-darkBorder/70 shadow-card-dark">
              <EmptyState
                icon={Sparkles}
                title="Your transformed outputs will appear here"
                description="Type or paste your message on the left, choose your target audience and tone, and click Generate Versions."
                badgeText="Ready to transform"
                actionLabel="Try Sample & Preview"
                onAction={handleLoadSamplePreview}
              />
            </div>
          )}

          {/* Output Versions Panel */}
          {!isLoading && versions && (
            <>
              <OutputPanel
                versions={versions}
                selectedVersionId={selectedVersionId}
                onSelectVersion={setSelectedVersionId}
                originalDraft={message}
                editedTexts={editedTexts}
                onUpdateEditedText={handleUpdateEditedText}
                onResetVersion={handleResetVersion}
                onCopyAll={handleCopyAll}
                onRegenerate={handleGenerate}
                isLoading={isLoading}
                onShowToast={onShowToast}
              />

              {/* Original vs Rewritten Comparison */}
              <ComparisonPanel
                originalDraft={message}
                rewrittenText={activeSelectedText}
              />

              {/* Real-time Change Metrics */}
              <ChangeMetrics
                originalDraft={message}
                rewrittenText={activeSelectedText}
              />

              {/* Communication Insights & Meaning Review */}
              <CommunicationInsights
                insights={insights}
                isBackendConnected={Boolean(versions && !backendError)}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
