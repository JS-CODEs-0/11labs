import { VoiceSettings } from '@/types/tts';

export const MAX_TEXT_LENGTH = 5000;
export const MIN_TEXT_LENGTH = 1;

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateTTSText(text: string): ValidationResult {
  if (!text || typeof text !== 'string') {
    return { valid: false, error: 'Text prompt is required.' };
  }

  const trimmed = text.trim();
  if (trimmed.length < MIN_TEXT_LENGTH) {
    return { valid: false, error: 'Please enter text to generate speech.' };
  }

  if (trimmed.length > MAX_TEXT_LENGTH) {
    return {
      valid: false,
      error: `Text exceeds maximum allowed length of ${MAX_TEXT_LENGTH.toLocaleString()} characters.`,
    };
  }

  return { valid: true };
}

export function validateVoiceId(voiceId: string): ValidationResult {
  if (!voiceId || typeof voiceId !== 'string' || voiceId.trim() === '') {
    return { valid: false, error: 'Valid voice selection is required.' };
  }
  return { valid: true };
}

export function validateVoiceSettings(settings?: Partial<VoiceSettings>): VoiceSettings {
  const clamp = (val: number, min: number, max: number, defaultVal: number) => {
    if (typeof val !== 'number' || isNaN(val)) return defaultVal;
    return Math.min(Math.max(val, min), max);
  };

  return {
    stability: clamp(settings?.stability ?? 0.5, 0, 1, 0.5),
    similarity_boost: clamp(settings?.similarity_boost ?? 0.75, 0, 1, 0.75),
    style: clamp(settings?.style ?? 0.0, 0, 1, 0.0),
    use_speaker_boost: Boolean(settings?.use_speaker_boost ?? true),
  };
}
