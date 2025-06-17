import React from 'react'
import { router, Stack } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const NavigationStack = () => {

    return (
        <Stack screenOptions={{
            headerShown: false
        }}>
            {/* <Stack.Screen name='(auth)' />
            <Stack.Screen name='onboard' />
            <Stack.Screen name='subscription' />
            <Stack.Screen name="(tabs)" /> */}
            {/* <Stack.Screen name="view-user/[userName]"

            />
            <Stack.Screen
                      name="[userId]"
                      options={{
                        title: 'User Id',
                        headerShown: false,
                      }} /> */}
            <Stack.Screen name="landing" />
            <Stack.Screen name="paywall" />
            <Stack.Screen name="user-details" />
            <Stack.Screen name="+not-found" />
        </Stack>
    )
}

export default NavigationStack