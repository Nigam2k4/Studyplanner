import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Sparkles,
  Inbox,
  ExternalLink,
  Sun,
  Moon,
  Clock,
  Wifi,
  User as UserIcon,
  LogOut,
  Target,
} from 'lucide-react';
import { formatDisplayDate } from '../../utils/dateUtils';
import { RealtimeClockState } from '../../hooks/useRealtimeClock';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  currentDate: string;
  isToday: boolean;
  pendingCount: number;
  isDarkMode: boolean;
  clock: RealtimeClockState;
  onToggleTheme: () => void;
  onPrevDay: () => void;
  onNextDay: () => void;
  onGoToToday: () => void;
  onDateChange: (date: string) => void;
  onOpenCarryOver: () => void;
  onOpenGoogleSync: () => void;
  onOpenGoalModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentDate,
  isToday,
  pendingCount,
  isDarkMode,
  clock,
  onToggleTheme,
  onPrevDay,
  onNextDay,
  onGoToToday,
  onDateChange,
  onOpenCarryOver,
  onOpenGoogleSync,
  onOpenGoalModal,
}) => {
  const { user, logout, openAuthModal } = useAuth();
  const [showAccountMenu, setShowAccountMenu] = useState(false);

  return (
    <header className="border-b border-slate-200/80 dark:border-slate-800 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md sticky top-0 z-30 px-4 py-3 sm:px-6 transition-colors shadow-xs">
      {/* Midnight Rollover Banner */}
      {clock.hasRolledOverMidnight && (
        <div className="max-w-7xl mx-auto mb-3 p-3 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-emerald-500/10 border border-indigo-200 dark:border-indigo-800/80 flex items-center justify-between text-xs animate-fadeIn">
          <div className="flex items-center gap-2">
            <span className="text-base">🕛</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              Midnight Rollover: A new study day ({clock.displayDate}) has started!
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onGoToToday();
                clock.clearMidnightFlag();
              }}
              className="px-3 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold shadow-xs transition"
            >
              Start Today's Tasks
            </button>
            <button
              onClick={clock.clearMidnightFlag}
              className="px-2.5 py-1 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: App Title, Personal Account Badge & Real-time Live Clock */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-indigo-600 flex items-center justify-center shadow-md shadow-emerald-500/20 text-white shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                  StudyFlow
                </h1>

                {/* Individual User Account Pill */}
                {user ? (
                  <div className="relative">
                    <button
                      onClick={() => setShowAccountMenu(!showAccountMenu)}
                      title="Manage Personal Account"
                      className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-extrabold hover:bg-emerald-100 transition shadow-xs max-w-[180px]"
                    >
                      <UserIcon className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span className="truncate">{user.displayName || user.email}</span>
                    </button>

                    {/* Account Menu Popover */}
                    {showAccountMenu && (
                      <div className="absolute left-0 top-full mt-2 z-40 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-3 w-64 text-xs">
                        <div className="border-b border-slate-100 dark:border-slate-800 pb-2 mb-2">
                          <div className="font-extrabold text-slate-900 dark:text-white">
                            {user.displayName}
                          </div>
                          <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold truncate mt-0.5">
                            {user.email}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-1">
                            Registered on {new Date(user.createdAt).toLocaleDateString()}
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            logout();
                            setShowAccountMenu(false);
                          }}
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={openAuthModal}
                    className="px-2.5 py-0.5 rounded-full bg-indigo-600 text-white text-[11px] font-extrabold hover:bg-indigo-500 transition shadow-xs"
                  >
                    Sign In
                  </button>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Quantitative study tracker &amp; habit engine
              </p>
            </div>
          </div>

          {/* Live Ticking Clock Widget (Approach 3) */}
          <div className="hidden xl:flex items-center gap-2.5 bg-slate-100 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800 px-3.5 py-1.5 rounded-2xl shadow-inner">
            <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-pulse" />
            <div>
              <div className="flex items-center gap-1.5 font-mono text-xs font-black text-slate-800 dark:text-slate-100 tabular-nums">
                <span>{clock.timeString}</span>
                <span
                  title={clock.isNetworkSynced ? 'Cloud NTP Synced' : 'High-Precision Device Time'}
                  className="flex items-center"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block mr-1 opacity-75" />
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block -ml-3" />
                </span>
              </div>
              <div className="text-[9px] text-slate-400 font-semibold flex items-center gap-1">
                <Wifi className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" />
                <span>{clock.isNetworkSynced ? 'Network Synced' : 'Live Clock'}</span>
                <span>•</span>
                <span>{clock.timezone.split('/')[1] || clock.timezone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Date Navigator with Quick Today Button */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-1 shadow-inner">
          <button
            onClick={onPrevDay}
            title="Previous Day"
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800 transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="relative flex items-center gap-2 px-3 py-1">
            <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <input
              type="date"
              value={currentDate}
              onChange={(e) => e.target.value && onDateChange(e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer w-full"
            />
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200 select-none">
              {formatDisplayDate(currentDate)}
            </span>
          </div>

          <button
            onClick={onNextDay}
            title="Next Day"
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800 transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {!isToday && (
            <button
              onClick={onGoToToday}
              className="ml-1 text-xs px-2.5 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition shadow-xs"
            >
              Today
            </button>
          )}
        </div>

        {/* Right: Actions & Theme Toggle */}
        <div className="flex items-center gap-2">
          {/* Light / Dark Mode Toggle */}
          <button
            onClick={onToggleTheme}
            title={isDarkMode ? 'Switch to Refreshing Light Mode' : 'Switch to Dark Mode'}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700/60 transition shadow-xs"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>

          {/* Goal / Exam Countdown Target */}
          <button
            onClick={onOpenGoalModal}
            title="Set Target Exam / Goal Countdown Date"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700/60 text-xs font-bold transition"
          >
            <Target className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span className="hidden sm:inline">Goal Target</span>
          </button>

          {/* Google Calendar Sync */}
          <button
            onClick={onOpenGoogleSync}
            title="Export session to Google Calendar"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700/60 text-xs font-bold transition"
          >
            <ExternalLink className="w-3.5 h-3.5 text-blue-500" />
            <span className="hidden sm:inline">Google Cal</span>
          </button>

          {/* Pending Task Carry-over Trigger */}
          <button
            onClick={onOpenCarryOver}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700/60 text-xs font-bold transition"
          >
            <Inbox className="w-3.5 h-3.5 text-amber-500" />
            <span>Carry-over</span>
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 text-[10px] font-bold border border-amber-500/30">
                {pendingCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
