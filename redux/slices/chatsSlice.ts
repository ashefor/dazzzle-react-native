import { fetchChatsApi } from '@/utils/chatsApi';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ChatItem {
  about_me: any;
  cover_photo: string;
  fake_user_id: number;
  is_online: number;
  last_seen_at: string;
  last_seen_at_time_ago_format: string;
  profile_picture: string;
  user_full_name: string;
  user_id: number;
  user_uid: string;
  username: string;
}

interface ChatsState {
  items: (ChatItem & { unreadCount?: number })[];
  loading: boolean;
  error?: string;
}

const initialState: ChatsState = {
  items: [],
  loading: false,
};

export const fetchChats = createAsyncThunk<ChatItem[]>(
  'chats/fetchAll',
  async () => {
    const res = await fetchChatsApi();
    return res;
  }
);

const chatsSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    upsertChat(state, action: PayloadAction<ChatItem & { unreadCount?: number }>) {
      const incoming = action.payload;
      const idx = state.items.findIndex(c => c.user_id === incoming.user_id);
      if (idx >= 0) {
        state.items[idx] = { ...state.items[idx], ...incoming };
      } else {
        state.items.unshift(incoming);
      }
    },
    incrementUnread(state, action: PayloadAction<{ user_id: number }>) {
      const chat = state.items.find(c => c.user_id === action.payload.user_id);
      if (chat) {
        chat.unreadCount = (chat.unreadCount ?? 0) + 1;
      }
    },
    markChatAsRead(state, action: PayloadAction<{ user_id: number }>) {
      const chat = state.items.find(c => c.user_id === action.payload.user_id);
      if (chat) chat.unreadCount = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChats.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.loading = false;
        // Preserve unreadCount if present locally
        const prevMap = new Map(state.items.map(i => [i.user_id, i.unreadCount ?? 0]));
        state.items = action.payload.map(i => ({
          ...i,
          unreadCount: prevMap.get(i.user_id) ?? 0,
        }));
      })
      .addCase(fetchChats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { upsertChat, incrementUnread, markChatAsRead } = chatsSlice.actions;
export default chatsSlice.reducer;