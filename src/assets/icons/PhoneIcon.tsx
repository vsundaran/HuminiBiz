import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface PhoneIconProps {
  size?: number | string;
  color?: string;
}

export const PhoneIcon: React.FC<PhoneIconProps> = ({ size = 24, color = '#FFFFFF' }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20.9 15.6c-.3-.2-3.1-1.5-3.6-1.7-.5-.2-1.1-.1-1.5.4l-2 2.6c-2.8-1.4-5.1-3.7-6.5-6.5l2.6-2c.5-.4.6-1 .4-1.5-.2-.5-1.5-3.3-1.7-3.6-.3-.5-.7-.5-1.1-.5H4.1c-.6 0-1.1.5-1.1 1.1 0 8.3 6.6 15 15 15 .6 0 1.1-.5 1.1-1.1v-3.4c0-.4-.4-.8-.9-.8z"
        fill={color}
      />
    </Svg>
  );
};
