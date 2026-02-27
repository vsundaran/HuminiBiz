import React from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { PhoneDeclineIcon } from '../assets/icons/PhoneDeclineIcon';
import { VolumeHighGreyIcon } from '../assets/icons/VolumeHighGreyIcon';
import { MicrophoneIcon } from '../assets/icons/MicrophoneIcon';
import { VideoCameraIcon } from '../assets/icons/VideoCameraIcon';
import { RotateCameraIcon } from '../assets/icons/RotateCameraIcon';
// @ts-ignore Let's handle RootStackParamList locally here or by type
import { RootStackParamList } from '../components/cards/MomentCard';

import { COLORS, FONTS } from '../theme';
import { AnimatedScreen, AnimatedView, AnimatedPressable } from '../components/animated';

const { width, height } = Dimensions.get('window');

export const VideoCallScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleEndCall = () => {
    navigation.replace('CallCompleted');
  };

  return (
    <AnimatedScreen style={styles.container}>
      {/* Full Screen Background Video/Image */}
      {/* <Image
        source={{ uri: 'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=crop&q=80&w=1000' }}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
      /> */}

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
        {/* Header section */}
        <AnimatedView animation="slideDown" style={styles.header}>
          <Text style={styles.callerName}>Gnani Gnanasekaran</Text>
          <Text style={styles.callRole}>Frappe Manager</Text>
        </AnimatedView>

        {/* Small floating video view (Local user) */}
        <AnimatedView animation="scale" delay={300} style={styles.localVideoContainer}>
          <View />
          {/* <Image
            source={{ uri: 'https://i.pravatar.cc/300?img=11' }}
            style={styles.localVideo}
          /> */}
        </AnimatedView>

        <AnimatedView animation="slideUp" delay={100} style={styles.bottomSection}>
          {/* Timer */}
          <View style={styles.timerPill}>
            <Text style={styles.timerText}>00:30</Text>
          </View>

          {/* Call Controls Box */}
          <View style={styles.controlsBar}>
            {/* Rotate Camera */}
            <AnimatedPressable style={styles.iconBtnWhite}>
              <RotateCameraIcon size={24} color="#263238" />
            </AnimatedPressable>

            {/* Volume */}
            <AnimatedPressable style={styles.iconBtnTranslucent}>
              <VolumeHighGreyIcon size={24} />
            </AnimatedPressable>

            {/* Video */}
            <AnimatedPressable style={styles.iconBtnWhite}>
              <VideoCameraIcon size={24} color="#263238" />
            </AnimatedPressable>

            {/* Microphone */}
            <AnimatedPressable style={styles.iconBtnWhite}>
              <MicrophoneIcon size={24} color="#263238" />
            </AnimatedPressable>

            {/* End Call */}
            <AnimatedPressable 
              style={styles.endCallBtn} 
              onPress={handleEndCall}
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
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 3,
  },
  callerName: {
    fontFamily: FONTS.styles.headlineBold24.fontFamily,
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.15,
  },
  callRole: {
    fontFamily: FONTS.styles.bodyMedium14.fontFamily,
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    marginTop: 4,
  },
  localVideoContainer: {
    position: 'absolute',
    top: 190,
    right: 20,
    width: 120,
    height: 160,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  localVideo: {
    width: '100%',
    height: '100%',
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
