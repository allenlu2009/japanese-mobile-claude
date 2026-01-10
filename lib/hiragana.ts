// Hiragana character data with romanji mappings

export interface HiraganaChar {
  hiragana: string;
  romanji: string[];  // Array to support multiple valid romanizations
  type: 'basic' | 'dakuten' | 'combo';
}

// Basic Hiragana (46 characters)
export const HIRAGANA_BASIC: HiraganaChar[] = [
  // A-row
  { hiragana: 'あ', romanji: ['a'], type: 'basic' },
  { hiragana: 'い', romanji: ['i'], type: 'basic' },
  { hiragana: 'う', romanji: ['u'], type: 'basic' },
  { hiragana: 'え', romanji: ['e'], type: 'basic' },
  { hiragana: 'お', romanji: ['o'], type: 'basic' },

  // K-row
  { hiragana: 'か', romanji: ['ka'], type: 'basic' },
  { hiragana: 'き', romanji: ['ki'], type: 'basic' },
  { hiragana: 'く', romanji: ['ku'], type: 'basic' },
  { hiragana: 'け', romanji: ['ke'], type: 'basic' },
  { hiragana: 'こ', romanji: ['ko'], type: 'basic' },

  // S-row
  { hiragana: 'さ', romanji: ['sa'], type: 'basic' },
  { hiragana: 'し', romanji: ['shi', 'si'], type: 'basic' },
  { hiragana: 'す', romanji: ['su'], type: 'basic' },
  { hiragana: 'せ', romanji: ['se'], type: 'basic' },
  { hiragana: 'そ', romanji: ['so'], type: 'basic' },

  // T-row
  { hiragana: 'た', romanji: ['ta'], type: 'basic' },
  { hiragana: 'ち', romanji: ['chi', 'ti'], type: 'basic' },
  { hiragana: 'つ', romanji: ['tsu', 'tu'], type: 'basic' },
  { hiragana: 'て', romanji: ['te'], type: 'basic' },
  { hiragana: 'と', romanji: ['to'], type: 'basic' },

  // N-row
  { hiragana: 'な', romanji: ['na'], type: 'basic' },
  { hiragana: 'に', romanji: ['ni'], type: 'basic' },
  { hiragana: 'ぬ', romanji: ['nu'], type: 'basic' },
  { hiragana: 'ね', romanji: ['ne'], type: 'basic' },
  { hiragana: 'の', romanji: ['no'], type: 'basic' },

  // H-row
  { hiragana: 'は', romanji: ['ha'], type: 'basic' },
  { hiragana: 'ひ', romanji: ['hi'], type: 'basic' },
  { hiragana: 'ふ', romanji: ['fu', 'hu'], type: 'basic' },
  { hiragana: 'へ', romanji: ['he'], type: 'basic' },
  { hiragana: 'ほ', romanji: ['ho'], type: 'basic' },

  // M-row
  { hiragana: 'ま', romanji: ['ma'], type: 'basic' },
  { hiragana: 'み', romanji: ['mi'], type: 'basic' },
  { hiragana: 'む', romanji: ['mu'], type: 'basic' },
  { hiragana: 'め', romanji: ['me'], type: 'basic' },
  { hiragana: 'も', romanji: ['mo'], type: 'basic' },

  // Y-row
  { hiragana: 'や', romanji: ['ya'], type: 'basic' },
  { hiragana: 'ゆ', romanji: ['yu'], type: 'basic' },
  { hiragana: 'よ', romanji: ['yo'], type: 'basic' },

  // R-row
  { hiragana: 'ら', romanji: ['ra'], type: 'basic' },
  { hiragana: 'り', romanji: ['ri'], type: 'basic' },
  { hiragana: 'る', romanji: ['ru'], type: 'basic' },
  { hiragana: 'れ', romanji: ['re'], type: 'basic' },
  { hiragana: 'ろ', romanji: ['ro'], type: 'basic' },

  // W-row
  { hiragana: 'わ', romanji: ['wa'], type: 'basic' },
  { hiragana: 'を', romanji: ['wo', 'o'], type: 'basic' },

  // N
  { hiragana: 'ん', romanji: ['n', 'nn'], type: 'basic' },
];

// Dakuten and Handakuten (25 characters)
export const HIRAGANA_DAKUTEN: HiraganaChar[] = [
  // G-row
  { hiragana: 'が', romanji: ['ga'], type: 'dakuten' },
  { hiragana: 'ぎ', romanji: ['gi'], type: 'dakuten' },
  { hiragana: 'ぐ', romanji: ['gu'], type: 'dakuten' },
  { hiragana: 'げ', romanji: ['ge'], type: 'dakuten' },
  { hiragana: 'ご', romanji: ['go'], type: 'dakuten' },

  // Z-row
  { hiragana: 'ざ', romanji: ['za'], type: 'dakuten' },
  { hiragana: 'じ', romanji: ['ji', 'zi'], type: 'dakuten' },
  { hiragana: 'ず', romanji: ['zu', 'du'], type: 'dakuten' },
  { hiragana: 'ぜ', romanji: ['ze'], type: 'dakuten' },
  { hiragana: 'ぞ', romanji: ['zo'], type: 'dakuten' },

  // D-row
  { hiragana: 'だ', romanji: ['da'], type: 'dakuten' },
  { hiragana: 'ぢ', romanji: ['ji', 'di'], type: 'dakuten' },
  { hiragana: 'づ', romanji: ['zu', 'du'], type: 'dakuten' },
  { hiragana: 'で', romanji: ['de'], type: 'dakuten' },
  { hiragana: 'ど', romanji: ['do'], type: 'dakuten' },

  // B-row
  { hiragana: 'ば', romanji: ['ba'], type: 'dakuten' },
  { hiragana: 'び', romanji: ['bi'], type: 'dakuten' },
  { hiragana: 'ぶ', romanji: ['bu'], type: 'dakuten' },
  { hiragana: 'べ', romanji: ['be'], type: 'dakuten' },
  { hiragana: 'ぼ', romanji: ['bo'], type: 'dakuten' },

  // P-row
  { hiragana: 'ぱ', romanji: ['pa'], type: 'dakuten' },
  { hiragana: 'ぴ', romanji: ['pi'], type: 'dakuten' },
  { hiragana: 'ぷ', romanji: ['pu'], type: 'dakuten' },
  { hiragana: 'ぺ', romanji: ['pe'], type: 'dakuten' },
  { hiragana: 'ぽ', romanji: ['po'], type: 'dakuten' },
];

// Combination characters / Youon (33 characters)
export const HIRAGANA_COMBO: HiraganaChar[] = [
  // K-combos
  { hiragana: 'きゃ', romanji: ['kya'], type: 'combo' },
  { hiragana: 'きゅ', romanji: ['kyu'], type: 'combo' },
  { hiragana: 'きょ', romanji: ['kyo'], type: 'combo' },

  // S-combos
  { hiragana: 'しゃ', romanji: ['sha', 'sya'], type: 'combo' },
  { hiragana: 'しゅ', romanji: ['shu', 'syu'], type: 'combo' },
  { hiragana: 'しょ', romanji: ['sho', 'syo'], type: 'combo' },

  // C-combos
  { hiragana: 'ちゃ', romanji: ['cha', 'tya'], type: 'combo' },
  { hiragana: 'ちゅ', romanji: ['chu', 'tyu'], type: 'combo' },
  { hiragana: 'ちょ', romanji: ['cho', 'tyo'], type: 'combo' },

  // N-combos
  { hiragana: 'にゃ', romanji: ['nya'], type: 'combo' },
  { hiragana: 'にゅ', romanji: ['nyu'], type: 'combo' },
  { hiragana: 'にょ', romanji: ['nyo'], type: 'combo' },

  // H-combos
  { hiragana: 'ひゃ', romanji: ['hya'], type: 'combo' },
  { hiragana: 'ひゅ', romanji: ['hyu'], type: 'combo' },
  { hiragana: 'ひょ', romanji: ['hyo'], type: 'combo' },

  // M-combos
  { hiragana: 'みゃ', romanji: ['mya'], type: 'combo' },
  { hiragana: 'みゅ', romanji: ['myu'], type: 'combo' },
  { hiragana: 'みょ', romanji: ['myo'], type: 'combo' },

  // R-combos
  { hiragana: 'りゃ', romanji: ['rya'], type: 'combo' },
  { hiragana: 'りゅ', romanji: ['ryu'], type: 'combo' },
  { hiragana: 'りょ', romanji: ['ryo'], type: 'combo' },

  // G-combos
  { hiragana: 'ぎゃ', romanji: ['gya'], type: 'combo' },
  { hiragana: 'ぎゅ', romanji: ['gyu'], type: 'combo' },
  { hiragana: 'ぎょ', romanji: ['gyo'], type: 'combo' },

  // J-combos
  { hiragana: 'じゃ', romanji: ['ja', 'jya', 'zya'], type: 'combo' },
  { hiragana: 'じゅ', romanji: ['ju', 'jyu', 'zyu'], type: 'combo' },
  { hiragana: 'じょ', romanji: ['jo', 'jyo', 'zyo'], type: 'combo' },

  // B-combos
  { hiragana: 'びゃ', romanji: ['bya'], type: 'combo' },
  { hiragana: 'びゅ', romanji: ['byu'], type: 'combo' },
  { hiragana: 'びょ', romanji: ['byo'], type: 'combo' },

  // P-combos
  { hiragana: 'ぴゃ', romanji: ['pya'], type: 'combo' },
  { hiragana: 'ぴゅ', romanji: ['pyu'], type: 'combo' },
  { hiragana: 'ぴょ', romanji: ['pyo'], type: 'combo' },
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

// Helper function to check if a romanji answer is valid for a hiragana character
export function isValidRomanji(hiraganaChar: HiraganaChar, answer: string): boolean {
  const normalized = answer.toLowerCase().trim();
  return hiraganaChar.romanji.some(valid => valid.toLowerCase() === normalized);
}
