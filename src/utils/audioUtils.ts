/**
 * Audio helper utilities
 */

export function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const tenths = Math.floor((seconds % 1) * 10);
  if (seconds < 10) {
    return `0:0${secs}.${tenths}`;
  }
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

export function formatFileSize(bytes: number): string {
  if (!bytes || bytes === 0) return "0 KB";
  const kb = bytes / 1024;
  if (kb < 1024) {
    return `${kb.toFixed(1)} KB`;
  }
  const mb = kb / 1024;
  return `${mb.toFixed(2)} MB`;
}

export function triggerDownload(dataUriOrBlobUrl: string, filename: string): void {
  const link = document.createElement("a");
  link.href = dataUriOrBlobUrl;
  link.download = filename.endsWith(".wav") ? filename : `${filename}.wav`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function generateFilename(voice: string, style: string): string {
  const dateStr = new Date().toISOString().slice(0, 10);
  const timeStr = new Date().toTimeString().slice(0, 8).replace(/:/g, "-");
  return `tts-${voice.toLowerCase()}-${style}-${dateStr}_${timeStr}.wav`;
}
