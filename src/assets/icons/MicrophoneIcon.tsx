import React from 'react';
import Svg, { Path } from 'react-native-svg';

export const MicrophoneIcon = ({ size = 24, color = '#263238' }: { size?: number; color?: string }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2C10.34 2 9 3.34 9 5V11C9 12.66 10.34 14 12 14C13.66 14 15 12.66 15 11V5C15 3.34 13.66 2 12 2ZM19 11C19 14.87 15.87 18 12 18C8.13 18 5 14.87 5 11H3C3 15.42 6.22 19.08 10.5 19.82V23H13.5V19.82C17.78 19.08 21 15.42 21 11H19Z"
        fill={color}
      />
    </Svg>
  );
};
