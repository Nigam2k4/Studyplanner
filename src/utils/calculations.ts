import { Task } from '../types/planner';

/**
 * Normalizes task weights so that all active entered tasks sum to exactly 100%.
 * Unused/empty task rows receive a normalized weight of 0%.
 */
export function calculateNormalizedWeights(tasks: Task[]): Task[] {
  const activeTasks = tasks.filter((t) => t.title.trim().length > 0);

  if (activeTasks.length === 0) {
    return tasks.map((t) => ({ ...t, normalizedWeight: 0 }));
  }

  const rawSum = activeTasks.reduce((sum, t) => sum + (t.rawWeight || 1), 0);

  if (rawSum === 0) {
    return tasks.map((t) => ({ ...t, normalizedWeight: 0 }));
  }

  // Calculate proportional percentages
  let runningTotal = 0;
  const updatedTasks = tasks.map((task) => {
    if (!task.title.trim()) {
      return { ...task, normalizedWeight: 0 };
    }
    const weight = task.rawWeight || 1;
    // Calculate 1 decimal place percentage
    const norm = Math.round((weight / rawSum) * 1000) / 10;
    runningTotal += norm;
    return { ...task, normalizedWeight: norm };
  });

  // Correct any tiny rounding discrepancy (e.g. 99.9% or 100.1%) on the last active task
  const discrepancy = Math.round((100.0 - runningTotal) * 10) / 10;
  if (discrepancy !== 0) {
    for (let i = updatedTasks.length - 1; i >= 0; i--) {
      if (updatedTasks[i].title.trim().length > 0) {
        updatedTasks[i].normalizedWeight =
          Math.round((updatedTasks[i].normalizedWeight + discrepancy) * 10) / 10;
        break;
      }
    }
  }

  return updatedTasks;
}

/**
 * Calculates daily productivity score out of 100%.
 * Each task marked 'completed' (✓) earns its normalized weight.
 * Tasks marked 'failed' (✗) or null earn 0%.
 */
export function calculateDailyProductivity(tasks: Task[]): number {
  const completedScore = tasks.reduce((sum, task) => {
    if (task.status === 'completed' && task.title.trim().length > 0) {
      return sum + task.normalizedWeight;
    }
    return sum;
  }, 0);

  return Math.min(100, Math.max(0, Math.round(completedScore * 10) / 10));
}

/**
 * Creates 5 fresh blank task slots for a date linked to a specific userId.
 */
export function createEmptyTasksForDate(userId: string = 'user-alex-primary'): Task[] {
  return Array.from({ length: 5 }, (_, idx) => ({
    id: `slot-${idx + 1}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    userId,
    slotNumber: idx + 1,
    title: '',
    rawWeight: 5,
    normalizedWeight: 0,
    status: null,
    carriedFromDate: null,
  }));
}
