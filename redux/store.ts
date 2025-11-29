import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import authSlice, { setToken, setUser } from "./slices/authSlice";
import appSlice from "./slices/appSlice";
import { getItem } from "@/utils/asyncStorage";
import subscriptionSlice, { setActiveSubscription } from "./slices/subscriptionSlice";
import usersSlice from "./slices/usersSlice";

export const store = configureStore({
    reducer: {
        auth: authSlice,
        app: appSlice,
        subscription: subscriptionSlice,
        users: usersSlice
    },
});

// Initialize store from async storage
const initializeStore = async () => {
    const token = await getItem('dazzzle-token');
    const user = await getItem('dazzzle-user');
    const userSubscription = await getItem('dazzzle-user-subscription');
    store.dispatch(setUser(user));
    store.dispatch(setToken(token));
    store.dispatch(setActiveSubscription(userSubscription));
};

// Export the initialization promise to allow components to wait for it
export const storeInitializationPromise = initializeStore();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

setupListeners(store.dispatch);
