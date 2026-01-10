// Katakana character data with romanji mappings

export interface KatakanaChar {
  katakana: string;
  romanji: string[];  // Array to support multiple valid romanizations
  type: 'basic' | 'dakuten' | 'combo';
}

// Basic Katakana (46 characters)
export const KATAKANA_BASIC: KatakanaChar[] = [
  // A-row
  { katakana: 'ア', romanji: ['a'], type: 'basic' },
  { katakana: 'イ', romanji: ['i'], type: 'basic' },
  { katakana: 'ウ', romanji: ['u'], type: 'basic' },
  { katakana: 'エ', romanji: ['e'], type: 'basic' },
  { katakana: 'オ', romanji: ['o'], type: 'basic' },

  // K-row
  { katakana: 'カ', romanji: ['ka'], type: 'basic' },
  { katakana: 'キ', romanji: ['ki'], type: 'basic' },
  { katakana: 'ク', romanji: ['ku'], type: 'basic' },
  { katakana: 'ケ', romanji: ['ke'], type: 'basic' },
  { katakana: 'コ', romanji: ['ko'], type: 'basic' },

  // S-row
  { katakana: 'サ', romanji: ['sa'], type: 'basic' },
  { katakana: 'シ', romanji: ['shi', 'si'], type: 'basic' },
  { katakana: 'ス', romanji: ['su'], type: 'basic' },
  { katakana: 'セ', romanji: ['se'], type: 'basic' },
  { katakana: 'ソ', romanji: ['so'], type: 'basic' },

  // T-row
  { katakana: 'タ', romanji: ['ta'], type: 'basic' },
  { katakana: 'チ', romanji: ['chi', 'ti'], type: 'basic' },
  { katakana: 'ツ', romanji: ['tsu', 'tu'], type: 'basic' },
  { katakana: 'テ', romanji: ['te'], type: 'basic' },
  { katakana: 'ト', romanji: ['to'], type: 'basic' },

  // N-row
  { katakana: 'ナ', romanji: ['na'], type: 'basic' },
  { katakana: 'ニ', romanji: ['ni'], type: 'basic' },
  { katakana: 'ヌ', romanji: ['nu'], type: 'basic' },
  { katakana: 'ネ', romanji: ['ne'], type: 'basic' },
  { katakana: 'ノ', romanji: ['no'], type: 'basic' },

  // H-row
  { katakana: 'ハ', romanji: ['ha'], type: 'basic' },
  { katakana: 'ヒ', romanji: ['hi'], type: 'basic' },
  { katakana: 'フ', romanji: ['fu', 'hu'], type: 'basic' },
  { katakana: 'ヘ', romanji: ['he'], type: 'basic' },
  { katakana: 'ホ', romanji: ['ho'], type: 'basic' },

  // M-row
  { katakana: 'マ', romanji: ['ma'], type: 'basic' },
  { katakana: 'ミ', romanji: ['mi'], type: 'basic' },
  { katakana: 'ム', romanji: ['mu'], type: 'basic' },
  { katakana: 'メ', romanji: ['me'], type: 'basic' },
  { katakana: 'モ', romanji: ['mo'], type: 'basic' },

  // Y-row
  { katakana: 'ヤ', romanji: ['ya'], type: 'basic' },
  { katakana: 'ユ', romanji: ['yu'], type: 'basic' },
  { katakana: 'ヨ', romanji: ['yo'], type: 'basic' },

  // R-row
  { katakana: 'ラ', romanji: ['ra'], type: 'basic' },
  { katakana: 'リ', romanji: ['ri'], type: 'basic' },
  { katakana: 'ル', romanji: ['ru'], type: 'basic' },
  { katakana: 'レ', romanji: ['re'], type: 'basic' },
  { katakana: 'ロ', romanji: ['ro'], type: 'basic' },

  // W-row
  { katakana: 'ワ', romanji: ['wa'], type: 'basic' },
  { katakana: 'ヲ', romanji: ['wo', 'o'], type: 'basic' },

  // N
  { katakana: 'ン', romanji: ['n', 'nn'], type: 'basic' },
];

// Dakuten and Handakuten (25 characters)
export const KATAKANA_DAKUTEN: KatakanaChar[] = [
  // G-row
  { katakana: 'ガ', romanji: ['ga'], type: 'dakuten' },
  { katakana: 'ギ', romanji: ['gi'], type: 'dakuten' },
  { katakana: 'グ', romanji: ['gu'], type: 'dakuten' },
  { katakana: 'ゲ', romanji: ['ge'], type: 'dakuten' },
  { katakana: 'ゴ', romanji: ['go'], type: 'dakuten' },

  // Z-row
  { katakana: 'ザ', romanji: ['za'], type: 'dakuten' },
  { katakana: 'ジ', romanji: ['ji', 'zi'], type: 'dakuten' },
  { katakana: 'ズ', romanji: ['zu', 'du'], type: 'dakuten' },
  { katakana: 'ゼ', romanji: ['ze'], type: 'dakuten' },
  { katakana: 'ゾ', romanji: ['zo'], type: 'dakuten' },

  // D-row
  { katakana: 'ダ', romanji: ['da'], type: 'dakuten' },
  { katakana: 'ヂ', romanji: ['ji', 'di'], type: 'dakuten' },
  { katakana: 'ヅ', romanji: ['zu', 'du'], type: 'dakuten' },
  { katakana: 'デ', romanji: ['de'], type: 'dakuten' },
  { katakana: 'ド', romanji: ['do'], type: 'dakuten' },

  // B-row
  { katakana: 'バ', romanji: ['ba'], type: 'dakuten' },
  { katakana: 'ビ', romanji: ['bi'], type: 'dakuten' },
  { katakana: 'ブ', romanji: ['bu'], type: 'dakuten' },
  { katakana: 'ベ', romanji: ['be'], type: 'dakuten' },
  { katakana: 'ボ', romanji: ['bo'], type: 'dakuten' },

  // P-row
  { katakana: 'パ', romanji: ['pa'], type: 'dakuten' },
  { katakana: 'ピ', romanji: ['pi'], type: 'dakuten' },
  { katakana: 'プ', romanji: ['pu'], type: 'dakuten' },
  { katakana: 'ペ', romanji: ['pe'], type: 'dakuten' },
  { katakana: 'ポ', romanji: ['po'], type: 'dakuten' },
];

// Combination characters / Youon (33 characters)
export const KATAKANA_COMBO: KatakanaChar[] = [
  // K-combos
  { katakana: 'キャ', romanji: ['kya'], type: 'combo' },
  { katakana: 'キュ', romanji: ['kyu'], type: 'combo' },
  { katakana: 'キョ', romanji: ['kyo'], type: 'combo' },

  // S-combos
  { katakana: 'シャ', romanji: ['sha', 'sya'], type: 'combo' },
  { katakana: 'シュ', romanji: ['shu', 'syu'], type: 'combo' },
  { katakana: 'ショ', romanji: ['sho', 'syo'], type: 'combo' },

  // C-combos
  { katakana: 'チャ', romanji: ['cha', 'tya'], type: 'combo' },
  { katakana: 'チュ', romanji: ['chu', 'tyu'], type: 'combo' },
  { katakana: 'チョ', romanji: ['cho', 'tyo'], type: 'combo' },

  // N-combos
  { katakana: 'ニャ', romanji: ['nya'], type: 'combo' },
  { katakana: 'ニュ', romanji: ['nyu'], type: 'combo' },
  { katakana: 'ニョ', romanji: ['nyo'], type: 'combo' },

  // H-combos
  { katakana: 'ヒャ', romanji: ['hya'], type: 'combo' },
  { katakana: 'ヒュ', romanji: ['hyu'], type: 'combo' },
  { katakana: 'ヒョ', romanji: ['hyo'], type: 'combo' },

  // M-combos
  { katakana: 'ミャ', romanji: ['mya'], type: 'combo' },
  { katakana: 'ミュ', romanji: ['myu'], type: 'combo' },
  { katakana: 'ミョ', romanji: ['myo'], type: 'combo' },

  // R-combos
  { katakana: 'リャ', romanji: ['rya'], type: 'combo' },
  { katakana: 'リュ', romanji: ['ryu'], type: 'combo' },
  { katakana: 'リョ', romanji: ['ryo'], type: 'combo' },

  // G-combos
  { katakana: 'ギャ', romanji: ['gya'], type: 'combo' },
  { katakana: 'ギュ', romanji: ['gyu'], type: 'combo' },
  { katakana: 'ギョ', romanji: ['gyo'], type: 'combo' },

  // J-combos
  { katakana: 'ジャ', romanji: ['ja', 'jya', 'zya'], type: 'combo' },
  { katakana: 'ジュ', romanji: ['ju', 'jyu', 'zyu'], type: 'combo' },
  { katakana: 'ジョ', romanji: ['jo', 'jyo', 'zyo'], type: 'combo' },

  // B-combos
  { katakana: 'ビャ', romanji: ['bya'], type: 'combo' },
  { katakana: 'ビュ', romanji: ['byu'], type: 'combo' },
  { katakana: 'ビョ', romanji: ['byo'], type: 'combo' },

  // P-combos
  { katakana: 'ピャ', romanji: ['pya'], type: 'combo' },
  { katakana: 'ピュ', romanji: ['pyu'], type: 'combo' },
  { katakana: 'ピョ', romanji: ['pyo'], type: 'combo' },
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

// Helper function to check if a romanji answer is valid for a katakana character
export function isValidRomanji(katakanaChar: KatakanaChar, answer: string): boolean {
  const normalized = answer.toLowerCase().trim();
  return katakanaChar.romanji.some(valid => valid.toLowerCase() === normalized);
}
