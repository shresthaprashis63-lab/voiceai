import React from "react";
import { Mic, Volume2, Sparkles, History, HelpCircle } from "lucide-react";

interface HeaderProps {
  historyCount: number;
  onOpenHistory: () => void;
  onOpenTips: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  historyCount,
  onOpenHistory,
  onOpenTips,
}) => {
  return (
    <header className="border-b border-stone-200/80 bg-stone-50/90 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-stone-900 to-stone-700 flex items-center justify-center text-white shadow-sm ring-1 ring-stone-900/10">
            <Volume2 className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold tracking-tight text-stone-900">
                Text to Speech Studio
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-900 border border-amber-200/60">
                <Sparkles className="w-3 h-3 mr-1 text-amber-600" />
                Gemini 3.1 TTS
              </span>
            </div>
            <p className="text-xs text-stone-500 hidden sm:block">
              Neural speech generation with studio WAV offline downloads
            </p>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onOpenTips}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-600 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 hover:text-stone-900 transition-colors shadow-2xs"
            title="How offline audio playback works"
          >
            <HelpCircle className="w-3.5 h-3.5 text-stone-500" />
            <span className="hidden md:inline">Offline Guide</span>
          </button>

          <button
            type="button"
            onClick={onOpenHistory}
            className="relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-800 bg-stone-200/70 hover:bg-stone-200 border border-stone-300/80 rounded-lg transition-colors"
          >
            <History className="w-3.5 h-3.5 text-stone-700" />
            <span>Library</span>
            {historyCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-stone-900 text-white">
                {historyCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
