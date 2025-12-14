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

export interface HighScore {
  score: number;
  bpm: number;
  accuracy: number;
  date: number;
  packId: string;
}

export type GameEventType = 'beat' | 'round-complete' | 'game-over' | 'game-complete' | 'judgement';
