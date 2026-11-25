import { useState, useEffect, useCallback } from 'react';
import { GoalTarget } from '../types/planner';

export function useGoalTarget(userId: string) {
  const storageKey = `studyflow_goal_target_${userId}`;

  const [goal, setGoal] = useState<GoalTarget | null>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse goal target:', e);
    }
    // Default sample goal set for next month so user immediately sees live countdown!
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 45); // 45 days from today
    defaultDate.setHours(9, 0, 0, 0);

    return {
      id: 'default-goal',
      userId,
      title: 'Target Exam / Final Milestone',
      targetDateTime: defaultDate.toISOString(),
      createdAt: new Date().toISOString(),
    };
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      if (goal) {
        localStorage.setItem(storageKey, JSON.stringify(goal));
      } else {
        localStorage.removeItem(storageKey);
      }
    } catch (e) {
      console.error('Failed to save goal target:', e);
    }
  }, [goal, storageKey]);

  // Update or set new goal
  const updateGoal = useCallback(
    (title: string, targetDateTime: string) => {
      const newGoal: GoalTarget = {
        id: 'goal_' + Date.now(),
        userId,
        title: title.trim() || 'My Target Goal',
        targetDateTime,
        createdAt: new Date().toISOString(),
      };
      setGoal(newGoal);
    },
    [userId]
  );

  const clearGoal = useCallback(() => {
    setGoal(null);
  }, []);

  return {
    goal,
    updateGoal,
    clearGoal,
  };
}
