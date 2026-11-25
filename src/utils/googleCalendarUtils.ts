import { Task } from '../types/planner';
import { formatDisplayDate } from './dateUtils';

interface GenerateGoogleCalendarParams {
  dateStr: string;
  tasks: Task[];
  notes?: string;
  startHour?: number; // 0-23, default 9 (9:00 AM)
  durationHours?: number; // default 3 hours
}

/**
 * Creates a pre-populated Google Calendar event link that opens directly
 * in the user's browser with zero API keys or OAuth setup required.
 */
export function createGoogleCalendarEventUrl({
  dateStr,
  tasks,
  notes,
  startHour = 9,
  durationHours = 3,
}: GenerateGoogleCalendarParams): string {
  const activeTasks = tasks.filter((t) => t.title.trim().length > 0);

  const title = encodeURIComponent(`StudyFlow Session (${formatDisplayDate(dateStr)})`);

  // Construct description checklist
  let detailsText = `🎯 StudyFlow 5-Task Session for ${dateStr}\n\nTasks:\n`;
  if (activeTasks.length === 0) {
    detailsText += `(No tasks entered yet. Open StudyFlow to plan your 5 tasks.)\n`;
  } else {
    activeTasks.forEach((t) => {
      const statusIcon = t.status === 'completed' ? '✓' : t.status === 'failed' ? '✗' : '○';
      detailsText += `${statusIcon} #${t.slotNumber}: ${t.title} (Weight: ${t.rawWeight}, Norm: ${t.normalizedWeight}%)\n`;
    });
  }

  if (notes && notes.trim().length > 0) {
    detailsText += `\n📝 Study Notes:\n${notes.trim()}\n`;
  }

  detailsText += `\n---\nTracked in StudyFlow Web App`;

  const details = encodeURIComponent(detailsText);

  // Format date timestamps: YYYYMMDDTHHmmSSZ
  const [year, month, day] = dateStr.split('-').map(Number);
  const startDate = new Date(year, month - 1, day, startHour, 0, 0);
  const endDate = new Date(year, month - 1, day, startHour + durationHours, 0, 0);

  const formatUtc = (d: Date) => {
    return d.toISOString().replace(/-|:|\.\d\d\d/g, '');
  };

  const datesParam = `${formatUtc(startDate)}/${formatUtc(endDate)}`;

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${datesParam}&details=${details}&location=Study+Desk`;
}
