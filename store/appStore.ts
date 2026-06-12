import { create } from 'zustand';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isTyping?: boolean;
}

export interface HabitEntry {
  habitId: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
  value?: number;
}

export interface Habit {
  id: string;
  name: string;
  icon: string;
  description: string;
  frequency: 'daily' | 'weekdays' | 'custom';
  targetValue?: number;
  unit?: string;
  color: string;
  entries: HabitEntry[];
  streak: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  unlockedAt?: string;
  category: 'focus' | 'recovery' | 'streak' | 'social' | 'milestone';
  isUnlocked: boolean;
  progress?: number;   // 0–100
  requirement?: number;
}

export interface CommunityChallenge {
  id: string;
  title: string;
  description: string;
  participants: number;
  duration: number; // days
  daysLeft: number;
  reward: string;
  type: 'detox' | 'focus' | 'recovery' | 'streak';
  isJoined: boolean;
  leaderboard: { rank: number; name: string; avatar: string; score: number }[];
}

interface AppState {
  // AI Coach
  chatMessages:  ChatMessage[];
  isAITyping:    boolean;

  // Habits
  habits:        Habit[];

  // Sleep
  sleepHours:    number;
  sleepQuality:  number; // 0–100
  bedtime:       string; // HH:mm
  wakeTime:      string;
  sleepHistory:  { date: string; hours: number; quality: number }[];

  // Achievements
  achievements:  Achievement[];
  totalXP:       number;
  level:         number;

  // Community
  challenges:    CommunityChallenge[];

  // Notifications
  unreadCount:   number;

  // Actions
  addChatMessage:        (msg: ChatMessage) => void;
  setAITyping:           (v: boolean) => void;
  toggleHabitCompletion: (habitId: string, date: string) => void;
  joinChallenge:         (id: string) => void;
  decrementUnread:       () => void;
  clearChat:             () => void;
}

const INITIAL_HABITS: Habit[] = [
  { id: '1', name: 'No Social Media', icon: 'phone-portrait-outline', description: 'Avoid social feeds for the day', frequency: 'daily', color: '#2DB5A3', entries: [], streak: 3 },
  { id: '2', name: 'Eye Breaks',      icon: 'eye-outline',            description: '20-20-20 rule every 20 mins',    frequency: 'daily', color: '#34C585', entries: [], streak: 7 },
  { id: '3', name: 'Focus Session',   icon: 'locate-outline',         description: 'Complete a deep focus session',  frequency: 'daily', color: '#7C6BF0', entries: [], streak: 5 },
  { id: '4', name: 'Sleep by 11pm',   icon: 'moon-outline',           description: 'In bed before midnight',         frequency: 'daily', color: '#F0A949', entries: [], streak: 2 },
  { id: '5', name: 'Mindful Break',   icon: 'flower-outline',         description: '5-min mindfulness session',      frequency: 'daily', color: '#EF8B5A', entries: [], streak: 4 },
];

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: 'first_focus',   title: 'First Focus',     description: 'Complete your first focus session',         icon: 'locate-outline',        xpReward: 50,  category: 'focus',     isUnlocked: true,  unlockedAt: '2025-03-10' },
  { id: 'week_streak',   title: 'Week Warrior',    description: 'Maintain a 7-day streak',                  icon: 'flame-outline',         xpReward: 200, category: 'streak',    isUnlocked: false, progress: 71 },
  { id: 'detox_pro',     title: 'Detox Pro',       description: 'Complete a 24h dopamine detox',            icon: 'sparkles-outline',      xpReward: 150, category: 'recovery',  isUnlocked: false, progress: 0 },
  { id: 'ai_friend',     title: 'AI Companion',    description: 'Have 10 conversations with Brain Coach',   icon: 'hardware-chip-outline', xpReward: 75,  category: 'milestone', isUnlocked: false, progress: 30 },
  { id: 'social_hero',   title: 'Community Hero',  description: 'Join and complete a community challenge',  icon: 'trophy-outline',        xpReward: 300, category: 'social',    isUnlocked: false, progress: 0 },
  { id: 'recover_10',    title: 'Recovery Master', description: 'Complete 10 recovery sessions',            icon: 'diamond-outline',       xpReward: 100, category: 'recovery',  isUnlocked: true,  unlockedAt: '2025-03-12' },
];

export const useAppStore = create<AppState>((set, get) => ({
  chatMessages:  [],
  isAITyping:    false,
  habits:        INITIAL_HABITS,
  sleepHours:    6.5,
  sleepQuality:  68,
  bedtime:       '23:30',
  wakeTime:      '06:00',
  sleepHistory: [
    { date: '2025-03-15', hours: 6.5,  quality: 68 },
    { date: '2025-03-14', hours: 7.2,  quality: 78 },
    { date: '2025-03-13', hours: 5.8,  quality: 55 },
    { date: '2025-03-12', hours: 8.0,  quality: 90 },
    { date: '2025-03-11', hours: 6.0,  quality: 62 },
    { date: '2025-03-10', hours: 7.5,  quality: 82 },
    { date: '2025-03-09', hours: 5.5,  quality: 48 },
  ],
  achievements:  INITIAL_ACHIEVEMENTS,
  totalXP:       1250,
  level:         3,
  challenges: [
    {
      id: 'c1',
      title: '7-Day Social Detox',
      description: 'No social media for 7 straight days',
      participants: 2847,
      duration: 7,
      daysLeft: 4,
      reward: '500 XP + Neural Badge',
      type: 'detox',
      isJoined: true,
      leaderboard: [
        { rank: 1, name: 'Aiki_M', avatar: '👾', score: 98 },
        { rank: 2, name: 'ZenCoder', avatar: '🧑‍💻', score: 95 },
        { rank: 3, name: 'You', avatar: '🫵', score: 88 },
      ],
    },
    {
      id: 'c2',
      title: 'Deep Work Sprint',
      description: '4+ hours of focused work daily for 5 days',
      participants: 1234,
      duration: 5,
      daysLeft: 5,
      reward: '300 XP',
      type: 'focus',
      isJoined: false,
      leaderboard: [],
    },
  ],
  unreadCount: 4,

  addChatMessage: (msg) =>
    set((s) => ({ chatMessages: [...s.chatMessages, msg] })),

  setAITyping: (v) => set({ isAITyping: v }),

  toggleHabitCompletion: (habitId, date) =>
    set((s) => ({
      habits: s.habits.map((h) => {
        if (h.id !== habitId) return h;
        const existing = h.entries.find((e) => e.date === date);
        const entries = existing
          ? h.entries.map((e) => e.date === date ? { ...e, completed: !e.completed } : e)
          : [...h.entries, { habitId, date, completed: true }];
        return { ...h, entries };
      }),
    })),

  joinChallenge: (id) =>
    set((s) => ({
      challenges: s.challenges.map((c) =>
        c.id === id ? { ...c, isJoined: true, participants: c.participants + 1 } : c,
      ),
    })),

  decrementUnread: () => set((s) => ({ unreadCount: Math.max(0, s.unreadCount - 1) })),

  clearChat: () => set({ chatMessages: [] }),
}));
