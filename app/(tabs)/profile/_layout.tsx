import { TouchableOpacity } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import ArrowBackIcon from '@/components/icons/ArrowBackIcon'
import Header from '@/components/Header'
import { getHeaderTitle } from '@react-navigation/elements'

const ProfileLayout = () => {
  return (
    <>
      <Stack
        screenOptions={{
          header: ({ navigation, route, options, back }) => {
            const title = getHeaderTitle(options, route.name);
            const HeaderRight = options.headerRight;
            const HeaderLeft = options.headerLeft;
            return (
              <Header.Default
                title={title}
                // leftContent={
                //   back && <TouchableOpacity onPress={navigation.goBack} className='flex justify-center w-7 h-7' style={{zIndex: 99}}>
                //     <ArrowBackIcon />
                //   </TouchableOpacity>
                // } 
                leftContent={
                  HeaderLeft
                    ? HeaderLeft({}) : back && <TouchableOpacity onPress={navigation.goBack} className='flex justify-center w-7 h-7' style={{zIndex: 99}}>
                  <ArrowBackIcon />
                </TouchableOpacity>
                }
                rightContent={HeaderRight ? HeaderRight({}) : null}

              />
            )
          }
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