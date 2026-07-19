import { useState, useCallback, useEffect, useRef } from 'react';
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
            uri,
            name: fileName,
            type: fileType,
        } as unknown as Blob);

        const response: any = await axiosRequest.post('/upload-photos', formData, {
            onUploadProgress: (progressEvent) => {
                if (onProgress && progressEvent.total) {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    onProgress(percentCompleted);
                }
            }
        });

        if (response.reaction === ReactionCodes.SUCCESS) {
            const {
                stored_photo } = response.data;
            return stored_photo.image_url;
        }

        // 3. Return the new URL from the server response
        // Adjust 'response.data.url' based on your actual API response structure
        throw new Error('Upload failed');

    } catch (error) {
        console.error("Upload failed:", error);
        throw error;
    }
};

const apiDeletePhoto = async (photoId: string) => axiosRequest.post(`/${photoId}/delete-photos`, {});

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
    const slotsRef = useRef(slots);
    slotsRef.current = slots;

    const updateSlot = useCallback((index: number, updates: Partial<PhotoSlot>) => {
        setSlots(prev => {
            if (!prev[index]) return prev;
            const newSlots = [...prev];
            newSlots[index] = { ...newSlots[index], ...updates };
            return newSlots;
        });
    }, []);

    const fetchPhotoGridData = useCallback(async () => {
        setLoading(true);
        try {
            const data: any = await axiosRequest.get('/uploaded-photos');
            if (data.reaction === ReactionCodes.SUCCESS) {
                const { userPhotos } = data.data;
                setSlots(createInitialSlots(userPhotos));
            }
        } catch (error) {
            console.error('Error fetching photos:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPhotoGridData();
    }, [fetchPhotoGridData]);

    const handleAddPhoto = useCallback(async (index: number) => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (result.canceled || !result.assets[0]) return;
            const image = result.assets[0];

            updateSlot(index, {
                status: 'uploading',
                uri: image.uri,
                progress: 0,
                error: undefined,
            });

            const remoteUrl = await apiUploadPhoto(image, (progress) => {
                updateSlot(index, { progress });
            });

            updateSlot(index, { status: 'filled', uri: remoteUrl, progress: 100 });
        } catch {
            updateSlot(index, { status: 'error', error: 'Upload failed' });
            Alert.alert("Upload Error", "Failed to upload image. Please try again.");
        }
    }, [updateSlot]);

    const handleRemovePhoto = useCallback((index: number) => {
        Alert.alert(
            "Remove Photo",
            "Are you sure you want to delete this photo?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        const previousSlot = slotsRef.current[index];
                        if (!previousSlot) return;

                        show();
                        try {
                            await apiDeletePhoto(previousSlot.id);
                            updateSlot(index, { status: 'empty', uri: undefined });
                        } catch {
                            // Revert on failure
                            updateSlot(index, previousSlot);
                            Alert.alert("Error", "Could not delete photo");
                        } finally {
                            hide();
                        }
                    }
                }
            ]
        );
    }, [hide, show, updateSlot]);

    const handleRetry = useCallback((index: number) => {
        // If we have the local URI stored, we can retry uploading immediately
        const slot = slotsRef.current[index];
        if (!slot) return;

        if (slot.uri) {
            // Restart upload process
            updateSlot(index, { status: 'uploading', progress: 0, error: undefined });
            const image = { uri: slot.uri } as ImagePicker.ImagePickerAsset;
            // We duplicate logic here, or you can extract the upload logic to a pure function
            apiUploadPhoto(image, (p) => updateSlot(index, { progress: p }))
                .then(url => updateSlot(index, { status: 'filled', uri: url, progress: 100 }))
                .catch(() => {
                    updateSlot(index, { status: 'error', error: 'Upload failed' });
                    Alert.alert("Upload Error", "Failed to upload image. Please try again.");
                });
        } else {
             // If no URI, just reset to empty so they can pick again
            updateSlot(index, { status: 'empty', error: undefined });
        }
    }, [updateSlot]);

    return {
        slots,
        loading,
        handleAddPhoto,
        handleRemovePhoto,
        handleRetry
    };
};
