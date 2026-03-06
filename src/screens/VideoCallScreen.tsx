import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text, Dimensions, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { PhoneDeclineIcon } from '../assets/icons/PhoneDeclineIcon';
import { MicrophoneIcon } from '../assets/icons/MicrophoneIcon';
import { MicrophoneSlashIcon } from '../assets/icons/MicrophoneSlashIcon';
import { VideoCameraIcon } from '../assets/icons/VideoCameraIcon';
import { VideoCameraSlashIcon } from '../assets/icons/VideoCameraSlashIcon';
import { RotateCameraIcon } from '../assets/icons/RotateCameraIcon';

import { COLORS, FONTS } from '../theme';
import { AnimatedScreen, AnimatedView, AnimatedPressable } from '../components/animated';
import { Shadow } from 'react-native-shadow-2';
import { useCallStore } from '../store/callStore';
import { updateCallStatus } from '../services/call.service';

import {
  createAgoraRtcEngine,
  ChannelProfileType,
  ClientRoleType,
  IRtcEngine,
  RtcSurfaceView,
  RtcConnection,
} from 'react-native-agora';

type RootStackParamList = {
  Home: undefined;
  Ringing: undefined;
  VideoCall: undefined;
  CallCompleted: { name: string; role: string };
};

const { width, height } = Dimensions.get('window');

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
  
  const agoraAppId = activeCall?.agoraAppId ?? incomingCall?.agoraAppId ?? '';
  const channelName = activeCall?.channelName ?? incomingCall?.channelName ?? '';
  const token = activeCall?.token ?? incomingCall?.token ?? '';

  // ── Agora Engine & State ───────────────────────────────────────────────────
  const engineRef = useRef<IRtcEngine | null>(null);
  const [isJoined, setIsJoined] = useState(false);
  const [remoteUid, setRemoteUid] = useState<number | null>(null);
  const [isConnecting, setIsConnecting] = useState(true);

  // Local Controls
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  // Remote Controls
  const [isRemoteMuted, setIsRemoteMuted] = useState(false);
  const [isRemoteVideoOff, setIsRemoteVideoOff] = useState(false);

  useEffect(() => {
    initAgora();
    return () => {
      leaveAgora();
    };
  }, []);

  const initAgora = async () => {
    if (!agoraAppId) return;

    try {
      engineRef.current = createAgoraRtcEngine();
      engineRef.current.initialize({ appId: agoraAppId });

      engineRef.current.registerEventHandler({
        onJoinChannelSuccess: (connection: RtcConnection, elapsed: number) => {
          setIsJoined(true);
          setIsConnecting(false);
        },
        onUserJoined: (connection: RtcConnection, remoteUidVal: number, elapsed: number) => {
          setRemoteUid(remoteUidVal);
        },
        onUserOffline: (connection: RtcConnection, remoteUidVal: number, reason) => {
          setRemoteUid(null);
        },
        onUserMuteAudio: (connection: RtcConnection, remoteUidVal: number, muted: boolean) => {
          setIsRemoteMuted(muted);
        },
        onUserMuteVideo: (connection: RtcConnection, remoteUidVal: number, muted: boolean) => {
          setIsRemoteVideoOff(muted);
        },
      });

      engineRef.current.enableVideo();
      engineRef.current.startPreview();

      engineRef.current.joinChannel(token, channelName, 0, {
        clientRoleType: ClientRoleType.ClientRoleBroadcaster,
        channelProfile: ChannelProfileType.ChannelProfileCommunication,
      });
    } catch (e) {
      console.error('Error initializing Agora:', e);
      setIsConnecting(false);
    }
  };

  const leaveAgora = () => {
    if (engineRef.current) {
      engineRef.current.leaveChannel();
      engineRef.current.release();
      engineRef.current = null;
    }
  };

  // ── Call controls ──────────────────────────────────────────────────────────
  const toggleMute = () => {
    if (engineRef.current) {
      const targetState = !isMuted;
      engineRef.current.muteLocalAudioStream(targetState);
      setIsMuted(targetState);
    }
  };

  const toggleVideo = () => {
    if (engineRef.current) {
      const targetState = !isVideoOff;
      engineRef.current.muteLocalVideoStream(targetState);
      setIsVideoOff(targetState);
      if (targetState) {
        engineRef.current.stopPreview();
      } else {
        engineRef.current.startPreview();
      }
    }
  };

  const switchCamera = () => {
    if (engineRef.current) {
      engineRef.current.switchCamera();
    }
  };

  // ── Call timer ─────────────────────────────────────────────────────────────
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isJoined) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) { clearInterval(timerRef.current); }
    };
  }, [isJoined]);

  const formatTime = useCallback((seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }, []);

  const handleEndCall = useCallback(async () => {
    if (timerRef.current) { clearInterval(timerRef.current); }
    leaveAgora();

    if (callId) {
      try {
        await updateCallStatus(callId, 'ended');
      } catch {
        // Best-effort — navigate regardless
      }
    }
    clearAll();
    navigation.replace('CallCompleted', { name: displayName, role: displayRole });
  }, [callId, clearAll, navigation, displayName, displayRole]);

  return (
    <View style={styles.container}>
      {/* Remote Video Background */}
      {remoteUid !== null && !isRemoteVideoOff ? (
        <RtcSurfaceView canvas={{ uid: remoteUid }} style={StyleSheet.absoluteFillObject} />
      ) : (
        <View style={styles.remotePlaceholder}>
          {isConnecting ? (
            <View style={styles.connectingContainer}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.remotePlaceholderText}>Connecting...</Text>
            </View>
          ) : (
            <Text style={styles.remotePlaceholderText}>
              {remoteUid !== null ? 'Remote Video Off' : 'Waiting for user...'}
            </Text>
          )}
        </View>
      )}

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
          
          {isRemoteMuted && (
            <View style={styles.remoteMutedPill}>
              <MicrophoneSlashIcon size={18} color="#e8e8e8" />
              <Text style={styles.mutedText}>{displayName.split(' ')[0]} Muted</Text>
            </View>
          )}
        </AnimatedView>

        {/* Local video (top-right PiP) */}
        <AnimatedView animation="scale" delay={300} style={styles.localVideoWrapper}>
          <Shadow
            distance={5}
            startColor="rgba(0,0,0,0.3)"
            offset={[0, 4]}
            style={styles.localVideoContainer}
          >
            {!isVideoOff ? (
              <RtcSurfaceView canvas={{ uid: 0 }} style={StyleSheet.absoluteFillObject} />
            ) : (
              <View style={styles.localPlaceholder}>
                <VideoCameraSlashIcon size={32} color="#999" />
              </View>
            )}

            {isMuted && (
              <View style={styles.localMutedOverlay}>
                <MicrophoneSlashIcon size={14} color="#e8e8e8" />
                <Text style={styles.mutedTextSmall}>You Muted</Text>
              </View>
            )}
          </Shadow>
        </AnimatedView>

        <AnimatedView animation="slideUp" delay={100} style={styles.bottomSection}>
          {/* Timer */}
          <View style={styles.timerPill}>
            <Text style={styles.timerText}>{formatTime(elapsedSeconds)}</Text>
          </View>

          {/* Call Controls */}
          <View style={styles.controlsBar}>
            <AnimatedPressable style={styles.iconBtnWhite} onPress={switchCamera}>
              <RotateCameraIcon size={24} color="#263238" />
            </AnimatedPressable>

            {/* In a real app we might also toggle speakerphone, for now placeholder like original */}
            <AnimatedPressable style={[styles.iconBtnWhite, isVideoOff && styles.iconBtnMuted]} onPress={toggleVideo}>
              {isVideoOff ? <VideoCameraSlashIcon size={24} color={COLORS.white} /> : <VideoCameraIcon size={24} color="#263238" />}
            </AnimatedPressable>

            <AnimatedPressable style={[styles.iconBtnWhite, isMuted && styles.iconBtnMuted]} onPress={toggleMute}>
              {isMuted ? <MicrophoneSlashIcon size={24} color={COLORS.white} /> : <MicrophoneIcon size={24} color="#263238" />}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  remotePlaceholder: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  connectingContainer: {
    alignItems: 'center',
    gap: 12,
  },
  remotePlaceholderText: {
    fontFamily: FONTS.styles.bodyMedium14.fontFamily,
    color: '#888',
    fontSize: 16,
  },
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 140,
    zIndex: 1,
  },
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 240,
    zIndex: 1,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
    zIndex: 2,
    pointerEvents: 'box-none',
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
  remoteMutedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 200,
    marginTop: 12,
    gap: 4,
  },
  mutedText: {
    fontFamily: FONTS.styles.bodyMedium14.fontFamily,
    fontWeight: '500',
    fontSize: 12,
    color: '#e8e8e8',
    lineHeight: 18,
  },
  localVideoWrapper: {
    position: 'absolute',
    top: 150,
    right: 20,
    zIndex: 10,
  },
  localVideoContainer: {
    width: 110,
    height: 150,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backgroundColor: '#000',
  },
  localPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#263238',
  },
  localMutedOverlay: {
    position: 'absolute',
    bottom: 8,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 200,
    gap: 4,
  },
  mutedTextSmall: {
    fontFamily: FONTS.styles.bodyMedium14.fontFamily,
    fontWeight: '500',
    fontSize: 10,
    color: '#e8e8e8',
  },
  bottomSection: {
    alignItems: 'center',
    marginBottom: Platform.OS === 'ios' ? 20 : 40,
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
    gap: 10,
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
    backgroundColor: 'rgba(241, 241, 241, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBtnMuted: {
    backgroundColor: '#FF5C5C',
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

