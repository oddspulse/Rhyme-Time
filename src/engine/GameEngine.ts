import { Audio, AVPlaybackStatus } from 'expo-av';
import { GameConfig, GameState, BeatResult, RhymePack, RhymeItem } from '../types';
import { BeatScheduler } from './BeatScheduler';

export type GameEventType =
  | 'beat'
  | 'round-complete'
  | 'game-over'
  | 'game-complete'
  | 'judgement';

export interface GameEvent {
  type: GameEventType;
  data?: any;
}

export class GameEngine {
  private state: GameState;
  private config: GameConfig;
  private scheduler: BeatScheduler | null = null;
  private sound: Audio.Sound | null = null;
  private animationFrameId: number | null = null;
  private eventCallbacks: Map<GameEventType, ((data: any) => void)[]> = new Map();
  private currentCards: RhymeItem[] = [];
  private currentTargetIndex = 0;
  private pack: RhymePack;
  private calibrationOffset: number;

  constructor(pack: RhymePack, calibrationOffset = 0) {
    this.pack = pack;
    this.calibrationOffset = calibrationOffset;

    // Default config matching specs
    this.config = {
      beatsPerRound: 16,
      roundsPerRun: 3,
      startingLives: 3,
      bpmIncrement: 8,
      inRoundBpmRamp: 1,
      inRoundBpmRampInterval: 8,
      perfectWindow: 80,
      goodWindow: 150,
    };

    this.state = this.createInitialState();
  }

  private createInitialState(): GameState {
    return {
      roundNumber: 1,
      beatNumber: 0,
      currentBPM: this.pack.bpmStart,
      lives: this.config.startingLives,
      score: 0,
      streak: 0,
      bestStreak: 0,
      results: [],
      isPlaying: false,
      isPaused: false,
    };
  }

  /**
   * Start the game
   */
  async start(audioFile: any): Promise<void> {
    // Load audio
    const { sound } = await Audio.Sound.createAsync(
      audioFile,
      { shouldPlay: false, isLooping: true, volume: 0.7 },
      this.onPlaybackStatusUpdate.bind(this)
    );
    this.sound = sound;

    // Setup first round
    this.setupRound();

    // Start playback
    await sound.playAsync();
    this.state.isPlaying = true;

    // Start game loop
    this.startGameLoop();
  }

  /**
   * Setup a new round
   */
  private setupRound(): void {
    // Select 8 random items from the pack
    this.currentCards = this.selectRandomItems(8);

    // Initialize beat scheduler for this round
    this.scheduler = new BeatScheduler(this.state.currentBPM, this.config);

    // Reset beat number
    this.state.beatNumber = 0;
  }

  /**
   * Select random items from pack
   */
  private selectRandomItems(count: number): RhymeItem[] {
    const shuffled = [...this.pack.items].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, shuffled.length));
  }

  /**
   * Main game loop
   */
  private startGameLoop(): void {
    const loop = async () => {
      if (!this.state.isPlaying || this.state.isPaused) {
        return;
      }

      const status = await this.sound?.getStatusAsync();
      if (status && status.isLoaded && this.scheduler) {
        const audioPositionMs = status.positionMillis;

        // Initialize scheduler on first beat
        if (this.state.beatNumber === 0 && !this.scheduler.getCurrentBeatIndex()) {
          this.scheduler.initialize(audioPositionMs, this.calibrationOffset);
        }

        // Check for next beat
        const nextBeat = this.scheduler.getNextBeat(audioPositionMs);
        if (nextBeat) {
          this.onBeat(nextBeat.beatIndex);
        }
      }

      this.animationFrameId = requestAnimationFrame(loop);
    };

    this.animationFrameId = requestAnimationFrame(loop);
  }

  /**
   * Called when a beat occurs
   */
  private onBeat(beatIndex: number): void {
    this.state.beatNumber++;

    // Select next target card
    this.currentTargetIndex = Math.floor(Math.random() * this.currentCards.length);

    // Emit beat event
    this.emit('beat', {
      beatIndex,
      targetIndex: this.currentTargetIndex,
      targetWord: this.currentCards[this.currentTargetIndex].word,
    });

    // Check if round is complete
    if (this.state.beatNumber >= this.config.beatsPerRound) {
      this.completeRound();
    }
  }

  /**
   * Handle user input (tap or voice)
   */
  async handleInput(word: string): Promise<void> {
    if (!this.scheduler || !this.state.isPlaying) return;

    const status = await this.sound?.getStatusAsync();
    if (!status || !status.isLoaded) return;

    const audioPositionMs = status.positionMillis;
    const currentBeatIndex = this.state.beatNumber - 1;

    // Normalize word
    const normalizedWord = this.normalizeWord(word);
    const expectedWord = this.normalizeWord(
      this.currentCards[this.currentTargetIndex].word
    );

    // Check if word matches
    const isCorrectWord = normalizedWord === expectedWord;

    // Judge timing
    const judgement = isCorrectWord
      ? this.scheduler.judgeInput(audioPositionMs, currentBeatIndex)
      : 'miss';

    // Calculate score
    const points = this.calculatePoints(judgement);

    // Update state
    if (judgement === 'perfect' || judgement === 'good') {
      this.state.score += points;
      this.state.streak++;
      this.state.bestStreak = Math.max(this.state.bestStreak, this.state.streak);
    } else {
      this.state.streak = 0;
      this.state.lives--;
    }

    // Record result
    const result: BeatResult = {
      beatIndex: currentBeatIndex,
      judgement,
      timestamp: audioPositionMs,
      word: normalizedWord,
    };
    this.state.results.push(result);

    // Emit judgement event
    this.emit('judgement', { judgement, points, word: normalizedWord });

    // Check game over
    if (this.state.lives <= 0) {
      this.gameOver();
    }
  }

  /**
   * Normalize word for matching
   */
  private normalizeWord(word: string): string {
    return word
      .toLowerCase()
      .trim()
      .replace(/[.,!?;:]$/g, '') // Remove trailing punctuation
      .replace(/s$/, ''); // Basic plural handling
  }

  /**
   * Calculate points based on judgement
   */
  private calculatePoints(judgement: 'perfect' | 'good' | 'miss'): number {
    const basePoints = {
      perfect: 100,
      good: 50,
      miss: 0,
    };

    const streakMultiplier = 1 + Math.floor(this.state.streak / 5) * 0.1;
    return Math.floor(basePoints[judgement] * streakMultiplier);
  }

  /**
   * Complete current round
   */
  private completeRound(): void {
    this.emit('round-complete', {
      roundNumber: this.state.roundNumber,
      score: this.state.score,
    });

    // Check if game is complete
    if (this.state.roundNumber >= this.config.roundsPerRun) {
      this.gameComplete();
      return;
    }

    // Move to next round
    this.state.roundNumber++;
    this.state.currentBPM += this.config.bpmIncrement;
    this.setupRound();
  }

  /**
   * Game complete (won)
   */
  private gameComplete(): void {
    this.state.isPlaying = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    this.emit('game-complete', {
      finalScore: this.state.score,
      finalBPM: this.state.currentBPM,
      accuracy: this.calculateAccuracy(),
    });

    this.cleanup();
  }

  /**
   * Game over (lost)
   */
  private gameOver(): void {
    this.state.isPlaying = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    this.emit('game-over', {
      finalScore: this.state.score,
      finalBPM: this.state.currentBPM,
      accuracy: this.calculateAccuracy(),
    });

    this.cleanup();
  }

  /**
   * Calculate accuracy percentage
   */
  private calculateAccuracy(): number {
    if (this.state.results.length === 0) return 0;

    const successfulHits = this.state.results.filter(
      (r) => r.judgement === 'perfect' || r.judgement === 'good'
    ).length;

    return Math.round((successfulHits / this.state.results.length) * 100);
  }

  /**
   * Cleanup resources
   */
  private async cleanup(): Promise<void> {
    if (this.sound) {
      await this.sound.stopAsync();
      await this.sound.unloadAsync();
      this.sound = null;
    }
  }

  /**
   * Playback status update handler
   */
  private onPlaybackStatusUpdate(status: AVPlaybackStatus): void {
    // Handle any playback status changes if needed
  }

  /**
   * Event system
   */
  on(event: GameEventType, callback: (data: any) => void): void {
    if (!this.eventCallbacks.has(event)) {
      this.eventCallbacks.set(event, []);
    }
    this.eventCallbacks.get(event)!.push(callback);
  }

  private emit(event: GameEventType, data?: any): void {
    const callbacks = this.eventCallbacks.get(event);
    if (callbacks) {
      callbacks.forEach((cb) => cb(data));
    }
  }

  /**
   * Get current state (readonly)
   */
  getState(): Readonly<GameState> {
    return { ...this.state };
  }

  /**
   * Get current cards
   */
  getCurrentCards(): RhymeItem[] {
    return [...this.currentCards];
  }

  /**
   * Get current target index
   */
  getCurrentTargetIndex(): number {
    return this.currentTargetIndex;
  }

  /**
   * Pause/Resume
   */
  async pause(): Promise<void> {
    if (this.sound) {
      await this.sound.pauseAsync();
      this.state.isPaused = true;
    }
  }

  async resume(): Promise<void> {
    if (this.sound) {
      await this.sound.playAsync();
      this.state.isPaused = false;
      this.startGameLoop();
    }
  }

  /**
   * Destroy engine
   */
  async destroy(): Promise<void> {
    this.state.isPlaying = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    await this.cleanup();
    this.eventCallbacks.clear();
  }
}
