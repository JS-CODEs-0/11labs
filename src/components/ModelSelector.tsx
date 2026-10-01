'use client';

import React from 'react';
import { ELEVENLABS_MODELS } from '@/lib/elevenlabs';
import { Cpu, Check } from 'lucide-react';

interface ModelSelectorProps {
  selectedModelId: string;
  onSelectModel: (modelId: string) => void;
  disabled?: boolean;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  selectedModelId,
  onSelectModel,
  disabled = false,
}) => {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-zinc-800/90 bg-zinc-900/60 p-4 shadow-xl backdrop-blur-md">
      <div className="flex items-center gap-2">
        <Cpu className="h-4 w-4 text-violet-400" />
        <h2 className="text-sm font-semibold text-zinc-100 tracking-wide">
          Synthesis Model
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {ELEVENLABS_MODELS.map((model) => {
          const isSelected = model.id === selectedModelId;
          return (
            <div
              key={model.id}
              onClick={() => !disabled && onSelectModel(model.id)}
              className={`flex flex-col justify-between rounded-xl border p-3 cursor-pointer transition-all ${
                isSelected
                  ? 'border-violet-500/80 bg-violet-950/30 ring-1 ring-violet-500/30'
                  : 'border-zinc-800/80 bg-zinc-950/40 hover:border-zinc-700 hover:bg-zinc-900/60'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-start justify-between gap-1.5">
                <span className="font-semibold text-xs text-zinc-100">
                  {model.name}
                </span>
                <div className="flex items-center gap-1">
                  {model.badge && (
                    <span className="rounded-full bg-violet-500/20 px-1.5 py-0.5 text-[9px] font-bold text-violet-300 border border-violet-500/30">
                      {model.badge}
                    </span>
                  )}
                  {isSelected && (
                    <Check className="h-3.5 w-3.5 text-violet-400 shrink-0" />
                  )}
                </div>
              </div>
              <p className="text-[11px] text-zinc-400 mt-1.5 leading-normal">
                {model.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
