import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AvatarGlowIcon } from '../assets/icons/AvatarGlowIcon';
import { VideoIcon } from '../assets/icons/VideoIcon';
import { COLORS, FONTS } from '../theme';
import { AnimatedScreen, AnimatedView, AnimatedPressable } from '../components/animated';

type RootStackParamList = {
  Home: undefined;
  CallCompleted: undefined;
  VideoCall: undefined;
  SelectReason: undefined;
};

export const CallCompletedScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleConnectMore = () => {
    navigation.navigate('VideoCall');
  };

  const handleGoHome = () => {
    navigation.navigate('SelectReason');
  };

  return (
    <AnimatedScreen style={styles.container}>
      {/* Background Gradient: #FFFBEA → #F4F4F4 (top 30%) */}
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
        {/* Avatar section */}
        <View style={styles.avatarSection}>
          <AnimatedView animation="slideUp" delay={100} style={styles.avatarContainer}>
            {/* Glow ring behind avatar */}
            <View style={styles.glowRef}>
              <AvatarGlowIcon size={200} />
            </View>
            <Image
              source={{ uri: 'https://i.pravatar.cc/300?img=68' }}
              style={styles.avatar}
            />
          </AnimatedView>

          {/* Call status */}
          <AnimatedView animation="slideUp" delay={200} style={styles.nameBlock}>
            <Text style={styles.callCompletedText}>Call Completed</Text>
          </AnimatedView>

          {/* Name & Role */}
          <AnimatedView animation="slideUp" delay={200} style={styles.nameBlock}>
            <Text style={styles.callerName}>Gnani Gnanasekaran</Text>
            <Text style={styles.callRole}>Frappe Manager</Text>
          </AnimatedView>
        </View>

        {/* Bottom action buttons */}
        <AnimatedView animation="slideUp" delay={300} style={styles.bottomWrapper}>
          <View style={styles.actionsContainer}>
            {/* Connect more — dark primary button with inner shadow */}
            <AnimatedPressable
              style={styles.connectMoreButton}
              onPress={handleConnectMore}>
              {/* <VideoIcon size={20} color={COLORS.white} /> */}
              <Text style={styles.connectMoreText}>Connect more</Text>
            </AnimatedPressable>

            {/* Report — light red button */}
            <AnimatedPressable
              style={styles.reportButton}
              onPress={handleGoHome}>
              <Text style={styles.reportText}>Report</Text>
              <VideoIcon size={20} color="#B7131A" />
            </AnimatedPressable>
          </View>

          {/* Bottom home indicator placeholder */}
          <View style={styles.homeIndicator} />
        </AnimatedView>
      </SafeAreaView>
    </AnimatedScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  /* ── Avatar Section ── */
  avatarSection: {
    alignItems: 'center',
    marginTop: 82,
  },
  avatarContainer: {
    width: 149,
    height: 149,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  glowRef: {
    position: 'absolute',
    top: -24,
    left: -24,
    right: -24,
    bottom: -24,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 0,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    zIndex: 10,
  },
  /* ── Text ── */
  callCompletedText: {
    fontFamily: FONTS.styles.subTitleBold16.fontFamily,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 24,
    letterSpacing: 0.15,
    color: '#107400',
    textAlign: 'center',
    marginBottom: 8,
  },
  nameBlock: {
    alignItems: 'center',
    gap: 4,
  },
  callerName: {
    fontFamily: FONTS.styles.subTitleBold16.fontFamily,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 24,
    letterSpacing: 0.15,
    color: COLORS.textMainHeadline,
    textAlign: 'center',
  },
  callRole: {
    fontFamily: FONTS.styles.bodyMedium14.fontFamily,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    color: COLORS.textBodyText1,
    textAlign: 'center',
  },
  /* ── Action Buttons ── */
  bottomWrapper: {
    width: '100%',
  },
  actionsContainer: {
    width: '100%',
    paddingHorizontal: 32,
    gap: 10,
  },
  connectMoreButton: {
    height: 44,
    backgroundColor: COLORS.surfaceBluePrimary,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 32,
    // Drop shadow
    shadowColor: 'rgba(72, 86, 92, 0.29)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 11,
    elevation: 6,
  },
  connectMoreText: {
    fontFamily: FONTS.styles.subTitleSemibold14.fontFamily,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    letterSpacing: 0.1,
    color: COLORS.textBlueWhite,
  },
  reportButton: {
    height: 44,
    backgroundColor: '#FFEEEA',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 24,
  },
  reportText: {
    fontFamily: FONTS.styles.subTitleSemibold14.fontFamily,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    letterSpacing: 0.1,
    color: '#B7131A',
  },
  homeIndicator: {
    height: 34,
  },
});
