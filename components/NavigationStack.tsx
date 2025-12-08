import React from 'react';
import { Stack } from 'expo-router';

const NavigationStack = () => {
    // useSubscriptionChecker()

    return (
        <Stack screenOptions={{
            contentStyle: {
                backgroundColor: '#1A1A1A'
            },
            headerShown: false
        }}>
            <Stack.Screen name="+not-found" />
        </Stack>
    )
}

export default NavigationStack