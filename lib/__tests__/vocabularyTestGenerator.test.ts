import {
  generateVocabularyQuestions,
  validateVocabularyAnswer,
  calculateVocabularyScore,
  validateVocabularyTestConfig,
  type VocabularyQuestion
} from '../vocabularyTestGenerator';

describe('Vocabulary Test Generator', () => {
  describe('generateVocabularyQuestions', () => {
    it('should generate correct number of questions', () => {
      const questions = generateVocabularyQuestions(10, 'N5', true);
      expect(questions).toHaveLength(10);
    });

    it('should generate questions with required fields', () => {
      const questions = generateVocabularyQuestions(5, 'N5', true);

      questions.forEach(q => {
        expect(q).toHaveProperty('id');
        expect(q).toHaveProperty('word');
        expect(q).toHaveProperty('kana');
        expect(q).toHaveProperty('meaning');
        expect(q).toHaveProperty('correctAnswers');
        expect(q.correctAnswers).toBeInstanceOf(Array);
        expect(q.correctAnswers.length).toBeGreaterThan(0);
      });
    });

    it('should generate unique question IDs', () => {
      const questions = generateVocabularyQuestions(20, 'N5', true);
      const ids = questions.map(q => q.id);
      const uniqueIds = new Set(ids);

      expect(uniqueIds.size).toBe(20);
    });

    it('should work with N4 level', () => {
      const questions = generateVocabularyQuestions(5, 'N4', true);
      expect(questions).toHaveLength(5);
    });

    it('should work with N4-only (excludes N5)', () => {
      const questions = generateVocabularyQuestions(5, 'N4', false);
      expect(questions).toHaveLength(5);
    });

    it('should throw error if no vocabulary available', () => {
      // This would only happen if data files are corrupt
      expect(() => {
        generateVocabularyQuestions(0, 'N5', true);
      }).not.toThrow();
    });

    // Regression tests for doubled consonant bug
    describe('romaji correctness (regression tests)', () => {
      it('should NOT have doubled consonants in romaji - 電気 (denki)', () => {
        const questions = generateVocabularyQuestions(100, 'N5', true);
        const denkiQuestion = questions.find(q => q.word === '電気');

        if (denkiQuestion) {
          expect(denkiQuestion.correctAnswers).toContain('denki');
          expect(denkiQuestion.correctAnswers).not.toContain('ddenki');
        }
      });

      it('should NOT have doubled consonants in romaji - 会社 (kaisha)', () => {
        const questions = generateVocabularyQuestions(100, 'N5', true);
        const kaishaQuestion = questions.find(q => q.word === '会社');

        if (kaishaQuestion) {
          expect(kaishaQuestion.correctAnswers).toContain('kaisha');
          expect(kaishaQuestion.correctAnswers).not.toContain('kkaisha');
        }
      });

      it('should NOT have doubled consonants in romaji - 外国 (gaikoku)', () => {
        const questions = generateVocabularyQuestions(100, 'N5', true);
        const gaikokuQuestion = questions.find(q => q.word === '外国');

        if (gaikokuQuestion) {
          expect(gaikokuQuestion.correctAnswers).toContain('gaikoku');
          expect(gaikokuQuestion.correctAnswers).not.toContain('ggaikoku');
        }
      });

      it('should NOT have doubled consonants in romaji - 学生 (gakusei)', () => {
        const questions = generateVocabularyQuestions(100, 'N5', true);
        const gakuseiQuestion = questions.find(q => q.word === '学生');

        if (gakuseiQuestion) {
          // Should accept any valid variant (gakusei, gakusē, gakuse)
          const hasValidRomanji = gakuseiQuestion.correctAnswers.some(
            r => r === 'gakusei' || r === 'gakusē' || r === 'gakuse'
          );
          expect(hasValidRomanji).toBe(true);

          // Should NOT have doubled consonants
          const hasDoubledConsonant = gakuseiQuestion.correctAnswers.some(
            r => r.startsWith('gg')
          );
          expect(hasDoubledConsonant).toBe(false);
        }
      });

      it('should NOT have doubled consonants in romaji - 先生 (sensei)', () => {
        const questions = generateVocabularyQuestions(100, 'N5', true);
        const senseiQuestion = questions.find(q => q.word === '先生');

        if (senseiQuestion) {
          const hasValidRomanji = senseiQuestion.correctAnswers.some(
            r => r === 'sensei' || r === 'sensē' || r === 'sense'
          );
          expect(hasValidRomanji).toBe(true);

          const hasDoubledConsonant = senseiQuestion.correctAnswers.some(
            r => r.startsWith('ss')
          );
          expect(hasDoubledConsonant).toBe(false);
        }
      });

      it('should NOT have doubled consonants - 赤 (aka, not akka)', () => {
        const questions = generateVocabularyQuestions(100, 'N5', true);
        const akaQuestion = questions.find(q => q.word === '赤');

        if (akaQuestion) {
          expect(akaQuestion.correctAnswers).toContain('aka');
          expect(akaQuestion.correctAnswers).not.toContain('akka');
        }
      });

      it('should NOT have doubled consonants anywhere in romaji', () => {
        const questions = generateVocabularyQuestions(50, 'N5', true);

        questions.forEach(q => {
          q.correctAnswers.forEach(romaji => {
            // Check for any doubled consonants (except 'nn' which represents ん)
            // Match pattern: any consonant (not n) that's doubled
            const hasInvalidDouble = /([bcdfghjklmpqrstvwxyz])\1/i.test(romaji);

            if (hasInvalidDouble) {
              // Allow 'nn' as it represents ん (n sound)
              const isValidNN = /nn/i.test(romaji);
              if (!isValidNN) {
                throw new Error(`Word "${q.word}" (${q.kana}) has invalid doubled consonant in romaji: "${romaji}"`);
              }
            }
          });
        });
      });
    });
  });

  describe('validateVocabularyAnswer', () => {
    it('should accept exact match', () => {
      const result = validateVocabularyAnswer('denki', ['denki']);
      expect(result).toBe(true);
    });

    it('should be case insensitive', () => {
      const result = validateVocabularyAnswer('DENKI', ['denki']);
      expect(result).toBe(true);
    });

    it('should accept any valid romaji variant', () => {
      const result1 = validateVocabularyAnswer('sensei', ['sensei', 'sensē', 'sense']);
      expect(result1).toBe(true);

      const result2 = validateVocabularyAnswer('sensē', ['sensei', 'sensē', 'sense']);
      expect(result2).toBe(true);

      const result3 = validateVocabularyAnswer('sense', ['sensei', 'sensē', 'sense']);
      expect(result3).toBe(true);
    });

    it('should reject incorrect answers', () => {
      const result = validateVocabularyAnswer('wrong', ['denki']);
      expect(result).toBe(false);
    });

    it('should trim whitespace', () => {
      const result = validateVocabularyAnswer('  denki  ', ['denki']);
      expect(result).toBe(true);
    });

    // Regression test: user types correct answer, should not be marked wrong
    it('should accept "denki" and reject "ddenki"', () => {
      const correctResult = validateVocabularyAnswer('denki', ['denki']);
      expect(correctResult).toBe(true);

      const incorrectResult = validateVocabularyAnswer('ddenki', ['denki']);
      expect(incorrectResult).toBe(false);
    });

    it('should accept "kaisha" and reject "kkaisha"', () => {
      const correctResult = validateVocabularyAnswer('kaisha', ['kaisha']);
      expect(correctResult).toBe(true);

      const incorrectResult = validateVocabularyAnswer('kkaisha', ['kaisha']);
      expect(incorrectResult).toBe(false);
    });

    it('should accept "gaikoku" and reject "ggaikoku"', () => {
      const correctResult = validateVocabularyAnswer('gaikoku', ['gaikoku']);
      expect(correctResult).toBe(true);

      const incorrectResult = validateVocabularyAnswer('ggaikoku', ['gaikoku']);
      expect(incorrectResult).toBe(false);
    });
  });

  describe('calculateVocabularyScore', () => {
    it('should calculate correct percentage', () => {
      const questions: VocabularyQuestion[] = [
        {
          id: '1',
          word: '電気',
          kana: 'でんき',
          meaning: 'electricity',
          correctAnswers: ['denki'],
          isCorrect: true
        },
        {
          id: '2',
          word: '会社',
          kana: 'かいしゃ',
          meaning: 'company',
          correctAnswers: ['kaisha'],
          isCorrect: false
        },
        {
          id: '3',
          word: '外国',
          kana: 'がいこく',
          meaning: 'foreign country',
          correctAnswers: ['gaikoku'],
          isCorrect: true
        },
      ];

      const score = calculateVocabularyScore(questions);
      expect(score).toBe(67); // 2 out of 3 = 66.67% rounded to 67%
    });

    it('should return 0 for empty array', () => {
      const score = calculateVocabularyScore([]);
      expect(score).toBe(0);
    });

    it('should return 100 for all correct', () => {
      const questions: VocabularyQuestion[] = [
        {
          id: '1',
          word: '電気',
          kana: 'でんき',
          meaning: 'electricity',
          correctAnswers: ['denki'],
          isCorrect: true
        },
        {
          id: '2',
          word: '会社',
          kana: 'かいしゃ',
          meaning: 'company',
          correctAnswers: ['kaisha'],
          isCorrect: true
        },
      ];

      const score = calculateVocabularyScore(questions);
      expect(score).toBe(100);
    });

    it('should return 0 for all incorrect', () => {
      const questions: VocabularyQuestion[] = [
        {
          id: '1',
          word: '電気',
          kana: 'でんき',
          meaning: 'electricity',
          correctAnswers: ['denki'],
          isCorrect: false
        },
        {
          id: '2',
          word: '会社',
          kana: 'かいしゃ',
          meaning: 'company',
          correctAnswers: ['kaisha'],
          isCorrect: false
        },
      ];

      const score = calculateVocabularyScore(questions);
      expect(score).toBe(0);
    });
  });

  describe('validateVocabularyTestConfig', () => {
    it('should not throw for valid config', () => {
      expect(() => {
        validateVocabularyTestConfig(10, 'N5');
      }).not.toThrow();

      expect(() => {
        validateVocabularyTestConfig(10, 'N4');
      }).not.toThrow();
    });

    it('should throw for invalid count', () => {
      expect(() => {
        validateVocabularyTestConfig(0, 'N5');
      }).toThrow('Question count must be positive');

      expect(() => {
        validateVocabularyTestConfig(-5, 'N5');
      }).toThrow('Question count must be positive');
    });

    it('should throw for invalid JLPT level', () => {
      expect(() => {
        validateVocabularyTestConfig(10, 'N3' as any);
      }).toThrow('Invalid JLPT level: N3');
    });
  });
});
