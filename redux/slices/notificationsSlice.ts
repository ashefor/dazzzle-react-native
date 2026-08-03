import { ReactionCodes } from '@/models/general';
import axiosRequest from '@/utils/axios';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

type NotificationsState = {
  unreadCount: number;
};

const initialState: NotificationsState = {
  unreadCount: 0,
};

/** Pull the authoritative unread count from the API. */
export const fetchUnreadNotificationCount = createAsyncThunk<number>(
  'notifications/fetchUnreadCount',
  async () => {
    const response: any = await axiosRequest.notifications.unreadCount();
    if (response?.reaction !== ReactionCodes.SUCCESS) {
      throw new Error('Unable to load unread notification count');
    }
    return Number(response.data?.unreadCount ?? 0);
  }
);

/**
 * Mark every notification read. This is what clears the bell badge when the
 * notifications screen opens, and what the "Mark all read" action calls.
 */
export const markAllNotificationsRead = createAsyncThunk<number>(
  'notifications/markAllRead',
  async () => {
    const response: any = await axiosRequest.notifications.markAllRead();
    if (response?.reaction !== ReactionCodes.SUCCESS) {
      throw new Error('Unable to mark notifications as read');
    }
    return Number(response.data?.unreadCount ?? 0);
  }
);

/**
 * Mark specific notifications read — used when a single row is tapped, which
 * is the only path a push deep-link takes into a notification.
 */
export const markNotificationsRead = createAsyncThunk<number, string[]>(
  'notifications/markRead',
  async (notificationUids) => {
    const response: any = await axiosRequest.notifications.markRead(notificationUids);
    if (response?.reaction !== ReactionCodes.SUCCESS) {
      throw new Error('Unable to mark notifications as read');
    }
    return Number(response.data?.unreadCount ?? 0);
  }
);

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setUnreadNotificationCount(state, action: PayloadAction<number>) {
      state.unreadCount = Math.max(0, action.payload);
    },
    /** A push landing while the app is foregrounded, so no refetch is needed. */
    incrementUnreadNotificationCount(state) {
      state.unreadCount += 1;
    },
    clearUnreadNotificationCount(state) {
      state.unreadCount = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUnreadNotificationCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload;
      })
      // Both write paths return the server's post-write count, so the badge
      // stays correct even when a notification arrived mid-request.
      .addCase(markAllNotificationsRead.fulfilled, (state, action) => {
        state.unreadCount = action.payload;
      })
      .addCase(markNotificationsRead.fulfilled, (state, action) => {
        state.unreadCount = action.payload;
      });
    // Rejections are deliberately not handled: a failed count refresh should
    // leave the last known badge alone rather than blank it out.
  },
});

export const {
  setUnreadNotificationCount,
  incrementUnreadNotificationCount,
  clearUnreadNotificationCount,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;
