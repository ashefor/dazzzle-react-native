import { createSlice } from "@reduxjs/toolkit"
import { fetchAuthenticatedUser, userLogin } from "../thunks/authActions"

interface Subscription {
    _id: number
    _uid: string
    created_at: string
    updated_at: string
    status: number
    users__id: number
    expiry_at: string
    credit_wallet_transactions__id: number
    plan_id: string
}

type SubscriptionState = {
    currentSubscription: Subscription | null;
    isActive: boolean;
    loading: boolean;
    error: string | null;
}

const initialState: SubscriptionState = {
    currentSubscription: null,
    isActive: false,
    loading: false,
    error: null,
}

export const subscriptionSlice = createSlice({
    name: 'subscription',
    initialState,
    reducers: {
        setActiveSubscription: (state, action) => {
            const now = new Date();
            const endDate = new Date(action.payload.expiry_at);
            return {
                ...state,
                currentSubscription: action.payload,
                isActive: now < endDate
            }
        },
        clearActiveSubscription: (state) => {
            return {
                ...state,
                currentSubscription: null,
                isActive: false
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(userLogin.pending, (state) => {
            state.loading = true
        })
        builder.addCase(userLogin.fulfilled, (state, action) => {
            state.loading = false
            state.currentSubscription = action.payload.userSubscription;
        })
        builder.addCase(userLogin.rejected, (state, action) => {
            state.loading = false
            state.currentSubscription = null
        }),
        builder.addCase(fetchAuthenticatedUser.pending, (state, action) => {
            state.loading = true
        })
        builder.addCase(fetchAuthenticatedUser.fulfilled, (state, action) => {
            state.loading = false
            state.currentSubscription = action.payload.userSubscription;
        })
    }
})

export const { setActiveSubscription, clearActiveSubscription } = subscriptionSlice.actions;

export default subscriptionSlice.reducer;