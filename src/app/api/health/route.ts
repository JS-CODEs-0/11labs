import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const apiKey = process.env.ELEVENLABS_API_KEY?.trim();
  const hasApiKey = Boolean(apiKey);

  return NextResponse.json(
    {
      status: hasApiKey ? 'ready' : 'missing_key',
      hasApiKey,
      message: hasApiKey
        ? 'ElevenLabs API key is configured on server.'
        : 'ElevenLabs API key is missing. Set ELEVENLABS_API_KEY in Vercel environment variables.',
    },
    {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    }
  );
}
