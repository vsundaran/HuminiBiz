import React from 'react';
import Svg, { Path } from 'react-native-svg';

export const ArrowLeftIcon = ({ size = 20, color = 'black' }: { size?: number; color?: string }) => {
  return (
    <Svg width={size} height={(size * 8) / 14} viewBox="0 0 14 8" fill="none">
      <Path
        d="M1 1L7 7L13 1"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
