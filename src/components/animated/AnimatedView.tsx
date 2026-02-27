import React from 'react';
import { ViewProps } from 'react-native';
import Animated, { BaseAnimationBuilder, EntryExitAnimationFunction } from 'react-native-reanimated';
import { presets } from '../../animations';

type EnteringAnimation = BaseAnimationBuilder | typeof BaseAnimationBuilder | EntryExitAnimationFunction | any;
type ExitingAnimation = BaseAnimationBuilder | typeof BaseAnimationBuilder | EntryExitAnimationFunction | any;

interface AnimatedViewProps extends ViewProps {
  children: React.ReactNode;
  animation?: 'fade' | 'slideUp' | 'slideDown' | 'scale' | 'none';
  entering?: EnteringAnimation;
  exiting?: ExitingAnimation;
  delay?: number;
}

/**
 * A highly reusable Animated.View wrapper.
 * By default it uses the 'fade' preset. You can override entering/exiting props.
 */
export const AnimatedView = ({
  children,
  animation = 'fade',
  entering,
  exiting,
  delay = 0,
  style,
  ...rest
}: AnimatedViewProps) => {
  let computedEntering = entering;
  let computedExiting = exiting;

  if (animation !== 'none' && !entering && !exiting) {
    const preset = presets[animation];
    computedEntering = preset.entering;
    computedExiting = preset.exiting;
    
    if (delay > 0 && computedEntering && 'delay' in computedEntering) {
      computedEntering = computedEntering.delay(delay);
    }
  }

  return (
    <Animated.View
      entering={computedEntering}
      exiting={computedExiting}
      style={style}
      {...rest}
    >
      {children}
    </Animated.View>
  );
};
