import type { CharacterAttempt, CharacterStats } from './types';
import {
  MIN_ATTEMPTS_FOR_TREND,
  RECENT_ATTEMPTS_WINDOW,
  WEAK_CHARACTER_THRESHOLD,
  TREND_IMPROVEMENT_THRESHOLD,
} from './constants';

/**
 * Calculate trend (improving/declining/stable) from chronological attempts
 */
function calculateTrend(attempts: CharacterAttempt[]): 'improving' | 'declining' | 'stable' {
  if (attempts.length < MIN_ATTEMPTS_FOR_TREND) {
    return 'stable';
  }

  // Sort by timestamp (chronological order)
  const sorted = [...attempts].sort((a, b) =>
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  // Split into two halves
  const half = Math.floor(sorted.length / 2);
  const earlyAttempts = sorted.slice(0, half);
  const recentAttempts = sorted.slice(-half);

  // Calculate success rates
  const earlySuccessRate = (earlyAttempts.filter(a => a.isCorrect).length / earlyAttempts.length) * 100;
  const recentSuccessRate = (recentAttempts.filter(a => a.isCorrect).length / recentAttempts.length) * 100;

  const difference = recentSuccessRate - earlySuccessRate;

  if (difference > TREND_IMPROVEMENT_THRESHOLD) {
    return 'improving';
  }
  if (difference < -TREND_IMPROVEMENT_THRESHOLD) {
    return 'declining';
  }
  return 'stable';
}

/**
 * Find most common incorrect answers
 */
function findCommonMistakes(attempts: CharacterAttempt[]): Array<{ answer: string; count: number }> {
  const incorrectAttempts = attempts.filter(a => !a.isCorrect && a.userAnswer.trim() !== '');

  // Count occurrences
  const mistakeCounts = new Map<string, number>();
  incorrectAttempts.forEach(attempt => {
    const answer = attempt.userAnswer.toLowerCase().trim();
    mistakeCounts.set(answer, (mistakeCounts.get(answer) || 0) + 1);
  });

  // Sort by count and take top 3
  return Array.from(mistakeCounts.entries())
    .map(([answer, count]) => ({ answer, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);
}

/**
 * Calculate success rate for recent attempts
 */
function calculateRecentSuccessRate(
  attempts: CharacterAttempt[],
  windowSize: number = RECENT_ATTEMPTS_WINDOW
): number {
  if (attempts.length === 0) return 0;

  // Sort by timestamp (most recent last)
  const sorted = [...attempts].sort((a, b) =>
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  // Take last N attempts
  const recentAttempts = sorted.slice(-windowSize);

  const correctCount = recentAttempts.filter(a => a.isCorrect).length;
  return Math.round((correctCount / recentAttempts.length) * 100);
}

/**
 * Calculate statistics for a single character from its attempts
 */
export function calculateCharacterStats(
  character: string,
  attempts: CharacterAttempt[]
): CharacterStats {
  // Filter attempts for this character
  const characterAttempts = attempts.filter(a => a.character === character);

  if (characterAttempts.length === 0) {
    // Return empty stats if no attempts
    return {
      character,
      scriptType: 'hiragana', // Default, should not happen
      characterType: 'basic', // Default, should not happen
      totalAttempts: 0,
      correctAttempts: 0,
      incorrectAttempts: 0,
      successRate: 0,
      firstAttemptDate: '',
      lastAttemptDate: '',
      trend: 'stable',
      commonMistakes: [],
      recentSuccessRate: 0,
      allTimeSuccessRate: 0,
    };
  }

  // Get character type and script type from first attempt (they should all be the same)
  const scriptType = characterAttempts[0].scriptType;
  const characterType = characterAttempts[0].characterType;

  // Calculate counts
  const totalAttempts = characterAttempts.length;
  const correctAttempts = characterAttempts.filter(a => a.isCorrect).length;
  const incorrectAttempts = totalAttempts - correctAttempts;

  // Calculate success rates
  const successRate = Math.round((correctAttempts / totalAttempts) * 100);
  const allTimeSuccessRate = successRate; // Same as successRate for clarity

  // Calculate recent success rate
  const recentSuccessRate = calculateRecentSuccessRate(characterAttempts);

  // Calculate trend
  const trend = calculateTrend(characterAttempts);

  // Find common mistakes
  const commonMistakes = findCommonMistakes(characterAttempts);

  // Get date range
  const timestamps = characterAttempts.map(a => new Date(a.timestamp).getTime());
  const firstAttemptDate = new Date(Math.min(...timestamps)).toISOString();
  const lastAttemptDate = new Date(Math.max(...timestamps)).toISOString();

  return {
    character,
    scriptType,
    characterType,
    totalAttempts,
    correctAttempts,
    incorrectAttempts,
    successRate,
    firstAttemptDate,
    lastAttemptDate,
    trend,
    commonMistakes,
    recentSuccessRate,
    allTimeSuccessRate,
  };
}

/**
 * Calculate stats for all characters that have been attempted
 */
export function calculateAllCharacterStats(attempts: CharacterAttempt[]): CharacterStats[] {
  // Get unique characters
  const uniqueCharacters = new Set(attempts.map(a => a.character));

  // Calculate stats for each character
  return Array.from(uniqueCharacters)
    .map(character => calculateCharacterStats(character, attempts))
    .filter(stats => stats.totalAttempts > 0); // Exclude empty stats
}

/**
 * Identify weak characters (low success rate)
 * Returns characters sorted by weakness (worst first)
 */
export function identifyWeakCharacters(
  stats: CharacterStats[],
  threshold: number = WEAK_CHARACTER_THRESHOLD
): CharacterStats[] {
  return stats
    .filter(stat => stat.successRate < threshold)
    .sort((a, b) => a.successRate - b.successRate); // Lowest success rate first
}

/**
 * Group stats by character type
 */
export function groupStatsByType(stats: CharacterStats[]): {
  basic: CharacterStats[];
  dakuten: CharacterStats[];
  combo: CharacterStats[];
} {
  return {
    basic: stats.filter(s => s.characterType === 'basic'),
    dakuten: stats.filter(s => s.characterType === 'dakuten'),
    combo: stats.filter(s => s.characterType === 'combo'),
  };
}

/**
 * Get character insight for display in test results
 * Returns context like "You've answered 'あ' correctly 8/10 times (80%)"
 */
export function getCharacterInsight(
  character: string,
  allAttempts: CharacterAttempt[]
): {
  character: string;
  correct: number;
  total: number;
  successRate: number;
  trend: 'improving' | 'declining' | 'stable';
  message: string;
} {
  const stats = calculateCharacterStats(character, allAttempts);

  if (stats.totalAttempts === 0) {
    return {
      character,
      correct: 0,
      total: 0,
      successRate: 0,
      trend: 'stable',
      message: 'No previous attempts',
    };
  }

  const message = `You've answered '${character}' correctly ${stats.correctAttempts}/${stats.totalAttempts} times`;

  return {
    character,
    correct: stats.correctAttempts,
    total: stats.totalAttempts,
    successRate: stats.successRate,
    trend: stats.trend,
    message,
  };
}

/**
 * Group stats by JLPT level (for kanji and vocabulary)
 */
export function groupStatsByJLPTLevel(stats: CharacterStats[]): {
  N5: CharacterStats[];
  N4: CharacterStats[];
  unclassified: CharacterStats[];
} {
  return {
    N5: stats.filter(s => s.jlptLevel === 'N5'),
    N4: stats.filter(s => s.jlptLevel === 'N4'),
    unclassified: stats.filter(s => !s.jlptLevel),
  };
}

/**
 * Filter kanji stats by reading type (onyomi or kunyomi)
 */
export function getKanjiStatsByReadingType(
  stats: CharacterStats[],
  readingType: 'onyomi' | 'kunyomi'
): CharacterStats[] {
  return stats.filter(s =>
    s.scriptType === 'kanji' && s.readingType === readingType
  );
}

/**
 * Get stats for a specific JLPT level and script type
 */
export function getStatsByLevelAndScript(
  stats: CharacterStats[],
  level: 'N5' | 'N4',
  scriptType: 'kanji' | 'vocabulary'
): CharacterStats[] {
  return stats.filter(s =>
    s.jlptLevel === level && s.scriptType === scriptType
  );
}
