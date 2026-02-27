import React from 'react';
import { ViewProps } from 'react-native';
import { AnimatedView } from './AnimatedView';

interface AnimatedScreenProps extends ViewProps {
  children: React.ReactNode;
}

/**
 * Wrapper for screen content ensuring it softly fades in when mounted.
 * Works perfectly alongside the react-navigation cardStyleInterpolator.
 */
export const AnimatedScreen = ({ children, style, ...rest }: AnimatedScreenProps) => {
  return (
    <AnimatedView
      animation="fade"
      style={[{ flex: 1 }, style]}
      {...rest}
    >
      {children}
    </AnimatedView>
  );
};
