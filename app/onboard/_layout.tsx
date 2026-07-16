import React from 'react'
import { Stack } from 'expo-router'

const AuthLayout = () => {
  return (
    <Stack screenOptions={{
      title: '',
      headerStyle: {
        backgroundColor: '#FFFFFF'
      },
      headerShown: false,
    }}
    />
  )
}

export default AuthLayout
