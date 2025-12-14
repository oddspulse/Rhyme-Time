import { GameConfig } from '../types';

export interface BeatTimestamp {
  beatIndex: number;
  timestamp: number;
  bpm: number;
}

export class BeatScheduler {
  private beatTimestamps: BeatTimestamp[] = [];
  private currentBeatIndex = 0;
  private startTime = 0;
  private calibrationOffset = 0;

  constructor(
    private bpm: number,
    private config: GameConfig
  ) {}

  initialize(startTimeMs: number, calibrationOffset = 0): void {
    this.startTime = startTimeMs;
    this.calibrationOffset = calibrationOffset;
    this.currentBeatIndex = 0;
    this.generateBeatTimestamps();
  }

  private generateBeatTimestamps(): void {
    this.beatTimestamps = [];
    let currentBPM = this.bpm;
    let cumulativeTime = this.startTime;

    for (let i = 0; i < this.config.beatsPerRound; i++) {
      if (
        this.config.inRoundBpmRamp > 0 &&
        i > 0 &&
        i % this.config.inRoundBpmRampInterval === 0
      ) {
        currentBPM += this.config.inRoundBpmRamp;
      }

      const beatDuration = (60 / currentBPM) * 1000;

      this.beatTimestamps.push({
        beatIndex: i,
        timestamp: cumulativeTime,
        bpm: currentBPM,
      });

      cumulativeTime += beatDuration;
    }
  }

  getNextBeat(currentTimeMs: number): BeatTimestamp | null {
    if (this.currentBeatIndex >= this.beatTimestamps.length) {
      return null;
    }

    const nextBeat = this.beatTimestamps[this.currentBeatIndex];
    const adjustedTime = currentTimeMs + this.calibrationOffset;

    if (adjustedTime >= nextBeat.timestamp) {
      this.currentBeatIndex++;
      return nextBeat;
    }

    return null;
  }

  judgeInput(currentTimeMs: number, targetBeatIndex: number): 'perfect' | 'good' | 'miss' {
    const beat = this.beatTimestamps[targetBeatIndex];
    if (!beat) return 'miss';

    const adjustedTime = currentTimeMs + this.calibrationOffset;
    const timeDiff = Math.abs(adjustedTime - beat.timestamp);

    if (timeDiff <= this.config.perfectWindow) {
      return 'perfect';
    } else if (timeDiff <= this.config.goodWindow) {
      return 'good';
    } else {
      return 'miss';
    }
  }

  getCurrentBeatIndex(): number {
    return this.currentBeatIndex;
  }

  getTotalBeats(): number {
    return this.beatTimestamps.length;
  }

  reset(): void {
    this.currentBeatIndex = 0;
    this.beatTimestamps = [];
  }
}
