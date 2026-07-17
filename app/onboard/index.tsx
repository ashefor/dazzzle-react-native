import { Alert, StyleSheet, View, TouchableOpacity } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { router } from 'expo-router'
import { ReactionCodes } from '@/models/general'
import { signUserOut } from '@/redux/thunks/authActions'
import { useAppDispatch } from '@/hooks/reduxHooks'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import axiosRequest from '@/utils/axios'
import { useLoader } from '@/context/loader/LoaderProvider'
import PagerView from 'react-native-pager-view'
import OnboardBioData from './bio-data'
import OnboardProfilePicture from './profile-picture'
import OnboardLocation from './location'
import NavBar from '@/components/NavBar'
import ArrowBackIcon from '@/components/icons/ArrowBackIcon'
import OnboardRelationshipType from './relationship-type'
import OnboardChooseInterests from './choose-interests'

export interface OnboardPagesProps {
    pageData?: any,
    page?: number,
    setPage?: (page: number) => void,
    goToNextPage?: () => void,
    goToPreviousPage?: () => void,
    onLogOut?: () => void
}

const PAGE_COUNT = 5;
const PAGE_INDICATORS = Array.from({ length: PAGE_COUNT }, (_, index) => index);

const OnboardPage = () => {
    const dispatch = useAppDispatch();
    const { show, hide } = useLoader();
    const [page, setPage] = useState(0);
    const insets = useSafeAreaInsets();
    const [profileData, setProfileData] = useState<any>(null);
    const viewPager = useRef<PagerView>(null);
    // Mirrors `page` so the navigation callbacks don't depend on it and stay
    // referentially stable — the five memoised pages re-render otherwise.
    const pageRef = useRef(0);

    const fetchUserProfileUpdateStatus = useCallback(async () => {
        try {
            show();
            const response: any = await axiosRequest.get('/profile/check-profile-updated');
            hide();
            if (response.reaction === ReactionCodes.SUCCESS) {
                const profileInfo = response.data['profileInfo'];
                if (profileInfo) {
                    setProfileData(profileInfo);
                }
            }
        } catch (error: any) {
            hide();
            Alert.alert('Error', error.errorMessage ? error.errorMessage : 'Unable to fetch data')
        }
    }, [show, hide]);

    const handleLogOut = useCallback(async () => {
        show();
        await dispatch(signUserOut()).unwrap();
        hide();
        router.replace('/(auth)/sign-in');
    }, [dispatch, show, hide]);

    useEffect(() => {
        fetchUserProfileUpdateStatus();
    }, [fetchUserProfileUpdateStatus])

    const onPageSelected = useCallback(() => {
        fetchUserProfileUpdateStatus();
    }, [fetchUserProfileUpdateStatus])

    const goToNextPage = useCallback(() => {
        const nextPage = pageRef.current + 1;
        pageRef.current = nextPage;
        setPage(nextPage);
        viewPager.current?.setPage(nextPage);
    }, [])

    const goToPreviousPage = useCallback(() => {
        const previousPage = pageRef.current - 1;
        if (previousPage >= 0) {
            pageRef.current = previousPage;
            setPage(previousPage);
            viewPager.current?.setPage(previousPage);
        } else if (router.canGoBack()) {
            router.back();
        } else {
            router.replace('/(auth)/sign-in');
        }
    }, [])

    return (
        <View style={{ paddingTop: insets.top, paddingBottom: insets.bottom }} className='flex-1 bg-white h-full'>
            <View className='pb-2'>
                <NavBar leftItem={
                    <TouchableOpacity
                        activeOpacity={0.5} onPress={goToPreviousPage} className='flex items-center justify-center w-10 h-10 rounded-full border border-[#E0E0E0]'>
                        <ArrowBackIcon />
                    </TouchableOpacity>
                } />
                <View className='flex-row gap-x-2 px-4 justify-center'>
                    {PAGE_INDICATORS.map((index) => (
                        <View key={index} className={`h-2 rounded-full ${index <= page ? 'bg-primary' : 'bg-[#E0E0E0]'}`} style={{ width: `${100 / 6}%`, flexShrink: 1 }} />
                    ))}
                </View>
            </View>
            {/* Each page wrapper is explicitly flex: 1 so the screens inside resolve
                against a known height — percentage heights and ScrollView viewports
                need a resolved parent, and leaving it implicit is what makes layout
                differ across devices. */}
            <PagerView style={styles.pager} ref={viewPager} scrollEnabled={false} initialPage={page} onPageSelected={onPageSelected}>
                <View key={1} style={styles.page}>
                    <OnboardBioData pageData={profileData} goToNextPage={goToNextPage} onLogOut={handleLogOut} />
                </View>
                <View key={2} style={styles.page}>
                    <OnboardProfilePicture pageData={profileData} goToNextPage={goToNextPage} onLogOut={handleLogOut} />
                </View>
                <View key={3} style={styles.page}>
                    <OnboardLocation pageData={profileData} goToNextPage={goToNextPage} onLogOut={handleLogOut} />
                </View>
                <View key={4} style={styles.page}>
                    <OnboardRelationshipType pageData={profileData} goToNextPage={goToNextPage} onLogOut={handleLogOut} />
                </View>
                <View key={5} style={styles.page}>
                    <OnboardChooseInterests pageData={profileData} onLogOut={handleLogOut} />
                </View>
            </PagerView>
        </View>
    )
}

export default OnboardPage

const styles = StyleSheet.create({
    pager: {
        flex: 1,
    },
    page: {
        flex: 1,
    },
})
