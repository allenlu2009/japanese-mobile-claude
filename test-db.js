// Quick test script to validate database operations
const SQLite = require('expo-sqlite');

async function testDatabase() {
  console.log('🧪 Testing database operations...\n');

  try {
    // Open database
    const db = await SQLite.openDatabaseAsync('test-japanese.db');
    console.log('✅ Database opened');

    // Create tables
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS tests (
        id TEXT PRIMARY KEY,
        date INTEGER NOT NULL,
        score INTEGER NOT NULL,
        test_type TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS character_attempts (
        id TEXT PRIMARY KEY,
        test_id TEXT NOT NULL,
        character TEXT NOT NULL,
        is_correct INTEGER NOT NULL,
        FOREIGN KEY (test_id) REFERENCES tests(id)
      );
    `);
    console.log('✅ Tables created');

    // Insert test
    const testId = 'test_' + Date.now();
    await db.runAsync(
      'INSERT INTO tests (id, date, score, test_type) VALUES (?, ?, ?, ?)',
      [testId, Date.now(), 85, 'Hiragana']
    );
    console.log('✅ Test inserted:', testId);

    // Insert character attempt
    const attemptId = 'attempt_' + Date.now();
    await db.runAsync(
      'INSERT INTO character_attempts (id, test_id, character, is_correct) VALUES (?, ?, ?, ?)',
      [attemptId, testId, 'あ', 1]
    );
    console.log('✅ Character attempt inserted:', attemptId);

    // Query data
    const tests = await db.getAllAsync('SELECT * FROM tests');
    const attempts = await db.getAllAsync('SELECT * FROM character_attempts');

    console.log('\n📊 Tests:', tests.length);
    console.log('📊 Attempts:', attempts.length);

    // Cleanup
    await db.execAsync('DROP TABLE character_attempts; DROP TABLE tests;');
    console.log('\n✅ All database operations successful!');

  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    process.exit(1);
  }
}

testDatabase();
