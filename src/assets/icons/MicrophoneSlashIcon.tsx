import React from 'react';
import Svg, { Path } from 'react-native-svg';

export const MicrophoneSlashIcon = ({ size = 24, color = '#E8E8E8' }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M2.99988 3L20.9999 21M9.00688 8.02619V7C9.00688 6.20435 9.32295 5.44129 9.88556 4.87868C10.4482 4.31607 11.2112 4 12.0069 4C12.8025 4 13.5656 4.31607 14.1282 4.87868C14.6908 5.44129 15.0069 6.20435 15.0069 7V10.2762M18.8189 12.0292C18.4239 15.1762 15.5429 17.5842 12.0069 17.5842C10.6139 17.5842 9.32488 17.1592 8.24388 16.4252C7.30088 15.7852 6.55088 14.9312 6.06888 13.9302M12.0069 18.0002V21.0002M9.00688 21.0002H15.0069"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
