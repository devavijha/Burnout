import { create } from 'zustand';

export interface FocusSession {
  id: string;
  startedAt: string;
  endedAt?: string;
  durationMinutes: number;
  completedMinutes: number;
  status: 'active' | 'completed' | 'interrupted';
  type: 'quick' | 'deep' | 'flow' | 'custom';
}

interface FocusState {
  isActive:         boolean;
  currentSession:   FocusSession | null;
  secondsRemaining: number;
  targetSeconds:    number;
  isPaused:         boolean;
  sessionHistory:   FocusSession[];
  totalFocusToday:  number; // minutes
  streakDays:       number;
  appBlockEnabled:  boolean;
  ambientSound:     'none' | 'rain' | 'forest' | 'whitenoise' | 'space';

  startSession:    (durationMinutes: number, type: FocusSession['type']) => void;
  pauseSession:    () => void;
  resumeSession:   () => void;
  endSession:      (completed: boolean) => void;
  tickSecond:      () => void;
  toggleAppBlock:  () => void;
  setAmbientSound: (sound: FocusState['ambientSound']) => void;
}

export const useFocusStore = create<FocusState>((set, get) => ({
  isActive:         false,
  currentSession:   null,
  secondsRemaining: 0,
  targetSeconds:    0,
  isPaused:         false,
  sessionHistory:   [],
  totalFocusToday:  85,
  streakDays:       5,
  appBlockEnabled:  false,
  ambientSound:     'none',

  startSession: (durationMinutes, type) => {
    const secs = durationMinutes * 60;
    const session: FocusSession = {
      id:               Date.now().toString(),
      startedAt:        new Date().toISOString(),
      durationMinutes,
      completedMinutes: 0,
      status:           'active',
      type,
    };
    set({
      isActive:         true,
      currentSession:   session,
      secondsRemaining: secs,
      targetSeconds:    secs,
      isPaused:         false,
    });
  },

  pauseSession: () => set({ isPaused: true }),

  resumeSession: () => set({ isPaused: false }),

  endSession: (completed) => {
    const { currentSession, sessionHistory, totalFocusToday, targetSeconds, secondsRemaining } = get();
    if (!currentSession) return;

    const elapsed = Math.floor((targetSeconds - secondsRemaining) / 60);
    const finished: FocusSession = {
      ...currentSession,
      endedAt:          new Date().toISOString(),
      completedMinutes: elapsed,
      status:           completed ? 'completed' : 'interrupted',
    };

    set({
      isActive:         false,
      currentSession:   null,
      secondsRemaining: 0,
      isPaused:         false,
      sessionHistory:   [finished, ...sessionHistory].slice(0, 50),
      totalFocusToday:  totalFocusToday + elapsed,
    });
  },

  tickSecond: () => {
    const { secondsRemaining, isPaused, endSession } = get();
    if (isPaused) return;
    if (secondsRemaining <= 1) {
      endSession(true);
      return;
    }
    set({ secondsRemaining: secondsRemaining - 1 });
  },

  toggleAppBlock:  () => set((s) => ({ appBlockEnabled: !s.appBlockEnabled })),
  setAmbientSound: (sound) => set({ ambientSound: sound }),
}));
