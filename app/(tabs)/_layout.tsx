import { Tabs } from 'expo-router';
import React from 'react';
import { HapticTab } from '@/components/HapticTab';
import LikeTabIcon from '@/components/LikeTabIcon';
import HomeTabIcon from '@/components/HomeTabIcon';
import ProfileTabIcon from '@/components/ProfileTabIcon';
import MessagesTabIcon from '@/components/MessagesTabIcon';
import SearchTabIcon from '@/components/SearchTabIcon';

export default function TabLayout() {

  return (
    <Tabs
    initialRouteName='discover'
      screenOptions={{
        tabBarActiveTintColor: '#DD3FE5',
        tabBarStyle: {
          backgroundColor: '#1A1A1A',
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
          title: 'Discover',
          tabBarIcon: ({ color, focused }) => <HomeTabIcon focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Discover',
          href: null,
          // headerShown: true,
          // headerShadowVisible: false,
          // headerStyle: {
          //   backgroundColor: '#1A1A1A'
          // },
          // headerRight: () => <XStack paddingRight={'$4'}>
          //   <TouchableOpacity onPress={() => Alert.alert('Coming Soon')} className='flex items-center justify-center rounded-full'>
          //     <Ionicons name="notifications-sharp" size={24} color="#ffffff" />
          //   </TouchableOpacity>
          // </XStack>,
          tabBarIcon: ({ color, focused }) => <HomeTabIcon focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, focused }) => <SearchTabIcon focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="likes"
        options={{
          title: 'Likes',
          tabBarIcon: ({ color, focused }) => <LikeTabIcon focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="chats"
        options={{
          title: 'Chats',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => <MessagesTabIcon focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerShown: false,
          // // headerTitleAlign: 'left',
          // headerStyle: {
          //   backgroundColor: 'none'
          // },
          // headerTitleStyle: {
          //   fontWeight: 700,
          //   fontSize: 24,
          //   fontFamily: "FiraSans_700Bold"
          // },
          tabBarIcon: ({ focused }) => <ProfileTabIcon focused={focused} />
        }}
      />
    </Tabs>
  );
}
