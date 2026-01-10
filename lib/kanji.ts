/**
 * Kanji Database - Dataset-Driven Architecture
 *
 * Complete JLPT-based kanji organized by difficulty level (N5 and N4).
 * Data is loaded from JSON files for easier maintenance and expansion.
 *
 * Data source: JLPTsensei.com (January 2026)
 * N5: 80 kanji
 * N4: 167 additional kanji (total 247 for N4 level)
 */

import kanjiN5Data from '@/data/processed/kanji-n5.json';
import kanjiN4Data from '@/data/processed/kanji-n4.json';

export interface KanjiChar {
  character: string;           // The kanji character
  meanings: string[];          // English meanings
  onyomi: string[];           // Chinese-derived readings (romanji)
  kunyomi: string[];          // Native Japanese readings (romanji)
  jlptLevel: 'N5' | 'N4';    // JLPT difficulty level
}

// Load kanji data from JSON files
export const KANJI_N5: KanjiChar[] = kanjiN5Data as KanjiChar[];
export const KANJI_N4: KanjiChar[] = kanjiN4Data as KanjiChar[];

// Cumulative arrays (N4 includes all N5 kanji)
export const ALL_KANJI_N5 = KANJI_N5;
export const ALL_KANJI_N4 = [...KANJI_N5, ...KANJI_N4];

/**
 * Find a kanji by its character
 *
 * @param character - The kanji character to find
 * @returns The kanji object if found, undefined otherwise
 */
export function findKanji(character: string): KanjiChar | undefined {
  return ALL_KANJI_N4.find(k => k.character === character);
}

/**
 * Get all kanji for a specific JLPT level
 *
 * @param level - The JLPT level ('N5' or 'N4')
 * @param includeN5 - For N4: include N5 kanji (true, default) or N4-only (false). Ignored for N5.
 * @returns Array of kanji for that level
 */
export function getKanjiByLevel(level: 'N5' | 'N4', includeN5: boolean = true): KanjiChar[] {
  if (level === 'N5') {
    return ALL_KANJI_N5;
  } else {
    // N4: return combined or N4-only based on includeN5 flag
    return includeN5 ? ALL_KANJI_N4 : KANJI_N4;
  }
}

/**
 * Get random kanji from a specific JLPT level
 *
 * @param level - The JLPT level ('N5' or 'N4')
 * @param count - Number of random kanji to select
 * @returns Array of randomly selected kanji (may contain duplicates for small pools)
 */
export function getRandomKanji(level: 'N5' | 'N4', count: number): KanjiChar[] {
  const pool = getKanjiByLevel(level);
  const results: KanjiChar[] = [];

  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * pool.length);
    results.push(pool[randomIndex]);
  }

  return results;
}

/**
 * Get total count of kanji for a level
 *
 * @param level - The JLPT level ('N5' or 'N4')
 * @param includeN5 - For N4: include N5 kanji (true, default) or N4-only (false)
 */
export function getKanjiCount(level: 'N5' | 'N4', includeN5: boolean = true): number {
  return getKanjiByLevel(level, includeN5).length;
}

/**
 * Check if a string is a kanji character (basic check)
 */
export function isKanji(char: string): boolean {
  if (!char || char.length === 0) return false;
  const code = char.charCodeAt(0);
  // Common CJK Unified Ideographs range
  return (code >= 0x4E00 && code <= 0x9FFF);
}
