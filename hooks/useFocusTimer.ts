import { useEffect, useRef } from 'react';
import { InteractionManager } from 'react-native';
import { useFocusStore } from '@/store/focusStore';

/**
 * Drives the focus session countdown. Call inside the FocusMode screen.
 * Uses a 1-second interval that updates the store via `tickSecond()`.
 */
export const useFocusTimer = () => {
  const { isActive, isPaused, tickSecond, endSession } = useFocusStore();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isActive && !isPaused) {
      intervalRef.current = setInterval(() => {
        tickSecond();
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, isPaused]);

  return null;
};

/** Format seconds into MM:SS */
export function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/** Returns 0–1 progress for the ring */
export function sessionProgress(target: number, remaining: number): number {
  if (target === 0) return 0;
  return 1 - remaining / target;
}
