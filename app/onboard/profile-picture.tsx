import React, { memo, useCallback, useMemo, useState } from 'react'
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import CustomButton from '@/components/CustomButton'
import Toast from '@/components/toast/toast'
import { useLoader } from '@/context/loader/LoaderProvider'
import { ReactionCodes } from '@/models/general'
import axiosRequest from '@/utils/axios'
import Feather from '@expo/vector-icons/Feather'
import { Image } from 'expo-image'
import * as ImagePicker from 'expo-image-picker'
import { OnboardPagesProps } from '.'

const OnboardProfilePicture: React.FC<OnboardPagesProps> = ({ pageData, goToNextPage, onLogOut }) => {
    const { show, hide } = useLoader();
    const [image, setImage] = useState<ImagePicker.ImagePickerAsset | undefined>(undefined);

    const existingPictureUrl: string | undefined = pageData?.profile_picture_url;

    const previewSource = useMemo(
        () => (image ? { uri: image.uri } : existingPictureUrl ? { uri: existingPictureUrl } : undefined),
        [image, existingPictureUrl]
    );

    const submit = useCallback(async () => {
        try {
            if (existingPictureUrl) {
                goToNextPage?.();
                return;
            }
            if (!image) {
                Alert.alert('Error', 'Please select a profile picture')
                return;
            }
            const formData = new FormData();
            formData.append("filepond", {
                uri: image.uri,
                name: 'name' in image ? image.name : image.uri.split("/").pop() || "unknown.jpg",
                type: image.mimeType || "image/jpeg",
            } as any);
            show();
            const response: any = await axiosRequest.post('/upload-profile-image', formData, { headers: { "Content-Type": "multipart/form-data" } });
            hide();
            if (response.reaction === ReactionCodes.SUCCESS) {
                Toast.success('Profile updated successfully');
                goToNextPage?.();
            } else {
                Alert.alert('Error', response.message ? response.message : 'Unable to proceed')
            }
        } catch (error: any) {
            hide();
            Alert.alert('Error', error.errorMessage ? error.errorMessage : 'Unable to proceed with error')
        }
    }, [existingPictureUrl, image, show, hide, goToNextPage]);

    const pickImage = useCallback(async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                allowsMultipleSelection: false,
                cameraType: ImagePicker.CameraType.front,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.canceled) {
                setImage(result.assets[0]);
            }
        } catch (error) {
            console.error('Error picking image:', error);
        }
    }, []);

    const handleImageError = useCallback(() => setImage(undefined), []);

    return (
        <ScrollView className='h-full' keyboardShouldPersistTaps="handled">
            <View className='px-4 space-y-4'>
                <View>
                    <Text className='text-2xl text-black font-firabold'>Profile Picture</Text>
                    <Text className='text-sm text-[#8C8C8C] font-firaregular'>Join our community and experience seamlessness finding a soulmate. </Text>
                </View>
                <View>
                    <View>
                        <TouchableOpacity onPress={pickImage}>
                            <View className='h-56 w-56 mx-auto my-10'>
                                {image ? (
                                    <Image
                                        source={previewSource}
                                        onError={handleImageError}
                                        contentFit="cover"
                                        transition={200}
                                        style={styles.avatar}
                                    />
                                ) : (
                                    <View className='w-full h-full overflow-hidden rounded-full flex space-y-1 justify-center items-center border border-dashed border-[#DD3FE5]'>
                                        <Image
                                            source={previewSource}
                                            contentFit="cover"
                                            transition={200}
                                            style={{ width: '100%', height: '100%', borderRadius: 200 }}
                                        />
                                        <View className='absolute space-x-1 items-center'>
                                            <Feather name='image' size={32} color="#DD3FE5" />
                                            <Text className='text-sm text-black font-firamedium'>Add Profile Picture</Text>
                                        </View>
                                    </View>
                                )}
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <CustomButton title='Next' handlePress={submit} />
                        <View className='justify-center pt-5 flex-row gap-2'>
                            <TouchableOpacity onPress={onLogOut}>
                                <Text className='text-sm text-black font-firaregular underline'>Log Out</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}

export default memo(OnboardProfilePicture)

const styles = StyleSheet.create({
    avatar: {
        width: '100%',
        height: '100%',
        borderRadius: 200,
    },
})
