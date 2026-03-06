import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { PhoneDeclineIcon } from '../assets/icons/PhoneDeclineIcon';
import { VolumeHighGreyIcon } from '../assets/icons/VolumeHighGreyIcon';
import { MicrophoneIcon } from '../assets/icons/MicrophoneIcon';
import { VideoCameraIcon } from '../assets/icons/VideoCameraIcon';
import { RotateCameraIcon } from '../assets/icons/RotateCameraIcon';

import { COLORS, FONTS } from '../theme';
import { AnimatedScreen, AnimatedView, AnimatedPressable } from '../components/animated';
import { Shadow } from 'react-native-shadow-2';
import { useCallStore } from '../store/callStore';
import { updateCallStatus } from '../services/call.service';

type RootStackParamList = {
  Home: undefined;
  Ringing: undefined;
  VideoCall: undefined;
  CallCompleted: undefined;
};

const { width } = Dimensions.get('window');

export const VideoCallScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // ── Call store ─────────────────────────────────────────────────────────────
  const activeCall = useCallStore((s) => s.activeCall);
  const incomingCall = useCallStore((s) => s.incomingCall);
  const clearAll = useCallStore((s) => s.clearAll);

  // Determine which side we are: caller (activeCall) or callee (incomingCall)
  const callId = activeCall?.callId ?? incomingCall?.callId ?? '';
  const displayName = activeCall?.receiverName ?? incomingCall?.callerName ?? 'Unknown';
  const displayRole = activeCall?.receiverRole ?? incomingCall?.callerRole ?? '';

  // ── Call timer ─────────────────────────────────────────────────────────────
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => {
      if (timerRef.current) { clearInterval(timerRef.current); }
    };
  }, []);

  const formatTime = useCallback((seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }, []);

  // ── End call ────────────────────────────────────────────────────────────────
  const handleEndCall = useCallback(async () => {
    if (timerRef.current) { clearInterval(timerRef.current); }
    if (callId) {
      try {
        await updateCallStatus(callId, 'ended');
      } catch {
        // Best-effort — navigate regardless
      }
    }
    clearAll();
    navigation.replace('CallCompleted');
  }, [callId, clearAll, navigation]);

  return (
    <AnimatedScreen style={styles.container}>
      {/* Top Gradient for Text Readability */}
      <View style={styles.topGradient}>
        <Svg height="100%" width="100%" preserveAspectRatio="none">
          <Defs>
            <LinearGradient id="top-grad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="rgba(0,0,0,0.5)" stopOpacity="1" />
              <Stop offset="0.6" stopColor="rgba(0,0,0,0.3)" stopOpacity="1" />
              <Stop offset="1" stopColor="rgba(0,0,0,0)" stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#top-grad)" />
        </Svg>
      </View>

      {/* Bottom Gradient for Controls */}
      <View style={styles.bottomGradient}>
        <Svg height="100%" width="100%" preserveAspectRatio="none">
          <Defs>
            <LinearGradient id="bot-grad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="rgba(0,0,0,0)" stopOpacity="1" />
              <Stop offset="0.4" stopColor="rgba(0,0,0,0.3)" stopOpacity="1" />
              <Stop offset="1" stopColor="rgba(0,0,0,0.5)" stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#bot-grad)" />
        </Svg>
      </View>

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <AnimatedView animation="slideDown" style={styles.header}>
          <Text style={styles.callerName}>{displayName}</Text>
          {!!displayRole && <Text style={styles.callRole}>{displayRole}</Text>}
        </AnimatedView>

        {/* Local video placeholder (top-right PiP) */}
        <AnimatedView animation="scale" delay={300} style={styles.localVideoWrapper}>
          <Shadow
            distance={5}
            startColor="rgba(0,0,0,0.3)"
            offset={[0, 4]}
            style={styles.localVideoContainer}
          >
            <View />
          </Shadow>
        </AnimatedView>

        <AnimatedView animation="slideUp" delay={100} style={styles.bottomSection}>
          {/* Timer */}
          <View style={styles.timerPill}>
            <Text style={styles.timerText}>{formatTime(elapsedSeconds)}</Text>
          </View>

          {/* Call Controls */}
          <View style={styles.controlsBar}>
            <AnimatedPressable style={styles.iconBtnWhite}>
              <RotateCameraIcon size={24} color="#263238" />
            </AnimatedPressable>

            <AnimatedPressable style={styles.iconBtnTranslucent}>
              <VolumeHighGreyIcon size={24} />
            </AnimatedPressable>

            <AnimatedPressable style={styles.iconBtnWhite}>
              <VideoCameraIcon size={24} color="#263238" />
            </AnimatedPressable>

            <AnimatedPressable style={styles.iconBtnWhite}>
              <MicrophoneIcon size={24} color="#263238" />
            </AnimatedPressable>

            {/* End Call */}
            <AnimatedPressable style={styles.endCallBtn} onPress={handleEndCall}>
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
        </AnimatedView>
      </SafeAreaView>
    </AnimatedScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 140,
  },
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 240,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 10,
  },
  callerName: {
    fontFamily: FONTS.styles.headlineBold24.fontFamily,
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.15,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 3,
  },
  callRole: {
    fontFamily: FONTS.styles.bodyMedium14.fontFamily,
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    marginTop: 4,
  },
  localVideoWrapper: {
    position: 'absolute',
    top: 190,
    right: 20,
  },
  localVideoContainer: {
    width: 120,
    height: 160,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backgroundColor: '#1a1a1a',
  },
  bottomSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  timerPill: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 22,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
  },
  timerText: {
    fontFamily: FONTS.styles.subTitleSemibold14.fontFamily,
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  controlsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 40,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    gap: 7,
  },
  iconBtnWhite: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F1F1F1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBtnTranslucent: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(241, 241, 241, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  endCallBtn: {
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
});
