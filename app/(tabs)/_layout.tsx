import { router, Tabs } from 'expo-router';
import React from 'react';
import { Platform, View, Text, Button, TouchableHighlight, TouchableOpacity, Image, Alert } from 'react-native';

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
import MessagesTabIcon from '@/components/MessagesTabIcon';
import SearchTabIcon from '@/components/SearchTabIcon';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        // tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarActiveTintColor: '#DD3FE5',
        tabBarStyle: {
          backgroundColor: '#1A1A1A'
        },
        headerShown: false,
        tabBarButton: HapticTab,
        // tabBarBackground: TabBarBackground,
        // tabBarStyle: Platform.select({
        //   ios: {
        //     // Use a transparent background on iOS to show the blur effect
        //     position: 'absolute',
        //   },
        //   default: {},
        // }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerShown: true,
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: '#1A1A1A'
          },
          headerRight: () => <XStack gap={'$4'} padding={'$4'}>
            <TouchableOpacity onPress={() => Alert.alert('Coming Soon')} className='flex items-center justify-center rounded-full'>
              <Ionicons name="notifications-sharp" size={24} color="#ffffff" />
            </TouchableOpacity>
          </XStack>,
          tabBarIcon: ({ color, focused }) => <HomeTabIcon focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          headerShown: true,
          headerStyle: {
            backgroundColor: '#1A1A1A'
          },
          tabBarIcon: ({ color, focused }) => <SearchTabIcon focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="likes"
        options={{
          title: 'Likes',
          headerShown: true,
          headerStyle: {
            backgroundColor: 'none'
          },
          tabBarIcon: ({ color, focused }) => <LikeTabIcon focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="message"
        options={{
          title: 'Message',
          href: null,
          tabBarIcon: ({ color, focused }) => <MessagesTabIcon focused={focused} />,
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
          tabBarIcon: ({ focused }) => <ProfileTabIcon focused={focused} />
        }}
      />
    </Tabs>
  );
}
