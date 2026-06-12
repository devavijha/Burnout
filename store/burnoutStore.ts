import { create } from 'zustand';

export interface BurnoutDimension {
  label: string;
  value: number; // 0–100
  weight: number;
}

export interface DailyBurnoutEntry {
  date: string; // YYYY-MM-DD
  score: number;
  dimensions: BurnoutDimension[];
  screenTimeHours: number;
  appSwitches: number;
  lateNightMinutes: number;
  notificationCount: number;
}

export interface HourlyIntensity {
  hour: number;
  value: number;
}

interface BurnoutState {
  currentScore:      number;
  previousScore:     number;
  dimensions:        BurnoutDimension[];
  trend:             'improving' | 'stable' | 'worsening';
  history:           DailyBurnoutEntry[];
  weeklyHeatmap:     HourlyIntensity[][]; // [day][hour]
  lastUpdated:       string | null;
  isCalculating:     boolean;

  // Raw inputs
  screenTimeToday:   number; // hours
  appSwitchesToday:  number;
  lateNightMinsToday: number;
  notificationsToday: number;

  setScore:          (score: number) => void;
  setDimensions:     (dims: BurnoutDimension[]) => void;
  updateRawInputs:   (inputs: Partial<Pick<BurnoutState, 'screenTimeToday' | 'appSwitchesToday' | 'lateNightMinsToday' | 'notificationsToday'>>) => void;
  addHistoryEntry:   (entry: DailyBurnoutEntry) => void;
  setWeeklyHeatmap:  (data: HourlyIntensity[][]) => void;
  setIsCalculating:  (v: boolean) => void;
}

export const useBurnoutStore = create<BurnoutState>((set, get) => ({
  currentScore:       42,
  previousScore:      55,
  dimensions: [
    { label: 'Screen Time',     value: 65, weight: 0.30 },
    { label: 'App Switching',   value: 48, weight: 0.20 },
    { label: 'Late Night Use',  value: 30, weight: 0.25 },
    { label: 'Notifications',   value: 55, weight: 0.25 },
  ],
  trend:              'improving',
  history:            [],
  weeklyHeatmap:      [],
  lastUpdated:        null,
  isCalculating:      false,
  screenTimeToday:    4.5,
  appSwitchesToday:   87,
  lateNightMinsToday: 35,
  notificationsToday: 124,

  setScore: (score) => {
    const prev = get().currentScore;
    const trend =
      score < prev - 3 ? 'improving' :
      score > prev + 3 ? 'worsening' : 'stable';
    set({ currentScore: score, previousScore: prev, trend, lastUpdated: new Date().toISOString() });
  },

  setDimensions: (dims) => set({ dimensions: dims }),

  updateRawInputs: (inputs) => set((s) => ({ ...s, ...inputs })),

  addHistoryEntry: (entry) =>
    set((s) => ({
      history: [entry, ...s.history].slice(0, 90), // keep 90 days
    })),

  setWeeklyHeatmap: (data) => set({ weeklyHeatmap: data }),

  setIsCalculating: (v) => set({ isCalculating: v }),
}));
