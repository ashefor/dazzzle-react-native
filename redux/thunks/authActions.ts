// // authActions.js
import axios, { AxiosRequestConfig, isAxiosError } from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { clear, getItem, removeItem, setItem } from '@/utils/asyncStorage'
import { ReactionCodes } from '@/models/general'
import { AuthApiResponse } from '@/models/user'
import dayjs from 'dayjs'
import type { RootState } from '../store'
import { API_URL } from '@/constants/constants'
import { clearUserSession } from '../actions/sessionActions'
import { persistRefreshedAuthToken } from '@/utils/authToken'

export type AuthSessionFailure = {
    message: string;
    sessionInvalid: boolean;
};

type AuthSessionResult = {
    user: AuthApiResponse['data']['auth_info']['profile'];
    isProfileComplete: boolean;
    userSubscription: AuthApiResponse['data']['userSubscription'];
    token: string;
};

type ApiErrorData = {
    message?: string;
    reaction?: number;
    auth_info?: { reaction_code?: number };
    data?: {
        message?: string;
        auth_info?: { reaction_code?: number };
    };
};

const getSessionFailure = (response: ApiErrorData): AuthSessionFailure => {
    const reactionCode = response.auth_info?.reaction_code
        ?? response.data?.auth_info?.reaction_code;

    return {
        message: response.data?.message
            ?? response.message
            ?? (reactionCode === ReactionCodes.NOT_AUTHENTICATED
                ? 'Session expired. Please login again.'
                : 'Unable to verify your account. Please try again.'),
        sessionInvalid: response.reaction === ReactionCodes.NOT_AUTHENTICATED
            || reactionCode === ReactionCodes.NOT_AUTHENTICATED,
    };
};

// const API_URL = process.env.EXPO_PUBLIC_API_URL || '';

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

export const fetchAuthenticatedUser = createAsyncThunk<
    AuthSessionResult,
    void,
    { rejectValue: AuthSessionFailure }
>(
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
            const responseData = response.data as AuthApiResponse & ApiErrorData;
            const refreshedToken = await persistRefreshedAuthToken(responseData);

            if (responseData.reaction !== ReactionCodes.SUCCESS || !responseData.data?.auth_info) {
                return rejectWithValue(getSessionFailure(responseData));
            }

            const authInfo = responseData.data.auth_info;
            const user = authInfo.profile;
            const isProfileComplete = authInfo.isProfileComplete;
            const userSubscription = responseData.data.userSubscription;
            const activeToken = refreshedToken ?? token;

            if (!activeToken) {
                return rejectWithValue({
                    message: 'Session expired. Please login again.',
                    sessionInvalid: true,
                });
            }

            if (user) {
                await setItem('dazzzle-user', user);
            }
            await setItem('dazzzle-user-subscription', userSubscription);

            return { user, isProfileComplete, userSubscription, token: activeToken };
        } catch (error: unknown) {
            if (isAxiosError<ApiErrorData>(error)) {
                const failure = getSessionFailure(error.response?.data ?? {});
                return rejectWithValue({
                    ...failure,
                    message: error.response ? failure.message : (error.message ?? failure.message),
                });
            }

            return rejectWithValue({
                message: error instanceof Error ? error.message : 'Unable to verify your account.',
                sessionInvalid: false,
            });
        }
    }
)

export const signUserOut = createAsyncThunk(
    '/user/logout',
    async (_, { dispatch, getState }) => {
        const state = (getState() as RootState).auth;

        // Local logout must never depend on the server being reachable.
        await clear();
        dispatch(clearUserSession());

        try {
            const config: AxiosRequestConfig = {
                headers: {
                    "Accept": "*/*",
                    "Api-Request-Signature": "mobile-app-request",
                    ...(state.userToken && { Authorization: `Bearer ${state.userToken}` })
                },
                timeout: 5000,
            }
            await axios.post(
                `${API_URL}/user/logout`,
                {},
                config
            )
        } catch {
            // The device is already signed out. Server logout is best-effort.
        }

        return true;
    }
)

export type DeleteAccountPayload = {
    password?: string;
    confirmation: 'DELETE';
};

type DeleteAccountApiResponse = {
    reaction: typeof ReactionCodes[keyof typeof ReactionCodes];
    message?: string;
    data?: { message?: string } | null;
};

export const deleteUserAccount = createAsyncThunk<
    boolean,
    DeleteAccountPayload,
    { state: RootState; rejectValue: string }
>(
    'user/delete-account',
    async (payload, { dispatch, rejectWithValue, getState }) => {
        try {
            const state = getState().auth;
            const config: AxiosRequestConfig = {
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Api-Request-Signature": "mobile-app-request",
                    ...(state.userToken && { Authorization: `Bearer ${state.userToken}` })
                }
            }
            const response = await axios.post<DeleteAccountApiResponse>(
                `${API_URL}/delete-account`,
                payload,
                config
            )
            const { reaction, message, data } = response.data;

            if (reaction !== ReactionCodes.SUCCESS) {
                return rejectWithValue(data?.message ?? message ?? 'Account deletion failed.')
            }

            await Promise.all([
                removeItem('dazzzle-token'),
                removeItem('dazzzle-user'),
                removeItem('dazzzle-user-subscription'),
            ]);
            await clear();
            dispatch(clearUserSession());

            return true;
        } catch (error: unknown) {
            if (isAxiosError<{ message?: string }>(error)) {
                return rejectWithValue(
                    error.response?.data?.message ?? error.message ?? 'Account deletion failed.'
                )
            }

            return rejectWithValue('Account deletion failed.')
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
            return hasExpired;
        } catch (error: any) {
            return rejectWithValue(error)
        }
    }
)
