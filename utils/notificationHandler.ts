import { upsertChat, incrementUnread } from '@/redux/slices/chatsSlice';
import { startUpdateLoading, refreshMessages, stopUpdateLoading } from '@/redux/slices/messagesSlice';
import { AppDispatch } from '@/redux/store';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Alert, Platform } from 'react-native';
import axiosRequest from './axios'; // Import the API handler

type IncomingPayload = {
  messageId: number | string;
  user_id: number;
  user_full_name?: string;
  profile_picture?: string;
  is_online?: number;
  last_seen_at?: string;
  last_seen_at_time_ago_format?: string;
};

// Configure how notifications appear when the app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (!Device.isDevice) {
    Alert.alert('Physical Device Required', 'Must use physical device for Push Notifications');
    console.log('Must use physical device for Push Notifications');
    return;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Failed to get push token for push notification!');
    return;
  }

  try {
    const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
    if (!projectId) {
        throw new Error('Project ID not found in app config');
    }

    const token = (await Notifications.getExpoPushTokenAsync({
      projectId,
    })).data;

    console.log('Expo Push Token:', token);

    // Send token to backend
    await axiosRequest.notifications.registerToken(token);
    
  } catch (error) {
    console.error('Error fetching push token:', error);
  }
}

export function registerNotificationListeners(
  dispatch: AppDispatch,
  getState: () => any,
  navigateToChat: (user_id: number) => void
) {
  const onReceive = async (notification: Notifications.Notification) => {
    const data = notification.request.content.data as Partial<IncomingPayload> | undefined;
    if (!data?.messageId || typeof data.user_id !== 'number') return;

    const { user_id } = data;
    const state = getState();
    const isOnChatsScreen = state.navigation?.currentRouteName === 'Chats';
    const activeUserId = state.messages?.activeUserId;

    if (isOnChatsScreen) {
      dispatch(upsertChat({
        about_me: null,
        cover_photo: '',
        fake_user_id: 0,
        is_online: data.is_online ?? 0,
        last_seen_at: data.last_seen_at ?? '',
        last_seen_at_time_ago_format: data.last_seen_at_time_ago_format ?? '',
        profile_picture: data.profile_picture ?? '',
        user_full_name: data.user_full_name ?? `User ${user_id}`,
        user_id,
        user_uid: '',
        username: data.user_full_name ?? `user_${user_id}`,
        unreadCount: 0,
      }));
      dispatch(incrementUnread({ user_id }));
    }

    if (activeUserId === user_id) {
      dispatch(startUpdateLoading({ user_id }));
      await dispatch(refreshMessages({ user_id }));
      dispatch(stopUpdateLoading({ user_id }));
    }
  };

  const onClick = async (response: Notifications.NotificationResponse) => {
    const data = response.notification.request.content.data as Partial<IncomingPayload> | undefined;
    if (!data?.messageId || typeof data.user_id !== 'number') return;
    
    navigateToChat(data.user_id);
  };

  const responseListener = Notifications.addNotificationResponseReceivedListener(onClick);
  const receivedListener = Notifications.addNotificationReceivedListener(onReceive);

  return () => {
    Notifications.removeNotificationSubscription(responseListener);
    Notifications.removeNotificationSubscription(receivedListener);
  };
}