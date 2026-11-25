import { DailyRecord } from '../types/planner';
import { getTodayString, addDays } from './dateUtils';

export interface DaySlopePoint {
  dateStr: string;
  dayLabel: string; // e.g. 'Thu 20'
  shortDay: string; // 'Thu'
  dayNumber: number;
  completedWeightScore: number; // 0 to 100% normalized weight completed
  rawCompletedWeight: number; // Raw sum of completed weights
  rawTotalWeight: number; // Raw total weight of entered tasks
  completedTasksCount: number;
  activeTasksCount: number;
  slopeDelta: number; // difference from previous day (+ or -)
  isSelected: boolean;
  isToday: boolean;
  hasActivity: boolean;
}

export interface YesterdayStat {
  dateStr: string;
  score: number;
  completedTasks: number;
  totalTasks: number;
  hadWork: boolean;
  highlightText: string;
}

export interface WeeklyAnalysis {
  last7Days: DaySlopePoint[];
  weeklyAverage: number;
  streakDays: number;
  totalCompletedTasks: number;
  greetingTitle: string;
  encouragementMessage: string;
  yesterday: YesterdayStat;
}

/**
 * Returns trailing last 7 days ending on targetDateStr.
 */
export function getLast7DaysSlopeData(
  targetDateStr: string,
  records: Record<string, DailyRecord>
): DaySlopePoint[] {
  const todayStr = getTodayString();
  const points: DaySlopePoint[] = [];

  const shortDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  for (let i = 6; i >= 0; i--) {
    const dStr = addDays(targetDateStr, -i);
    const [y, m, d] = dStr.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    const dayOfWeek = shortDays[dateObj.getDay()];

    const rec = records[dStr];
    const activeTasks = rec ? rec.tasks.filter((t) => t.title.trim().length > 0) : [];
    const completedTasks = activeTasks.filter((t) => t.status === 'completed');

    const rawTotalWeight = activeTasks.reduce((sum, t) => sum + (t.rawWeight || 1), 0);
    const rawCompletedWeight = completedTasks.reduce((sum, t) => sum + (t.rawWeight || 1), 0);
    const completedWeightScore = rec ? rec.productivityPercentage : 0;

    points.push({
      dateStr: dStr,
      dayLabel: `${dayOfWeek} ${d}`,
      shortDay: dayOfWeek,
      dayNumber: d,
      completedWeightScore,
      rawCompletedWeight,
      rawTotalWeight,
      completedTasksCount: completedTasks.length,
      activeTasksCount: activeTasks.length,
      slopeDelta: 0,
      isSelected: dStr === targetDateStr,
      isToday: dStr === todayStr,
      hasActivity: activeTasks.length > 0,
    });
  }

  // Calculate slopes (delta from previous day)
  for (let i = 1; i < points.length; i++) {
    points[i].slopeDelta =
      Math.round((points[i].completedWeightScore - points[i - 1].completedWeightScore) * 10) / 10;
  }

  return points;
}

export function analyzeWeeklyPerformance(
  targetDateStr: string,
  records: Record<string, DailyRecord>,
  userName: string = 'Scholar'
): WeeklyAnalysis {
  const last7Days = getLast7DaysSlopeData(targetDateStr, records);

  const activeDays = last7Days.filter((d) => d.hasActivity);
  const totalCompletedTasks = activeDays.reduce((sum, d) => sum + d.completedTasksCount, 0);

  const scoreSum = activeDays.reduce((sum, d) => sum + d.completedWeightScore, 0);
  const weeklyAverage =
    activeDays.length > 0 ? Math.round((scoreSum / activeDays.length) * 10) / 10 : 0;

  // Streak calculation
  let streakDays = 0;
  const todayStr = getTodayString();
  const sortedDates = Object.keys(records).sort().reverse();
  for (const d of sortedDates) {
    if (d <= todayStr) {
      const rec = records[d];
      const hasCompleted = rec.tasks.some((t) => t.status === 'completed');
      if (hasCompleted) {
        streakDays++;
      } else if (d < todayStr) {
        break;
      }
    }
  }

  // 1. Personalized Greeting with User's Name and Time of Day
  const currentHour = new Date().getHours();
  let timeGreeting = 'Good morning';
  if (currentHour >= 12 && currentHour < 17) {
    timeGreeting = 'Good afternoon';
  } else if (currentHour >= 17) {
    timeGreeting = 'Good evening';
  }

  const cleanName = userName && userName.trim() ? userName.trim() : 'Scholar';
  const greetingTitle = `${timeGreeting}, ${cleanName}! 👋`;

  // 2. Yesterday's Work Evaluation & Grounded Motivation
  const yesterdayDateStr = addDays(targetDateStr, -1);
  const yesterdayRecord = records[yesterdayDateStr];
  const yesterdayActive = yesterdayRecord
    ? yesterdayRecord.tasks.filter((t) => t.title.trim().length > 0)
    : [];
  const yesterdayCompleted = yesterdayActive.filter((t) => t.status === 'completed').length;
  const yesterdayScore = yesterdayRecord ? yesterdayRecord.productivityPercentage : 0;
  const hadYesterdayWork = yesterdayActive.length > 0;

  let highlightText = '';
  let encouragementMessage = '';

  if (hadYesterdayWork) {
    if (yesterdayScore === 100) {
      highlightText = `Yesterday: 100% Perfect Day (${yesterdayActive.length}/${yesterdayActive.length} ✓)`;
      encouragementMessage = `🔥 You crushed yesterday with an unbeatable 100% score! The mission today, ${cleanName}, is to protect that elite streak. Let's conquer today's 5 aims!`;
    } else if (yesterdayScore >= 80) {
      highlightText = `Yesterday: ${yesterdayScore}% High Zone (${yesterdayCompleted}/${yesterdayActive.length} ✓)`;
      encouragementMessage = `⚡ Fantastic focus yesterday (${yesterdayScore}% completed)! You're in an exceptional groove. Carry that winning momentum into today's first task.`;
    } else if (yesterdayScore >= 50) {
      highlightText = `Yesterday: ${yesterdayScore}% Steady Progress (${yesterdayCompleted}/${yesterdayActive.length} ✓)`;
      encouragementMessage = `📈 Solid foundation laid yesterday with ${yesterdayScore}% productivity. Today is your day, ${cleanName}, to push into the 80%+ High Zone!`;
    } else {
      highlightText = `Yesterday: ${yesterdayScore}% (${yesterdayCompleted}/${yesterdayActive.length} ✓)`;
      encouragementMessage = `💪 Yesterday had some roadblocks (${yesterdayScore}%), but champions reset fast. Today is a fresh slate, ${cleanName}—start strong with Aim #1!`;
    }
  } else {
    highlightText = `Yesterday: Rest & Recovery`;
    encouragementMessage = `🌱 Recharged and ready, ${cleanName}! Now that your mind is rested from yesterday, let's attack today's 5 study aims with clarity and purpose.`;
  }

  return {
    last7Days,
    weeklyAverage,
    totalCompletedTasks,
    streakDays,
    greetingTitle,
    encouragementMessage,
    yesterday: {
      dateStr: yesterdayDateStr,
      score: yesterdayScore,
      completedTasks: yesterdayCompleted,
      totalTasks: yesterdayActive.length,
      hadWork: hadYesterdayWork,
      highlightText,
    },
  };
}
