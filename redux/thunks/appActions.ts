// // authActions.js
import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { BasicAppInterface, ReactionCodes } from '@/models/general'
import { API_URL } from '@/constants/constants'

export const fetchAppConfig = createAsyncThunk(
    'user/prepare-sign-up',
    async (_, { rejectWithValue }) => {
        console.log('fetchingAppConfig');
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    "Api-Request-Signature": "mobile-app-request",
                },
            }
            const response = await axios.get(
                `${API_URL}/user/prepare-sign-up`,
                config
            )
            console.log('app response', response);
            const responseData = response.data;
            const generalConfigSettings = responseData.data as BasicAppInterface;
            const { reaction, message, data } = responseData;
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
            return generalConfigSettings;
        } catch (error: any) {
            if (error.response && error.response.data.message) {
                return rejectWithValue(error.response.data.message)
            } else {
                return rejectWithValue(error.message)
            }
        }
    }
)