import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View, Text, Button, TouchableHighlight, TouchableOpacity, Image } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { XStack } from 'tamagui';
import icons from '@/constants/icons';
import LikeTabIcon from '@/components/LikeTabIcon';
import HomeTabIcon from '@/components/HomeTabIcon';
import ProfileTabIcon from '@/components/ProfileTabIcon';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarStyle: {
          backgroundColor: 'none'
        },
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}
      >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerStyle: {
            backgroundColor: 'none'
          },
          headerRight: () => <XStack gap={'$4'} className='px-4'>
            <TouchableOpacity className=' flex items-center justify-center rounded-full'>
              <Ionicons name="notifications-sharp" size={24} color="#ffffff" />
            </TouchableOpacity>
            <TouchableOpacity className=' flex items-center justify-center rounded-full'>
              <Image source={icons.filter} className='w-6 h-6' resizeMode='contain' />
            </TouchableOpacity>
          </XStack>,
          // header: () => (<View>
          //   <SafeAreaView/>
          //   <Text className='text-white'>Header</Text>
          // </View>),
          tabBarIcon: ({ color, focused }) => <HomeTabIcon focused={focused}/>,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, focused }) => <LikeTabIcon focused={focused}/>,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          // headerTitleAlign: 'left',
          headerStyle: {
            backgroundColor: 'none'
          },
          headerTitleStyle: {
            fontWeight: 700,
            fontSize: 24,
            fontFamily: "FiraSans_700Bold"
          },
          tabBarIcon: ({focused}) => <ProfileTabIcon focused={focused}/>
        }}
      />
    </Tabs>
  );
}
