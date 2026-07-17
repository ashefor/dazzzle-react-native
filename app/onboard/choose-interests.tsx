import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View, Pressable } from 'react-native'
import React, { JSX, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { router } from 'expo-router'
import CustomButton from '@/components/CustomButton'
import { ReactionCodes } from '@/models/general'
import { useAppSelector } from '@/hooks/reduxHooks'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useLoader } from '@/context/loader/LoaderProvider'
import axiosRequest from '@/utils/axios'
import { defaultInterests } from '@/constants/constants'
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'
import LottieView from 'lottie-react-native'
import { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types'
import { OnboardPagesProps } from '.'

const renderBackdrop = (props: JSX.IntrinsicAttributes & BottomSheetDefaultBackdropProps) => (
    <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
);

const heartbeatAnimation = require('../../assets/heartbeat.json');

const OnboardChooseInterests: React.FC<OnboardPagesProps> = ({ pageData, onLogOut }) => {
    const { show, hide } = useLoader();
    const appConfigInterests = useAppSelector(state => state.app.appConfig?.interests);
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const insets = useSafeAreaInsets();
    const [selectedInterests, setSelectedInterests] = useState<number[]>([]);
    // Hydrate saved interests once — see the note in relationship-type.tsx: the
    // parent refetches the profile on every page change, so keying this on
    // `pageData` would clobber in-progress selections.
    const hydratedRef = useRef(false);

    useEffect(() => {
        if (hydratedRef.current) return;
        const saved = pageData?.interest;
        if (Array.isArray(saved)) {
            hydratedRef.current = true;
            // Interest ids are numeric locally but come back as strings from the API.
            setSelectedInterests(saved.reduce<number[]>((ids, raw) => {
                const id = Number(raw);
                if (!Number.isNaN(id)) ids.push(id);
                return ids;
            }, []));
        }
    }, [pageData]);

    const interests = useMemo(
        () => appConfigInterests ?? defaultInterests,
        [appConfigInterests]
    );

    // O(1) membership per row instead of scanning the array once per interest.
    const selectedInterestIds = useMemo(() => new Set(selectedInterests), [selectedInterests]);

    const chooseSelectedInterests = useCallback((interest: number) => {
        setSelectedInterests((current) =>
            current.includes(interest) ? current.filter((item) => item !== interest) : [...current, interest]
        );
    }, []);

    const completeProfileCreation = useCallback(async () => {
        try {
            show();
            const data: any = await axiosRequest.post('/user-process-interest-type-update-profile', { interest: selectedInterests });
            if (data.reaction === ReactionCodes.SUCCESS) {
                bottomSheetModalRef.current?.present();
            }
            hide();
        } catch (error: any) {
            hide();
            Alert.alert('Error', error.errorMessage ? error.errorMessage : 'Failed to log in')
        }
    }, [selectedInterests, show, hide]);

    const dismissSheet = useCallback(() => bottomSheetModalRef.current?.dismiss(), []);
    const handleSheetDismiss = useCallback(() => router.replace('/paywall'), []);

    return (
        <>
            <View className='flex-1 space-y-4'>
                <View className='px-4 pb-2'>
                    <Text className='text-2xl text-black font-firabold'>Interest</Text>
                    <Text className='text-sm text-[#8C8C8C] font-firaregular'>Join our community and experience seamlessness finding a soulmate. </Text>
                </View>
                {/* flex-1 constrains the scroll viewport; contentContainerStyle uses
                    flexGrow (never flex/flexShrink, which would clamp content to the
                    viewport and silently disable scrolling on shorter screens). */}
                <ScrollView
                    className='flex-1'
                    contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 16, paddingBottom: 20 }}
                >
                    {interests.length > 0 && <>
                        {selectedInterests.length < 1 && <Text className='text-xs text-red-500 text-center font-firaregular mb-2'>Choose at least one interest type</Text>}
                        <View className='flex-row flex-wrap my-6'>
                            {interests.map((interest) => {
                                const isSelected = selectedInterestIds.has(interest.id);

                                return (
                                    <Pressable
                                        key={interest.id}
                                        onPress={() => chooseSelectedInterests(interest.id)}
                                        className={`rounded-lg px-4 py-2 mr-3 mb-3 ${isSelected ? 'bg-primary' : 'bg-[#FCE6FD]'}`}
                                    >
                                        <Text className={`text-sm ${isSelected ? 'text-white' : 'text-black'} font-firamedium`}>{interest.value}</Text>
                                    </Pressable>
                                );
                            })}
                        </View>
                        <View className='mt-auto'>
                            <CustomButton disabled={selectedInterests.length === 0} title='Next' handlePress={completeProfileCreation} />
                            <View className='justify-center pt-5 flex-row gap-2'>
                                <TouchableOpacity onPress={onLogOut}>
                                    <Text className='text-sm text-black font-firaregular underline'>Log Out</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </>}
                </ScrollView>
            </View>
            <BottomSheetModal
                ref={bottomSheetModalRef}
                enableDynamicSizing
                enablePanDownToClose={true}
                style={styles.sheet}
                handleStyle={styles.sheetHandle}
                backgroundStyle={styles.sheet}
                backdropComponent={renderBackdrop}
                onDismiss={handleSheetDismiss}
            >
                <BottomSheetView>
                    {/* The sheet is portalled outside the onboarding container's
                        safe-area padding, so it applies the bottom inset itself. */}
                    <View style={{ paddingBottom: insets.bottom + 10, paddingHorizontal: 16 }}>
                        <View className='p-5 flex-1 text-center justify-center gap-6 my-20'>
                            <View>
                                <View style={styles.lottieContainer}>
                                    <LottieView
                                        source={heartbeatAnimation}
                                        style={styles.lottie}
                                        autoPlay
                                        loop
                                    />
                                </View>
                            </View>

                            <View>
                                <Text className='text-2xl text-center text-primary font-firabold'>
                                    Welcome to Dazzzle ✨
                                </Text>
                                <Text className='text-base text-center text-black font-firaregular mt-2'>
                                    Your account is ready! Start exploring and let your light connect with someone else&apos;s. 💜
                                </Text>
                            </View>
                        </View>
                        <View className='p-5'>
                            <CustomButton title='Start Exploring' handlePress={dismissSheet} />
                        </View>
                    </View>
                </BottomSheetView>
            </BottomSheetModal>
        </>
    )
}

export default memo(OnboardChooseInterests)

const styles = StyleSheet.create({
    sheet: {
        borderRadius: 28,
    },
    sheetHandle: {
        display: 'none',
    },
    lottieContainer: {
        width: 120,
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 'auto'
    },
    lottie: {
        width: '100%',
        height: '100%',
    },
})
