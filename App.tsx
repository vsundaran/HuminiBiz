import React, { useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { QueryClientProvider } from '@tanstack/react-query';
import BootSplash from 'react-native-bootsplash';

import { useAuthStore } from './src/store/auth.store';

import { gluestackConfig } from './src/theme/gluestack.config';
import { queryClient } from './src/services/api/queryClient';
import { ErrorBoundary } from './src/components/global/ErrorBoundary';
import { globalScreenOptions } from './src/animations';

import { HomeScreen } from './src/screens/HomeScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { OtpScreen } from './src/screens/OtpScreen';

import { ListMomentsScreen } from './src/screens/ListMomentsScreen';
import { RingingScreen } from './src/screens/RingingScreen';
import { VideoCallScreen } from './src/screens/VideoCallScreen';
import { CallCompletedScreen } from './src/screens/CallCompletedScreen';
import { SelectReasonScreen } from './src/screens/SelectReasonScreen';
import { ReportSubmittedScreen } from './src/screens/ReportSubmittedScreen';
import { CreateMomentScreen } from './src/screens/CreateMomentScreen';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  const [isReady, setIsReady] = useState(false);
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    let unsub: (() => void) | undefined;
    
    if (useAuthStore.persist.hasHydrated()) {
      setIsReady(true);
    } else {
      unsub = useAuthStore.persist.onFinishHydration(() => {
        setIsReady(true);
      });
    }

    return () => {
      if (unsub) unsub();
    };
  }, []);

  useEffect(() => {
    if (isReady) {
      const init = async () => {
        // You can implement any pre-fetching or setup here if required
      };
      init().finally(() => {
        // Add a small delay to ensure React Navigation has rendered the initial screen
        setTimeout(async () => {
          await BootSplash.hide({ fade: true });
        }, 100);
      });
    }
  }, [isReady]);

  if (!isReady) {
    return <></>;
  }

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <GluestackUIProvider config={gluestackConfig}>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
            <NavigationContainer theme={{
              ...DefaultTheme,
              colors: {
                ...DefaultTheme.colors,
                background: '#FFFFFF',
              },
            }}>
              <Stack.Navigator
                initialRouteName={accessToken ? "Home" : "Login"}
                screenOptions={{
                  ...globalScreenOptions,
                }}>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Otp" component={OtpScreen} />
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="ListMoments" component={ListMomentsScreen} />
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
