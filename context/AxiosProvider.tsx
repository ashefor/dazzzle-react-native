import { createContext, useContext, useState } from "react";
import { useGlobalContext } from "./GlobalProvider";
import axios, { AxiosInstance } from "axios";
import { API_URL } from "@/constants/constants";
import { Modal, Image, View } from "react-native";
import {  YStack } from "tamagui";
import Images from '@/constants/images'
import { ReactionCodes } from "@/models/general";

const AxiosContext = createContext({
    axiosRequest: {} as AxiosInstance
});

export const useAxiosContext = () => useContext(AxiosContext);

const AxiosProvider = ({ children }: { children: React.ReactNode }) => {
    const [loading, setLoading] = useState(false);
    const { authState, token } = useGlobalContext();
    const axiosRequest = axios.create({
        baseURL: API_URL,
        headers: {
            "Accept": "*/*",
            "Api-Request-Signature": "mobile-app-request",
        },
    });

    // Request interceptor
    axiosRequest.interceptors.request.use(
        (config) => {
            const shouldHideLoader = config.headers.get('hide-loader') === 'true';
            if (shouldHideLoader) {
                setLoading(false);
            } else {
                setLoading(true);
            }
            if (authState) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }

            return config;
        },
        (error) => {
            setLoading(false);
            return Promise.reject(error);
        }
    );

    axiosRequest.interceptors.response.use(
        (response) => {
            setLoading(false);
            const { reaction, message, data, redirect_to, auth_info } = response.data;
            let errorMessage = message;
            if (reaction === ReactionCodes.ERROR) {
                if (auth_info) {
                    const { reaction_code } = auth_info;
                    if (reaction_code === ReactionCodes.NOT_AUTHENTICATED) {
                        errorMessage = 'Session expired. Please login again';
                    }
                } else if(data) {
                    errorMessage = data.message;
                }
            } else if ([ReactionCodes.RECORDS_NOT_EXIST, ReactionCodes.VALIDATION_ERROR].includes(reaction)) {
                errorMessage = message
            }
            if (errorMessage) {
                throw new Error(errorMessage); // This will stop further processing and reject the promise
            }
            return response;
        },
        async (error) => {
        let errorMessage = ''
        const {response } = error;
        if (response) {
            const { status, data } = response;
            if (status === 401) {
                errorMessage = 'Session expired. Please login again';
            }  else {
                errorMessage = data.message;
            }
        }
        // if (errorMessage) {
        //     throw new Error(errorMessage); // This will stop further processing and reject the promise
        // }
            setLoading(false);
            return Promise.reject({...error, errorMessage});
        }
    )

    return (
        <AxiosContext.Provider
            value={{
                axiosRequest
            }}
        >
            {loading && (
                <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, flex: 1, zIndex: 999 }}>
                    <YStack flex={1} alignItems="center" justifyContent="center" backgroundColor={"$black075"}>
                <Image source={Images.logo} className='w-20 h-20 mx-auto' resizeMode='contain' />
            </YStack>
                </View>
            )}
            {children}
        </AxiosContext.Provider>
    )
}

export default AxiosProvider