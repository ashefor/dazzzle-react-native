import { API_URL } from "@/constants/constants";
import { ReactionCodes } from "@/models/general";
import { getItem, setItem } from "@/utils/asyncStorage";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosRequestConfig } from "axios";

export const fetchUserProfileData = createAsyncThunk(
    'user/update',
    async (_, { rejectWithValue, dispatch, getState }) => {
        try {
            const token = await getItem('dazzzle-token');

            const state = (getState() as any).auth;
            const username = state.userInfo.username;
            const config: AxiosRequestConfig = {
                headers: {
                    "Accept": "*/*",
                    "Api-Request-Signature": "mobile-app-request",
                    ...(token && { Authorization: `Bearer ${token}` })
                }
            }
            const response = await axios.get(
                `${API_URL}/${username}/get-user-profile-data`,
                config
            )
            const { reaction, message, data } = response.data;
            let errorMessage = message;
            if (reaction === ReactionCodes.ERROR) {
                if (data) {
                    errorMessage = data.message;
                }
            } else if ([ReactionCodes.RECORDS_NOT_EXIST, ReactionCodes.VALIDATION_ERROR].includes(reaction)) {
                errorMessage = message
            }
            if (errorMessage) {
                return rejectWithValue(errorMessage)
            }
            return data
        } catch (error: any) {
            // return custom error message from API if any
            let errorMessage = ''
            if (error.response && error.response.data.message) {
                errorMessage = error.response.data.message
            } else {
                errorMessage = error.message
            }
            return rejectWithValue(errorMessage)
        }
    }
)

export const updateUserBioData = createAsyncThunk(
    'user/update',
    async (bioData: any, { rejectWithValue, dispatch }) => {
        try {
            const {first_name, last_name, about_me} = bioData
            const token = await getItem('dazzzle-token');
            const config: AxiosRequestConfig = {
                headers: {
                    "Accept": "*/*",
                    "Api-Request-Signature": "mobile-app-request",
                    ...(token && { Authorization: `Bearer ${token}` })
                }
            }
            const response = await axios.post(
                `${API_URL}/update-basic-settings`,
                bioData,
                config
            )
            const { reaction, message, data } = response.data;
            let errorMessage = message;
            if (reaction === ReactionCodes.ERROR) {
                if (data) {
                    errorMessage = data.message;
                }
            } else if ([ReactionCodes.RECORDS_NOT_EXIST, ReactionCodes.VALIDATION_ERROR].includes(reaction)) {
                errorMessage = message
            }
            if (errorMessage) {
                return rejectWithValue(errorMessage)
            }
            const oldUser = await getItem('dazzzle-user');
            const newUser = { ...oldUser, first_name, last_name, about_me };
            await setItem('dazzzle-user', newUser);
            return newUser;
        } catch (error: any) {
            // return custom error message from API if any
            let errorMessage = ''
            if (error.response && error.response.data.message) {
                errorMessage = error.response.data.message
            } else {
                errorMessage = error.message
            }
            return rejectWithValue(errorMessage)
        }
    }
)