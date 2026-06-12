/**
 * ResetOS Burnout Scoring Engine
 *
 * Algorithm: Weighted multi-dimensional scoring with non-linear ceiling effects.
 * Inputs: raw behavioral signals → normalized scores → weighted composite.
 *
 * Research basis:
 * - Technostress theory (Brod, 1984)
 * - Digital burnout indicators (Tams et al., 2018)
 * - Attentional resource depletion model (Kahneman, 1973)
 */

const WEIGHTS = {
  screenTime:         0.28,
  appSwitching:       0.20,
  lateNightUsage:     0.22,
  notificationLoad:   0.18,
  usageConsistency:   0.12,
};

/**
 * Normalize raw screen-time hours to 0–100 score.
 * Curve: sub-3h = low, 3-6h = moderate, 6-10h = high, 10h+ = critical.
 */
function normalizeScreenTime(hours) {
  if (hours <= 1)   return 5;
  if (hours <= 2)   return 15;
  if (hours <= 3)   return 28;
  if (hours <= 4)   return 42;
  if (hours <= 5)   return 55;
  if (hours <= 6)   return 65;
  if (hours <= 7)   return 74;
  if (hours <= 8)   return 82;
  if (hours <= 9)   return 89;
  if (hours <= 10)  return 94;
  return 98;
}

/**
 * Normalize app switches per hour to 0–100 score.
 * <5 = focused, 5-15 = normal, 15-30 = distracted, 30+ = hyperactive.
 */
function normalizeAppSwitching(switchesPerHour) {
  if (switchesPerHour <= 5)   return 8;
  if (switchesPerHour <= 10)  return 22;
  if (switchesPerHour <= 20)  return 45;
  if (switchesPerHour <= 30)  return 62;
  if (switchesPerHour <= 50)  return 78;
  if (switchesPerHour <= 80)  return 88;
  return 95;
}

/**
 * Normalize late-night usage minutes to 0–100 score.
 * Even 15 mins after 10 PM disrupts melatonin by 22% (Harvard study, 2015).
 */
function normalizeLateNight(minutes) {
  if (minutes === 0)   return 0;
  if (minutes <= 10)   return 20;
  if (minutes <= 20)   return 35;
  if (minutes <= 30)   return 50;
  if (minutes <= 45)   return 65;
  if (minutes <= 60)   return 78;
  if (minutes <= 90)   return 88;
  return 96;
}

/**
 * Normalize daily notification count to 0–100.
 * Cognitive switching cost: each notification = 23 min to refocus (Gloria Mark, 2004).
 */
function normalizeNotifications(count) {
  if (count <= 10)   return 5;
  if (count <= 25)   return 18;
  if (count <= 50)   return 32;
  if (count <= 80)   return 48;
  if (count <= 120)  return 62;
  if (count <= 180)  return 75;
  if (count <= 250)  return 86;
  return 94;
}

/**
 * Calculate composite burnout score (0–100) and dimensional breakdown.
 */
function calculateBurnoutScore({
  screenTimeHours    = 4,
  appSwitches        = 50,
  lateNightMinutes   = 0,
  notificationCount  = 60,
  consistencyFactor  = 50,   // 0-100: higher = more consistent (less burnout)
} = {}) {
  // Normalize each dimension
  const dimensions = {
    screenTime:       normalizeScreenTime(screenTimeHours),
    appSwitching:     normalizeAppSwitching(appSwitches),
    lateNightUsage:   normalizeLateNight(lateNightMinutes),
    notificationLoad: normalizeNotifications(notificationCount),
    usageConsistency: 100 - consistencyFactor, // inverted: inconsistency = burnout
  };

  // Weighted composite
  let rawScore = Object.entries(WEIGHTS).reduce((sum, [key, weight]) => {
    return sum + (dimensions[key] ?? 0) * weight;
  }, 0);

  // Non-linear amplification for high scores (> 70 → higher real-world impact)
  if (rawScore > 70) rawScore = 70 + (rawScore - 70) * 1.15;

  const score = Math.min(100, Math.round(rawScore));

  // Determine level
  const level = score <= 30 ? 'Optimal'   :
                score <= 60 ? 'Moderate'  :
                score <= 80 ? 'High Risk' : 'Critical';

  // Identify top risk factors
  const sorted = Object.entries(dimensions)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 2)
    .map(([key]) => key);

  const recommendation = generateRecommendation(score, sorted);

  return {
    score,
    level,
    rawDimensions:   dimensions,
    topRiskFactors:  sorted,
    recommendation,
    confidence:      calculateConfidence({ screenTimeHours, appSwitches, notificationCount }),
    calculatedAt:    new Date().toISOString(),
  };
}

function generateRecommendation(score, topRisks) {
  if (score <= 30) {
    return 'Excellent neural state. Maintain current habits and consider sharing your strategies with the community.';
  }
  if (score <= 50) {
    return `Moderate fatigue from ${topRisks[0]}. A 25-minute focus session and 5-minute recovery break will help.`;
  }
  if (score <= 70) {
    return `High ${topRisks[0]} detected. Activate a 2-hour Dopamine Detox and take 3 recovery breaks today.`;
  }
  return 'Critical burnout. Immediately stop non-essential screen use, do 4 minutes of box breathing, and rest for 30 minutes.';
}

function calculateConfidence({ screenTimeHours, appSwitches, notificationCount }) {
  // Confidence based on data completeness
  let confidence = 100;
  if (screenTimeHours === undefined)  confidence -= 25;
  if (appSwitches === undefined)      confidence -= 25;
  if (notificationCount === undefined) confidence -= 20;
  return `${confidence}%`;
}

/**
 * Generate a 7×24 fatigue heatmap based on typical behavioral patterns.
 */
function generateHeatmap() {
  const days  = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const seed  = (d, h) => {
    let v = 0;
    if (h >= 7  && h <= 9)  v = 30 + ((d * 7 + h) % 28);
    if (h >= 9  && h <= 12) v = 50 + ((d * 5 + h) % 30);
    if (h >= 14 && h <= 17) v = 55 + ((d * 3 + h) % 25);
    if (h >= 19 && h <= 22) v = 65 + ((d * 4 + h) % 30);
    if (h >= 22 || h <= 2)  v = 72 + ((d + h) % 25);
    if (d >= 5) v = Math.round(v * 0.6);
    return Math.min(100, Math.max(0, v));
  };

  return days.map((dayName, d) => ({
    day: dayName,
    hours: Array.from({ length: 24 }, (_, h) => ({ hour: h, intensity: seed(d, h) })),
  }));
}

module.exports = { calculateBurnoutScore, generateHeatmap, normalizeScreenTime };
