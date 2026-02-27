import { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { smoothSpring } from '../spring';

/**
 * Hook to provide animated style and handlers for pressable components.
 * Creates a subtle premium scale-down effect (0.96 by default).
 */
export const useScalePress = (scaleTo = 0.96) => {
  const isPressed = useSharedValue(false);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withSpring(isPressed.value ? scaleTo : 1, smoothSpring),
        },
      ],
    };
  });

  const onPressIn = () => {
    isPressed.value = true;
  };

  const onPressOut = () => {
    isPressed.value = false;
  };

  return { animatedStyle, onPressIn, onPressOut };
};
