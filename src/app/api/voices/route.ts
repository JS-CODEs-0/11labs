import { NextRequest, NextResponse } from 'next/server';
import { fetchServerElevenLabsVoices } from '@/lib/elevenlabs';

export async function GET(req: NextRequest) {
  try {
    const { voices, hasApiKey } = await fetchServerElevenLabsVoices();

    return NextResponse.json(
      {
        hasApiKey,
        voices,
        total: voices.length,
        noEligibleVoices: hasApiKey && voices.length === 0,
        message:
          voices.length === 0 && hasApiKey
            ? 'No API-compatible voices found for this ElevenLabs account. Free tier API keys cannot access Library voices.'
            : undefined,
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, max-age=60, s-maxage=300',
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
      { status: 200 }
    );
  }
}
