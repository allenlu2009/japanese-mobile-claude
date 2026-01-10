import { getDatabase } from './database';
import { differenceInDays, startOfDay } from 'date-fns';

export interface StudyStreak {
  currentStreak: number;
  longestStreak: number;
  lastPracticeDate: string | null;
}

/**
 * Get the current study streak
 */
export async function getStreak(): Promise<StudyStreak> {
  const db = await getDatabase();

  const row = await db.getFirstAsync<{
    current_streak: number;
    longest_streak: number;
    last_practice_date: string | null;
  }>('SELECT * FROM study_streak WHERE id = 1');

  if (!row) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastPracticeDate: null
    };
  }

  return {
    currentStreak: row.current_streak,
    longestStreak: row.longest_streak,
    lastPracticeDate: row.last_practice_date
  };
}

/**
 * Update the study streak (call this when a test is completed)
 */
export async function updateStreak(): Promise<StudyStreak> {
  const db = await getDatabase();
  const today = startOfDay(new Date()).toISOString();

  // Get current streak
  const current = await getStreak();

  let updated: StudyStreak;

  if (!current.lastPracticeDate) {
    // First practice ever
    updated = {
      currentStreak: 1,
      longestStreak: 1,
      lastPracticeDate: today
    };
  } else {
    const lastDate = new Date(current.lastPracticeDate);
    const daysDiff = differenceInDays(new Date(today), lastDate);

    if (daysDiff === 0) {
      // Same day, no change
      return current;
    } else if (daysDiff === 1) {
      // Consecutive day! Increment streak
      const newStreak = current.currentStreak + 1;
      updated = {
        currentStreak: newStreak,
        longestStreak: Math.max(current.longestStreak, newStreak),
        lastPracticeDate: today
      };
    } else {
      // Streak broken, reset to 1
      updated = {
        currentStreak: 1,
        longestStreak: current.longestStreak,
        lastPracticeDate: today
      };
    }
  }

  // Save updated streak
  await db.runAsync(
    `UPDATE study_streak
     SET current_streak = ?, longest_streak = ?, last_practice_date = ?
     WHERE id = 1`,
    [updated.currentStreak, updated.longestStreak, updated.lastPracticeDate]
  );

  return updated;
}

/**
 * Reset the streak (for testing)
 */
export async function resetStreak(): Promise<void> {
  const db = await getDatabase();

  await db.runAsync(
    `UPDATE study_streak
     SET current_streak = 0, longest_streak = 0, last_practice_date = NULL
     WHERE id = 1`
  );
}
