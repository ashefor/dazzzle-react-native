import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { fetchAuthenticatedUser, signUserOut } from "@/redux/authActions";
import { logUserOut } from "@/redux/slice/UserSlice";
import { clear } from "@/utils/asyncStorage";
import { Redirect, router } from "expo-router";
import { useEffect } from "react";
import { SafeAreaView, ActivityIndicator } from "react-native"
import { Spinner } from "tamagui";

const UserDetails = () => {
    const dispatch = useAppDispatch();
    const { userInfo, loadingUser, userToken, error, shouldSignUserOut, isProfileCompleted } = useAppSelector(state => state.users);

    useEffect(() => {
        dispatch(fetchAuthenticatedUser())
    }, [])

    useEffect(() => {
        if (error) {
            clear();
            dispatch(signUserOut())
        } else if (userInfo) {
            console.log('userInfo', userInfo);
            if (isProfileCompleted) {
                if (userInfo.is_premium) {
                    router.replace('./(tabs)');
                } else {
                    router.replace('./subscription');
                }
            } else {
                router.replace('./onboard/bio-data');
            }
        }
    }, [error, userInfo, isProfileCompleted])

    useEffect(() => {
        if (shouldSignUserOut) {
            router.replace('./(auth)/sign-in');
        }
    }, [shouldSignUserOut])

    if (loadingUser) {
        return (
            <SafeAreaView className="flex-1 items-center justify-center bg-red-200">
                <Spinner color={'#023c69'} size="large" />
            </SafeAreaView>
        )
    } else {
        if (error) {
            return <Redirect href={'/(auth)/sign-in'} />
        } else {
            if (isProfileCompleted) {
                return <Redirect href="./(tabs)" />;
            } else {
                return <Redirect href="./onboard/bio-data" />
            }
        }
    }
}

export default UserDetails