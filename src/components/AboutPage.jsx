import React, { useState } from 'react';
import {
  Sparkles,
  Shield,
  Layers,
  Settings2,
  GitCompare,
  Percent,
  History,
  Share2,
  Languages,
  Code2,
  Terminal,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState('overview');

  const steps = [
    {
      num: '1',
      title: 'Write your draft',
      desc: 'Type your raw thoughts, paste a hurried email, or pick one of the sample scenarios.',
    },
    {
      num: '2',
      title: 'Choose your settings',
      desc: 'Pick your audience, target tone, length, language, or pick a 1-click Vibe Preset.',
    },
    {
      num: '3',
      title: 'Generate & select',
      desc: 'Review exactly 4 stylistic variations tailored to your specific communication goal.',
    },
    {
      num: '4',
      title: 'Compare & copy',
      desc: 'Inspect word-level diffs, verify preserved facts, tweak as desired, and copy or share.',
    },
  ];

  const features = [
    { icon: Layers, title: 'Multiple AI Variations', desc: '4 stylistic variations provided per transformation.' },
    { icon: Settings2, title: 'Tone & Audience Tuning', desc: 'Granular controls for managers, peers, professors, and legal contexts.' },
    { icon: Sparkles, title: 'Vibe Presets', desc: 'Instant configurations for Executive C-Level, Supportive Peer, Gen-Z, and Legal.' },
    { icon: Languages, title: 'Multilingual Output', desc: 'Supports 8 languages including Hinglish, Hindi, Spanish, French, and Japanese.' },
    { icon: GitCompare, title: 'Word-Level Comparison', desc: 'Real-time side-by-side diff highlighting additions and removals.' },
    { icon: Percent, title: 'Change Percentage', desc: 'Accurate word edit distance formula showing extent of modification.' },
    { icon: Shield, title: 'Meaning-Preservation Review', desc: 'Structured checklist of preserved facts and potential omissions.' },
    { icon: Share2, title: 'Copy & Multi-Channel Share', desc: 'One-click copy, copy all variations, and native Web Share / WhatsApp fallbacks.' },
    { icon: History, title: 'Session-Only History', desc: 'Zero persistence to databases or localStorage for maximum draft privacy.' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn pb-16">
      {/* Hero Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-vibe-darkCard via-vibe-darkCardSecondary/60 to-vibe-darkCard border border-vibe-darkBorder/80 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-vibe-purple/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-vibe-purple/20 text-vibe-purple border border-vibe-purple/30 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Hackathon Project • Member 1 (Agrim: Frontend)
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-vibe-textMain tracking-tight">
            About VibeShift
          </h2>

          <p className="text-base sm:text-lg text-vibe-purple font-medium mt-2">
            Communicate with clarity, confidence, and the right tone.
          </p>

          <p className="text-xs sm:text-sm text-vibe-textSecondary mt-4 leading-relaxed">
            In fast-paced workplaces, rushed messages often sound too blunt, defensive, or unclear.
            VibeShift bridges the intention gap by transforming rough drafts into polished, context-aware communication
            without sacrificing meaning or authentic intent.
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 p-1 rounded-xl bg-vibe-darkCard border border-vibe-darkBorder/60 max-w-md">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'overview'
              ? 'bg-vibe-purple text-white shadow-glow-purple'
              : 'text-vibe-textSecondary hover:text-white'
          }`}
        >
          Product Overview
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('contract')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'contract'
              ? 'bg-vibe-purple text-white shadow-glow-purple'
              : 'text-vibe-textSecondary hover:text-white'
          }`}
        >
          Backend API Contract (Team)
        </button>
      </div>

      {activeTab === 'overview' ? (
        <>
          {/* Why VibeShift & What It Is */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-vibe-darkCard border border-vibe-darkBorder/70 shadow-sm">
              <h3 className="text-base font-bold text-vibe-textMain mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-vibe-purple" />
                What is VibeShift?
              </h3>
              <p className="text-xs sm:text-sm text-vibe-textSecondary leading-relaxed">
                VibeShift is an AI-powered communication transformation platform designed for professionals, students,
                and teams. It takes raw, unedited thoughts and translates them into audience-appropriate communication
                across four distinct styles, providing real-time metrics and change insights.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-vibe-darkCard border border-vibe-darkBorder/70 shadow-sm">
              <h3 className="text-base font-bold text-vibe-textMain mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                Why VibeShift?
              </h3>
              <p className="text-xs sm:text-sm text-vibe-textSecondary leading-relaxed">
                A message can sound accidentally harsh, overly casual, or timid depending on who is reading it.
                VibeShift prevents miscommunication, reduces workplace friction, and saves valuable time crafting
                high-stakes emails, updates, and feedback.
              </p>
            </div>
          </div>

          {/* How It Works (4 Steps) */}
          <div className="p-6 sm:p-8 rounded-2xl bg-vibe-darkCard border border-vibe-darkBorder/70">
            <h3 className="text-base sm:text-lg font-bold text-vibe-textMain mb-6">
              How It Works
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {steps.map((st) => (
                <div
                  key={st.num}
                  className="p-5 rounded-xl bg-vibe-darkCardSecondary/60 border border-vibe-darkBorder/60 relative"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-vibe-purple to-vibe-indigo text-white font-bold flex items-center justify-center text-sm mb-3 shadow-glow-purple">
                    {st.num}
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-vibe-textMain mb-1">
                    {st.title}
                  </h4>
                  <p className="text-xs text-vibe-textSecondary leading-relaxed">
                    {st.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Core Features Grid */}
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-bold text-vibe-textMain">
              Core Capabilities
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((feat) => {
                const Icon = feat.icon;
                return (
                  <div
                    key={feat.title}
                    className="p-4 sm:p-5 rounded-2xl bg-vibe-darkCard border border-vibe-darkBorder/70 hover:border-vibe-purple/40 transition-all flex items-start gap-3.5 group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-vibe-purple/15 text-vibe-purple flex items-center justify-center shrink-0 border border-vibe-purple/20 group-hover:scale-110 transition-transform">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-vibe-textMain mb-1">
                        {feat.title}
                      </h4>
                      <p className="text-xs text-vibe-textSecondary leading-relaxed">
                        {feat.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Privacy & Safety Disclaimer Card */}
          <div className="p-6 rounded-2xl bg-vibe-darkCardSecondary/40 border border-vibe-darkBorder/80 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <Shield className="w-4 h-4" />
              <span>Privacy & Human-in-the-Loop Verification</span>
            </div>

            <p className="text-xs text-vibe-textSecondary leading-relaxed">
              <strong>Data handling notice:</strong> Generating AI rewrites requires transmitting draft text to external AI providers through our backend API service.
              Draft contents and transformation histories are stored strictly in session memory and are never persisted to a database or localStorage by default.
            </p>

            <p className="text-xs text-vibe-textSecondary leading-relaxed">
              <strong>Human-in-the-loop reminder:</strong> Always review transformed outputs prior to dispatching high-stakes, legal, or sensitive personal communications. AI outputs should be verified for factual precision.
            </p>
          </div>
        </>
      ) : (
        /* Backend API Contract View for Team Integration */
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-vibe-darkCard border border-vibe-darkBorder/70 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-vibe-darkBorder/60">
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-vibe-purple" />
                <h3 className="text-base font-bold text-vibe-textMain">
                  Team Integration Contract
                </h3>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                POST /api/rewrite
              </span>
            </div>

            <p className="text-xs text-vibe-textSecondary leading-relaxed">
              Agrim (Member 1) has fully prepared the isolated frontend API client in{' '}
              <code className="text-vibe-purple bg-vibe-purple/10 px-1 py-0.5 rounded">src/lib/api.js</code>.
              Dilbahar (Member 2) & Shreya (Member 3) will provide the backend endpoint.
              Anshika (Member 4) will integrate and verify request/response compatibility.
            </p>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-vibe-textMain uppercase tracking-wider flex items-center gap-2">
                <Terminal className="w-4 h-4 text-vibe-purple" />
                Expected Request Body Schema
              </h4>

              <pre className="p-4 rounded-xl bg-black/60 border border-vibe-darkBorder text-[11px] font-mono text-purple-200 overflow-x-auto">
{`{
  "message": "Hi, the report is late again...",
  "tone": "Professional",       // "Professional" | "Friendly" | "Diplomatic" | "Generic"
  "audience": "Manager",        // "Manager" | "Executive / C-Level" | "Professor" | ...
  "channel": "Email",           // "Email" | "Chat / Direct Message" | "Announcement" | "Feedback"
  "length": "Shorter",          // "Shorter" | "Same" | "Longer"
  "targetWords": 60,            // number | null
  "language": "English",        // "English" | "Hindi" | "Hinglish" | ...
  "preset": "Executive C-Level" // string | null
}`}
              </pre>
            </div>

            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-vibe-textMain uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Expected Response Body Schema (4 Variations)
              </h4>

              <pre className="p-4 rounded-xl bg-black/60 border border-vibe-darkBorder text-[11px] font-mono text-emerald-200 overflow-x-auto">
{`{
  "status": "success",
  "versions": [
    {
      "id": "v1",
      "label": "Version 1 — Recommended",
      "styleDescription": "Clear, outcome-focused, and professional",
      "text": "Hi Mr. Smith, the deliverable is updated...",
      "tone": "Professional",
      "audience": "Manager"
    },
    { "id": "v2", "label": "Version 2 — More Diplomatic", ... },
    { "id": "v3", "label": "Version 3 — More Concise", ... },
    { "id": "v4", "label": "Version 4 — Alternative Style", ... }
  ],
  "insights": {
    "toneShift": "Blunt → Professional",
    "clarity": "The request is explicit with a clear deadline.",
    "directness": "Moderate and diplomatic",
    "audienceFit": "Suitable for a manager or supervisor",
    "keyChanges": [
      "Replaced direct accusatory statement with polite professional tone.",
      "Added a clear timeline."
    ],
    "howItMightComeAcross": "Sounds respectful, calm, and collaborative.",
    "meaningCheck": {
      "preservedFacts": ["Report is delayed", "Deadline 5 PM"],
      "possibleOmissions": [],
      "unsupportedAdditions": [],
      "uncertainChanges": []
    }
  }
}`}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
