import { ElevenLabsVoice, TTSModel } from '@/types/tts';

export const ELEVENLABS_MODELS: TTSModel[] = [
  {
    id: 'eleven_multilingual_v2',
    name: 'Eleven Multilingual v2',
    description: 'Most lifelike and emotionally rich. Supports 29 languages.',
    badge: 'Recommended',
  },
  {
    id: 'eleven_flash_v2_5',
    name: 'Eleven Flash v2.5',
    description: 'Ultra-fast low-latency (~75ms). Great for interactive applications.',
    badge: 'Fastest',
  },
  {
    id: 'eleven_turbo_v2_5',
    name: 'Eleven Turbo v2.5',
    description: 'High speed generation optimized for quality and throughput.',
    badge: 'Balanced',
  },
  {
    id: 'eleven_monolingual_v1',
    name: 'Eleven Monolingual v1',
    description: 'Classic high-fidelity English voice synthesis model.',
  },
];

// Verified premade voice candidates available across API tiers
const PREMADE_CANDIDATE_VOICES: ElevenLabsVoice[] = [
  {
    voice_id: 'pNInz6obpgDQGcFmaJgB',
    name: 'Adam',
    category: 'Narration',
    description: 'Deep, authoritative American male voice for documentaries and narration.',
    labels: { gender: 'Male', accent: 'American', use_case: 'Narration' },
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/previews/pNInz6obpgDQGcFmaJgB.mp3',
  },
  {
    voice_id: 'EXAVITQu4vr4xnSDxMaL',
    name: 'Bella',
    category: 'Storytelling',
    description: 'Soft, warm, engaging American female voice ideal for audiobooks and stories.',
    labels: { gender: 'Female', accent: 'American', use_case: 'Storytelling' },
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/previews/EXAVITQu4vr4xnSDxMaL.mp3',
  },
  {
    voice_id: 'ErXwobaYiN019PkySvjV',
    name: 'Antoni',
    category: 'Informative',
    description: 'Smooth, articulate male voice great for podcasts and tutorials.',
    labels: { gender: 'Male', accent: 'American', use_case: 'Informative' },
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/previews/ErXwobaYiN019PkySvjV.mp3',
  },
  {
    voice_id: 'JBFqnCBsd6RMkjVDRZzb',
    name: 'George',
    category: 'Narrative',
    description: 'Warm, sophisticated British male voice with rich tone.',
    labels: { gender: 'Male', accent: 'British', use_case: 'Narrative' },
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/previews/JBFqnCBsd6RMkjVDRZzb.mp3',
  },
  {
    voice_id: 'N2lVS1w4EtoT3dr4eOWO',
    name: 'Callum',
    category: 'Conversational',
    description: 'Intense, energetic male voice.',
    labels: { gender: 'Male', accent: 'American', use_case: 'Conversational' },
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/previews/N2lVS1w4EtoT3dr4eOWO.mp3',
  },
  {
    voice_id: 'IKne3meq5aSn9XLyUdCD',
    name: 'Charlie',
    category: 'Conversational',
    description: 'Casual, friendly Australian male voice.',
    labels: { gender: 'Male', accent: 'Australian', use_case: 'Conversational' },
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/previews/IKne3meq5aSn9XLyUdCD.mp3',
  },
  {
    voice_id: 'onwK4e9ZLuTAKqWW03F9',
    name: 'Daniel',
    category: 'News',
    description: 'Authoritative British news anchor voice.',
    labels: { gender: 'Male', accent: 'British', use_case: 'News' },
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/previews/onwK4e9ZLuTAKqWW03F9.mp3',
  },
  {
    voice_id: 'TX3LPaxmHKxFdv7VOQHJ',
    name: 'Liam',
    category: 'Conversational',
    description: 'Young American male voice with clear tone.',
    labels: { gender: 'Male', accent: 'American', use_case: 'Conversational' },
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/previews/TX3LPaxmHKxFdv7VOQHJ.mp3',
  },
  {
    voice_id: 'XrExE9yKIg1WjnnlVkGX',
    name: 'Matilda',
    category: 'Narration',
    description: 'Warm, expressive female voice.',
    labels: { gender: 'Female', accent: 'American', use_case: 'Narration' },
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/previews/XrExE9yKIg1WjnnlVkGX.mp3',
  },
];

export async function fetchServerElevenLabsVoices(apiKey?: string): Promise<{
  voices: ElevenLabsVoice[];
  hasApiKey: boolean;
  source: string;
}> {
  const key = apiKey || process.env.ELEVENLABS_API_KEY?.trim();
  if (!key) {
    return { voices: [], hasApiKey: false, source: 'none' };
  }

  // 1. Try querying /v2/voices from ElevenLabs API
  try {
    const resV2 = await fetch('https://api.elevenlabs.io/v2/voices', {
      method: 'GET',
      headers: {
        'xi-api-key': key,
        'Accept': 'application/json',
      },
      cache: 'no-store',
    });

    if (resV2.ok) {
      const data = await resV2.json();
      if (Array.isArray(data.voices) && data.voices.length > 0) {
        const mappedVoices: ElevenLabsVoice[] = data.voices.map((v: any) => ({
          voice_id: v.voice_id,
          name: v.name,
          category: v.category || 'Premade',
          description: v.description || v.labels?.use_case || 'ElevenLabs Neural Voice',
          labels: v.labels || {},
          preview_url: v.preview_url,
        }));
        return { voices: mappedVoices, hasApiKey: true, source: 'v2/voices' };
      }
    }
  } catch (err) {
    console.warn('GET /v2/voices fetch notice:', err);
  }

  // 2. Try querying /v1/voices from ElevenLabs API
  try {
    const resV1 = await fetch('https://api.elevenlabs.io/v1/voices', {
      method: 'GET',
      headers: {
        'xi-api-key': key,
        'Accept': 'application/json',
      },
      cache: 'no-store',
    });

    if (resV1.ok) {
      const data = await resV1.json();
      if (Array.isArray(data.voices) && data.voices.length > 0) {
        const mappedVoices: ElevenLabsVoice[] = data.voices.map((v: any) => ({
          voice_id: v.voice_id,
          name: v.name,
          category: v.category || 'Premade',
          description: v.description || v.labels?.use_case || 'ElevenLabs Neural Voice',
          labels: v.labels || {},
          preview_url: v.preview_url,
        }));
        return { voices: mappedVoices, hasApiKey: true, source: 'v1/voices' };
      }
    }
  } catch (err) {
    console.warn('GET /v1/voices fetch notice:', err);
  }

  // 3. If GET /v2/voices and /v1/voices return 401 missing permissions (e.g. key scoped for TTS only),
  // dynamically test candidate premade voices against the API key to return ONLY working, accessible voices!
  const verifiedVoices: ElevenLabsVoice[] = [];

  for (const voice of PREMADE_CANDIDATE_VOICES) {
    try {
      const testRes = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(
          voice.voice_id
        )}?output_format=mp3_44100_128`,
        {
          method: 'POST',
          headers: {
            'xi-api-key': key,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: 'Test',
            model_id: 'eleven_multilingual_v2',
          }),
        }
      );

      if (testRes.ok) {
        verifiedVoices.push(voice);
      }
    } catch {
      // Ignore network failures for single voice test
    }
  }

  return { voices: verifiedVoices, hasApiKey: true, source: 'verified-account-voices' };
}
