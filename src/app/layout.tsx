import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'VocalForge — ElevenLabs Neural AI Text-to-Speech',
  description:
    'Production-grade AI text-to-speech studio powered by ElevenLabs. Synthesize humanlike, emotional, lifelike audio with custom voice fine-tuning.',
  keywords: [
    'ElevenLabs',
    'Text to Speech',
    'AI Voice Generator',
    'VocalForge',
    'Neural TTS',
    'Voiceover',
  ],
  authors: [{ name: 'VocalForge AI' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body
        className={`${inter.variable} font-sans bg-zinc-950 text-zinc-100 min-h-screen antialiased selection:bg-violet-600 selection:text-white`}
      >
        {children}
      </body>
    </html>
  );
}
