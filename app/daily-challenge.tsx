import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { theme } from '../src/constants/theme';
import { Button } from '../src/components/Button';
import { useGameStore } from '../src/store/useGameStore';
import packsData from '../src/data/packs.json';

// Simple seed-based daily challenge
function getDailySeed(): number {
  const today = new Date();
  const dateStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash << 5) - hash + dateStr.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash);
}

export default function DailyChallengeScreen() {
  const router = useRouter();
  const dailyChallenge = useGameStore((state) => state.dailyChallenge);
  const setDailyChallenge = useGameStore((state) => state.setDailyChallenge);
  const setSelectedPack = useGameStore((state) => state.setSelectedPack);

  const [todaySeed, setTodaySeed] = useState<number>(0);
  const [challengePack, setChallengePack] = useState<any>(null);

  useEffect(() => {
    const seed = getDailySeed();
    setTodaySeed(seed);

    // Select pack based on seed
    const packIndex = seed % packsData.packs.length;
    const pack = packsData.packs[packIndex];
    setChallengePack(pack);

    // Check if we have a daily challenge for today
    const today = new Date().toISOString().split('T')[0];
    if (!dailyChallenge || dailyChallenge.date !== today) {
      // Create new daily challenge
      setDailyChallenge({
        date: today,
        seed,
        packId: pack.id,
      });
    }
  }, []);

  const handlePlay = async () => {
    if (challengePack) {
      await setSelectedPack(challengePack.id);
      router.push('/mode-select');
    }
  };

  if (!challengePack) {
    return (
      <LinearGradient
        colors={[theme.colors.backgroundGradientStart, theme.colors.backgroundGradientEnd]}
        style={styles.container}
      >
        <View style={styles.loading}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </LinearGradient>
    );
  }

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const todayStr = new Date().toISOString().split('T')[0];
  const todayScore = dailyChallenge?.date === todayStr ? dailyChallenge.highScore : null;

  return (
    <LinearGradient
      colors={[theme.colors.backgroundGradientStart, theme.colors.backgroundGradientEnd]}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>DAILY CHALLENGE</Text>

        <View style={styles.dateBox}>
          <Text style={styles.dateEmoji}>📅</Text>
          <Text style={styles.dateText}>{today}</Text>
        </View>

        <View style={styles.challengeBox}>
          <Text style={styles.challengeLabel}>TODAY'S PACK</Text>
          <Text style={styles.challengePack}>{challengePack.name}</Text>
          <Text style={styles.challengeDifficulty}>
            {challengePack.difficulty.toUpperCase()} • {challengePack.bpmStart} BPM
          </Text>

          <View style={styles.seedBox}>
            <Text style={styles.seedText}>Seed: #{todaySeed}</Text>
          </View>
        </View>

        {todayScore && (
          <View style={styles.scoreBox}>
            <Text style={styles.scoreLabel}>YOUR SCORE TODAY</Text>
            <Text style={styles.scoreValue}>
              {todayScore.score.toLocaleString()}
            </Text>
            <Text style={styles.scoreDetails}>
              {todayScore.bpm} BPM • {todayScore.accuracy}% Accuracy
            </Text>
          </View>
        )}

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            💡 Everyone gets the same challenge today! Come back tomorrow for a new
            one.
          </Text>
        </View>

        <View style={styles.actions}>
          <Button
            title={todayScore ? 'PLAY AGAIN' : 'START CHALLENGE'}
            onPress={handlePlay}
            size="large"
          />

          <Button
            title="← BACK"
            onPress={() => router.back()}
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
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.textMuted,
  },
  title: {
    fontSize: theme.fontSize.huge,
    fontWeight: theme.fontWeight.extrabold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xl,
    textAlign: 'center',
  },
  dateBox: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  dateEmoji: {
    fontSize: 48,
    marginBottom: theme.spacing.sm,
  },
  dateText: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.textMuted,
  },
  challengeBox: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.xl,
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    ...theme.shadows.medium,
  },
  challengeLabel: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.sm,
  },
  challengePack: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.extrabold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  challengeDifficulty: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  seedBox: {
    backgroundColor: theme.colors.cardActive,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
  },
  seedText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
    fontWeight: theme.fontWeight.semibold,
  },
  scoreBox: {
    backgroundColor: theme.colors.cardActive,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  scoreLabel: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.sm,
  },
  scoreValue: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.extrabold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  scoreDetails: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
  },
  infoBox: {
    backgroundColor: theme.colors.cardActive,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.xl,
  },
  infoText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
    lineHeight: 20,
    textAlign: 'center',
  },
  actions: {
    gap: theme.spacing.md,
  },
});
