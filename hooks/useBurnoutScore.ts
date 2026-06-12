import { useMemo } from 'react';
import { useBurnoutStore } from '@/store/burnoutStore';
import { BURNOUT_THRESHOLDS } from '@/constants/config';
import { BurnoutColors } from '@/constants/colors';

/**
 * Derives computed burnout values from the store.
 */
export const useBurnoutScore = () => {
  const {
    currentScore,
    previousScore,
    dimensions,
    trend,
    history,
    screenTimeToday,
    appSwitchesToday,
    lateNightMinsToday,
    notificationsToday,
  } = useBurnoutStore();

  const levelInfo = useMemo(() => {
    const k = Object.entries(BURNOUT_THRESHOLDS).find(
      ([, v]) => currentScore >= v.min && currentScore <= v.max,
    );
    return k ? { key: k[0], ...k[1] } : BURNOUT_THRESHOLDS.safe;
  }, [currentScore]);

  const color = useMemo(() => {
    if (currentScore <= 30) return BurnoutColors.safe;
    if (currentScore <= 60) return BurnoutColors.moderate;
    if (currentScore <= 80) return BurnoutColors.high;
    return BurnoutColors.critical;
  }, [currentScore]);

  const deltaVsPrevious = currentScore - previousScore;
  const weekAvg = history.length
    ? Math.round(
        history.slice(0, 7).reduce((s, e) => s + e.score, 0) / Math.min(7, history.length),
      )
    : currentScore;

  return {
    score: currentScore,
    previousScore,
    delta: deltaVsPrevious,
    weekAvg,
    level: levelInfo.label,
    color,
    trend,
    dimensions,
    history,
    rawInputs: { screenTimeToday, appSwitchesToday, lateNightMinsToday, notificationsToday },
  };
};
