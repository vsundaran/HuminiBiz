import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop, Filter, FeFlood, FeBlend, FeGaussianBlur } from 'react-native-svg';
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
 * Extracted from Figma node 561:2549 — Vector 37 with Gaussian blur.
 */
const TabGlowBg = () => (
  <Svg
    width={78}
    height={41}
    viewBox="0 0 78 71"
    fill="none"
    style={styles.glowBg}
  >
    <Defs>
      <Filter
        id="filter0_f"
        x="0"
        y="0"
        width="78"
        height="71"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <FeFlood floodOpacity="0" result="BackgroundImageFix" />
        <FeBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        <FeGaussianBlur stdDeviation="7.5" result="effect1_foregroundBlur" />
      </Filter>
      <LinearGradient
        id="paint0_linear"
        x1="39"
        y1="12.8421"
        x2="39"
        y2="56"
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#F7EBB9" />
        <Stop offset="1" stopColor="#FFEC9B" />
      </LinearGradient>
    </Defs>
    <Path
      d="M27.5 56L15 15H63L53 56H27.5Z"
      fill="url(#paint0_linear)"
      filter="url(#filter0_f)"
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 64,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#F4F4F4',
    // Hairline shadow to separate from content
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 8,
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
    top: -16,
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
