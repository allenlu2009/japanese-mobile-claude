// Katakana character data with romaji mappings

export interface KatakanaChar {
  katakana: string;
  romaji: string[];  // Array to support multiple valid romanizations
  type: 'basic' | 'dakuten' | 'combo';
}

// Basic Katakana (46 characters)
export const KATAKANA_BASIC: KatakanaChar[] = [
  // A-row
  { katakana: 'ア', romaji: ['a'], type: 'basic' },
  { katakana: 'イ', romaji: ['i'], type: 'basic' },
  { katakana: 'ウ', romaji: ['u'], type: 'basic' },
  { katakana: 'エ', romaji: ['e'], type: 'basic' },
  { katakana: 'オ', romaji: ['o'], type: 'basic' },

  // K-row
  { katakana: 'カ', romaji: ['ka'], type: 'basic' },
  { katakana: 'キ', romaji: ['ki'], type: 'basic' },
  { katakana: 'ク', romaji: ['ku'], type: 'basic' },
  { katakana: 'ケ', romaji: ['ke'], type: 'basic' },
  { katakana: 'コ', romaji: ['ko'], type: 'basic' },

  // S-row
  { katakana: 'サ', romaji: ['sa'], type: 'basic' },
  { katakana: 'シ', romaji: ['shi', 'si'], type: 'basic' },
  { katakana: 'ス', romaji: ['su'], type: 'basic' },
  { katakana: 'セ', romaji: ['se'], type: 'basic' },
  { katakana: 'ソ', romaji: ['so'], type: 'basic' },

  // T-row
  { katakana: 'タ', romaji: ['ta'], type: 'basic' },
  { katakana: 'チ', romaji: ['chi', 'ti'], type: 'basic' },
  { katakana: 'ツ', romaji: ['tsu', 'tu'], type: 'basic' },
  { katakana: 'テ', romaji: ['te'], type: 'basic' },
  { katakana: 'ト', romaji: ['to'], type: 'basic' },

  // N-row
  { katakana: 'ナ', romaji: ['na'], type: 'basic' },
  { katakana: 'ニ', romaji: ['ni'], type: 'basic' },
  { katakana: 'ヌ', romaji: ['nu'], type: 'basic' },
  { katakana: 'ネ', romaji: ['ne'], type: 'basic' },
  { katakana: 'ノ', romaji: ['no'], type: 'basic' },

  // H-row
  { katakana: 'ハ', romaji: ['ha'], type: 'basic' },
  { katakana: 'ヒ', romaji: ['hi'], type: 'basic' },
  { katakana: 'フ', romaji: ['fu', 'hu'], type: 'basic' },
  { katakana: 'ヘ', romaji: ['he'], type: 'basic' },
  { katakana: 'ホ', romaji: ['ho'], type: 'basic' },

  // M-row
  { katakana: 'マ', romaji: ['ma'], type: 'basic' },
  { katakana: 'ミ', romaji: ['mi'], type: 'basic' },
  { katakana: 'ム', romaji: ['mu'], type: 'basic' },
  { katakana: 'メ', romaji: ['me'], type: 'basic' },
  { katakana: 'モ', romaji: ['mo'], type: 'basic' },

  // Y-row
  { katakana: 'ヤ', romaji: ['ya'], type: 'basic' },
  { katakana: 'ユ', romaji: ['yu'], type: 'basic' },
  { katakana: 'ヨ', romaji: ['yo'], type: 'basic' },

  // R-row
  { katakana: 'ラ', romaji: ['ra'], type: 'basic' },
  { katakana: 'リ', romaji: ['ri'], type: 'basic' },
  { katakana: 'ル', romaji: ['ru'], type: 'basic' },
  { katakana: 'レ', romaji: ['re'], type: 'basic' },
  { katakana: 'ロ', romaji: ['ro'], type: 'basic' },

  // W-row
  { katakana: 'ワ', romaji: ['wa'], type: 'basic' },
  { katakana: 'ヲ', romaji: ['wo', 'o'], type: 'basic' },

  // N
  { katakana: 'ン', romaji: ['n', 'nn'], type: 'basic' },
];

// Dakuten and Handakuten (25 characters)
export const KATAKANA_DAKUTEN: KatakanaChar[] = [
  // G-row
  { katakana: 'ガ', romaji: ['ga'], type: 'dakuten' },
  { katakana: 'ギ', romaji: ['gi'], type: 'dakuten' },
  { katakana: 'グ', romaji: ['gu'], type: 'dakuten' },
  { katakana: 'ゲ', romaji: ['ge'], type: 'dakuten' },
  { katakana: 'ゴ', romaji: ['go'], type: 'dakuten' },

  // Z-row
  { katakana: 'ザ', romaji: ['za'], type: 'dakuten' },
  { katakana: 'ジ', romaji: ['ji', 'zi'], type: 'dakuten' },
  { katakana: 'ズ', romaji: ['zu', 'du'], type: 'dakuten' },
  { katakana: 'ゼ', romaji: ['ze'], type: 'dakuten' },
  { katakana: 'ゾ', romaji: ['zo'], type: 'dakuten' },

  // D-row
  { katakana: 'ダ', romaji: ['da'], type: 'dakuten' },
  { katakana: 'ヂ', romaji: ['ji', 'di'], type: 'dakuten' },
  { katakana: 'ヅ', romaji: ['zu', 'du'], type: 'dakuten' },
  { katakana: 'デ', romaji: ['de'], type: 'dakuten' },
  { katakana: 'ド', romaji: ['do'], type: 'dakuten' },

  // B-row
  { katakana: 'バ', romaji: ['ba'], type: 'dakuten' },
  { katakana: 'ビ', romaji: ['bi'], type: 'dakuten' },
  { katakana: 'ブ', romaji: ['bu'], type: 'dakuten' },
  { katakana: 'ベ', romaji: ['be'], type: 'dakuten' },
  { katakana: 'ボ', romaji: ['bo'], type: 'dakuten' },

  // P-row
  { katakana: 'パ', romaji: ['pa'], type: 'dakuten' },
  { katakana: 'ピ', romaji: ['pi'], type: 'dakuten' },
  { katakana: 'プ', romaji: ['pu'], type: 'dakuten' },
  { katakana: 'ペ', romaji: ['pe'], type: 'dakuten' },
  { katakana: 'ポ', romaji: ['po'], type: 'dakuten' },
];

// Combination characters / Youon (33 characters)
export const KATAKANA_COMBO: KatakanaChar[] = [
  // K-combos
  { katakana: 'キャ', romaji: ['kya'], type: 'combo' },
  { katakana: 'キュ', romaji: ['kyu'], type: 'combo' },
  { katakana: 'キョ', romaji: ['kyo'], type: 'combo' },

  // S-combos
  { katakana: 'シャ', romaji: ['sha', 'sya'], type: 'combo' },
  { katakana: 'シュ', romaji: ['shu', 'syu'], type: 'combo' },
  { katakana: 'ショ', romaji: ['sho', 'syo'], type: 'combo' },

  // C-combos
  { katakana: 'チャ', romaji: ['cha', 'tya'], type: 'combo' },
  { katakana: 'チュ', romaji: ['chu', 'tyu'], type: 'combo' },
  { katakana: 'チョ', romaji: ['cho', 'tyo'], type: 'combo' },

  // N-combos
  { katakana: 'ニャ', romaji: ['nya'], type: 'combo' },
  { katakana: 'ニュ', romaji: ['nyu'], type: 'combo' },
  { katakana: 'ニョ', romaji: ['nyo'], type: 'combo' },

  // H-combos
  { katakana: 'ヒャ', romaji: ['hya'], type: 'combo' },
  { katakana: 'ヒュ', romaji: ['hyu'], type: 'combo' },
  { katakana: 'ヒョ', romaji: ['hyo'], type: 'combo' },

  // M-combos
  { katakana: 'ミャ', romaji: ['mya'], type: 'combo' },
  { katakana: 'ミュ', romaji: ['myu'], type: 'combo' },
  { katakana: 'ミョ', romaji: ['myo'], type: 'combo' },

  // R-combos
  { katakana: 'リャ', romaji: ['rya'], type: 'combo' },
  { katakana: 'リュ', romaji: ['ryu'], type: 'combo' },
  { katakana: 'リョ', romaji: ['ryo'], type: 'combo' },

  // G-combos
  { katakana: 'ギャ', romaji: ['gya'], type: 'combo' },
  { katakana: 'ギュ', romaji: ['gyu'], type: 'combo' },
  { katakana: 'ギョ', romaji: ['gyo'], type: 'combo' },

  // J-combos
  { katakana: 'ジャ', romaji: ['ja', 'jya', 'zya'], type: 'combo' },
  { katakana: 'ジュ', romaji: ['ju', 'jyu', 'zyu'], type: 'combo' },
  { katakana: 'ジョ', romaji: ['jo', 'jyo', 'zyo'], type: 'combo' },

  // B-combos
  { katakana: 'ビャ', romaji: ['bya'], type: 'combo' },
  { katakana: 'ビュ', romaji: ['byu'], type: 'combo' },
  { katakana: 'ビョ', romaji: ['byo'], type: 'combo' },

  // P-combos
  { katakana: 'ピャ', romaji: ['pya'], type: 'combo' },
  { katakana: 'ピュ', romaji: ['pyu'], type: 'combo' },
  { katakana: 'ピョ', romaji: ['pyo'], type: 'combo' },
];

// Combined list of all katakana
export const ALL_KATAKANA: KatakanaChar[] = [
  ...KATAKANA_BASIC,
  ...KATAKANA_DAKUTEN,
  ...KATAKANA_COMBO,
];

// Helper function to find katakana character by its string
export function findKatakana(katakanaStr: string): KatakanaChar | undefined {
  return ALL_KATAKANA.find(char => char.katakana === katakanaStr);
}

// Helper function to get a random katakana character
export function getRandomKatakana(type: 'basic' | 'all' = 'all'): KatakanaChar {
  const pool = type === 'basic' ? KATAKANA_BASIC : ALL_KATAKANA;
  return pool[Math.floor(Math.random() * pool.length)];
}

// Helper function to check if a romaji answer is valid for a katakana character
export function isValidRomanji(katakanaChar: KatakanaChar, answer: string): boolean {
  const normalized = answer.toLowerCase().trim();
  return katakanaChar.romaji.some(valid => valid.toLowerCase() === normalized);
}
