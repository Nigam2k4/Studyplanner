import React, { useState } from 'react';
import { Task } from '../../types/planner';
import { createGoogleCalendarEventUrl } from '../../utils/googleCalendarUtils';
import { formatDisplayDate } from '../../utils/dateUtils';
import { X, Calendar as CalendarIcon, ExternalLink, Clock, CheckCircle } from 'lucide-react';

interface GoogleCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  dateStr: string;
  tasks: Task[];
  notes: string;
}

export const GoogleCalendarModal: React.FC<GoogleCalendarModalProps> = ({
  isOpen,
  onClose,
  dateStr,
  tasks,
  notes,
}) => {
  const [startHour, setStartHour] = useState<number>(9);
  const [durationHours, setDurationHours] = useState<number>(3);

  if (!isOpen) return null;

  const activeTasks = tasks.filter((t) => t.title.trim().length > 0);

  const handleOpenGoogleCalendar = () => {
    const url = createGoogleCalendarEventUrl({
      dateStr,
      tasks,
      notes,
      startHour,
      durationHours,
    });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 dark:bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                Sync with Google Calendar
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Export today's study block &amp; 5 aims into your calendar
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

        {/* Content */}
        <div className="space-y-4 text-sm text-slate-700 dark:text-slate-200">
          <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Target Study Date:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{formatDisplayDate(dateStr)}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Active Tasks to Export:</span>
              <span className="font-extrabold text-indigo-600 dark:text-indigo-400">{activeTasks.length} tasks</span>
            </div>
          </div>

          {/* Time Picker Controls */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="session-start" className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                Session Start Time:
              </label>
              <select
                id="session-start"
                value={startHour}
                onChange={(e) => setStartHour(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={i}>
                    {i === 0
                      ? '12:00 AM (Midnight)'
                      : i < 12
                      ? `${i}:00 AM`
                      : i === 12
                      ? '12:00 PM (Noon)'
                      : `${i - 12}:00 PM`}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="session-duration" className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                Study Duration:
              </label>
              <select
                id="session-duration"
                value={durationHours}
                onChange={(e) => setDurationHours(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
              >
                <option value={1}>1 Hour Session</option>
                <option value={2}>2 Hours Session</option>
                <option value={3}>3 Hours Session</option>
                <option value={4}>4 Hours Session</option>
                <option value={6}>6 Hours Deep Work</option>
              </select>
            </div>
          </div>

          {/* Checklist Preview */}
          <div className="bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Google Calendar Description Preview:
            </span>
            <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
              {activeTasks.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No tasks entered for this date yet.</p>
              ) : (
                activeTasks.map((t) => (
                  <div key={t.slotNumber} className="text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-medium">#{t.slotNumber}: {t.title}</span>
                    <span className="text-[10px] text-slate-500 bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-800 font-bold">
                      {t.normalizedWeight}%
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition"
          >
            Cancel
          </button>

          <button
            onClick={handleOpenGoogleCalendar}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Open in Google Calendar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
