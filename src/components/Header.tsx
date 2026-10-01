'use client';

import React from 'react';
import { Volume2, Sparkles, Key, CheckCircle2, AlertTriangle } from 'lucide-react';

interface HeaderProps {
  hasApiKey: boolean;
  onOpenKeyModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ hasApiKey, onOpenKeyModal }) => {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Brand logo & title */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 shadow-lg shadow-violet-500/20 ring-1 ring-white/20">
            <Volume2 className="h-5 w-5 text-white" />
            <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-zinc-950 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-xl font-bold tracking-tight text-transparent">
                VocalForge
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-violet-500/30 bg-violet-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-violet-300">
                <Sparkles className="h-2.5 w-2.5" /> ElevenLabs v2
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-medium">
              Next-Gen Neural AI Text-to-Speech
            </p>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          {/* API Key Status Indicator */}
          <button
            type="button"
            onClick={onOpenKeyModal}
            className={`group flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
              hasApiKey
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20'
                : 'border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 animate-pulse'
            }`}
            title="Click to view API Key configuration"
          >
            {hasApiKey ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span className="hidden sm:inline">ElevenLabs Connected</span>
                <span className="sm:hidden">Connected</span>
              </>
            ) : (
              <>
                <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
                <span className="hidden sm:inline">API Key Required</span>
                <span className="sm:hidden">Setup Key</span>
              </>
            )}
            <Key className="h-3 w-3 opacity-60 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>
      </div>
    </header>
  );
};
