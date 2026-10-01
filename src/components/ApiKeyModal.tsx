'use client';

import React from 'react';
import { X, ShieldCheck, Key, Terminal, ExternalLink, AlertCircle, CheckCircle2 } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  hasApiKey: boolean;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  hasApiKey,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl ring-1 ring-white/10">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-xl border border-zinc-800 bg-zinc-900 p-1.5 text-zinc-400 hover:border-zinc-700 hover:text-white transition-all"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600/20 border border-violet-500/30 text-violet-400">
            <Key className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-zinc-100">
              ElevenLabs API Key Configuration
            </h3>
            <p className="text-xs text-zinc-400">
              Zero-Trust Server Environment Security
            </p>
          </div>
        </div>

        {/* Current Server Status */}
        <div className="mb-5 rounded-xl border p-3.5 flex items-center gap-3 bg-zinc-900/60 border-zinc-800">
          {hasApiKey ? (
            <>
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
              <div>
                <span className="text-xs font-bold text-emerald-300 block">
                  Server API Key Detected & Ready
                </span>
                <span className="text-[11px] text-zinc-400 block">
                  `ELEVENLABS_API_KEY` is active in server environment variables.
                </span>
              </div>
            </>
          ) : (
            <>
              <AlertCircle className="h-5 w-5 text-amber-400 shrink-0" />
              <div>
                <span className="text-xs font-bold text-amber-300 block">
                  Server API Key Not Detected
                </span>
                <span className="text-[11px] text-zinc-400 block">
                  Follow the steps below to enable real speech synthesis.
                </span>
              </div>
            </>
          )}
        </div>

        {/* Instructions */}
        <div className="space-y-4 text-xs text-zinc-300">
          <div className="flex items-start gap-2.5">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-600 text-[10px] font-bold text-white">
              1
            </span>
            <p>
              Get your free API key from the{' '}
              <a
                href="https://elevenlabs.io"
                target="_blank"
                rel="noreferrer"
                className="text-violet-400 hover:underline font-semibold inline-flex items-center gap-1"
              >
                ElevenLabs Dashboard <ExternalLink className="h-3 w-3" />
              </a>
              .
            </p>
          </div>

          <div className="flex items-start gap-2.5">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-600 text-[10px] font-bold text-white">
              2
            </span>
            <div>
              <p className="mb-1.5">
                Open or create <code className="text-violet-300 font-mono bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">.env.local</code> in the root directory:
              </p>
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/90 p-3 font-mono text-[11px] text-violet-300 flex items-center justify-between">
                <span>ELEVENLABS_API_KEY=sk_...</span>
                <Terminal className="h-4 w-4 text-zinc-500" />
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-600 text-[10px] font-bold text-white">
              3
            </span>
            <p>
              Restart your Next.js development server to pick up the environment variable changes.
            </p>
          </div>
        </div>

        {/* Security badge note */}
        <div className="mt-6 flex items-center gap-2 rounded-xl border border-violet-500/20 bg-violet-500/10 p-3 text-[11px] text-violet-300">
          <ShieldCheck className="h-4 w-4 text-violet-400 shrink-0" />
          <span>
            Your API Key is strictly stored server-side. It is never exposed to client browsers or bundled in React outputs.
          </span>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl bg-zinc-800 px-4 py-2 text-xs font-semibold text-zinc-200 hover:bg-zinc-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
