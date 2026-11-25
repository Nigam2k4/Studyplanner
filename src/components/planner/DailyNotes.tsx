import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, Check } from 'lucide-react';

interface DailyNotesProps {
  notes: string;
  onUpdateNotes: (notes: string) => void;
  dateStr: string;
}

export const DailyNotes: React.FC<DailyNotesProps> = ({ notes, onUpdateNotes }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdateNotes(e.target.value);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 1200);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs transition-colors">
      {/* Header Bar */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/40 transition"
      >
        <div className="flex items-center gap-2.5">
          <BookOpen className="w-4 h-4 text-emerald-600 dark:text-indigo-400" />
          <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
            Daily Study Notes
          </span>
          {notes.trim().length > 0 && (
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-indigo-500/10 text-emerald-700 dark:text-indigo-300 border border-emerald-200 dark:border-indigo-500/20 font-semibold">
              {notes.trim().split(/\s+/).length} words
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {isSaved && (
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
              <Check className="w-3 h-3" /> Saved
            </span>
          )}
          <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
            {isExpanded ? 'Collapse' : 'Expand Notes'}
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </span>
        </div>
      </button>

      {/* Expandable Notes Area */}
      {isExpanded && (
        <div className="p-5 pt-1 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-950/40">
          <textarea
            value={notes}
            onChange={handleChange}
            placeholder="Write key concepts learned today, formulas, revision reminders, or reflections..."
            rows={5}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 transition resize-y shadow-xs"
          />
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-2 px-1">
            <span>Markdown formatting supported</span>
            <span>Automatically saved</span>
          </div>
        </div>
      )}
    </div>
  );
};
