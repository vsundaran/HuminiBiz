import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
} from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { FONTS, COLORS } from '../../theme';

interface ViewAllButtonProps {
  /** Label text, e.g. "View All (122)" */
  label: string;
  /** Callback fired on press */
  onPress: () => void;
}

/**
 * Reusable "View All" pill button.
 * Matches Figma node 695:2989:
 *  - Blue gradient fill (#D2F0FF → #F1FAFF), left-to-right
 *  - 1px border: #C2EBFF
 *  - Border radius: 130px (pill)
 *  - Padding: 8px vertical, 20px horizontal
 *  - Gap: 10px between text and arrow
 *  - Text: DM Sans Medium 13px, color #515B60, letterSpacing 0.1
 *  - Arrow: upward-pointing chevron rotated 90deg (→ becomes ↓ toward right →)
 *    stroke #515B60, strokeWidth 1.3
 */
const ArrowIcon = () => (
  <Svg
    width={11}
    height={20}
    viewBox="0 0 11.0833 20"
    fill="none"
  >
    <Path
      d="M0 6.66667C0.587417 6.66667 1.46458 6.05583 2.20083 5.4375C3.15083 4.6425 3.97971 3.6925 4.61225 2.60333C5.08646 1.78667 5.54167 0.796667 5.54167 0M5.54167 0C5.54167 0.796667 5.99687 1.7875 6.47108 2.60333C7.10442 3.6925 7.93329 4.6425 8.88171 5.4375C9.61875 6.05583 10.4975 6.66667 11.0833 6.66667M5.54167 0V20"
      stroke="#515B60"
      strokeWidth={1.3}
    />
  </Svg>
);

export const ViewAllButton: React.FC<ViewAllButtonProps> = ({ label, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.wrapper}
      onPress={onPress}
      activeOpacity={0.75}
    >
      {/* Gradient background via SVG */}
      {/* <Svg
        style={StyleSheet.absoluteFill}
        width="100%"
        height="100%"
        preserveAspectRatio="none"
      >
        <Defs>
          <LinearGradient id="btnGrad" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor="#D2F0FF" />
            <Stop offset="1" stopColor="#F1FAFF" />
          </LinearGradient>
        </Defs>
        <Rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          rx={130}
          ry={130}
          fill="url(#btnGrad)"
        />
      </Svg> */}

      {/* Border overlay */}
      <View style={styles.border} pointerEvents="none" />

      {/* Content */}
      <Text style={styles.label}>{label}</Text>
      <View style={styles.arrowContainer}>
        <ArrowIcon />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 130,
    gap: 10,
    overflow: 'hidden',
    // Min height to match Figma (text 20 line-height + 8*2 padding = 36)
    minHeight: 36,
    // Border trick: we'll use a View overlay for the border below
    backgroundColor: '#F1FAFF',
  },
  border: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 130,
    borderWidth: 1,
    borderColor: '#C2EBFF',
  },
  label: {
    fontFamily: FONTS.family,
    fontWeight: '500' as const,
    fontSize: 13,
    lineHeight: 20,
    letterSpacing: 0.1,
    color: COLORS.textSubHeadline, // #515B60
  },
  arrowContainer: {
    width: 11,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '90deg' }],
  },
});
