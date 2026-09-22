import React, { useRef, useState, useEffect } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Download,
  Volume2,
  VolumeX,
  Repeat,
  Share2,
  Check,
  Music2,
  HardDriveDownload,
  FileAudio,
  SlidersHorizontal,
  Info,
} from "lucide-react";
import { GenerationResult } from "../types";
import { formatTime, formatFileSize, triggerDownload, generateFilename } from "../utils/audioUtils";

interface AudioPlayerCardProps {
  result: GenerationResult;
  autoPlay?: boolean;
}

export const AudioPlayerCard: React.FC<AudioPlayerCardProps> = ({
  result,
  autoPlay = true,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(result.durationSeconds || 0);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [volume, setVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isLooping, setIsLooping] = useState<boolean>(false);
  const [copiedText, setCopiedText] = useState<boolean>(false);
  const [customFilename, setCustomFilename] = useState<string>("");
  const [showFilenameInput, setShowFilenameInput] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  // Default suggested filename
  const defaultFilename = generateFilename(result.voice, result.style);

  // Auto-play when new result comes in
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      setDuration(result.durationSeconds || 0);
      if (autoPlay) {
        audioRef.current.play().catch((err) => {
          // Browser may restrict autoplay without user interaction
          console.warn("Autoplay blocked or interrupted:", err);
          setIsPlaying(false);
        });
      }
    }
  }, [result.id, autoPlay, result.durationSeconds]);

  // Sync playback rate and volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
      audioRef.current.volume = isMuted ? 0 : volume;
      audioRef.current.loop = isLooping;
    }
  }, [playbackRate, volume, isMuted, isLooping]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(console.error);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      if (audioRef.current.duration && !isNaN(audioRef.current.duration)) {
        setDuration(audioRef.current.duration);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current && audioRef.current.duration) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetTime = Number(e.target.value);
    setCurrentTime(targetTime);
    if (audioRef.current) {
      audioRef.current.currentTime = targetTime;
    }
  };

  const handleReplay = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(console.error);
      setIsPlaying(true);
    }
  };

  const handleDownload = () => {
    const nameToUse = customFilename.trim() ? customFilename.trim() : defaultFilename;
    triggerDownload(result.audioDataUri, nameToUse);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(result.text).then(() => {
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    });
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="bg-stone-900 text-stone-100 rounded-2xl p-5 sm:p-6 shadow-md border border-stone-800">
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={result.audioDataUri}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      />

      {/* Top Details & Badges */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-stone-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-stone-800 flex items-center justify-center text-amber-400">
            <FileAudio className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white text-sm">
                Voice: {result.voice}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-stone-800 text-stone-300 font-medium border border-stone-700">
                Style: {result.style}
              </span>
            </div>
            <p className="text-xs text-stone-400">
              RIFF WAV (24,000 Hz, 16-bit Mono) • {formatFileSize(result.fileSizeBytes)}
            </p>
          </div>
        </div>

        {/* Quick Action Badges */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyText}
            className="flex items-center gap-1 px-2.5 py-1 text-xs text-stone-400 hover:text-white bg-stone-800 hover:bg-stone-700 rounded-lg transition-colors"
            title="Copy synthesized text"
          >
            {copiedText ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Copy Text</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Spoken Text Preview Quote */}
      <div className="my-4 p-3 bg-stone-950/60 rounded-xl border border-stone-800/80 text-stone-300 text-xs sm:text-sm italic leading-relaxed line-clamp-3">
        "{result.text}"
      </div>

      {/* Animated Soundwave Equalizer (Simulated visualizer) */}
      <div className="flex items-center justify-center gap-1.5 h-12 my-2 px-2 bg-stone-950/40 rounded-xl border border-stone-800/40">
        {[20, 45, 75, 30, 90, 60, 40, 85, 95, 55, 35, 70, 80, 50, 65, 90, 40, 75, 30, 85, 60, 45, 25].map((height, i) => {
          const activeHeight = isPlaying
            ? Math.max(15, (height * (0.4 + (Math.sin((currentTime * 8) + i * 0.5) + 1) * 0.3)))
            : 15;
          return (
            <div
              key={i}
              className={`w-1 rounded-full transition-all duration-100 ${
                isPlaying ? "bg-amber-400" : "bg-stone-700"
              }`}
              style={{ height: `${activeHeight}%` }}
            />
          );
        })}
      </div>

      {/* Scrubber / Timeline Bar */}
      <div className="space-y-1.5 pt-2">
        <div className="relative flex items-center">
          <input
            type="range"
            min={0}
            max={duration || 1}
            step={0.05}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-amber-400 focus:outline-hidden"
          />
        </div>
        <div className="flex items-center justify-between text-xs text-stone-400 font-mono">
          <span>{formatTime(currentTime)}</span>
          <span className="text-[11px] text-stone-500">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* Main Playback Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mt-3 pt-3 border-t border-stone-800">
        <div className="flex items-center gap-3">
          {/* Play / Pause button */}
          <button
            type="button"
            onClick={togglePlay}
            className="w-12 h-12 rounded-full bg-amber-400 hover:bg-amber-300 text-stone-950 flex items-center justify-center font-bold transition-transform active:scale-95 shadow-md cursor-pointer"
            title={isPlaying ? "Pause (Space)" : "Play (Space)"}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </button>

          {/* Replay button */}
          <button
            type="button"
            onClick={handleReplay}
            className="p-2 text-stone-400 hover:text-white bg-stone-800 hover:bg-stone-700 rounded-lg transition-colors"
            title="Replay from beginning"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Loop toggle */}
          <button
            type="button"
            onClick={() => setIsLooping(!isLooping)}
            className={`p-2 rounded-lg transition-colors ${
              isLooping
                ? "bg-amber-400/20 text-amber-300 ring-1 ring-amber-400/40"
                : "text-stone-400 hover:text-white bg-stone-800 hover:bg-stone-700"
            }`}
            title={isLooping ? "Looping enabled" : "Enable loop"}
          >
            <Repeat className="w-4 h-4" />
          </button>

          {/* Speed selector */}
          <div className="flex items-center bg-stone-800 rounded-lg p-0.5 border border-stone-700">
            {[0.75, 1, 1.25, 1.5].map((speed) => (
              <button
                key={speed}
                type="button"
                onClick={() => setPlaybackRate(speed)}
                className={`px-2 py-1 text-[11px] font-medium rounded-md transition-colors ${
                  playbackRate === speed
                    ? "bg-stone-700 text-white font-semibold"
                    : "text-stone-400 hover:text-stone-200"
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>

        {/* Volume & Mute */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            className="text-stone-400 hover:text-white transition-colors"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4 text-rose-400" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(Number(e.target.value));
              if (isMuted) setIsMuted(false);
            }}
            className="w-16 h-1 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-stone-300"
            title={`Volume: ${Math.round((isMuted ? 0 : volume) * 100)}%`}
          />
        </div>
      </div>

      {/* DOWNLOAD SECTION (Highlight requirement: download audio file to local device for offline playbacks) */}
      <div className="mt-5 pt-4 border-t border-stone-800 bg-stone-950/40 -mx-5 -mb-5 sm:-mx-6 sm:-mb-6 p-5 sm:p-6 rounded-b-2xl">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white flex items-center gap-1.5">
                <HardDriveDownload className="w-4 h-4 text-amber-400" />
                Offline Audio Export
              </span>
              <span className="text-[11px] px-2 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/80 font-medium">
                Standard WAV
              </span>
            </div>
            <p className="text-xs text-stone-400 mt-0.5">
              Saved directly to your local computer or phone. Plays anywhere offline without internet.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowFilenameInput(!showFilenameInput)}
              className="px-2.5 py-2 text-xs text-stone-400 hover:text-stone-200 bg-stone-800 hover:bg-stone-700 rounded-xl transition-colors border border-stone-700"
              title="Rename file before downloading"
            >
              Rename
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95 cursor-pointer ${
                downloadSuccess
                  ? "bg-emerald-500 text-stone-950"
                  : "bg-amber-400 hover:bg-amber-300 text-stone-950"
              }`}
            >
              {downloadSuccess ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Saved to Device!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download .WAV ({formatFileSize(result.fileSizeBytes)})</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Optional Custom Filename Input */}
        {showFilenameInput && (
          <div className="mt-3 pt-3 border-t border-stone-800 flex items-center gap-2">
            <input
              type="text"
              value={customFilename}
              onChange={(e) => setCustomFilename(e.target.value)}
              placeholder={defaultFilename}
              className="flex-1 px-3 py-1.5 text-xs bg-stone-900 border border-stone-700 rounded-lg text-stone-200 placeholder:text-stone-500 focus:outline-hidden focus:border-amber-400"
            />
            <button
              type="button"
              onClick={handleDownload}
              className="px-3 py-1.5 text-xs bg-amber-400 text-stone-950 font-semibold rounded-lg hover:bg-amber-300"
            >
              Save as
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
