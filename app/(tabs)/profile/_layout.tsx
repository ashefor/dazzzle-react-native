import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { router, Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import Ionicons from '@expo/vector-icons/Ionicons'
import ArrowBackIcon from '@/components/icons/ArrowBackIcon'

const ProfileLayout = () => {
  return (
    <>
    <Stack screenOptions={{
      headerTitleAlign: 'left',
      headerStyle: {
        backgroundColor: '#1A1A1A',
      },
      headerShadowVisible: false,
      headerTitleStyle: {
        fontWeight: 500,
        fontSize: 14,
        fontFamily: "FiraSans_500Medium",
      },
      headerBackButtonDisplayMode: 'minimal',
    //   headerLeft: () => <TouchableOpacity onPress={() => router.back()} className=' flex items-center justify-center rounded-full w-6'>
    //   <ArrowBackIcon/>
    // </TouchableOpacity>
      }}>
    <Stack.Screen name='index' options={{
      headerTitleAlign: 'left',
      headerStyle: {
        backgroundColor: 'none',
      },
      title: 'Profile',
      headerShadowVisible: false,
      headerTitleStyle: {
            fontWeight: 700,
            fontSize: 20,
            fontFamily: "FiraSans_700Bold",
          },}}/>
    <Stack.Screen name='change-password' options={{
      title: 'Change Password',
    //   headerLeft: () => <TouchableOpacity onPress={() => router.back()} className=' flex items-center justify-center rounded-full w-6'>
    //   <ArrowBackIcon/>
    // </TouchableOpacity>
      }}/>
    <Stack.Screen name='change-email' options={{
      title: 'Change Email',
    //   headerLeft: () => <TouchableOpacity onPress={() => router.back()} className=' flex items-center justify-center rounded-full w-6'>
    //   <ArrowBackIcon/>
    // </TouchableOpacity>
      }}/>
    </Stack>
    <StatusBar backgroundColor='#161622' style='light' />
    </>
  )
}

export default ProfileLayout

const styles = StyleSheet.create({})