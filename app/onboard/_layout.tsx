import { StyleSheet } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const AuthLayout = () => {
  return (
    <>
      <Stack screenOptions={{
        title: '',
        headerStyle: {
          backgroundColor: '#FFFFFF'
        },
        headerShown: false,
      }}
      >
        {/* <Stack.Screen name='bio-data' options={{
          headerLeft: () => <TouchableOpacity onPress={() => router.replace('/(auth)/sign-in')} className='flex items-center justify-center pr-4 w-9 h-8'>
            <ArrowBackIcon />
          </TouchableOpacity>
        }} />
        <Stack.Screen name='profile-picture' options={{
          headerLeft: () => <TouchableOpacity onPress={() => router.back()} className='flex items-center justify-center pr-4 w-9 h-8'>
            <ArrowBackIcon />
          </TouchableOpacity>
        }} /> */}
      </Stack>
    </>
  )
}

export default AuthLayout

const styles = StyleSheet.create({})