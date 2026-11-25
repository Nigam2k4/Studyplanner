import React, { useState } from 'react';
import { GoalTarget } from '../../types/planner';
import { X, Target, Trash2 } from 'lucide-react';

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentGoal: GoalTarget | null;
  onSaveGoal: (title: string, targetDateTime: string) => void;
  onClearGoal: () => void;
}

export const GoalModal: React.FC<GoalModalProps> = ({
  isOpen,
  onClose,
  currentGoal,
  onSaveGoal,
  onClearGoal,
}) => {
  const [title, setTitle] = useState(currentGoal?.title || 'Final Semester Exam');
  const [dateTime, setDateTime] = useState(() => {
    if (currentGoal?.targetDateTime) {
      const d = new Date(currentGoal.targetDateTime);
      // Format YYYY-MM-DDTHH:mm for datetime-local input
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const hours = String(d.getHours()).padStart(2, '0');
      const mins = String(d.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${mins}`;
    }
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 30);
    defaultDate.setHours(9, 0, 0, 0);
    const year = defaultDate.getFullYear();
    const month = String(defaultDate.getMonth() + 1).padStart(2, '0');
    const day = String(defaultDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}T09:00`;
  });

  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please enter a goal or exam title.');
      return;
    }
    if (!dateTime) {
      setError('Please select a target date and time.');
      return;
    }

    const selectedTimestamp = new Date(dateTime).getTime();
    if (isNaN(selectedTimestamp)) {
      setError('Invalid date format.');
      return;
    }

    if (selectedTimestamp <= Date.now()) {
      setError('Target date must be in the future.');
      return;
    }

    onSaveGoal(title.trim(), new Date(dateTime).toISOString());
    onClose();
  };

  const handleQuickPresetDays = (daysFromNow: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysFromNow);
    d.setHours(9, 0, 0, 0);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    setDateTime(`${year}-${month}-${day}T09:00`);
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 dark:bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                Set Target Exam / Goal Date
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Track live countdown in days, hours, and minutes
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-semibold">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Goal / Exam Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Final Semester Exam, USMLE Step 1, Coding Interview"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
              <span>Target Date &amp; Time</span>
              <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">
                Countdown ticks in real time
              </span>
            </label>
            <div className="relative">
              <input
                type="datetime-local"
                value={dateTime}
                onChange={(e) => {
                  setDateTime(e.target.value);
                  setError('');
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 font-medium"
              />
            </div>
          </div>

          {/* Quick presets */}
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Quick Shortcuts:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleQuickPresetDays(7)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-indigo-50 hover:text-indigo-600 transition"
              >
                In 1 Week
              </button>
              <button
                type="button"
                onClick={() => handleQuickPresetDays(30)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-indigo-50 hover:text-indigo-600 transition"
              >
                In 1 Month
              </button>
              <button
                type="button"
                onClick={() => handleQuickPresetDays(60)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-indigo-50 hover:text-indigo-600 transition"
              >
                In 2 Months
              </button>
              <button
                type="button"
                onClick={() => handleQuickPresetDays(90)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-indigo-50 hover:text-indigo-600 transition"
              >
                In 3 Months
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            {currentGoal ? (
              <button
                type="button"
                onClick={() => {
                  onClearGoal();
                  onClose();
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Goal</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition flex items-center gap-1.5"
              >
                <Target className="w-3.5 h-3.5" />
                <span>Save Goal</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
