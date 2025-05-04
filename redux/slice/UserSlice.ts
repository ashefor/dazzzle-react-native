// counterSlice.js
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchAuthenticatedUser, signUserOut, userLogin } from '../authActions';
import { clear } from '@/utils/asyncStorage';
import { LoggedInUser, LoggedInUserProfile } from '@/models/user';

type UserState = {
    loading: boolean,
    loadingUser: boolean,
    userInfo: LoggedInUserProfile | null,
    userToken: string,
    isProfileCompleted: boolean,
    error: any,
    shouldSignUserOut: boolean,
}

const initialState: UserState = {
    loading: false,
    loadingUser: false,
    userInfo: null,
    userToken: '',
    isProfileCompleted: false,
    error: null,
    shouldSignUserOut: false
}

export const UserSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state: UserState, action: PayloadAction<UserState>) => {
            return { ...state, ...action.payload };
        },
        setToken: (state: UserState, action: PayloadAction<string>) => {
            return { ...state, userToken: action.payload };
        },
        logUserOut: () => {
            return initialState;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(userLogin.pending, (state) => {
            state.loading = true
        })
        builder.addCase(userLogin.fulfilled, (state, action) => {
            state.loading = false
            state.userInfo = action.payload.user
            state.userToken = action.payload.token
            state.isProfileCompleted = action.payload.isProfileComplete
        })
        builder.addCase(userLogin.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
        }),
            builder.addCase(fetchAuthenticatedUser.pending, (state, action) => {
                state.loadingUser = true
            })
        builder.addCase(fetchAuthenticatedUser.fulfilled, (state, action) => {
            state.loadingUser = false
            state.userInfo = action.payload.user
            state.isProfileCompleted = action.payload.isProfileComplete
        }),
        builder.addCase(fetchAuthenticatedUser.rejected, (state, action) => {
            state.loadingUser = false
            state.error = action.payload
        })
        builder.addCase(signUserOut.pending, (state, action) => {
            state.loading = true
        }),
        builder.addCase(signUserOut.fulfilled, (state, action) => {
            state.loading = false
            state.shouldSignUserOut = action.payload
            logUserOut();
        }),
        builder.addCase(signUserOut.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
        })
    },
});

export const { setUser, setToken, logUserOut } = UserSlice.actions;

export default UserSlice.reducer;
