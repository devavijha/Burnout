import axios, { AxiosInstance, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '@/constants/config';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach auth token to every request
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('@resetos_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ────────────────────────────────────────────────
// Auth
// ────────────────────────────────────────────────
export const authAPI = {
  register: (data: { email: string; password: string; displayName: string; role: string }) =>
    api.post('/auth/register', data),
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  refreshToken: () =>
    api.post('/auth/refresh'),
  updateProfile: (data: Partial<{ displayName: string; role: string; timezone: string }>) =>
    api.patch('/auth/profile', data),
};

// ────────────────────────────────────────────────
// Burnout
// ────────────────────────────────────────────────
export const burnoutAPI = {
  getScore: () =>
    api.get('/burnout/score'),
  submitMetrics: (data: {
    screenTimeHours:   number;
    appSwitches:       number;
    lateNightMinutes:  number;
    notificationCount: number;
  }) =>
    api.post('/burnout/metrics', data),
  getHistory: (days = 30) =>
    api.get(`/burnout/history?days=${days}`),
  getHeatmap: () =>
    api.get('/burnout/heatmap'),
  getWeeklyReport: () =>
    api.get('/burnout/weekly-report'),
};

// ────────────────────────────────────────────────
// Focus
// ────────────────────────────────────────────────
export const focusAPI = {
  startSession: (durationMinutes: number, type: string) =>
    api.post('/focus/sessions', { durationMinutes, type }),
  endSession: (sessionId: string, completedMinutes: number, status: string) =>
    api.patch(`/focus/sessions/${sessionId}`, { completedMinutes, status }),
  getHistory: () =>
    api.get('/focus/sessions'),
  getStats: () =>
    api.get('/focus/stats'),
};

// ────────────────────────────────────────────────
// AI Coach
// ────────────────────────────────────────────────
export const aiAPI = {
  chat: (messages: { role: string; content: string }[], context: Record<string, unknown>) =>
    api.post('/ai/chat', { messages, context }),
  getInsight: () =>
    api.get('/ai/daily-insight'),
  getSuggestions: () =>
    api.get('/ai/suggestions'),
};

// ────────────────────────────────────────────────
// Analytics / Sleep / Habits
// ────────────────────────────────────────────────
export const analyticsAPI = {
  getScreenTimeBreakdown: () =>
    api.get('/analytics/screen-time'),
  getSleepData: () =>
    api.get('/analytics/sleep'),
  logSleep: (data: { hours: number; quality: number; bedtime: string; wakeTime: string }) =>
    api.post('/analytics/sleep', data),
  getHabits: () =>
    api.get('/habits'),
  logHabit: (habitId: string, date: string) =>
    api.post('/habits/log', { habitId, date }),
};

// ────────────────────────────────────────────────
// Community
// ────────────────────────────────────────────────
export const communityAPI = {
  getChallenges: () =>
    api.get('/community/challenges'),
  joinChallenge: (id: string) =>
    api.post(`/community/challenges/${id}/join`),
  getLeaderboard: (id: string) =>
    api.get(`/community/challenges/${id}/leaderboard`),
};

export default api;
