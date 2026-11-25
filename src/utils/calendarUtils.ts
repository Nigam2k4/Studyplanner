import { DailyRecord } from '../types/planner';
import { getTodayString } from './dateUtils';

export interface CalendarDay {
  dateStr: string; // YYYY-MM-DD
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  record?: DailyRecord;
}

export interface MonthlyStats {
  activeStudyDays: number;
  averageProductivity: number; // Excludes 0-task days
  highProductivityDays: number; // >= 80%
  moderateProductivityDays: number; // 50-79%
  lowProductivityDays: number; // < 50%
  perfectDays: number; // 100%
  totalTasksCompleted: number;
}

export const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/**
 * Generates all 35-42 calendar cells for the selected year and month (1-indexed: 1 = Jan, 12 = Dec).
 * Monday is the first day of the week.
 */
export function getMonthlyCalendarGrid(
  year: number,
  month: number,
  records: Record<string, DailyRecord>
): CalendarDay[] {
  const todayStr = getTodayString();
  const daysInMonth = new Date(year, month, 0).getDate();

  // First day of current month (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const firstDayWeekday = new Date(year, month - 1, 1).getDay();
  // Adjust so Monday = 0, Sunday = 6
  const startOffset = (firstDayWeekday + 6) % 7;

  // Previous month days to pad beginning of row
  const daysInPrevMonth = new Date(year, month - 1, 0).getDate();
  const prevMonthDays: CalendarDay[] = [];
  for (let i = startOffset - 1; i >= 0; i--) {
    const dayNum = daysInPrevMonth - i;
    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;
    const dateStr = `${prevYear}-${String(prevMonth).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    prevMonthDays.push({
      dateStr,
      dayNumber: dayNum,
      isCurrentMonth: false,
      isToday: dateStr === todayStr,
      record: records[dateStr],
    });
  }

  // Current month days
  const currentMonthDays: CalendarDay[] = [];
  for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    currentMonthDays.push({
      dateStr,
      dayNumber: dayNum,
      isCurrentMonth: true,
      isToday: dateStr === todayStr,
      record: records[dateStr],
    });
  }

  // Next month days to pad end of last row
  const totalSlots = Math.ceil((prevMonthDays.length + currentMonthDays.length) / 7) * 7;
  const remainingSlots = totalSlots - (prevMonthDays.length + currentMonthDays.length);
  const nextMonthDays: CalendarDay[] = [];
  for (let dayNum = 1; dayNum <= remainingSlots; dayNum++) {
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;
    const dateStr = `${nextYear}-${String(nextMonth).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    nextMonthDays.push({
      dateStr,
      dayNumber: dayNum,
      isCurrentMonth: false,
      isToday: dateStr === todayStr,
      record: records[dateStr],
    });
  }

  return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
}

/**
 * Calculates monthly performance statistics according to requirements:
 * - Excludes days with zero tasks from the average.
 */
export function calculateMonthlyStats(
  year: number,
  month: number,
  records: Record<string, DailyRecord>
): MonthlyStats {
  const prefix = `${year}-${String(month).padStart(2, '0')}`;
  let activeStudyDays = 0;
  let scoreSum = 0;
  let highProductivityDays = 0;
  let moderateProductivityDays = 0;
  let lowProductivityDays = 0;
  let perfectDays = 0;
  let totalTasksCompleted = 0;

  for (const [dateStr, rec] of Object.entries(records)) {
    if (dateStr.startsWith(prefix)) {
      const activeTasks = rec.tasks.filter((t) => t.title.trim().length > 0);
      if (activeTasks.length > 0) {
        activeStudyDays++;
        scoreSum += rec.productivityPercentage;
        totalTasksCompleted += activeTasks.filter((t) => t.status === 'completed').length;

        if (rec.productivityPercentage >= 80) {
          highProductivityDays++;
          if (rec.productivityPercentage === 100) {
            perfectDays++;
          }
        } else if (rec.productivityPercentage >= 50) {
          moderateProductivityDays++;
        } else {
          lowProductivityDays++;
        }
      }
    }
  }

  const averageProductivity =
    activeStudyDays > 0 ? Math.round((scoreSum / activeStudyDays) * 10) / 10 : 0;

  return {
    activeStudyDays,
    averageProductivity,
    highProductivityDays,
    moderateProductivityDays,
    lowProductivityDays,
    perfectDays,
    totalTasksCompleted,
  };
}
