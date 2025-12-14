import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { theme } from '../src/constants/theme';
import { Button } from '../src/components/Button';
import { useGameStore } from '../src/store/useGameStore';
import packsData from '../src/data/packs.json';

export default function HomeScreen() {
  const router = useRouter();
  const selectedPackId = useGameStore((state) => state.settings.selectedPackId);
  const setSelectedPack = useGameStore((state) => state.setSelectedPack);
  const highScores = useGameStore((state) => state.highScores);

  const selectedPack = packsData.packs.find((p) => p.id === selectedPackId);

  const topScore = highScores
    .filter((s) => s.packId === selectedPackId)
    .sort((a, b) => b.score - a.score)[0];

  return (
    <LinearGradient
      colors={[theme.colors.backgroundGradientStart, theme.colors.backgroundGradientEnd]}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Title */}
        <View style={styles.header}>
          <Text style={styles.title}>RHYME</Text>
          <Text style={[styles.title, styles.titleAccent]}>TIME</Text>
          <Text style={styles.subtitle}>Say the word on beat!</Text>
        </View>

        {/* Main Actions */}
        <View style={styles.actions}>
          <Button
            title="PLAY"
            onPress={() => router.push('/mode-select')}
            size="large"
            style={styles.playButton}
          />

          <Button
            title="DAILY CHALLENGE"
            onPress={() => router.push('/daily-challenge')}
            variant="secondary"
            size="medium"
          />
        </View>

        {/* Pack Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SELECT PACK</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {packsData.packs.map((pack) => (
              <PackCard
                key={pack.id}
                pack={pack}
                isSelected={pack.id === selectedPackId}
                onPress={() => setSelectedPack(pack.id)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Stats */}
        {topScore && (
          <View style={styles.statsContainer}>
            <Text style={styles.sectionTitle}>YOUR BEST ({selectedPack?.name})</Text>
            <View style={styles.statsGrid}>
              <StatBox label="Score" value={topScore.score.toLocaleString()} />
              <StatBox label="BPM" value={topScore.bpm.toString()} />
              <StatBox label="Accuracy" value={`${topScore.accuracy}%`} />
            </View>
          </View>
        )}

        {/* Secondary Actions */}
        <View style={styles.secondaryActions}>
          <Button
            title="Settings"
            onPress={() => router.push('/settings')}
            variant="outline"
            size="small"
          />
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

interface PackCardProps {
  pack: any;
  isSelected: boolean;
  onPress: () => void;
}

function PackCard({ pack, isSelected, onPress }: PackCardProps) {
  return (
    <View
      style={[
        styles.packCard,
        isSelected && styles.packCardSelected,
      ]}
      onTouchEnd={onPress}
    >
      <Text style={styles.packName}>{pack.name}</Text>
      <Text style={styles.packDifficulty}>{pack.difficulty.toUpperCase()}</Text>
      <Text style={styles.packBpm}>Start: {pack.bpmStart} BPM</Text>
    </View>
  );
}

interface StatBoxProps {
  label: string;
  value: string;
}

function StatBox({ label, value }: StatBoxProps) {
  return (
    <View style={styles.statBox}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.xl,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xxl,
  },
  title: {
    fontSize: 56,
    fontWeight: theme.fontWeight.extrabold,
    color: theme.colors.text,
    letterSpacing: 2,
  },
  titleAccent: {
    color: theme.colors.primary,
  },
  subtitle: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.sm,
  },
  actions: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  playButton: {
    paddingVertical: theme.spacing.xl,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.md,
  },
  packCard: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    marginRight: theme.spacing.md,
    minWidth: 160,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  packCardSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.cardActive,
  },
  packName: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  packDifficulty: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.sm,
  },
  packBpm: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.semibold,
  },
  statsContainer: {
    marginBottom: theme.spacing.xl,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  statBox: {
    flex: 1,
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.xs,
  },
  statValue: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.extrabold,
    color: theme.colors.primary,
  },
  secondaryActions: {
    marginTop: theme.spacing.lg,
  },
});
