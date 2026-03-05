import React from "react";
import Svg, { G, Defs, Filter, FeFlood, FeBlend, FeGaussianBlur, Circle } from "react-native-svg";

export const LiveMomentsGlowIcon: React.FC<{
  width?: number | string;
  height?: number | string;
  color?: string;
  style?: any;
}> = (props) => {
  return (
    <Svg
      preserveAspectRatio="none"
      width="100%"
      height="100%"
      viewBox="0 0 270 270"
      fill="none"
      {...props}
    >
      <Defs>
        <Filter
          id="blurFilter"
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
          filterUnits="objectBoundingBox"
        >
          <FeFlood floodOpacity="0" result="BackgroundImageFix" />
          <FeBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <FeGaussianBlur stdDeviation="60" />
        </Filter>
      </Defs>

      <G filter="url(#blurFilter)">
        <Circle cx="135" cy="135" r="61" fill="white" fillOpacity="0.5" />
      </G>
    </Svg>
  );
};