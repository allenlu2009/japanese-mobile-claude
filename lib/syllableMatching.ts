import type { HiraganaChar } from './hiragana';
import type { KatakanaChar } from './katakana';

// All valid romanji syllables (for syllable-aware splitting)
export const VALID_ROMANJI_SYLLABLES = new Set([
  // Vowels
  'a', 'i', 'u', 'e', 'o',
  // Basic consonants
  'ka', 'ki', 'ku', 'ke', 'ko',
  'sa', 'si', 'shi', 'su', 'se', 'so',
  'ta', 'ti', 'chi', 'tsu', 'tu', 'te', 'to',
  'na', 'ni', 'nu', 'ne', 'no',
  'ha', 'hi', 'fu', 'hu', 'he', 'ho',
  'ma', 'mi', 'mu', 'me', 'mo',
  'ya', 'yu', 'yo',
  'ra', 'ri', 'ru', 're', 'ro',
  'wa', 'wo', 'n',
  // Dakuten
  'ga', 'gi', 'gu', 'ge', 'go',
  'za', 'zi', 'ji', 'zu', 'ze', 'zo',
  'da', 'di', 'du', 'de', 'do',
  'ba', 'bi', 'bu', 'be', 'bo',
  'pa', 'pi', 'pu', 'pe', 'po',
  // Combos
  'kya', 'kyu', 'kyo',
  'sha', 'sya', 'shu', 'syu', 'sho', 'syo',
  'cha', 'cya', 'tya', 'chu', 'cyu', 'tyu', 'cho', 'cyo', 'tyo',
  'nya', 'nyu', 'nyo',
  'hya', 'hyu', 'hyo',
  'mya', 'myu', 'myo',
  'rya', 'ryu', 'ryo',
  'gya', 'gyu', 'gyo',
  'ja', 'zya', 'ju', 'zyu', 'jo', 'zyo',
  'bya', 'byu', 'byo',
  'pya', 'pyu', 'pyo',
]);

/**
 * Helper: Split user answer into syllables using syllable-aware matching
 * This provides better educational feedback by correctly identifying which
 * characters the user got right vs wrong.
 *
 * Example: 'banana' with [か, た, な] → ['ba', 'na', 'na']
 *   - か gets 'ba' (incorrect, should be 'ka')
 *   - た gets 'na' (incorrect, should be 'ta')
 *   - な gets 'na' (correct!)
 */
export function splitUserAnswer(
  userAnswer: string,
  hiraganaChars: (HiraganaChar | KatakanaChar | undefined)[]
): string[] {
  const parts: string[] = [];
  let remaining = userAnswer.toLowerCase().trim();

  hiraganaChars.forEach((hiraganaChar, index) => {
    if (!hiraganaChar) {
      parts.push('');
      return;
    }

    // FIRST: Try to match the correct romanji for this character
    const correctMatch = hiraganaChar.romanji.find(romanji =>
      remaining.startsWith(romanji.toLowerCase())
    );

    if (correctMatch) {
      // Perfect match - user got it right (or used alternate spelling)
      parts.push(correctMatch);
      remaining = remaining.slice(correctMatch.length);
      return;
    }

    // SECOND: User's answer is wrong - try to extract intelligently
    // Strategy: Look ahead to see if any future expected syllables appear in remaining string
    // This helps us "resync" when there are typos

    let bestMatch: { syllable: string; isValid: boolean } | null = null;

    // Check if we can find any expected romanji for remaining characters
    const remainingChars = hiraganaChars.slice(index + 1);
    let syncPoint = -1;

    for (let i = 0; i < remainingChars.length; i++) {
      const nextChar = remainingChars[i];
      if (!nextChar) continue;

      for (const romanji of nextChar.romanji) {
        const pos = remaining.toLowerCase().indexOf(romanji.toLowerCase());
        if (pos >= 0) {
          // Found a sync point
          syncPoint = pos;
          break;
        }
      }
      if (syncPoint >= 0) break;
    }

    if (syncPoint > 0) {
      // Found a sync point ahead - extract everything before it
      const extracted = remaining.slice(0, syncPoint);
      parts.push(extracted);
      remaining = remaining.slice(syncPoint);
      return;
    }

    // When syncPoint === 0, check if greedy syllable matches a future character's expectation
    if (syncPoint === 0) {
      // Find what greedy matching would extract
      let greedySyllable: string | null = null;
      for (let len = Math.min(3, remaining.length); len >= 1; len--) {
        const candidate = remaining.slice(0, len);
        if (VALID_ROMANJI_SYLLABLES.has(candidate)) {
          greedySyllable = candidate;
          break;
        }
      }

      if (greedySyllable && remainingChars.length > 0) {
        // Check if this syllable appears again later in the remaining string
        // indexOf(syllable, 1) looks for the syllable starting from position 1
        const appearsAgainLater = remaining.toLowerCase().indexOf(
          greedySyllable.toLowerCase(),
          greedySyllable.length
        ) >= 0;

        // If the syllable appears again, extract it for current character
        // (e.g., "nana" has 'na' twice, so extract first 'na' for current char)
        // If it doesn't appear again AND a future char expects it, skip current
        // (e.g., "bo" appears once, belongs to future char)
        if (!appearsAgainLater) {
          const futureExpects = remainingChars.some(char =>
            char && char.romanji.some(r => r.toLowerCase() === greedySyllable!.toLowerCase())
          );

          if (futureExpects) {
            // Skip current - the syllable belongs to a future character
            parts.push('');
            return;
          }
        }
      }
      // Otherwise fall through to extract it
    }

    // No sync point found - try greedy valid syllable matching
    let extracted: string | null = null;

    // Try syllables from longest (3 chars) to shortest (1 char)
    for (let len = Math.min(3, remaining.length); len >= 1; len--) {
      const candidate = remaining.slice(0, len);
      if (VALID_ROMANJI_SYLLABLES.has(candidate)) {
        extracted = candidate;
        break;
      }
    }

    if (extracted) {
      // Found a valid syllable (even though it's wrong for this character)
      parts.push(extracted);
      remaining = remaining.slice(extracted.length);
    } else {
      // No valid syllable found - extract single char as fallback
      const fallback = remaining.slice(0, 1);
      parts.push(fallback);
      remaining = remaining.slice(fallback.length);
    }
  });

  return parts;
}
