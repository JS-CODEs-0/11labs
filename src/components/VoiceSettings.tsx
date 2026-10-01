'use client';

import React, { useState } from 'react';
import { VoiceSettings as VoiceSettingsType } from '@/types/tts';
import { Sliders, RotateCcw, Info, ChevronDown, ChevronUp, Zap } from 'lucide-react';

interface VoiceSettingsProps {
  settings: VoiceSettingsType;
  onChange: (newSettings: VoiceSettingsType) => void;
  disabled?: boolean;
}

export const DEFAULT_VOICE_SETTINGS: VoiceSettingsType = {
  stability: 0.5,
  similarity_boost: 0.75,
  style: 0.0,
  use_speaker_boost: true,
};

export const VoiceSettings: React.FC<VoiceSettingsProps> = ({
  settings,
  onChange,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleSliderChange = (key: keyof VoiceSettingsType, value: number | boolean) => {
    onChange({
      ...settings,
      [key]: value,
    });
  };

  const handleReset = () => {
    onChange(DEFAULT_VOICE_SETTINGS);
  };

  return (
    <div className="flex flex-col rounded-2xl border border-zinc-800/90 bg-zinc-900/60 shadow-xl backdrop-blur-md overflow-hidden">
      {/* Accordion Toggle Header */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-zinc-800/30 transition-colors select-none"
      >
        <div className="flex items-center gap-2">
          <Sliders className="h-4 w-4 text-violet-400" />
          <h2 className="text-sm font-semibold text-zinc-100 tracking-wide">
            Voice Fine-Tuning
          </h2>
          <span className="text-[11px] text-zinc-400 font-mono">
            (Stability: {settings.stability.toFixed(2)}, Clarity: {settings.similarity_boost.toFixed(2)})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleReset();
            }}
            disabled={disabled}
            className="flex items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-950/60 px-2 py-1 text-xs font-medium text-zinc-400 hover:border-zinc-700 hover:text-zinc-200 transition-all disabled:opacity-50"
            title="Reset voice settings to defaults"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
          {isOpen ? (
            <ChevronUp className="h-4 w-4 text-zinc-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-zinc-400" />
          )}
        </div>
      </div>

      {/* Expanded Controls Body */}
      {isOpen && (
        <div className="flex flex-col gap-4 border-t border-zinc-800/60 p-4 bg-zinc-950/40">
          {/* 1. Stability Slider */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-medium text-zinc-200 flex items-center gap-1.5">
                Stability
                <span
                  className="group relative cursor-help text-zinc-500 hover:text-zinc-300"
                  title="Higher stability makes speech more consistent across generations. Lower values introduce emotional variation and randomness."
                >
                  <Info className="h-3.5 w-3.5" />
                </span>
              </label>
              <span className="font-mono text-xs font-semibold text-violet-300 bg-violet-950/60 px-2 py-0.5 rounded border border-violet-800/40">
                {settings.stability.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={settings.stability}
              onChange={(e) => handleSliderChange('stability', parseFloat(e.target.value))}
              disabled={disabled}
              className="w-full accent-violet-500 bg-zinc-800 h-1.5 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
            />
            <div className="flex justify-between text-[10px] text-zinc-400">
              <span>More Expressive (0.0)</span>
              <span>More Stable (1.0)</span>
            </div>
          </div>

          {/* 2. Similarity / Clarity Slider */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-medium text-zinc-200 flex items-center gap-1.5">
                Clarity / Similarity
                <span
                  className="group relative cursor-help text-zinc-500 hover:text-zinc-300"
                  title="Enhances clarity and resemblance to the original speaker voice. High values may introduce minor artifacts."
                >
                  <Info className="h-3.5 w-3.5" />
                </span>
              </label>
              <span className="font-mono text-xs font-semibold text-violet-300 bg-violet-950/60 px-2 py-0.5 rounded border border-violet-800/40">
                {settings.similarity_boost.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={settings.similarity_boost}
              onChange={(e) => handleSliderChange('similarity_boost', parseFloat(e.target.value))}
              disabled={disabled}
              className="w-full accent-violet-500 bg-zinc-800 h-1.5 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
            />
            <div className="flex justify-between text-[10px] text-zinc-400">
              <span>Low Clarity (0.0)</span>
              <span>High Fidelity (1.0)</span>
            </div>
          </div>

          {/* 3. Style Exaggeration Slider */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-medium text-zinc-200 flex items-center gap-1.5">
                Style Exaggeration
                <span
                  className="group relative cursor-help text-zinc-500 hover:text-zinc-300"
                  title="Amplifies the speaker's unique cadence and character style. High values increase emotion but may reduce stability."
                >
                  <Info className="h-3.5 w-3.5" />
                </span>
              </label>
              <span className="font-mono text-xs font-semibold text-violet-300 bg-violet-950/60 px-2 py-0.5 rounded border border-violet-800/40">
                {settings.style.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={settings.style}
              onChange={(e) => handleSliderChange('style', parseFloat(e.target.value))}
              disabled={disabled}
              className="w-full accent-violet-500 bg-zinc-800 h-1.5 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
            />
            <div className="flex justify-between text-[10px] text-zinc-400">
              <span>None (0.0)</span>
              <span>Exaggerated (1.0)</span>
            </div>
          </div>

          {/* 4. Speaker Boost Toggle */}
          <div className="flex items-center justify-between pt-1 border-t border-zinc-800/60">
            <div className="flex items-center gap-2">
              <Zap className="h-3.5 w-3.5 text-amber-400" />
              <div>
                <span className="text-xs font-medium text-zinc-200 block">Speaker Boost</span>
                <span className="text-[10px] text-zinc-400 block">Enhances similarity to original speaker</span>
              </div>
            </div>
            <button
              type="button"
              disabled={disabled}
              onClick={() => handleSliderChange('use_speaker_boost', !settings.use_speaker_boost)}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                settings.use_speaker_boost ? 'bg-violet-600' : 'bg-zinc-800'
              } disabled:opacity-50`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  settings.use_speaker_boost ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
