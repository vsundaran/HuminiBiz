import React from 'react';
import Svg, { Path } from 'react-native-svg';

export const RotateCameraIcon = ({ size = 24, color = '#263238' }: { size?: number; color?: string }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M2 13V15.5C2 17.98 4.02 20 6.5 20H17.5C19.98 20 22 17.98 22 15.5V13M12 2C6.48 2 2 6.48 2 12M2 12L5 9M2 12L-1 9M22 12C22 6.48 17.52 2 12 2M12 2L15 5M12 2L9 5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
