import { v4 as uuidv4 } from 'uuid';
import { getRandomHiragana, ALL_HIRAGANA, findHiragana } from './hiragana';

export interface Question {
  id: string;
  characters: string;
  correctAnswers: string[];
  userAnswer?: string;
  isCorrect?: boolean;
}

/**
 * Generate random hiragana questions for a test
 * @param testType '1-char' for single characters, '3-char' for three-character combinations
 * @param count Number of questions to generate
 * @param difficulty 'basic' for basic hiragana only, 'all' for all types
 */
export function generateQuestions(
  testType: '1-char' | '3-char',
  count: number,
  difficulty: 'basic' | 'all' = 'all'
): Question[] {
  const questions: Question[] = [];

  if (testType === '1-char') {
    // Get random hiragana characters
    const includeTypes = difficulty === 'basic'
      ? ['basic' as const]
      : ['basic' as const, 'dakuten' as const, 'combo' as const];

    const randomChars = getRandomHiragana(count, includeTypes);

    randomChars.forEach(char => {
      questions.push({
        id: uuidv4(),
        characters: char.hiragana,
        correctAnswers: char.romanji,
        userAnswer: undefined,
        isCorrect: undefined,
      });
    });
  } else if (testType === '3-char') {
    // For 3-char tests, we'll create sequences of 3 random characters
    const includeTypes = difficulty === 'basic'
      ? ['basic' as const]
      : ['basic' as const, 'dakuten' as const, 'combo' as const];

    for (let i = 0; i < count; i++) {
      const threeChars = getRandomHiragana(3, includeTypes);
      const characters = threeChars.map(c => c.hiragana).join('');
      const romanjiParts = threeChars.map(c => c.romanji[0]); // Use first romanji option
      const correctAnswer = romanjiParts.join('');

      // Generate alternative answers by combining all possible romanji variants
      const allCombinations = generateRomanjiCombinations(threeChars);

      questions.push({
        id: uuidv4(),
        characters,
        correctAnswers: allCombinations,
        userAnswer: undefined,
        isCorrect: undefined,
      });
    }
  }

  return questions;
}

/**
 * Generate all possible romanji combinations for a sequence of hiragana characters
 */
function generateRomanjiCombinations(chars: Array<{ romanji: string[] }>): string[] {
  if (chars.length === 0) return [''];
  if (chars.length === 1) return chars[0].romanji;

  const [first, ...rest] = chars;
  const restCombinations = generateRomanjiCombinations(rest);

  const combinations: string[] = [];
  for (const firstOption of first.romanji) {
    for (const restOption of restCombinations) {
      combinations.push(firstOption + restOption);
    }
  }

  return combinations;
}

/**
 * Validate a user's answer against the correct romanji options
 * @param userAnswer The answer provided by the user
 * @param correctAnswers Array of valid romanji answers
 */
export function validateAnswer(userAnswer: string, correctAnswers: string[]): boolean {
  const normalized = userAnswer.toLowerCase().trim();

  // Check if the normalized answer matches any of the correct answers
  return correctAnswers.some(correct => correct.toLowerCase() === normalized);
}

/**
 * Calculate the score as a percentage based on correct answers
 * @param questions Array of questions with user answers
 */
export function calculateScore(questions: Question[]): number {
  if (questions.length === 0) return 0;

  const correctCount = questions.filter(q => q.isCorrect === true).length;
  return Math.round((correctCount / questions.length) * 100);
}

/**
 * Calculate statistics for test results
 */
export function calculateTestStats(questions: Question[]) {
  const total = questions.length;
  const correct = questions.filter(q => q.isCorrect === true).length;
  const incorrect = questions.filter(q => q.isCorrect === false).length;
  const unanswered = questions.filter(q => q.isCorrect === undefined).length;
  const percentage = calculateScore(questions);

  return {
    total,
    correct,
    incorrect,
    unanswered,
    percentage,
  };
}

/**
 * Process a user's answer for a question
 */
export function answerQuestion(
  question: Question,
  userAnswer: string
): Question {
  const isCorrect = validateAnswer(userAnswer, question.correctAnswers);

  return {
    ...question,
    userAnswer: userAnswer.trim(),
    isCorrect,
  };
}
