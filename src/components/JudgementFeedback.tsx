import React, { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withTiming,
  withDelay,
  runOnJS,
} from 'react-native-reanimated';
import { theme } from '../constants/theme';
import { JudgementType } from '../types';

interface JudgementFeedbackProps {
  judgement: JudgementType | null;
  onComplete?: () => void;
}

export const JudgementFeedback: React.FC<JudgementFeedbackProps> = ({
  judgement,
  onComplete,
}) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const rotation = useSharedValue(0);

  useEffect(() => {
    if (judgement) {
      // Entry animation
      scale.value = 0;
      opacity.value = 0;
      rotation.value = -10;

      scale.value = withSequence(
        withSpring(1.2, { damping: 8, stiffness: 200 }),
        withSpring(1.0, { damping: 10, stiffness: 150 }),
        withDelay(
          300,
          withTiming(0, { duration: 200 }, (finished) => {
            if (finished && onComplete) {
              runOnJS(onComplete)();
            }
          })
        )
      );

      opacity.value = withSequence(
        withTiming(1, { duration: 100 }),
        withDelay(300, withTiming(0, { duration: 200 }))
      );

      rotation.value = withSpring(0, { damping: 8, stiffness: 100 });
    }
  }, [judgement]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
    opacity: opacity.value,
  }));

  if (!judgement) return null;

  const config = getJudgementConfig(judgement);

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Text style={[styles.emoji, { color: config.color }]}>{config.emoji}</Text>
      <Text style={[styles.text, { color: config.color }]}>{config.text}</Text>
    </Animated.View>
  );
};

function getJudgementConfig(judgement: JudgementType) {
  switch (judgement) {
    case 'perfect':
      return {
        emoji: '⭐',
        text: 'PERFECT!',
        color: theme.colors.perfect,
      };
    case 'good':
      return {
        emoji: '✓',
        text: 'GOOD',
        color: theme.colors.good,
      };
    case 'miss':
      return {
        emoji: '✗',
        text: 'MISS',
        color: theme.colors.miss,
      };
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '40%',
    alignSelf: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  emoji: {
    fontSize: 64,
    marginBottom: theme.spacing.sm,
  },
  text: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.extrabold,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
});
