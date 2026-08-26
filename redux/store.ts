import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import authSlice, { setToken, setUser } from "./slices/authSlice";
import appSlice from "./slices/appSlice";
import { getItem } from "@/utils/asyncStorage";
import subscriptionSlice, { setActiveSubscription } from "./slices/subscriptionSlice";
import usersSlice from "./slices/usersSlice";
import chatsSlice from "./slices/chatsSlice";
import messagesSlice from "./slices/messagesSlice";
import encounterSlice from "./slices/encounterSlice";
import notificationsSlice from "./slices/notificationsSlice";
import iapSlice from "./slices/iapSlice"; // ← new
import { clearUserSession } from "./actions/sessionActions";

const appReducer = combineReducers({
    auth: authSlice,
    app: appSlice,
    subscription: subscriptionSlice,
    users: usersSlice,
    chats: chatsSlice,
    messages: messagesSlice,
    encounter: encounterSlice,
    notifications: notificationsSlice,
    iap: iapSlice, // ← new
});

const rootReducer: typeof appReducer = (state, action) => {
    if (clearUserSession.match(action)) {
        const resetState = appReducer(undefined, action);

        return {
            ...resetState,
            // Public configuration is not tied to the deleted account and is
            // still needed by sign-up/onboarding without restarting the app.
            app: state?.app ?? resetState.app,
        };
    }

    return appReducer(state, action);
};

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    }),
});

const initializeStore = async () => {
    const token = await getItem('dazzzle-token');
    const user = await getItem('dazzzle-user');
    const userSubscription = await getItem('dazzzle-user-subscription');
    store.dispatch(setUser(user));
    store.dispatch(setToken(token));
    store.dispatch(setActiveSubscription(userSubscription));
};

// initializeStore();
export const initializeStorePromise = initializeStore();


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

setupListeners(store.dispatch);
