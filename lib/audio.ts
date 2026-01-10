import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';

/**
 * Speak Japanese text using device Text-to-Speech
 */
export async function speakJapanese(text: string, language: 'ja-JP' = 'ja-JP'): Promise<void> {
  try {
    // Stop any ongoing speech
    await Speech.stop();

    // Speak with Japanese voice
    await Speech.speak(text, {
      language,
      pitch: 1.0,
      rate: 0.85, // Slightly slower for learning
    });
  } catch (error) {
    console.error('Failed to speak:', error);
  }
}

/**
 * Play success sound effect using haptic feedback
 */
export async function playSuccessSound(hapticsEnabled: boolean = true): Promise<void> {
  if (hapticsEnabled) {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Failed to play success haptic:', error);
    }
  }
}

/**
 * Play error sound effect using haptic feedback
 */
export async function playErrorSound(hapticsEnabled: boolean = true): Promise<void> {
  if (hapticsEnabled) {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } catch (error) {
      console.error('Failed to play error haptic:', error);
    }
  }
}

/**
 * Play button press haptic
 */
export async function playButtonPress(hapticsEnabled: boolean = true): Promise<void> {
  if (hapticsEnabled) {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      console.error('Failed to play button haptic:', error);
    }
  }
}

/**
 * Stop any ongoing speech
 */
export async function stopSpeech(): Promise<void> {
  try {
    await Speech.stop();
  } catch (error) {
    console.error('Failed to stop speech:', error);
  }
}

/**
 * Check if Text-to-Speech is available
 */
export async function isSpeechAvailable(): Promise<boolean> {
  try {
    const voices = await Speech.getAvailableVoicesAsync();
    return voices.some(voice => voice.language.startsWith('ja'));
  } catch (error) {
    console.error('Failed to check speech availability:', error);
    return false;
  }
}
