import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { theme } from '../src/constants/theme';
import { GameEngine } from '../src/engine/GameEngine';
import { GameHUD } from '../src/components/GameHUD';
import { RhymeCard } from '../src/components/RhymeCard';
import { JudgementFeedback } from '../src/components/JudgementFeedback';
import { useGameStore } from '../src/store/useGameStore';
import { GameState, JudgementType, RhymeItem } from '../src/types';
import packsData from '../src/data/packs.json';

export default function GameScreen() {
  const router = useRouter();
  const gameEngineRef = useRef<GameEngine | null>(null);

  const selectedPackId = useGameStore((state) => state.settings.selectedPackId);
  const calibrationOffset = useGameStore(
    (state) => state.settings.calibration.offset
  );
  const hapticsEnabled = useGameStore((state) => state.settings.hapticsEnabled);
  const addHighScore = useGameStore((state) => state.addHighScore);

  const [gameState, setGameState] = useState<GameState | null>(null);
  const [currentCards, setCurrentCards] = useState<RhymeItem[]>([]);
  const [targetIndex, setTargetIndex] = useState<number>(0);
  const [currentJudgement, setCurrentJudgement] = useState<JudgementType | null>(null);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    startGame();

    return () => {
      // Cleanup
      if (gameEngineRef.current) {
        gameEngineRef.current.destroy();
      }
    };
  }, []);

  const startGame = async () => {
    try {
      const pack = packsData.packs.find((p) => p.id === selectedPackId);
      if (!pack) {
        Alert.alert('Error', 'Pack not found');
        router.back();
        return;
      }

      // Create game engine
      const engine = new GameEngine(pack, calibrationOffset);
      gameEngineRef.current = engine;

      // Set up event listeners
      engine.on('beat', (data) => {
        setTargetIndex(data.targetIndex);
        if (hapticsEnabled) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
      });

      engine.on('judgement', (data) => {
        setCurrentJudgement(data.judgement);

        // Haptic feedback based on judgement
        if (hapticsEnabled) {
          if (data.judgement === 'perfect') {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          } else if (data.judgement === 'good') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          } else {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          }
        }
      });

      engine.on('round-complete', () => {
        // Update cards for new round
        setCurrentCards(engine.getCurrentCards());
      });

      engine.on('game-over', async (data) => {
        await handleGameEnd(data, false);
      });

      engine.on('game-complete', async (data) => {
        await handleGameEnd(data, true);
      });

      // Start the game (audio optional - will use timer if not available)
      try {
        await engine.start(require('../assets/audio/beat-loop-1.mp3'));
      } catch (error) {
        // Audio file not found - run without audio (timer-based)
        console.log('No audio file found, running in silent mode');
        await engine.start();
      }

      // Initialize UI state
      setGameState(engine.getState());
      setCurrentCards(engine.getCurrentCards());
      setGameStarted(true);

      // Update game state periodically
      const interval = setInterval(() => {
        if (gameEngineRef.current) {
          setGameState(gameEngineRef.current.getState());
        }
      }, 100);

      return () => clearInterval(interval);
    } catch (error) {
      console.error('Failed to start game:', error);
      Alert.alert('Error', 'Failed to start game');
      router.back();
    }
  };

  const handleGameEnd = async (
    data: { finalScore: number; finalBPM: number; accuracy: number },
    won: boolean
  ) => {
    // Save high score
    await addHighScore({
      score: data.finalScore,
      bpm: data.finalBPM,
      accuracy: data.accuracy,
      date: Date.now(),
      packId: selectedPackId,
    });

    // Navigate to results with params
    router.replace({
      pathname: '/results',
      params: {
        score: data.finalScore.toString(),
        bpm: data.finalBPM.toString(),
        accuracy: data.accuracy.toString(),
        won: won.toString(),
      },
    });
  };

  const handleCardPress = (word: string) => {
    if (gameEngineRef.current) {
      gameEngineRef.current.handleInput(word);
    }
  };

  if (!gameState || !gameStarted) {
    return (
      <LinearGradient
        colors={[theme.colors.backgroundGradientStart, theme.colors.backgroundGradientEnd]}
        style={styles.container}
      >
        <View style={styles.loading}>
          {/* Loading state could be enhanced */}
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={[theme.colors.backgroundGradientStart, theme.colors.backgroundGradientEnd]}
      style={styles.container}
    >
      {/* HUD */}
      <GameHUD
        score={gameState.score}
        lives={gameState.lives}
        streak={gameState.streak}
        bpm={gameState.currentBPM}
        round={gameState.roundNumber}
        beat={gameState.beatNumber}
        totalBeats={16}
      />

      {/* Game Grid */}
      <View style={styles.gridContainer}>
        <View style={styles.grid}>
          {currentCards.map((item, index) => (
            <RhymeCard
              key={`${item.word}-${index}`}
              item={item}
              isActive={index === targetIndex}
              onPress={() => handleCardPress(item.word)}
            />
          ))}
        </View>
      </View>

      {/* Judgement Feedback Overlay */}
      <JudgementFeedback
        judgement={currentJudgement}
        onComplete={() => setCurrentJudgement(null)}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: theme.spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
  },
});
