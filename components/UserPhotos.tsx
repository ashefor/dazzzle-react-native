import { Image, TouchableOpacity, Text, View, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { YStack, XStack } from 'tamagui'
import Images from '@/constants/images';
import Feather from '@expo/vector-icons/Feather';
import * as ImagePicker from 'expo-image-picker';
import { SheetManager } from 'react-native-actions-sheet';
import axiosRequest from '@/utils/axios';
import { Loader } from './loader/LoaderWrapper';
import Toast from './toast/toast';

const UserPhotos = ({ editable, userPhotos }: { userPhotos: { image_url: string }[], editable?: boolean }) => {
    const [initialPhotos, setInitialPhotos] = useState<{ image_url: string }[]>([]);
    const [images, setImages] = useState<ImagePicker.ImagePickerAsset[]>([]);
    const [newImages, setNewImages] = useState<ImagePicker.ImagePickerAsset[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [uploadStatuses, setUploadStatuses] = useState(
        images.map((img, index) => ({
            id: index, // or a unique ID from image
            uri: img.uri,
            status: 'pending', // 'uploading' | 'success' | 'error'
            progress: 0,
        }))
    );

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

    const pickMultipleImages = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsMultipleSelection: true,
                cameraType: ImagePicker.CameraType.front,
                quality: 1,
            });
            if (result.assets && result.assets.length > 0) {
                setNewImages(result.assets);
                // setImages(prevImages => {
                //     return [...prevImages, ...result.assets];
                // });
            }
        } catch (error) {
            console.error('Error picking multiple images:', error);
        }
    };

    // const updateStatus = (id, changes) => {
    //     setUploadStatuses(prev =>
    //         prev.map(status =>
    //             status.id === id ? { ...status, ...changes } : status
    //         )
    //     );
    // };

    const uploadAllImages = async () => {
        try {
            const uploadPromises = newImages.map((image, index) => {
            const formData = new FormData();
            formData.append("filepond", {
                uri: image?.uri,
                name: 'name' in image ? image.name : image.uri.split("/").pop() || "unknown.jpg",
                type: image?.mimeType || "image/jpeg",
            } as any);

            Loader.show();
            return axiosRequest.post('/upload-photos', formData, {
                headers: { "Content-Type": "multipart/form-data" },
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round((progressEvent.loaded * 100) / (progressEvent?.total ? progressEvent?.total : 1));
                    // updateStatus(index, { progress });
                }
            })
        });

        await Promise.all(uploadPromises);
        Loader.hide();
        const new_images = [images, newImages];
        setNewImages([]);
        setImages(new_images.flat());
        Toast.success('Images uploaded successfully.');
        } catch (error) {
        Loader.hide();
        }
    };

    const cancelUpload = () => {
        setNewImages([]);
    };



    return (
        <YStack gap="$3">
            {/* {editable && <XStack gap="$1" alignItems='center'>
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
            </XStack>} */}
            {images.length > 0 ? (
                <XStack flexWrap="wrap" columnGap="$3" rowGap="$3">
                    {images && images.map((image, index) => (
                        <View className='w-[30%] h-40 rounded-2xl relative' key={index}>
                            {isEditing && <TouchableOpacity className='absolute -bottom-2 -right-2 p-2 bg-white z-10 w-8 h-8 rounded-full flex items-center justify-center' onPress={() => image ? openActionSheet(index) : pickImage(index)}>
                                <Feather name={image ? 'edit-3' : 'image'} size={16} color="#DD3FE5" />
                            </TouchableOpacity>}

                            {image?.uri ? (
                                <Image className="w-full h-full rounded-lg" source={{ uri: image.uri }} />
                            ) : (
                                <Image className="w-full h-full rounded-lg" source={Images.imagePlaceholder} />
                            )}

                        </View>
                    ))}
                    {newImages && newImages.map((image, index) => (
                        <View className='w-[30%] h-40 rounded-2xl relative' key={index}>
                            {isEditing && <TouchableOpacity className='absolute -bottom-2 -right-2 p-2 bg-white z-10 w-8 h-8 rounded-full flex items-center justify-center' onPress={() => image ? openActionSheet(index) : pickImage(index)}>
                                <Feather name={image ? 'edit-3' : 'image'} size={16} color="#DD3FE5" />
                            </TouchableOpacity>}

                            {image?.uri ? (
                                <Image className="w-full h-full rounded-lg" source={{ uri: image.uri }} />
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

            {editable && <View className='my-4 space-y-3'>
                <TouchableOpacity onPress={() => pickMultipleImages()} className='border border-[#DD3FE5] p-3 justify-center items-center rounded-md'>
                <Text className='text-[#DD3FE5]'>Add Images</Text>
            </TouchableOpacity>
            {newImages && newImages.length > 0 && <View className='flex-row justify-between items-center space-x-3'>
             <TouchableOpacity onPress={cancelUpload} className='bg-red-500 flex-1 p-3 justify-center items-center rounded-md'>
                <Text className='text-white'>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={uploadAllImages} className=' bg-[#DD3FE5] flex-1 p-3 justify-center items-center rounded-md'>
                <Text className='text-white'>Save Changes</Text>
            </TouchableOpacity>
                </View>}
            </View>}
        </YStack>
    )
}

export default UserPhotos