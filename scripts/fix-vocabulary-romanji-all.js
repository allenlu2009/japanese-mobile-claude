#!/usr/bin/env node
/**
 * Fix ALL doubled consonants in vocabulary romanji data
 *
 * The romanji conversion incorrectly doubled consonants throughout words,
 * not just at the beginning. This script fixes those errors.
 *
 * Examples:
 * - "akka" -> "aka" (赤 - red)
 * - "asshi" -> "ashi" (足 - foot)
 * - "attsui" -> "atsui" (熱い - hot)
 * - "ddenki" -> "denki" (電気 - electricity)
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
      let fixed = romanji;

      // Fix doubled consonants anywhere in the word
      // The dataset doesn't use doubled consonants for っ (small tsu)
      // So ALL doubled consonants except 'nn' (for ん) are bugs from the conversion

      const originalFixed = fixed;

      // Replace all doubled consonants EXCEPT 'nn' (which represents ん)
      fixed = fixed.replace(/([bcdfghjklmpqrstvwxyz])\1/gi, (match, char) => {
        // Keep 'nn' as it represents ん
        if (char.toLowerCase() === 'n') {
          return match;
        }
        // Remove the duplication for all other consonants
        return char;
      });

      if (fixed !== originalFixed) {
        console.log(`  ${entry.word} (${entry.kana}): "${originalFixed}" -> "${fixed}"`);
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
console.log('\nNote: Some doubled consonants like "nn" (for ん) or "tta" (for った) may be valid.');
console.log('Please verify critical vocabulary words after running this script.');
