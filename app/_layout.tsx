import 'react-native-get-random-values';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Onest_100Thin, Onest_200ExtraLight, Onest_300Light, Onest_400Regular, Onest_500Medium, Onest_600SemiBold, Onest_700Bold, Onest_800ExtraBold, Onest_900Black, useFonts } from '@expo-google-fonts/onest';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { useColorScheme } from '@/hooks/useColorScheme';
import { TamaguiProvider, YStack } from 'tamagui'
import { tamaguiConfig } from '../tamagui.config';
import GlobalProvider from '@/context/GlobalProvider';
import AxiosProvider from '@/context/AxiosProvider';
import NavigationStack from '@/components/NavigationStack';
import ToastWrapper from '@/components/toast/ToastWrapper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import { PaystackProvider } from 'react-native-paystack-webview';
import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import { SheetProvider } from 'react-native-actions-sheet';
import '@/context/sheets';
import { LoaderWrapper } from '@/components/loader/LoaderWrapper';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

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
        <LoaderWrapper />
        <TamaguiProvider config={tamaguiConfig} defaultTheme={colorScheme!}>
          <ThemeProvider value={DarkTheme}>
            <GlobalProvider>
              <AxiosProvider>
                <SheetProvider>
                  <NavigationStack />
                </SheetProvider>
              </AxiosProvider>
            </GlobalProvider>
          </ThemeProvider>
        </TamaguiProvider>
      </GestureHandlerRootView>
    </Provider>
  );
}
