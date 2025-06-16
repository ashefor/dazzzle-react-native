import React from 'react'
import { router, Stack } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSubscriptionChecker } from '@/hooks/useSubscriptionChecker';

const NavigationStack = () => {
    // useSubscriptionChecker()

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
}

export default NavigationStack