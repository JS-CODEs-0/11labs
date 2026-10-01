'use client';

import React from 'react';
import { Radio, Sparkles, Volume2 } from 'lucide-react';

interface EmptyStateProps {
  onLoadSample?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onLoadSample }) => {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800/90 bg-zinc-900/40 p-8 text-center shadow-xl backdrop-blur-md">
      <div className="relative mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-tr from-violet-900/30 via-indigo-900/20 to-zinc-900 border border-violet-500/20 text-violet-400 shadow-inner">
        <Radio className="h-10 w-10 text-violet-400 animate-pulse" />
        <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-violet-600 text-white shadow">
          <Volume2 className="h-3.5 w-3.5" />
        </div>
      </div>

      <h3 className="text-lg font-bold text-zinc-100 tracking-tight">
        Your generated speech will appear here
      </h3>
      <p className="mt-2 max-w-sm text-xs text-zinc-400 leading-relaxed">
        Enter your prompt on the left, pick a neural voice and fine-tune parameters, then click <strong className="text-zinc-200">Generate Speech</strong> to synthesize custom audio.
      </p>

      {onLoadSample && (
        <button
          type="button"
          onClick={onLoadSample}
          className="mt-6 inline-flex items-center gap-2 rounded-xl border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-xs font-semibold text-violet-300 hover:bg-violet-500/20 hover:text-white transition-all shadow-sm"
        >
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          Load Sample Prompt & Generate
        </button>
      )}

      {/* Decorative Waveform Bars */}
      <div className="mt-8 flex items-center justify-center gap-1.5 opacity-30">
        {[40, 65, 30, 85, 45, 95, 60, 30, 75, 50, 80, 40].map((h, i) => (
          <div
            key={i}
            className="w-1 bg-violet-500 rounded-full"
            style={{ height: `${h / 2.5}px` }}
          />
        ))}
      </div>
    </div>
  );
};
