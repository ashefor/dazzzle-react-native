import { Alert, Image, KeyboardAvoidingView, SafeAreaView, Platform, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Link, router } from 'expo-router'
import { useGlobalContext } from '@/context/GlobalProvider'
import { Button, Form, H4, Spinner, YStack, Input, Label, Checkbox, XStack, Progress, ScrollView } from 'tamagui'
import CustomButton from '@/components/CustomButton'
import { useGeneralConfig } from '@/hooks/useGeneralConfig'
import { Interest, ReactionCodes } from '@/models/general'
import { useAxiosContext } from '@/context/AxiosProvider'
import Toast from '@/components/toast/toast'

const OnboardChooseInterests = () => {
    const { axiosRequest } = useAxiosContext();
    const userInterests = useGeneralConfig()?.interests;
    const { setAuthState } = useGlobalContext();
    const [progress, setProgress] = React.useState(Math.ceil((4 / 5) * 100));
    const [interests, setInterests] = useState<Interest[]>([]);

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
                console.log('responseData interests', responseData)
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
                Toast.success('Profile updated successfully');
                setAuthState('completed');
                router.replace('/(tabs)');
            }
        } catch (error: any) {
            Alert.alert('Error', error.message ? error.message : 'Failed to log in')
        } finally {
            setIsSubmitting(false);
        }
    }


    return (
        <SafeAreaView className='bg-[#1A1A1A] h-full'>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <YStack gap="$5" className='px-4'>
                    <Progress size="$3" value={progress}>
                        <Progress.Indicator backgroundColor="#DF3FE5" animation="bouncy" />
                    </Progress>
                </YStack>
                <ScrollView className='h-full'>
                    <YStack className='p-4' gap="$5">
                        <YStack>
                            <Text className='text-2xl text-white font-firabold'>Interest</Text>
                            <Text className='text-sm text-[#A9A9A9] font-firaregular'>Join our community and experience seamlessness finding a soulmate. </Text>
                        </YStack>
                        <YStack>
                            <YStack className='flex-row flex-wrap my-6'>
                                {interests && interests.map((interest, index) => (
                                    <Pressable onPress={() => chooseSelectedInterests(interest.id)} key={index} className={`rounded-lg px-4 py-2 mr-3 mb-3 ${selectedInterests.includes(interest.id) ? 'bg-[#DF3FE5]' : 'bg-[#414141]'}`}>
                                        <Text className='text-sm text-white font-firamedium'>{interest.value}</Text>
                                    </Pressable>
                                ))}
                            </YStack>
                            <YStack>
                                <CustomButton title='Next' handlePress={submit} />
                                <View className='justify-center pt-5 flex-row gap-2'>
                                    <Text className='text-sm text-white font-firaregular'>Already have an account?</Text>
                                    <Link className='text-sm text-tertiary font-firaregular underline' href='./sign-in'>Sign In</Link>
                                </View>
                            </YStack>
                        </YStack>
                    </YStack>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default OnboardChooseInterests

const styles = StyleSheet.create({})