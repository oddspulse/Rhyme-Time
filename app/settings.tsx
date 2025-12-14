import React from 'react';
import { StyleSheet, Text, View, Switch, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { theme } from '../src/constants/theme';
import { Button } from '../src/components/Button';
import { useGameStore } from '../src/store/useGameStore';

export default function SettingsScreen() {
  const router = useRouter();
  const settings = useGameStore((state) => state.settings);
  const updateSettings = useGameStore((state) => state.updateSettings);
  const isCalibrated = useGameStore(
    (state) => state.settings.calibration.isCalibrated
  );

  return (
    <LinearGradient
      colors={[theme.colors.backgroundGradientStart, theme.colors.backgroundGradientEnd]}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>SETTINGS</Text>

        {/* Audio Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AUDIO</Text>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Music Volume</Text>
            <Text style={styles.settingValue}>
              {Math.round(settings.musicVolume * 100)}%
            </Text>
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>SFX Volume</Text>
            <Text style={styles.settingValue}>
              {Math.round(settings.sfxVolume * 100)}%
            </Text>
          </View>
        </View>

        {/* Feedback Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>FEEDBACK</Text>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Haptic Feedback</Text>
            <Switch
              value={settings.hapticsEnabled}
              onValueChange={(value) =>
                updateSettings({ hapticsEnabled: value })
              }
              trackColor={{
                false: theme.colors.card,
                true: theme.colors.primary,
              }}
              thumbColor={theme.colors.text}
            />
          </View>
        </View>

        {/* Calibration */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CALIBRATION</Text>

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              {isCalibrated
                ? `✓ Calibrated (${settings.calibration.offset}ms offset)`
                : 'Not calibrated - tap the button below to calibrate your device for better timing accuracy'}
            </Text>
          </View>

          <Button
            title="CALIBRATE"
            onPress={() => router.push('/calibration')}
            variant="outline"
            size="medium"
          />
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ABOUT</Text>

          <View style={styles.aboutBox}>
            <Text style={styles.aboutTitle}>Rhyme Time v1.0.0</Text>
            <Text style={styles.aboutText}>
              Say the word on beat! Inspired by viral TikTok challenges.
            </Text>
            <Text style={styles.aboutText}>
              Built with React Native & Expo
            </Text>
          </View>
        </View>

        <Button
          title="← BACK"
          onPress={() => router.back()}
          variant="outline"
          size="small"
          style={styles.backButton}
        />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: theme.spacing.xl,
    paddingTop: 60,
  },
  title: {
    fontSize: theme.fontSize.huge,
    fontWeight: theme.fontWeight.extrabold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xl,
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
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
  },
  settingLabel: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
  },
  settingValue: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary,
  },
  infoBox: {
    backgroundColor: theme.colors.cardActive,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
  },
  infoText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
    lineHeight: 20,
  },
  aboutBox: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
  },
  aboutTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },
  aboutText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.xs,
  },
  backButton: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.xxl,
  },
});
