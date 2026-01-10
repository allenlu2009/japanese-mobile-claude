import { v4 as uuidv4 } from 'uuid';
import { Test, StorageData } from './types';
import { STORAGE_KEY, STORAGE_VERSION } from './constants';
import { getCharacterAttempts, replaceCharacterAttempts } from './characterStorage';

// Check if localStorage is available
function isLocalStorageAvailable(): boolean {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

// Get all tests from localStorage
export function getTests(): Test[] {
  if (!isLocalStorageAvailable()) {
    console.error('localStorage is not available');
    return [];
  }

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      return [];
    }

    const parsed: StorageData = JSON.parse(data);

    // Validate structure
    if (!parsed.tests || !Array.isArray(parsed.tests)) {
      console.error('Invalid storage data structure');
      return [];
    }

    return parsed.tests;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return [];
  }
}

// Get a single test by ID
export function getTestById(id: string): Test | null {
  const tests = getTests();
  return tests.find(test => test.id === id) || null;
}

// Save all tests to localStorage
export function saveTests(tests: Test[]): boolean {
  if (!isLocalStorageAvailable()) {
    console.error('localStorage is not available');
    return false;
  }

  try {
    const data: StorageData = {
      tests,
      version: STORAGE_VERSION,
      lastUpdated: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      console.error('localStorage quota exceeded');
      alert('Storage limit exceeded. Please delete some tests.');
    } else {
      console.error('Error saving to localStorage:', error);
    }
    return false;
  }
}

// Add a new test
export function addTest(testData: Omit<Test, 'id' | 'createdAt' | 'updatedAt'>): Test | null {
  const tests = getTests();
  const now = new Date().toISOString();

  const newTest: Test = {
    ...testData,
    id: uuidv4(),
    createdAt: now,
    updatedAt: now,
  };

  tests.push(newTest);
  const success = saveTests(tests);

  return success ? newTest : null;
}

// Update an existing test
export function updateTest(id: string, updates: Partial<Omit<Test, 'id' | 'createdAt'>>): Test | null {
  const tests = getTests();
  const index = tests.findIndex(test => test.id === id);

  if (index === -1) {
    console.error('Test not found');
    return null;
  }

  const updatedTest: Test = {
    ...tests[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  tests[index] = updatedTest;
  const success = saveTests(tests);

  return success ? updatedTest : null;
}

// Delete a test
export function deleteTest(id: string): boolean {
  const tests = getTests();
  const filteredTests = tests.filter(test => test.id !== id);

  if (filteredTests.length === tests.length) {
    console.error('Test not found');
    return false;
  }

  return saveTests(filteredTests);
}

// Clear all tests (with confirmation)
export function clearAllTests(): boolean {
  if (!isLocalStorageAvailable()) {
    return false;
  }

  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
}

// Export tests as JSON
export function exportTests(): string {
  const tests = getTests();
  return JSON.stringify(tests, null, 2);
}

// Import tests from JSON
export function importTests(jsonData: string): boolean {
  try {
    const tests = JSON.parse(jsonData);

    if (!Array.isArray(tests)) {
      throw new Error('Invalid data format');
    }

    // Validate each test has required fields
    const validTests = tests.every(test =>
      test.id &&
      test.date &&
      typeof test.score === 'number' &&
      test.category &&
      test.description
    );

    if (!validTests) {
      throw new Error('Invalid test data');
    }

    return saveTests(tests);
  } catch (error) {
    console.error('Error importing tests:', error);
    return false;
  }
}

// Export full app data (tests + character attempts)
export function exportAppData(): string {
  const payload = {
    version: STORAGE_VERSION,
    exportedAt: new Date().toISOString(),
    tests: getTests(),
    characterAttempts: getCharacterAttempts(),
  };

  return JSON.stringify(payload, null, 2);
}

// Import full app data (tests + character attempts)
export function importAppData(jsonData: string): boolean {
  try {
    const parsed = JSON.parse(jsonData);

    // Validate structure
    if (!parsed || !Array.isArray(parsed.tests) || !Array.isArray(parsed.characterAttempts)) {
      throw new Error('Invalid import payload structure');
    }

    // Validate each test has required fields
    const testsValid = parsed.tests.every((test: any) =>
      test.id &&
      test.date &&
      typeof test.score === 'number' &&
      test.category &&
      test.description
    );

    // Validate each character attempt has required fields
    const attemptsValid = parsed.characterAttempts.every((attempt: any) =>
      attempt.id &&
      attempt.testId &&
      attempt.timestamp &&
      attempt.character &&
      attempt.characterType &&
      typeof attempt.userAnswer === 'string' &&
      Array.isArray(attempt.correctAnswers) &&
      typeof attempt.isCorrect === 'boolean' &&
      attempt.questionType
    );

    if (!testsValid || !attemptsValid) {
      throw new Error('Invalid import payload data');
    }

    // Save both datasets
    const savedTests = saveTests(parsed.tests);
    const savedAttempts = replaceCharacterAttempts(parsed.characterAttempts);

    return savedTests && savedAttempts;
  } catch (error) {
    console.error('Error importing app data:', error);
    return false;
  }
}
