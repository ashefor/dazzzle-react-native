import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { PortalProvider } from '@tamagui/portal'

import { FiraSans_100Thin, FiraSans_200ExtraLight, FiraSans_300Light, FiraSans_400Regular, FiraSans_500Medium, FiraSans_600SemiBold, FiraSans_700Bold, FiraSans_800ExtraBold, FiraSans_900Black, useFonts } from '@expo-google-fonts/fira-sans';
import { router, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { TamaguiProvider, YStack } from 'tamagui'
import { tamaguiConfig } from '../tamagui.config';
import GlobalProvider from '@/context/GlobalProvider';
import { ActivityIndicator, TouchableOpacity } from 'react-native';
import ArrowBackIcon from '@/components/icons/ArrowBackIcon';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SheetProvider } from 'react-native-actions-sheet';
import '@/context/sheets.tsx';
import { API_URL } from '@/constants/constants';
import axios from 'axios';
import { AppGeneralState, BasicAppInterfaceResponse, ReactionCodes } from '@/models/general';
import { setItem } from '@/utils/asyncStorage';
import AppLayout from '@/components/AppLayout';
import AxiosProvider from '@/context/AxiosProvider';
import NavigationStack from '@/components/NavigationStack';
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    FiraSans_100Thin,
    FiraSans_200ExtraLight, FiraSans_300Light, FiraSans_400Regular, FiraSans_500Medium, FiraSans_600SemiBold, FiraSans_700Bold, FiraSans_800ExtraBold, FiraSans_900Black
  });
  const [loadedGeneralConfigSettings, setLoadedGeneralConfigSettings] = useState<boolean>(false);

  // useEffect(() => {
  //   if (loaded && loadedGeneralConfigSettings) {
  //     SplashScreen.hideAsync();
  //   }
  // }, [loaded]);

  useEffect(() => {
    axios.get(API_URL + '/user/prepare-sign-up').then((res) => {
      const response = res.data as BasicAppInterfaceResponse;
      if (response.reaction != ReactionCodes.SUCCESS) {
        throw new Error('Failed to load basic settings')
      } else {
        const generalConfigSettings = response.data;
        setItem('generalConfigSettings', generalConfigSettings);
        setLoadedGeneralConfigSettings(true);
      }
    }).catch(err => {
      setLoadedGeneralConfigSettings(false);
      console.log(err)
    })

    if (loaded && loadedGeneralConfigSettings) {
      SplashScreen.hideAsync();
    }
  }, [loadedGeneralConfigSettings, loaded])

  if (!(loaded)) {
    return null;
  }

  return (
    <ThemeProvider value={DarkTheme}>
      <TamaguiProvider config={tamaguiConfig} defaultTheme={colorScheme!}>
        <GlobalProvider>
          <AxiosProvider>
            {loadedGeneralConfigSettings ? 
            <NavigationStack /> : 
            <YStack flex={1} bg="$background" justifyContent='center' alignItems='center' className='h-full'>
              <ActivityIndicator />
            </YStack>
            }
          </AxiosProvider>
        </GlobalProvider>
      </TamaguiProvider>
    </ThemeProvider>
  );
}
