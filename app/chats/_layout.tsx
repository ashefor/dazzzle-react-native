import React from 'react'
import { Stack } from 'expo-router'

const ProfileLayout = () => {
  return (
    <>
      <Stack screenOptions={{
        headerShown: false,
      }}>
        <Stack.Screen
          name='index'
          options={{
            title: 'Chats',
            // headerShown: false
          }} />
      </Stack>
    </>
  )
}

export default ProfileLayout