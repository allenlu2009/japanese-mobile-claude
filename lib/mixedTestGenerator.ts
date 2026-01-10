import { v4 as uuidv4 } from 'uuid';
import { getRandomHiragana } from './hiragana';
import { getRandomKatakana } from './katakana';

export interface Question {
  id: string;
  characters: string;
  correctAnswers: string[];
  userAnswer?: string;
  isCorrect?: boolean;
}

/**
 * Generate random mixed hiragana/katakana questions for a test
 * @param testType '1-char' for single characters, '3-char' for three-character combinations
 * @param count Number of questions to generate
 * @param difficulty 'basic' for basic characters only, 'all' for all types
 */
export function generateMixedQuestions(
  testType: '1-char' | '3-char',
  count: number,
  difficulty: 'basic' | 'all' = 'all'
): Question[] {
  const questions: Question[] = [];

  for (let i = 0; i < count; i++) {
    if (testType === '1-char') {
      // Randomly select Hiragana OR Katakana
      const useHiragana = Math.random() < 0.5;

      if (useHiragana) {
        const includeTypes = difficulty === 'basic'
          ? ['basic' as const]
          : ['basic' as const, 'dakuten' as const, 'combo' as const];
        const chars = getRandomHiragana(1, includeTypes);
        const char = chars[0];

        questions.push({
          id: uuidv4(),
          characters: char.hiragana,
          correctAnswers: char.romanji,
        });
      } else {
        const char = getRandomKatakana(difficulty);

        questions.push({
          id: uuidv4(),
          characters: char.katakana,
          correctAnswers: char.romanji,
        });
      }
    } else {
      // 3-char: All Hiragana OR all Katakana (per question)
      const useHiragana = Math.random() < 0.5;

      if (useHiragana) {
        const includeTypes = difficulty === 'basic'
          ? ['basic' as const]
          : ['basic' as const, 'dakuten' as const, 'combo' as const];
        const threeChars = getRandomHiragana(3, includeTypes);

        const char1 = threeChars[0];
        const char2 = threeChars[1];
        const char3 = threeChars[2];
        const sequence = char1.hiragana + char2.hiragana + char3.hiragana;

        const combinations = generateRomanjiCombinations([
          char1.romanji,
          char2.romanji,
          char3.romanji
        ]);

        questions.push({
          id: uuidv4(),
          characters: sequence,
          correctAnswers: combinations,
        });
      } else {
        const char1 = getRandomKatakana(difficulty);
        const char2 = getRandomKatakana(difficulty);
        const char3 = getRandomKatakana(difficulty);
        const sequence = char1.katakana + char2.katakana + char3.katakana;

        const combinations = generateRomanjiCombinations([
          char1.romanji,
          char2.romanji,
          char3.romanji
        ]);

        questions.push({
          id: uuidv4(),
          characters: sequence,
          correctAnswers: combinations,
        });
      }
    }
  }

  return questions;
}

function generateRomanjiCombinations(romanjiArrays: string[][]): string[] {
  if (romanjiArrays.length === 0) return [''];
  if (romanjiArrays.length === 1) return romanjiArrays[0];

  const [first, ...rest] = romanjiArrays;
  const restCombinations = generateRomanjiCombinations(rest);

  const result: string[] = [];
  for (const firstOption of first) {
    for (const restOption of restCombinations) {
      result.push(firstOption + restOption);
    }
  }
  return result;
}
