import React from 'react';
import Svg, { Path } from 'react-native-svg';

export const ArrowRightIcon = ({ size = 20, color = 'white' }: { size?: number; color?: string }) => {
  return (
    <Svg width={size} height={(size * 12) / 20} viewBox="0 0 20 12" fill="none">
      <Path
        d="M13.5088 -2.91409e-07C13.5088 0.587416 14.1518 1.46458 14.8027 2.20083C15.6395 3.15083 16.6395 3.97971 17.786 4.61225C18.6457 5.08646 19.6878 5.54167 20.5264 5.54167M20.5264 5.54167C19.6878 5.54167 18.6448 5.99687 17.786 6.47108C16.6395 7.10442 15.6395 7.93329 14.8027 8.88171C14.1518 9.61875 13.5088 10.4975 13.5088 11.0833M20.5264 5.54167L-0.526265 5.54167"
        stroke={color}
        strokeWidth={1.3}
      />
    </Svg>
  );
};
