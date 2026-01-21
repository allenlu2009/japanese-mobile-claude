/**
 * Alternative answer analysis using WanaKana library
 * This is the ChatGPT-proposed approach: romaji → hiragana/katakana → compare
 * Updated to support both hiragana and katakana
 */

import { toHiragana, toKatakana, isKatakana, isHiragana } from 'wanakana';
import { splitHiraganaIntoCharacters, splitJapaneseIntoCharacters } from './answerAnalysis';
import type { CharacterAnalysis } from './answerAnalysis';
import { findHiragana } from './hiragana';
import { findKatakana } from './katakana';

/**
 * Align two hiragana sequences with different lengths using greedy matching
 * Similar to syllable-matching resync algorithm but for hiragana characters
 *
 * Strategy: For each expected character, try to find it in remaining user input
 * If found ahead, consume everything before it as wrong. If not found, mark empty.
 *
 * Example: にゅぺべ (3) vs にゆぺべ (4)
 * - にゅ: Look for にゅ in "にゆぺべ" → not found, but find ぺ ahead at pos 2
 *         → Consume "にゆ" as wrong for にゅ
 * - ぺ: Remaining "ぺべ" starts with ぺ → correct
 * - べ: Remaining "べ" starts with べ → correct
 * Result: [wrong][correct][correct]
 */
function alignHiraganaSequences(
  correctChars: string[],
  userChars: string[]
): CharacterAnalysis[] {
  const result: CharacterAnalysis[] = [];
  let userIndex = 0;

  for (let i = 0; i < correctChars.length; i++) {
    const correctChar = correctChars[i];
    // FIX: Support both hiragana and katakana
    const japaneseChar = findHiragana(correctChar) || findKatakana(correctChar);

    if (!japaneseChar) {
      result.push({
        character: correctChar,
        userSyllable: '',
        correctSyllables: [],
        isCorrect: false,
        position: i,
      });
      continue;
    }

    // Check if user input at current position matches
    if (userIndex < userChars.length && userChars[userIndex] === correctChar) {
      // Direct match
      result.push({
        character: correctChar,
        userSyllable: userChars[userIndex],
        correctSyllables: japaneseChar.romaji,
        isCorrect: true,
        position: i,
      });
      userIndex++;
      continue;
    }

    // No direct match - look ahead to find next expected character
    const remainingExpected = correctChars.slice(i + 1);
    let syncPoint = -1;

    for (let j = userIndex; j < userChars.length; j++) {
      if (remainingExpected.includes(userChars[j])) {
        syncPoint = j;
        break;
      }
    }

    if (syncPoint > userIndex) {
      // Found a sync point ahead - consume everything before it as wrong
      const consumedChars = userChars.slice(userIndex, syncPoint);
      result.push({
        character: correctChar,
        userSyllable: consumedChars.join(''), // Hiragana/Katakana joined
        correctSyllables: japaneseChar.romaji,
        isCorrect: false,
        position: i,
      });
      userIndex = syncPoint;
    } else {
      // No sync point found - consume rest or mark empty
      const remaining = userChars.slice(userIndex);
      if (remaining.length > 0) {
        result.push({
          character: correctChar,
          userSyllable: remaining.join(''),
          correctSyllables: japaneseChar.romaji,
          isCorrect: false,
          position: i,
        });
        userIndex = userChars.length;
      } else {
        result.push({
          character: correctChar,
          userSyllable: '',
          correctSyllables: japaneseChar.romaji,
          isCorrect: false,
          position: i,
        });
      }
    }
  }

  return result;
}

/**
 * Analyze multi-character answer using WanaKana conversion approach
 *
 * Strategy:
 * 1. Convert user's romaji input to hiragana using WanaKana
 * 2. Split both hiragana sequences into character tokens
 * 3. Compare character-by-character
 *
 * Advantages:
 * - Leverages battle-tested WanaKana library
 * - Handles variants automatically (shi/si, chi/ti, etc.)
 * - Simpler implementation
 *
 * Tradeoffs:
 * - Loses exact mapping of wrong romaji syllable
 * - Malformed input might partially convert
 * - User sees correct answer with brackets, but not their exact typo
 *
 * @param hiraganaSequence - The correct hiragana characters (e.g., "かたな")
 * @param userAnswer - User's romaji input (e.g., "banana")
 * @returns Array of analysis for each character
 */
export function analyzeMultiCharAnswerWithWanaKana(
  hiraganaSequence: string,
  userAnswer: string
): CharacterAnalysis[] {
  // Step 1: Detect if input is hiragana or katakana
  const isKatakanaInput = hiraganaSequence.length > 0 && isKatakana(hiraganaSequence[0]);

  // Step 2: Convert user's romaji to matching script
  const userConverted = isKatakanaInput
    ? toKatakana(userAnswer.toLowerCase().trim())
    : toHiragana(userAnswer.toLowerCase().trim());

  // Step 3: Split both into character tokens (handles combo chars)
  const correctChars = splitJapaneseIntoCharacters(hiraganaSequence);
  const userChars = splitJapaneseIntoCharacters(userConverted);

  // Step 3: Check for length mismatch - try alignment instead of failing
  const lengthMismatch = correctChars.length !== userChars.length;

  if (lengthMismatch) {
    // Try to align sequences using simple greedy matching
    // Example: にゅぺべ (nyu-pe-be) vs にゆぺべ (ni-yu-pe-be)
    // Should match: [wrong][correct][correct] not [wrong][wrong][wrong]
    return alignHiraganaSequences(correctChars, userChars);
  }

  // Step 4: Normal path - Compare character-by-character
  return correctChars.map((correctChar, index) => {
    // Try to find in both hiragana and katakana
    const japaneseChar = findHiragana(correctChar) || findKatakana(correctChar);
    const userChar = userChars[index] || '';

    if (!japaneseChar) {
      return {
        character: correctChar,
        userSyllable: userChar,
        correctSyllables: [],
        isCorrect: false,
        position: index,
      };
    }

    // Direct character comparison
    const isCorrect = correctChar === userChar;

    return {
      character: correctChar,
      userSyllable: userChar, // This is the hiragana/katakana, not romaji!
      correctSyllables: japaneseChar.romaji,
      isCorrect,
      position: index,
    };
  });
}

/**
 * Get conversion diagnostics for debugging
 * Shows what WanaKana does with the input
 */
export function getWanaKanaDiagnostics(userAnswer: string): {
  original: string;
  converted: string;
  hasUnconverted: boolean;
  unconvertedChars: string[];
} {
  const converted = toHiragana(userAnswer.toLowerCase().trim());

  // Check if any ASCII characters remain (indicates partial conversion)
  const unconvertedChars: string[] = [];
  for (const char of converted) {
    if (char.charCodeAt(0) < 128) { // ASCII range
      unconvertedChars.push(char);
    }
  }

  return {
    original: userAnswer,
    converted,
    hasUnconverted: unconvertedChars.length > 0,
    unconvertedChars,
  };
}
