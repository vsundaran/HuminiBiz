import React from 'react';
import Svg, { Path } from 'react-native-svg';

export const VideoCameraIcon = ({ size = 24, color = '#263238' }: { size?: number; color?: string }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M17 10.5V7C17 5.9 16.1 5 15 5H4C2.9 5 2 5.9 2 7V17C2 18.1 2.9 19 4 19H15C16.1 19 17 18.1 17 17V13.5L21 17.5V6.5L17 10.5Z"
        fill={color}
      />
    </Svg>
  );
};
