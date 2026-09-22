/**
 * Text-to-Speech Studio
 * Powered by Gemini 3.1 Flash TTS
 */

import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { VoiceSelector } from "./components/VoiceSelector";
import { TextInputPanel } from "./components/TextInputPanel";
import { AudioPlayerCard } from "./components/AudioPlayerCard";
import { HistoryDrawer } from "./components/HistoryDrawer";
import { OfflineGuideModal } from "./components/OfflineGuideModal";
import { GenerationResult, PresetSample, VoiceOption } from "./types";
import { AVAILABLE_VOICES, PRESET_SAMPLES } from "./data/presets";
import { AlertCircle, Sparkles, CheckCircle2, Volume2, Info } from "lucide-react";

const STORAGE_KEY = "tts_studio_history_v1";

export default function App() {
  const [text, setText] = useState<string>(PRESET_SAMPLES[0].text);
  const [selectedVoice, setSelectedVoice] = useState<string>("Kore");
  const [selectedStyle, setSelectedStyle] = useState<string>("natural");
  const [customDirective, setCustomDirective] = useState<string>("");

  const [currentResult, setCurrentResult] = useState<GenerationResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [history, setHistory] = useState<GenerationResult[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [auditioningVoiceId, setAuditioningVoiceId] = useState<string | null>(null);

  // Load saved audio history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setHistory(parsed);
          // Set latest generation as current result if available
          setCurrentResult(parsed[0]);
        }
      }
    } catch (e) {
      console.warn("Failed to load history from localStorage:", e);
    }
  }, []);

  // Save history updates
  const saveHistory = (items: GenerationResult[]) => {
    setHistory(items);
    try {
      // Keep up to 20 recent generations in storage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, 20)));
    } catch (e) {
      console.warn("Failed to save history to localStorage:", e);
    }
  };

  const handleSelectPreset = (preset: PresetSample) => {
    setText(preset.text);
    if (preset.recommendedVoice) {
      setSelectedVoice(preset.recommendedVoice);
    }
    if (preset.recommendedStyle) {
      setSelectedStyle(preset.recommendedStyle);
    }
    setCustomDirective("");
    setErrorMessage(null);
  };

  // Generate speech via server endpoint
  const handleGenerate = async (customText?: string, voiceOverride?: string) => {
    const textToSynthesize = (customText || text).trim();
    if (!textToSynthesize) return;

    setIsLoading(true);
    setErrorMessage(null);

    const voiceToUse = voiceOverride || selectedVoice;

    try {
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: textToSynthesize,
          voice: voiceToUse,
          style: selectedStyle,
          customDirective: customDirective.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to generate speech audio.");
      }

      const newResult: GenerationResult = {
        id: `tts-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        text: textToSynthesize,
        voice: data.voice,
        style: data.style,
        audioDataUri: data.audioDataUri,
        durationSeconds: data.durationSeconds,
        fileSizeBytes: data.fileSizeBytes,
        wordCount: data.wordCount,
        charCount: data.charCount,
        createdAt: Date.now(),
      };

      setCurrentResult(newResult);
      const updatedHistory = [newResult, ...history.filter((h) => h.id !== newResult.id)];
      saveHistory(updatedHistory);
    } catch (err: any) {
      console.error("Speech synthesis error:", err);
      setErrorMessage(
        err?.message || "An unexpected error occurred while communicating with the speech engine."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Audition voice persona with preview sample
  const handleAuditionVoice = async (voice: VoiceOption) => {
    if (auditioningVoiceId) return;
    setAuditioningVoiceId(voice.id);
    const auditionText = voice.previewPrompt || `Hello! I am ${voice.name}, ready to speak for you.`;
    setSelectedVoice(voice.id);

    try {
      await handleGenerate(auditionText, voice.id);
    } finally {
      setAuditioningVoiceId(null);
    }
  };

  const handleDeleteHistoryItem = (id: string) => {
    const filtered = history.filter((item) => item.id !== id);
    saveHistory(filtered);
    if (currentResult?.id === id) {
      setCurrentResult(filtered[0] || null);
    }
  };

  const handleClearHistory = () => {
    saveHistory([]);
    setCurrentResult(null);
  };

  const activeVoiceObj = AVAILABLE_VOICES.find((v) => v.id === selectedVoice) || AVAILABLE_VOICES[0];

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 flex flex-col font-sans selection:bg-amber-200">
      {/* Header bar */}
      <Header
        historyCount={history.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenTips={() => setIsGuideOpen(true)}
      />

      {/* Main Studio Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Studio Sub-Header Info Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900">
              Voice Synthesizer Studio
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
              Enter any text, choose your vocal personality and emotional delivery, then download the lossless WAV audio file for offline listening.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-stone-200/80 text-stone-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Active Voice: <strong className="text-stone-900">{activeVoiceObj.name}</strong>
            </span>
          </div>
        </div>

        {/* Error message alert */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1 text-xs sm:text-sm space-y-1">
              <p className="font-semibold text-rose-900">Generation Failed</p>
              <p>{errorMessage}</p>
            </div>
          </div>
        )}

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Input text & Voice configuration (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1 & 2: Voice Persona & Delivery Style */}
            <div className="bg-white border border-stone-200 rounded-2xl shadow-xs p-4 sm:p-6">
              <VoiceSelector
                selectedVoice={selectedVoice}
                onSelectVoice={setSelectedVoice}
                selectedStyle={selectedStyle}
                onSelectStyle={setSelectedStyle}
                customDirective={customDirective}
                onChangeCustomDirective={setCustomDirective}
                onAuditionVoice={handleAuditionVoice}
                isAuditioning={auditioningVoiceId !== null}
              />
            </div>

            {/* Step 3: Text Input Panel & Preset Samples */}
            <TextInputPanel
              text={text}
              onChangeText={setText}
              onSelectPreset={handleSelectPreset}
              onGenerate={() => handleGenerate()}
              isLoading={isLoading}
              selectedVoiceName={activeVoiceObj.name}
            />
          </div>

          {/* Right Column: Audio Playback & Offline Download (5 cols) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-20">
            {currentResult ? (
              <div>
                <div className="flex items-center justify-between mb-2 px-1">
                  <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                    Current Output & Offline Download
                  </h3>
                  <span className="text-[11px] text-stone-500 font-mono">
                    Ready to export
                  </span>
                </div>
                <AudioPlayerCard result={currentResult} />
              </div>
            ) : (
              /* Empty state / placeholder prompt */
              <div className="bg-white border border-dashed border-stone-300 rounded-2xl p-8 sm:p-10 text-center flex flex-col items-center justify-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-xs">
                  <Volume2 className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="text-sm font-semibold text-stone-900">
                  Audio Player Ready
                </h3>
                <p className="text-xs text-stone-500 max-w-xs leading-relaxed">
                  Type your text on the left, pick a voice style, and click <strong>Generate Audio</strong>. Your spoken audio and instant offline WAV download will appear right here.
                </p>
                <button
                  type="button"
                  onClick={() => handleGenerate()}
                  disabled={isLoading}
                  className="mt-2 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium rounded-xl transition-colors shadow-2xs cursor-pointer"
                >
                  Generate First Sample
                </button>
              </div>
            )}

            {/* Offline Playback Explainer Card */}
            <div className="p-4 bg-stone-50 border border-stone-200/80 rounded-2xl text-xs text-stone-600 space-y-2">
              <div className="flex items-center gap-1.5 font-semibold text-stone-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Offline Playbacks Guaranteed
              </div>
              <p className="leading-relaxed text-[11px] text-stone-600">
                Files downloaded from this studio are formatted as universal <strong>24,000 Hz 16-bit PCM RIFF WAV</strong> files. You can copy them to your USB drives, phones, media players, or edit them in any digital audio workstation completely offline.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectResult={(res) => setCurrentResult(res)}
        onDeleteResult={handleDeleteHistoryItem}
        onClearHistory={handleClearHistory}
        activeResultId={currentResult?.id}
      />

      {/* Offline Guide Modal */}
      <OfflineGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </div>
  );
}
