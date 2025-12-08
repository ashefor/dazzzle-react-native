import { Tabs } from 'expo-router';
import React from 'react';
import { HapticTab } from '@/components/HapticTab';
import LikeTabIcon from '@/components/LikeTabIcon';
import HomeTabIcon from '@/components/HomeTabIcon';
import ProfileTabIcon from '@/components/ProfileTabIcon';
import MessagesTabIcon from '@/components/MessagesTabIcon';
import SearchTabIcon from '@/components/SearchTabIcon';
import { Text } from 'react-native';

export default function TabLayout() {

  return (
    <Tabs
    initialRouteName='discover'
      screenOptions={{
        // tabBarActiveTintColor: '#DD3FE5',
         headerShown: false,
        tabBarStyle: {
          // backgroundColor: '#1A1A1A',
        },
        // headerShown: false,
        tabBarButton: HapticTab,
        // header: ({ navigation, route, options }) => {
        //   const title = getHeaderTitle(options, route.name);
        //   return (
        //     <Header.Default
        //       title={title} 
        //       />
        //   )
        // }
      }}
    >
      <Tabs.Screen
        name="discover"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="encounter"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => <HomeTabIcon focused={focused} />,
          tabBarLabel: ({focused}) => <Text className='text-xs' style={{color: focused ? '#DD3FE5' : '#333'}}>Discover</Text>
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, focused }) => <SearchTabIcon focused={focused} />,
          tabBarLabel: ({focused}) => <Text className='text-xs' style={{color: focused ? '#DD3FE5' : '#333'}}>Search</Text>
        }}
      />
      <Tabs.Screen
        name="likes"
        options={{
          title: 'Likes',
          tabBarIcon: ({ color, focused }) => <LikeTabIcon focused={focused} />,
          tabBarLabel: ({focused}) => <Text className='text-xs' style={{color: focused ? '#DD3FE5' : '#333'}}>Likes</Text>
        }}
      />
      <Tabs.Screen
        name="chats"
        options={{
          title: 'Chats',
          tabBarIcon: ({ color, focused }) => <MessagesTabIcon focused={focused} />,
          tabBarLabel: ({focused}) => <Text className='text-xs' style={{color: focused ? '#DD3FE5' : '#333'}}>Chats</Text>
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => <ProfileTabIcon focused={focused} />,
          tabBarLabel: ({focused}) => <Text className='text-xs' style={{color: focused ? '#DD3FE5' : '#333'}}>Profile</Text>
        }}
      />
    </Tabs>
  );
}
