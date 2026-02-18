import { Tabs, useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { HapticTab } from '@/components/HapticTab';
import LikeTabIcon from '@/components/icons/LikeTabIcon';
import HomeTabIcon from '@/components/icons/HomeTabIcon';
import ProfileTabIcon from '@/components/ProfileTabIcon';
import MessagesTabIcon from '@/components/icons/MessagesTabIcon';
import SearchTabIcon from '@/components/SearchTabIcon';
import { Text } from 'react-native';
// import { registerNotificationListeners } from '@/utils/notificationHandler';
import { useAppDispatch } from '@/hooks/reduxHooks';
import { DeviceEventEmitter } from 'react-native';
import * as Notifications from 'expo-notifications';

export default function TabLayout() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const notificationListener = useRef<Notifications.EventSubscription | null>(null);
const responseListener = useRef<Notifications.EventSubscription | null>(null);
// const navigation = useNavigation();

const registerNotificationListeners = () => {
    // 1. Listener for when a notification arrives while app is in FOREGROUND
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
    const data = notification.request.content.data;

    if (data && (data.type === "1" || data.type == "2")) {
        DeviceEventEmitter.emit('onNewMessage', data);
    }
});
    

    // 2. Listener for when user TAPS the notification (Background or Killed state)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        const data = response.notification.request.content.data;
        
        console.log("Notification Interaction Payload:", data);

        // Handle Chat Message Notification (Type "1")
        if (data && (data.type === "1" || data.type == "2")) {
            const { userId } = data;

            // OPTION A: If using Expo Router
            router.push({
                pathname: "/single-chat/[userId]",
                params: { 
                    userId: userId as string,
                }
            });
        }
    });
};

useEffect(() => {
    registerNotificationListeners();
    return () => {
        if (notificationListener.current) {
            notificationListener.current.remove();
        }
        if (responseListener.current) {
            responseListener.current.remove();
        }
    };
}, []);

  return (
    <Tabs
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
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => <HomeTabIcon focused={focused} />,
          tabBarLabel: ({ focused }) => <Text className='text-xs' style={{ color: focused ? '#DD3FE5' : '#333' }}>Home</Text>
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, focused }) => <SearchTabIcon focused={focused} />,
          tabBarLabel: ({ focused }) => <Text className='text-xs' style={{ color: focused ? '#DD3FE5' : '#333' }}>Search</Text>
        }}
      />
      <Tabs.Screen
        name="likes"
        options={{
          title: 'Likes',
          tabBarIcon: ({ color, focused }) => <LikeTabIcon focused={focused} />,
          tabBarLabel: ({ focused }) => <Text className='text-xs' style={{ color: focused ? '#DD3FE5' : '#333' }}>Likes</Text>
        }}
      />
      <Tabs.Screen
        name="chats"
        options={{
          title: 'Chats',
          tabBarIcon: ({ color, focused }) => <MessagesTabIcon focused={focused} />,
          tabBarLabel: ({ focused }) => <Text className='text-xs' style={{ color: focused ? '#DD3FE5' : '#333' }}>Chats</Text>
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => <ProfileTabIcon focused={focused} />,
          tabBarLabel: ({ focused }) => <Text className='text-xs' style={{ color: focused ? '#DD3FE5' : '#333' }}>Profile</Text>
        }}
      />
    </Tabs>
  );
}
