import React from 'react';
import { ViewProps } from 'react-native';
import { AnimatedView } from './AnimatedView';

interface AnimatedCardProps extends ViewProps {
  children: React.ReactNode;
  delay?: number;
}

/**
 * Pre-configured Card wrapper ensuring staggered slideUp premium entrance.
 */
export const AnimatedCard = ({ children, delay = 0, style, ...rest }: AnimatedCardProps) => {
  return (
    <AnimatedView
      animation="slideUp"
      delay={delay}
      style={style}
      {...rest}
    >
      {children}
    </AnimatedView>
  );
};
