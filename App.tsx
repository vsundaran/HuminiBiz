import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { QueryClientProvider } from '@tanstack/react-query';
import BootSplash from 'react-native-bootsplash';

import { gluestackConfig } from './src/theme/gluestack.config';
import { queryClient } from './src/services/api/queryClient';
import { ErrorBoundary } from './src/components/global/ErrorBoundary';
import { globalScreenOptions } from './src/animations';

import { HomeScreen } from './src/screens/HomeScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { OtpScreen } from './src/screens/OtpScreen';

import { LiveMomentsScreen } from './src/screens/LiveMomentsScreen';
import { RingingScreen } from './src/screens/RingingScreen';
import { VideoCallScreen } from './src/screens/VideoCallScreen';
import { CallCompletedScreen } from './src/screens/CallCompletedScreen';
import { SelectReasonScreen } from './src/screens/SelectReasonScreen';
import { ReportSubmittedScreen } from './src/screens/ReportSubmittedScreen';
import { CreateMomentScreen } from './src/screens/CreateMomentScreen';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  useEffect(() => {
    const init = async () => {
      // You can implement any pre-fetching or setup here if required
    };
    init().finally(async () => {
      await BootSplash.hide({ fade: true });
    });
  }, []);
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <GluestackUIProvider config={gluestackConfig}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <NavigationContainer>
              <Stack.Navigator
                initialRouteName="Login"
                screenOptions={{
                  ...globalScreenOptions,
                }}>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Otp" component={OtpScreen} />
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="LiveMoments" component={LiveMomentsScreen} />
                <Stack.Screen name="Ringing" component={RingingScreen} />
                <Stack.Screen name="VideoCall" component={VideoCallScreen} />
                <Stack.Screen name="CallCompleted" component={CallCompletedScreen} />
                <Stack.Screen name="SelectReason" component={SelectReasonScreen} />
                <Stack.Screen name="ReportSubmitted" component={ReportSubmittedScreen} />
                <Stack.Screen name="CreateMoment" component={CreateMomentScreen} />

              </Stack.Navigator>
            </NavigationContainer>
          </GluestackUIProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

export default App;
