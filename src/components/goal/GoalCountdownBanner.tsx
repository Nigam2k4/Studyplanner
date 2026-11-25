import React from 'react';
import { GoalTarget } from '../../types/planner';
import { calculateRemainingTime } from '../../utils/countdownUtils';
import { Target, Clock, Edit3, Sparkles } from 'lucide-react';

interface GoalCountdownBannerProps {
  goal: GoalTarget | null;
  currentTime: Date;
  onOpenGoalModal: () => void;
}

export const GoalCountdownBanner: React.FC<GoalCountdownBannerProps> = ({
  goal,
  currentTime,
  onOpenGoalModal,
}) => {
  if (!goal) {
    return (
      <div className="bg-gradient-to-r from-indigo-50/80 via-purple-50/50 to-emerald-50/80 dark:from-slate-900 dark:via-indigo-950/20 dark:to-slate-900 border border-indigo-200/80 dark:border-indigo-900/40 rounded-3xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20 shrink-0">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <span>Set Your Target Exam / Milestone</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Track live countdown in days, hours, and minutes to keep your daily study urgent and focused.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenGoalModal}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition shrink-0"
        >
          <Target className="w-4 h-4" />
          <span>Set Goal Date</span>
        </button>
      </div>
    );
  }

  const countdown = calculateRemainingTime(goal.targetDateTime, currentTime);

  return (
    <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-purple-950 text-white rounded-3xl p-4 sm:p-5 shadow-lg shadow-indigo-950/30 relative overflow-hidden transition-all border border-indigo-800/60">
      {/* Decorative ambient light */}
      <div className="absolute -right-10 -top-10 w-44 h-44 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
      <div className="absolute left-1/3 -bottom-10 w-44 h-44 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
        {/* Left: Goal Name & Target Date */}
        <div className="flex items-center gap-3.5 w-full md:w-auto">
          <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md text-amber-400 border border-white/15 shrink-0 shadow-inner">
            <Target className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                Exam Countdown Target
              </span>
              <button
                onClick={onOpenGoalModal}
                title="Edit goal date or title"
                className="p-1 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            </div>
            <h3 className="text-base sm:text-lg font-black tracking-tight text-white mt-0.5">
              {goal.title}
            </h3>
            <p className="text-xs text-indigo-200/80 flex items-center gap-1 mt-0.5 font-medium">
              <Clock className="w-3 h-3 text-indigo-300" />
              <span>Target: {countdown.formattedTarget}</span>
            </p>
          </div>
        </div>

        {/* Right: Real-time Live Countdown Cards (Days, Hours, Minutes, Seconds) */}
        {countdown.isReached ? (
          <div className="px-5 py-2.5 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-black animate-pulse">
            🎯 Target Date Reached! You are ready to shine!
          </div>
        ) : (
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Days Block */}
            <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl px-3 py-2 text-center min-w-[62px] shadow-sm">
              <span className="text-xl sm:text-2xl font-black text-amber-300 font-mono tabular-nums leading-none block">
                {countdown.days}
              </span>
              <span className="text-[9px] uppercase font-bold text-indigo-200 tracking-wider">
                Days
              </span>
            </div>

            <span className="text-lg font-black text-indigo-400">:</span>

            {/* Hours Block */}
            <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl px-3 py-2 text-center min-w-[62px] shadow-sm">
              <span className="text-xl sm:text-2xl font-black text-white font-mono tabular-nums leading-none block">
                {String(countdown.hours).padStart(2, '0')}
              </span>
              <span className="text-[9px] uppercase font-bold text-indigo-200 tracking-wider">
                Hours
              </span>
            </div>

            <span className="text-lg font-black text-indigo-400">:</span>

            {/* Minutes Block */}
            <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl px-3 py-2 text-center min-w-[62px] shadow-sm">
              <span className="text-xl sm:text-2xl font-black text-white font-mono tabular-nums leading-none block">
                {String(countdown.minutes).padStart(2, '0')}
              </span>
              <span className="text-[9px] uppercase font-bold text-indigo-200 tracking-wider">
                Mins
              </span>
            </div>

            <span className="text-lg font-black text-indigo-400">:</span>

            {/* Seconds Block (Ticking live!) */}
            <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl px-3 py-2 text-center min-w-[62px] shadow-sm">
              <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono tabular-nums leading-none block">
                {String(countdown.seconds).padStart(2, '0')}
              </span>
              <span className="text-[9px] uppercase font-bold text-emerald-300 tracking-wider">
                Secs
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
