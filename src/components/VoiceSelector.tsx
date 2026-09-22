import React, { useState } from "react";
import {
  Sparkles,
  Volume2,
  Sliders,
  User,
  Music,
  Check,
  ChevronDown,
  ChevronUp,
  Radio,
} from "lucide-react";
import { AVAILABLE_VOICES, VOICE_STYLES } from "../data/presets";
import { VoiceOption, StyleOption } from "../types";

interface VoiceSelectorProps {
  selectedVoice: string;
  onSelectVoice: (voiceId: string) => void;
  selectedStyle: string;
  onSelectStyle: (styleId: string) => void;
  customDirective: string;
  onChangeCustomDirective: (directive: string) => void;
  onAuditionVoice?: (voice: VoiceOption) => void;
  isAuditioning?: boolean;
}

export const VoiceSelector: React.FC<VoiceSelectorProps> = ({
  selectedVoice,
  onSelectVoice,
  selectedStyle,
  onSelectStyle,
  customDirective,
  onChangeCustomDirective,
  onAuditionVoice,
  isAuditioning,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="space-y-6">
      {/* 1. Voice Persona Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-stone-900 flex items-center gap-1.5">
            <User className="w-4 h-4 text-stone-700" />
            1. Select Voice Persona
          </label>
          <span className="text-xs text-stone-500">
            5 neural studio voices
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {AVAILABLE_VOICES.map((voice) => {
            const isSelected = selectedVoice === voice.id;
            return (
              <button
                key={voice.id}
                type="button"
                onClick={() => onSelectVoice(voice.id)}
                className={`text-left p-3.5 rounded-xl border transition-all relative flex flex-col justify-between ${
                  isSelected
                    ? "bg-amber-50/70 border-amber-500 ring-2 ring-amber-500/20 shadow-xs"
                    : "bg-white border-stone-200 hover:border-stone-300 hover:bg-stone-50/50"
                }`}
              >
                {isSelected && (
                  <span className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-amber-600 text-white flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                )}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-stone-900 text-sm">
                      {voice.name}
                    </span>
                    <span className="text-[11px] px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 font-medium">
                      {voice.gender}
                    </span>
                  </div>
                  <span className="inline-block text-[11px] font-medium text-amber-800 bg-amber-100/60 px-1.5 py-0.5 rounded mb-2">
                    {voice.tag}
                  </span>
                  <p className="text-xs text-stone-500 leading-snug line-clamp-2">
                    {voice.description}
                  </p>
                </div>

                {onAuditionVoice && (
                  <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between">
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        onAuditionVoice(voice);
                      }}
                      className="text-[11px] text-stone-600 hover:text-stone-900 flex items-center gap-1 font-medium hover:underline cursor-pointer"
                    >
                      <Volume2 className="w-3 h-3 text-stone-400" />
                      Quick sample
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Voice Delivery Style */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-stone-900 flex items-center gap-1.5">
            <Radio className="w-4 h-4 text-stone-700" />
            2. Choose Voice Style & Tone
          </label>
          <span className="text-xs text-stone-500">
            Expressive delivery nuance
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {VOICE_STYLES.map((style) => {
            const isSelected = selectedStyle === style.id && !customDirective;
            return (
              <button
                key={style.id}
                type="button"
                onClick={() => {
                  onSelectStyle(style.id);
                  if (customDirective) {
                    onChangeCustomDirective("");
                  }
                }}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? "bg-stone-900 text-white border-stone-900 shadow-xs"
                    : "bg-white border-stone-200 text-stone-800 hover:bg-stone-50 hover:border-stone-300"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold">
                    {style.name}
                  </span>
                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-amber-300 stroke-[3]" />
                  )}
                </div>
                <p
                  className={`text-[11px] leading-tight line-clamp-2 ${
                    isSelected ? "text-stone-300" : "text-stone-500"
                  }`}
                >
                  {style.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Advanced Director Mode (Custom tone instruction) */}
      <div className="border border-stone-200 rounded-xl bg-stone-50/50 p-3 sm:p-4">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full flex items-center justify-between text-xs font-medium text-stone-700 hover:text-stone-900"
        >
          <span className="flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-stone-500" />
            <span>Custom Director Tone Prompt (Optional)</span>
            {customDirective && (
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-200 text-amber-900 font-semibold">
                Active
              </span>
            )}
          </span>
          {showAdvanced ? (
            <ChevronUp className="w-4 h-4 text-stone-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-stone-500" />
          )}
        </button>

        {showAdvanced && (
          <div className="mt-3 pt-3 border-t border-stone-200/80 space-y-2">
            <p className="text-xs text-stone-600">
              Provide custom directing cues to Gemini TTS to tailor emotion, cadence, or pauses.
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={customDirective}
                onChange={(e) => onChangeCustomDirective(e.target.value)}
                placeholder="e.g. Say in a mysterious, noir detective tone with slow pauses: "
                className="flex-1 px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 text-stone-900"
              />
              {customDirective && (
                <button
                  type="button"
                  onClick={() => onChangeCustomDirective("")}
                  className="px-2.5 py-1.5 text-xs text-stone-600 bg-stone-200 hover:bg-stone-300 rounded-lg font-medium"
                >
                  Reset
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="text-[10px] text-stone-500 self-center">Try:</span>
              {[
                "Say with gentle wonder and curiosity: ",
                "Say solemnly like a documentary narrator: ",
                "Say with playful sarcasm and humor: ",
              ].map((sample) => (
                <button
                  key={sample}
                  type="button"
                  onClick={() => onChangeCustomDirective(sample)}
                  className="text-[10px] px-2 py-0.5 bg-white border border-stone-200 hover:border-stone-300 rounded-md text-stone-600 hover:text-stone-900"
                >
                  {sample.slice(0, 32)}...
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
