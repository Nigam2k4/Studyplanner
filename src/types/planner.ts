export type TaskStatus = 'completed' | 'failed' | null;

export interface UserProfile {
  id: string; // Unique User ID
  name: string;
  avatar: string;
  role: string;
}

export const DEFAULT_STUDY_USERS: UserProfile[] = [
  { id: 'user-alex-primary', name: 'Alex (You)', avatar: '🚀', role: 'Study Partner 1' },
  { id: 'user-sam-partner', name: 'Sam (Friend)', avatar: '⚡', role: 'Study Partner 2' },
];

export interface Task {
  id: string;
  userId: string; // Foreign key linking task to user
  slotNumber: number; // 1 to 5
  title: string;
  rawWeight: number; // 1 to 10
  normalizedWeight: number; // e.g. 25.0%
  status: TaskStatus; // 'completed' = ✓, 'failed' = ✗, null = unattempted
  carriedFromDate?: string | null;
}

export interface DailyRecord {
  id?: string;
  userId: string; // Foreign key linking daily record to user
  date: string; // Format: YYYY-MM-DD
  tasks: Task[]; // Array of exactly 5 task rows
  notes: string;
  productivityPercentage: number;
}

export interface GoalTarget {
  id: string;
  userId: string;
  title: string;
  targetDateTime: string; // ISO string e.g. 2026-12-31T09:00:00
  createdAt: string;
}

export interface PresetAim {
  id: string;
  label: string;
  defaultWeight: number;
}

export const DEFAULT_STUDY_PRESETS: PresetAim[] = [
  { id: 'theory', label: 'Theory & Concept Revision', defaultWeight: 7 },
  { id: 'problems', label: 'Solve Practice Numerical / Problem Set', defaultWeight: 8 },
  { id: 'mock', label: 'Timed Mock Test & Exam Prep', defaultWeight: 9 },
  { id: 'notes', label: 'Lecture Notes Synthesis & Summary', defaultWeight: 5 },
  { id: 'flashcards', label: 'Spaced Repetition & Flashcards', defaultWeight: 4 },
  { id: 'doubt', label: 'Doubt Clearing & Reference Reading', defaultWeight: 6 },
  { id: 'coding', label: 'Coding / Project Lab Work', defaultWeight: 8 },
];
