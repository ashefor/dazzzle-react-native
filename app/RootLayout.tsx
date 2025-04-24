
import { TamaguiProvider, YStack } from 'tamagui'
import { tamaguiConfig } from '../tamagui.config';
import GlobalProvider from '@/context/GlobalProvider';
import AxiosProvider from '@/context/AxiosProvider';
import NavigationStack from '@/components/NavigationStack';
import ToastWrapper from '@/components/toast/ToastWrapper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { useColorScheme } from 'react-native';

const RootLayout = () => {
    console.log('RootLayout');
    const colorScheme = useColorScheme()
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
    )
}

export default RootLayout