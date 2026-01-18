// Core category type
export type TestCategory = 'read' | 'listen' | 'write' | 'speak';

// Main test interface
export interface Test {
  id: string;                    // UUID
  date: string | number;         // ISO date string or epoch timestamp
  score: number;                 // 0-100 scale
  category: TestCategory;
  description: string;
  testType: string;              // Test type: 'hiragana', 'katakana', 'kanji', 'vocabulary'
  jlptLevel: string | null;      // JLPT level: 'N5', 'N4', or null
  numQuestions: number;          // Number of questions in the test
  createdAt: string | number;    // ISO timestamp or epoch
  updatedAt: string | number;    // ISO timestamp or epoch
}

// Form input interface (before validation)
export interface TestFormData {
  date: string;
  score: string | number;
  category: TestCategory | '';
  description: string;
}

// Validation error interface
export interface ValidationErrors {
  date?: string;
  score?: string;
  category?: string;
  description?: string;
}

// Analytics interfaces
export interface CategoryStats {
  category: TestCategory;
  count: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  trend: 'up' | 'down' | 'stable';
}

export interface OverallStats {
  totalTests: number;
  averageScore: number;
  categoryStats: CategoryStats[];
  recentTests: Test[];
  scoresByMonth: MonthlyScore[];
}

export interface MonthlyScore {
  month: string;              // e.g., "2024-01"
  averageScore: number;
  testCount: number;
}

// UI State interfaces
export interface FilterOptions {
  category?: TestCategory;
  dateFrom?: string;
  dateTo?: string;
  sortBy: 'date' | 'score' | 'category';
  sortOrder: 'asc' | 'desc';
}

// localStorage data structure
export interface StorageData {
  tests: Test[];
  version: string;
  lastUpdated: string;
}

// Interactive Test types
export type TestMode = 'manual' | 'interactive';
export type TestType = '1-char' | '3-char';
export type QuestionType = '1-char' | '3-char' | 'kanji' | 'vocabulary';
export type QuestionCount = 5 | 10 | 20;

export interface TestConfig {
  mode: TestMode;
  testType?: TestType;
  questionCount?: QuestionCount;
}

export interface TestSession {
  config: TestConfig;
  questions: Array<{
    id: string;
    characters: string;
    correctAnswers: string[];
    userAnswer?: string;
    isCorrect?: boolean;
  }>;
  currentQuestionIndex: number;
  startTime: Date;
  endTime?: Date;
}

// Character Analytics types
export type ScriptType = 'hiragana' | 'katakana' | 'kanji' | 'vocabulary';

export interface CharacterAttempt {
  id: string;                    // UUID for the attempt
  testId: string;                // Foreign key to Test.id
  timestamp: string;             // ISO timestamp when answered
  character: string;             // Single character or word (e.g., 'あ', 'ア', '日', '日本')
  scriptType: ScriptType;        // Hiragana, Katakana, Kanji, or Vocabulary
  characterType: 'basic' | 'dakuten' | 'combo';
  userAnswer: string;            // What user typed
  correctAnswers: string[];      // Valid romanji options
  isCorrect: boolean;            // Was the answer correct?
  questionType: QuestionType;    // Question type
  sequencePosition?: number;     // For 3-char: position (0, 1, 2)
  originalSequence?: string;     // For 3-char: full sequence

  // Kanji/Vocabulary specific fields
  readingType?: 'onyomi' | 'kunyomi' | 'mixed';  // For kanji tests
  jlptLevel?: 'N5' | 'N4';                        // JLPT difficulty level
  meanings?: string[];                             // English meanings
}

export interface CharacterStats {
  character: string;
  scriptType: ScriptType;        // Hiragana, Katakana, Kanji, or Vocabulary
  characterType: 'basic' | 'dakuten' | 'combo';
  totalAttempts: number;
  correctAttempts: number;
  incorrectAttempts: number;
  successRate: number;           // 0-100
  firstAttemptDate: string;
  lastAttemptDate: string;
  trend: 'improving' | 'declining' | 'stable';
  commonMistakes: Array<{
    answer: string;
    count: number;
  }>;
  recentSuccessRate: number;     // Last 10 attempts
  allTimeSuccessRate: number;    // Same as successRate (for clarity)

  // Kanji/Vocabulary specific fields
  readingType?: 'onyomi' | 'kunyomi' | 'mixed';  // For kanji analytics
  jlptLevel?: 'N5' | 'N4';                        // JLPT difficulty level
  meanings?: string[];                             // English meanings
}

export interface CharacterStorageData {
  attempts: CharacterAttempt[];
  version: string;
  lastUpdated: string;
}

export interface CharacterAnalyticsFilter {
  scriptType?: ScriptType;       // Filter by script type
  characterType?: 'basic' | 'dakuten' | 'combo';
  jlptLevel?: 'N5' | 'N4';       // Filter by JLPT level (for kanji/vocabulary)
  readingType?: 'onyomi' | 'kunyomi' | 'mixed';  // Filter by reading type (for kanji)
  minAttempts?: number;
  sortBy: 'character' | 'successRate' | 'totalAttempts' | 'recentPerformance';
  sortOrder: 'asc' | 'desc';
}
