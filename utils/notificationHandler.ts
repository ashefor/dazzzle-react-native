import { upsertChat, incrementUnread } from '@/redux/slices/chatsSlice';
import { AppDispatch } from '@/redux/store';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { DeviceEventEmitter, Platform } from 'react-native';
import axiosRequest from './axios'; // Import the API handler
import { Href, router } from 'expo-router';

/**
 * Payload contract with the API (see pushNotify() in app-helpers.php).
 *
 * `type` is the semantic notification type and drives routing; `user_id` is
 * always the *acting* user (whoever liked / messaged / called), so it is what
 * we navigate to.
 */
export type PushNotificationType =
  | 'chat_message'
  | 'message_request'
  | 'message_request_accepted'
  | 'group_message'
  | 'profile_like'
  | 'profile_visit'
  | 'gift'
  | 'incoming_call';

export type PushPayload = {
  type?: PushNotificationType;
  user_id?: number | string;
  user_uid?: string;
  user_full_name?: string;
  username?: string;
  profile_picture?: string;
  messageId?: string;
  message?: string;
  /** 1 = text, 2 = file upload */
  message_type?: number | string;
  created_on?: string;
  group_id?: number | string;
  group_name?: string;
  is_online?: number;
  last_seen_at?: string;
  last_seen_at_time_ago_format?: string;
};

const CHAT_TYPES: PushNotificationType[] = ['chat_message', 'message_request'];

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

/** Send the current Expo token to the API. */
async function syncTokenWithBackend(token: string) {
  await axiosRequest.notifications.registerToken(token, Platform.OS);
}

export async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    // The API sends every message with channelId 'default', so this channel
    // must exist or Android silently drops the notification.
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  // Simulators cannot hold a push token. Not an error worth alerting on.
  if (!Device.isDevice) {
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.warn('Push permission not granted; no token registered.');
    return null;
  }

  try {
    const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
    if (!projectId) {
      throw new Error('Project ID not found in app config');
    }

    const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;

    await syncTokenWithBackend(token);

    return token;
  } catch (error) {
    console.error('Error fetching push token:', error);
    return null;
  }
}

/**
 * Expo rotates push tokens (reinstall, restore, FCM/APNs refresh). Without
 * this the API keeps a token that has silently stopped resolving to this
 * device, and the user just stops receiving notifications.
 */
export function registerPushTokenRotationListener() {
  const subscription = Notifications.addPushTokenListener(async (token) => {
    if (typeof token?.data !== 'string') return;

    try {
      await syncTokenWithBackend(token.data);
    } catch (error) {
      console.error('Failed to sync rotated push token:', error);
    }
  });

  return () => subscription.remove();
}

/** Where tapping a notification of each type should land. */
function routeForPayload(data: PushPayload): Href | null {
  const userId = Number(data.user_id);
  const hasUser = Number.isFinite(userId) && userId > 0;

  switch (data.type) {
    case 'chat_message':
    case 'message_request':
    case 'message_request_accepted':
      return hasUser ? { pathname: '/single-chat/[userId]', params: { userId: String(userId) } } : '/(tabs)/chats';
    case 'profile_like':
      return '/(tabs)/likes';
    case 'profile_visit':
      return '/(tabs)/profile/visitors';
    case 'gift':
      return '/notifications';
    // The app has no group-chat or in-call screen yet, so these land on the
    // closest thing rather than nowhere.
    case 'group_message':
    case 'incoming_call':
      return '/(tabs)/chats';
    default:
      return null;
  }
}

/**
 * Wire up foreground delivery and notification taps.
 *
 * Returns a cleanup function.
 */
export function registerNotificationListeners(dispatch: AppDispatch) {
  const onReceive = (notification: Notifications.Notification) => {
    const data = (notification.request.content.data ?? {}) as PushPayload;

    if (!data.type || !CHAT_TYPES.includes(data.type)) return;

    const userId = Number(data.user_id);
    if (!Number.isFinite(userId) || userId <= 0) return;

    // Let an already-open conversation append the message itself. Shape this
    // the way single-chat/[userId] expects: `type` there is the message type.
    if (data.message) {
      DeviceEventEmitter.emit('onNewMessage', {
        user_id: userId,
        message: data.message,
        type: Number(data.message_type ?? 1),
        created_on: data.created_on,
        message_from_username: data.username,
      });
    }

    dispatch(
      upsertChat({
        about_me: null,
        cover_photo: '',
        fake_user_id: 0,
        is_online: data.is_online ?? 0,
        last_seen_at: data.last_seen_at ?? '',
        last_seen_at_time_ago_format: data.last_seen_at_time_ago_format ?? '',
        profile_picture: data.profile_picture ?? '',
        user_full_name: data.user_full_name ?? `User ${userId}`,
        user_id: userId,
        user_uid: data.user_uid ?? '',
        username: data.username ?? `user_${userId}`,
        unreadCount: 0,
      })
    );
    dispatch(incrementUnread({ user_id: userId }));
  };

  const onClick = (response: Notifications.NotificationResponse) => {
    const data = (response.notification.request.content.data ?? {}) as PushPayload;
    const destination = routeForPayload(data);

    if (destination) {
      router.push(destination);
    }
  };

  const responseSubscription = Notifications.addNotificationResponseReceivedListener(onClick);
  const receivedSubscription = Notifications.addNotificationReceivedListener(onReceive);

  return () => {
    responseSubscription.remove();
    receivedSubscription.remove();
  };
}

/**
 * Checks for notification permissions.
 * - If granted: Registers the token and navigates to the success destination.
 * - If denied: Navigates to the permissions page.
 * * @param successDestination Where to go if permission is granted (default: '/(tabs)')
 * @param failureDestination Where to go if permission is denied (default: '/app-permissions')
 */
export const handlePermissionNavigation = async (
  successDestination: Href = '/(tabs)',
  failureDestination: Href = '/app-permissions'
) => {
  const { status: notifStatus } = await Notifications.getPermissionsAsync();
  const isGranted = notifStatus === Notifications.PermissionStatus.GRANTED;

  if (isGranted) {
    await registerForPushNotificationsAsync();
    router.replace(successDestination);
  } else {
    router.replace(failureDestination);
  }
};

export const clearAppBadge = async () => {
  try {
    await Notifications.setBadgeCountAsync(0);
  } catch (error) {
    console.error("Failed to clear app badge:", error);
  }
};
