/**
 * Date utility helpers for StudyFlow daily planner.
 */

export function getTodayString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDisplayDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const dateObj = new Date(year, month - 1, day);
  return dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function addDays(dateStr: string, numDays: number): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const dateObj = new Date(year, month - 1, day);
  dateObj.setDate(dateObj.getDate() + numDays);

  const newYear = dateObj.getFullYear();
  const newMonth = String(dateObj.getMonth() + 1).padStart(2, '0');
  const newDay = String(dateObj.getDate()).padStart(2, '0');
  return `${newYear}-${newMonth}-${newDay}`;
}

export function isToday(dateStr: string): boolean {
  return dateStr === getTodayString();
}
