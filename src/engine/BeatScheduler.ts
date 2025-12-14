import { GameConfig } from '../types';

export interface BeatTimestamp {
  beatIndex: number;
  timestamp: number; // ms
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

  /**
   * Initialize the scheduler with current audio time
   */
  initialize(audioPositionMs: number, calibrationOffset = 0): void {
    this.startTime = audioPositionMs;
    this.calibrationOffset = calibrationOffset;
    this.currentBeatIndex = 0;
    this.generateBeatTimestamps();
  }

  /**
   * Pre-compute all beat timestamps for the round
   */
  private generateBeatTimestamps(): void {
    this.beatTimestamps = [];
    let currentBPM = this.bpm;
    let cumulativeTime = this.startTime;

    for (let i = 0; i < this.config.beatsPerRound; i++) {
      // Apply in-round BPM ramp
      if (
        this.config.inRoundBpmRamp > 0 &&
        i > 0 &&
        i % this.config.inRoundBpmRampInterval === 0
      ) {
        currentBPM += this.config.inRoundBpmRamp;
      }

      const beatDuration = (60 / currentBPM) * 1000; // ms per beat

      this.beatTimestamps.push({
        beatIndex: i,
        timestamp: cumulativeTime,
        bpm: currentBPM,
      });

      cumulativeTime += beatDuration;
    }
  }

  /**
   * Get the next beat that should trigger based on current audio position
   */
  getNextBeat(audioPositionMs: number): BeatTimestamp | null {
    if (this.currentBeatIndex >= this.beatTimestamps.length) {
      return null;
    }

    const nextBeat = this.beatTimestamps[this.currentBeatIndex];
    const adjustedAudioPosition = audioPositionMs + this.calibrationOffset;

    // Check if we've reached or passed the next beat
    if (adjustedAudioPosition >= nextBeat.timestamp) {
      this.currentBeatIndex++;
      return nextBeat;
    }

    return null;
  }

  /**
   * Judge the timing of a user input
   */
  judgeInput(
    audioPositionMs: number,
    targetBeatIndex: number
  ): 'perfect' | 'good' | 'miss' {
    const beat = this.beatTimestamps[targetBeatIndex];
    if (!beat) return 'miss';

    const adjustedAudioPosition = audioPositionMs + this.calibrationOffset;
    const timeDiff = Math.abs(adjustedAudioPosition - beat.timestamp);

    if (timeDiff <= this.config.perfectWindow) {
      return 'perfect';
    } else if (timeDiff <= this.config.goodWindow) {
      return 'good';
    } else {
      return 'miss';
    }
  }

  /**
   * Get current beat index
   */
  getCurrentBeatIndex(): number {
    return this.currentBeatIndex;
  }

  /**
   * Get total beats
   */
  getTotalBeats(): number {
    return this.beatTimestamps.length;
  }

  /**
   * Get beat timestamp by index
   */
  getBeatTimestamp(index: number): BeatTimestamp | undefined {
    return this.beatTimestamps[index];
  }

  /**
   * Reset the scheduler
   */
  reset(): void {
    this.currentBeatIndex = 0;
    this.beatTimestamps = [];
  }

  /**
   * Get expected beat time for a given index
   */
  getExpectedBeatTime(beatIndex: number): number {
    return this.beatTimestamps[beatIndex]?.timestamp ?? 0;
  }
}
