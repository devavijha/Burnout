// App-wide configuration constants

export const APP_NAME = 'ResetOS';
export const APP_VERSION = '1.0.0';

// API
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3001/api';
export const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_KEY ?? '';

// Firebase
export const FIREBASE_CONFIG = {
  apiKey:            process.env.EXPO_PUBLIC_FB_API_KEY ?? '',
  authDomain:        process.env.EXPO_PUBLIC_FB_AUTH_DOMAIN ?? '',
  projectId:         process.env.EXPO_PUBLIC_FB_PROJECT_ID ?? '',
  storageBucket:     process.env.EXPO_PUBLIC_FB_STORAGE_BUCKET ?? '',
  messagingSenderId: process.env.EXPO_PUBLIC_FB_MESSAGING_ID ?? '',
  appId:             process.env.EXPO_PUBLIC_FB_APP_ID ?? '',
};

// Burnout scoring thresholds (0–100)
export const BURNOUT_THRESHOLDS = {
  safe:     { min: 0,  max: 30, label: 'Optimal',   emoji: '🟢' },
  moderate: { min: 31, max: 60, label: 'Moderate',  emoji: '🟡' },
  high:     { min: 61, max: 80, label: 'High Risk',  emoji: '🟠' },
  critical: { min: 81, max: 100, label: 'Critical', emoji: '🔴' },
};

// Focus session presets (minutes)
export const FOCUS_PRESETS = [
  { label: 'Quick Focus', minutes: 15, icon: 'flash' },
  { label: 'Deep Work',   minutes: 25, icon: 'brain' },
  { label: 'Flow State',  minutes: 50, icon: 'infinite' },
  { label: 'Custom',      minutes: 0,  icon: 'settings' },
];

// Recovery exercise durations (seconds)
export const RECOVERY_EXERCISES = {
  breathing:  { duration: 240, cycles: 4 },
  eyes:       { duration: 120, cycles: 6 },
  stretch:    { duration: 300, cycles: 3 },
  mindful:    { duration: 180, cycles: 1 },
};

// Gamification
export const XP_REWARDS = {
  completeFocusSession:  50,
  completeRecovery:      25,
  streakBonus:           100,
  challengeComplete:     200,
  dailyCheckIn:          10,
  assessmentComplete:    30,
};

// Notification channels
export const NOTIFICATION_CHANNELS = {
  burnoutAlert:  'burnout-alert',
  focusReminder: 'focus-reminder',
  recovery:      'recovery-break',
  insights:      'ai-insights',
  community:     'community',
};
