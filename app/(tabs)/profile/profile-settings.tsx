import React, { useState, useCallback, JSX, useRef, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert, StyleSheet, TextInputProps } from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import NavBar from '@/components/NavBar';
import { usePhotoManager } from '@/hooks/usePhotoManager';
import { PhotoCell } from '@/components/PhotoCell';
import axiosRequest from '@/utils/axios';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';
import { BottomSheetBackdrop, BottomSheetHandle, BottomSheetHandleProps, BottomSheetModal, BottomSheetScrollView, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import SelectPicker from '@/components/SelectPicker';
import CustomButton from '@/components/CustomButton';
import CountryCodePicker from '@/components/CountryCodePicker';
import { educationOptions, preferredLanguageOptions, relationshipStatusOptions, workStatusOptions } from '@/constants/constants';
import DateOfBirthPicker from '@/components/DateOfBirthPicker';
import { BasicAppInterface, ReactionCodes } from '@/models/general';
import { useLoader } from '@/context/loader/LoaderProvider';
import Toast from '@/components/toast/toast';
import { fetchUserProfileData } from '@/redux/thunks/userActions';
import { updateUserInfo } from '@/redux/slices/authSlice';
import { convertObjectToSelectPickerArray } from '@/utils/helpers';
import * as ImagePicker from 'expo-image-picker';
import { Skeleton } from '@/components/SkeletonLoader';
import { SingleUserDetails, UserSpecification } from '@/models/user';

type EditType = 'basic' | 'looks' | 'personality' | 'lifestyle' | 'favorites';
type BasicProfileFormData = Record<string, string | number | string[] | undefined>;
type SaveHandler<T> = (data: T) => Promise<void> | void;

const PHOTO_SKELETON_KEYS = Array.from({ length: 6 }, (_, index) => `photo-skeleton-${index}`);

const getErrorMessage = (error: unknown, fallback: string) => {
    if (typeof error === 'object' && error && 'errorMessage' in error) {
        return String(error.errorMessage);
    }
    return error instanceof Error ? error.message : fallback;
};


const PhotoGridSection = () => {
    const { slots, loading, handleAddPhoto, handleRemovePhoto, handleRetry } = usePhotoManager();

    if (loading) {
        return (
            <View>
                <Text className="font-bold text-lg px-4 py-4 text-black">Photos</Text>
                <View className="flex-row flex-wrap justify-between px-4">
                    {PHOTO_SKELETON_KEYS.map((key) => (
                        <View key={key} className="w-[31%] aspect-square mb-3 bg-gray-100 rounded-xl items-center justify-center border border-gray-200 overflow-hidden relative">
                            <Skeleton style={{ width: '100%', height: '100%', borderRadius: 12 }} />
                        </View>
                    ))}
                </View>
            </View>
        );
    }

    return (
        <View>
            <Text className="font-bold text-lg px-4 py-4 text-black">Photos</Text>

            <View className="flex-row flex-wrap justify-between px-4">
                {slots.map((slot, index) => (
                    <PhotoCell
                        index={index}
                        key={slot.id}
                        slot={slot}
                        onAdd={handleAddPhoto}
                        onRemove={handleRemovePhoto}
                        onRetry={handleRetry}
                    />
                ))}
            </View>
        </View>
    );
};

const InfoRow = React.memo(({ icon, label, value, loading }: { icon: React.ReactNode; label: string; value?: string | number, loading?: boolean }) => (
    <View className="flex-row items-center py-3 border-b border-[#F2F2F7] last:border-0">
        <View className="w-8 items-center justify-center mr-2">
            {icon}
        </View>
        <Text className="font-firamedium text-black text-xs w-1/3">{label}</Text>
        {loading ? (
            <ActivityIndicator className='ml-auto' size="small" color="#D946EF" />
        ) : (
            <Text className="flex-1 text-right text-black text-xs font-firaregular" numberOfLines={1}>{value || '-'}</Text>
        )}
    </View>
));

InfoRow.displayName = 'InfoRow';

const SectionHeader = React.memo(({ title, onEdit }: { title: string; onEdit: () => void }) => (
    <View className="flex-row justify-between items-center mb-2 mt-6 px-4">
        <Text className="text-base font-firamedium text-black">{title}</Text>
        <TouchableOpacity accessibilityLabel={`Edit ${title}`} accessibilityRole="button" hitSlop={8} onPress={onEdit} className="flex-row items-center">
            <Feather name="edit-2" size={14} color="#D946EF" />
            <Text className="text-primary font-firamedium ml-1">Edit</Text>
        </TouchableOpacity>
    </View>
));

SectionHeader.displayName = 'SectionHeader';

type CustomTextInputProps = Omit<TextInputProps, 'style'> & { label: string };

const CustomTextInput = ({ label, ...inputProps }: CustomTextInputProps) => (
    <View className="mb-5">
        <Text className="text-black text-sm font-firamedium mb-2">{label}</Text>
        <View className="bg-[#F2F2F7] text-black rounded-xl px-4 h-14 focus:border-primary border border-[#cccccc80]">
            <BottomSheetTextInput
                {...inputProps}
                accessibilityLabel={label}
                style={styles.textInput}
                autoCapitalize="none"
                importantForAutofill='no'
                placeholderTextColor={"#5B5B5B3A"}
                selectionColor={'#DD3FE5'}
            />
        </View>
    </View>
);

const EditProfileForm = ({ initialData, appConfig, isSaving, onSave }: { initialData: BasicProfileFormData; appConfig: BasicAppInterface; isSaving: boolean; onSave: SaveHandler<BasicProfileFormData> }) => {
    const insets = useSafeAreaInsets();

    // 1. Initialize state once based on props
    const [formData, setFormData] = useState<BasicProfileFormData>(initialData);

    const handleChange = useCallback((key: string, value: string | number) => {
        setFormData((previous) => ({ ...previous, [key]: value }));
    }, []);

    const handleSaveChanges = useCallback(() => onSave(formData), [formData, onSave]);
    const changeFirstName = useCallback((value: string) => handleChange('first_name', value), [handleChange]);
    const changeLastName = useCallback((value: string) => handleChange('last_name', value), [handleChange]);
    const changeCountryCode = useCallback((value: string) => handleChange('country_code', value), [handleChange]);
    const changeMobileNumber = useCallback((value: string) => handleChange('mobile_number', value), [handleChange]);
    const changeGender = useCallback((value: string) => handleChange('gender', value), [handleChange]);
    const changeBirthday = useCallback((value: string) => handleChange('birthday', value), [handleChange]);
    const changePreferredLanguage = useCallback((value: string) => handleChange('preferred_language', value), [handleChange]);
    const changeRelationshipStatus = useCallback((value: string) => handleChange('relationship_status', value), [handleChange]);
    const changeWorkStatus = useCallback((value: string) => handleChange('work_status', value), [handleChange]);
    const changeEducation = useCallback((value: string) => handleChange('education', value), [handleChange]);

    return (
        <>
            <BottomSheetScrollView className={'flex-1'} contentContainerStyle={{ padding: 16 }}>

                <CustomTextInput
                    label="First Name"
                    value={String(formData.first_name ?? '')}
                    onChangeText={changeFirstName}
                />

                <CustomTextInput
                    label="Last Name"
                    value={String(formData.last_name ?? '')}
                    onChangeText={changeLastName}
                />

                {/* Phone Number Section */}
                <View className="mb-5 space-y-2">
                    <Text className='text-base text-black font-firamedium'>Phone Number</Text>
                    <View className='border border-[#cccccc80] w-full px-4 bg-[#F2F2F7] rounded-xl items-center flex-row'>
                        <View className='flex-1 flex-row gap-x-2 h-14 items-center divide-x divide-[#ccc]'>
                            <CountryCodePicker
                                countryCode={String(formData.country_code ?? '')}
                                onCountryCodeSelect={changeCountryCode}
                            />
                            <BottomSheetTextInput
                                style={{ lineHeight: 0, height: '100%', paddingHorizontal: 16 }}
                                value={String(formData.mobile_number ?? '')}
                                accessibilityLabel="Phone number"
                                keyboardType="phone-pad"
                                onChangeText={changeMobileNumber}
                                placeholderTextColor={"#5B5B5B3A"}
                            />
                        </View>
                    </View>
                </View>

                {/* Dropdowns - update to use handleChange */}
                <View className='mb-5'>
                    <SelectPicker
                        options={appConfig?.genders!}
                        defaultOption={formData.gender as string | number | undefined}
                        title="Gender"
                        onSelectOption={changeGender}
                    />
                </View>

                <View className='mb-5'>
                    <DateOfBirthPicker dateOfBirth={String(formData.birthday ?? '')} onDateOfBirthSelected={changeBirthday} />
                </View>

                <View className='mb-5'>
                    <SelectPicker options={preferredLanguageOptions} defaultOption={formData.preferred_language as string | number | undefined} title="Preferred Language" onSelectOption={changePreferredLanguage} placeholder="Select language" />
                </View>
                <View className='mb-5'>
                    <SelectPicker options={relationshipStatusOptions} defaultOption={formData.relationship_status as string | number | undefined} title="Relationship Status" onSelectOption={changeRelationshipStatus} placeholder="Select status" />
                </View>
                <View className='mb-5'>
                    <SelectPicker options={workStatusOptions} defaultOption={formData.work_status as string | number | undefined} title="Work Status" onSelectOption={changeWorkStatus} placeholder="Select work status" />
                </View>
                <View className='mb-5'>
                    <SelectPicker options={educationOptions} defaultOption={formData.education as string | number | undefined} title="Education" onSelectOption={changeEducation} placeholder="Select education" />
                </View>
            </BottomSheetScrollView>

            {/* Fixed Bottom Button */}
            <View style={{ paddingHorizontal: 16, paddingBottom: insets.bottom + 16, paddingTop: 16, backgroundColor: 'white' }}>
                <CustomButton title='Save Changes' handlePress={handleSaveChanges} isLoading={isSaving} disabled={isSaving} />
            </View>
        </>
    );
};

const EditProfileOtherDetailsForm = ({ initialData, isSaving, onSave }: { initialData: UserSpecification; isSaving: boolean; onSave: SaveHandler<Record<string, string>> }) => {
    const insets = useSafeAreaInsets();

    // 1. Initialize state once based on props
    const [formData, setFormData] = useState<UserSpecification>(initialData);

    const handleChange = useCallback((key: string, value: string) => {
        setFormData((previous) => {
            const updatedItems = previous.items.map((item) => {
                if (item.name === key) {
                    return { ...item, selected_options: value };
                }
                return item;
            });
            return {
                ...previous,
                items: updatedItems,
                // [key]: value
            }
        })
        // setFormData((prev: any) => ({ ...prev, [key]: value }));
    }, []);

    const handleSaveChanges = useCallback(() => {
        const form = Object.fromEntries(formData.items.map((item) => [item.name, item.selected_options]));
        return onSave(form);
    }, [formData.items, onSave]);

    return (
        <>
            <BottomSheetScrollView className={'flex-1'} contentContainerStyle={{ padding: 16 }}>
                {formData.items.map((field) => {
                    if (field.input_type === 'select') {
                        return (
                            <View className="mb-5" key={field.name}>
                                <SelectPicker
                                    key={field.name}
                                    title={field.label}
                                    defaultOption={field.selected_options}
                                    onSelectOption={(val: string) => handleChange(field.name, val)}
                                    options={convertObjectToSelectPickerArray(field.options)}
                                />
                            </View>
                        );
                    } else {
                        return (
                            <CustomTextInput
                                key={field.name}
                                label={field.label}
                                value={field.selected_options}
                                onChangeText={(val: string) => handleChange(field.name, val)}
                            />
                        )
                    }
                })}
            </BottomSheetScrollView>

            {/* Fixed Bottom Button */}
            <View style={{ paddingHorizontal: 16, paddingBottom: insets.bottom + 16, paddingTop: 16, backgroundColor: 'white' }}>
                <CustomButton title='Save Changes' handlePress={handleSaveChanges} isLoading={isSaving} disabled={isSaving} />
            </View>
        </>
    );
};

export default function ProfileSettings() {
    const { userInfo, userProfileData, loadingUserProfileData } = useAppSelector(state => state.auth);
    const profile = userProfileData as SingleUserDetails | null;
    const dispatch = useAppDispatch();
    const { show, hide } = useLoader();
    const editBottomSheetModalRef = useRef<BottomSheetModal>(null);
    const editOtherFormBottomSheetModalRef = useRef<BottomSheetModal>(null);
    const { appConfig } = useAppSelector(state => state.app);
    const insets = useSafeAreaInsets();
    const [editType, setEditType] = useState<EditType | null>(null);
    const [basicDraft, setBasicDraft] = useState<BasicProfileFormData | null>(null);
    const [otherDraft, setOtherDraft] = useState<UserSpecification | null>(null);
    const [savingBasic, setSavingBasic] = useState(false);
    const [savingSpecification, setSavingSpecification] = useState(false);
    const [uploadingProfileImage, setUploadingProfileImage] = useState(false);
    const [draftRevision, setDraftRevision] = useState(0);
    const mutationInFlight = useRef(false);

    useFocusEffect(
        useCallback(() => {
            if (!profile && !loadingUserProfileData) dispatch(fetchUserProfileData());
        }, [dispatch, loadingUserProfileData, profile]),
    );

    const closeBottomSheets = useCallback(() => {
        editBottomSheetModalRef.current?.dismiss();
        editOtherFormBottomSheetModalRef.current?.dismiss();
    }, []);

    const resetDrafts = useCallback(() => {
        setEditType(null);
        setBasicDraft(null);
        setOtherDraft(null);
    }, []);


    const renderBackdrop = useCallback(
        (props: JSX.IntrinsicAttributes & BottomSheetDefaultBackdropProps) => (
            <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
        ),
        []
    );

    const renderHeaderHandle = useCallback(
        (props: BottomSheetHandleProps) => (
            <BottomSheetHandle {...props}>
                <View style={{ paddingTop: insets.top }}>
                    <NavBar leftItem={<View style={{ zIndex: 100 }}>
                        <TouchableOpacity accessibilityLabel="Close editor" accessibilityRole="button" hitSlop={8} onPress={closeBottomSheets}>
                            <Ionicons name="close-circle" size={24} color="black" />
                        </TouchableOpacity>
                    </View>} title="Edit" />
                </View>
            </BottomSheetHandle>
        ),
        [closeBottomSheets, insets.top]
    );

    const openEditBottomSheet = useCallback(() => {
        if (!profile || !appConfig) return;
        setDraftRevision((revision) => revision + 1);
        setEditType('basic');
        const mobileNumber = profile.userProfileData.mobile_number ?? '';
        setBasicDraft({
            first_name: profile.userData.first_name,
            last_name: profile.userData.last_name,
            country_code: profile.userData.country_code,
            mobile_number: mobileNumber.includes('-') ? mobileNumber.slice(mobileNumber.indexOf('-') + 1) : mobileNumber,
            birthday: profile.userProfileData.dob,
            relationship_type: profile.userProfileData.relationship_type,
            interest: profile.userProfileData.interest,
            gender: profile.userProfileData.gender,
            preferred_language: profile.userProfileData.preferred_language,
            relationship_status: profile.userProfileData.relationship_status,
            work_status: profile.userProfileData.work_status,
            education: profile.userProfileData.education,
            about_me: profile.userProfileData.aboutMe,
        });
        editBottomSheetModalRef.current?.present();
    }, [appConfig, profile]);

    const openOtherDetailsEditBottomSheet = useCallback((type: EditType) => {
        if (!profile) return;
        setDraftRevision((revision) => revision + 1);
        setEditType(type);
        setOtherDraft(profile.userSpecificationData[type]);
        editOtherFormBottomSheetModalRef.current?.present();
    }, [profile]);

    const openLooksEditor = useCallback(() => openOtherDetailsEditBottomSheet('looks'), [openOtherDetailsEditBottomSheet]);
    const openPersonalityEditor = useCallback(() => openOtherDetailsEditBottomSheet('personality'), [openOtherDetailsEditBottomSheet]);
    const openLifestyleEditor = useCallback(() => openOtherDetailsEditBottomSheet('lifestyle'), [openOtherDetailsEditBottomSheet]);
    const openFavoritesEditor = useCallback(() => openOtherDetailsEditBottomSheet('favorites'), [openOtherDetailsEditBottomSheet]);

    const updateBasicInfo = useCallback(async (params: BasicProfileFormData) => {
        if (mutationInFlight.current) return;
        mutationInFlight.current = true;
        setSavingBasic(true);
        show();
        try {
            await axiosRequest.post('/update-basic-settings', params);
            Toast.success('Profile updated successfully');
            dispatch(updateUserInfo({ full_name: `${String(params.first_name ?? '')} ${String(params.last_name ?? '')}`.trim() }));
            dispatch(fetchUserProfileData());
            editBottomSheetModalRef.current?.dismiss();
        } catch (error: unknown) {
            Alert.alert('Error', getErrorMessage(error, 'Unable to update profile.'));
        } finally {
            hide();
            setSavingBasic(false);
            mutationInFlight.current = false;
        }
    }, [dispatch, hide, show]);

    const updateSpecificationData = useCallback(async (formData: Record<string, string>) => {
        if (mutationInFlight.current) return;
        mutationInFlight.current = true;
        setSavingSpecification(true);
        show();
        try {
            await axiosRequest.post('/update-profile-settings', formData);
            Toast.success('Profile updated successfully');
            dispatch(fetchUserProfileData());
            editOtherFormBottomSheetModalRef.current?.dismiss();
        } catch (error: unknown) {
            Alert.alert('Error', getErrorMessage(error, 'Unable to update profile.'));
        } finally {
            hide();
            setSavingSpecification(false);
            mutationInFlight.current = false;
        }
    }, [dispatch, hide, show]);


    const pickImage = useCallback(async () => {
        if (uploadingProfileImage || mutationInFlight.current) return;
        let uploadStarted = false;
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                allowsMultipleSelection: false,
                aspect: [4, 3],
                quality: 0.8,
            });

            if (result.canceled || !result.assets[0]) return;
            mutationInFlight.current = true;
            uploadStarted = true;
            setUploadingProfileImage(true);
            show();
            const image = result.assets[0];
            const formData = new FormData();
            formData.append('filepond', {
                uri: image.uri,
                name: image.fileName || image.uri.split('/').pop() || 'profile.jpg',
                type: image.mimeType || 'image/jpeg',
            } as unknown as Blob);
            const data: any = await axiosRequest.post('/upload-profile-image', formData);
            if (data.reaction !== ReactionCodes.SUCCESS) throw new Error(data.message || 'Unable to update profile picture');

            const imageUrl = data.data?.image_url;
            if (imageUrl) dispatch(updateUserInfo({ profile_picture_url: imageUrl }));
            Toast.success('Profile picture updated successfully');
        } catch (error: unknown) {
            Alert.alert('Error', getErrorMessage(error, 'Unable to update profile picture.'));
        } finally {
            if (uploadStarted) {
                hide();
                setUploadingProfileImage(false);
                mutationInFlight.current = false;
            }
        }
    }, [dispatch, hide, show, uploadingProfileImage]);

    const specificationValues = profile?.formatteduserSpecificationData ?? {};
    const looks = specificationValues.looks ?? {};
    const personality = specificationValues.personality ?? {};
    const lifestyle = specificationValues.lifestyle ?? {};
    const favorites = specificationValues.favorites ?? {};
    const snapPoints = useMemo(() => ['100%'], []);

    return (
        <View className="flex-1 bg-white" style={{ paddingTop: insets.top, paddingBottom: 10 }}>
            {/* Header */}
            <NavBar title='Profile Settings' />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.pageContent}>

                <View className='items-center justify-center'>
                    <Image cachePolicy="memory-disk" contentFit="cover" source={userInfo?.profile_picture_url ? { uri: userInfo.profile_picture_url } : undefined} style={styles.profileImage} transition={150} />
                    <TouchableOpacity accessibilityLabel="Change profile picture" accessibilityRole="button" disabled={uploadingProfileImage} onPress={pickImage} className="flex-row items-center min-h-11 px-3 justify-center">
                        {uploadingProfileImage ? <ActivityIndicator size="small" color="#D946EF" /> : <Feather name="edit-2" size={14} color="#D946EF" />}
                        <Text className="text-primary font-firamedium ml-1">{uploadingProfileImage ? 'Uploading…' : 'Edit'}</Text>
                    </TouchableOpacity>
                </View>
                {/* <Text className="font-bold text-lg px-4 py-4">Photos</Text> */}
                <PhotoGridSection />

                {/* Basic Info Section */}
                <SectionHeader title="Basic information" onEdit={openEditBottomSheet} />
                <View className="bg-[#F2F2F7] mx-4 rounded-xl px-3 py-1">
                    <InfoRow icon={<Feather name="mail" size={18} color="#666" />} loading={loadingUserProfileData} label="Full Name" value={profile?.userData.fullName} />
                    <InfoRow icon={<Feather name="phone" size={18} color="#666" />} loading={loadingUserProfileData} label="Phone No." value={profile?.userProfileData.mobile_number} />
                    <InfoRow icon={<Feather name="calendar" size={18} color="#666" />} loading={loadingUserProfileData} label="Date of Birth" value={profile?.userProfileData.dob} />
                    <InfoRow icon={<MaterialCommunityIcons name="gender-male-female" size={18} color="#666" />} loading={loadingUserProfileData} label="Gender" value={profile?.userProfileData.gender_text} />
                    <InfoRow icon={<Feather name="users" size={18} color="#666" />} loading={loadingUserProfileData} label="Rel. Status" value={profile?.userProfileData.formatted_relationship_status} />
                    {/* <InfoRow icon={<Feather name="heart" size={18} color="#666" />} loading={loadingUserProfileData} label="Rel. Type" value={profile.basic.relationshipType} /> */}
                    <InfoRow icon={<Feather name="briefcase" size={18} color="#666" />} loading={loadingUserProfileData} label="Work Status" value={profile?.userProfileData.formatted_work_status} />
                </View>

                {/* Looks Section */}
                <SectionHeader title="Looks" onEdit={openLooksEditor} />
                <View className="bg-[#F2F2F7] mx-4 rounded-xl px-3 py-1">
                    <InfoRow icon={<MaterialCommunityIcons name="ruler" size={18} color="#666" />} label="Height" value={looks['Height']} />
                    <InfoRow icon={<Feather name="globe" size={18} color="#666" />} label="Ethnicity" value={looks['Ethnicity']} />
                    <InfoRow icon={<Ionicons name="body-outline" size={18} color="#666" />} label="Body Type" value={looks['Body Type']} />
                    <InfoRow icon={<MaterialCommunityIcons name="face-man-shimmer-outline" size={18} color="#666" />} label="Hair Color" value={looks['Hair Color']} />
                </View>

                {/* Personality Section */}
                <SectionHeader title="Personality" onEdit={openPersonalityEditor} />
                <View className="bg-[#F2F2F7] mx-4 rounded-xl px-3 py-1">
                    <InfoRow icon={<Feather name="smile" size={18} color="#666" />} label="Nature" value={personality['Nature']} />
                    <InfoRow icon={<Feather name="users" size={18} color="#666" />} label="Friends" value={personality['Friends']} />
                    <InfoRow icon={<MaterialCommunityIcons name="baby-carriage" size={18} color="#666" />} label="Children" value={personality['Children']} />
                    <InfoRow icon={<MaterialCommunityIcons name="paw" size={18} color="#666" />} label="Pets" value={personality['Pets']} />
                </View>

                {/* Lifestyle Section */}
                <SectionHeader title="Lifestyle" onEdit={openLifestyleEditor} />
                <View className="bg-[#F2F2F7] mx-4 rounded-xl px-3 py-1">
                    <InfoRow icon={<MaterialCommunityIcons name="book-open-page-variant" size={18} color="#666" />} label="Religion" value={lifestyle['Religion']} />
                    <InfoRow icon={<MaterialCommunityIcons name="car" size={18} color="#666" />} label="Car" value={lifestyle['Car']} />
                    <InfoRow icon={<Feather name="home" size={18} color="#666" />} label="I live with" value={lifestyle['I live with']} />
                    <InfoRow icon={<Feather name="map" size={18} color="#666" />} label="Travel" value={lifestyle['Travel']} />
                    <InfoRow icon={<MaterialCommunityIcons name="cigar" size={18} color="#666" />} label="Smoke" value={lifestyle['Smoke']} />
                    <InfoRow icon={<MaterialCommunityIcons name="glass-wine" size={18} color="#666" />} label="Drink" value={lifestyle['Drink']} />
                </View>

                <SectionHeader title="Favorites" onEdit={openFavoritesEditor} />
                <View className="bg-[#F2F2F7] mx-4 rounded-xl px-3 py-1 mb-10">
                    <InfoRow
                        icon={<Feather name="music" size={18} color="#666" />}
                        label="Music Genre"
                        value={favorites['Music Genre']}
                    />
                    <InfoRow
                        icon={<MaterialCommunityIcons name="microphone-variant" size={18} color="#666" />}
                        label="Singer"
                        value={favorites['Singer']}
                    />
                    <InfoRow
                        icon={<MaterialCommunityIcons name="music-circle-outline" size={18} color="#666" />}
                        label="Song"
                        value={favorites['Song']}
                    />
                    <InfoRow
                        icon={<Feather name="activity" size={18} color="#666" />}
                        label="Hobby"
                        value={favorites['Hobby']}
                    />
                    <InfoRow
                        icon={<MaterialIcons name="sports-basketball" size={18} color="#666" />}
                        label="Sport"
                        value={favorites['Sport']}
                    />
                    <InfoRow
                        icon={<Feather name="book-open" size={18} color="#666" />}
                        label="Book"
                        value={favorites['Book']}
                    />
                    <InfoRow
                        icon={<MaterialCommunityIcons name="food-variant" size={18} color="#666" />}
                        label="Dish"
                        value={favorites['Dish']}
                    />
                    <InfoRow
                        icon={<Ionicons name="color-palette-outline" size={18} color="#666" />}
                        label="Color"
                        value={favorites['Color']}
                    />
                    <InfoRow
                        icon={<MaterialCommunityIcons name="movie-open-outline" size={18} color="#666" />}
                        label="Movie"
                        value={favorites['Movie']}
                    />
                    <InfoRow
                        icon={<Feather name="tv" size={18} color="#666" />}
                        label="Show"
                        value={favorites['Show']}
                    />
                    <InfoRow
                        icon={<MaterialCommunityIcons name="lightbulb-on-outline" size={18} color="#666" />}
                        label="Inspired From"
                        value={favorites['Inspired From']}
                    />
                </View>

            </ScrollView>

            <BottomSheetModal
                ref={editBottomSheetModalRef}
                snapPoints={snapPoints}
                enableDynamicSizing={false}
                handleIndicatorStyle={styles.hiddenHandle}
                handleStyle={styles.sheetHandle}
                style={styles.sheet}
                backgroundStyle={styles.sheetBackground}
                backdropComponent={renderBackdrop}
                handleComponent={renderHeaderHandle}
                keyboardBehavior="interactive"
                keyboardBlurBehavior="restore"
                enableBlurKeyboardOnGesture
                onDismiss={resetDrafts}
            >
                {basicDraft && appConfig ? (
                    <EditProfileForm
                        key={`basic-${draftRevision}`}
                        initialData={basicDraft}
                        appConfig={appConfig}
                        isSaving={savingBasic}
                        onSave={updateBasicInfo}
                    />
                ) : null}
            </BottomSheetModal>
            <BottomSheetModal
                ref={editOtherFormBottomSheetModalRef}
                snapPoints={snapPoints}
                enableDynamicSizing={false}
                handleIndicatorStyle={styles.hiddenHandle}
                handleStyle={styles.sheetHandle}
                style={styles.sheet}
                backgroundStyle={styles.sheetBackground}
                backdropComponent={renderBackdrop}
                handleComponent={renderHeaderHandle}
                keyboardBehavior="interactive"
                keyboardBlurBehavior="restore"
                enableBlurKeyboardOnGesture
                onDismiss={resetDrafts}
            >
                {otherDraft && editType ? (
                    <EditProfileOtherDetailsForm
                        key={`${editType}-${draftRevision}`}
                        initialData={otherDraft}
                        isSaving={savingSpecification}
                        onSave={updateSpecificationData}
                    />
                ) : null}
            </BottomSheetModal>
        </View>
    );
}

const styles = StyleSheet.create({
    pageContent: {
        paddingBottom: 40,
    },
    profileImage: {
        width: 96,
        height: 96,
        marginVertical: 16,
        borderRadius: 48,
        backgroundColor: '#F9FAFB',
    },
    textInput: {
        height: '100%',
        color: '#000000',
    },
    hiddenHandle: {
        display: 'none',
    },
    sheetHandle: {
        padding: 0,
    },
    sheet: {
        borderRadius: 28,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 6,
    },
    sheetBackground: {
        borderRadius: 28,
    },
});
