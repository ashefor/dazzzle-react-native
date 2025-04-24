import 'react-native-get-random-values'

import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { FiraSans_100Thin, FiraSans_200ExtraLight, FiraSans_300Light, FiraSans_400Regular, FiraSans_500Medium, FiraSans_600SemiBold, FiraSans_700Bold, FiraSans_800ExtraBold, FiraSans_900Black, useFonts } from '@expo-google-fonts/fira-sans';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { TamaguiProvider, YStack } from 'tamagui'
import { tamaguiConfig } from '../tamagui.config';
import GlobalProvider from '@/context/GlobalProvider';
import AxiosProvider from '@/context/AxiosProvider';
import NavigationStack from '@/components/NavigationStack';
import ToastWrapper from '@/components/toast/ToastWrapper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    FiraSans_100Thin,
    FiraSans_200ExtraLight, FiraSans_300Light, FiraSans_400Regular, FiraSans_500Medium, FiraSans_600SemiBold, FiraSans_700Bold, FiraSans_800ExtraBold, FiraSans_900Black
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
    <GestureHandlerRootView style={{
      flex: 1,
    }}>
      <ToastWrapper />
      <StatusBar style="light" backgroundColor='#1A1A1A' />
      <TamaguiProvider config={tamaguiConfig} defaultTheme={colorScheme!}>
      <ThemeProvider value={DarkTheme}>
          <GlobalProvider>
            <AxiosProvider>
              <NavigationStack />
            </AxiosProvider>
          </GlobalProvider>
      </ThemeProvider>
      </TamaguiProvider>
    </GestureHandlerRootView>
  );
}
