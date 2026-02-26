import React from 'react';
import Svg, { Path } from 'react-native-svg';

export const ArrowLeftLineIcon = ({ size = 24, color = '#263238' }: { size?: number; color?: string }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20 12H4M4 12L10 18M4 12L10 6"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
