'use client';

import React, { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
  audioElement: HTMLAudioElement | null;
  isPlaying: boolean;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  audioElement,
  isPlaying,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  useEffect(() => {
    if (!audioElement || !canvasRef.current) return;

    // Initialize Web Audio API node if not already connected
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          audioCtxRef.current = ctx;
          const analyser = ctx.createAnalyser();
          analyser.fftSize = 64;
          analyserRef.current = analyser;

          // Connect audio element source
          try {
            const source = ctx.createMediaElementSource(audioElement);
            sourceNodeRef.current = source;
            source.connect(analyser);
            analyser.connect(ctx.destination);
          } catch (e) {
            // Source might already be connected to element
          }
        }
      }
    } catch (e) {
      console.warn('Web Audio API setup notice:', e);
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      let dataArray: Uint8Array;
      if (analyserRef.current && isPlaying) {
        const bufferLength = analyserRef.current.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
        analyserRef.current.getByteFrequencyData(dataArray as any);
      } else {
        // Mock idle / resting wave
        dataArray = new Uint8Array(32);
        for (let i = 0; i < dataArray.length; i++) {
          dataArray[i] = isPlaying ? Math.sin(Date.now() / 150 + i) * 30 + 40 : 12;
        }
      }

      const barCount = 32;
      const barWidth = (width / barCount) * 0.65;
      const gap = (width - barCount * barWidth) / (barCount + 1);

      for (let i = 0; i < barCount; i++) {
        const val = dataArray[i % dataArray.length] || 0;
        const barHeight = Math.max(4, (val / 255) * height * 0.85);
        const x = gap + i * (barWidth + gap);
        const y = (height - barHeight) / 2;

        // Gradient for bars
        const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
        if (isPlaying) {
          gradient.addColorStop(0, '#a855f7'); // purple
          gradient.addColorStop(0.5, '#6366f1'); // indigo
          gradient.addColorStop(1, '#3b82f6'); // blue
        } else {
          gradient.addColorStop(0, '#3f3f46');
          gradient.addColorStop(1, '#27272a');
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        if (typeof (ctx as any).roundRect === 'function') {
          (ctx as any).roundRect(x, y, barWidth, barHeight, 4);
        } else {
          ctx.rect(x, y, barWidth, barHeight);
        }
        ctx.fill();
      }

      if (isPlaying) {
        animationFrameRef.current = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [audioElement, isPlaying]);

  return (
    <div className="relative w-full h-16 rounded-xl bg-zinc-950/80 border border-zinc-800/80 px-4 py-2 flex items-center justify-center overflow-hidden">
      <canvas
        ref={canvasRef}
        width={400}
        height={50}
        className="w-full h-full object-contain"
      />
    </div>
  );
};
