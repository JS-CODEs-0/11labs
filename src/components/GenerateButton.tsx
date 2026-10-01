'use client';

import React from 'react';
import { Sparkles, Loader2, ArrowRight } from 'lucide-react';

interface GenerateButtonProps {
  onGenerate: () => void;
  isGenerating: boolean;
  disabled?: boolean;
  disabledReason?: string;
}

export const GenerateButton: React.FC<GenerateButtonProps> = ({
  onGenerate,
  isGenerating,
  disabled = false,
  disabledReason,
}) => {
  return (
    <div className="relative group w-full">
      <button
        type="button"
        onClick={onGenerate}
        disabled={disabled || isGenerating}
        className={`relative flex w-full items-center justify-center gap-2.5 rounded-2xl px-6 py-4 font-semibold text-sm transition-all duration-300 shadow-xl ${
          isGenerating
            ? 'bg-zinc-800 text-zinc-300 border border-zinc-700 cursor-wait'
            : disabled
            ? 'bg-zinc-800/60 text-zinc-500 border border-zinc-800 cursor-not-allowed'
            : 'bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 text-white hover:from-violet-500 hover:via-indigo-500 hover:to-purple-500 shadow-violet-600/30 hover:shadow-violet-600/50 hover:scale-[1.01] active:scale-[0.99] border border-white/20'
        }`}
      >
        {isGenerating ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin text-violet-400" />
            <span className="tracking-wide">Synthesizing Audio with ElevenLabs...</span>
          </>
        ) : (
          <>
            <Sparkles className="h-5 w-5 text-amber-300 animate-pulse" />
            <span className="tracking-wide text-base">Generate Speech</span>
            <ArrowRight className="h-4 w-4 opacity-70 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </button>

      {/* Disabled Reason Tooltip */}
      {disabled && disabledReason && (
        <p className="mt-1.5 text-center text-xs text-amber-400/90 font-medium">
          {disabledReason}
        </p>
      )}
    </div>
  );
};
