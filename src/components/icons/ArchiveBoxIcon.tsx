import React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';

/**
 * Archive icon — styled as a storage box with a downward arrow inside.
 * Matches the Figma archive button icon (node I1183:6936;1163:6922).
 * Dimensions: 20×20 by default.
 */
export const ArchiveBoxIcon = ({
  size = 20,
  color = '#6e767a',
}: {
  size?: number;
  color?: string;
}) => (
  <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    {/* Box lid */}
    <Rect
      x={1.5}
      y={1.5}
      width={17}
      height={3.5}
      rx={1}
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Box body */}
    <Path
      d="M3 5v11a1.5 1.5 0 0 0 1.5 1.5h11A1.5 1.5 0 0 0 17 16V5"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Down arrow line */}
    <Path
      d="M10 9v5"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
    />
    {/* Down arrow head */}
    <Path
      d="M7.5 11.5 10 14l2.5-2.5"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
