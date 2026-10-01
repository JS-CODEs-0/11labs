'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { TextEditor } from '@/components/TextEditor';
import { VoiceSelector } from '@/components/VoiceSelector';
import { VoiceSettings, DEFAULT_VOICE_SETTINGS } from '@/components/VoiceSettings';
import { ModelSelector } from '@/components/ModelSelector';
import { GenerateButton } from '@/components/GenerateButton';
import { EmptyState } from '@/components/EmptyState';
import { AudioPlayer } from '@/components/AudioPlayer';
import { GenerationHistory } from '@/components/GenerationHistory';
import { ApiKeyModal } from '@/components/ApiKeyModal';
import { ToastNotification, ToastMessage } from '@/components/ToastNotification';
import { ElevenLabsVoice, VoiceSettings as VoiceSettingsType, GeneratedAudioItem } from '@/types/tts';
import { validateTTSText } from '@/lib/validation';
import { Sparkles } from 'lucide-react';

export default function Home() {
  const [text, setText] = useState<string>(
    'Welcome to VocalForge. Experience hyper-realistic AI text-to-speech synthesis powered by ElevenLabs neural models.'
  );
  const [voices, setVoices] = useState<ElevenLabsVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<ElevenLabsVoice | null>(null);
  const [selectedModelId, setSelectedModelId] = useState<string>('eleven_multilingual_v2');
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettingsType>(DEFAULT_VOICE_SETTINGS);

  const [hasApiKey, setHasApiKey] = useState<boolean>(true);
  const [noEligibleVoices, setNoEligibleVoices] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [activeAudio, setActiveAudio] = useState<GeneratedAudioItem | null>(null);
  const [history, setHistory] = useState<GeneratedAudioItem[]>([]);
  const [isKeyModalOpen, setIsKeyModalOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Load server voice list & API status on mount
  useEffect(() => {
    async function loadVoicesAndStatus() {
      try {
        const res = await fetch('/api/voices');
        if (res.ok) {
          const data = await res.json();
          setHasApiKey(Boolean(data.hasApiKey));
          setNoEligibleVoices(Boolean(data.noEligibleVoices));
          if (Array.isArray(data.voices) && data.voices.length > 0) {
            setVoices(data.voices);
            setSelectedVoice(data.voices[0]);
          } else {
            setVoices([]);
            setSelectedVoice(null);
          }
        }
      } catch (err) {
        console.warn('Failed to load voices from server:', err);
      }
    }

    loadVoicesAndStatus();
  }, []);

  const addToast = (type: 'error' | 'success' | 'info', message: string, title?: string) => {
    const id = String(Date.now() + Math.random());
    setToasts((prev) => [...prev, { id, type, message, title }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Main Speech Generation Handler
  const handleGenerateSpeech = async () => {
    const validation = validateTTSText(text);
    if (!validation.valid) {
      addToast('error', validation.error || 'Invalid prompt text.', 'Validation Error');
      return;
    }

    if (!selectedVoice || !selectedVoice.voice_id) {
      addToast(
        'error',
        'No eligible voice selected. Please select a valid voice authorized for your account.',
        'Voice Required'
      );
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text.trim(),
          voiceId: selectedVoice.voice_id,
          modelId: selectedModelId,
          settings: voiceSettings,
        }),
      });

      if (!response.ok) {
        let errorMessage = 'Speech generation failed. Please try again.';
        try {
          const errJson = await response.json();
          if (errJson.error) {
            errorMessage = errJson.error;
          }
          if (errJson.code === 'MISSING_API_KEY' || response.status === 401) {
            setHasApiKey(false);
            setIsKeyModalOpen(true);
          }
        } catch {
          // fallback
        }

        addToast(
          'error',
          errorMessage,
          response.status === 402
            ? 'Free Tier Restriction'
            : response.status === 429
            ? 'Rate Limit Exceeded'
            : response.status === 401
            ? 'Authentication Required'
            : 'Generation Failed'
        );
        setIsGenerating(false);
        return;
      }

      // Read audio blob response
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      const newItem: GeneratedAudioItem = {
        id: String(Date.now()),
        text: text.trim(),
        voiceId: selectedVoice.voice_id,
        voiceName: selectedVoice.name,
        modelId: selectedModelId,
        audioUrl,
        duration: 0,
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        charCount: text.length,
      };

      setActiveAudio(newItem);
      setHistory((prev) => [newItem, ...prev]);
      addToast('success', `Synthesized speech using voice "${selectedVoice.name}"!`, 'Generation Complete');
    } catch (err: any) {
      console.error('TTS Generation client error:', err);
      addToast(
        'error',
        'A network or server error occurred during synthesis. Please check your connection.',
        'Network Error'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClearHistory = () => {
    // Revoke object URLs to prevent memory leaks
    history.forEach((item) => {
      if (item.audioUrl.startsWith('blob:')) {
        URL.revokeObjectURL(item.audioUrl);
      }
    });
    setHistory([]);
  };

  const isTextInvalid = !text.trim() || text.length > 5000 || !selectedVoice;
  const disabledReason = !selectedVoice
    ? 'No eligible voice available for this account'
    : !text.trim()
    ? 'Enter text above to generate speech'
    : text.length > 5000
    ? 'Text exceeds 5,000 character limit'
    : undefined;

  return (
    <div className="min-h-screen bg-[#090a0f] text-zinc-100 flex flex-col selection:bg-violet-600 selection:text-white">
      {/* Background radial ambient glow */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-violet-900/20 via-indigo-900/10 to-transparent blur-[140px] opacity-70" />
        <div className="absolute top-[40%] -right-[10%] w-[600px] h-[600px] bg-purple-900/10 blur-[160px] pointer-events-none" />
      </div>

      {/* Header Bar */}
      <Header
        hasApiKey={hasApiKey}
        onOpenKeyModal={() => setIsKeyModalOpen(true)}
      />

      {/* Main Workspace Layout */}
      <main className="relative z-10 flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Workspace Title & Intro Banner */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/60 pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
              Text to Speech Studio
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
              Synthesize natural, humanlike speech with ElevenLabs neural voice models, customizable stability, clarity, and style.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono text-zinc-400 bg-zinc-900 px-3 py-1.5 rounded-xl border border-zinc-800/80">
              ElevenLabs API v1
            </span>
          </div>
        </div>

        {/* Two-Column Grid: LEFT (Editor + Controls) | RIGHT (Audio Player + History) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Editor & Configuration (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* 1. Text Editor */}
            <TextEditor
              text={text}
              setText={setText}
              disabled={isGenerating}
              onGenerateShortcut={handleGenerateSpeech}
            />

            {/* 2. Voice Selector */}
            <VoiceSelector
              voices={voices}
              selectedVoiceId={selectedVoice?.voice_id || ''}
              onSelectVoice={setSelectedVoice}
              disabled={isGenerating}
              noEligibleVoices={noEligibleVoices}
            />

            {/* 3. Model Selector */}
            <ModelSelector
              selectedModelId={selectedModelId}
              onSelectModel={setSelectedModelId}
              disabled={isGenerating}
            />

            {/* 4. Expandable Voice Settings */}
            <VoiceSettings
              settings={voiceSettings}
              onChange={setVoiceSettings}
              disabled={isGenerating}
            />

            {/* 5. Primary Action Generate Button */}
            <GenerateButton
              onGenerate={handleGenerateSpeech}
              isGenerating={isGenerating}
              disabled={isTextInvalid}
              disabledReason={disabledReason}
            />
          </div>

          {/* RIGHT COLUMN: Output Audio & Session History (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6 sticky top-24">
            {/* Audio Player / Empty State */}
            {activeAudio ? (
              <AudioPlayer
                audioUrl={activeAudio.audioUrl}
                voiceName={activeAudio.voiceName}
                modelId={activeAudio.modelId}
                text={activeAudio.text}
                createdAt={activeAudio.createdAt}
              />
            ) : (
              <EmptyState
                onLoadSample={() => {
                  setText(
                    'Welcome to VocalForge. Experience hyper-realistic AI text-to-speech synthesis powered by ElevenLabs neural models.'
                  );
                  handleGenerateSpeech();
                }}
              />
            )}

            {/* Session History List */}
            <GenerationHistory
              history={history}
              activeId={activeAudio?.id || null}
              onSelect={(item) => setActiveAudio(item)}
              onClear={handleClearHistory}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-zinc-800/60 bg-zinc-950/60 py-6 text-center text-xs text-zinc-500 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} VocalForge Studio. Powered by ElevenLabs REST API.</p>
          <p className="flex items-center gap-1.5 font-mono text-[11px] text-zinc-400">
            <Sparkles className="h-3 w-3 text-violet-400" /> Server API Secured • Account Voices Only
          </p>
        </div>
      </footer>

      {/* Modals & Toast Notifications */}
      <ApiKeyModal
        isOpen={isKeyModalOpen}
        onClose={() => setIsKeyModalOpen(false)}
        hasApiKey={hasApiKey}
      />

      <ToastNotification toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
