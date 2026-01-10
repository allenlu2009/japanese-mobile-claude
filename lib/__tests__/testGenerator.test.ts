import { generateQuestions, validateAnswer, calculateScore } from '../testGenerator';

describe('Hiragana Test Generator', () => {
  describe('generateQuestions', () => {
    it('should generate correct number of 1-char questions', () => {
      const questions = generateQuestions('1-char', 10, 'all');
      expect(questions).toHaveLength(10);
    });

    it('should generate questions with required fields', () => {
      const questions = generateQuestions('1-char', 5, 'all');

      questions.forEach(q => {
        expect(q).toHaveProperty('id');
        expect(q).toHaveProperty('characters');
        expect(q).toHaveProperty('correctAnswers');
        expect(q.correctAnswers).toBeInstanceOf(Array);
        expect(q.correctAnswers.length).toBeGreaterThan(0);
      });
    });

    it('should generate 3-char questions', () => {
      const questions = generateQuestions('3-char', 5, 'all');

      expect(questions).toHaveLength(5);
      questions.forEach(q => {
        // 3-char questions have 3 hiragana items, but combo chars (ちゃ, にょ) are 2 Unicode chars
        // So the string length can be 3-6 characters depending on how many combos are included
        expect(q.characters.length).toBeGreaterThanOrEqual(3);
        expect(q.characters.length).toBeLessThanOrEqual(6);
        // correctAnswers contains all romanji combinations (e.g., shi/si variants)
        expect(q.correctAnswers.length).toBeGreaterThan(0);
      });
    });

    it('should only use basic hiragana when difficulty is basic', () => {
      const questions = generateQuestions('1-char', 10, 'basic');

      expect(questions).toHaveLength(10);
      // Basic hiragana should not include dakuten or combo characters
      questions.forEach(q => {
        expect(q.characters).not.toMatch(/[がぎぐげご]/);
        expect(q.characters).not.toMatch(/きゃ|きゅ|きょ|しゃ|しゅ|しょ|ちゃ|ちゅ|ちょ|にゃ|にゅ|にょ|ひゃ|ひゅ|ひょ|みゃ|みゅ|みょ|りゃ|りゅ|りょ|ぎゃ|ぎゅ|ぎょ|じゃ|じゅ|じょ|びゃ|びゅ|びょ|ぴゃ|ぴゅ|ぴょ/);
      });
    });

    it('should generate unique question IDs', () => {
      const questions = generateQuestions('1-char', 20, 'all');
      const ids = questions.map(q => q.id);
      const uniqueIds = new Set(ids);

      expect(uniqueIds.size).toBe(20);
    });
  });

  describe('validateAnswer', () => {
    it('should accept exact match', () => {
      const result = validateAnswer('a', ['a', 'あ']);
      expect(result).toBe(true);
    });

    it('should be case insensitive', () => {
      const result = validateAnswer('KA', ['ka']);
      expect(result).toBe(true);
    });

    it('should trim whitespace', () => {
      const result = validateAnswer('  ka  ', ['ka']);
      expect(result).toBe(true);
    });

    it('should reject incorrect answers', () => {
      const result = validateAnswer('ki', ['ka']);
      expect(result).toBe(false);
    });

    it('should accept any valid answer from array', () => {
      const result = validateAnswer('si', ['shi', 'si']);
      expect(result).toBe(true);
    });
  });

  describe('calculateScore', () => {
    it('should calculate correct percentage', () => {
      const questions = [
        { id: '1', characters: 'あ', correctAnswers: ['a'], isCorrect: true },
        { id: '2', characters: 'い', correctAnswers: ['i'], isCorrect: true },
        { id: '3', characters: 'う', correctAnswers: ['u'], isCorrect: false },
        { id: '4', characters: 'え', correctAnswers: ['e'], isCorrect: true },
        { id: '5', characters: 'お', correctAnswers: ['o'], isCorrect: false },
      ];

      const score = calculateScore(questions);
      expect(score).toBe(60); // 3 out of 5 = 60%
    });

    it('should return 0 for empty array', () => {
      const score = calculateScore([]);
      expect(score).toBe(0);
    });

    it('should return 100 for all correct', () => {
      const questions = [
        { id: '1', characters: 'あ', correctAnswers: ['a'], isCorrect: true },
        { id: '2', characters: 'い', correctAnswers: ['i'], isCorrect: true },
      ];

      const score = calculateScore(questions);
      expect(score).toBe(100);
    });

    it('should return 0 for all incorrect', () => {
      const questions = [
        { id: '1', characters: 'あ', correctAnswers: ['a'], isCorrect: false },
        { id: '2', characters: 'い', correctAnswers: ['i'], isCorrect: false },
      ];

      const score = calculateScore(questions);
      expect(score).toBe(0);
    });
  });
});
