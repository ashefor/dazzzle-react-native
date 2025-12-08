import { useState, useCallback } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';
import { PhotoStatus } from '@/components/PhotoCell';
import axiosRequest from '@/utils/axios';

// Mock API Services
const apiUploadPhoto = async (image: ImagePicker.ImagePickerAsset, onProgress?: (progress: number) => void): Promise<string> => {
    try {
        const formData = new FormData();
        
        const uri = image.uri;
        const fileName = 'name' in image ? image.name : uri.split('/').pop() || "upload.jpg";
        
        const match = /\.(\w+)$/.exec(fileName as string);
        const type = match ? `image/${match[1]}` : `image/jpeg`;
        const fileType = image?.mimeType || "image/jpeg";
        // Infer type from extension or default to jpeg

        formData.append("filepond", {
            uri: uri,
            name: fileName,
            type: fileType,
        } as any);

        // 2. Make the request
        const response = await axiosRequest.post('/upload-photos', formData, {
            headers: { 
                "Content-Type": "multipart/form-data" 
            },
            onUploadProgress: (progressEvent) => {
                if (onProgress && progressEvent.total) {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    onProgress(percentCompleted);
                }
            }
        });

        // 3. Return the new URL from the server response
        // Adjust 'response.data.url' based on your actual API response structure
        return response.data.url || response.data; 

    } catch (error) {
        console.error("Upload failed:", error);
        throw error;
    }
};

const apiDeletePhoto = async (photoId: string) => {
    await new Promise(r => setTimeout(r, 800));
    return true;
};

// Initial State Helper
const createInitialSlots = (initialPhotos: string[]) => {
    const slots = Array(6).fill(null).map((_, index) => ({
        id: `slot-${index}`,
        status: (index < initialPhotos.length ? 'filled' : 'empty') as PhotoStatus,
        uri: initialPhotos[index] || undefined,
        progress: 0,
        error: undefined as string | undefined,
    }));
    return slots;
};

export const usePhotoManager = (initialPhotos: string[]) => {
    const [slots, setSlots] = useState(createInitialSlots(initialPhotos));

    const updateSlot = (index: number, updates: Partial<typeof slots[0]>) => {
        setSlots(prev => {
            const newSlots = [...prev];
            newSlots[index] = { ...newSlots[index], ...updates };
            return newSlots;
        });
    };

    const handleAddPhoto = useCallback(async (index: number) => {
        // 1. Pick Image
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (result.canceled) return;
        const image = result.assets[0];

        console.log('result.assets[0]', result.assets[0])
        const localUri = result.assets[0].uri;

        // 2. Set Optimistic State (Uploading)
        updateSlot(index, { status: 'uploading', uri: localUri, progress: 0, error: undefined });

        try {
            // 3. Call API
            const formData = new FormData();
                formData.append("filepond", {
                    uri: image?.uri,
                    name: 'name' in image ? image.name : image.uri.split("/").pop() || "unknown.jpg",
                    type: image?.mimeType || "image/jpeg",
                } as any);
            const remoteUrl = await apiUploadPhoto(image, (progress) => {
                updateSlot(index, { progress });
            });

            // 4. Success
            updateSlot(index, { status: 'filled', uri: remoteUrl, progress: 100 });

        } catch (error) {
            // 5. Failure
            updateSlot(index, { status: 'error', error: 'Upload failed' });
            Alert.alert("Upload Error", "Failed to upload image. Please try again.");
        }
    }, []);

    const handleRemovePhoto = useCallback(async (index: number) => {
        Alert.alert(
            "Remove Photo", 
            "Are you sure you want to delete this photo?", 
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "Delete", 
                    style: "destructive", 
                    onPress: async () => {
                        // 1. Optimistic Update (or Loading state if you prefer)
                        const previousSlot = slots[index];
                        updateSlot(index, { status: 'empty', uri: undefined }); // Clear UI immediately

                        try {
                            await apiDeletePhoto("some-photo-id");
                            // Success: Do nothing, UI is already cleared
                        } catch (error) {
                            // Revert on failure
                            updateSlot(index, previousSlot);
                            Alert.alert("Error", "Could not delete photo");
                        }
                    }
                }
            ]
        );
    }, [slots]);

    const handleRetry = useCallback((index: number) => {
        // If we have the local URI stored, we can retry uploading immediately
        const slot = slots[index];
        if (slot.uri) {
            // Restart upload process
            updateSlot(index, { status: 'uploading', progress: 0, error: undefined });
            
            // We duplicate logic here, or you can extract the upload logic to a pure function
            apiUploadPhoto(slot.uri, (p) => updateSlot(index, { progress: p }))
                .then(url => updateSlot(index, { status: 'filled', uri: url, progress: 100 }))
                .catch(() => updateSlot(index, { status: 'error' }));
        } else {
             // If no URI, just reset to empty so they can pick again
            updateSlot(index, { status: 'empty', error: undefined });
        }
    }, [slots]);

    return {
        slots,
        handleAddPhoto,
        handleRemovePhoto,
        handleRetry
    };
};