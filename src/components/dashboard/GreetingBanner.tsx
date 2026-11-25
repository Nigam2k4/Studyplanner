import React from 'react';
import { WeeklyAnalysis } from '../../utils/analyticsUtils';
import { Flame, CheckCircle2, TrendingUp, Sparkles, History } from 'lucide-react';

interface GreetingBannerProps {
  analysis: WeeklyAnalysis;
  selectedDate: string;
}

export const GreetingBanner: React.FC<GreetingBannerProps> = ({ analysis }) => {
  const {
    greetingTitle,
    encouragementMessage,
    weeklyAverage,
    streakDays,
    totalCompletedTasks,
    yesterday,
  } = analysis;

  return (
    <div className="bg-gradient-to-br from-white via-emerald-50/40 to-teal-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950/20 border border-emerald-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-sm shadow-emerald-500/5 relative overflow-hidden transition-all">
      {/* Decorative ambient gradient bubble */}
      <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-emerald-400/10 dark:bg-emerald-500/10 blur-2xl pointer-events-none" />

      {/* Top Row: Personalized Name Greeting & Week Average */}
      <div className="flex items-start justify-between gap-3 relative z-10">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100/80 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              Personal Study Workspace
            </span>

            {/* Yesterday's Performance Pill */}
            <span
              title="Grounded in your yesterday's study tasks"
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                yesterday.hadWork && yesterday.score >= 80
                  ? 'bg-emerald-100/90 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                  : yesterday.hadWork && yesterday.score >= 50
                  ? 'bg-amber-100/90 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                  : yesterday.hadWork
                  ? 'bg-rose-100/90 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300 border-rose-300 dark:border-rose-700'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700'
              }`}
            >
              <History className="w-3 h-3" />
              {yesterday.highlightText}
            </span>

            {streakDays > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100/80 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                <Flame className="w-3 h-3 text-amber-500" />
                {streakDays} Day Streak
              </span>
            )}
          </div>

          <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
            {greetingTitle}
          </h2>
        </div>

        {/* Weekly Average Pill */}
        <div className="text-right shrink-0 bg-white/80 dark:bg-slate-950/80 border border-emerald-200/70 dark:border-slate-800 rounded-2xl px-3 py-1.5 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            7-Day Avg
          </span>
          <span className="text-base font-black text-emerald-600 dark:text-emerald-400 flex items-center justify-end gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            {weeklyAverage}%
          </span>
        </div>
      </div>

      {/* Encouragement Body Grounded in Yesterday's Work */}
      <div className="mt-3 relative z-10 bg-white/70 dark:bg-slate-950/40 p-3.5 rounded-2xl border border-emerald-100/90 dark:border-slate-800/80">
        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
          {encouragementMessage}
        </p>
      </div>

      {/* Mini Stats Footer */}
      <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
        <span className="flex items-center gap-1.5 font-medium">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>{totalCompletedTasks} tasks finished this week</span>
        </span>
        <span className="font-semibold text-emerald-700 dark:text-emerald-400">
          Daily Standard: 5 Tasks • 100% Weightage
        </span>
      </div>
    </div>
  );
};
