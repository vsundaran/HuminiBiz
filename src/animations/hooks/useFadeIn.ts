import { useEffect } from 'react';
import { useSharedValue, useAnimatedStyle, withTiming, withDelay } from 'react-native-reanimated';
import { defaultTiming } from '../timing';

/**
 * Hook to fade in an element programmatically.
 * Useful for mounting animations where LayoutAnimations (entering/exiting) 
 * might not be ideal or when tying opacity to other UI logic.
 */
export const useFadeIn = (duration = 250, delay = 0) => {
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (delay > 0) {
      opacity.value = withDelay(delay, withTiming(1, { ...defaultTiming, duration }));
    } else {
      opacity.value = withTiming(1, { ...defaultTiming, duration });
    }
  }, [delay, duration, opacity]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  return { animatedStyle, opacity };
};
