import { Alert, Image, KeyboardAvoidingView, SafeAreaView, Platform, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Link, router } from 'expo-router'
import { useGlobalContext } from '@/context/GlobalProvider'
import { YStack, Progress, ScrollView, Sheet } from 'tamagui'
import CustomButton from '@/components/CustomButton'
import { Interest, ReactionCodes } from '@/models/general'
import { useAxiosContext } from '@/context/AxiosProvider'
import Ionicons from '@expo/vector-icons/Ionicons';
import { signUserOut } from '@/redux/thunks/authActions'
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Loader } from '@/components/loader/LoaderWrapper'

const OnboardChooseInterests = () => {
    const dispatch = useAppDispatch();
    const { loading, appConfig } = useAppSelector(state => state.app);
    const { axiosRequest } = useAxiosContext();
    const { setAuthState } = useGlobalContext();
    const [progress, setProgress] = React.useState(Math.ceil((4 / 5) * 100));
    const [interests, setInterests] = useState<Interest[]>([]);
    const [hasFinished, setHasFinished] = useState(false);

    const insets = useSafeAreaInsets();

    const [selectedInterests, setSelectedInterests] = useState<number[]>([]);

    useEffect(() => {
        setTimeout(() => {
            setProgress(Math.ceil((5 / 5) * 100))
        }, 500);
    }, [])

    useEffect(() => {
        setInterests(appConfig?.interests || [])
    }, [appConfig])

    const [isSubmitting, setIsSubmitting] = useState(false)

    const chooseSelectedInterests = (interest: number) => {
        if (selectedInterests.includes(interest)) {
            setSelectedInterests(selectedInterests.filter((item) => item !== interest));
        } else {
            setSelectedInterests([...selectedInterests, interest]);
        }
    }

    const submit = async () => {
        setIsSubmitting(true);
        try {
            Loader.show();
            const { data } = await axiosRequest.post('/user-process-interest-type-update-profile', { interest: selectedInterests });
            if (data.reaction === ReactionCodes.SUCCESS) {
                // Toast.success('Profile updated successfully');
                setHasFinished(true)
                // setAuthState('completed');
                // await setItem('profileCompletion', 'completed');
                // router.replace('/(tabs)/discover');
            }
            Loader.hide();
        } catch (error: any) {
            Loader.hide();
            Alert.alert('Error', error.errorMessage ? error.errorMessage : 'Failed to log in')
        } finally {
            Loader.hide();
            setIsSubmitting(false);
        }
    }

    const handleLogOut = async () => {
        dispatch(signUserOut()).unwrap().then(() => router.replace('/(auth)/sign-in'))
    }

    const finishAndSkip = async () => {
        try {
            // const { data } = await axiosRequest.post('/get-user-auth-info');
            // if (data.reaction === ReactionCodes.SUCCESS) {
            //     Toast.success('Profile updated successfully');
            //     // setAuthState('completed');
            //     await setItem('profileCompletion', 'completed');
            //     router.replace('/(tabs)/discover');
            // }
            router.replace('/paywall');
        } catch (error) {

        }
    }


    return (
        <>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
            >
                <View style={{ paddingBottom: insets.bottom }} className='bg-[#1A1A1A] h-full'>
                    <View className='px-4'>
                        <Progress size="$3" value={progress}>
                            <Progress.Indicator backgroundColor="#DF3FE5" animation="bouncy" />
                        </Progress>
                    </View>
                    <ScrollView className='h-full'>
                        <View className='p-4 space-y-4'>
                            <YStack>
                                <Text className='text-2xl text-white font-firabold'>Interest</Text>
                                <Text className='text-sm text-[#A9A9A9] font-firaregular'>Join our community and experience seamlessness finding a soulmate. </Text>
                            </YStack>
                            <YStack>
                                {interests && interests.length > 0 && <>
                                    <Text className='text-xs text-red-500 text-center font-firaregular mb-2'>Choose at least one interest type</Text>
                                    <View className='flex-row flex-wrap my-6'>
                                        {interests.map((interest, index) => (
                                            <Pressable onPress={() => chooseSelectedInterests(interest.id)} key={index} className={`rounded-lg px-4 py-2 mr-3 mb-3 ${selectedInterests.includes(interest.id) ? 'bg-[#DF3FE5]' : 'bg-[#414141]'}`}>
                                                <Text className='text-sm text-white font-firamedium'>{interest.value}</Text>
                                            </Pressable>
                                        ))}
                                    </View>
                                    <YStack>
                                        <CustomButton disabled={selectedInterests.length === 0} title='Next' handlePress={submit} />
                                        <View className='justify-center pt-5 flex-row gap-2'>
                                            <Text className='text-sm text-white font-firaregular'>Already have an account?</Text>
                                            <Link className='text-sm text-tertiary font-firaregular underline' href='../(auth)/sign-in'>Sign In</Link>
                                        </View>
                                    </YStack>
                                </>}
                            </YStack>
                        </View>
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
            <Sheet
                forceRemoveScrollEnabled={hasFinished}
                modal={true}
                open={hasFinished}
                disableDrag={true}
                onOpenChange={setHasFinished}
                snapPointsMode={'fit'}
                dismissOnSnapToBottom
                zIndex={100_000}
                animation="medium"
            >
                <Sheet.Overlay
                    onPress={() => setHasFinished(false)}
                    animation="medium"
                    enterStyle={{ opacity: 0 }}
                    exitStyle={{ opacity: 0 }}
                />
                <Sheet.Frame paddingBottom="$2" gap="$5" backgroundColor={'#1A1A1A'}>
                    <View className='bg-[#1A1A1A] flex-row items-center p-4 pb-0 space-x-1' >
                        <TouchableOpacity onPress={() => setHasFinished(false)} className='z-10 flex items-center justify-center pr-4'>
                            <Ionicons name="close-circle" size={24} color="#ffffff" />
                        </TouchableOpacity>
                    </View>
                    <View className='px-6 pt-4 pb-10'>
                        <View className='space-y-4 text-center mb-5'>
                            <Text className='text-white text-lg font-firabold text-center'>Registration Complete!</Text>
                            <Text className='text-white text-sm font-firaregular text-center'>You have successfully completed your registration.</Text>
                        </View>
                        <CustomButton title="Finish" handlePress={finishAndSkip} />
                    </View>
                </Sheet.Frame>
            </Sheet>
        </>
    )
}

export default OnboardChooseInterests

const styles = StyleSheet.create({})