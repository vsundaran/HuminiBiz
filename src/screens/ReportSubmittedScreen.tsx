import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Rect,
  Path,
} from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { COLORS, FONTS } from '../theme';
import { AnimatedScreen, AnimatedView, AnimatedPressable } from '../components/animated';
import { Shadow } from 'react-native-shadow-2';

// ─── Navigation Types ─────────────────────────────────────────────────────────

type RootStackParamList = {
  Home: undefined;
  ReportSubmitted: undefined;
};

// ─── Animated Glow Ring ───────────────────────────────────────────────────────

/**
 * A single concentric glow ring that pulses in opacity.
 * Stagger `delay` to create a ripple effect.
 */
const GlowRing = ({
  size,
  color,
  delay,
}: {
  size: number;
  color: string;
  delay: number;
}) => {
  const anim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0.3,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [anim, delay]);

  return (
    <Animated.View
      style={[
        styles.glowRing,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          opacity: anim,
        },
      ]}
    />
  );
};

// ─── Check Icon ───────────────────────────────────────────────────────────────

const CheckIcon = () => (
  <Svg width={33} height={33} viewBox="0 0 33 33" fill="none">
    <Path
      d="M6.5 17.5L13.5 24.5L26.5 9.5"
      stroke="#FFFFFF"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// ─── Screen ───────────────────────────────────────────────────────────────────

export const ReportSubmittedScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleGoHome = () => {
    navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
  };

  return (
    <AnimatedScreen style={styles.container}>
      {/* Gradient background: #FFFBEA → #F4F4F4 (top 30%) */}
      <View style={StyleSheet.absoluteFillObject}>
        <Svg height="100%" width="100%" preserveAspectRatio="none">
          <Defs>
            <LinearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#FFFBEA" stopOpacity="1" />
              <Stop offset="0.30" stopColor="#F4F4F4" stopOpacity="1" />
              <Stop offset="1" stopColor="#F4F4F4" stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#bg)" />
        </Svg>
      </View>

      <SafeAreaView style={styles.safeArea}>
        {/* ── Success icon with pulsing glow rings ── */}
        <AnimatedView animation="slideUp" delay={100} style={styles.iconSection}>
          {/* Outermost ring */}
          <GlowRing size={163} color="rgba(144,210,80,0.15)" delay={0} />
          {/* Second ring */}
          <GlowRing size={122} color="rgba(100,180,60,0.22)" delay={200} />
          {/* Third ring */}
          <GlowRing size={97} color="rgba(60,150,40,0.30)" delay={400} />
          {/* Innermost filled circle */}
          <Shadow
            distance={8}
            startColor="rgba(16,116,0,0.45)"
            offset={[0, 4]}
            style={styles.checkCircle}
          >
            <CheckIcon />
          </Shadow>
        </AnimatedView>

        {/* ── Title & Message card ── */}
        <AnimatedView animation="slideUp" delay={200} style={{width: '100%', alignItems: 'center'}}>
          <Text style={styles.title}>Report Submited</Text>

        {/* ── Message card ── */}
          <View style={styles.messageCard}>
            <Text style={styles.messageText}>
              Most moments here are built on respect and care. We appreciate you
              helping maintain a positive workplace
            </Text>
          </View>
        </AnimatedView>

        {/* ── Go To Home button ── */}
        <AnimatedView animation="slideUp" delay={300} style={{width: '100%'}}>
          <Shadow
            distance={6}
            startColor="rgba(72,86,92,0.29)"
            offset={[0, 4]}
            style={{ width: '100%', borderRadius: 10 }}
            containerStyle={{ width: '100%' }}
          >
            <AnimatedPressable
              style={styles.goHomeButton}
              onPress={handleGoHome}>
              <Text style={styles.goHomeText}>Go To Home</Text>
            </AnimatedPressable>
          </Shadow>
        </AnimatedView>
      </SafeAreaView>
    </AnimatedScreen>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const CIRCLE_SIZE = 70; // innermost dark green circle

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 32,
  },

  /* ── Icon section ── */
  iconSection: {
    marginTop: 90,
    marginBottom: 30,
    width: 163,
    height: 163,
    alignItems: 'center',
    justifyContent: 'center',
  },
  /** Each glow ring is absolutely stacked inside the iconSection */
  glowRing: {
    position: 'absolute',
  },
  checkCircle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: '#1A5E00',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* ── Title ── */
  title: {
    fontFamily: FONTS.family,
    fontWeight: '700' as const,
    fontSize: 18,
    lineHeight: 26,
    letterSpacing: 0,
    color: COLORS.textMainHeadline,
    textAlign: 'center',
    marginBottom: 24,
  },

  /* ── Message card ── */
  messageCard: {
    width: '100%',
    backgroundColor: 'rgba(242, 255, 233, 0.5)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 21,
    alignItems: 'center',
    marginBottom: 40,
  },
  messageText: {
    fontFamily: FONTS.family,
    fontWeight: FONTS.weights.medium,
    fontSize: 13,
    lineHeight: 20,
    letterSpacing: 0.1,
    color: COLORS.textGreenDark,
    textAlign: 'center',
  },

  /* ── Go To Home button ── */
  goHomeButton: {
    width: '100%',
    height: 44,
    backgroundColor: COLORS.surfaceBluePrimary,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goHomeText: {
    fontFamily: FONTS.family,
    fontWeight: FONTS.weights.semiBold,
    fontSize: FONTS.sizes.sm,
    lineHeight: 20,
    letterSpacing: 0.1,
    color: COLORS.textBlueWhite,
  },
});
