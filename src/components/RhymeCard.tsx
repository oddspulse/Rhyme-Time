import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { theme } from '../constants/theme';
import { RhymeItem } from '../types';

interface RhymeCardProps {
  item: RhymeItem;
  isActive: boolean;
  onPress?: () => void;
  disabled?: boolean;
}

export const RhymeCard: React.FC<RhymeCardProps> = ({
  item,
  isActive,
  onPress,
  disabled = false,
}) => {
  const scale = useSharedValue(1);
  const glowOpacity = useSharedValue(0);

  // Trigger animation when card becomes active
  useEffect(() => {
    if (isActive) {
      // Bounce animation
      scale.value = withSequence(
        withSpring(1.06, { damping: 8, stiffness: 200 }),
        withSpring(1.0, { damping: 8, stiffness: 200 })
      );

      // Glow effect
      glowOpacity.value = withSequence(
        withTiming(1, { duration: 100 }),
        withTiming(0, { duration: 300 })
      );
    }
  }, [isActive]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || !isActive}
      activeOpacity={0.8}
      style={styles.container}
    >
      <Animated.View style={[styles.card, animatedStyle]}>
        {/* Glow effect */}
        <Animated.View style={[styles.glow, glowStyle, isActive && styles.glowActive]} />

        {/* Card content */}
        <View style={[styles.content, isActive && styles.contentActive]}>
          {/* Placeholder for image - using emoji for now */}
          <View style={styles.imageContainer}>
            <Text style={styles.emoji}>{getEmojiForWord(item.word)}</Text>
          </View>

          {/* Word label */}
          <Text style={styles.word}>{item.word}</Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

// Helper function to get emoji representation
function getEmojiForWord(word: string): string {
  const emojiMap: Record<string, string> = {
    // -oon pack
    moon: '🌙',
    spoon: '🥄',
    balloon: '🎈',
    raccoon: '🦝',
    cartoon: '📺',
    soon: '⏰',
    noon: '☀️',
    tune: '🎵',
    // -ight pack
    light: '💡',
    kite: '🪁',
    night: '🌃',
    fight: '🥊',
    bright: '✨',
    sight: '👁️',
    bite: '🦷',
    write: '✍️',
    // -ake pack
    cake: '🎂',
    snake: '🐍',
    lake: '🏞️',
    rake: '🍂',
    shake: '🥤',
    break: '💔',
    wake: '⏰',
    make: '🔨',
    // -ear pack
    ear: '👂',
    gear: '⚙️',
    near: '📍',
    deer: '🦌',
    fear: '😱',
    clear: '🔍',
    year: '📅',
    cheer: '🎉',
  };

  return emojiMap[word.toLowerCase()] || '❓';
}

const styles = StyleSheet.create({
  container: {
    width: '23%',
    aspectRatio: 1,
    padding: 2,
  },
  card: {
    flex: 1,
    position: 'relative',
  },
  glow: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primary,
    opacity: 0,
  },
  glowActive: {
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 12,
  },
  content: {
    flex: 1,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xs,
  },
  contentActive: {
    backgroundColor: theme.colors.cardActive,
    borderColor: theme.colors.primary,
  },
  imageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 32,
  },
  word: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginTop: theme.spacing.xs,
    textAlign: 'center',
  },
});
