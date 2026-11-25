import React, { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';

interface ProductivityBadgeProps {
  score: number; // 0 to 100
  totalActiveTasks: number;
  completedTasks: number;
}

export const ProductivityBadge: React.FC<ProductivityBadgeProps> = ({
  score,
  totalActiveTasks,
  completedTasks,
}) => {
  const prevScoreRef = useRef(score);

  // Trigger celebration confetti when reaching 100%
  useEffect(() => {
    if (score === 100 && prevScoreRef.current < 100 && totalActiveTasks > 0) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#06b6d4', '#f59e0b', '#6366f1'],
      });
    }
    prevScoreRef.current = score;
  }, [score, totalActiveTasks]);

  // Determine 3-Level Productivity status
  let themeBadge = 'text-rose-700 bg-rose-50 border-rose-200 dark:text-rose-400 dark:bg-rose-500/10 dark:border-rose-500/30';
  let badgeLabel = 'Low Productivity';
  let Icon = AlertCircle;
  let progressColor = 'bg-rose-500';
  let circleStrokeColor = 'text-rose-500';

  if (score >= 80) {
    themeBadge = 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-500/10 dark:border-emerald-500/30';
    badgeLabel = score === 100 ? 'Perfect Day! 100%' : 'High Productivity';
    Icon = Trophy;
    progressColor = 'bg-emerald-500';
    circleStrokeColor = 'text-emerald-500';
  } else if (score >= 50) {
    themeBadge = 'text-amber-800 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-500/10 dark:border-amber-500/30';
    badgeLabel = 'Moderate Productivity';
    Icon = TrendingUp;
    progressColor = 'bg-amber-500';
    circleStrokeColor = 'text-amber-500';
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm shadow-slate-200/60 dark:shadow-none relative overflow-hidden transition-colors">
      {/* Soft ambient background glow */}
      <div
        className={`absolute -right-20 -top-20 w-56 h-56 rounded-full blur-3xl opacity-30 pointer-events-none ${
          score >= 80 ? 'bg-emerald-300 dark:bg-emerald-500/20' : score >= 50 ? 'bg-amber-300 dark:bg-amber-500/20' : 'bg-rose-300 dark:bg-rose-500/20'
        }`}
      />

      <div className="flex flex-col sm:flex-row items-center justify-between gap-5 relative z-10">
        {/* Left: Score & Status */}
        <div className="flex items-center gap-5">
          <div className="relative flex items-center justify-center">
            {/* Circular progress visual */}
            <div className="w-24 h-24 rounded-full border-4 border-slate-100 dark:border-slate-800 flex items-center justify-center relative bg-slate-50 dark:bg-slate-950/40">
              <svg className="w-24 h-24 -rotate-90 absolute inset-0">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-slate-100 dark:text-slate-800"
                  fill="transparent"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray={251.2}
                  strokeDashoffset={251.2 - (251.2 * score) / 100}
                  strokeLinecap="round"
                  className={`transition-all duration-700 ease-out ${circleStrokeColor}`}
                  fill="transparent"
                />
              </svg>
              <div className="text-center z-10">
                <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  {score}%
                </span>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${themeBadge}`}>
                <Icon className="w-3.5 h-3.5" />
                {badgeLabel}
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
              Daily Productivity Score
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {completedTasks} of {totalActiveTasks} active tasks completed (Normalized weights sum to 100%)
            </p>
          </div>
        </div>

        {/* Right: Summary metrics */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end border-t sm:border-t-0 border-slate-100 dark:border-slate-800 pt-3 sm:pt-0">
          <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800 rounded-2xl px-4 py-2.5 text-center min-w-[105px]">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Completed</span>
            <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              {completedTasks}
            </div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800 rounded-2xl px-4 py-2.5 text-center min-w-[105px]">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Remaining</span>
            <div className="text-xl font-black text-slate-700 dark:text-slate-300">
              {totalActiveTasks - completedTasks}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar Line */}
      <div className="mt-4 w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ease-out ${progressColor}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
};
