'use client';

import React, { useState, useRef } from 'react';
import { ElevenLabsVoice } from '@/types/tts';
import { Search, User, Play, Pause, Check, Sparkles, Filter, AlertTriangle } from 'lucide-react';

interface VoiceSelectorProps {
  voices: ElevenLabsVoice[];
  selectedVoiceId: string;
  onSelectVoice: (voice: ElevenLabsVoice) => void;
  disabled?: boolean;
  noEligibleVoices?: boolean;
}

export const VoiceSelector: React.FC<VoiceSelectorProps> = ({
  voices,
  selectedVoiceId,
  onSelectVoice,
  disabled = false,
  noEligibleVoices = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [playingPreviewId, setPlayingPreviewId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Extract unique categories
  const categories = ['All', ...Array.from(new Set(voices.map((v) => v.category).filter(Boolean))) as string[]];

  // Filter voices based on search query & category
  const filteredVoices = voices.filter((voice) => {
    const matchesSearch =
      voice.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (voice.description && voice.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (voice.labels &&
        Object.values(voice.labels).some((val) =>
          String(val).toLowerCase().includes(searchQuery.toLowerCase())
        ));

    const matchesCategory =
      selectedCategory === 'All' ||
      voice.category?.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  const togglePreview = (e: React.MouseEvent, voice: ElevenLabsVoice) => {
    e.stopPropagation();
    if (!voice.preview_url) return;

    if (playingPreviewId === voice.voice_id) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setPlayingPreviewId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const audio = new Audio(voice.preview_url);
      audioRef.current = audio;
      audio.play().catch((err) => console.warn('Preview play error:', err));
      setPlayingPreviewId(voice.voice_id);

      audio.onended = () => {
        setPlayingPreviewId(null);
      };
    }
  };

  const selectedVoiceObj = voices.find((v) => v.voice_id === selectedVoiceId) || voices[0];

  return (
    <div className="flex flex-col gap-3.5 rounded-2xl border border-zinc-800/90 bg-zinc-900/60 p-4 shadow-xl backdrop-blur-md">
      {/* Header & Selected Voice Badge */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-violet-400" />
          <h2 className="text-sm font-semibold text-zinc-100 tracking-wide">
            Voice Selector ({voices.length} Available)
          </h2>
        </div>

        {selectedVoiceObj ? (
          <div className="flex items-center gap-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-200">
            <Sparkles className="h-3 w-3 text-violet-400" />
            <span>{selectedVoiceObj.name}</span>
            {selectedVoiceObj.category && (
              <span className="text-[10px] text-violet-300 opacity-80">
                ({selectedVoiceObj.category})
              </span>
            )}
          </div>
        ) : null}
      </div>

      {/* Warning banner if no eligible voices */}
      {noEligibleVoices && (
        <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200">
          <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">No API-Compatible Voices Found</span>
            <p className="text-[11px] text-amber-300/90 mt-0.5">
              Free-tier ElevenLabs accounts cannot access Library voices via API. Please use premade voices (like Adam, Bella, Antoni, or George) or upgrade your ElevenLabs subscription.
            </p>
          </div>
        </div>
      )}

      {/* Search & Category Filter Bar */}
      {voices.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-2.5">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={disabled}
              placeholder="Search voices by name, accent, or style..."
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950/80 pl-9 pr-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-all disabled:opacity-50"
            />
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                disabled={disabled}
                onClick={() => setSelectedCategory(cat)}
                className={`shrink-0 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${
                  selectedCategory === cat
                    ? 'border border-violet-500/40 bg-violet-600/20 text-violet-200 shadow-sm'
                    : 'border border-zinc-800/80 bg-zinc-950/40 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                } disabled:opacity-50`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Voice Grid Container */}
      <div className="max-h-[260px] overflow-y-auto pr-1 space-y-2 custom-scrollbar">
        {filteredVoices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center border border-dashed border-zinc-800 rounded-xl bg-zinc-950/30">
            <Filter className="h-6 w-6 text-zinc-600 mb-2" />
            <p className="text-xs font-medium text-zinc-400">
              {voices.length === 0 ? 'No API-compatible voices available' : 'No voices matching your filter'}
            </p>
            {voices.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="mt-2 text-xs text-violet-400 hover:underline"
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          filteredVoices.map((voice) => {
            const isSelected = voice.voice_id === selectedVoiceId;
            const isPlaying = playingPreviewId === voice.voice_id;

            return (
              <div
                key={voice.voice_id}
                onClick={() => !disabled && onSelectVoice(voice)}
                className={`group relative flex items-center justify-between rounded-xl border p-3 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-violet-500/80 bg-gradient-to-r from-violet-950/40 via-indigo-950/30 to-zinc-900/60 shadow-md shadow-violet-950/30 ring-1 ring-violet-500/30'
                    : 'border-zinc-800/80 bg-zinc-950/50 hover:border-zinc-700 hover:bg-zinc-900/70'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {/* Voice Info */}
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg font-bold text-xs transition-colors ${
                      isSelected
                        ? 'bg-violet-600 text-white shadow-inner'
                        : 'bg-zinc-800 text-zinc-300 group-hover:bg-zinc-700'
                    }`}
                  >
                    {voice.name.charAt(0)}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-zinc-100 truncate">
                        {voice.name}
                      </span>
                      {voice.category && (
                        <span className="rounded bg-zinc-800/80 px-1.5 py-0.5 text-[10px] font-medium text-zinc-400">
                          {voice.category}
                        </span>
                      )}
                    </div>
                    {voice.description && (
                      <p className="text-[11px] text-zinc-400 truncate max-w-xs mt-0.5">
                        {voice.description}
                      </p>
                    )}
                    {/* Tags */}
                    {voice.labels && Object.keys(voice.labels).length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {Object.entries(voice.labels).map(([k, v]) => (
                          <span
                            key={k}
                            className="text-[9px] font-mono text-zinc-500 bg-zinc-900 px-1 py-0.2 rounded border border-zinc-800"
                          >
                            {String(v)}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right controls: Preview Audio & Selected Checkmark */}
                <div className="flex items-center gap-2 shrink-0">
                  {voice.preview_url && (
                    <button
                      type="button"
                      onClick={(e) => togglePreview(e, voice)}
                      title={isPlaying ? 'Pause preview' : 'Play audio preview'}
                      className={`flex h-7 w-7 items-center justify-center rounded-full border transition-all ${
                        isPlaying
                          ? 'border-violet-500 bg-violet-600 text-white animate-pulse'
                          : 'border-zinc-700 bg-zinc-800 text-zinc-300 hover:border-violet-400 hover:text-white'
                      }`}
                    >
                      {isPlaying ? (
                        <Pause className="h-3 w-3" />
                      ) : (
                        <Play className="h-3 w-3 ml-0.5" />
                      )}
                    </button>
                  )}

                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded-full border transition-all ${
                      isSelected
                        ? 'border-violet-500 bg-violet-600 text-white'
                        : 'border-zinc-700 bg-zinc-900 text-transparent group-hover:border-zinc-600'
                    }`}
                  >
                    <Check className="h-3 w-3" />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
