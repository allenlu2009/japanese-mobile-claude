import { Test, CategoryStats, OverallStats, MonthlyScore, TestCategory } from './types';
import { CATEGORIES } from './constants';

// Calculate category statistics
export function calculateCategoryStats(tests: Test[]): CategoryStats[] {
  return CATEGORIES.map(category => {
    const categoryTests = tests.filter(test => test.category === category);
    const count = categoryTests.length;

    if (count === 0) {
      return {
        category,
        count: 0,
        averageScore: 0,
        highestScore: 0,
        lowestScore: 0,
        trend: 'stable' as const,
      };
    }

    const scores = categoryTests.map(test => test.score);
    const averageScore = Math.round(scores.reduce((sum, score) => sum + score, 0) / count);
    const highestScore = Math.max(...scores);
    const lowestScore = Math.min(...scores);

    // Calculate trend (compare last 3 tests with previous 3)
    const trend = calculateTrend(categoryTests);

    return {
      category,
      count,
      averageScore,
      highestScore,
      lowestScore,
      trend,
    };
  });
}

// Calculate trend for a category
function calculateTrend(tests: Test[]): 'up' | 'down' | 'stable' {
  if (tests.length < 4) return 'stable';

  // Sort by date
  const sorted = [...tests].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const half = Math.floor(sorted.length / 2);
  const firstHalf = sorted.slice(0, half);
  const secondHalf = sorted.slice(-half);

  const firstAvg = firstHalf.reduce((sum, test) => sum + test.score, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((sum, test) => sum + test.score, 0) / secondHalf.length;

  const diff = secondAvg - firstAvg;

  if (diff > 5) return 'up';
  if (diff < -5) return 'down';
  return 'stable';
}

// Calculate monthly scores
export function calculateMonthlyScores(tests: Test[]): MonthlyScore[] {
  const monthlyData: Record<string, { total: number; count: number }> = {};

  tests.forEach(test => {
    const date = new Date(test.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { total: 0, count: 0 };
    }

    monthlyData[monthKey].total += test.score;
    monthlyData[monthKey].count += 1;
  });

  return Object.entries(monthlyData)
    .map(([month, data]) => ({
      month,
      averageScore: Math.round(data.total / data.count),
      testCount: data.count,
    }))
    .sort((a, b) => a.month.localeCompare(b.month));
}

// Calculate overall statistics
export function calculateOverallStats(tests: Test[]): OverallStats {
  const totalTests = tests.length;

  if (totalTests === 0) {
    return {
      totalTests: 0,
      averageScore: 0,
      categoryStats: calculateCategoryStats([]),
      recentTests: [],
      scoresByMonth: [],
    };
  }

  const averageScore = Math.round(
    tests.reduce((sum, test) => sum + test.score, 0) / totalTests
  );

  const categoryStats = calculateCategoryStats(tests);

  // Get recent tests (last 10, sorted by date descending)
  const recentTests = [...tests]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  const scoresByMonth = calculateMonthlyScores(tests);

  return {
    totalTests,
    averageScore,
    categoryStats,
    recentTests,
    scoresByMonth,
  };
}

// Get stats for a specific category
export function getCategoryStats(tests: Test[], category: TestCategory): CategoryStats {
  const categoryTests = tests.filter(test => test.category === category);
  const stats = calculateCategoryStats(categoryTests);
  return stats.find(s => s.category === category) || {
    category,
    count: 0,
    averageScore: 0,
    highestScore: 0,
    lowestScore: 0,
    trend: 'stable' as const,
  };
}

// Calculate progress percentage (improvement from first to last test)
export function calculateProgress(tests: Test[]): number {
  if (tests.length < 2) return 0;

  const sorted = [...tests].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const firstScore = sorted[0].score;
  const lastScore = sorted[sorted.length - 1].score;

  if (firstScore === 0) return 0;

  return Math.round(((lastScore - firstScore) / firstScore) * 100);
}
