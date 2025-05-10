import { User } from "@/components/TinderCardSwipers";
import axiosRequest from "@/utils/axios";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { fetchProfilesAsync, swipeLeftAsync, swipeRightAsync } from "../thunks/swipeActions";

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  bio: string;
  images: string[];
  distance: number;
  interests: string[];
}

interface UsersState {
  profiles: User[];
  currentIndex: number;
  loading: boolean;
  error: string | null;
  swipeLoading: boolean;
  swipeError: string | null;
  fetchingMore: boolean;
}

const initialState: UsersState = {
  profiles: [],
  currentIndex: 0,
  loading: false,
  error: null,
  swipeLoading: false,
  swipeError: null,
  fetchingMore: false,
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    fetchProfilesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchProfilesSuccess: (state, action: PayloadAction<User[]>) => {
      state.profiles = action.payload;
      state.currentIndex = 0;
      state.loading = false;
      state.error = null;
    },
    fetchProfilesFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    swipeLeft: (state) => {
      if (state.currentIndex < state.profiles.length - 1) {
        state.currentIndex += 1;
      }
    },
    swipeRight: (state) => {
      if (state.currentIndex < state.profiles.length - 1) {
        state.currentIndex += 1;
      }
    },
    resetIndex: (state) => {
      state.currentIndex = 0;
    },
    clearSwipeError: (state) => {
      state.swipeError = null;
    },
  },
  extraReducers: (builder) => {
    // Handle fetchProfilesAsync
    builder
      .addCase(fetchProfilesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfilesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.profiles = action.payload;
        state.currentIndex = 0;
      })
      .addCase(fetchProfilesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
      
    // Handle swipeLeftAsync
    builder
      .addCase(swipeLeftAsync.pending, (state) => {
        state.swipeLoading = true;
        state.swipeError = null;
      })
      .addCase(swipeLeftAsync.fulfilled, (state) => {
        state.swipeLoading = false;
        // Move to next profile after successful API call
        if (state.currentIndex < state.profiles.length - 1) {
          state.currentIndex += 1;
        }
      })
      .addCase(swipeLeftAsync.rejected, (state, action) => {
        state.swipeLoading = false;
        state.swipeError = action.payload as string;
      });

    // Handle swipeRightAsync
    builder
      .addCase(swipeRightAsync.pending, (state) => {
        state.swipeLoading = true;
        state.swipeError = null;
      })
      .addCase(swipeRightAsync.fulfilled, (state) => {
        state.swipeLoading = false;
        // Move to next profile after successful API call
        if (state.currentIndex < state.profiles.length - 1) {
          state.currentIndex += 1;
        }
      })
      .addCase(swipeRightAsync.rejected, (state, action) => {
        state.swipeLoading = false;
        state.swipeError = action.payload as string;
      });
  },
});

export const {
  fetchProfilesStart,
  fetchProfilesSuccess,
  fetchProfilesFailure,
  swipeLeft,
  swipeRight,
  resetIndex,
  clearSwipeError,
} = usersSlice.actions;

export default usersSlice.reducer;