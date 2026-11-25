import React from 'react';
import { Task } from '../../types/planner';
import { X, CornerDownRight, Calendar, AlertCircle } from 'lucide-react';
import { formatDisplayDate } from '../../utils/dateUtils';

interface CarryOverModalProps {
  isOpen: boolean;
  onClose: () => void;
  pendingTasks: { sourceDate: string; task: Task }[];
  targetDate: string;
  onCarryOver: (sourceDate: string, task: Task) => void;
}

export const CarryOverModal: React.FC<CarryOverModalProps> = ({
  isOpen,
  onClose,
  pendingTasks,
  targetDate,
  onCarryOver,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 dark:bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative max-h-[85vh] flex flex-col transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20">
              <CornerDownRight className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                Carry-Over Incomplete Tasks
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Transfer unfinished study aims into {formatDisplayDate(targetDate)}
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

        {/* Content List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {pendingTasks.length === 0 ? (
            <div className="text-center py-10 px-4">
              <AlertCircle className="w-8 h-8 text-slate-400 dark:text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                No unfinished tasks found!
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                All tasks in your recorded history have been completed. Great work!
              </p>
            </div>
          ) : (
            pendingTasks.map(({ sourceDate, task }, idx) => (
              <div
                key={`${sourceDate}-${task.slotNumber}-${idx}`}
                className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 rounded-2xl p-3.5 flex items-center justify-between gap-3 transition"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="flex items-center gap-1 text-[10px] text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded-md font-semibold">
                      <Calendar className="w-3 h-3" />
                      {sourceDate}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 font-medium">
                      Weight: {task.rawWeight}
                    </span>
                    {task.status === 'failed' && (
                      <span className="text-[10px] text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 px-1.5 py-0.5 rounded font-bold">
                        ✗ Failed
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">
                    {task.title}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onCarryOver(sourceDate, task);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shrink-0 transition flex items-center gap-1 shadow-xs"
                >
                  <CornerDownRight className="w-3.5 h-3.5" />
                  <span>Carry to {targetDate}</span>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
