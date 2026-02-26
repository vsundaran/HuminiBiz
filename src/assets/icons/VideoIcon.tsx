import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface Props {
  size?: number;
  color?: string;
}

export const VideoIcon: React.FC<Props> = ({ size = 20, color = '#B7131A' }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Path
        d="M2.5 6.667A1.667 1.667 0 014.167 5h8.333A1.667 1.667 0 0114.167 6.667v1.796l3.102-1.863A.833.833 0 0118.5 7.333v5.334a.833.833 0 01-1.231.733l-3.102-1.863v1.796A1.667 1.667 0 0112.5 15H4.167A1.667 1.667 0 012.5 13.333V6.667z"
        fill={color}
      />
    </Svg>
  );
};
