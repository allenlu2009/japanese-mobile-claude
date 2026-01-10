// Create a mock database object that will be shared
const mockDb = {
  runAsync: jest.fn(),
  getFirstAsync: jest.fn(),
  getAllAsync: jest.fn(),
  execAsync: jest.fn(),
};

// Mock the database module before importing testStorage
jest.mock('../storage/database', () => ({
  getDatabase: jest.fn(() => Promise.resolve(mockDb)),
  initDatabase: jest.fn(() => Promise.resolve(mockDb)),
}));

import {
  saveTest,
  saveCharacterAttempt,
  getTests,
  getTestById,
  getCharacterAttempts,
  getCharacterAttemptsForTest,
  deleteTest,
  getTestCount,
  getCharacterAttemptCount
} from '../storage/testStorage';
import type { Test, CharacterAttempt } from '../types';

describe('Test Storage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('saveTest', () => {
    it('should save a test to the database', async () => {
      mockDb.runAsync.mockResolvedValue({ changes: 1 });

      const test: Test = {
        id: 'test-123',
        date: 1640000000000,
        score: 85,
        category: 'Hiragana',
        description: '1-char test',
        testType: '1-char',
        jlptLevel: null,
        numQuestions: 10,
        createdAt: 1640000000000,
        updatedAt: 1640000000000
      };

      await saveTest(test);

      expect(mockDb.runAsync).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO tests'),
        [
          'test-123',
          1640000000000,
          85,
          'Hiragana',
          '1-char test',
          '1-char',
          null,
          10,
          'mobile',
          1640000000000,
          1640000000000
        ]
      );
    });

    it('should handle date strings', async () => {
      mockDb.runAsync.mockResolvedValue({ changes: 1 });

      const test: Test = {
        id: 'test-456',
        date: '2021-12-20T12:00:00.000Z',
        score: 90,
        category: 'Kanji',
        description: 'N5 Kanji',
        testType: 'kanji',
        jlptLevel: 'N5',
        numQuestions: 20,
        createdAt: '2021-12-20T12:00:00.000Z',
        updatedAt: '2021-12-20T12:00:00.000Z'
      };

      await saveTest(test);

      const callArgs = (mockDb.runAsync as jest.Mock).mock.calls[0][1];
      expect(typeof callArgs[1]).toBe('number'); // date converted to timestamp
      expect(typeof callArgs[9]).toBe('number'); // createdAt converted
      expect(typeof callArgs[10]).toBe('number'); // updatedAt converted
    });
  });

  describe('saveCharacterAttempt', () => {
    it('should save a character attempt', async () => {
      mockDb.runAsync.mockResolvedValue({ changes: 1 });

      const attempt: CharacterAttempt = {
        id: 'attempt-123',
        testId: 'test-123',
        timestamp: 1640000000000,
        character: 'あ',
        scriptType: 'hiragana',
        characterType: 'basic',
        userAnswer: 'a',
        correctAnswers: ['a'],
        isCorrect: true,
        questionType: '1-char',
        jlptLevel: null,
        readingType: null
      };

      await saveCharacterAttempt(attempt);

      expect(mockDb.runAsync).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO character_attempts'),
        [
          'attempt-123',
          'test-123',
          1640000000000,
          'あ',
          'hiragana',
          'basic',
          'a',
          '["a"]',
          1,
          '1-char',
          null,
          null,
          'mobile'
        ]
      );
    });

    it('should handle boolean conversion for isCorrect', async () => {
      mockDb.runAsync.mockResolvedValue({ changes: 1 });

      const correctAttempt: CharacterAttempt = {
        id: 'attempt-1',
        testId: 'test-1',
        timestamp: 1640000000000,
        character: 'あ',
        scriptType: 'hiragana',
        userAnswer: 'a',
        correctAnswers: ['a'],
        isCorrect: true,
        questionType: '1-char'
      };

      await saveCharacterAttempt(correctAttempt);
      expect((mockDb.runAsync as jest.Mock).mock.calls[0][1][8]).toBe(1);

      const incorrectAttempt: CharacterAttempt = {
        ...correctAttempt,
        id: 'attempt-2',
        isCorrect: false
      };

      await saveCharacterAttempt(incorrectAttempt);
      expect((mockDb.runAsync as jest.Mock).mock.calls[1][1][8]).toBe(0);
    });

    it('should serialize correctAnswers array as JSON', async () => {
      mockDb.runAsync.mockResolvedValue({ changes: 1 });

      const attempt: CharacterAttempt = {
        id: 'attempt-1',
        testId: 'test-1',
        timestamp: 1640000000000,
        character: 'し',
        scriptType: 'hiragana',
        userAnswer: 'shi',
        correctAnswers: ['shi', 'si'],
        isCorrect: true,
        questionType: '1-char'
      };

      await saveCharacterAttempt(attempt);

      const callArgs = (mockDb.runAsync as jest.Mock).mock.calls[0][1];
      // Index 7 is correctAnswers (0=id, 1=testId, 2=timestamp, 3=character, 4=scriptType, 5=characterType, 6=userAnswer, 7=correctAnswers)
      expect(callArgs[7]).toBe('["shi","si"]');
    });
  });

  describe('getTests', () => {
    it('should retrieve all tests ordered by date descending', async () => {
      mockDb.getAllAsync.mockResolvedValue([
        {
          id: 'test-2',
          date: 1640100000000,
          score: 90,
          category: 'Kanji',
          description: 'N5 Kanji',
          test_type: 'kanji',
          jlpt_level: 'N5',
          num_questions: 20,
          created_at: 1640100000000,
          updated_at: 1640100000000
        },
        {
          id: 'test-1',
          date: 1640000000000,
          score: 85,
          category: 'Hiragana',
          description: '1-char',
          test_type: '1-char',
          jlpt_level: null,
          num_questions: 10,
          created_at: 1640000000000,
          updated_at: 1640000000000
        }
      ]);

      const tests = await getTests();

      expect(mockDb.getAllAsync).toHaveBeenCalledWith(
        'SELECT * FROM tests ORDER BY date DESC'
      );
      expect(tests).toHaveLength(2);
      expect(tests[0].id).toBe('test-2');
      expect(tests[0].testType).toBe('kanji');
      expect(tests[1].id).toBe('test-1');
    });

    it('should map snake_case columns to camelCase', async () => {
      mockDb.getAllAsync.mockResolvedValue([
        {
          id: 'test-1',
          date: 1640000000000,
          score: 85,
          category: 'Hiragana',
          description: '1-char',
          test_type: '1-char',
          jlpt_level: 'N5',
          num_questions: 10,
          created_at: 1640000000000,
          updated_at: 1640000000000
        }
      ]);

      const tests = await getTests();

      expect(tests[0].testType).toBe('1-char');
      expect(tests[0].jlptLevel).toBe('N5');
      expect(tests[0].numQuestions).toBe(10);
      expect(tests[0].createdAt).toBe(1640000000000);
      expect(tests[0].updatedAt).toBe(1640000000000);
    });
  });

  describe('getTestById', () => {
    it('should retrieve a test by ID', async () => {
      mockDb.getFirstAsync.mockResolvedValue({
        id: 'test-123',
        date: 1640000000000,
        score: 85,
        category: 'Hiragana',
        description: '1-char',
        test_type: '1-char',
        jlpt_level: null,
        num_questions: 10,
        created_at: 1640000000000,
        updated_at: 1640000000000
      });

      const test = await getTestById('test-123');

      expect(mockDb.getFirstAsync).toHaveBeenCalledWith(
        'SELECT * FROM tests WHERE id = ?',
        ['test-123']
      );
      expect(test).not.toBeNull();
      expect(test?.id).toBe('test-123');
      expect(test?.testType).toBe('1-char');
    });

    it('should return null if test not found', async () => {
      mockDb.getFirstAsync.mockResolvedValue(null);

      const test = await getTestById('nonexistent');

      expect(test).toBeNull();
    });
  });

  describe('getCharacterAttempts', () => {
    it('should retrieve all character attempts', async () => {
      mockDb.getAllAsync.mockResolvedValue([
        {
          id: 'attempt-1',
          test_id: 'test-1',
          timestamp: 1640000000000,
          character: 'あ',
          script_type: 'hiragana',
          character_type: 'basic',
          user_answer: 'a',
          correct_answers: '["a"]',
          is_correct: 1,
          question_type: '1-char',
          jlpt_level: null,
          reading_type: null
        }
      ]);

      const attempts = await getCharacterAttempts();

      expect(mockDb.getAllAsync).toHaveBeenCalledWith(
        'SELECT * FROM character_attempts ORDER BY timestamp DESC'
      );
      expect(attempts).toHaveLength(1);
      expect(attempts[0].character).toBe('あ');
      expect(attempts[0].isCorrect).toBe(true);
    });

    it('should parse correctAnswers JSON and convert isCorrect boolean', async () => {
      mockDb.getAllAsync.mockResolvedValue([
        {
          id: 'attempt-1',
          test_id: 'test-1',
          timestamp: 1640000000000,
          character: 'し',
          script_type: 'hiragana',
          character_type: 'basic',
          user_answer: 'shi',
          correct_answers: '["shi","si"]',
          is_correct: 1,
          question_type: '1-char',
          jlpt_level: null,
          reading_type: null
        }
      ]);

      const attempts = await getCharacterAttempts();

      expect(attempts[0].correctAnswers).toEqual(['shi', 'si']);
      expect(attempts[0].isCorrect).toBe(true);
    });

    it('should convert is_correct 0 to false', async () => {
      mockDb.getAllAsync.mockResolvedValue([
        {
          id: 'attempt-1',
          test_id: 'test-1',
          timestamp: 1640000000000,
          character: 'あ',
          script_type: 'hiragana',
          character_type: 'basic',
          user_answer: 'wrong',
          correct_answers: '["a"]',
          is_correct: 0,
          question_type: '1-char',
          jlpt_level: null,
          reading_type: null
        }
      ]);

      const attempts = await getCharacterAttempts();

      expect(attempts[0].isCorrect).toBe(false);
    });
  });

  describe('getCharacterAttemptsForTest', () => {
    it('should retrieve attempts for a specific test', async () => {
      mockDb.getAllAsync.mockResolvedValue([
        {
          id: 'attempt-1',
          test_id: 'test-123',
          timestamp: 1640000000000,
          character: 'あ',
          script_type: 'hiragana',
          character_type: 'basic',
          user_answer: 'a',
          correct_answers: '["a"]',
          is_correct: 1,
          question_type: '1-char',
          jlpt_level: null,
          reading_type: null
        }
      ]);

      const attempts = await getCharacterAttemptsForTest('test-123');

      expect(mockDb.getAllAsync).toHaveBeenCalledWith(
        'SELECT * FROM character_attempts WHERE test_id = ? ORDER BY timestamp',
        ['test-123']
      );
      expect(attempts).toHaveLength(1);
      expect(attempts[0].testId).toBe('test-123');
    });
  });

  describe('deleteTest', () => {
    it('should delete a test by ID', async () => {
      mockDb.runAsync.mockResolvedValue({ changes: 1 });

      await deleteTest('test-123');

      expect(mockDb.runAsync).toHaveBeenCalledWith(
        'DELETE FROM tests WHERE id = ?',
        ['test-123']
      );
    });
  });

  describe('getTestCount', () => {
    it('should return the test count', async () => {
      mockDb.getFirstAsync.mockResolvedValue({ count: 42 });

      const count = await getTestCount();

      expect(mockDb.getFirstAsync).toHaveBeenCalledWith(
        'SELECT COUNT(*) as count FROM tests'
      );
      expect(count).toBe(42);
    });

    it('should return 0 if no result', async () => {
      mockDb.getFirstAsync.mockResolvedValue(null);

      const count = await getTestCount();

      expect(count).toBe(0);
    });
  });

  describe('getCharacterAttemptCount', () => {
    it('should return the character attempt count', async () => {
      mockDb.getFirstAsync.mockResolvedValue({ count: 150 });

      const count = await getCharacterAttemptCount();

      expect(mockDb.getFirstAsync).toHaveBeenCalledWith(
        'SELECT COUNT(*) as count FROM character_attempts'
      );
      expect(count).toBe(150);
    });

    it('should return 0 if no result', async () => {
      mockDb.getFirstAsync.mockResolvedValue(null);

      const count = await getCharacterAttemptCount();

      expect(count).toBe(0);
    });
  });
});
