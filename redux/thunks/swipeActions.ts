import axiosRequest from "@/utils/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";

// Async thunk for swiping left (dislike)
export const swipeLeftAsync = createAsyncThunk(
    "users/swipeLeft",
    async (userId: string, {getState, rejectWithValue, dispatch }) => {
      try {
        // API call to record dislike - don't show global loader for swipes
        const state = getState() as RootState;
        const {profiles, currentIndex} = state.users;
        const response = await axiosRequest.swipes.dislike(userId, { 
          showGlobalLoader: false 
        });
        const remainingProfiles = profiles.length - currentIndex - 1;
      if (remainingProfiles < 6 && !state.users.fetchingMore) {
        dispatch(fetchProfilesAsync());
      }
        return response;
      } catch (error) {
        return rejectWithValue(error instanceof Error ? error.message : "Failed to record dislike");
      }
    }
  );
  
  // Async thunk for swiping right (like)
  export const swipeRightAsync = createAsyncThunk(
    "users/swipeRight",
    async (userId: string, {getState, rejectWithValue, dispatch }) => {
      try {
        // API call to record like - don't show global loader for swipes
        const state = getState() as RootState;
        const {profiles, currentIndex} = state.users;
        const response = await axiosRequest.swipes.like(userId, { 
          showGlobalLoader: false 
        });
        const remainingProfiles = profiles.length - currentIndex - 1;
        if (remainingProfiles < 6 && !state.users.fetchingMore) {
          dispatch(fetchProfilesAsync());
        }
        return {
          ...response,
          isMatch: true, // Check if it's a match
        };
      } catch (error) {
        return rejectWithValue(error instanceof Error ? error.message : "Failed to record like");
      }
    }
  );
  
  // Async thunk for fetching profiles
  export const fetchProfilesAsync = createAsyncThunk(
    "users/random-user",
    async (_, { rejectWithValue }) => {
      try {
        // API call to fetch profiles - show global loader with custom message
        const response = await axiosRequest.profiles.get({
          loaderMessage: "Finding matches for you..."
        });
        return response.data.filterData;
      } catch (error) {
        return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch profiles");
      }
    }
  );