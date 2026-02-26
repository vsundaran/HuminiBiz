import React, { useEffect } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  withSequence,
  withDelay,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { PhoneDeclineIcon } from '../assets/icons/PhoneDeclineIcon';
import { VolumeHighGreyIcon } from '../assets/icons/VolumeHighGreyIcon';
import { AvatarGlowIcon } from '../assets/icons/AvatarGlowIcon';
import { COLORS, FONTS, SIZES } from '../theme';

type RootStackParamList = {
  Home: undefined;
  Ringing: undefined;
};

const Dot = ({ delay = 0 }: { delay: number }) => {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withDelay(
        delay,
        withSequence(
          withTiming(1, { duration: 400 }),
          withTiming(0.3, { duration: 400 })
        )
      ),
      -1,
      false
    );
  }, [delay, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return <Animated.View style={[styles.dot, animatedStyle]} />;
};

export const RingingScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleDecline = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.replace('Home');
    }
  };

  return (
    <View style={styles.container}>
      {/* Background Gradient */}
      <View style={StyleSheet.absoluteFillObject}>
        <Svg height="100%" width="100%" preserveAspectRatio="none">
          <Defs>
            <LinearGradient id="bg-grad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#FFFBEA" stopOpacity="1" />
              <Stop offset="0.299" stopColor="#F4F4F4" stopOpacity="1" />
              <Stop offset="1" stopColor="#F4F4F4" stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#bg-grad)" />
        </Svg>
      </View>

      <SafeAreaView style={styles.safeArea}>
        {/* Top Section / User Profile */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.glowRef}>
              <AvatarGlowIcon size={200} />
            </View>
            <Image
              source={{ uri: 'https://i.pravatar.cc/300?img=68' }} // Adjust as needed
              style={styles.avatar}
            />
          </View>

          <Text style={styles.callerName}>Gnani Gnanasekaran</Text>
          <Text style={styles.callRole}>Frappe Manager</Text>
        </View>

        {/* Ringing text and animating dots */}
        <View style={styles.ringingIndicator}>
          <Text style={styles.ringingText}>Ringing</Text>
          <View style={styles.dotsContainer}>
            <Dot delay={0} />
            <Dot delay={200} />
            <Dot delay={400} />
            <Dot delay={600} />
          </View>
        </View>

        {/* Context Card Card */}
        <View style={styles.messageCard}>
          <View style={styles.chip}>
            <Text style={styles.chipText}>Wishes | Work anniversary</Text>
          </View>
          <Text style={styles.messageText}>
            Today is my work anniversary! Feel free to call me and share your wishes or
            celebrate this moment together.
          </Text>
        </View>

        {/* Bottom Section / Actions Pill */}
        <View style={styles.actionsPillContainer}>
          <View style={styles.actionsPill}>
            {/* Volume Button */}
            <TouchableOpacity style={styles.greyButton} activeOpacity={0.7}>
              <VolumeHighGreyIcon size={24} />
            </TouchableOpacity>

            {/* Decline Button */}
            <TouchableOpacity 
              style={styles.declineButton} 
              activeOpacity={0.8}
              onPress={handleDecline}
            >
              <View style={styles.declineIconWrapper}>
                <Svg height="100%" width="100%" preserveAspectRatio="none" style={StyleSheet.absoluteFillObject}>
                  <Defs>
                    <LinearGradient id="red-gradient" x1="0" y1="0" x2="0" y2="1">
                      <Stop offset="0" stopColor="#FF5C5C" stopOpacity="1" />
                      <Stop offset="1" stopColor="#FF0000" stopOpacity="1" />
                    </LinearGradient>
                  </Defs>
                  <Rect x="0" y="0" width="100%" height="100%" fill="url(#red-gradient)" />
                </Svg>
                <PhoneDeclineIcon size={24} color={COLORS.white} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 82, // Matches top of avatar
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 44,
  },
  avatarContainer: {
    width: 140,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  glowRef: {
    position: 'absolute',
    top: -30,
    left: -30,
    right: -30,
    bottom: -30,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 0,
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    zIndex: 10,
  },
  callerName: {
    fontFamily: FONTS.styles.headlineBold24.fontFamily,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 24,
    color: '#263238',
    letterSpacing: 0.15,
  },
  callRole: {
    fontFamily: FONTS.styles.bodyMedium14.fontFamily,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    color: '#6E767A',
    marginTop: 4,
  },
  ringingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 50,
  },
  ringingText: {
    fontFamily: FONTS.styles.headlineBold24.fontFamily,
    fontSize: 14,
    fontWeight: '700',
    color: '#263238',
    opacity: 0.5,
    marginRight: 6,
    letterSpacing: 0.1,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 2, // optical alignment
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#C8CFD3',
  },
  messageCard: {
    width: '85%',
    maxWidth: 340,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    paddingTop: 22,
    paddingBottom: 22,
    paddingHorizontal: 19,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 2,
  },
  chip: {
    backgroundColor: 'rgba(223, 255, 212, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 210,
    marginBottom: 14,
  },
  chipText: {
    fontFamily: FONTS.styles.subTitleSemibold14.fontFamily,
    fontSize: 11,
    fontWeight: '600',
    color: '#486333',
    lineHeight: 18,
  },
  messageText: {
    fontFamily: FONTS.styles.subTitleSemibold14.fontFamily,
    fontSize: 15,
    fontWeight: '600',
    color: '#515B60',
    textAlign: 'center',
    lineHeight: 20,
  },
  actionsPillContainer: {
    position: 'absolute',
    bottom: 80, // Approximate positioning from Figma
    width: '100%',
    alignItems: 'center',
  },
  actionsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 210,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    gap: 7,
  },
  greyButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F1F1F1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  declineButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden', // to clip gradient
  },
  declineIconWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

