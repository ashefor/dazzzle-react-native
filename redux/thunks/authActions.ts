// // authActions.js
import axios, { AxiosRequestConfig } from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { clear, getItem, removeItem, setItem } from '@/utils/asyncStorage'
import { ReactionCodes } from '@/models/general'
import { AuthApiResponse } from '@/models/user'
import { API_URL } from '@/constants/constants'
import dayjs from 'dayjs'
import { RootState } from '../store'

// const backendURL = 'http://127.0.0.1:5000'

// export const registerUser = createAsyncThunk(
//   'auth/register',
//   async ({ firstName, email, password }, { rejectWithValue }) => {
//     try {
//       const config = {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       }
//       await axios.post(
//         `${backendURL}/api/user/register`,
//         { firstName, email, password },
//         config
//       )
//     } catch (error) {
//     // return custom error message from backend if present
//       if (error.response && error.response.data.message) {
//         return rejectWithValue(error.response.data.message)
//       } else {
//         return rejectWithValue(error.message)
//       }
//     }
//   }
// )

export const userLogin = createAsyncThunk(
    'user/login-process',
    async ({ email_or_username, password }: { email_or_username: string; password: string }, { rejectWithValue }) => {
        try {
            const config: AxiosRequestConfig = {
                headers: {
                    "Accept": "*/*",
                    "Api-Request-Signature": "mobile-app-request",
                },
            }
            const response = await axios.post(
                `${API_URL}/user/login-process`,
                { email_or_username, password },
                config
            )
            const authApiResponse = response.data as AuthApiResponse;
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
            const authInfo = authApiResponse.data.auth_info;
            const user = authApiResponse.data.auth_info.profile;
            const userSubscription = authApiResponse.data.userSubscription;
            const token = authApiResponse.data.access_token;
            const isProfileComplete = authInfo.isProfileComplete;

            await setItem('dazzzle-token', token);
            await setItem('dazzzle-user', user);
            await setItem('dazzzle-user-subscription', userSubscription);

            return { user, token, isProfileComplete, userSubscription };
        } catch (error: any) {
            // return custom error message from API if any
            let errorMessage = ''
            if (error.response && error.response.data.message) {
                errorMessage = error.response.data.message
            } else {
                if ([500, 501, 504].includes(error.status)) {
                    errorMessage = 'Unable to complete'
                } else {
                    errorMessage = error.message
                }
            }
            return rejectWithValue(errorMessage)
        }
    }
)

export const fetchAuthenticatedUser = createAsyncThunk(
    'get-user-auth-info',
    async (_, { rejectWithValue }) => {
        try {
            const token = await getItem('dazzzle-token');
            const config: AxiosRequestConfig = {
                headers: {
                    "Accept": "*/*",
                    "Api-Request-Signature": "mobile-app-request",
                    ...(token && { Authorization: `Bearer ${token}` })
                }
            }
            const response = await axios.post(
                `${API_URL}/get-user-auth-info`,
                {},
                config
            )
            const authApiResponse = response.data as AuthApiResponse;
            const authInfo = authApiResponse.data.auth_info;
            const user = authInfo.profile;
            const isProfileComplete = authInfo.isProfileComplete;
            const userSubscription = authApiResponse.data.userSubscription;

            const { reaction, message, data, redirect_to, auth_info } = response.data;
            let errorMessage = message;
            if ([ReactionCodes.ERROR, ReactionCodes.NOT_AUTHENTICATED].includes(reaction)) {
                if (data) {
                    errorMessage = data.message;
                }
            } else if ([ReactionCodes.RECORDS_NOT_EXIST, ReactionCodes.VALIDATION_ERROR].includes(reaction)) {
                errorMessage = message
            }
            if (errorMessage) {
                return rejectWithValue(errorMessage)
            }
            // store user's token in local storage
            if (user) {
                await setItem('dazzzle-user', user);
            }
            return { user, isProfileComplete, userSubscription };
        } catch (error: any) {
            // return custom error message from API if any
            if (error.response && error.response.data.message) {
                return rejectWithValue(error.response.data.message)
            } else {
                return rejectWithValue(error.message)
            }
        }
    }
)

export const signUserOut = createAsyncThunk(
    '/user/logout',
    async (_, { rejectWithValue, getState }) => {
        try {
            const state = (getState() as any).auth;
            const config: AxiosRequestConfig = {
                headers: {
                    "Accept": "*/*",
                    "Api-Request-Signature": "mobile-app-request",
                    ...(state.userToken && { Authorization: `Bearer ${state.userToken}` })
                }
            }
            const response = await axios.post(
                `${API_URL}/user/logout`,
                {},
                config
            )
            const authApiResponse = response.data as AuthApiResponse;
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
            await removeItem('dazzzle-token');
            await removeItem('dazzzle-user');
            clear();
            return true;
        } catch (error: any) {
            // return custom error message from API if any
            if (error.response && error.response.data.message) {
                return rejectWithValue(error.response.data.message)
            } else {
                return rejectWithValue(error.message)
            }
        }
    }
)

export const deleteUserAccount = createAsyncThunk(
    '/user/delete-account',
    async (_, { rejectWithValue, getState }) => {
        try {
            const state = (getState() as any).auth;
            const config: AxiosRequestConfig = {
                headers: {
                    "Accept": "*/*",
                    "Api-Request-Signature": "mobile-app-request",
                    ...(state.userToken && { Authorization: `Bearer ${state.userToken}` })
                }
            }
            const response = await axios.post(
                `${API_URL}/delete-account`,
                {},
                config
            )
            const authApiResponse = response.data as AuthApiResponse;
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
            await removeItem('dazzzle-token');
            await removeItem('dazzzle-user');
            clear();
            return true;
        } catch (error: any) {
            // return custom error message from API if any
            if (error.response && error.response.data.message) {
                return rejectWithValue(error.response.data.message)
            } else {
                return rejectWithValue(error.message)
            }
        }
    }
)

export const checkUserSubscriptionHasExpired = createAsyncThunk(
    'check-user-subscription-has-expired',
    async (_, { rejectWithValue, getState }) => {
        try {
            // const userSubscription = await getItem('dazzzle-user-subscription');
            const state = (getState() as RootState).subscription;
            const userSubscription = state.currentSubscription;
            const hasExpired = userSubscription ? dayjs().isAfter(dayjs(userSubscription.expiry_at)) : false;
            console.log('hasExpired', hasExpired);
            return hasExpired;
        } catch (error: any) {
            return rejectWithValue(error)
        }
    }
)