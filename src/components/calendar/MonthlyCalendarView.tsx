import React, { useState } from 'react';
import { DailyRecord } from '../../types/planner';
import {
  getMonthlyCalendarGrid,
  calculateMonthlyStats,
  WEEKDAYS,
  MONTH_NAMES,
  CalendarDay,
} from '../../utils/calendarUtils';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Trophy,
  ExternalLink,
} from 'lucide-react';

interface MonthlyCalendarViewProps {
  records: Record<string, DailyRecord>;
  onSelectDate: (dateStr: string) => void;
  onOpenGoogleSync: () => void;
}

export const MonthlyCalendarView: React.FC<MonthlyCalendarViewProps> = ({
  records,
  onSelectDate,
  onOpenGoogleSync,
}) => {
  const today = new Date();
  const [viewYear, setViewYear] = useState<number>(today.getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(today.getMonth() + 1);

  const calendarGrid = getMonthlyCalendarGrid(viewYear, viewMonth, records);
  const monthlyStats = calculateMonthlyStats(viewYear, viewMonth, records);

  const handlePrevMonth = () => {
    if (viewMonth === 1) {
      setViewMonth(12);
      setViewYear((prev) => prev - 1);
    } else {
      setViewMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 12) {
      setViewMonth(1);
      setViewYear((prev) => prev + 1);
    } else {
      setViewMonth((prev) => prev + 1);
    }
  };

  const handleResetToCurrentMonth = () => {
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth() + 1);
  };

  return (
    <div className="space-y-6">
      {/* 1. Monthly Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-xs transition-colors">
          <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold block">
            Monthly Average
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
              {monthlyStats.averageProductivity}%
            </span>
            <span className="text-[11px] text-slate-400 font-medium">excl. rest</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-xs transition-colors">
          <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold block">
            Active Study Days
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-slate-800 dark:text-slate-100">
              {monthlyStats.activeStudyDays}
            </span>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
              {monthlyStats.totalTasksCompleted} tasks ✓
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-xs transition-colors">
          <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold block">
            High (🟢) / Mod (🟡)
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
              {monthlyStats.highProductivityDays}
            </span>
            <span className="text-xs text-slate-400">/</span>
            <span className="text-xl font-black text-amber-500 dark:text-amber-400">
              {monthlyStats.moderateProductivityDays}
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-xs transition-colors">
          <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold block">
            100% Perfect Days
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <Trophy className="w-5 h-5 text-amber-500" />
              {monthlyStats.perfectDays}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Main Calendar Grid Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm shadow-slate-200/50 dark:shadow-none transition-colors">
        {/* Month Navigation Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 dark:border-slate-800/80 gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-indigo-500/10 text-emerald-600 dark:text-indigo-400 border border-emerald-200 dark:border-indigo-500/20">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
                {MONTH_NAMES[viewMonth - 1]} {viewYear}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Click any date to open its daily study planner
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevMonth}
              title="Previous Month"
              className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={handleResetToCurrentMonth}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition"
            >
              This Month
            </button>

            <button
              onClick={handleNextMonth}
              title="Next Month"
              className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenGoogleSync}
              className="ml-2 flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Google Calendar</span>
            </button>
          </div>
        </div>

        {/* 3-Level Productivity Heatmap Legend */}
        <div className="flex flex-wrap items-center justify-between gap-3 py-3 text-xs border-b border-slate-100 dark:border-slate-800/60 mb-4">
          <span className="text-slate-500 font-bold">Productivity Heatmap:</span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
              <span className="w-3 h-3 rounded-md bg-emerald-500 border border-emerald-600" />
              High (80–100%)
            </span>
            <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
              <span className="w-3 h-3 rounded-md bg-amber-400 border border-amber-500" />
              Moderate (50–79%)
            </span>
            <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
              <span className="w-3 h-3 rounded-md bg-rose-400 border border-rose-500" />
              Low (&lt; 50%)
            </span>
            <span className="flex items-center gap-1.5 text-slate-400 font-medium">
              <span className="w-3 h-3 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" />
              Rest Day
            </span>
          </div>
        </div>

        {/* Calendar Grid: Weekdays Header */}
        <div className="grid grid-cols-7 gap-2 mb-2 text-center">
          {WEEKDAYS.map((day) => (
            <div key={day} className="text-xs font-bold text-slate-400 py-1 uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid: Days Cells */}
        <div className="grid grid-cols-7 gap-2">
          {calendarGrid.map((day: CalendarDay) => {
            const hasRecord = !!day.record;
            const activeTasks = hasRecord
              ? day.record!.tasks.filter((t) => t.title.trim().length > 0)
              : [];
            const hasActivity = activeTasks.length > 0;
            const score = hasRecord ? day.record!.productivityPercentage : 0;
            const completedCount = activeTasks.filter((t) => t.status === 'completed').length;

            let cellColorStyle =
              'bg-slate-50/80 dark:bg-slate-900/40 border-slate-200/80 dark:border-slate-800/60 text-slate-700 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-600';
            let badgeColorStyle = '';

            if (hasActivity) {
              if (score >= 80) {
                cellColorStyle =
                  'bg-emerald-50/90 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-500/40 hover:border-emerald-400 shadow-xs';
                badgeColorStyle = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/30 font-bold';
              } else if (score >= 50) {
                cellColorStyle =
                  'bg-amber-50/90 dark:bg-amber-950/30 border-amber-300 dark:border-amber-500/40 hover:border-amber-400 shadow-xs';
                badgeColorStyle = 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300 border-amber-300 dark:border-amber-500/30 font-bold';
              } else {
                cellColorStyle =
                  'bg-rose-50/90 dark:bg-rose-950/30 border-rose-300 dark:border-rose-500/40 hover:border-rose-400 shadow-xs';
                badgeColorStyle = 'bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-300 border-rose-300 dark:border-rose-500/30 font-bold';
              }
            }

            return (
              <button
                key={day.dateStr}
                type="button"
                onClick={() => onSelectDate(day.dateStr)}
                className={`relative min-h-[85px] sm:min-h-[100px] p-2.5 rounded-2xl border flex flex-col justify-between text-left transition-all duration-150 group ${cellColorStyle} ${
                  !day.isCurrentMonth ? 'opacity-30' : 'opacity-100'
                } ${day.isToday ? 'ring-2 ring-indigo-500 shadow-md shadow-indigo-500/10' : ''}`}
              >
                {/* Top Row: Day Number + Today Badge */}
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`text-xs sm:text-sm font-extrabold ${
                      day.isToday
                        ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/20 px-2 py-0.5 rounded-lg'
                        : 'text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    {day.dayNumber}
                  </span>

                  {score === 100 && (
                    <Trophy className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  )}
                </div>

                {/* Bottom Row: Productivity Heatmap Badge & Task Count */}
                {hasActivity ? (
                  <div className="mt-2 w-full space-y-1">
                    <div
                      className={`text-[10px] sm:text-xs font-black px-1.5 py-0.5 rounded-lg border text-center ${badgeColorStyle}`}
                    >
                      {score}%
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-between px-0.5 font-medium">
                      <span>{completedCount}/{activeTasks.length} ✓</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-[10px] text-slate-400 dark:text-slate-600 mt-auto">
                    {day.isCurrentMonth ? 'No tasks' : ''}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
