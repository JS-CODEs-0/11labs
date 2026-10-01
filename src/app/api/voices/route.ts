import { NextRequest, NextResponse } from 'next/server';
import { fetchServerElevenLabsVoices } from '@/lib/elevenlabs';

// Force dynamic evaluation on Vercel serverless functions (prevents static build-time caching)
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const { voices, hasApiKey, source } = await fetchServerElevenLabsVoices();

    return NextResponse.json(
      {
        hasApiKey,
        voices,
        total: voices.length,
        noEligibleVoices: hasApiKey && voices.length === 0,
        source,
        message:
          voices.length === 0 && hasApiKey
            ? 'No API-compatible voices found for this ElevenLabs account. Free tier API keys cannot access Library voices.'
            : undefined,
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    );
  } catch (error) {
    console.error('Error in voices API route:', error);
    return NextResponse.json(
      {
        hasApiKey: Boolean(process.env.ELEVENLABS_API_KEY?.trim()),
        voices: [],
        total: 0,
        noEligibleVoices: true,
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    );
  }
}
