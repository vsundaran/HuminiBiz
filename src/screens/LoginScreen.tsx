import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, TextInput, TouchableOpacity, Text as RNText, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HuminiLogo } from '../assets/icons/HuminiLogo';
import { ArrowRightIcon } from '../assets/icons/ArrowRightIcon';
import { AnimatedScreen, AnimatedView, AnimatedPressable } from '../components/animated';
import { useRequestOtp } from '../hooks/useAuth';

const { width } = Dimensions.get('window');

type RootStackParamList = {
  Login: { email?: string } | undefined;
  Home: undefined;
  Otp: { email: string };
};

export const LoginScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'Login'>>();

  const [email, setEmail] = useState(route.params?.email || '');

  useEffect(() => {
    if (route.params?.email) {
      setEmail(route.params.email);
    }
  }, [route.params?.email]);

  const { mutate: requestOtp, isPending } = useRequestOtp();

  const handleGetOTP = () => {
    if (!email.trim()) return;

    requestOtp(
      { email: email.trim() },
      {
        onSuccess: () => {
          navigation.navigate('Otp', { email: email.trim() });
        },
        onError: (error: any) => {
          Alert.alert(
            'Error',
            error.response?.data?.message || 'Failed to request OTP. Please try again.'
          );
        },
      }
    );
  };

  const isEmailEmpty = email.trim() === '';
  const isSubmitDisabled = isEmailEmpty || isPending;

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
        <View style={styles.content}>
          {/* Logo Section */}
          <AnimatedView animation="slideDown" style={styles.logoContainer}>
            <HuminiLogo size={65} />
          </AnimatedView>

          {/* Title */}
          <AnimatedView animation="slideUp" delay={100}>
            <RNText style={styles.title}>Log In</RNText>
          </AnimatedView>

          {/* Form Section */}
          <AnimatedView animation="slideUp" delay={200} style={styles.formContainer}>
            <RNText style={styles.inputLabel}>Enter Org Email</RNText>
            
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Enter your organisation email"
                placeholderTextColor="#9BA1A3"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </AnimatedView>

          {/* Submit Button */}
          <AnimatedView animation="slideUp" delay={300} style={{ width: '100%' }}>
            <AnimatedPressable 
              style={[styles.button, isSubmitDisabled && styles.buttonDisabled]} 
              onPress={handleGetOTP}
              disabled={isSubmitDisabled}
            >
              {isPending ? (
                <ActivityIndicator size="small" color="#FFFFFF" style={{ marginRight: 10 }} />
              ) : (
                <>
                  <RNText style={[styles.buttonText, isEmailEmpty && styles.buttonTextDisabled]}>
                    Get OTP
                  </RNText>
                  <View style={styles.buttonIcon}>
                    <ArrowRightIcon size={20} color={isEmailEmpty ? '#9B9B9B' : '#FFFFFF'} />
                  </View>
                </>
              )}
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
  content: {
    flex: 1,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  logoContainer: {
    marginTop: 60, // Relative spacing based on 360px height design
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'DM Sans',
    fontWeight: '700',
    fontSize: 24,
    color: '#263238',
    letterSpacing: -0.24,
    marginTop: 46,
    textAlign: 'center',
    lineHeight: 30,
  },
  formContainer: {
    width: '100%',
    // maxWidth: 327,
    marginTop: 48,
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
  inputWrapper: {
    width: '100%',
    height: 48,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    fontFamily: 'DM Sans',
    fontWeight: '500',
    fontSize: 14,
    color: '#000000',
  },
  button: {
    width: '100%',
    // maxWidth: 328,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#263238', 
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 47,
  },
  buttonDisabled: {
    backgroundColor: '#DDDDDD',
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
