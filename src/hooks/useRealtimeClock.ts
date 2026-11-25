import { useState, useEffect, useRef, useCallback } from 'react';

export interface RealtimeClockState {
  currentTime: Date;
  timeString: string; // e.g. '07:30:15 AM'
  time24String: string; // e.g. '07:30:15'
  todayDateStr: string; // 'YYYY-MM-DD'
  displayDate: string; // e.g. 'Wednesday, 25 Nov 2026'
  isNetworkSynced: boolean;
  timezone: string;
  hasRolledOverMidnight: boolean;
  clearMidnightFlag: () => void;
}

export function useRealtimeClock(onMidnightChange?: (newDate: string) => void): RealtimeClockState {
  // Start with instant local client time (0ms delay)
  const [offsetMs, setOffsetMs] = useState<number>(0);
  const [isNetworkSynced, setIsNetworkSynced] = useState<boolean>(false);
  const [hasRolledOverMidnight, setHasRolledOverMidnight] = useState<boolean>(false);

  const getComputedNow = useCallback(() => {
    return new Date(Date.now() + offsetMs);
  }, [offsetMs]);

  const [currentTime, setCurrentTime] = useState<Date>(() => new Date());
  const prevDateStrRef = useRef<string>('');

  // 1. Background Network Time Synchronization (Approach 3)
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout

    async function syncNetworkTime() {
      try {
        // Attempt fetch from public NTP / Time API
        const response = await fetch('https://timeapi.io/api/time/current/zone?timeZone=UTC', {
          signal: controller.signal,
          cache: 'no-store',
        });

        if (response.ok && isMounted) {
          const data = await response.json();
          if (data && data.dateTime) {
            const serverTimestamp = new Date(data.dateTime + 'Z').getTime();
            const clientTimestamp = Date.now();
            const calculatedOffset = serverTimestamp - clientTimestamp;

            // Only apply if discrepancy is more than 500ms
            if (Math.abs(calculatedOffset) > 500) {
              setOffsetMs(calculatedOffset);
            }
            setIsNetworkSynced(true);
          }
        }
      } catch {
        // Fallback gracefully: if offline or API blocked, device clock is used seamlessly
        if (isMounted) {
          setIsNetworkSynced(false);
        }
      } finally {
        clearTimeout(timeoutId);
      }
    }

    syncNetworkTime();

    return () => {
      isMounted = false;
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, []);

  // 2. High-precision 1-second live ticker & Midnight Rollover Detection
  useEffect(() => {
    const timer = setInterval(() => {
      const now = getComputedNow();
      setCurrentTime(now);

      const y = now.getFullYear();
      const m = String(now.getMonth() + 1).padStart(2, '0');
      const d = String(now.getDate()).padStart(2, '0');
      const currentDateStr = `${y}-${m}-${d}`;

      // Initialize reference on first tick
      if (!prevDateStrRef.current) {
        prevDateStrRef.current = currentDateStr;
      } else if (prevDateStrRef.current !== currentDateStr) {
        // 🕛 MIDNIGHT ROLLOVER DETECTED!
        prevDateStrRef.current = currentDateStr;
        setHasRolledOverMidnight(true);
        if (onMidnightChange) {
          onMidnightChange(currentDateStr);
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [getComputedNow, onMidnightChange]);

  // Formatted date and time strings
  const y = currentTime.getFullYear();
  const m = String(currentTime.getMonth() + 1).padStart(2, '0');
  const d = String(currentTime.getDate()).padStart(2, '0');
  const todayDateStr = `${y}-${m}-${d}`;

  const timeString = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  const time24String = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const displayDate = currentTime.toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const clearMidnightFlag = () => setHasRolledOverMidnight(false);

  return {
    currentTime,
    timeString,
    time24String,
    todayDateStr,
    displayDate,
    isNetworkSynced,
    timezone,
    hasRolledOverMidnight,
    clearMidnightFlag,
  };
}
