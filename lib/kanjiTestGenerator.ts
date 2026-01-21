/**
 * Kanji Test Generator
 *
 * Generates kanji reading test questions with configurable reading modes
 * (onyomi, kunyomi, or mixed) and JLPT levels (N5, N4).
 *
 * Pattern: Follows the structure of testGenerator.ts for consistency
 */

import { v4 as uuidv4 } from 'uuid';
import type { KanjiChar } from './kanji';
import { getKanjiByLevel } from './kanji';
import { isRomanjiMatch } from './romajiNormalization';

/**
 * Kanji reading modes for test configuration
 */
export type KanjiReadingMode = 'onyomi' | 'kunyomi' | 'mixed';

/**
 * JLPT difficulty levels
 */
export type JLPTLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1';

/**
 * Kanji question interface
 */
export interface KanjiQuestion {
  id: string;                      // Unique question ID
  kanji: string;                   // The kanji character to test
  meanings: string[];              // English meanings (shown as hint)
  correctAnswers: string[];        // Valid readings based on mode
  readingType: KanjiReadingMode;   // Reading mode for this question
  userAnswer?: string;             // User's submitted answer
  isCorrect?: boolean;             // Whether answer was correct
}

/**
 * Generate kanji reading test questions
 *
 * @param count - Number of questions to generate
 * @param level - JLPT level ('N5' or 'N4')
 * @param readingMode - Reading type ('onyomi', 'kunyomi', or 'mixed')
 * @param includeN5 - For N4 tests: include N5 kanji (true) or N4-only (false). Ignored for N5 tests.
 * @returns Array of kanji questions
 *
 * @example
 * const questions = generateKanjiQuestions(10, 'N5', 'onyomi', true);
 * // Generates 10 N5 kanji questions testing only onyomi readings
 *
 * const questions = generateKanjiQuestions(10, 'N4', 'mixed', false);
 * // Generates 10 N4-only kanji questions (excludes N5)
 */
export function generateKanjiQuestions(
  count: number,
  level: JLPTLevel,
  readingMode: KanjiReadingMode,
  includeN5: boolean = true
): KanjiQuestion[] {
  const kanjiPool = getKanjiByLevel(level, includeN5);
  const questions: KanjiQuestion[] = [];

  if (kanjiPool.length === 0) {
    throw new Error(`No kanji available for level ${level}`);
  }

  for (let i = 0; i < count; i++) {
    // Select random kanji from pool
    const randomIndex = Math.floor(Math.random() * kanjiPool.length);
    const kanji = kanjiPool[randomIndex];

    // Filter correct answers based on reading mode
    let correctAnswers: string[];
    if (readingMode === 'onyomi') {
      correctAnswers = [...kanji.onyomi];
    } else if (readingMode === 'kunyomi') {
      correctAnswers = [...kanji.kunyomi];
    } else {
      // Mixed mode: both onyomi and kunyomi are acceptable
      correctAnswers = [...kanji.onyomi, ...kanji.kunyomi];
    }

    // Skip this kanji if it has no readings for the selected mode
    // (Some kanji only have onyomi or only have kunyomi)
    if (correctAnswers.length === 0) {
      i--; // Retry with different kanji
      continue;
    }

    questions.push({
      id: uuidv4(),
      kanji: kanji.character,
      meanings: [...kanji.meanings],
      correctAnswers,
      readingType: readingMode,
    });
  }

  return questions;
}

/**
 * Validate a user's answer against correct kanji readings
 * Uses romaji normalization to accept spelling variants
 *
 * @param userAnswer - The user's romaji input
 * @param correctAnswers - Array of valid readings
 * @returns true if the answer matches any valid reading
 *
 * @example
 * validateKanjiAnswer("nichi", ["nichi", "jitsu"])  // true
 * validateKanjiAnswer("ni", ["nichi", "jitsu"])      // false
 * validateKanjiAnswer("jitu", ["nichi", "jitsu"])    // true (accepts 'jitu' variant of 'jitsu')
 */
export function validateKanjiAnswer(
  userAnswer: string,
  correctAnswers: string[]
): boolean {
  return isRomanjiMatch(userAnswer, correctAnswers);
}

/**
 * Calculate the score for a kanji test session
 *
 * @param questions - Array of answered questions
 * @returns Score as a percentage (0-100)
 */
export function calculateKanjiScore(questions: KanjiQuestion[]): number {
  if (questions.length === 0) return 0;

  const correctCount = questions.filter(q => q.isCorrect === true).length;
  return Math.round((correctCount / questions.length) * 100);
}

/**
 * Get statistics for a kanji test session
 *
 * @param questions - Array of answered questions
 * @returns Test statistics
 */
export function getKanjiTestStats(questions: KanjiQuestion[]) {
  const total = questions.length;
  const correct = questions.filter(q => q.isCorrect === true).length;
  const incorrect = questions.filter(q => q.isCorrect === false).length;
  const score = calculateKanjiScore(questions);

  return {
    total,
    correct,
    incorrect,
    score,
    percentage: score,
  };
}

/**
 * Validate kanji test configuration
 *
 * @param count - Number of questions
 * @param level - JLPT level
 * @param readingMode - Reading mode
 * @throws Error if configuration is invalid
 */
export function validateKanjiTestConfig(
  count: number,
  level: JLPTLevel,
  readingMode: KanjiReadingMode
): void {
  if (count <= 0) {
    throw new Error('Question count must be positive');
  }

  if (!['N5', 'N4'].includes(level)) {
    throw new Error(`Invalid JLPT level: ${level}`);
  }

  if (!['onyomi', 'kunyomi', 'mixed'].includes(readingMode)) {
    throw new Error(`Invalid reading mode: ${readingMode}`);
  }

  const availableKanji = getKanjiByLevel(level).length;
  if (availableKanji === 0) {
    throw new Error(`No kanji available for level ${level}`);
  }
}
