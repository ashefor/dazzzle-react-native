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
          fontFamily: "FiraSans_500Medium",
        },
        headerBackButtonDisplayMode: 'minimal',
      }}>
        <Stack.Screen name='index' options={{
          title: 'Profile',
          headerShadowVisible: false,
          headerTitleStyle: {
            fontWeight: 700,
            fontSize: 20,
            fontFamily: "FiraSans_700Bold",
          },
        }} />
        <Stack.Screen name='visitors' options={{
          title: 'Visitors',
          headerLeft: () => <TouchableOpacity onPress={() => router.back()} className='flex items-center justify-center pr-4 w-9 h-8'>
            <ArrowBackIcon />
          </TouchableOpacity>
        }} />
        <Stack.Screen name='blocked-users' options={{
          title: 'Blocked Users',
          headerLeft: () => <TouchableOpacity onPress={() => router.back()} className='flex items-center justify-center pr-4 w-9 h-8'>
            <ArrowBackIcon />
          </TouchableOpacity>
        }} />
        <Stack.Screen name='change-password' options={{
          title: 'Change Password',
          headerLeft: () => <TouchableOpacity onPress={() => router.back()} className='flex items-center justify-center pr-4 w-9 h-8'>
            <ArrowBackIcon />
          </TouchableOpacity>
        }} />
        <Stack.Screen name='change-email'  options={{
          title: 'Change Email',
          headerLeft: () => <TouchableOpacity onPress={() => router.back()} className='flex items-center justify-center pr-4 w-9 h-8'>
            <ArrowBackIcon />
          </TouchableOpacity>
        
        }} />
        <Stack.Screen name='settings' options={{
          title: 'Settings',
          presentation:'modal',
          headerLeft: () => <TouchableOpacity onPress={() => router.back()} className='flex items-center justify-center pr-4 w-9 h-8'>
            <ArrowBackIcon />
          </TouchableOpacity>
        }} />
      </Stack>
      <StatusBar backgroundColor='#161622' style='light' />
    </>
  )
}

export default ProfileLayout

const styles = StyleSheet.create({})