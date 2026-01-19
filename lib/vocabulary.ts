/**
 * Vocabulary Database - Dataset-Driven Architecture
 *
 * Complete JLPT-based vocabulary organized by difficulty level (N5, N4, and N3).
 * Data is loaded from JSON files for easier maintenance and expansion.
 *
 * Data source: elzup/jlpt-word-list + open sources (January 2026)
 * N5: 718 vocabulary words (complete JLPT N5 coverage)
 * N4: 668 additional vocabulary words (total 1,386 for N4 level)
 * N3: 2,139 additional vocabulary words (total 3,525 for N3 level)
 */

import vocabularyN5Data from '@/data/processed/vocabulary-n5.json';
import vocabularyN4Data from '@/data/processed/vocabulary-n4.json';
import vocabularyN3Data from '@/data/processed/vocabulary-n3.json';

export interface VocabularyWord {
  word: string;               // Kanji form (may include kana)
  kana: string;              // Full hiragana reading
  romanji: string[];         // Romanji variants (accepts multiple spellings)
  meaning: string;           // English meaning
  jlptLevel: 'N5' | 'N4' | 'N3';   // JLPT difficulty level
}

// Load vocabulary data from JSON files
export const VOCABULARY_N5: VocabularyWord[] = vocabularyN5Data as VocabularyWord[];
export const VOCABULARY_N4: VocabularyWord[] = vocabularyN4Data as VocabularyWord[];
export const VOCABULARY_N3: VocabularyWord[] = vocabularyN3Data as VocabularyWord[];

// Cumulative arrays (each level includes all previous levels)
export const ALL_VOCABULARY_N5 = VOCABULARY_N5;
export const ALL_VOCABULARY_N4 = [...VOCABULARY_N5, ...VOCABULARY_N4];
export const ALL_VOCABULARY_N3 = [...VOCABULARY_N5, ...VOCABULARY_N4, ...VOCABULARY_N3];

/**
 * Find a vocabulary word by its kanji/word form
 *
 * @param word - The word to find (kanji form)
 * @returns The vocabulary object if found, undefined otherwise
 */
export function findVocabulary(word: string): VocabularyWord | undefined {
  return ALL_VOCABULARY_N3.find(v => v.word === word);
}

/**
 * Get all vocabulary for a specific JLPT level
 *
 * @param level - The JLPT level ('N5', 'N4', or 'N3')
 * @param includeLower - Include lower levels: true (default) or false (level-only)
 * @returns Array of vocabulary for that level
 */
export function getVocabularyByLevel(level: 'N5' | 'N4' | 'N3', includeLower: boolean = true): VocabularyWord[] {
  if (level === 'N5') {
    return ALL_VOCABULARY_N5;
  } else if (level === 'N4') {
    return includeLower ? ALL_VOCABULARY_N4 : VOCABULARY_N4;
  } else {
    // N3: return cumulative or N3-only based on includeLower flag
    return includeLower ? ALL_VOCABULARY_N3 : VOCABULARY_N3;
  }
}

/**
 * Get random vocabulary from a specific JLPT level
 *
 * @param level - The JLPT level ('N5', 'N4', or 'N3')
 * @param count - Number of random words to select
 * @returns Array of randomly selected vocabulary (may contain duplicates for small pools)
 */
export function getRandomVocabulary(level: 'N5' | 'N4' | 'N3', count: number): VocabularyWord[] {
  const pool = getVocabularyByLevel(level);
  const results: VocabularyWord[] = [];

  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * pool.length);
    results.push(pool[randomIndex]);
  }

  return results;
}

/**
 * Get total count of vocabulary for a level
 *
 * @param level - The JLPT level ('N5', 'N4', or 'N3')
 * @param includeLower - Include lower levels: true (default) or false (level-only)
 */
export function getVocabularyCount(level: 'N5' | 'N4' | 'N3', includeLower: boolean = true): number {
  return getVocabularyByLevel(level, includeLower).length;
}
