import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  withDelay,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { PhoneDeclineIcon } from '../assets/icons/PhoneDeclineIcon';
import { VolumeHighGreyIcon } from '../assets/icons/VolumeHighGreyIcon';
import { AvatarGlowIcon } from '../assets/icons/AvatarGlowIcon';
import { PhoneIcon } from '../assets/icons/PhoneIcon';
import { ArrowLeftLineIcon } from '../assets/icons/ArrowLeftLineIcon';
import { COLORS, FONTS } from '../theme';
import { AnimatedScreen, AnimatedView, AnimatedPressable } from '../components/animated';
import { Shadow } from 'react-native-shadow-2';
import { InitialsAvatar } from '../components/common/InitialsAvatar';
import { EventChip } from '../components/chips/EventChip';

import { useCallStore } from '../store/callStore';
import { initiateCall, updateCallStatus } from '../services/call.service';

type RootStackParamList = {
  Home: undefined;
  Ringing: undefined;
  VideoCall: undefined;
};

// ─── Animated ringing dot ─────────────────────────────────────────────────────
const Dot = ({ delay = 0 }: { delay: number }) => {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withDelay(
        delay,
        withSequence(
          withTiming(1, { duration: 400 }),
          withTiming(0.3, { duration: 400 }),
        ),
      ),
      -1,
      false,
    );
  }, [delay, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return <Animated.View style={[styles.dot, animatedStyle]} />;
};

export const RingingScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // ── Call store ───────────────────────────────────────────────────────────────
  const activeCall = useCallStore((s) => s.activeCall);
  const wasDeclinedByCallee = useCallStore((s) => s.wasDeclinedByCallee);
  const setActiveCall = useCallStore((s) => s.setActiveCall);
  const setWasDeclinedByCallee = useCallStore((s) => s.setWasDeclinedByCallee);
  const clearAll = useCallStore((s) => s.clearAll);

  const receiverName = activeCall?.receiverName ?? 'Unknown';
  const receiverRole = activeCall?.receiverRole ?? '';
  const momentDescription = activeCall?.momentDescription ?? '';

  // Local "declined" mirrors the store flag so UI reacts immediately
  const [isDeclined, setIsDeclined] = useState(false);

  // When App.tsx socket listener sets wasDeclinedByCallee, sync local state
  useEffect(() => {
    if (wasDeclinedByCallee) {
      setIsDeclined(true);
      // Reset the store flag so it doesn't persist
      setWasDeclinedByCallee(false);
    }
  }, [wasDeclinedByCallee, setWasDeclinedByCallee]);

  // ── Caller declines (cancels outgoing call) ──────────────────────────────────
  const handleDecline = useCallback(async () => {
    if (!activeCall) {
      setIsDeclined(true);
      return;
    }
    try {
      await updateCallStatus(activeCall.callId, 'declined');
    } finally {
      setIsDeclined(true);
    }
  }, [activeCall]);

  // ── Navigate back to Home ────────────────────────────────────────────────────
  const handleBack = useCallback(() => {
    clearAll();
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.replace('Home');
    }
  }, [clearAll, navigation]);

  // ── Call Again — re-initiate call with same receiver & moment ────────────────
  const handleCallAgain = useCallback(async () => {
    if (!activeCall) { return; }
    try {
      const result = await initiateCall(activeCall.receiverId, activeCall.momentId);
      setActiveCall({
        ...activeCall,
        callId: result.call._id,
        token: result.token,
        channelName: result.channelName,
        agoraAppId: result.agoraAppId,
      });
      setIsDeclined(false);
      setWasDeclinedByCallee(false);
    } catch {
      // Silently fail — user can try again
    }
  }, [activeCall, setActiveCall, setWasDeclinedByCallee]);

  return (
    <AnimatedScreen style={styles.container}>
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
          <AnimatedView animation="slideUp" delay={100} style={styles.avatarContainer}>
            <View style={styles.glowRef}>
              <AvatarGlowIcon size={200} />
            </View>
            {/* InitialsAvatar replaces photo as per requirements */}
            <InitialsAvatar
              name={receiverName}
              size={140}
              fontSize={48}
              style={styles.avatarInitials}
            />
          </AnimatedView>

          <Text style={styles.callerName}>{receiverName}</Text>
          {!!receiverRole && <Text style={styles.callRole}>{receiverRole}</Text>}
          
          
        </View>

        {/* Ringing indicator */}
        <View style={styles.ringingIndicator}>
          {isDeclined ? (
            <Text style={styles.didNotPickText}>Did not pick</Text>
          ) : (
            <>
              <Text style={styles.ringingText}>Ringing</Text>
              <View style={styles.dotsContainer}>
                <Dot delay={0} />
                <Dot delay={200} />
                <Dot delay={400} />
                <Dot delay={600} />
              </View>
            </>
          )}
        </View>

        {/* Moment Context Card */}
        {!!momentDescription && (
          <AnimatedView animation="slideUp" delay={200} style={{ width: '85%', maxWidth: 340 }}>
            <Shadow
              distance={8}
              startColor="#0000000A"
              offset={[0, 8]}
              style={styles.messageCard}
              containerStyle={{ width: '100%' }}
            >
              {(!!activeCall?.categoryName || !!activeCall?.subcategoryName) && (
            <View style={{marginBottom: 12}}>
              <EventChip 
                categoryName={activeCall?.categoryName} 
                subcategoryName={activeCall?.subcategoryName} 
              />
            </View>
          )}
              <Text style={styles.messageText}>{momentDescription}</Text>
            </Shadow>
          </AnimatedView>
        )}

        {/* Bottom Actions */}
        <AnimatedView animation="slideUp" delay={300} style={styles.actionsPillContainer}>
          {isDeclined ? (
            <View style={styles.declinedActionsContainer}>
              {/* Back Button */}
              <View style={styles.declinedActionWrapper}>
                <AnimatedPressable style={styles.backOuter} onPress={handleBack}>
                  <View style={styles.backInner}>
                    <ArrowLeftLineIcon size={24} color="#515B60" />
                  </View>
                </AnimatedPressable>
                <Text style={styles.declinedActionText}>Back</Text>
              </View>

              {/* Call Again Button */}
              <View style={styles.declinedActionWrapper}>
                <AnimatedPressable style={styles.callAgainOuter} onPress={handleCallAgain}>
                  <View style={styles.callAgainInner}>
                    <Svg
                      height="100%"
                      width="100%"
                      preserveAspectRatio="none"
                      style={StyleSheet.absoluteFillObject}
                    >
                      <Defs>
                        <LinearGradient id="call-again-gradient" x1="0" y1="0" x2="1" y2="1">
                          <Stop offset="0.14" stopColor="#A6FF6A" stopOpacity="1" />
                          <Stop offset="0.87" stopColor="#CFFFAD" stopOpacity="1" />
                        </LinearGradient>
                      </Defs>
                      <Rect x="0" y="0" width="100%" height="100%" fill="url(#call-again-gradient)" />
                    </Svg>
                    <PhoneIcon size={24} color="#486333" />
                  </View>
                </AnimatedPressable>
                <Text style={styles.declinedActionText}>Call Again</Text>
              </View>
            </View>
          ) : (
            <View style={styles.actionsPill}>
              {/* Volume Button (placeholder — mute will be on VideoCall) */}
              <AnimatedPressable style={styles.greyButton}>
                <VolumeHighGreyIcon size={24} />
              </AnimatedPressable>

              {/* Decline Button */}
              <AnimatedPressable
                style={styles.declineButton}
                onPress={handleDecline}
              >
                <View style={styles.declineIconWrapper}>
                  <Svg
                    height="100%"
                    width="100%"
                    preserveAspectRatio="none"
                    style={StyleSheet.absoluteFillObject}
                  >
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
              </AnimatedPressable>
            </View>
          )}
        </AnimatedView>
      </SafeAreaView>
    </AnimatedScreen>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 82,
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
  avatarInitials: {
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
  didNotPickText: {
    fontFamily: FONTS.styles.headlineBold24.fontFamily,
    fontSize: 14,
    fontWeight: '700',
    color: '#263238',
    letterSpacing: 0.1,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 2,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#C8CFD3',
  },
  messageCard: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    paddingTop: 22,
    paddingBottom: 22,
    paddingHorizontal: 19,
    alignItems: 'center',
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
    bottom: 80,
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
    overflow: 'hidden',
  },
  declineIconWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  declinedActionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 67,
  },
  declinedActionWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  backOuter: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 6,
  },
  backInner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F1F1F1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  callAgainOuter: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F3FFEA',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 6,
  },
  callAgainInner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  declinedActionText: {
    fontFamily: FONTS.styles.subTitleSemibold14.fontFamily,
    fontSize: 11,
    fontWeight: '600',
    color: '#515B60',
  },
});
