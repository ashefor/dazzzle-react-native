import { useState, useCallback, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';
import { PhotoStatus } from '@/components/PhotoCell';
import axiosRequest from '@/utils/axios';
import { useLoader } from '@/context/loader/LoaderProvider';
import { ReactionCodes } from '@/models/general';

type PhotoSlot = {
    id: string;
    status: PhotoStatus;
    uri?: string;
    progress: number;
    error?: string;
};

type UserPhoto = {
    image_url: string;
    _id: string;
    _uid: string;
};


const apiUploadPhoto = async (image: ImagePicker.ImagePickerAsset, onProgress?: (progress: number) => void): Promise<string> => {
    try {
        const formData = new FormData();
        
        const uri = image.uri;
        const fileName = 'name' in image ? image.name : uri.split('/').pop() || "upload.jpg";
        const fileType = image?.mimeType || "image/jpeg";

        formData.append("filepond", {
            uri: uri,
            name: fileName,
            type: fileType,
        } as any);

        const response: any = await axiosRequest.post('/upload-photos', formData, {
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

        if (response.reaction == ReactionCodes.SUCCESS) {
            const {
                stored_photo } = response.data;
            return stored_photo.image_url;
        }

        // 3. Return the new URL from the server response
        // Adjust 'response.data.url' based on your actual API response structure
        return '' 

    } catch (error) {
        console.error("Upload failed:", error);
        throw error;
    }
};

const apiDeletePhoto = async (photoId: string) => {
    try {
        const response = await axiosRequest.post(`/${photoId}/delete-photos`, {});
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Initial State Helper
const createInitialSlots = (photos: UserPhoto[]) => {
    const slots = Array(6).fill(null).map((_, index) => ({
        id:  photos[index]?._uid || photos[index]?._id || `slot-${index}`,
        status: (index < photos.length ? 'filled' : 'empty') as PhotoStatus,
        uri: photos[index]?.image_url || undefined,
        progress: 0,
        error: undefined as string | undefined,
    }));
    return slots;
};

export const usePhotoManager = () => {
    const {show, hide} = useLoader();
    const [slots, setSlots] = useState<PhotoSlot[]>([]);
    const [loading, setLoading] = useState(false);

    const updateSlot = (index: number, updates: Partial<typeof slots[0]>) => {
        setSlots(prev => {
            const newSlots = [...prev];
            newSlots[index] = { ...newSlots[index], ...updates };
            return newSlots;
        });
    };

    const fetchPhotoGridData = async () => {
        try {
            setLoading(true);
            const data: any = await axiosRequest.get('/uploaded-photos');
            setLoading(false);
            if (data.reaction === ReactionCodes.SUCCESS) {
                const { userPhotos } = data.data;
                setSlots(createInitialSlots(userPhotos));
            }
        } catch (error) {
            setLoading(false);
            console.error('Error fetching photos:', error);
        }
    }

    useEffect(() => {
        fetchPhotoGridData();
    }, []);

    const handleAddPhoto = useCallback(async (index: number) => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (result.canceled) return;
        const image = result.assets[0];

        const localUri = result.assets[0].uri;

        updateSlot(index, { status: 'uploading', uri: localUri, progress: 0, error: undefined });

        try {
            const formData = new FormData();
            formData.append("filepond", {
                uri: image?.uri,
                name: 'name' in image ? image.name : image.uri.split("/").pop() || "unknown.jpg",
                type: image?.mimeType || "image/jpeg",
            } as any);
            const remoteUrl = await apiUploadPhoto(image, (progress) => {
                updateSlot(index, { progress });
            });

            updateSlot(index, { status: 'filled', uri: remoteUrl, progress: 100 });

        } catch (error) {
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
                        const previousSlot = slots[index];

                        try {
                            show();
                            await apiDeletePhoto(previousSlot.id);
                            updateSlot(index, { status: 'empty', uri: undefined });
                            hide();
                        } catch (error) {
                            // Revert on failure
                            hide();
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
            const image = { uri: slot.uri } as ImagePicker.ImagePickerAsset;
            // We duplicate logic here, or you can extract the upload logic to a pure function
            apiUploadPhoto(image, (p) => updateSlot(index, { progress: p }))
                .then(url => updateSlot(index, { status: 'filled', uri: url, progress: 100 }))
                .catch(() => updateSlot(index, { status: 'error' }));
        } else {
             // If no URI, just reset to empty so they can pick again
            updateSlot(index, { status: 'empty', error: undefined });
        }
    }, [slots]);

    return {
        slots,
        loading,
        handleAddPhoto,
        handleRemovePhoto,
        handleRetry
    };
};