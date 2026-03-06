import React, { useCallback } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Stop, Rect, Path } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  withDelay,
  withSpring,
  runOnJS,
  Easing,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect } from 'react';

import { COLORS, FONTS } from '../theme';
import { AvatarGlowIcon } from '../assets/icons/AvatarGlowIcon';
import { AnimatedScreen, AnimatedView } from '../components/animated';
import { InitialsAvatar } from '../components/common/InitialsAvatar';
import { EventChip } from '../components/chips/EventChip';
import { useCallStore } from '../store/callStore';
import { updateCallStatus } from '../services/call.service';

// ─────────────────────────────────────────
// Layout constants (must match styles below)
// ─────────────────────────────────────────
const PILL_WIDTH = 239;
const PILL_PADDING = 6;
const BTN_SIZE = 52;
const MAX_DRAG = PILL_WIDTH - BTN_SIZE - PILL_PADDING * 2 - 4; // ~171
const ACCEPT_THRESHOLD = MAX_DRAG * 0.5;

type RootStackParamList = {
  Home: undefined;
  IncomingCall: undefined;
  VideoCall: undefined;
};

// ─────────────────────────────────────────
// Animated chevron arrow (>>> indicator)
// ─────────────────────────────────────────
const ChevronArrow = ({ delay = 0 }: { delay: number }) => {
  const opacity = useSharedValue(0.2);

  useEffect(() => {
    opacity.value = withRepeat(
      withDelay(
        delay,
        withSequence(
          withTiming(1, { duration: 350, easing: Easing.out(Easing.ease) }),
          withTiming(0.2, { duration: 350, easing: Easing.in(Easing.ease) }),
        ),
      ),
      -1,
      false,
    );
  }, [delay, opacity]);

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View style={[styles.chevron, animStyle]}>
      <Svg width={10} height={16} viewBox="0 0 10 16" fill="none">
        <Path
          d="M1.5 1.5L8.5 8L1.5 14.5"
          stroke="#4b8121"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </Animated.View>
  );
};

// ─────────────────────────────────────────
// Video camera icon
// ─────────────────────────────────────────
const VideoButtonIcon = () => (
  <Svg width={26} height={18} viewBox="0 0 26 18" fill="none">
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M15.6 0.27C12.56 -0.063 9.5 -0.088 6.45 0.196L4.3 0.387C3.43 0.464 2.62 0.828 1.99 1.418C1.36 2.007 0.948 2.789 0.822 3.637C0.296 7.138 0.296 10.706 0.822 14.208C0.948 15.057 1.362 15.84 1.996 16.43C2.63 17.019 3.442 17.382 4.312 17.458L6.463 17.65C9.513 17.934 12.58 17.909 15.62 17.576L16.44 17.488C17.283 17.402 18.074 17.047 18.69 16.478C19.306 15.909 19.713 15.157 19.872 14.338L23.952 16.597C24.101 16.676 24.268 16.718 24.436 16.717C24.604 16.717 24.769 16.674 24.918 16.593C25.067 16.511 25.192 16.395 25.285 16.253C25.377 16.112 25.434 15.95 25.449 15.782L25.483 15.393C25.864 11.08 25.864 6.74 25.483 2.427L25.449 2.038C25.434 1.87 25.376 1.708 25.284 1.566C25.192 1.424 25.066 1.307 24.917 1.226C24.768 1.145 24.601 1.102 24.433 1.102C24.265 1.101 24.099 1.143 23.95 1.224L19.872 3.483C19.713 2.663 19.306 1.911 18.69 1.342C18.074 0.773 17.283 0.419 16.44 0.333L15.6 0.27ZM6.652 2.22C9.69 1.954 12.745 1.978 15.78 2.29L16.6 2.378C17.008 2.421 17.388 2.608 17.672 2.907C17.956 3.206 18.126 3.597 18.152 4.009C18.643 7.222 18.643 10.498 18.152 13.71C18.126 14.122 17.956 14.513 17.672 14.812C17.388 15.111 17.008 15.298 16.6 15.341L15.78 15.43C12.745 15.741 9.69 15.765 6.652 15.5L4.5 15.308C4.087 15.271 3.701 15.086 3.413 14.787C3.125 14.488 2.953 14.095 2.928 13.68C2.44 10.473 2.44 7.248 2.928 4.042C2.952 3.625 3.124 3.231 3.413 2.93C3.702 2.63 4.089 2.444 4.503 2.407L6.652 2.22Z"
      fill="white"
    />
  </Svg>
);

// ─────────────────────────────────────────
// X (decline) icon
// ─────────────────────────────────────────
const XIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
    <Path
      d="M15 5L5 15M5 5L15 15"
      stroke="white"
      strokeWidth={2.5}
      strokeLinecap="round"
    />
  </Svg>
);

// ─────────────────────────────────────────
// SwipeAcceptPill
// ─────────────────────────────────────────
type SwipeAcceptPillProps = { onAccept: () => void };

const SwipeAcceptPill: React.FC<SwipeAcceptPillProps> = ({ onAccept }) => {
  const dragX = useSharedValue(0);
  const startX = useSharedValue(0);

  const acceptOnJS = useCallback(() => {
    onAccept();
  }, [onAccept]);

  const panGesture = Gesture.Pan()
    .activeOffsetX([-8, 8])
    .failOffsetY([-15, 15])
    .onStart(() => {
      startX.value = dragX.value;
    })
    .onUpdate((e) => {
      const next = startX.value + e.translationX;
      dragX.value = Math.min(Math.max(next, 0), MAX_DRAG);
    })
    .onEnd(() => {
      if (dragX.value >= ACCEPT_THRESHOLD) {
        runOnJS(acceptOnJS)();
        dragX.value = withSpring(MAX_DRAG, { damping: 18, stiffness: 200 });
      } else {
        dragX.value = withSpring(0, { damping: 20, stiffness: 260 });
      }
    });

  const btnAnimStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: dragX.value }],
  }));

  const contentFadeStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      dragX.value,
      [0, ACCEPT_THRESHOLD],
      [1, 0],
      Extrapolation.CLAMP,
    );
    return { opacity };
  });

  const pillBgStyle = useAnimatedStyle(() => {
    const bg = interpolate(
      dragX.value,
      [0, MAX_DRAG],
      [0.5, 0.85],
      Extrapolation.CLAMP,
    );
    return { backgroundColor: `rgba(223, 255, 212, ${bg})` };
  });

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.acceptPill, pillBgStyle]}>
        <Animated.View style={[styles.acceptVideoBtn, btnAnimStyle]}>
          <Svg
            height="100%"
            width="100%"
            preserveAspectRatio="none"
            style={StyleSheet.absoluteFillObject}
          >
            <Defs>
              <LinearGradient id="green-grad" x1="0" y1="1" x2="1" y2="0">
                <Stop offset="0.057" stopColor="#3C9718" stopOpacity="1" />
                <Stop offset="0.835" stopColor="#9BFF58" stopOpacity="1" />
              </LinearGradient>
            </Defs>
            <Rect x="0" y="0" width="100%" height="100%" fill="url(#green-grad)" rx="100" />
          </Svg>
          <VideoButtonIcon />
        </Animated.View>

        <Animated.View style={[styles.pillContent, contentFadeStyle]}>
          <Text style={styles.acceptLabel}>Swipe to accept</Text>
          <View style={styles.chevronsRow}>
            <ChevronArrow delay={0} />
            <ChevronArrow delay={150} />
            <ChevronArrow delay={300} />
            <ChevronArrow delay={450} />
          </View>
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
};

// ─────────────────────────────────────────
// Main Screen
// ─────────────────────────────────────────
export const IncomingCallScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [isAccepting, setIsAccepting] = React.useState(false);

  // Consume call data from store (populated by App.tsx socket listener)
  const incomingCall = useCallStore((s) => s.incomingCall);
  const setIncomingCall = useCallStore((s) => s.setIncomingCall);

  // Derive display values with safe fallbacks
  const callerName = incomingCall?.callerName ?? 'Unknown';
  const callerRole = incomingCall?.callerRole ?? '';
  const momentDescription = incomingCall?.momentDescription ?? '';

  const handleAccept = useCallback(async () => {
    if (!incomingCall || isAccepting) { return; }
    setIsAccepting(true);
    try {
      await updateCallStatus(incomingCall.callId, 'accepted');
      navigation.replace('VideoCall');
    } catch {
      setIsAccepting(false);
    }
  }, [incomingCall, isAccepting, navigation]);

  const handleDecline = useCallback(async () => {
    if (!incomingCall) {
      if (navigation.canGoBack()) { navigation.goBack(); } else { navigation.replace('Home'); }
      return;
    }
    try {
      await updateCallStatus(incomingCall.callId, 'declined');
    } finally {
      setIncomingCall(null);
      if (navigation.canGoBack()) { navigation.goBack(); } else { navigation.replace('Home'); }
    }
  }, [incomingCall, navigation, setIncomingCall]);

  return (
    <GestureHandlerRootView style={styles.flex}>
      <AnimatedScreen style={styles.container}>
        {/* ── Background gradient ── */}
        <View style={StyleSheet.absoluteFillObject}>
          <Svg height="100%" width="100%" preserveAspectRatio="none">
            <Defs>
              <LinearGradient id="bg-grad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#FFFBEA" stopOpacity="1" />
                <Stop offset="0.29" stopColor="#F4F4F4" stopOpacity="1" />
                <Stop offset="1" stopColor="#F4F4F4" stopOpacity="1" />
              </LinearGradient>
            </Defs>
            <Rect x="0" y="0" width="100%" height="100%" fill="url(#bg-grad)" />
          </Svg>
        </View>

        {/* ── Bottom amber glow ── */}
        <View style={styles.bottomGlowContainer} pointerEvents="none">
          <Svg height="100%" width="100%" preserveAspectRatio="none">
            <Defs>
              <LinearGradient id="bottom-glow" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="rgba(255,255,255,0)" stopOpacity="0" />
                <Stop offset="0.35" stopColor="#DB9F3D" stopOpacity="0.12" />
                <Stop offset="0.65" stopColor="#DB9F3D" stopOpacity="0.3" />
                <Stop offset="1" stopColor="#DB9F3D" stopOpacity="0.5" />
              </LinearGradient>
            </Defs>
            <Rect x="0" y="0" width="100%" height="100%" fill="url(#bottom-glow)" />
          </Svg>
        </View>

        <SafeAreaView style={styles.safeArea}>
          {/* ── Avatar + Name + Role + Category Chip ── */}
          <AnimatedView animation="slideUp" delay={100} style={styles.profileSection}>
            <View style={styles.avatarWrapper}>
              <View style={styles.glowRef}>
                <AvatarGlowIcon size={170} />
              </View>
              {/* InitialsAvatar replaces photo as per requirements */}
              <InitialsAvatar
                name={callerName}
                size={120}
                fontSize={40}
                style={styles.avatarInitials}
              />
            </View>

            <Text style={styles.callerName}>{callerName}</Text>
            {!!callerRole && <Text style={styles.callerRole}>{callerRole}</Text>}

            {(!!incomingCall?.categoryName || !!incomingCall?.subcategoryName) && (
              <View style={{ marginTop: 12 }}>
                <EventChip 
                  categoryName={incomingCall?.categoryName} 
                  subcategoryName={incomingCall?.subcategoryName} 
                />
              </View>
            )}
          </AnimatedView>

          {/* ── "Humini calling" label ── */}
          <AnimatedView animation="fade" delay={250} style={styles.callingLabelWrapper}>
            <Text style={styles.callingLabel}>Humini calling</Text>
          </AnimatedView>

          {/* ── Bottom action bar ── */}
          <AnimatedView animation="slideUp" delay={350} style={styles.actionsContainer}>
            {isAccepting ? (
              <ActivityIndicator size="large" color={COLORS.primary} />
            ) : (
              <>
                {/* Drag-to-accept pill */}
                <SwipeAcceptPill onAccept={handleAccept} />

                {/* Decline button */}
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={handleDecline}
                  style={styles.declineBtn}
                >
                  <Svg
                    height="100%"
                    width="100%"
                    preserveAspectRatio="none"
                    style={StyleSheet.absoluteFillObject}
                  >
                    <Defs>
                      <LinearGradient id="red-grad" x1="0" y1="0" x2="0" y2="1">
                        <Stop offset="0" stopColor="#FF5C5C" stopOpacity="1" />
                        <Stop offset="1" stopColor="#FF0000" stopOpacity="1" />
                      </LinearGradient>
                    </Defs>
                    <Rect x="0" y="0" width="100%" height="100%" fill="url(#red-grad)" rx="100" />
                  </Svg>
                  <XIcon />
                </TouchableOpacity>
              </>
            )}
          </AnimatedView>
        </SafeAreaView>
      </AnimatedScreen>
    </GestureHandlerRootView>
  );
};

// ─────────────────────────────────────────
// Styles
// ─────────────────────────────────────────
const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1 },
  bottomGlowContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 280,
    overflow: 'hidden',
  },
  safeArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 72,
  },

  // ── Avatar section ──
  profileSection: { alignItems: 'center', marginBottom: 0 },
  avatarWrapper: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 22,
    position: 'relative',
  },
  glowRef: {
    position: 'absolute',
    top: -40,
    left: -40,
    right: -40,
    bottom: -40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 0,
  },
  avatarInitials: {
    zIndex: 10,
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
  callerRole: {
    fontFamily: FONTS.styles.bodyMedium14.fontFamily,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    color: COLORS.textBodyText1,
    textAlign: 'center',
    marginTop: 2,
    marginBottom: 10,
  },
  chip: {
    backgroundColor: COLORS.greenBackground,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 210,
    maxWidth: 240,
    marginTop: 8,
  },
  chipText: {
    fontFamily: FONTS.styles.subTitleSemibold14.fontFamily,
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 18,
    color: COLORS.textGreenDark,
    textAlign: 'center',
  },

  // ── Calling label ──
  callingLabelWrapper: { marginTop: 60, marginBottom: 12 },
  callingLabel: {
    fontFamily: FONTS.styles.subTitleSemibold14.fontFamily,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    color: COLORS.textBodyText1,
    textAlign: 'center',
  },

  // ── Actions bar ──
  actionsContainer: {
    position: 'absolute',
    bottom: 72,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },

  acceptPill: {
    width: PILL_WIDTH,
    height: 64,
    borderRadius: 160,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: PILL_PADDING,
    overflow: 'hidden',
  },
  acceptVideoBtn: {
    width: BTN_SIZE,
    height: BTN_SIZE,
    borderRadius: 100,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pillContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
  },
  acceptLabel: {
    fontFamily: FONTS.styles.subTitleBold16.fontFamily,
    fontSize: 14,
    fontWeight: '700',
    color: '#4b8121',
    letterSpacing: 0.1,
    lineHeight: 20,
    flex: 1,
  },
  chevronsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 1,
    paddingRight: 8,
  },
  chevron: {
    width: 10,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Decline button
  declineBtn: {
    width: 64,
    height: 64,
    borderRadius: 100,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.95)',
  },
});
