import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { userLogin } from '../thunks/authActions';
import { BasicAppInterface } from '@/models/general';
import { fetchAppConfig } from '../thunks/appActions';

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

export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
       showLoading: (state) => {
           state.loading = true
       },
       hideLoading: (state) => {
           state.loading = false
       },
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

export const { showLoading, hideLoading } = appSlice.actions;

export default appSlice.reducer;
