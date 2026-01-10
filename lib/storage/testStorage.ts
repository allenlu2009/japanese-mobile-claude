import { getDatabase } from './database';
import type { Test, CharacterAttempt } from '../types';

/**
 * Save a test to the database
 */
export async function saveTest(test: Test): Promise<void> {
  const db = await getDatabase();

  await db.runAsync(
    `INSERT INTO tests (id, date, score, category, description, test_type, jlpt_level, num_questions, source, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      test.id,
      typeof test.date === 'string' ? new Date(test.date).getTime() : test.date,
      test.score,
      test.category,
      test.description,
      test.testType,
      test.jlptLevel || null,
      test.numQuestions,
      'mobile',
      typeof test.createdAt === 'string' ? new Date(test.createdAt).getTime() : test.createdAt,
      typeof test.updatedAt === 'string' ? new Date(test.updatedAt).getTime() : test.updatedAt
    ]
  );
}

/**
 * Save a character attempt to the database
 */
export async function saveCharacterAttempt(attempt: CharacterAttempt): Promise<void> {
  const db = await getDatabase();

  await db.runAsync(
    `INSERT INTO character_attempts (
      id, test_id, timestamp, character, script_type, character_type,
      user_answer, correct_answers, is_correct, question_type,
      jlpt_level, reading_type, source
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      attempt.id,
      attempt.testId,
      typeof attempt.timestamp === 'string' ? new Date(attempt.timestamp).getTime() : attempt.timestamp,
      attempt.character,
      attempt.scriptType,
      attempt.characterType || null,
      attempt.userAnswer,
      JSON.stringify(attempt.correctAnswers),
      attempt.isCorrect ? 1 : 0,
      attempt.questionType,
      attempt.jlptLevel || null,
      attempt.readingType || null,
      'mobile'
    ]
  );
}

/**
 * Get all tests (most recent first)
 */
export async function getTests(): Promise<Test[]> {
  const db = await getDatabase();

  const rows = await db.getAllAsync<any>(
    'SELECT * FROM tests ORDER BY date DESC'
  );

  return rows.map(row => ({
    id: row.id,
    date: row.date,
    score: row.score,
    category: row.category,
    description: row.description,
    testType: row.test_type,
    jlptLevel: row.jlpt_level,
    numQuestions: row.num_questions,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }));
}

/**
 * Get test by ID
 */
export async function getTestById(id: string): Promise<Test | null> {
  const db = await getDatabase();

  const row = await db.getFirstAsync<any>(
    'SELECT * FROM tests WHERE id = ?',
    [id]
  );

  if (!row) return null;

  return {
    id: row.id,
    date: row.date,
    score: row.score,
    category: row.category,
    description: row.description,
    testType: row.test_type,
    jlptLevel: row.jlpt_level,
    numQuestions: row.num_questions,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

/**
 * Get all character attempts
 */
export async function getCharacterAttempts(): Promise<CharacterAttempt[]> {
  const db = await getDatabase();

  const rows = await db.getAllAsync<any>(
    'SELECT * FROM character_attempts ORDER BY timestamp DESC'
  );

  return rows.map(row => ({
    id: row.id,
    testId: row.test_id,
    timestamp: row.timestamp,
    character: row.character,
    scriptType: row.script_type,
    characterType: row.character_type,
    userAnswer: row.user_answer,
    correctAnswers: JSON.parse(row.correct_answers),
    isCorrect: row.is_correct === 1,
    questionType: row.question_type,
    jlptLevel: row.jlpt_level,
    readingType: row.reading_type
  }));
}

/**
 * Get character attempts for a specific test
 */
export async function getCharacterAttemptsForTest(testId: string): Promise<CharacterAttempt[]> {
  const db = await getDatabase();

  const rows = await db.getAllAsync<any>(
    'SELECT * FROM character_attempts WHERE test_id = ? ORDER BY timestamp',
    [testId]
  );

  return rows.map(row => ({
    id: row.id,
    testId: row.test_id,
    timestamp: row.timestamp,
    character: row.character,
    scriptType: row.script_type,
    characterType: row.character_type,
    userAnswer: row.user_answer,
    correctAnswers: JSON.parse(row.correct_answers),
    isCorrect: row.is_correct === 1,
    questionType: row.question_type,
    jlptLevel: row.jlpt_level,
    readingType: row.reading_type
  }));
}

/**
 * Delete a test and its character attempts
 */
export async function deleteTest(testId: string): Promise<void> {
  const db = await getDatabase();

  await db.runAsync('DELETE FROM tests WHERE id = ?', [testId]);
  // Character attempts will be deleted automatically via CASCADE
}

/**
 * Get test count
 */
export async function getTestCount(): Promise<number> {
  const db = await getDatabase();

  const result = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM tests'
  );

  return result?.count || 0;
}

/**
 * Get character attempt count
 */
export async function getCharacterAttemptCount(): Promise<number> {
  const db = await getDatabase();

  const result = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM character_attempts'
  );

  return result?.count || 0;
}
