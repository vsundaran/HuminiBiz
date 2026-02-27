import React from 'react';
import { Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import { useScalePress } from '../../animations';

const AnimatedBasePressable = Animated.createAnimatedComponent(Pressable);

export interface AnimatedPressableProps extends Omit<PressableProps, 'style'> {
  scaleTo?: number;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode | ((state: { pressed: boolean }) => React.ReactNode);
}

/**
 * Premium Animated Pressable replacement.
 * Implements the 0.96 scale-down smooth spring feedback on press.
 */
export const AnimatedPressable = ({
  children,
  scaleTo = 0.96,
  onPressIn,
  onPressOut,
  style,
  ...rest
}: AnimatedPressableProps) => {
  const { animatedStyle, onPressIn: handlePressIn, onPressOut: handlePressOut } = useScalePress(scaleTo);

  return (
    <AnimatedBasePressable
      onPressIn={(e) => {
        handlePressIn();
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        handlePressOut();
        onPressOut?.(e);
      }}
      style={[animatedStyle, style as any]}
      {...rest}
    >
      {children}
    </AnimatedBasePressable>
  );
};
