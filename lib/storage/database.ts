import * as SQLite from 'expo-sqlite';

const DB_NAME = 'japanese-learning.db';

let db: SQLite.SQLiteDatabase | null = null;

/**
 * Run database migrations
 */
async function runMigrations(database: SQLite.SQLiteDatabase): Promise<void> {
  // Check if category column exists
  const tableInfo = await database.getAllAsync<{ name: string }>(
    `PRAGMA table_info(tests)`
  );

  const hasCategoryColumn = tableInfo.some(col => col.name === 'category');

  if (!hasCategoryColumn) {
    console.log('🔄 Running migration: Adding category column to tests table');
    await database.execAsync(`
      ALTER TABLE tests ADD COLUMN category TEXT NOT NULL DEFAULT 'read';
    `);
    console.log('✅ Migration complete: category column added');
  }

  const hasDescriptionColumn = tableInfo.some(col => col.name === 'description');

  if (!hasDescriptionColumn) {
    console.log('🔄 Running migration: Adding description column to tests table');
    await database.execAsync(`
      ALTER TABLE tests ADD COLUMN description TEXT NOT NULL DEFAULT '';
    `);
    // Update empty descriptions with generated values
    await database.execAsync(`
      UPDATE tests SET description = test_type || ' - ' || score || '%' WHERE description = '';
    `);
    console.log('✅ Migration complete: description column added');
  }
}

/**
 * Initialize the SQLite database and create tables
 */
export async function initDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) {
    return db;
  }

  db = await SQLite.openDatabaseAsync(DB_NAME);

  // Create tables
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    -- Tests table
    CREATE TABLE IF NOT EXISTS tests (
      id TEXT PRIMARY KEY,
      date INTEGER NOT NULL,
      score INTEGER NOT NULL,
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      test_type TEXT NOT NULL,
      jlpt_level TEXT,
      num_questions INTEGER NOT NULL,
      source TEXT DEFAULT 'mobile',
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_tests_date ON tests(date);
    CREATE INDEX IF NOT EXISTS idx_tests_type ON tests(test_type);
    CREATE INDEX IF NOT EXISTS idx_tests_source ON tests(source);

    -- Character attempts table (compatible with web version)
    CREATE TABLE IF NOT EXISTS character_attempts (
      id TEXT PRIMARY KEY,
      test_id TEXT NOT NULL,
      timestamp INTEGER NOT NULL,
      character TEXT NOT NULL,
      script_type TEXT NOT NULL,
      character_type TEXT,
      user_answer TEXT NOT NULL,
      correct_answers TEXT NOT NULL,
      is_correct INTEGER NOT NULL,
      question_type TEXT NOT NULL,
      jlpt_level TEXT,
      reading_type TEXT,
      source TEXT DEFAULT 'mobile',
      FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_attempts_test_id ON character_attempts(test_id);
    CREATE INDEX IF NOT EXISTS idx_attempts_character ON character_attempts(character);
    CREATE INDEX IF NOT EXISTS idx_attempts_script_type ON character_attempts(script_type);
    CREATE INDEX IF NOT EXISTS idx_attempts_timestamp ON character_attempts(timestamp);

    -- Study streak table
    CREATE TABLE IF NOT EXISTS study_streak (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      current_streak INTEGER DEFAULT 0,
      longest_streak INTEGER DEFAULT 0,
      last_practice_date TEXT
    );

    -- Insert default streak record if not exists
    INSERT OR IGNORE INTO study_streak (id, current_streak, longest_streak, last_practice_date)
    VALUES (1, 0, 0, NULL);

    -- Import history table
    CREATE TABLE IF NOT EXISTS import_history (
      id TEXT PRIMARY KEY,
      import_date INTEGER NOT NULL,
      file_name TEXT NOT NULL,
      tests_imported INTEGER NOT NULL,
      attempts_imported INTEGER NOT NULL,
      source TEXT NOT NULL,
      warnings TEXT,
      errors TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_import_date ON import_history(import_date);

    -- App settings (key-value store)
    CREATE TABLE IF NOT EXISTS app_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    -- Insert default settings
    INSERT OR IGNORE INTO app_settings (key, value) VALUES ('audio_enabled', 'true');
    INSERT OR IGNORE INTO app_settings (key, value) VALUES ('auto_play_audio', 'true');
    INSERT OR IGNORE INTO app_settings (key, value) VALUES ('audio_speed', '0.8');
    INSERT OR IGNORE INTO app_settings (key, value) VALUES ('haptic_enabled', 'true');
    INSERT OR IGNORE INTO app_settings (key, value) VALUES ('dark_mode', 'auto');
    INSERT OR IGNORE INTO app_settings (key, value) VALUES ('notifications_enabled', 'true');
    INSERT OR IGNORE INTO app_settings (key, value) VALUES ('reminder_time', '20:00');
  `);

  // Run migrations to update existing databases
  await runMigrations(db);

  console.log('✅ Database initialized successfully');
  return db;
}

/**
 * Get the database instance
 */
export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!db) {
    return await initDatabase();
  }
  return db;
}

/**
 * Close the database connection
 */
export async function closeDatabase(): Promise<void> {
  if (db) {
    await db.closeAsync();
    db = null;
  }
}

/**
 * Reset database (for testing/debugging)
 */
export async function resetDatabase(): Promise<void> {
  if (db) {
    await db.execAsync(`
      DROP TABLE IF EXISTS tests;
      DROP TABLE IF EXISTS character_attempts;
      DROP TABLE IF EXISTS study_streak;
      DROP TABLE IF EXISTS import_history;
      DROP TABLE IF EXISTS app_settings;
    `);
    await closeDatabase();
  }
  await initDatabase();
}
