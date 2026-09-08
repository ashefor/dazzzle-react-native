// counterSlice.js
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { deleteUserAccount, fetchAuthenticatedUser, signUserOut, userLogin } from '../thunks/authActions';
import { LoggedInUserProfile } from '@/models/user';
import { fetchUserProfileData } from '../thunks/userActions';
import { arrayToObject } from '@/utils/helpers';

type UserState = {
    loading: boolean,
    loadingUser: boolean,
    userInfo: LoggedInUserProfile | null,
    userToken: string,
    isProfileCompleted: boolean,
    error: any,
    userProfileData: {[key: string]: any} | null,
    loadingUserProfileData: boolean,
    loggingOut: boolean,
    sessionInvalid: boolean,
    // shouldSignUserOut: boolean,
}

const initialState: UserState = {
    loading: false,
    loadingUser: false,
    userInfo: null,
    userToken: '',
    isProfileCompleted: false,
    error: null,
    userProfileData: null,
    loadingUserProfileData: false,
    loggingOut: false,
    sessionInvalid: false,
    // shouldSignUserOut: false
}

export const userSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        /**
         * Set the user state by providing a partial UserState object.
         * @param action.payload A partial UserState object containing the new values for the user state.
         * @returns The new state with the updated user state.
         */

        setUser: (state: UserState, action: PayloadAction<LoggedInUserProfile | null>) => {
            state.userInfo = action.payload;
        },
        setToken: (state: UserState, action: PayloadAction<string>) => {
            return { ...state, userToken: action.payload };
        },
        logUserOut: () => {
            return initialState;
        },
        updateUserInfo: (state: UserState, action) => {
            const oldUser = state.userInfo;
            const newUser = {...oldUser, ...action.payload}
            state.userInfo = newUser;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(userLogin.pending, (state) => {
            state.error = null
            state.loading = true
            state.sessionInvalid = false
        })
        builder.addCase(userLogin.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null
            state.userInfo = action.payload.user;
            state.userToken = action.payload.token;
            state.isProfileCompleted = action.payload.isProfileComplete;
            state.sessionInvalid = false;
        })
        builder.addCase(userLogin.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        builder.addCase(fetchAuthenticatedUser.pending, (state) => {
            state.loadingUser = true;
            state.error = null;
            state.sessionInvalid = false;
        })
        builder.addCase(fetchAuthenticatedUser.fulfilled, (state, action) => {
            state.loadingUser = false;
            state.userInfo = action.payload.user;
            state.userToken = action.payload.token;
            state.isProfileCompleted = action.payload.isProfileComplete;
            state.error = null;
            state.sessionInvalid = false;
        })
        builder.addCase(fetchAuthenticatedUser.rejected, (state, action) => {
            state.loadingUser = false;
            state.error = action.payload?.message ?? action.error.message;
            state.sessionInvalid = action.payload?.sessionInvalid ?? false;
        })
        builder.addCase(signUserOut.pending, (state) => {
            state.loggingOut = true;
        })
        builder.addCase(signUserOut.fulfilled, (state) => {
            state.loggingOut = false;
            // state.shouldSignUserOut = action.payload;
            state.userInfo = null;
            state.userToken = '';
            state.isProfileCompleted = false;
            state.sessionInvalid = false;
            // state.shouldSignUserOut = false;
        })
        builder.addCase(signUserOut.rejected, (state, action) => {
            state.loggingOut = false;
            state.error = action.payload;
        })
        builder.addCase(deleteUserAccount.pending, (state) => {
            state.loading = true;
        })
        builder.addCase(deleteUserAccount.fulfilled, (state) => {
            state.loading = false;
            state.userInfo = null;
            state.userToken = '';
            state.isProfileCompleted = false;
            state.sessionInvalid = false;
        })
        builder.addCase(deleteUserAccount.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        builder.addCase(fetchUserProfileData.pending, (state) => {
            state.userProfileData = null
            state.loadingUserProfileData = true
        })
        builder.addCase(fetchUserProfileData.fulfilled, (state, action) => {
            const response = action.payload;
            const userSpecificationData = response.userSpecificationData;
            const formatteduserSpecificationData = arrayToObject(userSpecificationData);
            state.loadingUserProfileData = false
            state.userProfileData = {...action.payload, formatteduserSpecificationData: formatteduserSpecificationData}
        })
        builder.addCase(fetchUserProfileData.rejected, (state, action) => {
            state.loadingUserProfileData = false
            state.error = action.payload
        })
    },
});

// const initializeStore = async () => {
//     const token = await getItem('dazzzle-token');
//     const user = await getItem('dazzzle-user');
//     const userSubscription = await getItem('dazzzle-user-subscription');
//     setUser(user);
//     setToken(token)
//     store.dispatch(subscriptionSlice.actions.setActiveSubscription(userSubscription));
// };

// initializeStore();

export const { setUser, setToken, logUserOut, updateUserInfo } = userSlice.actions;

export default userSlice.reducer;
