/**
 * Audio playback utility for Japanese character pronunciation
 * Uses Web Speech API for text-to-speech
 */

// Check if speech synthesis is available
export function isSpeechSynthesisAvailable(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

// Get available Japanese voices
export function getJapaneseVoices(): SpeechSynthesisVoice[] {
  if (!isSpeechSynthesisAvailable()) {
    return [];
  }

  const voices = window.speechSynthesis.getVoices();
  return voices.filter(voice => voice.lang.startsWith('ja'));
}

// Play Japanese character pronunciation
export function playCharacterAudio(
  character: string,
  options: {
    rate?: number;      // Speed (0.1 to 10, default 1)
    pitch?: number;     // Pitch (0 to 2, default 1)
    volume?: number;    // Volume (0 to 1, default 1)
    voiceIndex?: number; // Specific voice index to use
  } = {}
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!isSpeechSynthesisAvailable()) {
      reject(new Error('Speech synthesis not available'));
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(character);

    // Set language to Japanese
    utterance.lang = 'ja-JP';

    // Apply options
    utterance.rate = options.rate ?? 0.8; // Slightly slower for learning
    utterance.pitch = options.pitch ?? 1;
    utterance.volume = options.volume ?? 1;

    // Try to use a Japanese voice
    const japaneseVoices = getJapaneseVoices();
    if (japaneseVoices.length > 0) {
      const voiceIndex = options.voiceIndex ?? 0;
      utterance.voice = japaneseVoices[Math.min(voiceIndex, japaneseVoices.length - 1)];
    }

    // Event handlers
    utterance.onend = () => resolve();
    utterance.onerror = (event) => reject(event);

    // Speak
    window.speechSynthesis.speak(utterance);
  });
}

// Play sequence of characters (for 3-char tests)
export async function playCharacterSequence(
  characters: string,
  options: {
    rate?: number;
    pitch?: number;
    volume?: number;
    voiceIndex?: number;
    delayBetween?: number; // Delay in ms between characters
  } = {}
): Promise<void> {
  const chars = characters.split('');
  const delay = options.delayBetween ?? 300; // 300ms delay between characters

  for (let i = 0; i < chars.length; i++) {
    await playCharacterAudio(chars[i], options);

    // Add delay between characters (except after last one)
    if (i < chars.length - 1) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// Stop any ongoing speech
export function stopAudio(): void {
  if (isSpeechSynthesisAvailable()) {
    window.speechSynthesis.cancel();
  }
}

// Initialize voices (some browsers need this)
export function initializeVoices(): Promise<void> {
  return new Promise((resolve) => {
    if (!isSpeechSynthesisAvailable()) {
      resolve();
      return;
    }

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      resolve();
      return;
    }

    // Some browsers load voices asynchronously
    window.speechSynthesis.onvoiceschanged = () => {
      resolve();
    };

    // Fallback timeout
    setTimeout(() => resolve(), 1000);
  });
}
