import { Alert, Image, KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, View, ImageBackground } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'

import { router, useFocusEffect } from 'expo-router'
import {  YStack, Progress, ScrollView } from 'tamagui'
import CustomButton from '@/components/CustomButton'
import * as ImagePicker from 'expo-image-picker';
import Feather from '@expo/vector-icons/Feather'
import { ReactionCodes } from '@/models/general'
import Toast from '@/components/toast/toast'
import { useAppDispatch } from '@/hooks/reduxHooks'
import { signUserOut } from '@/redux/thunks/authActions'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import axiosRequest from '@/utils/axios'
import { useLoader } from '@/context/loader/LoaderProvider'

const OnboardProfilePicture = () => {
    const dispatch = useAppDispatch();
    const { show, hide } = useLoader();
    const [profile_picture_url, setProfilePictureUrl] = useState<string | undefined>(undefined);
    const [image, setImage] = useState<ImagePicker.ImagePickerAsset | undefined>(undefined);
    const [progress, setProgress] = React.useState(Math.ceil((1 / 5) * 100));
    const insets = useSafeAreaInsets();

    useEffect(() => {
        setTimeout(() => {
            setProgress(Math.ceil((2 / 5) * 100))
        }, 500);
    }, [])


    const fetchUserProfileUpdateStatus = async () => {
        try {
            show();
            const response: any = await axiosRequest.get('/profile/check-profile-updated');
            hide();
            const reaction = response.reaction;
            const responseData = response.data;
            if (reaction === ReactionCodes.SUCCESS) {
                const profileData = responseData['profileInfo'];
                if (profileData) {
                    if (profileData.profile_picture_url) {
                        setProfilePictureUrl(profileData.profile_picture_url);
                    }
                }
            }
        } catch (error) {
            hide();
            console.error('Error fetching data:', error);
        }
    };

    useFocusEffect(
        // Callback should be wrapped in `React.useCallback` to avoid running the effect too often.
        useCallback(() => {
            setProgress(Math.ceil((2 / 5) * 100))
            // Invoked whenever the route is focused.
            fetchUserProfileUpdateStatus();

            // Return function is invoked whenever the route gets out of focus.
            return () => {
            };
        }, [])
    )

    const handleLogOut = async () => {
        dispatch(signUserOut()).unwrap().then(() => router.replace('/(auth)/sign-in'))
    }

    const submit = async () => {
        try {
            if (profile_picture_url) {
                router.push('/onboard/location');
            } else {
                if (!image) {
                    return;
                }
                const formData = new FormData();
                formData.append("filepond", {
                    uri: image?.uri,
                    name: 'name' in image ? image.name : image.uri.split("/").pop() || "unknown.jpg",
                    type: image?.mimeType || "image/jpeg",
                } as any);
                show();
                const response: any = await axiosRequest.post('/upload-profile-image', formData, { headers: { "Content-Type": "multipart/form-data" } });
                hide();
                if (response.reaction === ReactionCodes.SUCCESS) {
                    Toast.success('Profile updated successfully');
                    router.push('/onboard/location');
                } else {
                    Alert.alert('Error', response.message ? response.message : 'Unable to proceed')
                }
            }
        } catch (error: any) {
            hide();
            Alert.alert('Error', error.errorMessage ? error.errorMessage : 'Unable to proceed with error')
        }
    }

    const pickImage = async () => {
        try {
            // No permissions request is necessary for launching the image library
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                allowsMultipleSelection: false,
                cameraType: ImagePicker.CameraType.front,
                aspect: [4, 3],
                quality: 1,
                base64: true
            });

            if (!result.canceled) {
                setImage(result.assets[0]);
            }
        } catch (error) {
            console.error('Error picking image:', error);
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }} keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
            <View style={{ paddingBottom: insets.bottom }} className='bg-[#1A1A1A] h-full'>
                <View className='px-4'>
                    <Progress size="$3" value={progress}>
                        <Progress.Indicator backgroundColor="#DF3FE5" animation="bouncy" />
                    </Progress>
                </View>
                <ScrollView className='h-full'>
                    <View className='p-4 space-y-4'>
                        <YStack>
                            <Text className='text-2xl text-white font-firabold'>Profile Picture</Text>
                            <Text className='text-sm text-[#A9A9A9] font-firaregular'>Join our community and experience seamlessness finding a soulmate. </Text>
                        </YStack>
                        <YStack>
                            <YStack>
                                <TouchableOpacity onPress={pickImage}>
                                    <View className='h-56 w-56 mx-auto my-10'>
                                        {image ? (
                                            <Image source={{ uri: image.uri }} onError={() => setImage(undefined)} style={{ width: '100%', height: '100%', borderRadius: 200 }} />
                                        ) : (
                                            <View className='w-full h-full overflow-hidden rounded-full flex space-y-1 justify-center items-center border border-dashed border-[#DD3FE5]'>
                                                <ImageBackground source={{ uri: profile_picture_url }} style={{ width: '100%', height: '100%', borderRadius: 200 }} />
                                                <View className='absolute space-x-1 items-center'>
                                                    <Feather name='image' size={32} color="#DD3FE5" />
                                                    <Text className='text-sm text-white font-firamedium'>Add Profile Picture</Text>
                                                </View>
                                            </View>
                                        )
                                        }
                                    </View>
                                </TouchableOpacity>
                            </YStack>
                            <YStack>
                                <CustomButton title='Next' handlePress={submit} />
                                <View className='justify-center pt-5 flex-row gap-2'>
                                    <TouchableOpacity onPress={() => handleLogOut()}>
                                        <Text className='text-sm text-tertiary font-firaregular underline'>Log Out</Text>
                                    </TouchableOpacity>
                                </View>
                            </YStack>
                        </YStack>
                    </View>
                </ScrollView>
            </View>
        </KeyboardAvoidingView>
    )
}

export default OnboardProfilePicture

const styles = StyleSheet.create({})