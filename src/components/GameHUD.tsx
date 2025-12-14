import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { theme } from '../constants/theme';

interface GameHUDProps {
  score: number;
  lives: number;
  streak: number;
  bpm: number;
  round: number;
  beat: number;
  totalBeats: number;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  score,
  lives,
  streak,
  bpm,
  round,
  beat,
  totalBeats,
}) => {
  return (
    <View style={styles.container}>
      {/* Top row: Lives, BPM, Round */}
      <View style={styles.topRow}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>LIVES</Text>
          <View style={styles.heartsContainer}>
            {Array.from({ length: 3 }).map((_, i) => (
              <Text key={i} style={styles.heart}>
                {i < lives ? '❤️' : '🖤'}
              </Text>
            ))}
          </View>
        </View>

        <View style={styles.centerBox}>
          <Text style={styles.bpmLabel}>BPM</Text>
          <Text style={styles.bpmValue}>{bpm}</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statLabel}>ROUND</Text>
          <Text style={styles.statValue}>{round}</Text>
        </View>
      </View>

      {/* Middle row: Score and Streak */}
      <View style={styles.middleRow}>
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreLabel}>SCORE</Text>
          <Text style={styles.scoreValue}>{score.toLocaleString()}</Text>
        </View>

        {streak > 0 && (
          <View style={styles.streakContainer}>
            <Text style={styles.streakText}>🔥 {streak} STREAK</Text>
          </View>
        )}
      </View>

      {/* Bottom: Progress bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${(beat / totalBeats) * 100}%` },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {beat}/{totalBeats}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  centerBox: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.xs,
  },
  statValue: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.extrabold,
    color: theme.colors.text,
  },
  heartsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  heart: {
    fontSize: 18,
  },
  bpmLabel: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary,
  },
  bpmValue: {
    fontSize: theme.fontSize.huge,
    fontWeight: theme.fontWeight.extrabold,
    color: theme.colors.primary,
  },
  middleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    gap: theme.spacing.md,
  },
  scoreContainer: {
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textMuted,
  },
  scoreValue: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.extrabold,
    color: theme.colors.text,
  },
  streakContainer: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
  },
  streakText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.extrabold,
    color: theme.colors.textDark,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
  },
  progressText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textMuted,
    minWidth: 40,
  },
});
