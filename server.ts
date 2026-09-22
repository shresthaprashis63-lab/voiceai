import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Modality } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Helper function to package 24kHz 16-bit mono PCM into standard WAV buffer
function pcmToWavBuffer(pcmBuffer: Buffer, sampleRate = 24000, numChannels = 1, bitsPerSample = 16): Buffer {
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const dataSize = pcmBuffer.length;
  const header = Buffer.alloc(44);

  // RIFF header
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + dataSize, 4);
  header.write("WAVE", 8);

  // "fmt " subchunk
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16); // Subchunk1Size (16 for PCM)
  header.writeUInt16LE(1, 20);  // AudioFormat (1 = Linear PCM)
  header.writeUInt16LE(numChannels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);

  // "data" subchunk
  header.write("data", 36);
  header.writeUInt32LE(dataSize, 40);

  return Buffer.concat([header, pcmBuffer]);
}

// Lazy Gemini client getter
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set in environment.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Supported prebuilt voices for gemini-3.1-flash-tts-preview
const AVAILABLE_VOICES = [
  {
    id: "Kore",
    name: "Kore",
    gender: "Female",
    description: "Warm, natural, and balanced with clear articulation",
    tag: "Balanced & Clear",
  },
  {
    id: "Puck",
    name: "Puck",
    gender: "Male",
    description: "Playful, lively, upbeat, and engaging",
    tag: "Energetic & Playful",
  },
  {
    id: "Charon",
    name: "Charon",
    gender: "Male",
    description: "Deep, calm, resonant, and authoritative",
    tag: "Deep & Resonant",
  },
  {
    id: "Fenrir",
    name: "Fenrir",
    gender: "Male",
    description: "Bold, intense, cinematic, and dramatic",
    tag: "Cinematic & Powerful",
  },
  {
    id: "Zephyr",
    name: "Zephyr",
    gender: "Female",
    description: "Gentle, serene, soothing, and soft-spoken",
    tag: "Soothing & Peaceful",
  },
];

// Delivery style presets with prompt modulation
const VOICE_STYLES = [
  {
    id: "natural",
    name: "Natural",
    directive: "",
    description: "Clean, natural reading with neutral inflections",
  },
  {
    id: "cheerful",
    name: "Warm & Cheerful",
    directive: "Say cheerfully, warmly, and with a bright smile: ",
    description: "Uplifting, sunny, and friendly tone",
  },
  {
    id: "meditative",
    name: "Calm & Meditative",
    directive: "Say slowly, softly, and peacefully like a guided mindfulness coach: ",
    description: "Slow, soothing, and relaxing delivery",
  },
  {
    id: "storyteller",
    name: "Dramatic Storyteller",
    directive: "Say with theatrical flair, captivating suspense, and dramatic narrative pauses: ",
    description: "Expressive, dynamic storytelling tone",
  },
  {
    id: "broadcast",
    name: "News Anchor",
    directive: "Say in a crisp, authoritative, professional broadcast news reporter tone: ",
    description: "Articulate, fast, and journalistic",
  },
  {
    id: "whisper",
    name: "Soft Whisper / ASMR",
    directive: "Say in a very gentle, quiet, intimate whispered voice: ",
    description: "Close-mic, intimate, quiet delivery",
  },
  {
    id: "enthusiastic",
    name: "High Energy",
    directive: "Say with enthusiastic excitement, vigor, and passionate energy: ",
    description: "Hyped, high-intensity presentation",
  },
];

// Health endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

// Voices info endpoint
app.get("/api/voices", (_req, res) => {
  res.json({
    voices: AVAILABLE_VOICES,
    styles: VOICE_STYLES,
  });
});

// TTS Synthesis endpoint
app.post("/api/tts", async (req, res) => {
  try {
    const { text, voice = "Kore", style = "natural", customDirective } = req.body;

    if (!text || typeof text !== "string" || !text.trim()) {
      return res.status(400).json({ error: "Text is required for speech synthesis." });
    }

    if (text.length > 5000) {
      return res.status(400).json({ error: "Text exceeds maximum limit of 5,000 characters." });
    }

    // Validate voice name
    const validVoice = AVAILABLE_VOICES.some((v) => v.id === voice) ? voice : "Kore";

    // Formulate expressive prompt based on style
    let promptText = text.trim();
    if (customDirective && typeof customDirective === "string" && customDirective.trim()) {
      promptText = `${customDirective.trim()} ${promptText}`;
    } else {
      const selectedStyle = VOICE_STYLES.find((s) => s.id === style);
      if (selectedStyle && selectedStyle.directive) {
        promptText = `${selectedStyle.directive}${promptText}`;
      }
    }

    const ai = getGeminiClient();

    // Call gemini-3.1-flash-tts-preview
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-tts-preview",
      contents: [{ parts: [{ text: promptText }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: validVoice,
            },
          },
        },
      },
    });

    const candidate = response.candidates?.[0];
    const audioPart = candidate?.content?.parts?.find((part: any) => part.inlineData?.data);

    if (!audioPart || !audioPart.inlineData?.data) {
      throw new Error("No audio data returned from the Gemini TTS engine.");
    }

    const rawPcmBase64 = audioPart.inlineData.data;
    const rawPcmBuffer = Buffer.from(rawPcmBase64, "base64");

    // Convert raw 24kHz mono PCM to standard WAV container
    const sampleRate = 24000;
    const numChannels = 1;
    const bitsPerSample = 16;
    const wavBuffer = pcmToWavBuffer(rawPcmBuffer, sampleRate, numChannels, bitsPerSample);

    const wavBase64 = wavBuffer.toString("base64");
    const audioDataUri = `data:audio/wav;base64,${wavBase64}`;

    // Calculate duration in seconds
    const totalSamples = rawPcmBuffer.length / (bitsPerSample / 8) / numChannels;
    const durationSeconds = Number((totalSamples / sampleRate).toFixed(2));

    return res.json({
      success: true,
      audioDataUri,
      audioBase64: wavBase64,
      mimeType: "audio/wav",
      format: "wav",
      sampleRate,
      numChannels,
      bitsPerSample,
      durationSeconds,
      fileSizeBytes: wavBuffer.length,
      voice: validVoice,
      style,
      charCount: text.trim().length,
      wordCount: text.trim().split(/\s+/).filter(Boolean).length,
    });
  } catch (error: any) {
    console.error("Error generating speech with Gemini TTS:", error);
    return res.status(500).json({
      error: error?.message || "Failed to generate speech audio.",
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`TTS Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
