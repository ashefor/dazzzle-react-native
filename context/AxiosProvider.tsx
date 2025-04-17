import { createContext, useContext, useState } from "react";
import { useGlobalContext } from "./GlobalProvider";
import axios, {AxiosInstance} from "axios";
import { API_URL } from "@/constants/constants";
import { Modal, Image } from "react-native";
import { YStack } from "tamagui";
import Images from '@/constants/images'

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
            return response;
        },
        async (error) => {
            setLoading(false);
            return Promise.reject(error);
        }
    )

    return (
        <AxiosContext.Provider
            value={{
                axiosRequest
            }}
        >
            {/* <Modal animationType="none" visible={loading} presentationStyle="overFullScreen" transparent>
                <YStack flex={1} alignItems="center" justifyContent="center" backgroundColor={"$black075"}>
                    <Image source={Images.logo} className='w-20 h-20 mx-auto' resizeMode='contain' />
                </YStack>
            </Modal> */}
            {children}
        </AxiosContext.Provider>
    )
}

export default AxiosProvider