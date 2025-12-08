import React from 'react'
import { Stack } from 'expo-router'

const ProfileLayout = () => {
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen name='index' options={{
          title: 'Profile',
        }} />
        <Stack.Screen name='blocked-users' options={{
          title: 'Blocked Users',
        }}
        />
        <Stack.Screen name='change-password' options={{
          title: 'Change Password',
        }}
        />
        <Stack.Screen name='change-email' options={{
          title: 'Change Email',
        }}
        />
        <Stack.Screen name='visitors' options={{
          title: 'Visitors',
        }}
        />
        <Stack.Screen name='settings' options={{
          title: 'Notification Preferences',
          presentation: 'modal',
        }}
        />
        <Stack.Screen name='wallet-transactions' options={{
          title: 'Transactions',
        }}
        />
      </Stack>
    </>
  )
}

export default ProfileLayout