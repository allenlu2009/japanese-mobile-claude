// Mock database for testing
let mockDb: any = null;

export function __setMockDatabase(db: any) {
  mockDb = db;
}

export function __resetMockDatabase() {
  mockDb = null;
}

export async function getDatabase() {
  if (!mockDb) {
    throw new Error('Mock database not initialized. Call __setMockDatabase() in your test.');
  }
  return mockDb;
}

export async function initDatabase() {
  return getDatabase();
}
