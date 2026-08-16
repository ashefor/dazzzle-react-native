import { RandomUser } from '@/models/user';
import axiosRequest from '@/utils/axios';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface EncounterState {
  users: RandomUser[];
  status: 'idle' | 'loading' | 'failed';
  topCardIndex: number; // Points to the current visible card
}

const initialState: EncounterState = {
  users: [],
  status: 'idle',
  topCardIndex: 0,
};

// Mock API call - Replace with your actual endpoint
export const fetchMoreUsers = createAsyncThunk(
  'encounter/fetchMoreUsers',
  async (_, { getState }) => {
    // In a real app, pass pagination params like page number
  const res = await axiosRequest.profiles.get();
  const data = res.data;

  // Normalize to an array. Supports either raw array or { users: [...] } shapes.
  const users: unknown =
    Array.isArray(data) ? data : (data && (data.filterData ?? []));

  if (!Array.isArray(users)) return [];
  return users as RandomUser[];
  }
);

export const processSwipe = createAsyncThunk(
  'users/swipe',
  async ({ userId, action }: { userId: number; action: 'like' | 'dislike' }) => {
    const actionCode = action === 'like' ? 1 : 0;
    // We don't await this in the UI thread to keep it non-blocking
    try {
      const res = await axiosRequest.post(`/${userId}/${actionCode}/user-like-dislike`, {});
      return res.data;
    } catch (error) {
      console.error("Background swipe API failed", error);
      // Optional: Logic to revert state if strictly required, 
      // but for "tinder-like" speed, we usually ignore generic failures.
    }
  }
);

const encounterSlice = createSlice({
  name: 'encounter',
  initialState,
  reducers: {
    // Action to remove card from stack (logically)
    popCard: (state) => {
      state.topCardIndex += 1;
    },
    // Action called from Detail screen
    performActionOnUser: (state, action: PayloadAction<{ id: number, action: 'like' | 'dislike' }>) => {
        // Logic to record the like/dislike in backend would go here
        
        // If the user acted on is the current top card, we advance the index
        const currentUser = state.users[state.topCardIndex];
        if (currentUser && currentUser.id === action.payload.id) {
             state.topCardIndex += 1;
        }
    },
    removeUserById: (state, action: PayloadAction<number>) => {
      state.users = state.users.filter(u => u.id !== action.payload);
    },
    resetStack: (state) => {
        state.topCardIndex = 0;
        state.users = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMoreUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMoreUsers.fulfilled, (state, action) => {
        state.status = 'idle';
        // Append new users to the existing list to maintain flow
        // Filter out duplicates if necessary
        const newUsers = action.payload.filter(
            newU => !state.users.some(existingU => existingU.id === newU.id)
        );
        state.users = [...state.users, ...newUsers];
      });
  },
});

export const { popCard, performActionOnUser, resetStack, removeUserById } = encounterSlice.actions;
export default encounterSlice.reducer;