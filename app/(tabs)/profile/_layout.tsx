import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { router, Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import ArrowBackIcon from '@/components/icons/ArrowBackIcon'
import Header from '@/components/Header'
import { getHeaderTitle } from '@react-navigation/elements'

const ProfileLayout = () => {
  return (
    <>
      <Stack screenOptions={{
        header: ({ navigation, route, options, back }) => {
          const title = getHeaderTitle(options, route.name);
          return (
            <Header.Default
              title={title}
              leftButton={
                back && <TouchableOpacity onPress={navigation.goBack} className='flex items-center justify-center' style={{zIndex: 99}}>
                  <ArrowBackIcon />
                </TouchableOpacity>
              } />
          )
        }
      }}>
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
      <StatusBar backgroundColor='#161622' style='light' />
    </>
  )
}

export default ProfileLayout

const styles = StyleSheet.create({})