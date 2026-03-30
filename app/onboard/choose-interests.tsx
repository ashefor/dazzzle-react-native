import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View, Pressable } from 'react-native'
import React, { JSX, useCallback, useEffect, useRef, useState } from 'react'
import { router } from 'expo-router'
import CustomButton from '@/components/CustomButton'
import { Interest, ReactionCodes } from '@/models/general'
import { useAppSelector } from '@/hooks/reduxHooks'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useLoader } from '@/context/loader/LoaderProvider'
import axiosRequest from '@/utils/axios'
import { defaultInterests } from '@/constants/constants'
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'
import LottieView from 'lottie-react-native'
import { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types'
import { OnboardPagesProps } from '.'

const OnboardChooseInterests: React.FC<OnboardPagesProps> = ({ onLogOut, goToNextPage }) => {
    const { show, hide } = useLoader();
    const { appConfig } = useAppSelector(state => state.app);
    const [interests, setInterests] = useState<Interest[]>(defaultInterests);
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const animationRef = useRef<LottieView>(null);
    const insets = useSafeAreaInsets();
    const [selectedInterests, setSelectedInterests] = useState<number[]>([]);

    useEffect(() => {
        if (appConfig?.interests) {
            setInterests(appConfig?.interests)
        }
    }, [appConfig])


    const chooseSelectedInterests = (interest: number) => {
        if (selectedInterests.includes(interest)) {
            setSelectedInterests(selectedInterests.filter((item) => item !== interest));
        } else {
            setSelectedInterests([...selectedInterests, interest]);
        }
    }

    const renderBackdrop = useCallback(
        (props: JSX.IntrinsicAttributes & BottomSheetDefaultBackdropProps) => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1}
                appearsOnIndex={0}
            />
        ),
        []
    );

    const completeProfileCreation = async () => {
        try {
            show();
            const data: any = await axiosRequest.post('/user-process-interest-type-update-profile', { interest: selectedInterests });
            if (data.reaction === ReactionCodes.SUCCESS) {
                bottomSheetModalRef.current?.present();
                // goToNextPage?.();
            }
            hide();
        } catch (error: any) {
            hide();
            Alert.alert('Error', error.errorMessage ? error.errorMessage : 'Failed to log in')
        }
    }


    return (
        <>
            <View className='flex-1 space-y-4'>
                <View className='px-4'>
                    <Text className='text-2xl text-black font-firabold'>Interest</Text>
                    <Text className='text-sm text-[#8C8C8C] font-firaregular'>Join our community and experience seamlessness finding a soulmate. </Text>
                </View>
                <ScrollView contentContainerStyle={{ flex: 1, flexGrow: 1, paddingHorizontal: 16, paddingBottom: insets.bottom + 20 }}>
                    {interests && interests.length > 0 && <>
                        {selectedInterests.length < 1 && <Text className='text-xs text-red-500 text-center font-firaregular mb-2'>Choose at least one interest type</Text>}
                        <View className='flex-row flex-wrap my-6'>
                            {interests.map((interest, index) => (
                                <Pressable onPress={() => chooseSelectedInterests(interest.id)} key={index} className={`rounded-lg px-4 py-2 mr-3 mb-3 ${selectedInterests.includes(interest.id) ? 'bg-primary' : 'bg-[#FCE6FD]'}`}>
                                    <Text className={`text-sm ${selectedInterests.includes(interest.id) ? 'text-white' : 'text-black'} font-firamedium`}>{interest.value}</Text>
                                </Pressable>
                            ))}
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
                style={{
                    borderRadius: 28,
                }}
                handleStyle={{
                    display: 'none',
                }}
                backgroundStyle={{
                    borderRadius: 28,
                }}
                backdropComponent={renderBackdrop}
                onDismiss={() => router.replace('/(tabs)')}
            >

                <BottomSheetView>
                    <View style={{ paddingBottom: insets.bottom + 10, paddingHorizontal: 16 }}>
                         <View className='p-5 flex-1 text-center justify-center gap-6 my-20'>
                                    <View>
                                        <View style={styles.lottieContainer}>
                                        <LottieView
                                            source={require('../../assets/heartbeat.json')}
                                            style={styles.lottie}
                                            autoPlay={true}
                                            loop={true}
                                        />
                                    </View>
                                    </View>

                                    <View>
                                        <Text className='text-2xl text-center text-primary font-firabold'>
                                            Welcome to Dazzzle ✨
                                        </Text>
                                        <Text className='text-base text-center text-black font-firaregular mt-2'>
                                            Your account is ready! Start exploring and let your light connect with someone else's. 💜
                                        </Text>
                                    </View>
                                </View>
                                <View className='p-5'>
                                    <CustomButton title='Start Exploring' handlePress={() => bottomSheetModalRef.current?.dismiss()} />
                                </View>
                    </View>
                </BottomSheetView>
            </BottomSheetModal>
        </>
    )
}

export default OnboardChooseInterests

const styles = StyleSheet.create({
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