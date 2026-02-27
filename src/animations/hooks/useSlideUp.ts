import { useEffect } from 'react';
import { useSharedValue, useAnimatedStyle, withSpring, withDelay, withTiming } from 'react-native-reanimated';
import { defaultSpring, smoothSpring } from '../spring';
import { defaultTiming } from '../timing';

/**
 * Hook for programmatic slide-up + fade-in animations.
 */
export const useSlideUp = (initialTranslateY = 20, delay = 0) => {
  const translateY = useSharedValue(initialTranslateY);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (delay > 0) {
      // Delay both opacity and translation
      opacity.value = withDelay(delay, withTiming(1, defaultTiming));
      translateY.value = withDelay(delay, withSpring(0, smoothSpring));
    } else {
      opacity.value = withTiming(1, defaultTiming);
      translateY.value = withSpring(0, smoothSpring);
    }
  }, [delay, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });

  return { animatedStyle, translateY, opacity };
};
