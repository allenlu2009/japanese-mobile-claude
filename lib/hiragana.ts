// Hiragana character data with romaji mappings

export interface HiraganaChar {
  hiragana: string;
  romaji: string[];  // Array to support multiple valid romanizations
  type: 'basic' | 'dakuten' | 'combo';
}

// Basic Hiragana (46 characters)
export const HIRAGANA_BASIC: HiraganaChar[] = [
  // A-row
  { hiragana: 'あ', romaji: ['a'], type: 'basic' },
  { hiragana: 'い', romaji: ['i'], type: 'basic' },
  { hiragana: 'う', romaji: ['u'], type: 'basic' },
  { hiragana: 'え', romaji: ['e'], type: 'basic' },
  { hiragana: 'お', romaji: ['o'], type: 'basic' },

  // K-row
  { hiragana: 'か', romaji: ['ka'], type: 'basic' },
  { hiragana: 'き', romaji: ['ki'], type: 'basic' },
  { hiragana: 'く', romaji: ['ku'], type: 'basic' },
  { hiragana: 'け', romaji: ['ke'], type: 'basic' },
  { hiragana: 'こ', romaji: ['ko'], type: 'basic' },

  // S-row
  { hiragana: 'さ', romaji: ['sa'], type: 'basic' },
  { hiragana: 'し', romaji: ['shi', 'si'], type: 'basic' },
  { hiragana: 'す', romaji: ['su'], type: 'basic' },
  { hiragana: 'せ', romaji: ['se'], type: 'basic' },
  { hiragana: 'そ', romaji: ['so'], type: 'basic' },

  // T-row
  { hiragana: 'た', romaji: ['ta'], type: 'basic' },
  { hiragana: 'ち', romaji: ['chi', 'ti'], type: 'basic' },
  { hiragana: 'つ', romaji: ['tsu', 'tu'], type: 'basic' },
  { hiragana: 'て', romaji: ['te'], type: 'basic' },
  { hiragana: 'と', romaji: ['to'], type: 'basic' },

  // N-row
  { hiragana: 'な', romaji: ['na'], type: 'basic' },
  { hiragana: 'に', romaji: ['ni'], type: 'basic' },
  { hiragana: 'ぬ', romaji: ['nu'], type: 'basic' },
  { hiragana: 'ね', romaji: ['ne'], type: 'basic' },
  { hiragana: 'の', romaji: ['no'], type: 'basic' },

  // H-row
  { hiragana: 'は', romaji: ['ha'], type: 'basic' },
  { hiragana: 'ひ', romaji: ['hi'], type: 'basic' },
  { hiragana: 'ふ', romaji: ['fu', 'hu'], type: 'basic' },
  { hiragana: 'へ', romaji: ['he'], type: 'basic' },
  { hiragana: 'ほ', romaji: ['ho'], type: 'basic' },

  // M-row
  { hiragana: 'ま', romaji: ['ma'], type: 'basic' },
  { hiragana: 'み', romaji: ['mi'], type: 'basic' },
  { hiragana: 'む', romaji: ['mu'], type: 'basic' },
  { hiragana: 'め', romaji: ['me'], type: 'basic' },
  { hiragana: 'も', romaji: ['mo'], type: 'basic' },

  // Y-row
  { hiragana: 'や', romaji: ['ya'], type: 'basic' },
  { hiragana: 'ゆ', romaji: ['yu'], type: 'basic' },
  { hiragana: 'よ', romaji: ['yo'], type: 'basic' },

  // R-row
  { hiragana: 'ら', romaji: ['ra'], type: 'basic' },
  { hiragana: 'り', romaji: ['ri'], type: 'basic' },
  { hiragana: 'る', romaji: ['ru'], type: 'basic' },
  { hiragana: 'れ', romaji: ['re'], type: 'basic' },
  { hiragana: 'ろ', romaji: ['ro'], type: 'basic' },

  // W-row
  { hiragana: 'わ', romaji: ['wa'], type: 'basic' },
  { hiragana: 'を', romaji: ['wo', 'o'], type: 'basic' },

  // N
  { hiragana: 'ん', romaji: ['n', 'nn'], type: 'basic' },
];

// Dakuten and Handakuten (25 characters)
export const HIRAGANA_DAKUTEN: HiraganaChar[] = [
  // G-row
  { hiragana: 'が', romaji: ['ga'], type: 'dakuten' },
  { hiragana: 'ぎ', romaji: ['gi'], type: 'dakuten' },
  { hiragana: 'ぐ', romaji: ['gu'], type: 'dakuten' },
  { hiragana: 'げ', romaji: ['ge'], type: 'dakuten' },
  { hiragana: 'ご', romaji: ['go'], type: 'dakuten' },

  // Z-row
  { hiragana: 'ざ', romaji: ['za'], type: 'dakuten' },
  { hiragana: 'じ', romaji: ['ji', 'zi'], type: 'dakuten' },
  { hiragana: 'ず', romaji: ['zu', 'du'], type: 'dakuten' },
  { hiragana: 'ぜ', romaji: ['ze'], type: 'dakuten' },
  { hiragana: 'ぞ', romaji: ['zo'], type: 'dakuten' },

  // D-row
  { hiragana: 'だ', romaji: ['da'], type: 'dakuten' },
  { hiragana: 'ぢ', romaji: ['ji', 'di'], type: 'dakuten' },
  { hiragana: 'づ', romaji: ['zu', 'du'], type: 'dakuten' },
  { hiragana: 'で', romaji: ['de'], type: 'dakuten' },
  { hiragana: 'ど', romaji: ['do'], type: 'dakuten' },

  // B-row
  { hiragana: 'ば', romaji: ['ba'], type: 'dakuten' },
  { hiragana: 'び', romaji: ['bi'], type: 'dakuten' },
  { hiragana: 'ぶ', romaji: ['bu'], type: 'dakuten' },
  { hiragana: 'べ', romaji: ['be'], type: 'dakuten' },
  { hiragana: 'ぼ', romaji: ['bo'], type: 'dakuten' },

  // P-row
  { hiragana: 'ぱ', romaji: ['pa'], type: 'dakuten' },
  { hiragana: 'ぴ', romaji: ['pi'], type: 'dakuten' },
  { hiragana: 'ぷ', romaji: ['pu'], type: 'dakuten' },
  { hiragana: 'ぺ', romaji: ['pe'], type: 'dakuten' },
  { hiragana: 'ぽ', romaji: ['po'], type: 'dakuten' },
];

// Combination characters / Youon (33 characters)
export const HIRAGANA_COMBO: HiraganaChar[] = [
  // K-combos
  { hiragana: 'きゃ', romaji: ['kya'], type: 'combo' },
  { hiragana: 'きゅ', romaji: ['kyu'], type: 'combo' },
  { hiragana: 'きょ', romaji: ['kyo'], type: 'combo' },

  // S-combos
  { hiragana: 'しゃ', romaji: ['sha', 'sya'], type: 'combo' },
  { hiragana: 'しゅ', romaji: ['shu', 'syu'], type: 'combo' },
  { hiragana: 'しょ', romaji: ['sho', 'syo'], type: 'combo' },

  // C-combos
  { hiragana: 'ちゃ', romaji: ['cha', 'tya'], type: 'combo' },
  { hiragana: 'ちゅ', romaji: ['chu', 'tyu'], type: 'combo' },
  { hiragana: 'ちょ', romaji: ['cho', 'tyo'], type: 'combo' },

  // N-combos
  { hiragana: 'にゃ', romaji: ['nya'], type: 'combo' },
  { hiragana: 'にゅ', romaji: ['nyu'], type: 'combo' },
  { hiragana: 'にょ', romaji: ['nyo'], type: 'combo' },

  // H-combos
  { hiragana: 'ひゃ', romaji: ['hya'], type: 'combo' },
  { hiragana: 'ひゅ', romaji: ['hyu'], type: 'combo' },
  { hiragana: 'ひょ', romaji: ['hyo'], type: 'combo' },

  // M-combos
  { hiragana: 'みゃ', romaji: ['mya'], type: 'combo' },
  { hiragana: 'みゅ', romaji: ['myu'], type: 'combo' },
  { hiragana: 'みょ', romaji: ['myo'], type: 'combo' },

  // R-combos
  { hiragana: 'りゃ', romaji: ['rya'], type: 'combo' },
  { hiragana: 'りゅ', romaji: ['ryu'], type: 'combo' },
  { hiragana: 'りょ', romaji: ['ryo'], type: 'combo' },

  // G-combos
  { hiragana: 'ぎゃ', romaji: ['gya'], type: 'combo' },
  { hiragana: 'ぎゅ', romaji: ['gyu'], type: 'combo' },
  { hiragana: 'ぎょ', romaji: ['gyo'], type: 'combo' },

  // J-combos
  { hiragana: 'じゃ', romaji: ['ja', 'jya', 'zya'], type: 'combo' },
  { hiragana: 'じゅ', romaji: ['ju', 'jyu', 'zyu'], type: 'combo' },
  { hiragana: 'じょ', romaji: ['jo', 'jyo', 'zyo'], type: 'combo' },

  // B-combos
  { hiragana: 'びゃ', romaji: ['bya'], type: 'combo' },
  { hiragana: 'びゅ', romaji: ['byu'], type: 'combo' },
  { hiragana: 'びょ', romaji: ['byo'], type: 'combo' },

  // P-combos
  { hiragana: 'ぴゃ', romaji: ['pya'], type: 'combo' },
  { hiragana: 'ぴゅ', romaji: ['pyu'], type: 'combo' },
  { hiragana: 'ぴょ', romaji: ['pyo'], type: 'combo' },
];

// Combined list of all hiragana
export const ALL_HIRAGANA: HiraganaChar[] = [
  ...HIRAGANA_BASIC,
  ...HIRAGANA_DAKUTEN,
  ...HIRAGANA_COMBO,
];

// Helper function to get random hiragana characters
export function getRandomHiragana(
  count: number,
  includeTypes: ('basic' | 'dakuten' | 'combo')[] = ['basic', 'dakuten', 'combo']
): HiraganaChar[] {
  const filtered = ALL_HIRAGANA.filter(char => includeTypes.includes(char.type));

  // Shuffle and take 'count' items
  const shuffled = [...filtered].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, filtered.length));
}

// Helper function to find hiragana character by its string
export function findHiragana(hiraganaStr: string): HiraganaChar | undefined {
  return ALL_HIRAGANA.find(char => char.hiragana === hiraganaStr);
}

// Helper function to check if a romaji answer is valid for a hiragana character
export function isValidRomanji(hiraganaChar: HiraganaChar, answer: string): boolean {
  const normalized = answer.toLowerCase().trim();
  return hiraganaChar.romaji.some(valid => valid.toLowerCase() === normalized);
}
