/**
 * Vocabulary Test Generator
 *
 * Generates vocabulary reading test questions for JLPT levels (N5, N4, N3).
 * Tests recognition of kanji+kana words and their romaji readings.
 *
 * Pattern: Follows the structure of kanjiTestGenerator.ts for consistency
 */

import { v4 as uuidv4 } from 'uuid';
import type { VocabularyWord } from './vocabulary';
import { getVocabularyByLevel } from './vocabulary';
import { isRomanjiMatch } from './romajiNormalization';
import type { JLPTLevel } from './kanjiTestGenerator';

/**
 * Vocabulary question interface
 */
export interface VocabularyQuestion {
  id: string;                 // Unique question ID
  word: string;              // Kanji+kana form (e.g., "日本")
  kana: string;             // Full kana reading (e.g., "にほん")
  meaning: string;          // English meaning (shown as hint)
  correctAnswers: string[]; // Valid romaji readings
  userAnswer?: string;      // User's submitted answer
  isCorrect?: boolean;      // Whether answer was correct
}

/**
 * Generate vocabulary reading test questions
 *
 * @param count - Number of questions to generate
 * @param level - JLPT level ('N5', 'N4', or 'N3')
 * @param includeLower - Include lower levels: true (default) or false (level-only)
 * @returns Array of vocabulary questions
 *
 * @example
 * const questions = generateVocabularyQuestions(10, 'N5', true);
 * // Generates 10 N5 vocabulary questions
 *
 * const questions = generateVocabularyQuestions(10, 'N4', false);
 * // Generates 10 N4-only vocabulary questions (excludes N5)
 *
 * const questions = generateVocabularyQuestions(10, 'N3', true);
 * // Generates 10 N3 vocabulary questions (includes N5 + N4 + N3)
 */
export function generateVocabularyQuestions(
  count: number,
  level: JLPTLevel,
  includeN5: boolean = true
): VocabularyQuestion[] {
  const vocabPool = getVocabularyByLevel(level, includeN5);
  const questions: VocabularyQuestion[] = [];

  if (vocabPool.length === 0) {
    throw new Error(`No vocabulary available for level ${level}`);
  }

  for (let i = 0; i < count; i++) {
    // Select random vocabulary from pool
    const randomIndex = Math.floor(Math.random() * vocabPool.length);
    const vocab = vocabPool[randomIndex];

    questions.push({
      id: uuidv4(),
      word: vocab.word,
      kana: vocab.kana,
      meaning: vocab.meaning,
      correctAnswers: [...vocab.romaji],
    });
  }

  return questions;
}

/**
 * Validate a user's answer against correct vocabulary readings
 * Uses romaji normalization to accept spelling variants
 *
 * @param userAnswer - The user's romaji input
 * @param correctAnswers - Array of valid romaji readings
 * @returns true if the answer matches any valid reading
 *
 * @example
 * validateVocabularyAnswer("nihon", ["nihon", "nippon"])  // true
 * validateVocabularyAnswer("nippon", ["nihon", "nippon"]) // true
 * validateVocabularyAnswer("japan", ["nihon", "nippon"])  // false
 */
export function validateVocabularyAnswer(
  userAnswer: string,
  correctAnswers: string[]
): boolean {
  return isRomanjiMatch(userAnswer, correctAnswers);
}

/**
 * Calculate the score for a vocabulary test session
 *
 * @param questions - Array of answered questions
 * @returns Score as a percentage (0-100)
 */
export function calculateVocabularyScore(questions: VocabularyQuestion[]): number {
  if (questions.length === 0) return 0;

  const correctCount = questions.filter(q => q.isCorrect === true).length;
  return Math.round((correctCount / questions.length) * 100);
}

/**
 * Get statistics for a vocabulary test session
 *
 * @param questions - Array of answered questions
 * @returns Test statistics
 */
export function getVocabularyTestStats(questions: VocabularyQuestion[]) {
  const total = questions.length;
  const correct = questions.filter(q => q.isCorrect === true).length;
  const incorrect = questions.filter(q => q.isCorrect === false).length;
  const score = calculateVocabularyScore(questions);

  return {
    total,
    correct,
    incorrect,
    score,
    percentage: score,
  };
}

/**
 * Validate vocabulary test configuration
 *
 * @param count - Number of questions
 * @param level - JLPT level
 * @throws Error if configuration is invalid
 */
export function validateVocabularyTestConfig(
  count: number,
  level: JLPTLevel
): void {
  if (count <= 0) {
    throw new Error('Question count must be positive');
  }

  if (!['N5', 'N4'].includes(level)) {
    throw new Error(`Invalid JLPT level: ${level}`);
  }

  const availableVocab = getVocabularyByLevel(level).length;
  if (availableVocab === 0) {
    throw new Error(`No vocabulary available for level ${level}`);
  }
}
