import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { PortalProvider } from '@tamagui/portal'

import { FiraSans_100Thin, FiraSans_200ExtraLight, FiraSans_300Light, FiraSans_400Regular, FiraSans_500Medium, FiraSans_600SemiBold, FiraSans_700Bold, FiraSans_800ExtraBold, FiraSans_900Black, useFonts } from '@expo-google-fonts/fira-sans';
import { router, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { TamaguiProvider } from 'tamagui'
import { tamaguiConfig } from '../tamagui.config';
import GlobalProvider from '@/context/GlobalProvider';
import { TouchableOpacity } from 'react-native';
import ArrowBackIcon from '@/components/icons/ArrowBackIcon';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SheetProvider } from 'react-native-actions-sheet';
import '@/context/sheets.tsx';
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

  if (!loaded) {
    return null;
  }

  return (
    <GlobalProvider>
      <TamaguiProvider config={tamaguiConfig} defaultTheme={colorScheme!}>
       <PortalProvider>
       <ThemeProvider value={DarkTheme}>
          <SheetProvider>
            {
              <Stack>
                <Stack.Screen name='index' options={{ headerShown: false }} />
                <Stack.Screen name='onboard' options={{ headerShown: false }} />
                <Stack.Screen name='(auth)' options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="view-user/[id]"
                  options={{
                    headerTransparent: true,
                    title: 'View User',
                  }}
                />
                <Stack.Screen name="my-profile"
                  options={{
                    headerTransparent: true,
                    title: 'My Profile',

                  }}
                />
                <Stack.Screen name="user-filter"
                  options={{
                    presentation: 'modal',
                    headerStyle: {
                      backgroundColor: '#1A1A1A'
                    },
                    title: 'Filter Users',
                    headerLeft: () => <TouchableOpacity onPress={() => router.back()} className='flex items-center justify-center'>
                      <Ionicons name="close" size={24} color="white" />
                    </TouchableOpacity>
                  }}
                />
                <Stack.Screen name="+not-found" />
              </Stack>
            }
          </SheetProvider>

          <StatusBar style="light" />
        </ThemeProvider>
       </PortalProvider>
      </TamaguiProvider>
    </GlobalProvider>
  );
}
