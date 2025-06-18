
import { TamaguiProvider, YStack } from 'tamagui'
import { tamaguiConfig } from '../tamagui.config';
import NavigationStack from '@/components/NavigationStack';
import ToastWrapper from '@/components/toast/ToastWrapper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { useColorScheme } from 'react-native';

const RootLayout = () => {
    const colorScheme = useColorScheme()
    return (
        <GestureHandlerRootView style={{
            flex: 1,
          }}>
            <ToastWrapper />
            <TamaguiProvider config={tamaguiConfig} defaultTheme={colorScheme!}>
            <ThemeProvider value={DarkTheme}>
                    <NavigationStack />
            </ThemeProvider>
            </TamaguiProvider>
          </GestureHandlerRootView>
    )
}

export default RootLayout