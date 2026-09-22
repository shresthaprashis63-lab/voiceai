import React from "react";
import {
  X,
  History,
  Trash2,
  Play,
  Download,
  FileAudio,
  ArrowUpRight,
  Clock,
  HardDrive,
} from "lucide-react";
import { GenerationResult } from "../types";
import { formatTime, formatFileSize, triggerDownload, generateFilename } from "../utils/audioUtils";

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: GenerationResult[];
  onSelectResult: (result: GenerationResult) => void;
  onDeleteResult: (id: string) => void;
  onClearHistory: () => void;
  activeResultId?: string;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectResult,
  onDeleteResult,
  onClearHistory,
  activeResultId,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-stone-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-stone-200 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-stone-900 text-white flex items-center justify-center">
                <History className="w-4 h-4 text-amber-300" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-stone-900">
                  Audio Library
                </h2>
                <p className="text-xs text-stone-500">
                  {history.length} {history.length === 1 ? "voice file" : "voice files"} generated
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {history.length > 0 && (
                <button
                  type="button"
                  onClick={onClearHistory}
                  className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-stone-100 transition-colors text-xs"
                  title="Clear all library items"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {history.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-stone-400">
                <FileAudio className="w-10 h-10 mb-2 stroke-[1.5] text-stone-300" />
                <p className="text-sm font-medium text-stone-700">
                  No generated audio yet
                </p>
                <p className="text-xs text-stone-400 mt-1 max-w-xs">
                  Type any text and click "Generate Audio" to hear it spoken and download offline files.
                </p>
              </div>
            ) : (
              history.map((item) => {
                const isActive = item.id === activeResultId;
                const formattedDate = new Date(item.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      isActive
                        ? "bg-amber-50/60 border-amber-400 ring-1 ring-amber-400/30"
                        : "bg-white border-stone-200 hover:border-stone-300 hover:bg-stone-50/50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-stone-900">
                          {item.voice}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-stone-100 text-stone-600 font-medium">
                          {item.style}
                        </span>
                      </div>
                      <span className="text-[11px] text-stone-400 font-mono">
                        {formattedDate}
                      </span>
                    </div>

                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed mb-3">
                      "{item.text}"
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                      <span className="text-stone-400 text-[11px]">
                        {formatTime(item.durationSeconds)} • {formatFileSize(item.fileSizeBytes)}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            onSelectResult(item);
                            onClose();
                          }}
                          className="px-2.5 py-1 rounded-md bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs flex items-center gap-1 transition-colors"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>Play</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            const fname = generateFilename(item.voice, item.style);
                            triggerDownload(item.audioDataUri, fname);
                          }}
                          className="p-1 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-md transition-colors"
                          title="Download audio file"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => onDeleteResult(item.id)}
                          className="p-1 text-stone-400 hover:text-rose-600 hover:bg-stone-100 rounded-md transition-colors"
                          title="Delete from library"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Offline Notice */}
          <div className="p-3.5 border-t border-stone-200 bg-stone-50 text-[11px] text-stone-500 flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-stone-400 shrink-0" />
            <span>
              All downloaded files are standalone standard WAV audio files playable offline on any media player.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
