import React, { useState, useEffect, useMemo } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthScreen } from './components/auth/AuthScreen';
import { useDailyPlanner } from './hooks/useDailyPlanner';
import { useRealtimeClock } from './hooks/useRealtimeClock';
import { useGoalTarget } from './hooks/useGoalTarget';
import { Header } from './components/layout/Header';
import { GoalCountdownBanner } from './components/goal/GoalCountdownBanner';
import { GoalModal } from './components/goal/GoalModal';
import { GreetingBanner } from './components/dashboard/GreetingBanner';
import { WeeklyChart } from './components/dashboard/WeeklyChart';
import { SquareCalendar } from './components/dashboard/SquareCalendar';
import { ProductivityBadge } from './components/planner/ProductivityBadge';
import { TaskRow } from './components/planner/TaskRow';
import { DailyNotes } from './components/planner/DailyNotes';
import { CarryOverModal } from './components/planner/CarryOverModal';
import { GoogleCalendarModal } from './components/calendar/GoogleCalendarModal';
import { analyzeWeeklyPerformance } from './utils/analyticsUtils';
import { ShieldCheck, Info } from 'lucide-react';

const MainDashboard: React.FC = () => {
  const { user } = useAuth();
  // Email ID is the primary user identifier
  const userEmail = user ? user.email.toLowerCase().trim() : 'guest@studyflow.app';

  // Real-time Clock (Approach 3: Instant load + Background Network Sync + Midnight Rollover)
  const clock = useRealtimeClock();

  // Goal / Exam Target countdown hook
  const { goal, updateGoal, clearGoal } = useGoalTarget(userEmail);

  // Daily Planner Hook scoped strictly to userEmail
  const {
    currentDate,
    currentRecord,
    goToDate,
    goToToday,
    goToPrevDay,
    goToNextDay,
    updateTask,
    setTaskStatus,
    updateNotes,
    getPendingTasks,
    carryOverTask,
    allRecords,
  } = useDailyPlanner(userEmail);

  const [isCarryOverOpen, setIsCarryOverOpen] = useState(false);
  const [isGoogleSyncOpen, setIsGoogleSyncOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);

  // Check if viewed date matches the realtime clock today's date
  const isViewingRealtimeToday = currentDate === clock.todayDateStr;

  // Theme Management (Refreshing light mode by default)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('studyflow_theme') === 'dark';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('studyflow_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('studyflow_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  const activeTasks = currentRecord.tasks.filter((t) => t.title.trim().length > 0);
  const completedTasks = activeTasks.filter((t) => t.status === 'completed');
  const pendingTasksList = getPendingTasks();

  // User's name for personalized greeting
  const userName = user?.displayName || (user?.email ? user.email.split('@')[0] : 'Scholar');

  // Compute Weekly Analytics, Yesterday's performance, and Encouragement Engine for active user
  const weeklyAnalysis = useMemo(() => {
    return analyzeWeeklyPerformance(currentDate, allRecords, userName);
  }, [currentDate, allRecords, userName]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      {/* 1. Header with Account Auth, Clock, Date Navigator, Goal Icon, Sync & Theme Switcher */}
      <Header
        currentDate={currentDate}
        isToday={isViewingRealtimeToday}
        pendingCount={pendingTasksList.length}
        isDarkMode={isDarkMode}
        clock={clock}
        onToggleTheme={toggleTheme}
        onPrevDay={goToPrevDay}
        onNextDay={goToNextDay}
        onGoToToday={goToToday}
        onDateChange={goToDate}
        onOpenCarryOver={() => setIsCarryOverOpen(true)}
        onOpenGoogleSync={() => setIsGoogleSyncOpen(true)}
        onOpenGoalModal={() => setIsGoalModalOpen(true)}
      />

      {/* 2. Unified 2-Column Dashboard with Live Goal Countdown */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Top Feature: Live Exam / Milestone Target Countdown Banner */}
        <GoalCountdownBanner
          goal={goal}
          currentTime={clock.currentTime}
          onOpenGoalModal={() => setIsGoalModalOpen(true)}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ========================================================= */}
          {/* LEFT COLUMN: GREETING + WEEKLY GRAPH + SQUARE CALENDAR   */}
          {/* ========================================================= */}
          <div className="lg:col-span-5 space-y-5">
            {/* 1. Top Left: Encouraging Greeting & Weekly Performance Banner */}
            <GreetingBanner analysis={weeklyAnalysis} selectedDate={currentDate} />

            {/* 2. Middle Left: 7-Day Productivity Slope & Movement Graph */}
            <WeeklyChart
              days={weeklyAnalysis.last7Days}
              weeklyAverage={weeklyAnalysis.weeklyAverage}
              onSelectDate={goToDate}
            />

            {/* 3. Bottom Left: Square Heatmap Calendar */}
            <SquareCalendar
              records={allRecords}
              selectedDate={currentDate}
              onSelectDate={goToDate}
            />
          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: TODOS & DAILY PRODUCTIVITY ACTION CENTER    */}
          {/* ========================================================= */}
          <div className="lg:col-span-7 space-y-5">
            {/* Daily Productivity Score Badge */}
            <ProductivityBadge
              score={currentRecord.productivityPercentage}
              totalActiveTasks={activeTasks.length}
              completedTasks={completedTasks.length}
            />

            {/* 5 Daily Tasks Container */}
            <section className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm shadow-slate-200/60 dark:shadow-none space-y-4 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800/80 gap-2">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <span>5 Daily Study Tasks</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                      Compulsory Weightage 1–10
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Weights normalize to 100%. Click ✓ to score, ✗ for zero.
                  </p>
                </div>

                <div className="flex items-center gap-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                    ✓ Earns Weight
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                    ✗ Zero Score
                  </span>
                </div>
              </div>

              {/* Exactly 5 Task Rows */}
              <div className="space-y-3">
                {currentRecord.tasks.map((task) => (
                  <TaskRow
                    key={task.slotNumber}
                    task={task}
                    onUpdateTitle={(slot, title) => updateTask(slot, { title })}
                    onUpdateWeight={(slot, rawWeight) => updateTask(slot, { rawWeight })}
                    onToggleStatus={(slot, status) => setTaskStatus(slot, status)}
                  />
                ))}
              </div>

              {/* Guidance & Security Status */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between gap-3 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                  <span>
                    Private study workspace for{' '}
                    <strong className="text-slate-700 dark:text-slate-200">
                      {user ? user.email : 'You'}
                    </strong>
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-medium shrink-0">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Linked to: {userEmail}</span>
                </div>
              </div>
            </section>

            {/* Daily Study Notes Section */}
            <section>
              <DailyNotes
                notes={currentRecord.notes}
                onUpdateNotes={updateNotes}
                dateStr={currentDate}
              />
            </section>
          </div>
        </div>
      </main>

      {/* 3. Goal / Exam Target Modal */}
      <GoalModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        currentGoal={goal}
        onSaveGoal={updateGoal}
        onClearGoal={clearGoal}
      />

      {/* 4. Carry-Over Modal */}
      <CarryOverModal
        isOpen={isCarryOverOpen}
        onClose={() => setIsCarryOverOpen(false)}
        pendingTasks={pendingTasksList}
        targetDate={currentDate}
        onCarryOver={(sourceDate, task) => {
          carryOverTask(sourceDate, task, currentDate);
        }}
      />

      {/* 5. Google Calendar Sync Modal */}
      <GoogleCalendarModal
        isOpen={isGoogleSyncOpen}
        onClose={() => setIsGoogleSyncOpen(false)}
        dateStr={currentDate}
        tasks={currentRecord.tasks}
        notes={currentRecord.notes}
      />

      {/* 6. Minimal Footer */}
      <footer className="border-t border-slate-200/80 dark:border-slate-800/80 py-5 text-center text-xs text-slate-500 font-medium">
        StudyFlow • Personal quantitative study companion • 100% Free &amp; Open
      </footer>
    </div>
  );
};

const AppContent: React.FC = () => {
  const { user } = useAuth();

  // If user is not authenticated on this device, show the Sign In / Sign Up gate!
  if (!user) {
    return <AuthScreen />;
  }

  return <MainDashboard />;
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
