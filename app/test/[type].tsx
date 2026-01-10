import { useState, useEffect, useRef } from 'react';
import { View, Text, SafeAreaView, TextInput, TouchableOpacity, Alert, Keyboard } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { generateQuestions } from '../../lib/testGenerator';
import { generateKatakanaQuestions } from '../../lib/katakanaTestGenerator';
import { generateKanjiQuestions } from '../../lib/kanjiTestGenerator';
import { generateVocabularyQuestions } from '../../lib/vocabularyTestGenerator';
import { saveTest, saveCharacterAttempt } from '../../lib/storage/testStorage';
import { updateStreak } from '../../lib/storage/streakStorage';
import { analyzeAnswer } from '../../lib/answerAnalysis';
import type { TestType } from '../../lib/types';

interface Question {
  id: string;
  characters: string;
  correctAnswers: string[];
  userAnswer?: string;
  isCorrect?: boolean;
}

export default function TestScreen() {
  const params = useLocalSearchParams();
  const testType = (params.type as string || 'hiragana') as TestType;
  const numQuestions = parseInt(params.questions as string || '10');

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [results, setResults] = useState<Array<{ question: Question; userAnswer: string; isCorrect: boolean; }>>([]);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [testStartTime] = useState(Date.now());

  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    loadTest();
  }, []);

  async function loadTest() {
    try {
      let generatedQuestions: Question[];

      switch (testType) {
        case 'hiragana':
          generatedQuestions = generateQuestions('1-char', numQuestions, 'all');
          break;
        case 'katakana':
          generatedQuestions = generateKatakanaQuestions('1-char', numQuestions, 'all');
          break;
        case 'kanji':
          generatedQuestions = await generateKanjiQuestions('n5', numQuestions);
          break;
        case 'vocabulary':
          generatedQuestions = await generateVocabularyQuestions('n5', numQuestions);
          break;
        default:
          generatedQuestions = generateQuestions('1-char', numQuestions, 'all');
      }

      setQuestions(generatedQuestions);
    } catch (error) {
      console.error('Failed to generate test:', error);
      Alert.alert('Error', 'Failed to generate test questions');
      router.back();
    }
  }

  function checkAnswer() {
    if (!answer.trim()) return;

    const currentQuestion = questions[currentIndex];
    const normalized = answer.trim().toLowerCase();
    const isAnswerCorrect = currentQuestion.correctAnswers.some(ans => ans.toLowerCase() === normalized);

    setIsCorrect(isAnswerCorrect);
    setShowResult(true);
    setResults([...results, {
      question: currentQuestion,
      userAnswer: answer.trim(),
      isCorrect: isAnswerCorrect
    }]);

    // Save character attempt for analytics
    saveCharacterAttempt({
      character: currentQuestion.characters,
      userAnswer: answer.trim(),
      correctAnswer: currentQuestion.correctAnswers[0],
      isCorrect: isAnswerCorrect,
      timestamp: Date.now(),
      testType: testType.charAt(0).toUpperCase() + testType.slice(1) as 'Hiragana' | 'Katakana' | 'Kanji' | 'Vocabulary'
    }).catch(err => console.error('Failed to save attempt:', err));
  }

  function nextQuestion() {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setAnswer('');
      setShowResult(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      finishTest();
    }
  }

  async function finishTest() {
    const score = Math.round((results.filter(r => r.isCorrect).length / results.length) * 100);

    try {
      // Save test
      await saveTest({
        id: `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        date: Date.now(),
        score,
        category: 'read',
        description: `${testType.charAt(0).toUpperCase() + testType.slice(1)} Test`,
        testType: testType.charAt(0).toUpperCase() + testType.slice(1) as 'Hiragana' | 'Katakana' | 'Kanji' | 'Vocabulary',
        jlptLevel: null,
        numQuestions: questions.length,
        source: 'mobile',
        createdAt: Date.now(),
        updatedAt: Date.now()
      });

      // Update streak
      await updateStreak();

      // Navigate to results
      router.replace({
        pathname: '/test/results',
        params: {
          score,
          total: questions.length,
          correct: results.filter(r => r.isCorrect).length,
          testType
        }
      });
    } catch (error) {
      console.error('Failed to save test:', error);
      Alert.alert('Error', 'Failed to save test results');
    }
  }

  if (questions.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <Text className="text-slate-500">Loading test...</Text>
      </SafeAreaView>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6 py-8">
        {/* Progress Bar */}
        <View className="mb-6">
          <View className="flex-row justify-between mb-2">
            <Text className="text-sm font-semibold text-slate-700">
              Question {currentIndex + 1} of {questions.length}
            </Text>
            <Text className="text-sm text-slate-500">
              {results.filter(r => r.isCorrect).length} correct
            </Text>
          </View>
          <View className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <View
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </View>
        </View>

        {/* Question */}
        <View className="flex-1 items-center justify-center gap-8">
          <View className="items-center gap-4">
            <Text className="text-sm uppercase tracking-[0.3em] text-slate-400">
              What is the romanji?
            </Text>
            <Text className="text-7xl font-bold text-slate-900">
              {currentQuestion.characters}
            </Text>
          </View>

          {/* Answer Input */}
          <View className="w-full gap-4">
            <TextInput
              ref={inputRef}
              value={answer}
              onChangeText={setAnswer}
              onSubmitEditing={() => {
                if (showResult) {
                  nextQuestion();
                } else {
                  checkAnswer();
                }
              }}
              placeholder="Type your answer"
              autoFocus
              autoCapitalize="none"
              autoCorrect={false}
              editable={!showResult}
              className={`rounded-2xl border-2 ${
                showResult
                  ? isCorrect
                    ? 'border-green-500 bg-green-50'
                    : 'border-red-500 bg-red-50'
                  : 'border-slate-200 bg-white'
              } px-6 py-4 text-center text-2xl text-slate-900`}
            />

            {/* Result Feedback */}
            {showResult && (
              <View className={`rounded-2xl p-4 ${isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
                <Text className={`text-center font-semibold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                  {isCorrect ? '✅ Correct!' : '❌ Incorrect'}
                </Text>
                {!isCorrect && (
                  <Text className="text-center text-slate-600 mt-1">
                    Correct answer: {currentQuestion.correctAnswers.join(' / ')}
                  </Text>
                )}
              </View>
            )}

            {/* Action Button */}
            <TouchableOpacity
              onPress={() => {
                if (showResult) {
                  nextQuestion();
                } else {
                  checkAnswer();
                }
              }}
              disabled={!answer.trim() && !showResult}
              className={`rounded-2xl p-5 ${
                !answer.trim() && !showResult
                  ? 'bg-slate-200'
                  : showResult
                  ? 'bg-blue-500'
                  : 'bg-green-500'
              }`}
            >
              <Text className="text-center text-lg font-semibold text-white">
                {showResult
                  ? currentIndex < questions.length - 1
                    ? '➡️ Next Question'
                    : '🎉 Finish Test'
                  : '✓ Check Answer'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
