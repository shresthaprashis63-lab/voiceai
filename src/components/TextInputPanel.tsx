import React from "react";
import {
  FileText,
  Clock,
  Trash2,
  Sparkles,
  Loader2,
  Quote,
} from "lucide-react";
import { PRESET_SAMPLES } from "../data/presets";
import { PresetSample } from "../types";

interface TextInputPanelProps {
  text: string;
  onChangeText: (text: string) => void;
  onSelectPreset: (preset: PresetSample) => void;
  onGenerate: () => void;
  isLoading: boolean;
  selectedVoiceName: string;
}

export const TextInputPanel: React.FC<TextInputPanelProps> = ({
  text,
  onChangeText,
  onSelectPreset,
  onGenerate,
  isLoading,
  selectedVoiceName,
}) => {
  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  // Average speaking pace ~145 words per minute
  const estimatedSeconds = Math.max(1, Math.round((wordCount / 145) * 60));

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      if (!isLoading && text.trim()) {
        onGenerate();
      }
    }
  };

  return (
    <div className="bg-white border border-stone-200 rounded-2xl shadow-xs p-4 sm:p-6 space-y-4">
      {/* Header and Preset Pills */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <label
            htmlFor="tts-text-input"
            className="text-sm font-semibold text-stone-900 flex items-center gap-1.5"
          >
            <FileText className="w-4 h-4 text-stone-700" />
            3. Type or Paste Your Text
          </label>

          {/* Quick preset selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-[11px] text-stone-500 flex items-center gap-1 shrink-0 font-medium">
              <Quote className="w-3 h-3 text-stone-400" />
              Try sample:
            </span>
            {PRESET_SAMPLES.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => onSelectPreset(preset)}
                className="text-[11px] px-2.5 py-1 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 hover:text-stone-900 font-medium transition-colors shrink-0"
              >
                {preset.title}
              </button>
            ))}
          </div>
        </div>

        {/* Text Input Area */}
        <div className="relative rounded-xl border border-stone-300 focus-within:border-stone-900 focus-within:ring-2 focus-within:ring-stone-900/10 transition-all bg-white">
          <textarea
            id="tts-text-input"
            rows={5}
            value={text}
            onChange={(e) => onChangeText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type or paste the sentences you want to convert into speech... (e.g. A podcast intro, documentary narration, audiobook passage, or announcements)"
            className="w-full p-3.5 text-stone-900 text-sm leading-relaxed placeholder:text-stone-400 resize-y min-h-[130px] rounded-xl focus:outline-hidden"
          />

          {/* Bottom Bar inside Textarea container */}
          <div className="flex items-center justify-between px-3.5 py-2 border-t border-stone-100 bg-stone-50/50 rounded-b-xl text-xs text-stone-500">
            <div className="flex items-center gap-3">
              <span>{charCount.toLocaleString()} chars</span>
              <span>•</span>
              <span>{wordCount} words</span>
              {wordCount > 0 && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-stone-600">
                    <Clock className="w-3 h-3 text-stone-400" />
                    ~{estimatedSeconds}s audio
                  </span>
                </>
              )}
            </div>

            {text && (
              <button
                type="button"
                onClick={() => onChangeText("")}
                className="flex items-center gap-1 text-stone-400 hover:text-stone-700 text-xs transition-colors"
                title="Clear text"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* CTA Generate Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
        <div className="text-xs text-stone-500 flex items-center gap-1.5 order-2 sm:order-1">
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono font-medium text-stone-500 bg-stone-100 border border-stone-200 rounded">
            Ctrl
          </kbd>{" "}
          +{" "}
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono font-medium text-stone-500 bg-stone-100 border border-stone-200 rounded">
            Enter
          </kbd>{" "}
          to generate
        </div>

        <button
          type="button"
          disabled={isLoading || !text.trim()}
          onClick={onGenerate}
          className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all order-1 sm:order-2 shadow-xs ${
            isLoading
              ? "bg-stone-300 text-stone-600 cursor-not-allowed"
              : !text.trim()
              ? "bg-stone-100 text-stone-400 cursor-not-allowed"
              : "bg-stone-900 hover:bg-stone-800 text-white cursor-pointer active:scale-[0.98]"
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-stone-600" />
              <span>Synthesizing Voice...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Generate Audio with {selectedVoiceName}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
