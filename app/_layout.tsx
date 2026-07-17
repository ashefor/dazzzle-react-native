import 'react-native-get-random-values';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { LilitaOne_400Regular } from '@expo-google-fonts/lilita-one/400Regular';

import { Onest_100Thin, Onest_200ExtraLight, Onest_300Light, Onest_400Regular, Onest_500Medium, Onest_600SemiBold, Onest_700Bold, Onest_800ExtraBold, Onest_900Black, useFonts } from '@expo-google-fonts/onest';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';

import { useColorScheme } from '@/hooks/useColorScheme';
import ToastWrapper from '@/components/toast/ToastWrapper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaystackProvider } from 'react-native-paystack-webview';
import { Provider } from 'react-redux';
import { initializeStorePromise, store } from '@/redux/store';
import { LoaderProvider } from '@/context/loader/LoaderProvider';

import {
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SystemBars } from 'react-native-edge-to-edge';
import NavigationStack from '@/components/NavigationStack';

import { IAPProvider } from '@/context/IAPProvider'; // ← new


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [initialized, setInitialized] = useState(false);
  // const [loaded] = useFonts({
  //   FiraSans_100Thin,
  //   FiraSans_200ExtraLight, FiraSans_300Light, FiraSans_400Regular, FiraSans_500Medium, FiraSans_600SemiBold, FiraSans_700Bold, FiraSans_800ExtraBold, FiraSans_900Black
  // });

  const [loaded] = useFonts({
    Onest_100Thin,
    Onest_200ExtraLight, Onest_300Light, Onest_400Regular, Onest_500Medium, Onest_600SemiBold, Onest_700Bold, Onest_800ExtraBold, Onest_900Black,
    LilitaOne_400Regular
  });

  useEffect(() => {
    const init = async () => {
      await initializeStorePromise;
      setInitialized(true);
      
      // // Register for Push Token on app launch
      // await registerForPushNotificationsAsync();
    };
    init();
  }, []);

  // useEffect(() => {
  //    if (!initialized) return;

  //    // Register listeners for incoming messages
  //    const cleanUp = registerNotificationListeners(
  //       store.dispatch, 
  //       store.getState, 
  //       (userId) => router.push(`/single-chat/${userId}`)
  //    );
     
  //    return () => {
  //       cleanUp();
  //    };
  // }, [initialized]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!(loaded)) {
    return null;
  }

  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{
        flex: 1,
      }}>
        <ToastWrapper />
        {/* App-wide default: dark icons/text, for the light UI every screen uses.
            Screens with a dark background (e.g. landing) override it locally.
            SystemBars (not RN's StatusBar) is the edge-to-edge-aware API — under
            edgeToEdgeEnabled the StatusBar backgroundColor prop is ignored. */}
        <SystemBars style="dark" />
       <BottomSheetModalProvider>
            <ThemeProvider value={DefaultTheme}>
              <LoaderProvider>
                <KeyboardProvider>
                  <PaystackProvider publicKey='pk_live_67c43aae73865b3ab28ff664f702855471f5f468' defaultChannels={['card', 'bank_transfer', 'bank', 'ussd', 'qr', 'mobile_money', 'apple_pay', 'eft']}>
                      <IAPProvider>
                        <NavigationStack />
                      </IAPProvider>
                  </PaystackProvider>
                </KeyboardProvider>
              </LoaderProvider>
            </ThemeProvider>
          </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </Provider>
  );
}
