import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { userLogin } from '../authActions';
import { BasicAppInterface } from '@/models/general';
import { fetchAppConfig } from '../appActions';

type AppState = {
    loading: boolean,
    appConfig: BasicAppInterface | undefined,
    error: any
}

const initialState: AppState = {
    loading: true,
    appConfig: undefined,
    error: undefined
}

export const AppSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        getAppConfig: (state) => {
            state.appConfig
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchAppConfig.pending, (state) => {
            state.loading = true
        })
        builder.addCase(fetchAppConfig.fulfilled, (state, action) => {
            state.loading = false
            state.appConfig = action.payload
        })
        builder.addCase(userLogin.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
        })
    },
});

export const { getAppConfig } = AppSlice.actions;

export default AppSlice.reducer;
