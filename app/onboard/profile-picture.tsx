import React, { useState } from 'react'
import { Alert, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import CustomButton from '@/components/CustomButton'
import Toast from '@/components/toast/toast'
import { useLoader } from '@/context/loader/LoaderProvider'
import { useAppDispatch } from '@/hooks/reduxHooks'
import { ReactionCodes } from '@/models/general'
import { signUserOut } from '@/redux/thunks/authActions'
import axiosRequest from '@/utils/axios'
import Feather from '@expo/vector-icons/Feather'
import * as ImagePicker from 'expo-image-picker'
import { router } from 'expo-router'
import { ScrollView, YStack } from 'tamagui'
import { OnboardPagesProps } from '.'

const OnboardProfilePicture: React.FC<OnboardPagesProps> = ({ pageData, goToNextPage }) => {
    const initialValues = {...pageData}
    const dispatch = useAppDispatch();
    const { show, hide } = useLoader();
    const [image, setImage] = useState<ImagePicker.ImagePickerAsset | undefined>(undefined);

    const handleLogOut = async () => {
        dispatch(signUserOut()).unwrap().then(() => router.replace('/(auth)/sign-in'))
    }

    const submit = async () => {
        try {
            if (initialValues && initialValues.profile_picture_url) {
                // router.push('/onboard/location');
                goToNextPage?.();
            } else {
                if (!image) {
                    Alert.alert('Error', 'Please select a profile picture')
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
                    // router.push('/onboard/location');
                    goToNextPage?.();
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
        <ScrollView className='h-full'>
            <View className='p-4 space-y-4'>
                <YStack>
                    <Text className='text-2xl text-black font-firabold'>Profile Picture</Text>
                    <Text className='text-sm text-[#8C8C8C] font-firaregular'>Join our community and experience seamlessness finding a soulmate. </Text>
                </YStack>
                <YStack>
                    <YStack>
                        <TouchableOpacity onPress={pickImage}>
                            <View className='h-56 w-56 mx-auto my-10'>
                                {image ? (
                                    <Image source={{ uri: image.uri }} onError={() => setImage(undefined)} style={{ width: '100%', height: '100%', borderRadius: 200 }} />
                                ) : (
                                    <View className='w-full h-full overflow-hidden rounded-full flex space-y-1 justify-center items-center border border-dashed border-[#DD3FE5]'>
                                        <ImageBackground source={{ uri: initialValues.profile_picture_url }} style={{ width: '100%', height: '100%', borderRadius: 200 }} />
                                        <View className='absolute space-x-1 items-center'>
                                            <Feather name='image' size={32} color="#DD3FE5" />
                                            <Text className='text-sm text-black font-firamedium'>Add Profile Picture</Text>
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
    )
}

export default OnboardProfilePicture

const styles = StyleSheet.create({})