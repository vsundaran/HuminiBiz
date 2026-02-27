import React from 'react';
import { ViewProps } from 'react-native';
import { AnimatedView } from './AnimatedView';
import { presets } from '../../animations';

interface AnimatedListItemProps extends ViewProps {
  children: React.ReactNode;
  index: number;
}

/**
 * Highly optimized FlatList item wrapper using stagger entrance.
 */
export const AnimatedListItem = ({ children, index, style, ...rest }: AnimatedListItemProps) => {
  const animations = presets.staggeredSlideUp(index);

  return (
    <AnimatedView
      animation="none"
      entering={animations.entering}
      exiting={animations.exiting}
      style={style}
      {...rest}
    >
      {children}
    </AnimatedView>
  );
};
