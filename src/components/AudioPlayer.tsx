'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Download,
  Volume2,
  VolumeX,
  Sparkles,
  CheckCircle2,
  Clock,
  Gauge,
  Share2,
} from 'lucide-react';
import { AudioVisualizer } from './AudioVisualizer';

interface AudioPlayerProps {
  audioUrl: string;
  voiceName: string;
  modelId: string;
  text: string;
  createdAt?: string;
  onDownload?: () => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioUrl,
  voiceName,
  modelId,
  text,
  createdAt,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    // Auto-play when new audio is generated
    audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audioUrl]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleReplay = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().then(() => setIsPlaying(true));
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
      setIsMuted(newVol === 0);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume || 1;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const changePlaybackRate = (rate: number) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  const handleDownload = () => {
    if (!audioUrl) return;
    const a = document.createElement('a');
    a.href = audioUrl;
    a.download = 'vocalforge-speech.mp3';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-violet-500/40 bg-gradient-to-b from-zinc-900/90 via-zinc-950/90 to-zinc-950 p-5 shadow-2xl backdrop-blur-xl ring-1 ring-violet-500/20">
      {/* Hidden Native Audio Element */}
      <audio ref={audioRef} src={audioUrl} preload="auto" />

      {/* Top Banner with Badges & Success Indicator */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800/80 pb-3">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-bold tracking-wide text-zinc-100 uppercase">
            Synthesized Audio Ready
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-2.5 py-0.5 font-semibold text-violet-300">
            {voiceName}
          </span>
          <span className="rounded-full border border-zinc-800 bg-zinc-900 px-2.5 py-0.5 font-mono text-[10px] text-zinc-400">
            {modelId.replace('eleven_', '').replace('_v2', '')}
          </span>
        </div>
      </div>

      {/* Audio Visualizer */}
      <AudioVisualizer audioElement={audioRef.current} isPlaying={isPlaying} />

      {/* Scrubber Timeline Bar */}
      <div className="flex flex-col gap-1.5">
        <input
          type="range"
          min="0"
          max={duration || 100}
          step="0.1"
          value={currentTime}
          onChange={handleSeek}
          className="w-full accent-violet-500 bg-zinc-800 h-2 rounded-lg appearance-none cursor-pointer hover:bg-zinc-700 transition-all"
        />
        <div className="flex items-center justify-between font-mono text-xs text-zinc-400">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Transport Controls Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        {/* Playback Controls */}
        <div className="flex items-center gap-2">
          {/* Play/Pause Main Button */}
          <button
            type="button"
            onClick={togglePlay}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/30 hover:scale-105 active:scale-95 transition-all"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="h-5 w-5 fill-current" />
            ) : (
              <Play className="h-5 w-5 fill-current ml-0.5" />
            )}
          </button>

          {/* Replay Button */}
          <button
            type="button"
            onClick={handleReplay}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-700 hover:text-white transition-all"
            title="Replay from start"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          {/* Speed Switcher */}
          <div className="relative group">
            <button
              type="button"
              className="flex items-center gap-1 rounded-xl border border-zinc-800 bg-zinc-900 px-2.5 py-2 font-mono text-xs font-semibold text-zinc-300 hover:border-zinc-700 hover:text-white transition-all"
              title="Change speed"
            >
              <Gauge className="h-3.5 w-3.5 text-violet-400" />
              <span>{playbackRate}x</span>
            </button>
            <div className="absolute bottom-full mb-1 left-0 hidden group-hover:flex flex-col bg-zinc-900 border border-zinc-800 rounded-xl p-1 shadow-xl z-20">
              {[0.75, 1.0, 1.25, 1.5, 2.0].map((rate) => (
                <button
                  key={rate}
                  onClick={() => changePlaybackRate(rate)}
                  className={`px-3 py-1 font-mono text-xs text-left rounded-lg hover:bg-violet-600/30 hover:text-white transition-colors ${
                    playbackRate === rate ? 'text-violet-300 font-bold bg-violet-950/50' : 'text-zinc-400'
                  }`}
                >
                  {rate}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Volume & Mute */}
        <div className="flex items-center gap-2 bg-zinc-950/60 px-3 py-1.5 rounded-xl border border-zinc-800/80">
          <button
            type="button"
            onClick={toggleMute}
            className="text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="h-4 w-4 text-red-400" />
            ) : (
              <Volume2 className="h-4 w-4 text-violet-400" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-16 accent-violet-500 bg-zinc-800 h-1.5 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Action Buttons: Copy & Download */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyText}
            className="flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs font-medium text-zinc-300 hover:border-zinc-700 hover:text-white transition-all"
            title="Copy synthesized prompt text"
          >
            {isCopied ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Share2 className="h-3.5 w-3.5 text-zinc-400" />
                <span>Copy Text</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-xs font-bold text-white hover:bg-violet-500 shadow-lg shadow-violet-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
            title="Download MP3 file"
          >
            <Download className="h-4 w-4" />
            <span>Download MP3</span>
          </button>
        </div>
      </div>

      {/* Prompt Preview Snippet */}
      <div className="rounded-xl border border-zinc-800/60 bg-zinc-950/60 p-3 text-xs text-zinc-300">
        <span className="font-semibold text-zinc-400 block mb-1 text-[11px] uppercase tracking-wider">
          Prompt Snippet
        </span>
        <p className="line-clamp-2 leading-relaxed italic text-zinc-300">
          "{text}"
        </p>
      </div>
    </div>
  );
};
