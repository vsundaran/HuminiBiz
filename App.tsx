import React, { useEffect, useRef, useState } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  NavigationContainer,
  DefaultTheme,
  createNavigationContainerRef,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { QueryClientProvider } from '@tanstack/react-query';
import BootSplash from 'react-native-bootsplash';

import { useAuthStore } from './src/store/auth.store';
import { useCallStore } from './src/store/callStore';
import { socketService } from './src/services/socket/socketService';
import { SOCKET_EVENTS } from './src/services/socket/events';

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
import { IncomingCallScreen } from './src/screens/IncomingCallScreen';

// ─── Navigation ref ───────────────────────────────────────────────────────────
// Allows imperative navigation from socket callbacks outside component tree
export const navigationRef = createNavigationContainerRef<any>();

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  const [isReady, setIsReady] = useState(false);
  const { accessToken, user } = useAuthStore();
  const listenersRegistered = useRef(false);

  // ── Hydration check ────────────────────────────────────────────────────────
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
      if (unsub) { unsub(); }
    };
  }, []);

  // ── Connect socket explicitly when hydrated ──────────────────────────────
  useEffect(() => {
    console.log(accessToken, isReady, user?.organizationId, "user")
    if (isReady && accessToken && user?.organizationId) {
      console.log('🔌 [App] Hydration complete, ensuring socket is connected');
      socketService.connect(accessToken, user.organizationId);
    }
    else{
      console.log("Skipping Connection")
    }
  }, [isReady, accessToken, user?.organizationId]);

  // ── Splash screen ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (isReady) {
      setTimeout(async () => {
        await BootSplash.hide({ fade: true });
      }, 100);
    }
  }, [isReady]);

  // ── Global call socket listeners ───────────────────────────────────────────
  // Registered once after hydration. Use navigationRef for imperative navigation.
  useEffect(() => {
    if (!isReady || listenersRegistered.current) { return; }
    listenersRegistered.current = true;

    const { setIncomingCall, setActiveCall, setWasDeclinedByCallee, clearAll } =
      useCallStore.getState();

    /**
     * INCOMING_CALL — emitted to the callee when someone calls them.
     * We store call data and navigate to IncomingCallScreen.
     */
    const offIncoming = socketService.on(SOCKET_EVENTS.INCOMING_CALL, (data: any) => {
      console.log('📲 [Socket] INCOMING_CALL receiver received payload:', data);
      setIncomingCall({
        callId: data.callId,
        callerId: data.callerId,
        callerName: data.callerName ?? 'Unknown',
        callerRole: data.callerRole ?? '',
        categoryName: data.categoryName ?? '',
        subcategoryName: data.subcategoryName ?? '',
        momentDescription: data.momentDescription ?? '',
        channelName: data.channelName,
        agoraAppId: data.agoraAppId,
        token: data.token,
      });

      // Navigate to IncomingCall — works even if navigator isn't mounted yet
      if (navigationRef.isReady()) {
        console.log('📲 [Socket] Navigating to IncomingCall screen');
        navigationRef.navigate('IncomingCall');
      } else {
        console.warn('⚠️ [Socket] navigationRef is NOT ready yet, missed IncomingCall navigation');
      }
    });

    /**
     * CALL_ACCEPTED — emitted to the caller when callee accepts.
     * Navigate caller from RingingScreen → VideoCallScreen.
     */
    const offAccepted = socketService.on(SOCKET_EVENTS.CALL_ACCEPTED, (data: any) => {
      // Enrich activeCall with the Agora token the server just generated for us
      const current = useCallStore.getState().activeCall;
      if (current) {
        setActiveCall({
          ...current,
          token: data.token ?? current.token,
          channelName: data.channelName ?? current.channelName,
          agoraAppId: data.agoraAppId ?? current.agoraAppId,
        });
      }

      if (navigationRef.isReady()) {
        navigationRef.navigate('VideoCall');
      }
    });

    /**
     * CALL_DECLINED — emitted to the caller when callee declines.
     * Flag the RingingScreen to show "Did not pick" state.
     */
    const offDeclined = socketService.on(SOCKET_EVENTS.CALL_DECLINED, (_data: any) => {
      setWasDeclinedByCallee(true);
    });

    /**
     * CALL_ENDED — emitted to the counterpart when either side ends the call.
     * Both parties navigate to CallCompletedScreen.
     */
    const offEnded = socketService.on(SOCKET_EVENTS.CALL_ENDED, (_data: any) => {
      const state = useCallStore.getState();
      const name = state.activeCall?.receiverName ?? state.incomingCall?.callerName ?? 'Unknown';
      const role = state.activeCall?.receiverRole ?? state.incomingCall?.callerRole ?? '';
      
      clearAll();
      if (navigationRef.isReady()) {
        navigationRef.navigate('CallCompleted', { name, role });
      }
    });

    /**
     * CALL_MISSED — emitted to the caller when 30s timeout fires.
     * Navigate caller back from RingingScreen to CallCompleted / Home.
     */
    const offMissed = socketService.on(SOCKET_EVENTS.CALL_MISSED, (_data: any) => {
      const state = useCallStore.getState();
      const name = state.activeCall?.receiverName ?? state.incomingCall?.callerName ?? 'Unknown';
      const role = state.activeCall?.receiverRole ?? state.incomingCall?.callerRole ?? '';
      
      clearAll();
      if (navigationRef.isReady()) {
        navigationRef.navigate('CallCompleted', { name, role });
      }
    });

    return () => {
      offIncoming();
      offAccepted();
      offDeclined();
      offEnded();
      offMissed();
      listenersRegistered.current = false;
    };
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
            <NavigationContainer
              ref={navigationRef}
              theme={{
                ...DefaultTheme,
                colors: {
                  ...DefaultTheme.colors,
                  background: '#FFFFFF',
                },
              }}
            >
              <Stack.Navigator
                initialRouteName={accessToken ? 'Home' : 'Login'}
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
                <Stack.Screen name="IncomingCall" component={IncomingCallScreen} />
              </Stack.Navigator>
            </NavigationContainer>
          </GluestackUIProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

export default App;
