import { Image, TouchableOpacity, Text, InteractionManager } from 'react-native'
import React, { useState } from 'react'
import { YStack, XStack, View } from 'tamagui'
import Images from '@/constants/images';
import images from '@/constants/images';
import Feather from '@expo/vector-icons/Feather';
import * as ImagePicker from 'expo-image-picker';
import { SheetManager } from 'react-native-actions-sheet';

const UserPhotos = ({editable}: {editable: boolean}) => {
    const imagesMaxLength = 6;
    const [images, setImages] = useState<ImagePicker.ImagePickerAsset[] | undefined>(Array.from({ length: imagesMaxLength }));
    const [isEditing, setIsEditing] = useState(false);

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

        console.log(result);

        if (!result.canceled) {
            setImages((prevImages) => {
                const newImages = [...prevImages!];
                newImages[index] = result.assets[0];
                return newImages;
            });
        }
        } catch (error) {
            console.error('Error picking image:', error);
        }
    };

    const removePhoto = (index: number) => {
        const newImages = [...images!];
        newImages[index] = undefined as any;
        setImages(newImages);
    };

    const openActionSheet = async (index: number) => {
        const result = await SheetManager.show('user-photo-action-sheet');
    
        console.log('Action sheet result:', result); // Debugging log
    
        if (result === 'DELETE') {
            removePhoto(index);
        } else if (result === 'REPLACE') {
            console.log('Calling pickImage...'); // Debugging log
            // await pickImage(index);
            setTimeout(() => pickImage(index), 300);
            // InteractionManager.runAfterInteractions(async () => {
            //     await pickImage(index);
            // });
            console.log('pickImage finished execution'); // Debugging log
        }
    };
    

    return (
        <YStack gap="$3">
            {editable && <XStack gap="$4" justifyContent='space-between' alignItems='center'>
                <TouchableOpacity onPress={() => setIsEditing(!isEditing)} className='ml-auto p-1' activeOpacity={0.8}>
                    <XStack gap="$1" alignItems='center'>
                        <Text className='text-sm text-[#DD3FE5] font-firaregular'>{isEditing ? 'Done' : 'Edit'}</Text>
                        <Feather name={isEditing ? 'check' : 'edit'} size={16} color="#DD3FE5" />
                    </XStack>
                </TouchableOpacity>
            </XStack> }
            <XStack flexWrap="wrap" columnGap="$3" rowGap="$3">
                {images!.map((image, index) => (
                    <View className='w-[30%] h-40 rounded-2xl relative' key={index}>
                    {isEditing &&  <TouchableOpacity className='absolute -bottom-2 -right-2 p-2 bg-white z-10 w-8 h-8 rounded-full flex items-center justify-center' onPress={() => image ? openActionSheet(index) : pickImage(index)}>
                    <Feather name={image ? 'edit-3' : 'image'} size={16} color="#DD3FE5" />
                    </TouchableOpacity>}
                    
                    {image ? 
                        <Image className='w-full h-full rounded-lg' source={{ uri: image.uri }} />
                        :
                        <Image className='w-full h-full rounded-lg' source={ Images.imagePlaceholder } />}
                    </View>
                ))}
            </XStack>
        </YStack>
    )
}

export default UserPhotos