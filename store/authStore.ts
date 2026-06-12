import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  id: string;
  email: string;
  displayName: string;
  avatar?: string;
  role: 'student' | 'developer' | 'remote-worker' | 'creator' | 'other';
  timezone: string;
  joinedAt: string;
  // Gamification
  xp: number;
  level: number;
  streak: number;
  longestStreak: number;
  achievements: string[];
  // Preferences
  theme: 'dark' | 'neural';
  accentColor: string;
  notificationsEnabled: boolean;
  soundEnabled: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isOnboarded: boolean;
  isLoading: boolean;

  setUser:           (user: User) => void;
  setToken:          (token: string) => void;
  setOnboarded:      (v: boolean) => void;
  updateUser:        (patch: Partial<User>) => void;
  addXP:             (amount: number) => void;
  addAchievement:    (id: string) => void;
  logout:            () => Promise<void>;
  loadPersistedAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user:            null,
  token:           null,
  isAuthenticated: false,
  isOnboarded:     false,
  isLoading:       true,

  setUser: (user) => {
    set({ user, isAuthenticated: true });
    AsyncStorage.setItem('@resetos_user', JSON.stringify(user));
  },

  setToken: (token) => {
    set({ token });
    AsyncStorage.setItem('@resetos_token', token);
  },

  setOnboarded: (v) => {
    set({ isOnboarded: v });
    AsyncStorage.setItem('@resetos_onboarded', v ? '1' : '0');
  },

  updateUser: (patch) => {
    const user = get().user;
    if (!user) return;
    const updated = { ...user, ...patch };
    set({ user: updated });
    AsyncStorage.setItem('@resetos_user', JSON.stringify(updated));
  },

  addXP: (amount) => {
    const user = get().user;
    if (!user) return;
    const newXP    = user.xp + amount;
    const newLevel = Math.floor(newXP / 500) + 1; // 500 XP per level
    get().updateUser({ xp: newXP, level: newLevel });
  },

  addAchievement: (id) => {
    const user = get().user;
    if (!user || user.achievements.includes(id)) return;
    get().updateUser({ achievements: [...user.achievements, id] });
  },

  logout: async () => {
    await AsyncStorage.multiRemove(['@resetos_user', '@resetos_token', '@resetos_onboarded']);
    set({ user: null, token: null, isAuthenticated: false, isOnboarded: false });
  },

  loadPersistedAuth: async () => {
    try {
      const [userJson, token, onboarded] = await Promise.all([
        AsyncStorage.getItem('@resetos_user'),
        AsyncStorage.getItem('@resetos_token'),
        AsyncStorage.getItem('@resetos_onboarded'),
      ]);
      set({
        user:            userJson ? JSON.parse(userJson) : null,
        token:           token ?? null,
        isAuthenticated: !!token,
        isOnboarded:     onboarded === '1',
        isLoading:       false,
      });
    } catch {
      set({ isLoading: false });
    }
  },
}));
