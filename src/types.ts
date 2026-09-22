export interface VoiceOption {
  id: string;
  name: string;
  gender: string;
  description: string;
  tag: string;
  previewPrompt?: string;
}

export interface StyleOption {
  id: string;
  name: string;
  directive: string;
  description: string;
  iconName?: string;
}

export interface PresetSample {
  id: string;
  title: string;
  category: string;
  text: string;
  recommendedVoice: string;
  recommendedStyle: string;
}

export interface GenerationResult {
  id: string;
  text: string;
  voice: string;
  style: string;
  audioDataUri: string;
  durationSeconds: number;
  fileSizeBytes: number;
  wordCount: number;
  charCount: number;
  createdAt: number;
}
