import { findHiragana, ALL_HIRAGANA, type HiraganaChar } from './hiragana';
import { findKatakana, ALL_KATAKANA, type KatakanaChar } from './katakana';
import { splitUserAnswer } from './syllableMatching';
import { ANSWER_ANALYSIS_STRATEGY } from './constants';

export interface CharacterAnalysis {
  character: string;
  userSyllable: string;
  correctSyllables: string[];
  isCorrect: boolean;
  position: number;
}

/**
 * Split hiragana text into individual hiragana character units (treating combos as single units)
 * For example: "じゅごを" → ['じゅ', 'ご', 'を'] not ['じ', 'ゅ', 'ご', 'を']
 */
export function splitHiraganaIntoCharacters(text: string): string[] {
  const chars: string[] = [];
  let i = 0;

  while (i < text.length) {
    let matched = false;

    // Try 2-character combo first
    if (i + 1 < text.length) {
      const twoChar = text.slice(i, i + 2);
      if (ALL_HIRAGANA.some((h: HiraganaChar) => h.hiragana === twoChar)) {
        chars.push(twoChar);
        i += 2;
        matched = true;
      }
    }

    // Try single character
    if (!matched) {
      const oneChar = text[i];
      if (ALL_HIRAGANA.some((h: HiraganaChar) => h.hiragana === oneChar)) {
        chars.push(oneChar);
        i += 1;
      } else {
        // Not a valid hiragana, skip
        i += 1;
      }
    }
  }

  return chars;
}

/**
 * Count the number of hiragana characters in a string, treating combo characters as single units
 * For example: "ばありゃ" = 3 characters (ば, あ, りゃ) not 4
 */
export function countHiraganaCharacters(text: string): number {
  return splitHiraganaIntoCharacters(text).length;
}

/**
 * Split Japanese text (hiragana or katakana) into individual character units
 * Treats combo characters as single units (e.g., きゃ or キャ)
 * Works with both hiragana and katakana
 */
export function splitJapaneseIntoCharacters(text: string): string[] {
  const chars: string[] = [];
  let i = 0;

  while (i < text.length) {
    let matched = false;

    // Try 2-character combo first (works for both hiragana and katakana)
    if (i + 1 < text.length) {
      const twoChar = text.slice(i, i + 2);
      const isHiragana = ALL_HIRAGANA.some((h: HiraganaChar) => h.hiragana === twoChar);
      const isKatakana = ALL_KATAKANA.some((k: KatakanaChar) => k.katakana === twoChar);

      if (isHiragana || isKatakana) {
        chars.push(twoChar);
        i += 2;
        matched = true;
      }
    }

    // Try single character
    if (!matched) {
      const oneChar = text[i];
      const isHiragana = ALL_HIRAGANA.some((h: HiraganaChar) => h.hiragana === oneChar);
      const isKatakana = ALL_KATAKANA.some((k: KatakanaChar) => k.katakana === oneChar);

      if (isHiragana || isKatakana) {
        chars.push(oneChar);
        i += 1;
      } else {
        // Not a valid character in our database, but preserve it to maintain alignment
        // This handles small kana (ぉ, ぁ, etc.) that WanaKana may produce
        chars.push(oneChar);
        i += 1;
      }
    }
  }

  return chars;
}

/**
 * Count the number of Japanese characters in a string (hiragana or katakana)
 * Treats combo characters as single units
 * For example: "ばありゃ" = 3 characters, "フツビョ" = 3 characters
 */
export function countJapaneseCharacters(text: string): number {
  return splitJapaneseIntoCharacters(text).length;
}

/**
 * Analyzes a multi-character answer using syllable-matching strategy
 * (Custom greedy matching + resynchronization algorithm)
 *
 * @param hiraganaSequence - The hiragana characters shown (e.g., "かたな")
 * @param userAnswer - The user's romanji answer (e.g., "banana")
 * @returns Array of analysis for each character
 */
export function analyzeMultiCharAnswerWithSyllableMatching(
  hiraganaSequence: string,
  userAnswer: string
): CharacterAnalysis[] {
  const chars = splitHiraganaIntoCharacters(hiraganaSequence);
  const hiraganaChars = chars.map(c => findHiragana(c));
  const userSyllables = splitUserAnswer(userAnswer, hiraganaChars);

  return chars.map((char, index) => {
    const hiraganaChar = hiraganaChars[index];
    const userSyllable = userSyllables[index] || '';

    if (!hiraganaChar) {
      return {
        character: char,
        userSyllable,
        correctSyllables: [],
        isCorrect: false,
        position: index,
      };
    }

    const isCorrect = hiraganaChar.romanji.some(
      valid => valid.toLowerCase() === userSyllable.toLowerCase()
    );

    return {
      character: char,
      userSyllable,
      correctSyllables: hiraganaChar.romanji,
      isCorrect,
      position: index,
    };
  });
}

/**
 * Analyzes a multi-character answer using syllable-matching strategy
 * GENERIC VERSION - Works with both hiragana and katakana
 *
 * @param japaneseSequence - The Japanese characters shown (e.g., "かたな" or "カタナ")
 * @param userAnswer - The user's romanji answer (e.g., "katana")
 * @returns Array of analysis for each character
 */
export function analyzeMultiCharAnswerWithSyllableMatchingGeneric(
  japaneseSequence: string,
  userAnswer: string
): CharacterAnalysis[] {
  const chars = splitJapaneseIntoCharacters(japaneseSequence);

  // Try to find each character in both hiragana and katakana
  const japaneseChars = chars.map(c => findHiragana(c) || findKatakana(c));
  const userSyllables = splitUserAnswer(userAnswer, japaneseChars);

  return chars.map((char, index) => {
    const japaneseChar = japaneseChars[index];
    const userSyllable = userSyllables[index] || '';

    if (!japaneseChar) {
      return {
        character: char,
        userSyllable,
        correctSyllables: [],
        isCorrect: false,
        position: index,
      };
    }

    const isCorrect = japaneseChar.romanji.some(
      valid => valid.toLowerCase() === userSyllable.toLowerCase()
    );

    return {
      character: char,
      userSyllable,
      correctSyllables: japaneseChar.romanji,
      isCorrect,
      position: index,
    };
  });
}

/**
 * Analyzes a multi-character answer using the configured strategy
 * This is the main public API - dispatches to the appropriate implementation
 *
 * @param hiraganaSequence - The hiragana characters shown (e.g., "かたな")
 * @param userAnswer - The user's romanji answer (e.g., "banana")
 * @returns Array of analysis for each character
 */
export function analyzeMultiCharAnswer(
  hiraganaSequence: string,
  userAnswer: string
): CharacterAnalysis[] {
  if (ANSWER_ANALYSIS_STRATEGY === 'wanakana') {
    // Import dynamically to avoid loading WanaKana if using syllable-matching
    const { analyzeMultiCharAnswerWithWanaKana } = require('./answerAnalysisWanaKana');
    return analyzeMultiCharAnswerWithWanaKana(hiraganaSequence, userAnswer);
  }

  // Use generic syllable-matching strategy that works with both hiragana and katakana
  return analyzeMultiCharAnswerWithSyllableMatchingGeneric(hiraganaSequence, userAnswer);
}

/**
 * Formats a correct answer with visual indicators for wrong characters
 *
 * @param analysis - Character analysis array
 * @returns Formatted string with markers for wrong characters
 */
export function formatCorrectAnswerWithIndicators(
  analysis: CharacterAnalysis[]
): Array<{ syllable: string; isWrong: boolean }> {
  return analysis.map(a => ({
    syllable: a.correctSyllables[0] || '',
    isWrong: !a.isCorrect,
  }));
}
