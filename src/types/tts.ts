export interface VoiceSettings {
  stability: number;
  similarity_boost: number;
  style: number;
  use_speaker_boost: boolean;
}

export interface ElevenLabsVoice {
  voice_id: string;
  name: string;
  category?: string;
  description?: string;
  labels?: Record<string, string>;
  preview_url?: string;
  high_quality_base_model_ids?: string[];
  settings?: VoiceSettings;
}

export interface TTSModel {
  id: string;
  name: string;
  description: string;
  badge?: string;
}

export interface TTSRequestPayload {
  text: string;
  voiceId: string;
  modelId?: string;
  settings?: VoiceSettings;
}

export interface GeneratedAudioItem {
  id: string;
  text: string;
  voiceId: string;
  voiceName: string;
  modelId: string;
  audioUrl: string;
  duration: number;
  createdAt: string;
  charCount: number;
}

export interface APIStatusResponse {
  hasApiKey: boolean;
  status: 'ready' | 'missing_key' | 'error';
  message?: string;
}
