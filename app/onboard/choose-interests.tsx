import { Alert, Image, KeyboardAvoidingView, SafeAreaView, Platform, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Link, router } from 'expo-router'
import { useGlobalContext } from '@/context/GlobalProvider'
import { Button, Form, H4, Spinner, YStack, Input, Label, Checkbox, XStack, Progress, ScrollView, Sheet } from 'tamagui'
import CustomButton from '@/components/CustomButton'
import { useGeneralConfig } from '@/hooks/useGeneralConfig'
import { Interest, ReactionCodes } from '@/models/general'
import { useAxiosContext } from '@/context/AxiosProvider'
import Toast from '@/components/toast/toast'
import { setItem } from '@/utils/asyncStorage';
import Ionicons from '@expo/vector-icons/Ionicons';

const OnboardChooseInterests = () => {
    const { axiosRequest } = useAxiosContext();
    const userInterests = useGeneralConfig()?.interests;
    const { setAuthState } = useGlobalContext();
    const [progress, setProgress] = React.useState(Math.ceil((4 / 5) * 100));
    const [interests, setInterests] = useState<Interest[]>([]);
    const [hasFinished, setHasFinished] = useState(false);

    const [selectedInterests, setSelectedInterests] = useState<number[]>([]);

    useEffect(() => {
        setTimeout(() => {
            setProgress(Math.ceil((5 / 5) * 100))
        }, 500);
    }, [])

    useEffect(() => {
        setInterests(userInterests!)
    }, [userInterests])

    const [isSubmitting, setIsSubmitting] = useState(false)

    const fetchUserProfileUpdateStatus = async () => {
        try {
            const response = await axiosRequest.get('/profile/check-profile-updated');
            const reaction = response.data.reaction;
            const responseData = response.data.data;
            if (reaction === ReactionCodes.SUCCESS) {
                const profileData = responseData['profileInfo'];
                if (profileData) {

                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchUserProfileUpdateStatus()
    }, [])

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
            const { data } = await axiosRequest.post('/user-process-interest-type-update-profile', { interest: selectedInterests });
            if (data.reaction === ReactionCodes.SUCCESS) {
                // Toast.success('Profile updated successfully');
                setHasFinished(true)
                // setAuthState('completed');
                // await setItem('profileCompletion', 'completed');
                // router.replace('/(tabs)');
            }
        } catch (error: any) {
            Alert.alert('Error', error.errorMessage ? error.errorMessage : 'Failed to log in')
        } finally {
            setIsSubmitting(false);
        }
    }

    const finishAndSkip = async () => {
        try {
            const { data } = await axiosRequest.post('/get-user-auth-info');
            console.log(data);
            // if (data.reaction === ReactionCodes.SUCCESS) {
            //     Toast.success('Profile updated successfully');
            //     // setAuthState('completed');
            //     await setItem('profileCompletion', 'completed');
            //     router.replace('/(tabs)');
            // }
        } catch (error) {

        }
    }


    return (
        <>
            <SafeAreaView className='bg-[#1A1A1A] h-full'>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
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
                </KeyboardAvoidingView>
            </SafeAreaView>
            <Sheet
                forceRemoveScrollEnabled={hasFinished}
                modal={true}
                open={hasFinished}
                disableDrag={true}
                onOpenChange={setHasFinished}
                snapPointsMode={'fit'}
                dismissOnSnapToBottom
                zIndex={100_000}
                animation="quicker"
            >
                <Sheet.Overlay
                    onPress={() => setHasFinished(false)}
                    animation="quicker"
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