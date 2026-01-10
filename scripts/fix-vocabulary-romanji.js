#!/usr/bin/env node
/**
 * Fix doubled consonants in vocabulary romanji data
 *
 * The romanji conversion incorrectly doubled the first consonant when
 * a word starts with certain kana. This script fixes those errors.
 *
 * Examples:
 * - "ddenki" -> "denki" (電気)
 * - "kkaisha" -> "kaisha" (会社)
 * - "ggaikoku" -> "gaikoku" (外国)
 */

const fs = require('fs');
const path = require('path');

const files = [
  path.join(__dirname, '../data/processed/vocabulary-n5.json'),
  path.join(__dirname, '../data/processed/vocabulary-n4.json')
];

files.forEach(filePath => {
  console.log(`\nProcessing: ${filePath}`);

  // Read the file
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  let fixCount = 0;

  // Fix each vocabulary entry
  data.forEach(entry => {
    entry.romanji = entry.romanji.map(romanji => {
      // Fix doubled consonants at the start
      // Pattern: same consonant repeated (bb, dd, gg, kk, etc.) followed by a vowel
      const fixed = romanji.replace(/^([bcdfghjklmnpqrstvwxyz])\1/i, '$1');

      if (fixed !== romanji) {
        console.log(`  ${entry.word} (${entry.kana}): "${romanji}" -> "${fixed}"`);
        fixCount++;
      }

      return fixed;
    });
  });

  // Write back the fixed data
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');

  console.log(`✓ Fixed ${fixCount} entries in ${path.basename(filePath)}`);
});

console.log('\n✓ All vocabulary romanji fixed!');
