import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { theme } from '../src/constants/theme';
import { Button } from '../src/components/Button';
import { useGameStore } from '../src/store/useGameStore';

export default function ModeSelectScreen() {
  const router = useRouter();
  const inputMode = useGameStore((state) => state.settings.inputMode);
  const setInputMode = useGameStore((state) => state.setInputMode);

  const handleModeSelect = async (mode: 'tap' | 'voice') => {
    await setInputMode(mode);
    router.push('/game');
  };

  return (
    <LinearGradient
      colors={[theme.colors.backgroundGradientStart, theme.colors.backgroundGradientEnd]}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Header */}
        <Text style={styles.title}>CHOOSE MODE</Text>

        {/* Mode Cards */}
        <View style={styles.modesContainer}>
          {/* Tap Mode */}
          <View style={styles.modeCard}>
            <Text style={styles.modeEmoji}>👆</Text>
            <Text style={styles.modeName}>TAP MODE</Text>
            <Text style={styles.modeDescription}>
              Tap the highlighted card on the beat
            </Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>RECOMMENDED</Text>
            </View>
            <Button
              title="PLAY TAP"
              onPress={() => handleModeSelect('tap')}
              size="medium"
            />
          </View>

          {/* Voice Mode */}
          <View style={styles.modeCard}>
            <Text style={styles.modeEmoji}>🎤</Text>
            <Text style={styles.modeName}>VOICE MODE</Text>
            <Text style={styles.modeDescription}>
              Say the word on the beat (Coming soon - requires dev setup)
            </Text>
            <View style={[styles.badge, styles.badgeComingSoon]}>
              <Text style={styles.badgeText}>COMING SOON</Text>
            </View>
            <Button
              title="PLAY VOICE"
              onPress={() => handleModeSelect('voice')}
              variant="outline"
              size="medium"
              disabled={true}
            />
          </View>
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>💡 Voice Mode Setup</Text>
          <Text style={styles.infoText}>
            Voice recognition requires expo-dev-client. See README for setup instructions.
            For now, enjoy TAP MODE for the full viral challenge experience!
          </Text>
        </View>

        {/* Back Button */}
        <Button
          title="← Back"
          onPress={() => router.back()}
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
    textAlign: 'center',
    marginBottom: theme.spacing.xxl,
  },
  modesContainer: {
    gap: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  modeCard: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.xl,
    alignItems: 'center',
    ...theme.shadows.medium,
  },
  modeEmoji: {
    fontSize: 64,
    marginBottom: theme.spacing.md,
  },
  modeName: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.extrabold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  modeDescription: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  badge: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
    marginBottom: theme.spacing.md,
  },
  badgeComingSoon: {
    backgroundColor: theme.colors.textMuted,
  },
  badgeText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.extrabold,
    color: theme.colors.textDark,
  },
  infoBox: {
    backgroundColor: theme.colors.cardActive,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.xl,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  infoTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  infoText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
    lineHeight: 20,
  },
});
