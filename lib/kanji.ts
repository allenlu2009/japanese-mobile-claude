/**
 * Kanji Database - Dataset-Driven Architecture
 *
 * Complete JLPT-based kanji organized by difficulty level (N5 through N1).
 * Data is loaded from JSON files for easier maintenance and expansion.
 *
 * Data source: JLPTsensei.com + davidluzgouveia/kanji-data + open sources (January 2026)
 * N5: 80 kanji
 * N4: 167 additional kanji (total 247 for N4 level)
 * N3: 367 additional kanji (total 614 for N3 level)
 * N2: 367 additional kanji (total 981 for N2 level)
 * N1: 1,232 additional kanji (total 2,213 for N1 level)
 */

import kanjiN5Data from '@/data/processed/kanji-n5.json';
import kanjiN4Data from '@/data/processed/kanji-n4.json';
import kanjiN3DataRaw from '@/data/processed/kanji-n3.json';
import kanjiN2DataRaw from '@/data/processed/kanji-n2.json';
import kanjiN1DataRaw from '@/data/processed/kanji-n1.json';

export interface KanjiChar {
  character: string;           // The kanji character
  meanings: string[];          // English meanings
  onyomi: string[];           // Chinese-derived readings (romaji)
  kunyomi: string[];          // Native Japanese readings (romaji)
  jlptLevel: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';    // JLPT difficulty level
}

// Load kanji data from JSON files
export const KANJI_N5: KanjiChar[] = kanjiN5Data as KanjiChar[];
export const KANJI_N4: KanjiChar[] = kanjiN4Data as KanjiChar[];
// Extract kanji array from N3/N2/N1 meta wrappers
const kanjiN3Data = (kanjiN3DataRaw as any).kanji;
export const KANJI_N3: KanjiChar[] = kanjiN3Data as KanjiChar[];
const kanjiN2Data = (kanjiN2DataRaw as any).kanji;
export const KANJI_N2: KanjiChar[] = kanjiN2Data as KanjiChar[];
const kanjiN1Data = (kanjiN1DataRaw as any).kanji;
export const KANJI_N1: KanjiChar[] = kanjiN1Data as KanjiChar[];

// Cumulative arrays (each level includes all previous levels)
export const ALL_KANJI_N5 = KANJI_N5;
export const ALL_KANJI_N4 = [...KANJI_N5, ...KANJI_N4];
export const ALL_KANJI_N3 = [...KANJI_N5, ...KANJI_N4, ...KANJI_N3];
export const ALL_KANJI_N2 = [...KANJI_N5, ...KANJI_N4, ...KANJI_N3, ...KANJI_N2];
export const ALL_KANJI_N1 = [...KANJI_N5, ...KANJI_N4, ...KANJI_N3, ...KANJI_N2, ...KANJI_N1];

/**
 * Find a kanji by its character
 *
 * @param character - The kanji character to find
 * @returns The kanji object if found, undefined otherwise
 */
export function findKanji(character: string): KanjiChar | undefined {
  return ALL_KANJI_N3.find(k => k.character === character);
}

/**
 * Get all kanji for a specific JLPT level
 *
 * @param level - The JLPT level ('N5', 'N4', 'N3', 'N2', or 'N1')
 * @param includeLower - Include lower levels: true (default) or false (level-only)
 * @returns Array of kanji for that level
 */
export function getKanjiByLevel(level: 'N5' | 'N4' | 'N3' | 'N2' | 'N1', includeLower: boolean = true): KanjiChar[] {
  if (level === 'N5') {
    return ALL_KANJI_N5;
  } else if (level === 'N4') {
    return includeLower ? ALL_KANJI_N4 : KANJI_N4;
  } else if (level === 'N3') {
    return includeLower ? ALL_KANJI_N3 : KANJI_N3;
  } else if (level === 'N2') {
    return includeLower ? ALL_KANJI_N2 : KANJI_N2;
  } else {
    // N1: return cumulative or N1-only based on includeLower flag
    return includeLower ? ALL_KANJI_N1 : KANJI_N1;
  }
}

/**
 * Get random kanji from a specific JLPT level
 *
 * @param level - The JLPT level ('N5', 'N4', or 'N3')
 * @param count - Number of random kanji to select
 * @returns Array of randomly selected kanji (may contain duplicates for small pools)
 */
export function getRandomKanji(level: 'N5' | 'N4' | 'N3', count: number): KanjiChar[] {
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
 * @param level - The JLPT level ('N5', 'N4', 'N3', 'N2', or 'N1')
 * @param includeLower - Include lower levels: true (default) or false (level-only)
 */
export function getKanjiCount(level: 'N5' | 'N4' | 'N3' | 'N2' | 'N1', includeLower: boolean = true): number {
  return getKanjiByLevel(level, includeLower).length;
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
