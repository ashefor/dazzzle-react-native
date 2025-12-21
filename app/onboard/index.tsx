import { Alert, StyleSheet, View, TouchableOpacity } from 'react-native'
import React, { Fragment, useEffect, useRef, useState } from 'react'
import { router } from 'expo-router'
import { ReactionCodes } from '@/models/general'
import { signUserOut } from '@/redux/thunks/authActions'
import { useAppDispatch } from '@/hooks/reduxHooks'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import axiosRequest from '@/utils/axios'
import { useLoader } from '@/context/loader/LoaderProvider'
import PagerView, { PagerViewOnPageSelectedEvent } from 'react-native-pager-view'
import OnboardBioData from './bio-data'
import OnboardProfilePicture from './profile-picture'
import OnboardLocation from './location'
import NavBar from '@/components/NavBar'
import ArrowBackIcon from '@/components/icons/ArrowBackIcon'
import OnboardRelationshipType from './relationship-type'
import OnboardChooseInterests from './choose-interests'
import { KeyboardAvoidingView } from "react-native-keyboard-controller"

export interface OnboardPagesProps {
    pageData?: any,
    page?: number,
    setPage?: (page: number) => void,
    goToNextPage?: () => void,
    goToPreviousPage?: () => void,
    onLogOut?: () => void
}

const OnboardPage = () => {
    const dispatch = useAppDispatch();
    const { show, hide } = useLoader();
    const [page, setPage] = useState(0);
    const insets = useSafeAreaInsets();
    const [profileData, setProfileData] = useState<any>(null);
    const viewPager = useRef<PagerView>(null);

    const fetchUserProfileUpdateStatus = async () => {
        try {
            show();
            const response: any = await axiosRequest.get('/profile/check-profile-updated');
            hide();
            const reaction = response.reaction;
            const responseData = response.data;
            if (reaction === ReactionCodes.SUCCESS) {
                const profileData = responseData['profileInfo'];
                console.log('profileData', profileData);
                if (profileData) {
                    setProfileData(profileData);
                }

            }
        } catch (error: any) {
            hide();
            Alert.alert('Error', error.errorMessage ? error.errorMessage : 'Unable to fetch data')
        }
    };

    const handleLogOut = async () => {
        show();
        await dispatch(signUserOut()).unwrap();
        hide();
        router.replace('/(auth)/sign-in');
    }

    useEffect(() => {
        fetchUserProfileUpdateStatus();
    }, [])

    const onPageSelected = (e: PagerViewOnPageSelectedEvent) => {
        fetchUserProfileUpdateStatus();
        const pageIndex = e.nativeEvent.position;
        if (pageIndex === 0) {
            // setProgress(Math.ceil((1 / 5) * 100))
        }
    }

    const goToNextPage = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        viewPager.current?.setPage(nextPage);
    }

    const goToPreviousPage = () => {
        const previousPage = page - 1;
        setPage(previousPage);
        if (previousPage >= 0) {
            viewPager.current?.setPage(previousPage);
        } else {
            router.canGoBack() ? router.back() : router.replace('/(auth)/sign-in');
        }
    }

    return (
        <Fragment>
            <View style={{ paddingTop: insets.top, paddingBottom: insets.bottom }} className='flex-1 bg-white h-full'>
                <View className='pb-2'>
                    <NavBar leftItem={
                        <TouchableOpacity
                            activeOpacity={0.5} onPress={goToPreviousPage} className='flex items-center justify-center w-10 h-10 rounded-full border border-[#E0E0E0]'>
                            <ArrowBackIcon />
                        </TouchableOpacity>
                    } />
                    <View className='flex-row gap-x-2 px-4 justify-center'>
                        {[...Array(5).fill('')].map((_, index) => (
                            <View key={index} className={`h-2 rounded-full ${index <= (page) ? 'bg-primary' : 'bg-[#E0E0E0]'}`} style={{ width: `${100 / 6}%`, flexShrink: 1 }}></View>
                        ))}
                    </View>
                </View>
                <KeyboardAvoidingView behavior={"padding"}
                     style={{ flex: 1 }}>
                    <PagerView style={{ flex: 1 }} ref={viewPager} scrollEnabled={false} initialPage={page} onPageSelected={onPageSelected}>
                        <View key={1}>
                            <OnboardBioData pageData={profileData} goToNextPage={goToNextPage} onLogOut={handleLogOut} />
                        </View>
                        <View key={2}>
                            <OnboardProfilePicture pageData={profileData} goToNextPage={goToNextPage} onLogOut={handleLogOut} />
                        </View>
                        <View key={3}>
                            <OnboardLocation pageData={profileData} goToNextPage={goToNextPage} onLogOut={handleLogOut} />
                        </View>
                        <View key={4}>
                            <OnboardRelationshipType goToNextPage={goToNextPage} onLogOut={handleLogOut} />
                        </View>
                        <View key={5}>
                            <OnboardChooseInterests onLogOut={handleLogOut} />
                        </View>
                    </PagerView>
                </KeyboardAvoidingView>
            </View>
        </Fragment>
    )
}

export default OnboardPage

const styles = StyleSheet.create({})