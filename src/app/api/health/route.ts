import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.ELEVENLABS_API_KEY?.trim();
  const hasApiKey = Boolean(apiKey);

  return NextResponse.json({
    status: hasApiKey ? 'ready' : 'missing_key',
    hasApiKey,
    message: hasApiKey
      ? 'ElevenLabs API key is configured on server.'
      : 'ElevenLabs API key is missing. Set ELEVENLABS_API_KEY in .env.local',
  });
}
