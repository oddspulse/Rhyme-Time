import React, { useRef } from 'react';
import { StyleSheet, Text, View, Alert, Share } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import ViewShot from 'react-native-view-shot';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { theme } from '../src/constants/theme';
import { Button } from '../src/components/Button';

export default function ResultsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const viewShotRef = useRef<ViewShot>(null);

  const score = parseInt(params.score as string) || 0;
  const bpm = parseInt(params.bpm as string) || 0;
  const accuracy = parseInt(params.accuracy as string) || 0;
  const won = params.won === 'true';

  const handleShare = async () => {
    try {
      // Capture screenshot of results
      const uri = await viewShotRef.current?.capture?.();
      if (uri) {
        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
          await Sharing.shareAsync(uri, {
            mimeType: 'image/png',
            dialogTitle: 'Share your Rhyme Time score!',
          });
        } else {
          // Fallback to text share
          await Share.share({
            message: `I just scored ${score.toLocaleString()} points in Rhyme Time! 🎵 Reached ${bpm} BPM with ${accuracy}% accuracy!`,
          });
        }
      }
    } catch (error) {
      console.error('Share failed:', error);
      Alert.alert('Error', 'Failed to share results');
    }
  };

  const handlePlayAgain = () => {
    router.replace('/mode-select');
  };

  const handleHome = () => {
    router.replace('/');
  };

  return (
    <LinearGradient
      colors={[theme.colors.backgroundGradientStart, theme.colors.backgroundGradientEnd]}
      style={styles.container}
    >
      <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1.0 }}>
        <View style={styles.content}>
          {/* Result Header */}
          <View style={styles.header}>
            <Text style={styles.resultEmoji}>{won ? '🎉' : '💪'}</Text>
            <Text style={styles.resultTitle}>
              {won ? 'AMAZING!' : 'GOOD TRY!'}
            </Text>
            <Text style={styles.resultSubtitle}>
              {won
                ? 'You completed all rounds!'
                : 'Keep practicing to go further!'}
            </Text>
          </View>

          {/* Stats Cards */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statEmoji}>🎯</Text>
              <Text style={styles.statValue}>{score.toLocaleString()}</Text>
              <Text style={styles.statLabel}>SCORE</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statEmoji}>⚡</Text>
              <Text style={styles.statValue}>{bpm}</Text>
              <Text style={styles.statLabel}>MAX BPM</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statEmoji}>✓</Text>
              <Text style={styles.statValue}>{accuracy}%</Text>
              <Text style={styles.statLabel}>ACCURACY</Text>
            </View>
          </View>

          {/* Performance Badge */}
          <View style={styles.badgeContainer}>
            {accuracy >= 90 && (
              <View style={[styles.badge, styles.badgePerfect]}>
                <Text style={styles.badgeText}>⭐ MASTER ⭐</Text>
              </View>
            )}
            {accuracy >= 70 && accuracy < 90 && (
              <View style={[styles.badge, styles.badgeGood]}>
                <Text style={styles.badgeText}>🔥 ON FIRE 🔥</Text>
              </View>
            )}
            {accuracy < 70 && (
              <View style={[styles.badge, styles.badgeKeepGoing]}>
                <Text style={styles.badgeText}>💪 KEEP GOING 💪</Text>
              </View>
            )}
          </View>
        </View>
      </ViewShot>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <Button
          title="🔄 PLAY AGAIN"
          onPress={handlePlayAgain}
          size="large"
        />

        <Button
          title="📤 SHARE"
          onPress={handleShare}
          variant="secondary"
          size="medium"
        />

        <Button
          title="← HOME"
          onPress={handleHome}
          variant="outline"
          size="small"
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.xl,
    paddingTop: 60,
  },
  content: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xxl,
  },
  resultEmoji: {
    fontSize: 80,
    marginBottom: theme.spacing.md,
  },
  resultTitle: {
    fontSize: theme.fontSize.huge,
    fontWeight: theme.fontWeight.extrabold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },
  resultSubtitle: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.textMuted,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.card,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.xl,
    alignItems: 'center',
    ...theme.shadows.medium,
  },
  statEmoji: {
    fontSize: 32,
    marginBottom: theme.spacing.sm,
  },
  statValue: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.extrabold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textMuted,
  },
  badgeContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  badge: {
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.full,
  },
  badgePerfect: {
    backgroundColor: theme.colors.perfect,
  },
  badgeGood: {
    backgroundColor: theme.colors.good,
  },
  badgeKeepGoing: {
    backgroundColor: theme.colors.secondary,
  },
  badgeText: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.extrabold,
    color: theme.colors.textDark,
  },
  actions: {
    gap: theme.spacing.md,
  },
});
