import 'react-native-get-random-values';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Onest_100Thin, Onest_200ExtraLight, Onest_300Light, Onest_400Regular, Onest_500Medium, Onest_600SemiBold, Onest_700Bold, Onest_800ExtraBold, Onest_900Black, useFonts } from '@expo-google-fonts/onest';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { useColorScheme } from '@/hooks/useColorScheme';
import { TamaguiProvider } from 'tamagui';
import { tamaguiConfig } from '../tamagui.config';
import NavigationStack from '@/components/NavigationStack';
import ToastWrapper from '@/components/toast/ToastWrapper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaystackProvider } from 'react-native-paystack-webview';
import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import { SheetProvider } from 'react-native-actions-sheet';
import '@/context/sheets';
import { LoaderProvider } from '@/context/loader/LoaderProvider';
import { StatusBar } from 'react-native';



// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  // const [loaded] = useFonts({
  //   FiraSans_100Thin,
  //   FiraSans_200ExtraLight, FiraSans_300Light, FiraSans_400Regular, FiraSans_500Medium, FiraSans_600SemiBold, FiraSans_700Bold, FiraSans_800ExtraBold, FiraSans_900Black
  // });

  const [loaded] = useFonts({
    Onest_100Thin,
    Onest_200ExtraLight, Onest_300Light, Onest_400Regular, Onest_500Medium, Onest_600SemiBold, Onest_700Bold, Onest_800ExtraBold, Onest_900Black
  });

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
      <StatusBar barStyle={'light-content'} />
      {/* <LoaderWrapper/> */}
      <TamaguiProvider config={tamaguiConfig} defaultTheme={colorScheme!}>
      <ThemeProvider value={DarkTheme}>
          <LoaderProvider>
            <PaystackProvider publicKey='pk_live_67c43aae73865b3ab28ff664f702855471f5f468' defaultChannels={['card', 'bank_transfer', 'bank', 'ussd', 'qr', 'mobile_money', 'apple_pay', 'eft']}>
              <SheetProvider>
                <NavigationStack />
              </SheetProvider>
              </PaystackProvider>
          </LoaderProvider>
      </ThemeProvider>
      </TamaguiProvider>
    </GestureHandlerRootView>
    </Provider>
  );
}
