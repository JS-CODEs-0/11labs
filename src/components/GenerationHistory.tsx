'use client';

import React from 'react';
import { GeneratedAudioItem } from '@/types/tts';
import { History, Play, Download, Trash2, Clock } from 'lucide-react';

interface GenerationHistoryProps {
  history: GeneratedAudioItem[];
  activeId: string | null;
  onSelect: (item: GeneratedAudioItem) => void;
  onClear: () => void;
}

export const GenerationHistory: React.FC<GenerationHistoryProps> = ({
  history,
  activeId,
  onSelect,
  onClear,
}) => {
  if (history.length === 0) return null;

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-zinc-800/90 bg-zinc-900/60 p-4 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-violet-400" />
          <h2 className="text-sm font-semibold text-zinc-100 tracking-wide">
            Session History ({history.length})
          </h2>
        </div>

        <button
          type="button"
          onClick={onClear}
          className="flex items-center gap-1 text-xs text-zinc-500 hover:text-red-400 transition-colors"
        >
          <Trash2 className="h-3 w-3" />
          Clear History
        </button>
      </div>

      <div className="max-h-[220px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
        {history.map((item) => {
          const isActive = item.id === activeId;
          return (
            <div
              key={item.id}
              onClick={() => onSelect(item)}
              className={`flex items-center justify-between rounded-xl border p-3 cursor-pointer transition-all ${
                isActive
                  ? 'border-violet-500/80 bg-violet-950/40 ring-1 ring-violet-500/30'
                  : 'border-zinc-800/80 bg-zinc-950/50 hover:border-zinc-700 hover:bg-zinc-900/70'
              }`}
            >
              <div className="min-w-0 flex-1 pr-3">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs text-zinc-200">
                    {item.voiceName}
                  </span>
                  <span className="text-[10px] text-zinc-500 font-mono">
                    {item.createdAt}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 truncate mt-0.5">
                  {item.text}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(item);
                  }}
                  className={`flex h-7 w-7 items-center justify-center rounded-full border transition-all ${
                    isActive
                      ? 'border-violet-500 bg-violet-600 text-white'
                      : 'border-zinc-700 bg-zinc-800 text-zinc-300 hover:border-violet-400 hover:text-white'
                  }`}
                >
                  <Play className="h-3 w-3 ml-0.5" />
                </button>

                <a
                  href={item.audioUrl}
                  download="vocalforge-speech.mp3"
                  onClick={(e) => e.stopPropagation()}
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700 hover:text-white transition-all"
                  title="Download MP3"
                >
                  <Download className="h-3 w-3" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
