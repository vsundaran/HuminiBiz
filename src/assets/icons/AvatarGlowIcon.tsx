import React from 'react';
import Svg, { Circle, Defs, LinearGradient, Stop, Filter, FeGaussianBlur } from 'react-native-svg';

interface Props {
  size?: number | string;
}

export const AvatarGlowIcon: React.FC<Props> = ({ size = 200 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 197 197" fill="none">
      <Defs>
        <Filter id="blur" x="-50%" y="-50%" width="200%" height="200%">
          <FeGaussianBlur stdDeviation="12" />
        </Filter>
        <LinearGradient
          id="paint"
          x1="30.6222"
          y1="61.5259"
          x2="157.548"
          y2="151.478"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#FFFFA9" />
          <Stop offset="1" stopColor="#F3C2FF" />
        </LinearGradient>
      </Defs>
      <Circle cx="98.5" cy="98.5" r="74.5" fill="url(#paint)" filter="url(#blur)" />
    </Svg>
  );
};
