#!/usr/bin/env node
/**
 * Debug script for mobile data import/export
 *
 * Usage:
 *   node scripts/debug-import-export.js export <output-file>
 *   node scripts/debug-import-export.js import <input-file>
 *   node scripts/debug-import-export.js validate <file>
 */

const fs = require('fs');
const path = require('path');

function validateV1Format(data) {
  const errors = [];
  const warnings = [];

  // Check version
  if (data.version !== '1.0') {
    errors.push(`Invalid version: ${data.version} (expected "1.0")`);
  }

  // Check required top-level fields
  const requiredFields = ['version', 'exportedAt', 'tests', 'attempts', 'settings', 'meta'];
  for (const field of requiredFields) {
    if (!(field in data)) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  // Check meta object
  if (data.meta) {
    if (!data.meta.exportedBy) {
      errors.push('meta.exportedBy is required');
    }
    if (!data.meta.platform) {
      errors.push('meta.platform is required');
    }
  }

  // Validate tests
  if (Array.isArray(data.tests)) {
    data.tests.forEach((test, idx) => {
      const requiredTestFields = ['id', 'timestamp', 'testType', 'score', 'totalQuestions', 'correctAnswers'];
      requiredTestFields.forEach(field => {
        if (!(field in test)) {
          errors.push(`Test ${idx} missing required field: ${field}`);
        }
      });

      if (typeof test.score !== 'number' || test.score < 0 || test.score > 100) {
        errors.push(`Test ${idx} has invalid score: ${test.score}`);
      }
    });
  }

  // Validate attempts
  if (Array.isArray(data.attempts)) {
    data.attempts.forEach((attempt, idx) => {
      const requiredAttemptFields = ['id', 'testId', 'timestamp', 'prompt', 'expected', 'response', 'correct'];
      requiredAttemptFields.forEach(field => {
        if (!(field in attempt)) {
          errors.push(`Attempt ${idx} missing required field: ${field}`);
        }
      });

      if (!Array.isArray(attempt.expected)) {
        errors.push(`Attempt ${idx} expected should be an array`);
      }

      if (typeof attempt.correct !== 'boolean') {
        errors.push(`Attempt ${idx} correct should be a boolean`);
      }
    });
  }

  return { errors, warnings };
}

function showMobileSchemaMapping(data) {
  console.log('\n📋 Mobile Database Schema Mapping:\n');

  if (data.tests && data.tests.length > 0) {
    const test = data.tests[0];
    console.log('Test Record (v1.0 → Mobile DB):');
    console.log(`  id: "${test.id}" → id`);
    console.log(`  timestamp: "${test.timestamp}" → date (epoch: ${new Date(test.timestamp).getTime()})`);
    console.log(`  testType: "${test.testType}" → test_type`);
    console.log(`  score: ${test.score} → score`);
    console.log(`  totalQuestions: ${test.totalQuestions} → num_questions`);
    console.log(`  (missing) → category: "read" (default)`);
    console.log(`  (missing) → description: "${test.testType} - ${test.score}%" (generated)`);
    console.log(`  timestamp → created_at (epoch: ${new Date(test.timestamp).getTime()})`);
    console.log(`  (current time) → updated_at`);
  }

  if (data.attempts && data.attempts.length > 0) {
    const attempt = data.attempts[0];
    console.log('\nAttempt Record (v1.0 → Mobile DB):');
    console.log(`  id: "${attempt.id}" → id`);
    console.log(`  testId: "${attempt.testId}" → test_id`);
    console.log(`  timestamp: "${attempt.timestamp}" → timestamp (epoch: ${new Date(attempt.timestamp).getTime()})`);
    console.log(`  prompt: "${attempt.prompt}" → character`);
    console.log(`  expected: [${attempt.expected.join(', ')}] → correct_answers (JSON string)`);
    console.log(`  response: "${attempt.response}" → user_answer`);
    console.log(`  correct: ${attempt.correct} → is_correct (${attempt.correct ? 1 : 0})`);
    console.log(`  scriptType: "${attempt.scriptType || 'hiragana'}" → script_type`);
    console.log(`  (missing) → question_type: "1-char" (default)`);
    console.log(`  (missing) → source: "mobile" (default)`);
  }
}

function analyzeExport(filePath) {
  console.log('🔍 Analyzing Export File\n');
  console.log('File:', filePath);

  if (!fs.existsSync(filePath)) {
    console.error('❌ File not found');
    process.exit(1);
  }

  const content = fs.readFileSync(filePath, 'utf8');
  console.log('Size:', (content.length / 1024).toFixed(2), 'KB');

  let data;
  try {
    data = JSON.parse(content);
  } catch (error) {
    console.error('❌ Invalid JSON:', error.message);
    process.exit(1);
  }

  console.log('\n📊 Content Summary:');
  console.log('  Version:', data.version);
  console.log('  Exported At:', data.exportedAt);
  console.log('  Tests:', data.tests?.length || 0);
  console.log('  Attempts:', data.attempts?.length || 0);
  console.log('  Exported By:', data.meta?.exportedBy);
  console.log('  Platform:', data.meta?.platform);

  // Validate
  const { errors, warnings } = validateV1Format(data);

  if (errors.length > 0) {
    console.log('\n❌ Validation Errors:');
    errors.forEach(err => console.log('  -', err));
  }

  if (warnings.length > 0) {
    console.log('\n⚠️  Warnings:');
    warnings.forEach(warn => console.log('  -', warn));
  }

  if (errors.length === 0) {
    console.log('\n✅ Valid v1.0 format');
    showMobileSchemaMapping(data);
  }

  // Test type distribution
  if (data.tests && data.tests.length > 0) {
    console.log('\n📈 Test Type Distribution:');
    const typeCount = {};
    data.tests.forEach(test => {
      typeCount[test.testType] = (typeCount[test.testType] || 0) + 1;
    });
    Object.entries(typeCount).forEach(([type, count]) => {
      console.log(`  ${type}: ${count}`);
    });
  }

  // Score statistics
  if (data.tests && data.tests.length > 0) {
    console.log('\n📊 Score Statistics:');
    const scores = data.tests.map(t => t.score);
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    const min = Math.min(...scores);
    const max = Math.max(...scores);
    console.log(`  Average: ${avg.toFixed(1)}%`);
    console.log(`  Range: ${min}% - ${max}%`);
  }

  // Date range
  if (data.tests && data.tests.length > 0) {
    console.log('\n📅 Date Range:');
    const dates = data.tests.map(t => new Date(t.timestamp)).sort((a, b) => a - b);
    console.log(`  First test: ${dates[0].toISOString()}`);
    console.log(`  Last test: ${dates[dates.length - 1].toISOString()}`);
  }

  return { data, errors, warnings };
}

function compareSchemas() {
  console.log('🔍 Schema Comparison: Web vs Mobile\n');

  console.log('═'.repeat(70));
  console.log('WEB (localStorage - No schema constraints)');
  console.log('═'.repeat(70));
  console.log('Storage: Browser localStorage (JSON)');
  console.log('Schema: Flexible - any JSON structure');
  console.log('Issues: None - no database constraints');
  console.log('\nCharacterAttempt type:');
  console.log('  - id, testId, timestamp, character, scriptType');
  console.log('  - userAnswer, correctAnswers, isCorrect');
  console.log('  - questionType, jlptLevel, readingType, characterType');
  console.log('\nExport: Direct JSON.stringify() of attempts array');
  console.log('Import: Direct JSON.parse() into localStorage');

  console.log('\n═'.repeat(70));
  console.log('MOBILE (SQLite - Strict schema with migrations)');
  console.log('═'.repeat(70));
  console.log('Storage: SQLite database on device');
  console.log('Schema: Strict - column types, NOT NULL constraints');
  console.log('Issues: Schema migrations needed for old databases');
  console.log('\nTables:');
  console.log('  tests: id, date, score, category, description, test_type,');
  console.log('         jlpt_level, num_questions, source, created_at, updated_at');
  console.log('  character_attempts: id, test_id, timestamp, character, script_type,');
  console.log('         character_type, user_answer, correct_answers, is_correct,');
  console.log('         question_type, jlpt_level, reading_type, source');
  console.log('\nExport: Query SQLite → Transform to v1.0 format');
  console.log('Import: Parse v1.0 → Transform → INSERT into SQLite');
  console.log('\n⚠️  Migration Challenges:');
  console.log('  1. Old databases may have different column names');
  console.log('  2. NOT NULL constraints require default values');
  console.log('  3. Column renames require table rebuild');
  console.log('  4. Foreign key constraints during migration');

  console.log('\n═'.repeat(70));
  console.log('UNIVERSAL v1.0 FORMAT (Cross-platform interchange)');
  console.log('═'.repeat(70));
  console.log('Tests: id, timestamp, testType, score, totalQuestions, correctAnswers');
  console.log('Attempts: id, testId, timestamp, prompt, expected, response, correct');
  console.log('\n✅ Both platforms export to and import from this format');
}

// Main CLI
const command = process.argv[2];
const filePath = process.argv[3];

if (!command) {
  console.log('Usage:');
  console.log('  node scripts/debug-import-export.js validate <file>');
  console.log('  node scripts/debug-import-export.js compare');
  console.log('\nExamples:');
  console.log('  node scripts/debug-import-export.js validate ~/gdrive/Work/japanese-tests-1768574678612.json');
  console.log('  node scripts/debug-import-export.js compare');
  process.exit(1);
}

if (command === 'validate') {
  if (!filePath) {
    console.error('❌ Please provide a file path');
    process.exit(1);
  }
  analyzeExport(filePath);
} else if (command === 'compare') {
  compareSchemas();
} else {
  console.error('❌ Unknown command:', command);
  process.exit(1);
}
