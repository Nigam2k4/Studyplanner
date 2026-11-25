import React, { useState } from 'react';
import { DailyRecord } from '../../types/planner';
import {
  getMonthlyCalendarGrid,
  WEEKDAYS,
  MONTH_NAMES,
  CalendarDay,
} from '../../utils/calendarUtils';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Trophy } from 'lucide-react';

interface SquareCalendarProps {
  records: Record<string, DailyRecord>;
  selectedDate: string;
  onSelectDate: (dateStr: string) => void;
}

export const SquareCalendar: React.FC<SquareCalendarProps> = ({
  records,
  selectedDate,
  onSelectDate,
}) => {
  const [selectedYear, selectedMonth] = selectedDate.split('-').map(Number);
  const [viewYear, setViewYear] = useState<number>(selectedYear || new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(selectedMonth || new Date().getMonth() + 1);

  const calendarGrid = getMonthlyCalendarGrid(viewYear, viewMonth, records);

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

  const handleJumpToCurrent = () => {
    const today = new Date();
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth() + 1);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-xs transition-colors space-y-3.5">
      {/* Calendar Header with compact controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20">
            <CalendarIcon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
              {MONTH_NAMES[viewMonth - 1]} {viewYear}
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Square Heatmap • Click date to load
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handlePrevMonth}
            title="Previous Month"
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleJumpToCurrent}
            className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition"
          >
            This Month
          </button>
          <button
            onClick={handleNextMonth}
            title="Next Month"
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekdays Row */}
      <div className="grid grid-cols-7 gap-1.5 text-center">
        {WEEKDAYS.map((d) => (
          <span
            key={d}
            className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 py-0.5"
          >
            {d[0]}
          </span>
        ))}
      </div>

      {/* Square Tile Grid */}
      <div className="grid grid-cols-7 gap-1.5">
        {calendarGrid.map((day: CalendarDay) => {
          const isSelected = day.dateStr === selectedDate;
          const rec = day.record;
          const activeTasks = rec ? rec.tasks.filter((t) => t.title.trim().length > 0) : [];
          const hasActivity = activeTasks.length > 0;
          const score = rec ? rec.productivityPercentage : 0;

          // Square Tile Heatmap coloring
          let tileStyle =
            'bg-slate-50 dark:bg-slate-950/60 border-slate-200/70 dark:border-slate-800/80 text-slate-700 dark:text-slate-300 hover:border-slate-300';
          let dotColor = '';

          if (hasActivity) {
            if (score >= 80) {
              tileStyle =
                'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-500/40 text-emerald-950 dark:text-emerald-200 font-extrabold';
              dotColor = 'bg-emerald-500';
            } else if (score >= 50) {
              tileStyle =
                'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-500/40 text-amber-950 dark:text-amber-200 font-bold';
              dotColor = 'bg-amber-400';
            } else {
              tileStyle =
                'bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-500/40 text-rose-950 dark:text-rose-200 font-medium';
              dotColor = 'bg-rose-400';
            }
          }

          return (
            <button
              key={day.dateStr}
              type="button"
              onClick={() => onSelectDate(day.dateStr)}
              className={`aspect-square rounded-xl border flex flex-col items-center justify-between p-1 transition-all duration-150 relative group ${tileStyle} ${
                !day.isCurrentMonth ? 'opacity-25' : 'opacity-100'
              } ${
                isSelected
                  ? 'ring-2 ring-indigo-500 border-indigo-500 shadow-sm scale-105 z-10'
                  : ''
              }`}
            >
              <div className="w-full flex items-center justify-between">
                <span
                  className={`text-[11px] leading-none ${
                    day.isToday
                      ? 'font-black text-indigo-600 dark:text-indigo-400 underline decoration-2'
                      : 'font-semibold'
                  }`}
                >
                  {day.dayNumber}
                </span>
                {score === 100 && (
                  <Trophy className="w-2.5 h-2.5 text-amber-500 shrink-0" />
                )}
              </div>

              {/* Heatmap Indicator Dot or Mini % */}
              {hasActivity ? (
                <div className="w-full text-center">
                  <span className="text-[9px] font-black leading-none block">{score}%</span>
                  <span className={`w-1.5 h-1.5 rounded-full inline-block ${dotColor} mt-0.5`} />
                </div>
              ) : (
                <span className="w-1 h-1 rounded-full bg-slate-200 dark:bg-slate-800" />
              )}
            </button>
          );
        })}
      </div>

      {/* Heatmap Legend */}
      <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-2 px-1">
        <span>Heatmap:</span>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
            <span className="w-2 h-2 rounded-sm bg-emerald-500" />
            &ge;80%
          </span>
          <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold">
            <span className="w-2 h-2 rounded-sm bg-amber-400" />
            50-79%
          </span>
          <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400 font-bold">
            <span className="w-2 h-2 rounded-sm bg-rose-400" />
            &lt;50%
          </span>
        </div>
      </div>
    </div>
  );
};
