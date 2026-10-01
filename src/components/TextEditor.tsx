'use client';

import React, { useRef } from 'react';
import { Trash2, Sparkles, FileText, CornerDownLeft, Command } from 'lucide-react';
import { MAX_TEXT_LENGTH } from '@/lib/validation';

interface TextEditorProps {
  text: string;
  setText: (value: string) => void;
  disabled?: boolean;
  onGenerateShortcut?: () => void;
}

const SAMPLE_PROMPTS = [
  {
    label: '🎭 Storytelling',
    text: 'The forgotten kingdom slept beneath ancient mists, waiting for a champion to break the hundred-year spell. Whispers of destiny echoed through the emerald forest.',
  },
  {
    label: '🎙️ News Anchor',
    text: 'Good evening. Breaking news tonight as space exploration reaches a monumental milestone with the successful activation of the first interstellar telescope array.',
  },
  {
    label: '⚡ Tech Launch',
    text: 'Introducing VocalForge: ultra-realistic AI voice synthesis powered by ElevenLabs. Effortlessly convert text into expressive, Studio-quality audio in real time.',
  },
  {
    label: '🧘 Meditation',
    text: 'Take a slow, deep breath in. Hold for three seconds, and gently exhale. Let all the tension in your shoulders dissipate into the quiet space around you.',
  },
];

export const TextEditor: React.FC<TextEditorProps> = ({
  text,
  setText,
  disabled = false,
  onGenerateShortcut,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const isOverLimit = charCount > MAX_TEXT_LENGTH;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      if (onGenerateShortcut && text.trim() && !isOverLimit && !disabled) {
        onGenerateShortcut();
      }
    }
  };

  const handleClear = () => {
    setText('');
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-zinc-800/90 bg-zinc-900/60 p-4 shadow-xl backdrop-blur-md">
      {/* Editor Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-violet-400" />
          <h2 className="text-sm font-semibold text-zinc-100 tracking-wide">
            Text Prompt
          </h2>
        </div>

        {/* Clear Button */}
        {text && (
          <button
            type="button"
            onClick={handleClear}
            disabled={disabled}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-800/50 px-2.5 py-1 text-xs font-medium text-zinc-400 hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-300 transition-all disabled:opacity-50"
            title="Clear all text"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear
          </button>
        )}
      </div>

      {/* Preset Quick Actions */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[11px] font-medium text-zinc-400 flex items-center gap-1 mr-1">
          <Sparkles className="h-3 w-3 text-amber-400" /> Samples:
        </span>
        {SAMPLE_PROMPTS.map((preset, idx) => (
          <button
            key={idx}
            type="button"
            disabled={disabled}
            onClick={() => setText(preset.text)}
            className="rounded-lg border border-zinc-800/80 bg-zinc-950/60 px-2.5 py-1 text-xs font-medium text-zinc-300 hover:border-violet-500/50 hover:bg-violet-500/10 hover:text-violet-200 transition-all disabled:opacity-50"
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Main Text Area */}
      <div className="relative group">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Type or paste your text here..."
          rows={7}
          maxLength={MAX_TEXT_LENGTH + 200}
          className={`w-full resize-y rounded-xl border bg-zinc-950/80 px-4 py-3.5 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition-all ${
            isOverLimit
              ? 'border-red-500/70 ring-2 ring-red-500/20'
              : 'border-zinc-800 group-hover:border-zinc-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20'
          } disabled:cursor-not-allowed disabled:opacity-60 leading-relaxed font-sans`}
        />
      </div>

      {/* Footer / Counters & Shortcuts */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-zinc-800/60 pt-2.5 text-xs text-zinc-400">
        <div className="flex items-center gap-3">
          <span
            className={`font-mono font-medium ${
              isOverLimit
                ? 'text-red-400 font-bold'
                : charCount > MAX_TEXT_LENGTH * 0.9
                ? 'text-amber-400'
                : 'text-zinc-300'
            }`}
          >
            {charCount.toLocaleString()} / {MAX_TEXT_LENGTH.toLocaleString()} chars
          </span>
          <span className="text-zinc-600">•</span>
          <span className="font-mono">{wordCount} words</span>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 bg-zinc-950/60 px-2 py-1 rounded-md border border-zinc-800/80">
          <Command className="h-3 w-3" />
          <span>+</span>
          <CornerDownLeft className="h-3 w-3" />
          <span>to Generate</span>
        </div>
      </div>
    </div>
  );
};
