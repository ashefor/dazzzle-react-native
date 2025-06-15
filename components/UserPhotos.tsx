import { Image, TouchableOpacity, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { YStack, XStack } from 'tamagui'
import Images from '@/constants/images';
import Feather from '@expo/vector-icons/Feather';
import * as ImagePicker from 'expo-image-picker';
import { SheetManager } from 'react-native-actions-sheet';

const UserPhotos = ({ editable, userPhotos }: { userPhotos: { image_url: string }[], editable?: boolean }) => {
    const [initialPhotos, setInitialPhotos] = useState<{ image_url: string }[]>([]);
    const [images, setImages] = useState<ImagePicker.ImagePickerAsset[]>([]);
    const [isEditing, setIsEditing] = useState(false);

    // useEffect(() => {
    //     if (userPhotos.length > 0) {
    //         setImages(userPhotos);
    //     }
    //     console.log('userPhotos', userPhotos);
    // }, [userPhotos]);

    useEffect(() => {
        if (userPhotos && userPhotos.length > 0) {
            setInitialPhotos(userPhotos);
            // Convert userPhotos to ImagePicker.ImagePickerAsset format
            const convertedImages = userPhotos.map(photo => ({
                uri: photo.image_url,
                width: 200,  // Set default width (you can adjust as needed)
                height: 200, // Set default height (you can adjust as needed)
            }));
            setImages(convertedImages);
        }
    }, [userPhotos]);

    const pickImage = async (index: number) => {
        try {
            // No permissions request is necessary for launching the image library
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                allowsMultipleSelection: false,
                cameraType: ImagePicker.CameraType.front,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.canceled) {
                setImages((prevImages): ImagePicker.ImagePickerAsset[] => {
                    const newImages = [...prevImages!];
                    newImages[index] = result.assets[0];
                    return newImages as ImagePicker.ImagePickerAsset[];
                });
            }
        } catch (error) {
            console.error('Error picking image:', error);
        }
    };

    const removePhoto = (index: number) => {
        const newImages = [...images!];
        newImages[index] = { uri: "", width: 200, height: 200 }; // Remove the photo by setting an empty value
        setImages(newImages);
    };

    const openActionSheet = async (index: number) => {
        const result = await SheetManager.show('user-photo-action-sheet');

        if (result === 'DELETE') {
            removePhoto(index);
        } else if (result === 'REPLACE') {
            console.log('Calling pickImage...'); // Debugging log
            setTimeout(() => pickImage(index), 300);
            console.log('pickImage finished execution'); // Debugging log
        }
    };

    const cancelEdit = () => {
        // Revert the images back to the initial state (before editing)
        const revertedImages = initialPhotos.map(photo => ({
            uri: photo.image_url,
            width: 200,  // Set default width (you can adjust as needed)
            height: 200, // Set default height (you can adjust as needed)
        }));
        setImages(revertedImages);
        setIsEditing(false);
    };


    return (
        <YStack gap="$3">
            {editable && <XStack gap="$1" alignItems='center'>
                <TouchableOpacity onPress={() => setIsEditing(!isEditing)} className='ml-auto p-1' activeOpacity={0.8}>
                    <XStack gap="$1" alignItems='center'>
                        <Text className='text-sm text-[#DD3FE5] font-firaregular'>{isEditing ? 'Done' : 'Edit'}</Text>
                        <Feather name={isEditing ? 'check' : 'edit'} size={16} color="#DD3FE5" />
                    </XStack>
                </TouchableOpacity>
                {isEditing && <TouchableOpacity onPress={cancelEdit} className='p-1' activeOpacity={0.8}>
                    <XStack gap="$1" alignItems='center'>
                        <Text className='text-sm text-[#DD3FE5] font-firaregular'>Cancel</Text>
                        <Feather name={isEditing ? 'x' : 'edit'} size={16} color="#DD3FE5" />
                    </XStack>
                </TouchableOpacity>}
            </XStack>}
            {images.length > 0 ? (
                <XStack flexWrap="wrap" columnGap="$3" rowGap="$3">
                    {images && images.map((image, index) => (
                        <View className='w-[30%] h-40 rounded-2xl relative' key={index}>
                            {isEditing && <TouchableOpacity className='absolute -bottom-2 -right-2 p-2 bg-white z-10 w-8 h-8 rounded-full flex items-center justify-center' onPress={() => image ? openActionSheet(index) : pickImage(index)}>
                                <Feather name={image ? 'edit-3' : 'image'} size={16} color="#DD3FE5" />
                            </TouchableOpacity>}

                            {image?.uri ? (
                                <Image className="w-full h-full border border-[#DD3FE5] rounded-lg" source={{ uri: image.uri }} />
                            ) : (
                                <Image className="w-full h-full rounded-lg" source={Images.imagePlaceholder} />
                            )}

                        </View>
                    ))}
                </XStack>
            ) : (
                <View className='my-4'>
                    <View className='p-4 text-center bg-[#ccc] justify-center items-center rounded-md'>
                        <Text className='text-sm font-firamedium'>No photos</Text>
                        {/* <Pressable onPress={() => pickImage(0)}>
                            <Text>Add</Text>
                        </Pressable> */}
                    </View>
                </View>
            )}
        </YStack>
    )
}

export default UserPhotos