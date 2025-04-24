import React, { Fragment } from 'react'
import { useGlobalContext } from '@/context/GlobalProvider';
import { router, ScreenProps, Stack } from 'expo-router';
import { NativeStackNavigationEventMap, NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { ParamListBase, StackNavigationState } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const NavigationStack = () => {

    return (
        <Stack screenOptions={{
            headerShown: false
        }}>
            <Stack.Screen name='(auth)' options={{ headerShown: false }} />
            <Stack.Screen name='onboard' options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="view-user/[userName]"
                options={{
                    headerTransparent: true,
                    title: 'View User',
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
    )

    // let screens: ScreenProps<NativeStackNavigationOptions, StackNavigationState<ParamListBase>, NativeStackNavigationEventMap>[] = [];
    // if (!authState) {
    //     screens = [{ name: 'onboard', options: { headerShown: false } }];
    //   } else if (authState == 'completed') {
    //     screens = [{ name: '(auth)', options: { headerShown: false } }];
    //   } else {
    //     screens = [
    //       { name: '(tabs)', options: { headerShown: false } },
    //       { name: 'view-user/[userName]', options: { headerTransparent: true, title: 'View User' } },
    //       { name: 'my-profile', options: { headerTransparent: true, title: 'My Profile' } },
    //       {
    //         name: 'user-filter',
    //         options: {
    //           presentation: 'modal',
    //           headerStyle: { backgroundColor: '#1A1A1A' },
    //           title: 'Filter Users',
    //         },
    //       },
    //       { name: '+not-found' },
    //     ];
    //   }

    //   return (
    //     <Stack screenOptions={{ headerShown: false }}>
    //       {screens.map((screen) => (
    //         <Stack.Screen key={screen.name} name={screen.name} options={screen.options} />
    //       ))}
    //     </Stack>
    //   );
}

export default NavigationStack