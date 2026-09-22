import { VoiceOption, StyleOption, PresetSample } from "../types";

export const AVAILABLE_VOICES: VoiceOption[] = [
  {
    id: "Kore",
    name: "Kore",
    gender: "Female",
    description: "Warm, natural, and balanced with clear modern articulation",
    tag: "Balanced & Warm",
    previewPrompt: "Hello there! I am Kore, ready to bring your words to life with clarity and warmth.",
  },
  {
    id: "Puck",
    name: "Puck",
    gender: "Male",
    description: "Playful, spirited, upbeat, and energetic delivery",
    tag: "Lively & Upbeat",
    previewPrompt: "Hey friends! I'm Puck. Let's make this speech upbeat, dynamic, and full of life!",
  },
  {
    id: "Charon",
    name: "Charon",
    gender: "Male",
    description: "Deep, calm, resonant, and authoritative tone",
    tag: "Deep & Resonant",
    previewPrompt: "Greetings. I am Charon. My voice offers a deep, steady cadence for meaningful narration.",
  },
  {
    id: "Fenrir",
    name: "Fenrir",
    gender: "Male",
    description: "Bold, intense, cinematic, and dramatic presence",
    tag: "Cinematic & Bold",
    previewPrompt: "Listen closely. I am Fenrir, built for powerful stories, trailers, and intense moments.",
  },
  {
    id: "Zephyr",
    name: "Zephyr",
    gender: "Female",
    description: "Gentle, soothing, serene, and peaceful cadence",
    tag: "Soothing & Peaceful",
    previewPrompt: "Welcome. I am Zephyr. Take a deep breath and let's explore gentle, tranquil audio.",
  },
];

export const VOICE_STYLES: StyleOption[] = [
  {
    id: "natural",
    name: "Natural",
    directive: "",
    description: "Neutral, everyday conversational reading",
  },
  {
    id: "cheerful",
    name: "Warm & Cheerful",
    directive: "Say cheerfully, warmly, and with a bright welcoming tone: ",
    description: "Friendly, upbeat, and smiling delivery",
  },
  {
    id: "meditative",
    name: "Calm & Meditative",
    directive: "Say slowly, softly, and peacefully like a guided mindfulness meditation coach: ",
    description: "Tranquil, unhurried, and calming",
  },
  {
    id: "storyteller",
    name: "Dramatic Storyteller",
    directive: "Say with theatrical flair, captivating suspense, and dramatic narrative pauses: ",
    description: "Rich narrative atmosphere and emotion",
  },
  {
    id: "broadcast",
    name: "News Anchor",
    directive: "Say in a crisp, authoritative, professional broadcast news reporter tone: ",
    description: "Clear, fast-paced, and journalistic",
  },
  {
    id: "whisper",
    name: "Soft Whisper / ASMR",
    directive: "Say in a very gentle, quiet, intimate whispered voice: ",
    description: "Intimate, relaxed, and breathy",
  },
  {
    id: "enthusiastic",
    name: "High Energy",
    directive: "Say with enthusiastic excitement, vigor, and passionate energy: ",
    description: "Motivational, hyped, and vibrant",
  },
];

export const PRESET_SAMPLES: PresetSample[] = [
  {
    id: "story",
    title: "Cosmic Journey",
    category: "Storytelling",
    recommendedVoice: "Fenrir",
    recommendedStyle: "storyteller",
    text: "Beyond the rings of Saturn, where silence stretches infinitely into the void, a solitary beacon flashed into the dark. It was not a distress call—it was an invitation.",
  },
  {
    id: "meditation",
    title: "Gentle Breath",
    category: "Mindfulness",
    recommendedVoice: "Zephyr",
    recommendedStyle: "meditative",
    text: "Close your eyes, and allow the weight of the day to gently dissolve. With each breath you take, feel stillness flowing from your chest all the way to your fingertips.",
  },
  {
    id: "podcast",
    title: "Tech Innovation",
    category: "Podcast / News",
    recommendedVoice: "Puck",
    recommendedStyle: "enthusiastic",
    text: "Welcome back to the morning breakdown! Today, breakthrough neural speech synthesis is changing how we interact with technology forever. Let's dive right in!",
  },
  {
    id: "audiobook",
    title: "Classic Passage",
    category: "Audiobook",
    recommendedVoice: "Charon",
    recommendedStyle: "natural",
    text: "The harbor was shrouded in dawn mist as the old schooner slipped past the lighthouse. The bell clanged softly across the gray water, marking the turn of the tide.",
  },
  {
    id: "greeting",
    title: "Customer Welcome",
    category: "Business",
    recommendedVoice: "Kore",
    recommendedStyle: "cheerful",
    text: "Hello and thank you for calling Atlas Design! We are delighted to assist you today. Please hold on for just a moment while we connect you to our creative team.",
  },
];
