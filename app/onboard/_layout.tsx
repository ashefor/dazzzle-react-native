import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { router, Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import ArrowBackIcon from '@/components/icons/ArrowBackIcon'

const AuthLayout = () => {
  return (
    <>
      <Stack screenOptions={{
        title: '',
        headerStyle: {
          backgroundColor: '#1A1A1A'
        },
        headerLeft: () => <TouchableOpacity onPress={() => router.back()} className='flex items-center justify-center pr-4 w-9 h-8'>
          <ArrowBackIcon />
        </TouchableOpacity>
      }}>
        <Stack.Screen name='bio-data' options={{
          headerLeft: () => <TouchableOpacity onPress={() => router.replace('/(auth)/sign-in')} className='flex items-center justify-center pr-4 w-9 h-8'>
            <ArrowBackIcon />
          </TouchableOpacity>
        }} />
        <Stack.Screen name='profile-picture' options={{
          headerLeft: () => <TouchableOpacity onPress={() => router.back()} className='flex items-center justify-center pr-4 w-9 h-8'>
            <ArrowBackIcon />
          </TouchableOpacity>
        }} />
      </Stack>
      <StatusBar style='light' />
    </>
  )
}

export default AuthLayout

const styles = StyleSheet.create({})