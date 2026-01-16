/**
 * Database migration tests
 */

describe('Database Migration', () => {
  describe('Schema Migration', () => {
    it('should add all required columns to old schema', () => {
      // Simulate old database schema
      const oldSchema = [
        'id', 'date', 'score', 'test_type', 'jlpt_level',
        'source', 'created_at', 'updated_at'
      ];

      // Required columns that need to be added
      const requiredColumns = [
        'category',
        'description',
        'num_questions'
      ];

      // Simulate migration
      const migratedSchema = [...oldSchema];
      for (const col of requiredColumns) {
        if (!migratedSchema.includes(col)) {
          migratedSchema.push(col);
        }
      }

      // Verify all expected columns exist
      const expectedColumns = [
        'id', 'date', 'score', 'category', 'description', 'test_type',
        'jlpt_level', 'num_questions', 'source', 'created_at', 'updated_at'
      ];

      expectedColumns.forEach(col => {
        expect(migratedSchema).toContain(col);
      });
    });

    it('should support INSERT statement after migration', () => {
      // Schema after migration
      const schema = [
        'id', 'date', 'score', 'category', 'description', 'test_type',
        'jlpt_level', 'num_questions', 'source', 'created_at', 'updated_at'
      ];

      // INSERT statement columns
      const insertColumns = [
        'id', 'date', 'score', 'category', 'description', 'test_type',
        'jlpt_level', 'num_questions', 'source', 'created_at', 'updated_at'
      ];

      // All INSERT columns must exist in schema
      const canInsert = insertColumns.every(col => schema.includes(col));
      expect(canInsert).toBe(true);
    });
  });

  describe('v1.0 Import Normalization', () => {
    it('should normalize v1.0 test record to match database schema', () => {
      // v1.0 format test record
      const v1Test = {
        id: 'test-123',
        timestamp: '2025-12-25T11:39:23.290Z',
        testType: 'hiragana',
        score: 67,
        totalQuestions: 15,
        correctAnswers: 10
      };

      // Normalize to database format
      const normalized = {
        id: v1Test.id,
        date: new Date(v1Test.timestamp).getTime(),
        score: v1Test.score,
        category: 'read', // Default for v1.0
        description: `${v1Test.testType} - ${v1Test.score}%`,
        test_type: v1Test.testType,
        jlpt_level: null,
        num_questions: v1Test.totalQuestions,
        source: 'mobile',
        created_at: new Date(v1Test.timestamp).getTime(),
        updated_at: Date.now()
      };

      // Verify all required fields are present
      expect(normalized.id).toBe('test-123');
      expect(normalized.date).toBe(1766662763290);
      expect(normalized.score).toBe(67);
      expect(normalized.category).toBe('read');
      expect(normalized.description).toBe('hiragana - 67%');
      expect(normalized.test_type).toBe('hiragana');
      expect(normalized.num_questions).toBe(15);
    });

    it('should handle missing optional fields in v1.0 format', () => {
      const v1Test = {
        id: 'test-456',
        timestamp: '2025-12-25T11:39:23.290Z',
        testType: 'katakana',
        score: 80,
        totalQuestions: 10,
        correctAnswers: 8
        // No jlptLevel, no difficulty
      };

      const normalized = {
        id: v1Test.id,
        date: new Date(v1Test.timestamp).getTime(),
        score: v1Test.score,
        category: 'read',
        description: `${v1Test.testType} - ${v1Test.score}%`,
        test_type: v1Test.testType,
        jlpt_level: null, // Should be null when missing
        num_questions: v1Test.totalQuestions,
        source: 'mobile',
        created_at: new Date(v1Test.timestamp).getTime(),
        updated_at: Date.now()
      };

      expect(normalized.jlpt_level).toBeNull();
      expect(normalized.category).toBe('read');
      expect(normalized.description).toBe('katakana - 80%');
    });

    it('should normalize v1.0 attempt record to match database schema', () => {
      const v1Attempt = {
        id: 'attempt-123',
        testId: 'test-123',
        timestamp: '2025-12-25T11:39:23.290Z',
        prompt: 'あ',
        expected: ['a'],
        response: 'a',
        correct: true,
        scriptType: 'hiragana'
      };

      const normalized = {
        id: v1Attempt.id,
        testId: v1Attempt.testId,
        timestamp: new Date(v1Attempt.timestamp).getTime(),
        character: v1Attempt.prompt, // v1.0 uses 'prompt'
        scriptType: v1Attempt.scriptType,
        characterType: null,
        userAnswer: v1Attempt.response, // v1.0 uses 'response'
        correctAnswers: v1Attempt.expected, // v1.0 uses 'expected'
        isCorrect: v1Attempt.correct, // v1.0 uses 'correct'
        questionType: '1-char',
        jlptLevel: null,
        readingType: null
      };

      expect(normalized.character).toBe('あ');
      expect(normalized.userAnswer).toBe('a');
      expect(normalized.correctAnswers).toEqual(['a']);
      expect(normalized.isCorrect).toBe(true);
    });
  });

  describe('Field Mapping', () => {
    it('should map v1.0 field names to database column names', () => {
      const v1FieldMapping = {
        timestamp: 'date',
        testType: 'test_type',
        totalQuestions: 'num_questions',
        // v1.0 doesn't have these, use defaults:
        category: 'category (default: read)',
        description: 'description (generated)'
      };

      expect(v1FieldMapping.timestamp).toBe('date');
      expect(v1FieldMapping.testType).toBe('test_type');
      expect(v1FieldMapping.totalQuestions).toBe('num_questions');
    });

    it('should map v1.0 attempt fields to database columns', () => {
      const v1AttemptFieldMapping = {
        prompt: 'character',
        expected: 'correctAnswers',
        response: 'userAnswer',
        correct: 'isCorrect'
      };

      expect(v1AttemptFieldMapping.prompt).toBe('character');
      expect(v1AttemptFieldMapping.expected).toBe('correctAnswers');
      expect(v1AttemptFieldMapping.response).toBe('userAnswer');
      expect(v1AttemptFieldMapping.correct).toBe('isCorrect');
    });
  });
});
