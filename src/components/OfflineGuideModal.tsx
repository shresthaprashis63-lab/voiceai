import React from "react";
import { X, HardDrive, Smartphone, Laptop, CheckCircle2, Music, Volume2 } from "lucide-react";

interface OfflineGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OfflineGuideModal: React.FC<OfflineGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-stone-200 z-10 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
              <HardDrive className="w-4 h-4 text-amber-700" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-stone-900">
                Offline Playback Guide
              </h3>
              <p className="text-xs text-stone-500">
                Save and play your audio clips anywhere without internet
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3.5 text-xs sm:text-sm text-stone-600">
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-stone-900">
                Lossless RIFF .WAV Standard
              </p>
              <p className="text-xs text-stone-600 mt-0.5">
                Every exported file is packaged in standard uncompressed PCM WAV format (24,000 Hz sample rate, 16-bit linear audio). It requires no specialized decoders.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="p-3 rounded-xl border border-stone-200 bg-white space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-stone-900 text-xs">
                <Laptop className="w-3.5 h-3.5 text-stone-700" />
                Computers & Laptops
              </div>
              <p className="text-[11px] text-stone-500">
                Plays immediately in VLC, Windows Media Player, QuickTime, Audacity, or Premiere Pro.
              </p>
            </div>

            <div className="p-3 rounded-xl border border-stone-200 bg-white space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-stone-900 text-xs">
                <Smartphone className="w-3.5 h-3.5 text-stone-700" />
                Smartphones & Tablets
              </div>
              <p className="text-[11px] text-stone-500">
                Downloads directly to your "Files" (iOS) or "Downloads" (Android) folder for instant offline listening.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 text-amber-900 text-xs space-y-1">
            <span className="font-semibold flex items-center gap-1">
              <Volume2 className="w-3.5 h-3.5 text-amber-700" />
              Tip for Best Pronunciation:
            </span>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              Use standard punctuation (commas for natural pauses, question marks for upward inflection, and periods for closure). Try the "Voice Delivery Style" buttons to alter mood and pacing!
            </p>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
};
