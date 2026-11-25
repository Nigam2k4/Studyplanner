import { useState, useEffect, useCallback, useMemo } from 'react';
import { Task, DailyRecord, TaskStatus } from '../types/planner';
import {
  calculateNormalizedWeights,
  calculateDailyProductivity,
  createEmptyTasksForDate,
} from '../utils/calculations';
import { getTodayString, addDays, isToday } from '../utils/dateUtils';

export function useDailyPlanner(activeUserId: string = 'usr_alex_primary') {
  const [currentDate, setCurrentDate] = useState<string>(getTodayString());

  // User-specific storage key to guarantee 100% data isolation per user
  const userStorageKey = `studyflow_user_records_${activeUserId}`;

  const [records, setRecords] = useState<Record<string, DailyRecord>>(() => {
    try {
      const saved = localStorage.getItem(userStorageKey);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse planner records from localStorage:', e);
    }
    return {};
  });

  // Switch storage when activeUserId changes
  useEffect(() => {
    try {
      const saved = localStorage.getItem(userStorageKey);
      if (saved) {
        setRecords(JSON.parse(saved));
      } else {
        setRecords({});
      }
    } catch (e) {
      console.error('Error switching user data:', e);
    }
  }, [activeUserId, userStorageKey]);

  // Save to localStorage whenever records change for the active user
  useEffect(() => {
    try {
      localStorage.setItem(userStorageKey, JSON.stringify(records));
    } catch (e) {
      console.error('Failed to save planner records to localStorage:', e);
    }
  }, [records, userStorageKey]);

  // Current day's record (or initialized default for active user)
  const currentRecord = useMemo((): DailyRecord => {
    if (records[currentDate]) {
      return records[currentDate];
    }
    const emptyTasks = createEmptyTasksForDate(activeUserId);
    return {
      userId: activeUserId,
      date: currentDate,
      tasks: emptyTasks,
      notes: '',
      productivityPercentage: 0,
    };
  }, [records, currentDate, activeUserId]);

  // Date Navigation
  const goToDate = useCallback((date: string) => {
    setCurrentDate(date);
  }, []);

  const goToToday = useCallback(() => {
    setCurrentDate(getTodayString());
  }, []);

  const goToPrevDay = useCallback(() => {
    setCurrentDate((prev) => addDays(prev, -1));
  }, []);

  const goToNextDay = useCallback(() => {
    setCurrentDate((prev) => addDays(prev, 1));
  }, []);

  // Update a single task row in the current date linked to activeUserId
  const updateTask = useCallback(
    (slotNumber: number, updates: Partial<Pick<Task, 'title' | 'rawWeight' | 'status'>>) => {
      setRecords((prev) => {
        const existing = prev[currentDate] || {
          userId: activeUserId,
          date: currentDate,
          tasks: createEmptyTasksForDate(activeUserId),
          notes: '',
          productivityPercentage: 0,
        };

        const updatedTasks = existing.tasks.map((t) => {
          if (t.slotNumber === slotNumber) {
            const nextTitle = updates.title !== undefined ? updates.title : t.title;
            const nextRawWeight =
              updates.rawWeight !== undefined ? Math.max(1, Math.min(10, updates.rawWeight)) : t.rawWeight;
            const nextStatus = updates.status !== undefined ? updates.status : t.status;
            return {
              ...t,
              userId: activeUserId,
              title: nextTitle,
              rawWeight: nextRawWeight,
              status: nextStatus,
            };
          }
          return t;
        });

        // Recalculate weights and productivity
        const normalized = calculateNormalizedWeights(updatedTasks);
        const productivity = calculateDailyProductivity(normalized);

        return {
          ...prev,
          [currentDate]: {
            ...existing,
            userId: activeUserId,
            tasks: normalized,
            productivityPercentage: productivity,
          },
        };
      });
    },
    [currentDate, activeUserId]
  );

  // Quick toggle status for a slot
  const setTaskStatus = useCallback(
    (slotNumber: number, status: TaskStatus) => {
      updateTask(slotNumber, { status });
    },
    [updateTask]
  );

  // Update daily notes
  const updateNotes = useCallback(
    (notes: string) => {
      setRecords((prev) => {
        const existing = prev[currentDate] || {
          userId: activeUserId,
          date: currentDate,
          tasks: createEmptyTasksForDate(activeUserId),
          notes: '',
          productivityPercentage: 0,
        };
        return {
          ...prev,
          [currentDate]: {
            ...existing,
            userId: activeUserId,
            notes,
          },
        };
      });
    },
    [currentDate, activeUserId]
  );

  // Get list of pending / unfinished tasks from past dates for activeUserId
  const getPendingTasks = useCallback(() => {
    const list: { sourceDate: string; task: Task }[] = [];
    const dateKeys = Object.keys(records).sort();

    for (const d of dateKeys) {
      if (d <= currentDate) {
        const rec = records[d];
        for (const t of rec.tasks) {
          if (t.title.trim() && t.status !== 'completed') {
            list.push({ sourceDate: d, task: t });
          }
        }
      }
    }
    return list;
  }, [records, currentDate]);

  // Carry a pending task into target date
  const carryOverTask = useCallback(
    (sourceDate: string, taskToCarry: Task, targetDate: string = currentDate) => {
      setRecords((prev) => {
        const targetRec = prev[targetDate] || {
          userId: activeUserId,
          date: targetDate,
          tasks: createEmptyTasksForDate(activeUserId),
          notes: '',
          productivityPercentage: 0,
        };

        const emptySlotIndex = targetRec.tasks.findIndex((t) => !t.title.trim());
        if (emptySlotIndex === -1) {
          alert('All 5 task slots for this date are already full! Free up a slot first.');
          return prev;
        }

        const newTasks = [...targetRec.tasks];
        newTasks[emptySlotIndex] = {
          ...newTasks[emptySlotIndex],
          userId: activeUserId,
          title: taskToCarry.title,
          rawWeight: taskToCarry.rawWeight,
          status: null,
          carriedFromDate: sourceDate,
        };

        const normalized = calculateNormalizedWeights(newTasks);
        const productivity = calculateDailyProductivity(normalized);

        return {
          ...prev,
          [targetDate]: {
            ...targetRec,
            userId: activeUserId,
            tasks: normalized,
            productivityPercentage: productivity,
          },
        };
      });
    },
    [currentDate, activeUserId]
  );

  return {
    currentDate,
    currentRecord,
    isCurrentDateToday: isToday(currentDate),
    goToDate,
    goToToday,
    goToPrevDay,
    goToNextDay,
    updateTask,
    setTaskStatus,
    updateNotes,
    getPendingTasks,
    carryOverTask,
    allRecords: records,
  };
}
