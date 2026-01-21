/**
 * Romanji Normalization Utilities
 *
 * Handles various romaji spelling variants to provide a better user experience
 * in kanji and vocabulary tests. Accepts common alternative spellings like:
 * - Long vowels: "ō" vs "ou" vs "o"
 * - Double consonants: "nn" vs "n"
 * - Syllable variants: "shi" vs "si", "chi" vs "ti", etc.
 */

/**
 * Normalization rules mapping special characters to their variants
 */
const LONG_VOWEL_RULES: Record<string, string[]> = {
  'ō': ['o', 'ou', 'oh', 'oo'],
  'ū': ['u', 'uu', 'uh'],
  'ā': ['a', 'aa', 'ah'],
  'ē': ['e', 'ei', 'ee', 'eh'],
  'ī': ['i', 'ii', 'ih'],
};

/**
 * Common romaji syllable variants
 * Maps canonical form to all accepted variants
 */
const SYLLABLE_VARIANTS: Record<string, string[]> = {
  'shi': ['si'],
  'chi': ['ti'],
  'tsu': ['tu', 'tsu'],
  'fu': ['hu'],
  'ji': ['zi', 'di'],
  'zu': ['du'],
  'sya': ['sha'],
  'syu': ['shu'],
  'syo': ['sho'],
  'tya': ['cha'],
  'tyu': ['chu'],
  'tyo': ['cho'],
  'zya': ['ja'],
  'zyu': ['ju'],
  'zyo': ['jo'],
  'sha': ['sya'],
  'shu': ['syu'],
  'sho': ['syo'],
  'cha': ['tya'],
  'chu': ['tyu'],
  'cho': ['tyo'],
  'ja': ['zya'],
  'ju': ['zyu'],
  'jo': ['zyo'],
};

/**
 * Normalize a romaji string to its base form (lowercase, trimmed)
 */
function normalizeBase(input: string): string {
  return input.toLowerCase().trim();
}

/**
 * Expand a romaji string with long vowel variants
 * Returns array of possible spellings with different long vowel representations
 */
function expandLongVowels(input: string): string[] {
  const results: Set<string> = new Set([input]);

  // For each long vowel character, generate variants
  for (const [longVowel, variants] of Object.entries(LONG_VOWEL_RULES)) {
    if (input.includes(longVowel)) {
      const currentResults = Array.from(results);
      for (const variant of variants) {
        for (const str of currentResults) {
          results.add(str.replace(new RegExp(longVowel, 'g'), variant));
        }
      }
    }
  }

  return Array.from(results);
}

/**
 * Expand a romaji string with syllable variants
 * Returns array of possible spellings with different syllable representations
 */
function expandSyllableVariants(input: string): string[] {
  const results: Set<string> = new Set([input]);

  // For each syllable variant, generate alternatives
  for (const [canonical, variants] of Object.entries(SYLLABLE_VARIANTS)) {
    const allForms = [canonical, ...variants];

    for (const form of allForms) {
      if (input.includes(form)) {
        const currentResults = Array.from(results);

        // Replace with all other forms
        for (const replacement of allForms) {
          if (replacement !== form) {
            for (const str of currentResults) {
              results.add(str.replace(new RegExp(form, 'g'), replacement));
            }
          }
        }
      }
    }
  }

  return Array.from(results);
}

/**
 * Handle double-n normalization
 * "nn" at end of syllables can sometimes be written as single "n"
 */
function expandDoubleN(input: string): string[] {
  const results: Set<string> = new Set([input]);

  // Add variant with double n replaced by single n
  if (input.includes('nn')) {
    results.add(input.replace(/nn/g, 'n'));
  }

  // Add variant with single n expanded to double n (careful with this)
  // Only do this for n followed by consonant or at end
  const withDoubleN = input.replace(/n([^aeiou]|$)/g, 'nn$1');
  if (withDoubleN !== input) {
    results.add(withDoubleN);
  }

  return Array.from(results);
}

/**
 * Generate all possible normalized variants of a romaji string
 *
 * @param input - The romaji string to normalize
 * @returns Array of all possible variant spellings
 *
 * @example
 * normalizeRomanji("tōkyō")
 * // Returns: ["tōkyō", "tokyo", "toukyou", "tokyou", "toukyō", ...]
 */
export function normalizeRomanji(input: string): string[] {
  // Start with base normalization
  const base = normalizeBase(input);

  // Progressively expand with all variant rules
  let variants = [base];

  // Expand long vowels
  variants = variants.flatMap(v => expandLongVowels(v));

  // Expand syllable variants
  variants = variants.flatMap(v => expandSyllableVariants(v));

  // Expand double-n variants
  variants = variants.flatMap(v => expandDoubleN(v));

  // Remove duplicates and return
  return Array.from(new Set(variants));
}

/**
 * Check if user input matches any of the valid answers
 * Uses normalization to accept reasonable spelling variants
 *
 * @param userInput - The user's romaji input
 * @param validAnswers - Array of acceptable romaji answers
 * @returns true if user input matches any valid answer (with normalization)
 *
 * @example
 * isRomanjiMatch("toukyou", ["tōkyō", "tokyo"])  // true
 * isRomanjiMatch("si", ["shi"])                   // true
 * isRomanjiMatch("wrong", ["correct"])            // false
 */
export function isRomanjiMatch(userInput: string, validAnswers: string[]): boolean {
  // Normalize user input
  const normalizedInput = normalizeBase(userInput);

  // Check direct match first (fast path)
  if (validAnswers.some(answer => normalizeBase(answer) === normalizedInput)) {
    return true;
  }

  // Generate all variants of user input
  const inputVariants = normalizeRomanji(userInput);

  // Generate all variants of valid answers
  const answerVariants = validAnswers.flatMap(answer => normalizeRomanji(answer));

  // Check if any variant matches
  return inputVariants.some(inputVariant =>
    answerVariants.includes(inputVariant)
  );
}

/**
 * Get the canonical (preferred) form of a romaji string
 * Useful for displaying the "correct" answer in a consistent format
 *
 * @param input - The romaji string
 * @returns Canonical form (lowercase, using macrons for long vowels)
 */
export function getCanonicalRomanji(input: string): string {
  let canonical = normalizeBase(input);

  // Replace common long vowel spellings with macron versions
  canonical = canonical.replace(/ou/g, 'ō');
  canonical = canonical.replace(/uu/g, 'ū');
  canonical = canonical.replace(/aa/g, 'ā');
  canonical = canonical.replace(/ei/g, 'ē');
  canonical = canonical.replace(/ii/g, 'ī');

  // Use canonical syllable forms
  canonical = canonical.replace(/si/g, 'shi');
  canonical = canonical.replace(/ti/g, 'chi');
  canonical = canonical.replace(/tu/g, 'tsu');
  canonical = canonical.replace(/hu/g, 'fu');
  canonical = canonical.replace(/zi/g, 'ji');

  return canonical;
}
