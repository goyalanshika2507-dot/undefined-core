import React from 'react';
import { ShieldCheck, AlertTriangle, PlusCircle, HelpCircle } from 'lucide-react';

export default function MeaningReview({ meaningCheck }) {
  if (!meaningCheck) return null;

  const {
    preservedFacts = [],
    possibleOmissions = [],
    unsupportedAdditions = [],
    uncertainChanges = [],
  } = meaningCheck;

  const hasAnyCheck =
    preservedFacts.length > 0 ||
    possibleOmissions.length > 0 ||
    unsupportedAdditions.length > 0 ||
    uncertainChanges.length > 0;

  if (!hasAnyCheck) return null;

  return (
    <div className="mt-4 pt-4 border-t border-vibe-darkBorder/60 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-vibe-textMain uppercase tracking-wider flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Meaning & Fact Check
        </h4>
        <span className="text-[10px] text-vibe-textSecondary italic">
          Verification Review
        </span>
      </div>

      <div className="space-y-2 text-xs">
        {/* Preserved Facts */}
        {preservedFacts.map((fact, idx) => (
          <div
            key={`pres-${idx}`}
            className="flex items-start gap-2 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300"
          >
            <ShieldCheck className="w-3.5 h-3.5 mt-0.5 shrink-0 text-emerald-400" />
            <span>{fact}</span>
          </div>
        ))}

        {/* Possible Omissions */}
        {possibleOmissions.map((omission, idx) => (
          <div
            key={`om-${idx}`}
            className="flex items-start gap-2 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300"
          >
            <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0 text-amber-400" />
            <span>Possible omission: {omission}</span>
          </div>
        ))}

        {/* Potential Additions */}
        {unsupportedAdditions.map((addition, idx) => (
          <div
            key={`add-${idx}`}
            className="flex items-start gap-2 p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300"
          >
            <PlusCircle className="w-3.5 h-3.5 mt-0.5 shrink-0 text-blue-400" />
            <span>Potential addition: {addition}</span>
          </div>
        ))}

        {/* Uncertain Changes */}
        {uncertainChanges.map((item, idx) => (
          <div
            key={`unc-${idx}`}
            className="flex items-start gap-2 p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300"
          >
            <HelpCircle className="w-3.5 h-3.5 mt-0.5 shrink-0 text-purple-400" />
            <span>Review recommended: {item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
