import { Tabs } from 'expo-router';
import React, { useEffect } from 'react';
import { HapticTab } from '@/components/HapticTab';
import LikeTabIcon from '@/components/icons/LikeTabIcon';
import HomeTabIcon from '@/components/icons/HomeTabIcon';
import ProfileTabIcon from '@/components/ProfileTabIcon';
import MessagesTabIcon from '@/components/icons/MessagesTabIcon';
import SearchTabIcon from '@/components/SearchTabIcon';
import { AppState, Text } from 'react-native';
import {
  registerForPushNotificationsAsync,
  registerNotificationListeners,
  registerPushTokenRotationListener,
  setAppBadgeCount,
} from '@/utils/notificationHandler';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { fetchAuthenticatedUser } from '@/redux/thunks/authActions';
import { fetchUnreadNotificationCount } from '@/redux/slices/notificationsSlice';

export default function TabLayout() {
  const dispatch = useAppDispatch();
  const unreadNotificationCount = useAppSelector((state) => state.notifications.unreadCount);

  // Keep the springboard badge on the real number rather than clearing it to 0.
  useEffect(() => {
    setAppBadgeCount(unreadNotificationCount);
  }, [unreadNotificationCount]);

  // Pushes that land while the app is backgrounded never reach the foreground
  // listener, so the count is re-read on every return to active.
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        dispatch(fetchUnreadNotificationCount());
      }
    });

    return () => subscription.remove();
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchAuthenticatedUser());
    dispatch(fetchUnreadNotificationCount());

    // Shared handler — it knows the API's payload contract and routes every
    // notification type, not just chat.
    const unsubscribeListeners = registerNotificationListeners(dispatch);
    const unsubscribeRotation = registerPushTokenRotationListener();

    // Re-register on every entry into the authenticated app. Registering only
    // on the permissions screen meant a token that rotated after that one
    // visit was never sent to the API again. Safe here: the tabs are behind
    // auth, so the request always carries a session.
    registerForPushNotificationsAsync();

    return () => {
      unsubscribeListeners();
      unsubscribeRotation();
    };
  }, [dispatch]);

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
