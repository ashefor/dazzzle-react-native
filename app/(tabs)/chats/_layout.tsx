import { TouchableOpacity } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
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
                back && <TouchableOpacity onPress={navigation.goBack} className='flex justify-center w-7 h-7' style={{ zIndex: 99 }}>
                  <ArrowBackIcon />
                </TouchableOpacity>
              } />
          )
        }
      }}>
        <Stack.Screen
          name='index'
          options={{
            title: 'Chats',
            // headerShown: false
          }} />
        <Stack.Screen
          name="[userId]"
          options={{
            title: 'User Id',
            headerShown: false,
          }} />
      </Stack>
      <StatusBar backgroundColor='#161622' style='light' />
    </>
  )
}

export default ProfileLayout