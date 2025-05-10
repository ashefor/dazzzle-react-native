import { Alert, Image, KeyboardAvoidingView, SafeAreaView, Platform, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View, Pressable, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
// import { SafeAreaView } from 'react-native-safe-area-context'

import { Link, router } from 'expo-router'
import { useGlobalContext } from '@/context/GlobalProvider'
import Images from '@/constants/images'
import { Button, Form, H4, Spinner, YStack, Input, Label, Checkbox, XStack, Progress } from 'tamagui'
import CustomButton from '@/components/CustomButton'
import * as ImagePicker from 'expo-image-picker';
import Feather from '@expo/vector-icons/Feather'
import { useGeneralConfig } from '@/hooks/useGeneralConfig'
import { useAxiosContext } from '@/context/AxiosProvider'
import { ReactionCodes } from '@/models/general'
import Toast from '@/components/toast/toast'
import { useAppDispatch } from '@/hooks/reduxHooks'
import { signUserOut } from '@/redux/thunks/authActions'

const OnboardRelationshipType = () => {
    const dispatch = useAppDispatch();
    const { axiosRequest } = useAxiosContext();
    const [image, setImage] = useState<ImagePicker.ImagePickerAsset | undefined>(undefined);
    const [progress, setProgress] = React.useState(Math.ceil((3 / 5) * 100));
    const [selectedRelationshipTypes, setSelectedRelationshipTypes] = useState<string[]>([]);
    // const [relationshipTypes, setRelationshipTypes] = useState<string[]>(['1', '2', '3', '4', '5', '6']);

    useEffect(() => {
        setTimeout(() => {
            setProgress(Math.ceil((4 / 5) * 100))
        }, 500);
    }, [])

    const [isSubmitting, setIsSubmitting] = useState(false);

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

    const handleLogOut = async () => {
        dispatch(signUserOut()).unwrap().then(() => router.replace('/(auth)/sign-in'))
    }

    const submit = async () => {
        setIsSubmitting(true);
        try {
            const { data } = await axiosRequest.post('/user-process-relationship-type-update-profile', { relationship_type: selectedRelationshipTypes });
            if (data.reaction === ReactionCodes.SUCCESS) {
                Toast.success('Profile updated successfully');
                router.push('/onboard/choose-interests');
            }
        } catch (error: any) {
            Alert.alert('Error', error.errorMessage ? error.errorMessage : 'Failed to update')
        } finally {
            setIsSubmitting(false);
        }
    }

    const chooseRelationshipType = (type: string) => {
        if (selectedRelationshipTypes.includes(type)) {
            setSelectedRelationshipTypes(selectedRelationshipTypes.filter((item) => item !== type));
        } else {
            setSelectedRelationshipTypes([...selectedRelationshipTypes, type]);
        }
    };

    return (
        <SafeAreaView className='bg-[#1A1A1A] h-full'>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <View className='px-4'>
                    <Progress size="$3" value={progress}>
                        <Progress.Indicator backgroundColor="#DF3FE5" animation="bouncy" />
                    </Progress>
                </View>
                <View className='flex-1'>
                    <View className='p-4 flex-1 space-y-4'>
                        <YStack>
                            <Text className='text-2xl text-white font-firabold'>Relationship Type</Text>
                            <Text className='text-sm text-[#A9A9A9] font-firaregular'>Join our community and experience seamlessness finding a soulmate. </Text>
                        </YStack>
                        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }} >
                        <Text className='text-xs text-red-500 text-center font-firaregular mb-2'>Choose at least one relationship type</Text>
                            <View className='flex-wrap mb-6 flex-row gap-y-4 justify-between'>
                                <Pressable onPress={() => chooseRelationshipType('1')} className={`h-52 w-[48.5%] border rounded-[24px] p-4 flex flex-col items-center justify-center ${selectedRelationshipTypes.includes('1') ? 'bg-[#DF3FE5] border-[#DF3FE5]' : 'border-white'}`}>
                                    <Image source={Images.relType1} className='w-20 h-20 rounded-full mb-4 bg-red-500' />
                                    <Text className='text-base text-white font-firasemibold mt-2 text-center'>Fun
                                        &
                                        Friendship</Text>
                                </Pressable>
                                <Pressable onPress={() => chooseRelationshipType('2')} className={`h-52 w-[46.5%] border rounded-[24px] p-4 flex flex-col items-center justify-center ${selectedRelationshipTypes.includes('2') ? 'bg-[#DF3FE5] border-[#DF3FE5]' : 'border-white'}`}>
                                    <Image source={Images.relType2} className='w-20 h-20 rounded-full mb-4' />
                                    <Text className='text-base text-white font-firasemibold mt-2 text-center'>
                                        Serious
                                        Relationship
                                    </Text>
                                </Pressable>
                                <Pressable onPress={() => chooseRelationshipType('3')} className={`h-52 w-[46.5%] border rounded-[24px] p-4 flex flex-col items-center justify-center ${selectedRelationshipTypes.includes('3') ? 'bg-[#DF3FE5] border-[#DF3FE5]' : 'border-white'}`}>
                                    <Image source={Images.relType3} className='w-20 h-20 rounded-full mb-4' />
                                    <Text className='text-base text-white font-firasemibold mt-2 text-center'>
                                        Male
                                        Friends
                                    </Text>
                                </Pressable>
                                <Pressable onPress={() => chooseRelationshipType('4')} className={`h-52 w-[46.5%] border rounded-[24px] p-4 flex flex-col items-center justify-center ${selectedRelationshipTypes.includes('4') ? 'bg-[#DF3FE5] border-[#DF3FE5]' : 'border-white'}`}>
                                    <Image source={Images.relType4} className='w-20 h-20 rounded-full mb-4' />
                                    <Text className='text-base text-white font-firasemibold mt-2 text-center'>
                                        Female
                                        Friends
                                    </Text>
                                </Pressable>
                                <Pressable onPress={() => chooseRelationshipType('5')} className={`h-52 w-[46.5%] border rounded-[24px] p-4 flex flex-col items-center justify-center ${selectedRelationshipTypes.includes('5') ? 'bg-[#DF3FE5] border-[#DF3FE5]' : 'border-white'}`}>
                                    <Image source={Images.relType5} className='w-20 h-20 rounded-full mb-4' />
                                    <Text className='text-base text-white font-firasemibold mt-2 text-center'>
                                        Marriage Only
                                    </Text>
                                </Pressable>
                                <Pressable onPress={() => chooseRelationshipType('6')} className={`h-52 w-[46.5%] border rounded-[24px] p-4 flex flex-col items-center justify-center ${selectedRelationshipTypes.includes('6') ? 'bg-[#DF3FE5] border-[#DF3FE5]' : 'border-white'}`}>
                                    <Image source={Images.relType6} className='w-20 h-20 rounded-full mb-4' />
                                    <Text className='text-base text-white font-firasemibold mt-2 text-center'>
                                        Flirting Only
                                    </Text>
                                </Pressable>
                            </View>
                            <YStack>
                                <CustomButton disabled={selectedRelationshipTypes.length === 0} title='Next' handlePress={submit} />
                                <View className='justify-center pt-5 flex-row gap-2'>
                                    <TouchableOpacity onPress={handleLogOut}>
                                        <Text className='text-sm text-tertiary font-firaregular underline'>Log Out</Text>
                                    </TouchableOpacity>
                                </View>
                            </YStack>
                        </ScrollView>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default OnboardRelationshipType

const styles = StyleSheet.create({})