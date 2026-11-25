export interface CountdownResult {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isReached: boolean;
  totalHoursRemaining: number;
  formattedTarget: string;
}

/**
 * Calculates remaining days, hours, minutes, and seconds until target date/time.
 */
export function calculateRemainingTime(targetDateTimeStr: string, now: Date): CountdownResult {
  const targetDate = new Date(targetDateTimeStr);
  const diffMs = targetDate.getTime() - now.getTime();

  const formattedTarget = targetDate.toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  if (isNaN(targetDate.getTime()) || diffMs <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isReached: true,
      totalHoursRemaining: 0,
      formattedTarget,
    };
  }

  const seconds = Math.floor((diffMs / 1000) % 60);
  const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
  const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const totalHoursRemaining = Math.floor(diffMs / (1000 * 60 * 60));

  return {
    days,
    hours,
    minutes,
    seconds,
    isReached: false,
    totalHoursRemaining,
    formattedTarget,
  };
}
