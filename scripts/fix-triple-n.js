#!/usr/bin/env node
/**
 * Fix triple-n (nnn) errors in vocabulary romanji
 *
 * When ん (n) appears before な/に/ぬ/ね/の, it creates a double-n sound,
 * but the romanji should only have TWO n's, not three.
 *
 * Examples:
 * - おんな (o-n-na) → "onna" not "onnna"
 * - あんない (a-n-na-i) → "annai" not "annnai"
 */

const fs = require('fs');
const path = require('path');

const files = [
  path.join(__dirname, '../data/processed/vocabulary-n5.json'),
  path.join(__dirname, '../data/processed/vocabulary-n4.json')
];

files.forEach(filePath => {
  console.log(`\nProcessing: ${filePath}`);

  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let fixCount = 0;

  data.forEach(entry => {
    entry.romanji = entry.romanji.map(romanji => {
      const original = romanji;

      // Replace triple-n (nnn) with double-n (nn)
      // This handles cases where ん + な/に/ぬ/ね/の was incorrectly romanized
      let fixed = romanji.replace(/nnn/g, 'nn');

      if (fixed !== original) {
        console.log(`  ${entry.word} (${entry.kana}): "${original}" → "${fixed}"`);
        fixCount++;
      }

      return fixed;
    });
  });

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`✓ Fixed ${fixCount} entries in ${path.basename(filePath)}`);
});

console.log('\n✓ All triple-n errors fixed!');
