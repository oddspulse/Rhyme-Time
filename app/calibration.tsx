import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { theme } from '../src/constants/theme';
import { Button } from '../src/components/Button';
import { useGameStore } from '../src/store/useGameStore';

const CALIBRATION_BEATS = 8;
const TARGET_BPM = 120;
const BEAT_INTERVAL = (60 / TARGET_BPM) * 1000; // ms

export default function CalibrationScreen() {
  const router = useRouter();
  const setCalibration = useGameStore((state) => state.setCalibration);

  const [isCalibrating, setIsCalibrating] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const [result, setResult] = useState<number | null>(null);

  const soundRef = useRef<Audio.Sound | null>(null);
  const startTimeRef = useRef<number>(0);
  const tapsRef = useRef<number[]>([]);
  const beatCountRef = useRef<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startCalibration = async () => {
    try {
      // Load and play metronome sound
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/audio/beat-loop-1.mp3'),
        { shouldPlay: true, isLooping: true, volume: 0.5 }
      );
      soundRef.current = sound;

      // Reset state
      setIsCalibrating(true);
      setTapCount(0);
      setResult(null);
      tapsRef.current = [];
      beatCountRef.current = 0;
      startTimeRef.current = Date.now();

      // Play metronome beats
      intervalRef.current = setInterval(() => {
        beatCountRef.current++;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        if (beatCountRef.current >= CALIBRATION_BEATS + 4) {
          // Stop after calibration beats + buffer
          stopCalibration();
        }
      }, BEAT_INTERVAL);
    } catch (error) {
      console.error('Failed to start calibration:', error);
    }
  };

  const stopCalibration = async () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (soundRef.current) {
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }

    // Calculate offset
    if (tapsRef.current.length >= CALIBRATION_BEATS) {
      const offsets = tapsRef.current.map((tapTime, index) => {
        const expectedTime = startTimeRef.current + index * BEAT_INTERVAL;
        return tapTime - expectedTime;
      });

      // Average offset
      const avgOffset = Math.round(
        offsets.reduce((sum, offset) => sum + offset, 0) / offsets.length
      );

      setResult(avgOffset);
    }

    setIsCalibrating(false);
  };

  const handleTap = () => {
    if (!isCalibrating || tapCount >= CALIBRATION_BEATS) return;

    const tapTime = Date.now();
    tapsRef.current.push(tapTime);
    setTapCount(tapCount + 1);

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleSave = async () => {
    if (result !== null) {
      await setCalibration({
        offset: result,
        isCalibrated: true,
      });
      router.back();
    }
  };

  const handleSkip = () => {
    router.back();
  };

  return (
    <LinearGradient
      colors={[theme.colors.backgroundGradientStart, theme.colors.backgroundGradientEnd]}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>CALIBRATION</Text>

        <View style={styles.instructions}>
          <Text style={styles.instructionText}>
            1. You'll hear a metronome beat
          </Text>
          <Text style={styles.instructionText}>
            2. Tap the button below exactly on each beat
          </Text>
          <Text style={styles.instructionText}>
            3. Tap {CALIBRATION_BEATS} times in sync
          </Text>
          <Text style={styles.instructionText}>
            4. We'll calculate your device's latency
          </Text>
        </View>

        {/* Tap Area */}
        <TouchableOpacity
          style={[
            styles.tapArea,
            isCalibrating && styles.tapAreaActive,
          ]}
          onPress={handleTap}
          disabled={!isCalibrating}
          activeOpacity={0.7}
        >
          <Text style={styles.tapEmoji}>👆</Text>
          <Text style={styles.tapText}>
            {isCalibrating
              ? `TAP ON BEAT (${tapCount}/${CALIBRATION_BEATS})`
              : 'READY'}
          </Text>
        </TouchableOpacity>

        {/* Result */}
        {result !== null && (
          <View style={styles.resultBox}>
            <Text style={styles.resultTitle}>Calibration Complete!</Text>
            <Text style={styles.resultValue}>
              Offset: {result > 0 ? '+' : ''}
              {result}ms
            </Text>
            <Text style={styles.resultDescription}>
              {Math.abs(result) < 20
                ? 'Great! Your device has minimal latency.'
                : 'This offset will be applied to improve timing accuracy.'}
            </Text>
          </View>
        )}

        {/* Actions */}
        <View style={styles.actions}>
          {!isCalibrating && result === null && (
            <Button
              title="START CALIBRATION"
              onPress={startCalibration}
              size="large"
            />
          )}

          {result !== null && (
            <>
              <Button
                title="SAVE & APPLY"
                onPress={handleSave}
                size="large"
              />
              <Button
                title="TRY AGAIN"
                onPress={startCalibration}
                variant="secondary"
                size="medium"
              />
            </>
          )}

          <Button
            title="← SKIP"
            onPress={handleSkip}
            variant="outline"
            size="small"
          />
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: theme.spacing.xl,
    paddingTop: 60,
  },
  title: {
    fontSize: theme.fontSize.huge,
    fontWeight: theme.fontWeight.extrabold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xl,
    textAlign: 'center',
  },
  instructions: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.xl,
  },
  instructionText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    lineHeight: 24,
  },
  tapArea: {
    flex: 1,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.xl,
    borderWidth: 4,
    borderColor: theme.colors.card,
  },
  tapAreaActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.cardActive,
  },
  tapEmoji: {
    fontSize: 80,
    marginBottom: theme.spacing.md,
  },
  tapText: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.extrabold,
    color: theme.colors.text,
  },
  resultBox: {
    backgroundColor: theme.colors.cardActive,
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  resultTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  resultValue: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.extrabold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },
  resultDescription: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
    textAlign: 'center',
  },
  actions: {
    gap: theme.spacing.md,
  },
});
