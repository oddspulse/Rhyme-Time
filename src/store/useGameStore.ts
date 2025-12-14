import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Settings,
  HighScore,
  DailyChallenge,
  CalibrationData,
  InputMode,
} from '../types';

interface GameStore {
  // Settings
  settings: Settings;
  updateSettings: (settings: Partial<Settings>) => Promise<void>;
  setInputMode: (mode: InputMode) => Promise<void>;
  setSelectedPack: (packId: string) => Promise<void>;
  setCalibration: (calibration: CalibrationData) => Promise<void>;

  // High scores
  highScores: HighScore[];
  addHighScore: (score: HighScore) => Promise<void>;
  getHighScoresForPack: (packId: string) => HighScore[];

  // Daily challenge
  dailyChallenge: DailyChallenge | null;
  setDailyChallenge: (challenge: DailyChallenge) => Promise<void>;

  // Initialization
  initialized: boolean;
  initialize: () => Promise<void>;
}

const DEFAULT_SETTINGS: Settings = {
  inputMode: 'tap', // Default to tap since voice requires setup
  selectedPackId: 'oon-pack',
  calibration: {
    offset: 0,
    isCalibrated: false,
  },
  musicVolume: 0.7,
  sfxVolume: 0.8,
  hapticsEnabled: true,
};

export const useGameStore = create<GameStore>((set, get) => ({
  settings: DEFAULT_SETTINGS,
  highScores: [],
  dailyChallenge: null,
  initialized: false,

  initialize: async () => {
    try {
      // Load settings
      const settingsJson = await AsyncStorage.getItem('settings');
      if (settingsJson) {
        const settings = JSON.parse(settingsJson);
        set({ settings: { ...DEFAULT_SETTINGS, ...settings } });
      }

      // Load high scores
      const scoresJson = await AsyncStorage.getItem('highScores');
      if (scoresJson) {
        const highScores = JSON.parse(scoresJson);
        set({ highScores });
      }

      // Load daily challenge
      const challengeJson = await AsyncStorage.getItem('dailyChallenge');
      if (challengeJson) {
        const dailyChallenge = JSON.parse(challengeJson);
        set({ dailyChallenge });
      }

      set({ initialized: true });
    } catch (error) {
      console.error('Failed to initialize store:', error);
      set({ initialized: true });
    }
  },

  updateSettings: async (newSettings) => {
    const settings = { ...get().settings, ...newSettings };
    set({ settings });
    await AsyncStorage.setItem('settings', JSON.stringify(settings));
  },

  setInputMode: async (mode) => {
    await get().updateSettings({ inputMode: mode });
  },

  setSelectedPack: async (packId) => {
    await get().updateSettings({ selectedPackId: packId });
  },

  setCalibration: async (calibration) => {
    await get().updateSettings({ calibration });
  },

  addHighScore: async (score) => {
    const highScores = [...get().highScores, score].sort((a, b) => b.score - a.score);
    // Keep top 50
    const trimmed = highScores.slice(0, 50);
    set({ highScores: trimmed });
    await AsyncStorage.setItem('highScores', JSON.stringify(trimmed));
  },

  getHighScoresForPack: (packId) => {
    return get()
      .highScores.filter((score) => score.packId === packId)
      .slice(0, 10);
  },

  setDailyChallenge: async (challenge) => {
    set({ dailyChallenge: challenge });
    await AsyncStorage.setItem('dailyChallenge', JSON.stringify(challenge));
  },
}));
