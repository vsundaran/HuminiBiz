import { useCallback } from 'react';
import { FadeInDown, FadeOut } from 'react-native-reanimated';

/**
 * Provides standardized entering/exiting animations for list items.
 */
export const useListAnimation = () => {
  // We use the presets logic here directly for easy access
  const getEnteringAnimation = useCallback((index: number) => {
    // 50ms stagger per item, springify for natural feel
    return FadeInDown.delay(index * 50)
      .springify()
      .damping(15)
      .stiffness(150);
  }, []);

  const getExitingAnimation = useCallback(() => {
    return FadeOut.duration(150);
  }, []);

  return {
    getEnteringAnimation,
    getExitingAnimation,
  };
};
