import { v4 as uuidv4 } from 'uuid';
import { getRandomKatakana, findKatakana } from './katakana';

export interface Question {
  id: string;
  characters: string;
  correctAnswers: string[];
  userAnswer?: string;
  isCorrect?: boolean;
}

/**
 * Generate random katakana questions for a test
 * @param testType '1-char' for single characters, '3-char' for three-character combinations
 * @param count Number of questions to generate
 * @param difficulty 'basic' for basic katakana only, 'all' for all types
 */
export function generateKatakanaQuestions(
  testType: '1-char' | '3-char',
  count: number,
  difficulty: 'basic' | 'all' = 'all'
): Question[] {
  const questions: Question[] = [];

  for (let i = 0; i < count; i++) {
    if (testType === '1-char') {
      const katakana = getRandomKatakana(difficulty);
      questions.push({
        id: uuidv4(),
        characters: katakana.katakana,
        correctAnswers: katakana.romanji,
      });
    } else {
      // 3-char: generate sequence
      const char1 = getRandomKatakana(difficulty);
      const char2 = getRandomKatakana(difficulty);
      const char3 = getRandomKatakana(difficulty);
      const sequence = char1.katakana + char2.katakana + char3.katakana;

      // Generate all romanji combinations
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

export function validateKatakanaAnswer(
  userAnswer: string,
  correctAnswers: string[]
): boolean {
  const normalized = userAnswer.toLowerCase().trim();
  return correctAnswers.some(answer => answer.toLowerCase() === normalized);
}
