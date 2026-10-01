import { NextRequest, NextResponse } from 'next/server';
import { validateTTSText, validateVoiceId, validateVoiceSettings } from '@/lib/validation';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { text, voiceId, modelId = 'eleven_multilingual_v2', settings } = body;

    // 1. Validate Text
    const textValidation = validateTTSText(text);
    if (!textValidation.valid) {
      return NextResponse.json({ error: textValidation.error }, { status: 400 });
    }

    // 2. Validate Voice ID
    const voiceValidation = validateVoiceId(voiceId);
    if (!voiceValidation.valid) {
      return NextResponse.json({ error: voiceValidation.error }, { status: 400 });
    }

    // 3. Securely retrieve API Key on server side only
    const apiKey = process.env.ELEVENLABS_API_KEY?.trim();
    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            'ElevenLabs API key is not configured. Please set ELEVENLABS_API_KEY in your .env.local file.',
          code: 'MISSING_API_KEY',
        },
        { status: 401 }
      );
    }

    // 4. Sanitize voice settings
    const sanitizedSettings = validateVoiceSettings(settings);

    // 5. Call ElevenLabs API
    const elevenLabsUrl = `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(
      voiceId
    )}?output_format=mp3_44100_128`;

    const elevenLabsResponse = await fetch(elevenLabsUrl, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg',
      },
      body: JSON.stringify({
        text,
        model_id: modelId,
        voice_settings: {
          stability: sanitizedSettings.stability,
          similarity_boost: sanitizedSettings.similarity_boost,
          style: sanitizedSettings.style,
          use_speaker_boost: sanitizedSettings.use_speaker_boost,
        },
      }),
    });

    // 6. Handle API Errors safely without leaking keys
    if (!elevenLabsResponse.ok) {
      const errorText = await elevenLabsResponse.text().catch(() => '');
      let parsedError: any = null;
      try {
        parsedError = JSON.parse(errorText);
      } catch {
        // fallback
      }

      const status = elevenLabsResponse.status;

      if (status === 401) {
        return NextResponse.json(
          { error: 'Authentication failed. Please verify your ElevenLabs API Key.' },
          { status: 401 }
        );
      }

      if (status === 429) {
        return NextResponse.json(
          { error: 'ElevenLabs rate limit or character quota exceeded. Please try again later.' },
          { status: 429 }
        );
      }

      if (status === 404) {
        return NextResponse.json(
          { error: 'The selected voice ID was not found or is restricted.' },
          { status: 404 }
        );
      }

      const detailMsg =
        parsedError?.detail?.message ||
        parsedError?.message ||
        parsedError?.detail ||
        'Speech generation failed. Please check your prompt and voice settings.';

      return NextResponse.json({ error: detailMsg }, { status });
    }

    // 7. Extract binary audio buffer and return
    const audioBuffer = await elevenLabsResponse.arrayBuffer();

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.byteLength.toString(),
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (error: any) {
    console.error('Text-to-Speech route unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error occurred while processing speech synthesis.' },
      { status: 500 }
    );
  }
}
