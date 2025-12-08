import 'react-native-get-random-values';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Onest_100Thin, Onest_200ExtraLight, Onest_300Light, Onest_400Regular, Onest_500Medium, Onest_600SemiBold, Onest_700Bold, Onest_800ExtraBold, Onest_900Black, useFonts } from '@expo-google-fonts/onest';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';

import { useColorScheme } from '@/hooks/useColorScheme';
import { TamaguiProvider } from 'tamagui';
import { tamaguiConfig } from '../tamagui.config';
import ToastWrapper from '@/components/toast/ToastWrapper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaystackProvider } from 'react-native-paystack-webview';
import { Provider } from 'react-redux';
import { initializeStorePromise, store } from '@/redux/store';
import { SheetProvider } from 'react-native-actions-sheet';
import '@/context/sheets';
import { LoaderProvider } from '@/context/loader/LoaderProvider';
import { StatusBar } from 'react-native';

import {
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import { KeyboardProvider } from "react-native-keyboard-controller";
import NavigationStack from '@/components/NavigationStack';



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
    Onest_200ExtraLight, Onest_300Light, Onest_400Regular, Onest_500Medium, Onest_600SemiBold, Onest_700Bold, Onest_800ExtraBold, Onest_900Black
  });

  useEffect(() => {
    initializeStorePromise.then(() => setInitialized(true));
  }, []);

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
        <StatusBar barStyle={'dark-content'} backgroundColor={"#ffffff"} />
        <TamaguiProvider config={tamaguiConfig} defaultTheme={colorScheme!}>
          <BottomSheetModalProvider>
            <ThemeProvider value={DefaultTheme}>
              <LoaderProvider>
                <KeyboardProvider>
                  <PaystackProvider publicKey='pk_live_67c43aae73865b3ab28ff664f702855471f5f468' defaultChannels={['card', 'bank_transfer', 'bank', 'ussd', 'qr', 'mobile_money', 'apple_pay', 'eft']}>
                    <SheetProvider>
                      <NavigationStack />
                    </SheetProvider>
                  </PaystackProvider>
                </KeyboardProvider>
              </LoaderProvider>
            </ThemeProvider>
          </BottomSheetModalProvider>
        </TamaguiProvider>
      </GestureHandlerRootView>
    </Provider>
  );
}
