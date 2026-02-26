import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

/**
 * Profile avatar icon used in the tab bar - letter "T" inside a circle.
 * Matches Profile tab icon from Figma design (node 479:7475).
 * Active state: dark circle #0C557B with white text.
 * Inactive state: light grey circle #DADADA with grey text.
 */
export const ProfileAvatarIcon = ({
  size = 24,
  active = false,
}: {
  size?: number;
  active?: boolean;
}) => {
  const circleColor = active ? '#0C557B' : '#DADADA';
  const textColor = active ? '#FFFFFF' : '#6E767A';

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="12" fill={circleColor} />
      <Path
        d="M11.356 16.8V8.582H8.5V7H16.158V8.582H13.302V16.8H11.356Z"
        fill={textColor}
      />
    </Svg>
  );
};
