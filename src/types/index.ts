export interface RhymeItem {
  word: string;
  imageAsset: string;
  phoneticHint: string;
  rhymeGroupId: string;
}

export interface RhymePack {
  id: string;
  name: string;
  difficulty: 'easy' | 'medium' | 'hard';
  bpmStart: number;
  items: RhymeItem[];
}

export interface PacksData {
  packs: RhymePack[];
}

export type JudgementType = 'perfect' | 'good' | 'miss';

export interface BeatResult {
  beatIndex: number;
  judgement: JudgementType;
  timestamp: number;
  word?: string;
}

export interface GameState {
  roundNumber: number;
  beatNumber: number;
  currentBPM: number;
  lives: number;
  score: number;
  streak: number;
  bestStreak: number;
  results: BeatResult[];
  isPlaying: boolean;
  isPaused: boolean;
}

export interface GameConfig {
  beatsPerRound: number;
  roundsPerRun: number;
  startingLives: number;
  bpmIncrement: number;
  inRoundBpmRamp: number;
  inRoundBpmRampInterval: number;
  perfectWindow: number; // ms
  goodWindow: number; // ms
}

export interface CalibrationData {
  offset: number; // ms
  isCalibrated: boolean;
}

export type InputMode = 'voice' | 'tap';

export interface Settings {
  inputMode: InputMode;
  selectedPackId: string;
  calibration: CalibrationData;
  musicVolume: number;
  sfxVolume: number;
  hapticsEnabled: boolean;
}

export interface HighScore {
  score: number;
  bpm: number;
  accuracy: number;
  date: number;
  packId: string;
}

export interface DailyChallenge {
  date: string;
  seed: number;
  packId: string;
  highScore?: HighScore;
}
