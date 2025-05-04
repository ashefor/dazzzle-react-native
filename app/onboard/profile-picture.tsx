import { Alert, Image, KeyboardAvoidingView, SafeAreaView, Platform, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View, ImageBackground } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
// import { SafeAreaView } from 'react-native-safe-area-context'

import { Link, router, useFocusEffect } from 'expo-router'
import { useGlobalContext } from '@/context/GlobalProvider'
import { Button, Form, H4, Spinner, YStack, Input, Label, Checkbox, XStack, Progress, ScrollView } from 'tamagui'
import CustomButton from '@/components/CustomButton'
import * as ImagePicker from 'expo-image-picker';
import Feather from '@expo/vector-icons/Feather'
import { ReactionCodes } from '@/models/general'
import { useAxiosContext } from '@/context/AxiosProvider'
import Toast from '@/components/toast/toast'

const OnboardProfilePicture = () => {
    const { axiosRequest } = useAxiosContext();
    const [profile_picture_url, setProfilePictureUrl] = useState<string | undefined>(undefined);
    const [image, setImage] = useState<ImagePicker.ImagePickerAsset | undefined>(undefined);
    const [progress, setProgress] = React.useState(Math.ceil((1 / 5) * 100));

    useEffect(() => {
        setTimeout(() => {
            setProgress(Math.ceil((2 / 5) * 100))
        }, 500);
    }, [])


    const fetchUserProfileUpdateStatus = async () => {
        try {
            const response = await axiosRequest.get('/profile/check-profile-updated');
            const reaction = response.data.reaction;
            const responseData = response.data.data;
            if (reaction === ReactionCodes.SUCCESS) {
                const profileData = responseData['profileInfo'];
                if (profileData) {
                    if (profileData.profile_picture_url) {
                        setProfilePictureUrl(profileData.profile_picture_url);
                    }
                }
            }
        } catch (error) {
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
                console.log('This route is now unfocused.');
            };
        }, [])
    )

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
                const { data } = await axiosRequest.post('/upload-profile-image', formData, { headers: { "Content-Type": "multipart/form-data" } });
                const response = data.data;
                if (data.reaction === ReactionCodes.SUCCESS) {
                    Toast.success('Profile updated successfully');
                    router.push('/onboard/location');
                } else {
                    Alert.alert('Error', data.message ? data.message : 'Unable to proceed')
                }
            }
        } catch (error: any) {
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
                                    <Text className='text-sm text-white font-firaregular'>Already have an account?</Text>
                                    <Link className='text-sm text-tertiary font-firaregular underline' href='../(auth)/sign-in'>Sign In</Link>
                                </View>
                            </YStack>
                        </YStack>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default OnboardProfilePicture

const styles = StyleSheet.create({})