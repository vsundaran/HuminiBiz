import React from "react";
import Svg, { Path, G, Defs, ClipPath, Rect, Circle, Filter, FeFlood, FeBlend, FeGaussianBlur } from "react-native-svg";

export const LiveMomentsGlowIcon: React.FC<{ width?: number | string; height?: number | string; color?: string; style?: any }> = (props) => {
  return (
    <Svg preserveAspectRatio="none" width="100%" height="100%"   viewBox="0 0 270 270" fill="none" {...props}>
<G id="Ellipse 1381" filter="url(#filter0_f_1492_6842)">
<Circle cx="135" cy="135" r="61" fill="white" fillOpacity="0.5"/>
</G>
<Defs>
<Filter id="filter0_f_1492_6842" x="0" y="0" width="270" height="270" filterUnits="userSpaceOnUse">
<FeFlood floodOpacity="0" result="BackgroundImageFix"/>
<FeBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<FeGaussianBlur stdDeviation="37" result="effect1_foregroundBlur_1492_6842"/>
</Filter>
</Defs>
</Svg>
  );
};
