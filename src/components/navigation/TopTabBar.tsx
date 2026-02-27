import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import Svg, {
  Path,
  Defs,
  LinearGradient,
  Stop,
  Filter,
  FeFlood,
  FeBlend,
  FeGaussianBlur,
} from 'react-native-svg';
import { COLORS, FONTS } from '../../theme';
import { HomeIcon } from '../icons/HomeIcon';
import { SparklesIcon } from '../icons/SparklesIcon';
import { ProfileAvatarIcon } from '../icons/ProfileAvatarIcon';

type Tab = 'Home' | 'Your Moments' | 'Profile';

interface TopTabBarProps {
  activeTab: Tab;
  onTabPress: (tab: Tab) => void;
}

/**
 * Renders the warm yellow glow highlight that appears above the active tab icon.
 * Pixel-perfect implementation from Figma node 561:2549 — Vector 37 with Gaussian blur.
 * viewBox: 78×71, gaussian blur stdDeviation 7.5, gradient #F7EBB9 → #FFEC9B
 */
const TabGlowBg = () => (
  <Svg
    width={78}
    height={57}
    viewBox="0 0 78 57"
    fill="none"
    style={styles.glowBg}
  >
    <Defs>
      <Filter
  id="filter0_f_glow"
  x="-80"
  y="-80"
  width="240"
  height="220"
  filterUnits="userSpaceOnUse"
>
  <FeFlood floodOpacity={0} result="BackgroundImageFix" />
  <FeBlend
    mode="normal"
    in="SourceGraphic"
    in2="BackgroundImageFix"
    result="shape"
  />

  {/* VERY HIGH BLUR */}
  <FeGaussianBlur
    stdDeviation={35}
    result="effect1_foregroundBlur_glow"
  />
</Filter>
      <LinearGradient
        id="paint0_linear_glow"
        x1="39"
        y1="-1.15789"
        x2="39"
        y2="42"
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#F7EBB9" />
        <Stop offset="1" stopColor="#FFEC9B" />
      </LinearGradient>
    </Defs>
    <Path
      d="M27.5 42L15 1H63L53 42H27.5Z"
      fill="url(#paint0_linear_glow)"
      filter="url(#filter0_f_glow)"
    />
  </Svg>
);

/**
 * Renders the active indicator line at the top of the selected tab.
 * Extracted from Figma node 477:5587 — Line 188, stroke #0C557B, 4px, round.
 */
const TabActiveLine = () => (
  <Svg
    width={52}
    height={4}
    viewBox="0 0 52 4"
    fill="none"
    style={styles.activeLine}
  >
    <Path
      d="M2 2H50"
      stroke={COLORS.selectedTabBlue}
      strokeWidth={4}
      strokeLinecap="round"
    />
  </Svg>
);

export const TopTabBar: React.FC<TopTabBarProps> = ({ activeTab, onTabPress }) => {
  const tabs: Array<{ key: Tab; label: string }> = [
    { key: 'Home', label: 'Home' },
    { key: 'Your Moments', label: 'Your Moments' },
    { key: 'Profile', label: 'Profile' },
  ];

  return (
    <View style={styles.container}>
      <Shadow
        distance={4}
        startColor="#00000010"
        offset={[0, -1]}
        style={{ width: '100%', height: '100%', backgroundColor: '#F4F4F4' }}
        containerStyle={{ width: '100%', height: '100%' }}
      >
        <View style={styles.tabsWrapper}>
          {tabs.map(({ key, label }) => {
          const isActive = activeTab === key;
          return (
            <TouchableOpacity
              key={key}
              style={styles.tabItem}
              onPress={() => onTabPress(key)}
              activeOpacity={0.75}
            >
              {/* Glow behind icon when active */}
              {isActive && <TabGlowBg />}
              {/* Blue line at top when active */}
              {isActive && <TabActiveLine />}

              {/* Icon */}
              <View style={styles.iconWrapper}>
                {key === 'Home' && (
                  <HomeIcon
                    size={24}
                    color={isActive ? COLORS.selectedTabBlue : COLORS.textBodyText1}
                  />
                )}
                {key === 'Your Moments' && (
                  <SparklesIcon
                    size={20}
                    color={isActive ? COLORS.selectedTabBlue : COLORS.textBodyText1}
                  />
                )}
                {key === 'Profile' && (
                  <ProfileAvatarIcon size={24} active={isActive} />
                )}
              </View>

              {/* Label */}
              <Text
                style={[
                  styles.tabText,
                  isActive ? styles.activeText : styles.inactiveText,
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
        </View>
      </Shadow>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 64,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'transparent',
  },
  tabsWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    // Each tab takes equal space
    flex: 1,
    height: '100%',
  },
  glowBg: {
    position: 'absolute',
    top: 0,
    alignSelf: 'center',
  },
  activeLine: {
    position: 'absolute',
    top: 0,
    alignSelf: 'center',
  },
  iconWrapper: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    // Needed for "Your Moments" sparkle which is 20px in a 24px cell
    overflow: 'visible',
  },
  tabText: {
    fontFamily: FONTS.family,
    fontSize: FONTS.sizes.sm, // 14
    marginTop: 4,
    textAlign: 'center',
  },
  activeText: {
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.selectedTabBlue,
    letterSpacing: 0.1,
    lineHeight: FONTS.lineHeights['20'],
  },
  inactiveText: {
    fontWeight: FONTS.weights.medium,
    color: COLORS.textBodyText1,
    lineHeight: FONTS.lineHeights['20'],
  },
});
