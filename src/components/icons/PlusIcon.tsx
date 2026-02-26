import React from 'react';
import Svg, { Path } from 'react-native-svg';

export const PlusIcon = ({ size = 20, color = 'black' }: { size?: number; color?: string }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 5V19"
        stroke={color}
        strokeWidth={1.67}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M5 12H19"
        stroke={color}
        strokeWidth={1.67}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
