import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';
import {
  speakJapanese,
  playSuccessSound,
  playErrorSound,
  playButtonPress,
  stopSpeech,
  isSpeechAvailable
} from '../audio';

// Mock modules are already set up in jest.setup.js

describe('Audio Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('speakJapanese', () => {
    it('should call Speech.speak with correct parameters', async () => {
      await speakJapanese('こんにちは');

      expect(Speech.speak).toHaveBeenCalledWith('こんにちは', {
        language: 'ja-JP',
        pitch: 1.0,
        rate: 0.85,
      });
    });

    it('should stop previous speech before speaking', async () => {
      await speakJapanese('あ');

      expect(Speech.stop).toHaveBeenCalled();
    });

    it('should not speak if text is undefined', async () => {
      await speakJapanese(undefined as any);

      expect(Speech.speak).not.toHaveBeenCalled();
    });

    it('should not speak if text is empty', async () => {
      await speakJapanese('');

      expect(Speech.speak).not.toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      (Speech.speak as jest.Mock).mockRejectedValueOnce(new Error('Speech error'));

      await expect(speakJapanese('あ')).resolves.not.toThrow();
    });
  });

  describe('playSuccessSound', () => {
    it('should play success haptic when enabled', async () => {
      await playSuccessSound(true);

      expect(Haptics.notificationAsync).toHaveBeenCalledWith(
        Haptics.NotificationFeedbackType.Success
      );
    });

    it('should not play haptic when disabled', async () => {
      await playSuccessSound(false);

      expect(Haptics.notificationAsync).not.toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      (Haptics.notificationAsync as jest.Mock).mockRejectedValueOnce(new Error('Haptic error'));

      await expect(playSuccessSound(true)).resolves.not.toThrow();
    });
  });

  describe('playErrorSound', () => {
    it('should play error haptic when enabled', async () => {
      await playErrorSound(true);

      expect(Haptics.notificationAsync).toHaveBeenCalledWith(
        Haptics.NotificationFeedbackType.Error
      );
    });

    it('should not play haptic when disabled', async () => {
      await playErrorSound(false);

      expect(Haptics.notificationAsync).not.toHaveBeenCalled();
    });
  });

  describe('playButtonPress', () => {
    it('should play light impact when enabled', async () => {
      await playButtonPress(true);

      expect(Haptics.impactAsync).toHaveBeenCalledWith(
        Haptics.ImpactFeedbackStyle.Light
      );
    });

    it('should not play impact when disabled', async () => {
      await playButtonPress(false);

      expect(Haptics.impactAsync).not.toHaveBeenCalled();
    });
  });

  describe('stopSpeech', () => {
    it('should call Speech.stop', async () => {
      await stopSpeech();

      expect(Speech.stop).toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      (Speech.stop as jest.Mock).mockRejectedValueOnce(new Error('Stop error'));

      await expect(stopSpeech()).resolves.not.toThrow();
    });
  });

  describe('isSpeechAvailable', () => {
    it('should return true if Japanese voice is available', async () => {
      const result = await isSpeechAvailable();

      expect(result).toBe(true);
      expect(Speech.getAvailableVoicesAsync).toHaveBeenCalled();
    });

    it('should return false if error occurs', async () => {
      (Speech.getAvailableVoicesAsync as jest.Mock).mockRejectedValueOnce(
        new Error('Voice error')
      );

      const result = await isSpeechAvailable();

      expect(result).toBe(false);
    });
  });
});
