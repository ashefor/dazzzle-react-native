import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { fetchAuthenticatedUser, signUserOut } from "@/redux/thunks/authActions";
import { logUserOut } from "@/redux/slices/authSlice";
import { clear } from "@/utils/asyncStorage";
import { Redirect, router } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaView, ActivityIndicator, View, Image } from "react-native"
import { Spinner, YStack } from "tamagui";
import Images from '@/constants/images';
import dayjs, { Dayjs } from 'dayjs'

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
        } else if (userInfo) {
            if (isProfileCompleted) {
                if (userInfo.is_premium) {
                    if (!hasExpired) {
                        router.replace('./(tabs)/discover');
                    } else {
                        router.replace('/paywall');
                    }
                } else {
                    router.replace('/paywall');
                }
            } else {
                router.replace('./onboard/bio-data');
            }
        }
    }, [error, userInfo, isProfileCompleted])


    if (loadingUser) {
        return (
            <View className="h-full w-full items-center justify-center bg-primary">
                {/* <Spinner color={'#023c69'} size="large" /> */}
                <YStack flex={1} width="100%" alignItems="center" justifyContent="center" backgroundColor={"$black075"}>
                    <Image source={Images.logo} className='w-20 h-20 mx-auto' resizeMode='contain' />
                </YStack>
            </View>
        )
    } else {
        if (error) {
            return <Redirect href={'/(auth)/sign-in'} />
        } else {
            if (isProfileCompleted) {
                return <Redirect href="./(tabs)/discover" />;
            } else {
                return <Redirect href="./onboard/bio-data" />
            }
        }
    }
}

export default UserDetails