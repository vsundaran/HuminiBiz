import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, TextInput, TouchableOpacity, Text as RNText, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowLeftIcon } from '../assets/icons/ArrowLeftIcon';
import { PenIcon } from '../assets/icons/PenIcon';
import { ArrowRightIcon } from '../assets/icons/ArrowRightIcon';
import { AnimatedScreen, AnimatedView, AnimatedPressable } from '../components/animated';

const { width } = Dimensions.get('window');

type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Otp: { email: string };
};

export const OtpScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  
  // Using a mock email since we don't have the param set up strictly yet in this context
  const email = "tamil.selvan@arus.sg";
  
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(59);
  
  const inputRefs = useRef<Array<TextInput | null>>([]);
  
  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timerId);
    }
  }, [timeLeft]);

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus logic
    if (value.length === 1 && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
    
    if (value.length === 0 && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleBackspace = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    setTimeLeft(59);
    // Call API to resend OTP
  };

  const handleLogin = () => {
    // Navigate to Home or Verify OTP API
    console.log("OTP verified:", otp.join(''));
    navigation.navigate('Home');
  };

  const handleBack = () => {
    navigation.navigate('Login');
  };

  const isOtpComplete = otp.every(digit => digit !== '');

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
        {/* Header */}
        <AnimatedView animation="slideDown" style={styles.header}>
            <AnimatedPressable onPress={handleBack} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
               
            
            >
              <View style={{ transform: [{ rotate: '90deg' }] }}>
                <ArrowLeftIcon size={24} color="#263238" />
              </View>
            </AnimatedPressable>
            <RNText style={styles.headerTitle}>Enter OTP</RNText>
        </AnimatedView>

        <View style={styles.content}>
          <AnimatedView animation="slideUp" delay={100} style={styles.formContainer}>
            {/* Email Field (Disabled) */}
            <View style={styles.emailContainer}>
              <RNText style={styles.inputLabel}>Enter Org Email</RNText>
              <View style={styles.emailInputWrapper}>
                <RNText style={styles.emailText}>{email}</RNText>
                <TouchableOpacity onPress={handleBack} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                   <PenIcon size={20} color="#6E767A" />
                </TouchableOpacity>
              </View>
            </View>

            {/* OTP Inputs */}
            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <View key={index} style={[styles.otpInputWrapper, digit ? styles.otpInputWrapperFilled : null]}>
                  <TextInput
                    ref={(ref: TextInput | null) => { inputRefs.current[index] = ref; }}
                    style={styles.otpInput}
                    value={digit}
                    onChangeText={(value) => handleOtpChange(value, index)}
                    onKeyPress={(e) => handleBackspace(e, index)}
                    keyboardType="number-pad"
                    maxLength={1}
                    selectTextOnFocus
                  />
                </View>
              ))}
            </View>
            
            {/* Resend Timer / Button */}
            <View style={styles.resendContainer}>
               {timeLeft > 0 ? (
                 <RNText style={styles.resendText}>
                    Resend OTP in <RNText style={styles.resendTimer}>{timeLeft}</RNText>
                 </RNText>
               ) : (
                 <AnimatedPressable onPress={handleResend}>
                    <RNText style={styles.resendAction}>Resend</RNText>
                 </AnimatedPressable>
               )}
            </View>
          </AnimatedView>

          {/* Submit Button */}
          <AnimatedView animation="slideUp" delay={200} style={styles.buttonPosition}>
            <AnimatedPressable 
                style={[styles.button, !isOtpComplete && styles.buttonDisabled]} 
                onPress={handleLogin}
                disabled={!isOtpComplete}
            >
                <RNText style={[styles.buttonText, !isOtpComplete && styles.buttonTextDisabled]}>
                Log in
                </RNText>
                <View style={styles.buttonIcon}>
                    <ArrowRightIcon size={20} color={isOtpComplete ? '#FFFFFF' : '#9B9B9B'} />
                </View>
            </AnimatedPressable>
          </AnimatedView>
        </View>
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
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerTitle: {
    fontFamily: 'DM Sans',
    fontWeight: '600',
    fontSize: 16,
    color: '#263238',
    marginLeft: 10,
    lineHeight: 24,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  formContainer: {
    width: '100%',
    marginTop: 64, // roughly 192px max from top based on design
  },
  emailContainer: {
    marginBottom: 18,
  },
  inputLabel: {
    fontFamily: 'DM Sans',
    fontWeight: '600',
    fontSize: 14,
    color: '#515B60',
    letterSpacing: 0.1,
    lineHeight: 20,
    marginBottom: 14,
  },
  emailInputWrapper: {
    width: '100%',
    height: 48,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  emailText: {
    fontFamily: 'DM Sans',
    fontWeight: '500',
    fontSize: 14,
    color: '#263238',
    lineHeight: 20,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },
  otpInputWrapper: {
    width: 76,
    height: 48,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpInputWrapperFilled: {
    borderColor: '#BCBFC1',
  },
  otpInput: {
    fontFamily: 'DM Sans',
    fontWeight: '700',
    fontSize: 16,
    color: '#515B60',
    textAlign: 'center',
    width: '100%',
    height: '100%',
    letterSpacing: 0.15,
  },
  resendContainer: {
     alignItems: 'flex-start',
     width: '100%',
  },
  resendText: {
    fontFamily: 'DM Sans',
    fontWeight: '500',
    fontSize: 14,
    color: '#6E767A',
    lineHeight: 20,
  },
  resendTimer: {
    fontFamily: 'DM Sans',
    fontWeight: '700',
    fontSize: 15,
    color: '#263238',
    letterSpacing: 0.15,
  },
  resendAction: {
    fontFamily: 'DM Sans',
    fontWeight: '700',
    fontSize: 15,
    color: '#263238',
    letterSpacing: 0.15,
  },
  buttonPosition: {
    position: 'absolute',
    top: 317,  // 445 - 128 header
    width: '100%',
    paddingHorizontal: 4,
  },
  button: {
    width: '100%',
    height: 44, // 10,12 padding in figma 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#263238', 
    paddingHorizontal: 32,
    borderRadius: 10,
    shadowColor: '#48565C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.29,
    shadowRadius: 11,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: '#DDDDDD',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    fontFamily: 'DM Sans',
    fontWeight: '600',
    fontSize: 14,
    color: '#FFFFFF',
    letterSpacing: 0.1,
    marginRight: 10,
  },
  buttonTextDisabled: {
    color: '#9B9B9B',
  },
  buttonIcon: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
