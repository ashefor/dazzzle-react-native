import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { fetchAuthenticatedUser, signUserOut } from "@/redux/thunks/authActions";
import { Redirect, router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import dayjs from 'dayjs';

const UserDetails = () => {
    const dispatch = useAppDispatch();
    const { userInfo, loadingUser, userToken, error, isProfileCompleted } = useAppSelector(state => state.auth);
    const { currentSubscription,  } = useAppSelector(state => state.subscription);
    const [hasExpired, setHasExpired] = useState(false);

    useEffect(() => {
        dispatch(fetchAuthenticatedUser())
    }, [])

    useEffect(() => {
        checkForExpiration();
    }, [currentSubscription])


    const checkForExpiration = () => {
        if (currentSubscription) {
            if (dayjs().isAfter(dayjs(currentSubscription.expiry_at))) {
                setHasExpired(true);
            } else {
                setHasExpired(false);
            }
        }
    }

    useEffect(() => {
        if (error) {
            dispatch(signUserOut()).unwrap().then(() => router.replace('./(auth)/sign-in'))
        }
    }, [error])


    if (loadingUser) {
        return (
            <View className="h-full w-full items-center justify-center bg-white">
                <ActivityIndicator size="large" color="#DD3FE5" />
            </View>
        )
    } else {
        if (userInfo) {
            if (isProfileCompleted) {
                if (userInfo.is_premium) {
                    if (hasExpired) {
                        return <Redirect href="./paywall" />
                    } else {
                        return <Redirect href="./(tabs)" />
                    }
                } else {
                    return <Redirect href="./paywall" />
                }
            } else {
                return <Redirect href="./onboard/bio-data" />
            }
        } 
    }
}

export default UserDetails