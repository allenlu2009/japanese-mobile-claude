import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import * as Sharing from 'expo-sharing';
import { getDatabase } from './database';
import { saveTest, saveCharacterAttempt, getTests, getCharacterAttempts } from './testStorage';
import type { Test, CharacterAttempt } from '../types';

export interface ImportResult {
  testsImported: number;
  attemptsImported: number;
  warnings: string[];
  errors: string[];
  partialImport: boolean;
}

export interface ImportData {
  version?: string;
  exportedAt?: string;
  tests: any[];
  characterAttempts?: any[];
}

export interface ImportHistoryEntry {
  id: string;
  importDate: number;
  fileName: string;
  testsImported: number;
  attemptsImported: number;
  source: string;
  warnings: string | null;
  errors: string | null;
}

/**
 * High-tolerance import parser
 * Gracefully handles partial/malformed data and forwards-compatible with future versions
 */
export async function parseAndImport(jsonString: string, fileName: string): Promise<ImportResult> {
  const warnings: string[] = [];
  const errors: string[] = [];

  try {
    // Parse JSON
    const data: ImportData = JSON.parse(jsonString);

    // Validate version
    if (data.version && data.version !== '1.0') {
      warnings.push(`Different version: ${data.version} (current: 1.0)`);
    }

    // Validate tests
    const tests = data.tests || [];
    if (tests.length === 0) {
      warnings.push('No tests found in import file');
    }

    // Validate character attempts
    const attempts = data.characterAttempts || [];
    if (attempts.length === 0) {
      warnings.push('No character attempts - analytics will be limited');
    }

    // Filter invalid test entries
    const validTests = tests.filter((t: any) => {
      if (!t.id || typeof t.id !== 'string') return false;
      if (typeof t.score !== 'number' || t.score < 0 || t.score > 100) return false;
      if (!t.testType && !t.test_type) return false;
      return true;
    });

    if (validTests.length < tests.length) {
      warnings.push(`${tests.length - validTests.length} invalid tests skipped`);
    }

    // Filter invalid attempt entries
    const validAttempts = attempts.filter((a: any) => {
      if (!a.id || typeof a.id !== 'string') return false;
      if (!a.character || typeof a.character !== 'string') return false;
      if (!a.testId && !a.test_id) return false;
      return true;
    });

    if (validAttempts.length < attempts.length) {
      warnings.push(`${attempts.length - validAttempts.length} invalid attempts skipped`);
    }

    // Insert into database with transaction
    let testsImported = 0;
    let attemptsImported = 0;

    const db = await getDatabase();

    await db.withTransactionAsync(async () => {
      // Import tests (deduplicate by ID)
      for (const test of validTests) {
        try {
          const existing = await db.getFirstAsync(
            'SELECT id FROM tests WHERE id = ?',
            [test.id]
          );

          if (!existing) {
            // Normalize field names (handle both web format and variations)
            const normalizedTest: Test = {
              id: test.id,
              date: test.date ? (typeof test.date === 'string' ? new Date(test.date).getTime() : test.date) : Date.now(),
              score: test.score,
              category: test.category || 'read',
              description: test.description || '',
              testType: test.testType || test.test_type || 'Kana',
              jlptLevel: test.jlptLevel || test.jlpt_level || null,
              numQuestions: test.numQuestions || test.num_questions || 0,
              createdAt: test.createdAt || test.created_at || Date.now(),
              updatedAt: test.updatedAt || test.updated_at || Date.now()
            };

            await saveTest(normalizedTest);
            testsImported++;
          }
        } catch (error) {
          errors.push(`Failed to import test ${test.id}: ${error}`);
        }
      }

      // Import character attempts (deduplicate by ID)
      for (const attempt of validAttempts) {
        try {
          const existing = await db.getFirstAsync(
            'SELECT id FROM character_attempts WHERE id = ?',
            [attempt.id]
          );

          if (!existing) {
            // Normalize field names
            const normalizedAttempt: CharacterAttempt = {
              id: attempt.id,
              testId: attempt.testId || attempt.test_id,
              timestamp: attempt.timestamp ? (typeof attempt.timestamp === 'string' ? new Date(attempt.timestamp).getTime() : attempt.timestamp) : Date.now(),
              character: attempt.character,
              scriptType: attempt.scriptType || attempt.script_type || 'hiragana',
              characterType: attempt.characterType || attempt.character_type || null,
              userAnswer: attempt.userAnswer || attempt.user_answer || '',
              correctAnswers: attempt.correctAnswers || attempt.correct_answers || [],
              isCorrect: attempt.isCorrect !== undefined ? attempt.isCorrect : (attempt.is_correct !== undefined ? attempt.is_correct : false),
              questionType: attempt.questionType || attempt.question_type || '1-char',
              jlptLevel: attempt.jlptLevel || attempt.jlpt_level || null,
              readingType: attempt.readingType || attempt.reading_type || null
            };

            await saveCharacterAttempt(normalizedAttempt);
            attemptsImported++;
          }
        } catch (error) {
          errors.push(`Failed to import attempt ${attempt.id}: ${error}`);
        }
      }
    });

    // Save import history
    const historyId = `import-${Date.now()}`;
    await db.runAsync(
      `INSERT INTO import_history (id, import_date, file_name, tests_imported, attempts_imported, source, warnings, errors)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        historyId,
        Date.now(),
        fileName,
        testsImported,
        attemptsImported,
        'web',
        warnings.length > 0 ? JSON.stringify(warnings) : null,
        errors.length > 0 ? JSON.stringify(errors) : null
      ]
    );

    return {
      testsImported,
      attemptsImported,
      warnings,
      errors,
      partialImport: warnings.length > 0 || errors.length > 0
    };
  } catch (error: any) {
    errors.push(`Parse error: ${error.message}`);
    return {
      testsImported: 0,
      attemptsImported: 0,
      warnings,
      errors,
      partialImport: true
    };
  }
}

/**
 * Import data from a file
 */
export async function importFromFile(): Promise<ImportResult | null> {
  try {
    // Pick JSON file
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/json',
      copyToCacheDirectory: true
    });

    if (result.canceled) {
      return null;
    }

    const fileUri = result.assets[0].uri;
    const fileName = result.assets[0].name;

    // Read file content
    const jsonContent = await FileSystem.readAsStringAsync(fileUri);

    // Parse and import
    return await parseAndImport(jsonContent, fileName);
  } catch (error: any) {
    return {
      testsImported: 0,
      attemptsImported: 0,
      warnings: [],
      errors: [`File read error: ${error.message}`],
      partialImport: true
    };
  }
}

/**
 * Export all data to a JSON file
 */
export async function exportToFile(): Promise<string | null> {
  try {
    // Fetch all data
    const tests = await getTests();
    const attempts = await getCharacterAttempts();

    // Create export data (compatible with web version)
    const exportData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      tests: tests.map(test => ({
        id: test.id,
        date: test.date,
        score: test.score,
        category: test.category,
        description: test.description,
        testType: test.testType,
        jlptLevel: test.jlptLevel,
        numQuestions: test.numQuestions,
        createdAt: test.createdAt,
        updatedAt: test.updatedAt
      })),
      characterAttempts: attempts.map(attempt => ({
        id: attempt.id,
        testId: attempt.testId,
        timestamp: attempt.timestamp,
        character: attempt.character,
        scriptType: attempt.scriptType,
        characterType: attempt.characterType,
        userAnswer: attempt.userAnswer,
        correctAnswers: attempt.correctAnswers,
        isCorrect: attempt.isCorrect,
        questionType: attempt.questionType,
        jlptLevel: attempt.jlptLevel,
        readingType: attempt.readingType
      }))
    };

    // Create filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const filename = `japanese-learning-mobile-${timestamp}.json`;
    const fileUri = FileSystem.documentDirectory + filename;

    // Write to file
    await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(exportData, null, 2));

    // Share file
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'application/json',
        dialogTitle: 'Export Japanese Learning Data',
        UTI: 'public.json'
      });
    }

    return fileUri;
  } catch (error: any) {
    console.error('Export error:', error);
    return null;
  }
}

/**
 * Get import history
 */
export async function getImportHistory(): Promise<ImportHistoryEntry[]> {
  const db = await getDatabase();

  const rows = await db.getAllAsync<any>(
    'SELECT * FROM import_history ORDER BY import_date DESC LIMIT 20'
  );

  return rows.map(row => ({
    id: row.id,
    importDate: row.import_date,
    fileName: row.file_name,
    testsImported: row.tests_imported,
    attemptsImported: row.attempts_imported,
    source: row.source,
    warnings: row.warnings,
    errors: row.errors
  }));
}
