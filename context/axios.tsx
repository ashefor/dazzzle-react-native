import axios from 'axios';
import { APP_URL } from '../constants/url';
import { store } from '../redux/store/store';





// Create axios instance with default config
const axiosInstance = axios.create({

    baseURL: APP_URL.dev,
    headers: {
        Accept: "application/json",
    },
});

export const WithAuth = () => {
    const user = store.getState().user
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiaWF0IjoxNzM2OTczMDg4fQ.NNBxDoZV_D5VX67RNG7Hoa2FApke8p7hZlTJQiT1zcM"

    axiosInstance.defaults.headers['Authorization'] = Bearer ${token};
    return axiosInstance; // returns the axios instance with the token set
};
export const AxiosWithAuth = () => {
    const user = store.getState().user
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiaWF0IjoxNzM2OTczMDg4fQ.NNBxDoZV_D5VX67RNG7Hoa2FApke8p7hZlTJQiT1zcM"

    axiosInstance.defaults.headers['Authorization'] = Bearer ${token};
    return axiosInstance; // returns the axios instance with the token set
};

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        // Get current state from Redux store


        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        return response.data;
    },
    async (error) => {
        console.log(error.response?.data);
        const originalRequest = error.config;

        // Handle 401 Unauthorized error
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Example: Refresh token logic
                // const refreshToken = store.getState().auth.refreshToken;
                // const newToken = await refreshTokenAPI(refreshToken);
                // store.dispatch(updateToken(newToken));
                // originalRequest.headers.Authorization = Bearer ${newToken};
                // return axiosInstance(originalRequest);
            } catch (refreshError) {
                // Handle refresh token failure
                // store.dispatch(logoutUser());
            }
        }

        // Handle other errors
        return Promise.reject(error);
    }
);

export default axiosInstance;