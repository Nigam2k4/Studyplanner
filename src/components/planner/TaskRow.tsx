import React, { useState } from 'react';
import { Task, TaskStatus, DEFAULT_STUDY_PRESETS } from '../../types/planner';
import { Check, X, Sparkles, CornerDownRight } from 'lucide-react';

interface TaskRowProps {
  task: Task;
  onUpdateTitle: (slotNumber: number, title: string) => void;
  onUpdateWeight: (slotNumber: number, weight: number) => void;
  onToggleStatus: (slotNumber: number, status: TaskStatus) => void;
}

export const TaskRow: React.FC<TaskRowProps> = ({
  task,
  onUpdateTitle,
  onUpdateWeight,
  onToggleStatus,
}) => {
  const [showPresets, setShowPresets] = useState(false);
  const isActive = task.title.trim().length > 0;
  const isCompleted = task.status === 'completed';
  const isFailed = task.status === 'failed';

  const handleCheckClick = () => {
    if (isCompleted) {
      onToggleStatus(task.slotNumber, null);
    } else {
      onToggleStatus(task.slotNumber, 'completed');
    }
  };

  const handleCrossClick = () => {
    if (isFailed) {
      onToggleStatus(task.slotNumber, null);
    } else {
      onToggleStatus(task.slotNumber, 'failed');
    }
  };

  return (
    <div
      className={`group relative rounded-2xl border p-3.5 transition-all duration-200 flex flex-col md:flex-row items-stretch md:items-center gap-3 ${
        isCompleted
          ? 'bg-emerald-50/80 border-emerald-300 dark:bg-emerald-950/20 dark:border-emerald-500/40 shadow-xs'
          : isFailed
          ? 'bg-rose-50/80 border-rose-300 dark:bg-rose-950/20 dark:border-rose-500/40 shadow-xs'
          : isActive
          ? 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-indigo-300 dark:hover:border-slate-700'
          : 'bg-white/60 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/60 opacity-80 hover:opacity-100'
      }`}
    >
      {/* 1. Automatic Task Numbering (1 to 5) */}
      <div className="flex items-center justify-between md:justify-start gap-2.5">
        <div
          className={`w-8 h-8 rounded-xl flex items-center justify-center font-extrabold text-xs shrink-0 transition-colors ${
            isCompleted
              ? 'bg-emerald-600 text-white shadow-xs'
              : isFailed
              ? 'bg-rose-600 text-white shadow-xs'
              : isActive
              ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-600/30 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/40'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
          }`}
        >
          {task.slotNumber}
        </div>

        {/* Carried over pill on mobile */}
        {task.carriedFromDate && (
          <span className="inline-flex items-center gap-1 text-[10px] text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 px-2 py-0.5 rounded-full md:hidden font-medium">
            <CornerDownRight className="w-3 h-3" />
            Carried
          </span>
        )}
      </div>

      {/* 2. Flexible Task Entry */}
      <div className="flex-1 relative">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={task.title}
            placeholder={`Study Aim #${task.slotNumber}... (e.g. Mathematics, Coding Lab, Mock Test)`}
            onChange={(e) => onUpdateTitle(task.slotNumber, e.target.value)}
            className={`w-full bg-slate-50 dark:bg-slate-950/60 border rounded-xl px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:bg-white dark:focus:bg-slate-950 focus:ring-2 transition-all ${
              isCompleted
                ? 'line-through text-slate-400 border-emerald-300 dark:border-emerald-500/30 focus:ring-emerald-400/20'
                : 'border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/15'
            }`}
          />

          <button
            type="button"
            onClick={() => setShowPresets(!showPresets)}
            title="Pick a study preset aim"
            className="p-2 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl transition shrink-0"
          >
            <Sparkles className="w-4 h-4" />
          </button>
        </div>

        {/* Carried over note on desktop */}
        {task.carriedFromDate && (
          <div className="hidden md:flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400 mt-1">
            <CornerDownRight className="w-3 h-3" />
            <span>Carried over from {task.carriedFromDate}</span>
          </div>
        )}

        {/* Preset Aims Floating Menu */}
        {showPresets && (
          <div className="absolute left-0 right-0 top-full mt-1 z-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl p-2 max-h-48 overflow-y-auto">
            <div className="text-[11px] font-bold text-slate-400 px-2 py-1 uppercase tracking-wider">
              Quick Study Presets:
            </div>
            {DEFAULT_STUDY_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => {
                  onUpdateTitle(task.slotNumber, preset.label);
                  onUpdateWeight(task.slotNumber, preset.defaultWeight);
                  setShowPresets(false);
                }}
                className="w-full text-left text-xs px-2.5 py-1.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-600/20 hover:text-indigo-600 dark:hover:text-indigo-300 flex items-center justify-between transition"
              >
                <span>{preset.label}</span>
                <span className="text-[10px] text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-medium">
                  Weight: {preset.defaultWeight}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 3. Weightage Dropdown & Normalized % */}
      <div className="flex items-center justify-between md:justify-end gap-3 shrink-0">
        <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-950/60 border border-slate-200/90 dark:border-slate-800 rounded-xl px-2.5 py-1.5">
          <label htmlFor={`weight-${task.slotNumber}`} className="text-xs text-slate-500 font-semibold">
            Weight:
          </label>
          <select
            id={`weight-${task.slotNumber}`}
            value={task.rawWeight}
            disabled={!isActive}
            onChange={(e) => onUpdateWeight(task.slotNumber, Number(e.target.value))}
            className="bg-transparent text-sm font-extrabold text-indigo-600 dark:text-indigo-400 focus:outline-none cursor-pointer disabled:opacity-40"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((w) => (
              <option key={w} value={w} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                {w}
              </option>
            ))}
          </select>
        </div>

        {/* Normalized Weight Display */}
        <div className="min-w-[70px] text-center bg-slate-50 dark:bg-slate-950/60 border border-slate-200/90 dark:border-slate-800 rounded-xl px-2.5 py-1.5">
          <span className="text-[10px] block text-slate-400 uppercase font-bold">Norm</span>
          <span
            className={`text-xs font-black ${
              isActive ? 'text-indigo-600 dark:text-indigo-300' : 'text-slate-400'
            }`}
          >
            {task.normalizedWeight > 0 ? `${task.normalizedWeight}%` : '0%'}
          </span>
        </div>

        {/* 4. Binary Completion Buttons (✓ Green / ✗ Red) */}
        <div className="flex items-center gap-1.5">
          {/* ✓ Green Checkmark */}
          <button
            type="button"
            disabled={!isActive}
            onClick={handleCheckClick}
            title={isCompleted ? 'Completed ✓ (Click to reset)' : 'Mark Completed ✓'}
            className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-base transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed ${
              isCompleted
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-400/50 scale-105'
                : 'bg-emerald-50 dark:bg-slate-950 text-emerald-600 border border-emerald-200 dark:border-emerald-500/30 hover:bg-emerald-500 hover:text-white'
            }`}
          >
            <Check className="w-5 h-5 stroke-[3]" />
          </button>

          {/* ✗ Red Cross */}
          <button
            type="button"
            disabled={!isActive}
            onClick={handleCrossClick}
            title={isFailed ? 'Incomplete ✗ (Click to reset)' : 'Mark Incomplete ✗'}
            className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-base transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed ${
              isFailed
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30 ring-2 ring-rose-400/50 scale-105'
                : 'bg-rose-50 dark:bg-slate-950 text-rose-600 border border-rose-200 dark:border-rose-500/30 hover:bg-rose-500 hover:text-white'
            }`}
          >
            <X className="w-5 h-5 stroke-[3]" />
          </button>
        </div>
      </div>
    </div>
  );
};
