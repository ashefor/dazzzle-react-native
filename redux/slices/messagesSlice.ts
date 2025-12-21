import { fetchSingleChatApi, sendMessageApi } from '@/utils/chatsApi';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserConversation {
  chat_id: number;
  created_on: string;
  is_message_received: boolean;
  message: string;
  message_from: string;
  message_from_username: string;
  message_to: string;
  optionalLoggedInUserId: number;
  type: number;
}

export interface SingleChatResponse {
  incident: any;
  loggedInUserProfilePicture: string;
  mobileAppData: any;
  userConversations: UserConversation[];
  userData: any;
  userLikeData: any;
}

interface MessagesState {
  byUserId: Record<string, {
    items: UserConversation[];
    loadingInitial: boolean;
    loadingUpdate: boolean;
    error?: string;
  }>;
  userMeta: Record<number, {
    userData: any | null;
    userLikeData: any | null;
    loggedInUserProfilePicture?: string | null;
  }>;
  activeUserId?: number;
}

const initialState: MessagesState = {
  byUserId: {},
  userMeta: {},
};

export const fetchMessages = createAsyncThunk<{ user_id: number; data: SingleChatResponse }, { user_id: number }>(
  'messages/fetch',
  async ({ user_id }) => {
    const data = await fetchSingleChatApi(user_id);
    return { user_id, data };
  }
);

// Refresh all messages for an active chat without showing the skeleton loader.
// Shows only the inline loader via startUpdateLoading/stopUpdateLoading.
export const refreshMessages = createAsyncThunk<{ user_id: number; data: SingleChatResponse }, { user_id: number }>(
  'messages/refresh',
  async ({ user_id }) => {
    const data = await fetchSingleChatApi(user_id);
    return { user_id, data };
  }
);

// Send message with optimistic update if desired
export const sendMessage = createAsyncThunk<UserConversation, { user_id: number; params: any }>(
  'messages/sendMessage',
  async ({ user_id, params }) => {
    const conv = await sendMessageApi(user_id, params);
    return conv;
  }
);

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setActiveUserId(state, action: PayloadAction<number | undefined>) {
      state.activeUserId = action.payload;
    },
    startUpdateLoading(state, action: PayloadAction<{ user_id: number }>) {
      const bucket = state.byUserId[action.payload.user_id] ?? {
        items: [],
        loadingInitial: false,
        loadingUpdate: false,
      };
      bucket.loadingUpdate = true;
      state.byUserId[action.payload.user_id] = bucket;
    },
    stopUpdateLoading(state, action: PayloadAction<{ user_id: number }>) {
      const bucket = state.byUserId[action.payload.user_id];
      if (bucket) bucket.loadingUpdate = false;
    },
    deleteMessage: (state, action: PayloadAction<{ chatId: string; user_id: string }>) => {
      const { chatId, user_id } = action.payload;
      const bucket = state.byUserId[user_id];

      if (bucket) {
        // Filter out the message that matches the messageId
        bucket.items = bucket.items.filter(message => message.chat_id.toString() !== chatId);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Initial load with skeleton
      .addCase(fetchMessages.pending, (state, action) => {
        const user_id = action.meta.arg.user_id;
        const bucket = state.byUserId[user_id] ?? {
          items: [],
          loadingInitial: false,
          loadingUpdate: false,
        };
        bucket.loadingInitial = true;
        bucket.error = undefined;
        state.byUserId[user_id] = bucket;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        const { user_id, data } = action.payload;
        const bucket = state.byUserId[user_id] ?? {
          items: [],
          loadingInitial: false,
          loadingUpdate: false,
        };
        bucket.items = (data.userConversations ?? []).sort((a, b) =>
          new Date(a.created_on).getTime() - new Date(b.created_on).getTime()
        );
        bucket.loadingInitial = false;
        state.byUserId[user_id] = bucket;

        // Store user details/meta
        state.userMeta[user_id] = {
          userData: data.userData ?? null,
          userLikeData: data.userLikeData ?? null,
          loggedInUserProfilePicture: data.loggedInUserProfilePicture ?? null,
        };
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        const user_id = action.meta.arg.user_id;
        const bucket = state.byUserId[user_id] ?? {
          items: [],
          loadingInitial: false,
          loadingUpdate: false,
        };
        bucket.loadingInitial = false;
        bucket.error = action.error.message;
        state.byUserId[user_id] = bucket;
      })

      // Lightweight refresh: merge messages and update meta
      .addCase(refreshMessages.fulfilled, (state, action) => {
        const { user_id, data } = action.payload;
        const incoming = (data.userConversations ?? []).sort((a, b) =>
          new Date(a.created_on).getTime() - new Date(b.created_on).getTime()
        );
        const bucket = state.byUserId[user_id] ?? {
          items: [],
          loadingInitial: false,
          loadingUpdate: false,
        };

        const existingById = new Map(bucket.items.map(m => [m.chat_id, m]));
        for (const conv of incoming) {
          existingById.set(conv.chat_id, conv); // replace or add
        }
        bucket.items = Array.from(existingById.values()).sort((a, b) =>
          new Date(a.created_on).getTime() - new Date(b.created_on).getTime()
        );
        state.byUserId[user_id] = bucket;

        state.userMeta[user_id] = {
          userData: data.userData ?? null,
          userLikeData: data.userLikeData ?? null,
          loggedInUserProfilePicture: data.loggedInUserProfilePicture ?? null,
        };
      })
      .addCase(refreshMessages.rejected, (state, action) => {
        const user_id = action.meta.arg.user_id;
        const bucket = state.byUserId[user_id] ?? {
          items: [],
          loadingInitial: false,
          loadingUpdate: false,
        };
        bucket.error = action.error.message;
        state.byUserId[user_id] = bucket;
      })

      // Send message success: append and sort
      .addCase(sendMessage.fulfilled, (state, action) => {
        const conv = action.payload;
        const uid = action.meta.arg.user_id;
        const bucket = state.byUserId[uid] ?? {
          items: [],
          loadingInitial: false,
          loadingUpdate: false,
        };
        bucket.items = [...bucket.items, conv].sort((a, b) =>
          new Date(a.created_on).getTime() - new Date(b.created_on).getTime()
        );
        state.byUserId[uid] = bucket;
      });
  },
});

export const {
  setActiveUserId,
  startUpdateLoading,
  stopUpdateLoading,
  deleteMessage
} = messagesSlice.actions;

export default messagesSlice.reducer;

// Selectors (optional)
export const selectChatConversations = (state: any, user_id: number) =>
  state.messages.byUserId[user_id]?.items ?? [];

export const selectChatUserMeta = (state: any, user_id: number) =>
  state.messages.userMeta[user_id] ?? { userData: null, userLikeData: null, loggedInUserProfilePicture: null };
