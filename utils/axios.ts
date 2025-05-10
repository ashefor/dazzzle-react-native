// api.ts
import { hideLoading, showLoading } from "@/redux/slices/appSlice";
// import { store } from "@/redux/store";
import axios, { AxiosRequestConfig } from "axios";
import { getItem } from "./asyncStorage";
import { API_URL } from "@/constants/constants";
import { ReactionCodes } from "@/models/general";

export interface CustomAxiosRequestConfig extends AxiosRequestConfig {
    showGlobalLoader?: boolean;
    loaderMessage?: string;
    token?: string;
}


// Create axios instance
const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        "Accept": "*/*",
        "Api-Request-Signature": "mobile-app-request",
    },
});

// Request Interceptor
axiosInstance.interceptors.request.use(async (config) => {
    const { showGlobalLoader = true, loaderMessage = "Loading..." } = config as any;

    if (showGlobalLoader) {
        // store.dispatch(showLoading(loaderMessage));
    }
    let token: string | null = null;

    try {
        // const state = store.getState();
        // if (state.auth.userToken) {
        //     token = state.auth.userToken;
        // } else {
        //     token = await getItem("dazzzle-token");
        // }

        token = await getItem("dazzzle-token");

        // Attach token if available
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    } catch (error) {
        console.warn("Token fetch failed", error);
    }

    return config;
}, (error) => {
    // store.dispatch(hideLoading());
    return Promise.reject(error);
});

// Response Interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        const { showGlobalLoader = true } = response.config as any;
        if (showGlobalLoader) {
            // store.dispatch(hideLoading());
        }
        const { reaction, message, data, redirect_to, auth_info } = response.data;
        let errorMessage = message;
        if (reaction) {
            if (reaction === ReactionCodes.ERROR) {
                if (auth_info) {
                    const { reaction_code } = auth_info;
                    if (reaction_code === ReactionCodes.NOT_AUTHENTICATED) {
                        errorMessage = 'Session expired. Please login again';
                    }
                } else if (data) {
                    errorMessage = data.message;
                }
            } else if ([ReactionCodes.RECORDS_NOT_EXIST, ReactionCodes.VALIDATION_ERROR].includes(reaction)) {
                errorMessage = message
            }
            if (errorMessage) {
                throw new Error(errorMessage); // This will stop further processing and reject the promise
            }
        }
        return response.data;
    },
    (error) => {
        const { showGlobalLoader = true } = error.config || {};
        if (showGlobalLoader) {
            // store.dispatch(hideLoading());
        }

        console.log('parent error', error)
        const message = error.response?.data?.message || "An error occurred";
        return Promise.reject(new Error(message));
    }
);

// Request options interface
interface RequestOptions {
    showGlobalLoader?: boolean;
    loaderMessage?: string;
    token?: string;
}

// Helper to merge options into config
const buildConfig = (options: CustomAxiosRequestConfig = {}) => ({
    ...options,
});

const axiosRequest = {
    get: (endpoint: string, options?: RequestOptions) =>
        axiosInstance.get(endpoint, buildConfig(options)),

    post: (endpoint: string, data: any, options?: RequestOptions) =>
        axiosInstance.post(endpoint, data, buildConfig(options)),

    put: (endpoint: string, data: any, options?: RequestOptions) =>
        axiosInstance.put(endpoint, data, buildConfig(options)),

    delete: (endpoint: string, options?: RequestOptions) =>
        axiosInstance.delete(endpoint, buildConfig(options)),

    // Endpoint groups
    swipes: {
        like: (userId: string, options?: RequestOptions) =>
            axiosRequest.post(`/${userId}/1/user-like-dislike`, {}, options),
        dislike: (userId: string, options?: RequestOptions) =>
            axiosRequest.post(`/${userId}/0/user-like-dislike`, {}, options),
    },

    subscriptions: {
        check: (options?: RequestOptions) =>
            axiosRequest.get("/subscriptions/status", { showGlobalLoader: false, ...options }),
        create: (planId: string, options?: RequestOptions) =>
            axiosRequest.post("/subscriptions", { planId }, options),
        cancel: (subscriptionId: string, options?: RequestOptions) =>
            axiosRequest.put(`/subscriptions/${subscriptionId}/cancel`, {}, options),
    },

    profiles: {
        get: (options?: RequestOptions) => axiosRequest.get("/random-user", options),
        update: (profileData: any, options?: RequestOptions) =>
            axiosRequest.put("/random-user", profileData, options),
    },

    auth: {
        login: (email: string, password: string, options?: RequestOptions) =>
            axiosRequest.post("/auth/login", { email, password }, options),
        register: (userData: any, options?: RequestOptions) =>
            axiosRequest.post("/auth/register", userData, options),
        logout: (options?: RequestOptions) => axiosRequest.post("/auth/logout", {}, options),
    },
};

export default axiosRequest;
