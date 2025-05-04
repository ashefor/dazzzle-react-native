import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import UserSlice, { setToken, setUser } from "./slice/UserSlice";
import AppSlice from "./slice/AppSlice";
import { getItem } from "@/utils/asyncStorage";

export const store = configureStore({
    reducer: {
        users: UserSlice,
        app: AppSlice
    },
});

const initializeStore = async () => {
    const token = await getItem('dazzzle-token');
    const user = await getItem('dazzzle-user');
    store.dispatch(setUser(user));
    store.dispatch(setToken(token));
};

initializeStore();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

setupListeners(store.dispatch);
