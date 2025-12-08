import { upsertChat, incrementUnread } from '@/redux/slices/chatsSlice';
import { startUpdateLoading, refreshMessages, stopUpdateLoading } from '@/redux/slices/messagesSlice';
import { AppDispatch } from '@/redux/store';
import * as Notifications from 'expo-notifications';

type IncomingPayload = {
  messageId: number | string;
  user_id: number; // target user id for the chat
  user_full_name?: string;
  profile_picture?: string;
  is_online?: number;
  last_seen_at?: string;
  last_seen_at_time_ago_format?: string;
};

export function registerNotificationHandlers(
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

    // If on chats screen, upsert minimal chat item locally and bump unread
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

    // If on active chat screen for this user, refresh messages with inline loader
    if (activeUserId === user_id) {
      dispatch(startUpdateLoading({ user_id }));
      await dispatch(refreshMessages({ user_id }));
      dispatch(stopUpdateLoading({ user_id }));
    }
  };

  const onClick = async (response: Notifications.NotificationResponse) => {
    const data = response.notification.request.content.data as Partial<IncomingPayload> | undefined;
    if (!data?.messageId || typeof data.user_id !== 'number') return;
    const { user_id } = data;

    await onReceive(response.notification);

    navigateToChat(user_id);

    dispatch(startUpdateLoading({ user_id }));
    await dispatch(refreshMessages({ user_id }));
    dispatch(stopUpdateLoading({ user_id }));
  };

  Notifications.addNotificationReceivedListener(onReceive);
  Notifications.addNotificationResponseReceivedListener(onClick);
}