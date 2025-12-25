import React, { useState, useCallback, JSX, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
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

type EditType = 'basic' | 'looks' | 'personality' | 'lifestyle' | 'favorites';


const PhotoGridSection = () => {
    const { slots, loading, handleAddPhoto, handleRemovePhoto, handleRetry } = usePhotoManager();

    if (loading) {
        return (
            <View>
                <Text className="font-bold text-lg px-4 py-4 text-black">Photos</Text>
                <View className="flex-row flex-wrap justify-between px-4">
                    {Array(6).fill(0).map(() => (
                        <View key={Math.random()} className="w-[31%] aspect-square mb-3 bg-gray-100 rounded-xl items-center justify-center border border-gray-200 overflow-hidden relative">
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
                        key={slot.id}
                        slot={slot}
                        onAdd={() => handleAddPhoto(index)}
                        onRemove={() => handleRemovePhoto(index)}
                        onRetry={() => handleRetry(index)}
                    />
                ))}
            </View>
        </View>
    );
};

const InfoRow = React.memo(({ icon, label, value, loading }: { icon: any; label: string; value: string, loading?: boolean }) => (
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

const SectionHeader = ({ title, onEdit }: { title: string; onEdit: () => void }) => (
    <View className="flex-row justify-between items-center mb-2 mt-6 px-4">
        <Text className="text-base font-firamedium text-black">{title}</Text>
        <TouchableOpacity onPress={onEdit} className="flex-row items-center">
            <Feather name="edit-2" size={14} color="#D946EF" />
            <Text className="text-primary font-firamedium ml-1">Edit</Text>
        </TouchableOpacity>
    </View>
);

const CustomTextInput = ({ label, value, onChange, keyboardType = 'default' }: any) => (
    <View className="mb-5">
        <Text className="text-black text-sm font-firamedium mb-2">{label}</Text>
        <View className="bg-[#F2F2F7] text-black rounded-xl px-4 h-14 focus:border-primary border border-[#cccccc80]">
            <BottomSheetTextInput
                value={value}
                style={{ height: '100%', color: 'black' }}
                onChangeText={onChange}
                keyboardType={keyboardType}
                autoCapitalize="none"
                importantForAutofill='no'
                placeholderTextColor={"#5B5B5B3A"}
                selectionColor={'#DD3FE5'}
            />
        </View>
    </View>
);

const EditProfileForm = ({ initialData, appConfig, onSave }: { initialData: { [key: string]: any }; appConfig: BasicAppInterface; onSave: (data: any) => void }) => {
    const insets = useSafeAreaInsets();

    // 1. Initialize state once based on props
    const [formData, setFormData] = useState(initialData || {});

    const handleChange = useCallback((key: string, value: string) => {
        setFormData((prev: any) => ({ ...prev, [key]: value }));
    }, []);

    const handleSaveChanges = () => {
        onSave(formData);
    };

    return (
        <>
            <BottomSheetScrollView className={'flex-1'} contentContainerStyle={{ padding: 16 }}>

                <CustomTextInput
                    label="First Name"
                    value={formData?.first_name}
                    onChange={(val: string) => handleChange('first_name', val)}
                />

                <CustomTextInput
                    label="Last Name"
                    value={formData?.last_name}
                    onChange={(val: string) => handleChange('last_name', val)}
                />

                {/* Phone Number Section */}
                <View className="mb-5 space-y-2">
                    <Text className='text-base text-black font-firamedium'>Phone Number</Text>
                    <View className='border border-[#cccccc80] w-full px-4 bg-[#F2F2F7] rounded-xl items-center flex-row'>
                        <View className='flex-1 flex-row gap-x-2 h-14 items-center divide-x divide-[#ccc]'>
                            <CountryCodePicker
                                countryCode={formData?.country_code}
                                onCountryCodeSelect={(c) => handleChange('country_code', c)}
                            />
                            <BottomSheetTextInput
                                style={{ lineHeight: 0, height: '100%', paddingHorizontal: 16 }}
                                value={formData?.mobile_number}
                                onChangeText={(val) => handleChange('mobile_number', val)}
                                placeholderTextColor={"#5B5B5B3A"}
                            />
                        </View>
                    </View>
                </View>

                {/* Dropdowns - update to use handleChange */}
                <View className='mb-5'>
                    <SelectPicker
                        options={appConfig?.genders!}
                        defaultOption={formData?.gender}
                        title="Gender"
                        onSelectOption={(val) => handleChange('gender', val)}
                    />
                </View>

                <View className='mb-5'>
                    <DateOfBirthPicker dateOfBirth={formData.birthday} onDateOfBirthSelected={useCallback((val) => handleChange('birthday', val), [handleChange])} />
                </View>

                <View className='mb-5'>
                    <SelectPicker options={preferredLanguageOptions} defaultOption={formData.preferred_language} title="Preferred Language" onSelectOption={useCallback((val) => handleChange('preferred_language', val), [handleChange])} placeholder={""} />
                </View>
                <View className='mb-5'>
                    <SelectPicker options={relationshipStatusOptions} defaultOption={formData.relationship_status} title="Relationship Status" onSelectOption={useCallback((val) => handleChange('relationship_status', val), [handleChange])} placeholder={""} />
                </View>
                <View className='mb-5'>
                    <SelectPicker options={workStatusOptions} defaultOption={formData.work_status} title="Work Status" onSelectOption={useCallback((val) => handleChange('work_status', val), [handleChange])} placeholder={""} />
                </View>
                <View className='mb-5'>
                    <SelectPicker options={educationOptions} defaultOption={formData.education} title="Education" onSelectOption={useCallback((val) => handleChange('education', val), [handleChange])} placeholder={""} />
                </View>
            </BottomSheetScrollView>

            {/* Fixed Bottom Button */}
            <View style={{ paddingHorizontal: 16, paddingBottom: insets.bottom + 16, paddingTop: 16, backgroundColor: 'white' }}>
                <CustomButton title='Save Changes' handlePress={handleSaveChanges} />
            </View>
        </>
    );
};

const EditProfileOtherDetailsForm = ({ initialData, onSave }: { initialData: { [key: string]: any }; onSave: (data: any) => void }) => {
    const insets = useSafeAreaInsets();

    // 1. Initialize state once based on props
    const [formData, setFormData] = useState(initialData || {});

    const handleChange = useCallback((key: string, value: string) => {
        setFormData((prev: any) => {
            const updatedItems = prev.items.map((item: any) => {
                if (item.name === key) {
                    return { ...item, selected_options: value };
                }
                return item;
            });
            return {
                ...prev,
                items: updatedItems,
                // [key]: value
            }
        })
        // setFormData((prev: any) => ({ ...prev, [key]: value }));
    }, []);

    const handleSaveChanges = () => {
        const formItems = formData.items.map((item: { name: any; selected_options: any; }) => {
            return {
                [item.name]: item.selected_options,
            }
        })
        const form = formItems.reduce((acc: { [x: string]: any; }, item: { [x: string]: any; }) => {
            const key = Object.keys(item)[0];
            acc[key] = item[key];
            return acc;
        }, {});
        onSave(form);
    };

    return (
        <>
            <BottomSheetScrollView className={'flex-1'} contentContainerStyle={{ padding: 16 }}>
                {formData.items.map((field: any) => {
                    <Text>{field.input_type}</Text>
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
                                onChange={(val: string) => handleChange(field.name, val)}
                            />
                        )
                    }
                })}
            </BottomSheetScrollView>

            {/* Fixed Bottom Button */}
            <View style={{ paddingHorizontal: 16, paddingBottom: insets.bottom + 16, paddingTop: 16, backgroundColor: 'white' }}>
                <CustomButton title='Save Changes' handlePress={handleSaveChanges} />
            </View>
        </>
    );
};

export default function ProfileSettings() {
    const { userInfo, userProfileData, loadingUserProfileData } = useAppSelector(state => state.auth);
    const dispatch = useAppDispatch();
    const { show, hide } = useLoader();
    const isFocused = useIsFocused(); // Trigger refetch when returning from Edit screen
    const editBottomSheetModalRef = useRef<BottomSheetModal>(null);
    const editOtherFormBottomSheetModalRef = useRef<BottomSheetModal>(null);
    const notificationSettingsBottomSheetModalRef = useRef<BottomSheetModal>(null);
    const { appConfig } = useAppSelector(state => state.app);
    const insets = useSafeAreaInsets();
    const [editType, setEditType] = useState<EditType | null>('basic');


    const renderBackdrop = useCallback(
        (props: JSX.IntrinsicAttributes & BottomSheetDefaultBackdropProps) => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1}
                appearsOnIndex={0}
            // onPress={handleBlur}
            />
        ),
        []
    );

    const renderHeaderHandle = useCallback(
        (props: BottomSheetHandleProps) => (
            <BottomSheetHandle
                {...props}
            >
                <View style={{ paddingTop: insets.top }}>
                    <NavBar leftItem={<View style={{ zIndex: 100 }}>
                        <TouchableOpacity onPress={closeBottomSheets} style={{

                        }}>
                            <Ionicons name="close-circle" size={24} color="black" />
                        </TouchableOpacity>
                    </View>} title="Edit" />
                </View>
            </BottomSheetHandle>
        ),
        []
    );

    const closeBottomSheets = () => {
        editBottomSheetModalRef.current?.dismiss();
        editOtherFormBottomSheetModalRef.current?.dismiss();
        notificationSettingsBottomSheetModalRef.current?.dismiss();
        setEditType(null);
    }

    const openEditBottomSheet = () => {
        setEditType('basic');
        const mobile_number = userProfileData?.userProfileData.mobile_number.split('-')[1] ? userProfileData?.userProfileData.mobile_number.split('-')[1] : userProfileData?.userProfileData.mobile_number;
        const profileData = {
            first_name: userProfileData?.userData.first_name,
            last_name: userProfileData?.userData.last_name,
            country_code: userProfileData?.userData.country_code,
            mobile_number: mobile_number,
            birthday: userProfileData?.userProfileData.dob,
            relationship_type: userProfileData?.userProfileData.relationship_type,
            interest: userProfileData?.userProfileData.interest,
            gender: userProfileData?.userProfileData.gender,
            preferred_language: userProfileData?.userProfileData.preferred_language,
            relationship_status: userProfileData?.userProfileData.relationship_status,
            work_status: userProfileData?.userProfileData.work_status,
            education: userProfileData?.userProfileData.education,
            about_me: userProfileData?.userProfileData.aboutMe,
        }
        editBottomSheetModalRef.current?.present({ data: profileData })
    };

    const openOtherDetailsEditBottomSheet = (type: EditType) => {
        setEditType(type);
        const otherData = userProfileData?.userSpecificationData[type] ? userProfileData?.userSpecificationData[type] : {};
        editOtherFormBottomSheetModalRef.current?.present({ otherData: otherData })
    }

    const updateBasicInfo = async (params: { [key: string]: any }) => {
        try {

            show();
            const { data } = await axiosRequest.post(`/update-basic-settings`, params);
            hide();
            Toast.success('Profile updated successfully');
            dispatch(updateUserInfo({ full_name: params.first_name + ' ' + params.last_name }));
            dispatch(fetchUserProfileData());
            editBottomSheetModalRef.current?.dismiss();
        } catch (error: any) {
            hide();
            console.error('error', error);
            Alert.alert('Error', error.errorMessage ? error.errorMessage : 'Unable to update')
        }
    }

    const updateSpecificationData = async (formData: { [key: string]: any }) => {
        try {
            show();
            await axiosRequest.post(`/update-profile-settings`, formData);
            hide();
            hide();
            Toast.success('Profile updated successfully');
            dispatch(fetchUserProfileData());
            editOtherFormBottomSheetModalRef.current?.dismiss();
        } catch (error: any) {
            hide();
            Alert.alert('Error', error.errorMessage ? error.errorMessage : 'Unable to update')
        }
    }


    const pickImage = async () => {
        try {
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
                const image = result.assets[0];
                const formData = new FormData();
                formData.append("filepond", {
                    uri: image?.uri,
                    name: 'name' in image ? image.name : image.uri.split("/").pop() || "unknown.jpg",
                    type: image?.mimeType || "image/jpeg",
                } as any);
                show();
                const data: any = await axiosRequest.post('/upload-profile-image', formData, { headers: { "Content-Type": "multipart/form-data" } });
                const response = data.data
                const image_url = response.image_url;
                if (image_url) {
                    // setProfilePictureUrl(image_url);
                    dispatch(updateUserInfo({ profile_picture_url: image_url }));
                }
                if (data.reaction === ReactionCodes.SUCCESS) {
                    Toast.success('Profile picture updated successfully');
                } else {
                    Alert.alert('Error', data.message ? data.message : 'Unable to proceed')
                }
                hide();
            }
        } catch (error) {
            hide();
            console.error('Error picking image:', error);
        }
    };

    return (
        <View className="flex-1 bg-white" style={{ paddingTop: insets.top, paddingBottom: 10 }}>
            {/* Header */}
            <NavBar title='Profile Settings' />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

                <View className='items-center justify-center'>
                    <Image source={userInfo?.profile_picture_url ? { uri: userInfo?.profile_picture_url } : undefined} className="w-24 h-24 rounded-full my-4 mx-auto bg-gray-50" />
                    <TouchableOpacity onPress={pickImage} className="flex-row items-center">
                        <Feather name="edit-2" size={14} color="#D946EF" />
                        <Text className="text-primary font-firamedium ml-1">Edit</Text>
                    </TouchableOpacity>
                </View>
                {/* <Text className="font-bold text-lg px-4 py-4">Photos</Text> */}
                <PhotoGridSection />

                {/* Basic Info Section */}
                <SectionHeader title="Basic information" onEdit={openEditBottomSheet} />
                <View className="bg-[#F2F2F7] mx-4 rounded-xl px-3 py-1">
                    <InfoRow icon={<Feather name="mail" size={18} color="#666" />} loading={loadingUserProfileData} label="Full Name" value={userProfileData?.userData.fullName} />
                    <InfoRow icon={<Feather name="phone" size={18} color="#666" />} loading={loadingUserProfileData} label="Phone No." value={userProfileData?.userProfileData.mobile_number} />
                    <InfoRow icon={<Feather name="calendar" size={18} color="#666" />} loading={loadingUserProfileData} label="Date of Birth" value={userProfileData?.userProfileData.dob} />
                    <InfoRow icon={<MaterialCommunityIcons name="gender-male-female" size={18} color="#666" />} loading={loadingUserProfileData} label="Gender" value={userProfileData?.userProfileData.gender_text} />
                    <InfoRow icon={<Feather name="users" size={18} color="#666" />} loading={loadingUserProfileData} label="Rel. Status" value={userProfileData?.userProfileData.formatted_relationship_status} />
                    {/* <InfoRow icon={<Feather name="heart" size={18} color="#666" />} loading={loadingUserProfileData} label="Rel. Type" value={profile.basic.relationshipType} /> */}
                    <InfoRow icon={<Feather name="briefcase" size={18} color="#666" />} loading={loadingUserProfileData} label="Work Status" value={userProfileData?.userProfileData.formatted_work_status} />
                </View>

                {/* Looks Section */}
                <SectionHeader title="Looks" onEdit={() => openOtherDetailsEditBottomSheet('looks')} />
                <View className="bg-[#F2F2F7] mx-4 rounded-xl px-3 py-1">
                    <InfoRow icon={<MaterialCommunityIcons name="ruler" size={18} color="#666" />} label="Height" value={userProfileData?.formatteduserSpecificationData.looks['Height']} />
                    <InfoRow icon={<Feather name="globe" size={18} color="#666" />} label="Ethnicity" value={userProfileData?.formatteduserSpecificationData.looks['Ethnicity']} />
                    <InfoRow icon={<Ionicons name="body-outline" size={18} color="#666" />} label="Body Type" value={userProfileData?.formatteduserSpecificationData.looks['Body Type']} />
                    <InfoRow icon={<MaterialCommunityIcons name="face-man-shimmer-outline" size={18} color="#666" />} label="Hair Color" value={userProfileData?.formatteduserSpecificationData.looks['Hair Color']} />
                </View>

                {/* Personality Section */}
                <SectionHeader title="Personality" onEdit={() => openOtherDetailsEditBottomSheet('personality')} />
                <View className="bg-[#F2F2F7] mx-4 rounded-xl px-3 py-1">
                    <InfoRow icon={<Feather name="smile" size={18} color="#666" />} label="Nature" value={userProfileData?.formatteduserSpecificationData.personality['Nature']} />
                    <InfoRow icon={<Feather name="users" size={18} color="#666" />} label="Friends" value={userProfileData?.formatteduserSpecificationData.personality['Friends']} />
                    <InfoRow icon={<MaterialCommunityIcons name="baby-carriage" size={18} color="#666" />} label="Children" value={userProfileData?.formatteduserSpecificationData.personality['Children']} />
                    <InfoRow icon={<MaterialCommunityIcons name="paw" size={18} color="#666" />} label="Pets" value={userProfileData?.formatteduserSpecificationData.personality['Pets']} />
                </View>

                {/* Lifestyle Section */}
                <SectionHeader title="Lifestyle" onEdit={() => openOtherDetailsEditBottomSheet('lifestyle')} />
                <View className="bg-[#F2F2F7] mx-4 rounded-xl px-3 py-1">
                    <InfoRow icon={<MaterialCommunityIcons name="book-open-page-variant" size={18} color="#666" />} label="Religion" value={userProfileData?.formatteduserSpecificationData.lifestyle['Religion']} />
                    <InfoRow icon={<MaterialCommunityIcons name="car" size={18} color="#666" />} label="Car" value={userProfileData?.formatteduserSpecificationData.lifestyle['Car']} />
                    <InfoRow icon={<Feather name="home" size={18} color="#666" />} label="I live with" value={userProfileData?.formatteduserSpecificationData.lifestyle['I live with']} />
                    <InfoRow icon={<Feather name="map" size={18} color="#666" />} label="Travel" value={userProfileData?.formatteduserSpecificationData.lifestyle['Travel']} />
                    <InfoRow icon={<MaterialCommunityIcons name="cigar" size={18} color="#666" />} label="Smoke" value={userProfileData?.formatteduserSpecificationData.lifestyle['Smoke']} />
                    <InfoRow icon={<MaterialCommunityIcons name="glass-wine" size={18} color="#666" />} label="Drink" value={userProfileData?.formatteduserSpecificationData.lifestyle['Drink']} />
                </View>

                <SectionHeader title="Favorites" onEdit={() => openOtherDetailsEditBottomSheet('favorites')} />
                <View className="bg-[#F2F2F7] mx-4 rounded-xl px-3 py-1 mb-10">
                    <InfoRow
                        icon={<Feather name="music" size={18} color="#666" />}
                        label="Music Genre"
                        value={userProfileData?.formatteduserSpecificationData.favorites['Music Genre']}
                    />
                    <InfoRow
                        icon={<MaterialCommunityIcons name="microphone-variant" size={18} color="#666" />}
                        label="Singer"
                        value={userProfileData?.formatteduserSpecificationData.favorites['Singer']}
                    />
                    <InfoRow
                        icon={<MaterialCommunityIcons name="music-circle-outline" size={18} color="#666" />}
                        label="Song"
                        value={userProfileData?.formatteduserSpecificationData.favorites['Song']}
                    />
                    <InfoRow
                        icon={<Feather name="activity" size={18} color="#666" />}
                        label="Hobby"
                        value={userProfileData?.formatteduserSpecificationData.favorites['Hobby']}
                    />
                    <InfoRow
                        icon={<MaterialIcons name="sports-basketball" size={18} color="#666" />}
                        label="Sport"
                        value={userProfileData?.formatteduserSpecificationData.favorites['Sport']}
                    />
                    <InfoRow
                        icon={<Feather name="book-open" size={18} color="#666" />}
                        label="Book"
                        value={userProfileData?.formatteduserSpecificationData.favorites['Book']}
                    />
                    <InfoRow
                        icon={<MaterialCommunityIcons name="food-variant" size={18} color="#666" />}
                        label="Dish"
                        value={userProfileData?.formatteduserSpecificationData.favorites['Dish']}
                    />
                    <InfoRow
                        icon={<Ionicons name="color-palette-outline" size={18} color="#666" />}
                        label="Color"
                        value={userProfileData?.formatteduserSpecificationData.favorites['Color']}
                    />
                    <InfoRow
                        icon={<MaterialCommunityIcons name="movie-open-outline" size={18} color="#666" />}
                        label="Movie"
                        value={userProfileData?.formatteduserSpecificationData.favorites['Movie']}
                    />
                    <InfoRow
                        icon={<Feather name="tv" size={18} color="#666" />}
                        label="Show"
                        value={userProfileData?.formatteduserSpecificationData.favorites['Show']}
                    />
                    <InfoRow
                        icon={<MaterialCommunityIcons name="lightbulb-on-outline" size={18} color="#666" />}
                        label="Inspired From"
                        value={userProfileData?.formatteduserSpecificationData.favorites['Inspired From']}
                    />
                </View>

            </ScrollView>

            <BottomSheetModal
                ref={editBottomSheetModalRef}
                snapPoints={['100%']}
                enableDynamicSizing={false}
                handleIndicatorStyle={{
                    display: "none"
                }}
                handleStyle={{ padding: 0 }}
                style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 6 },
                    shadowOpacity: 0.1,
                    shadowRadius: 6,
                    elevation: 6,
                    backgroundColor: 'yellow',
                    borderRadius: 28,
                }}
                backgroundStyle={{
                    borderRadius: 28,
                }}
                backdropComponent={renderBackdrop}
                handleComponent={renderHeaderHandle}
            >

                {({ data }) => <EditProfileForm
                    initialData={data?.data}
                    appConfig={appConfig!}
                    onSave={(updatedData) => {
                        updateBasicInfo(updatedData);
                    }}
                />}
            </BottomSheetModal>
            <BottomSheetModal
                ref={editOtherFormBottomSheetModalRef}
                snapPoints={['100%']}
                enableDynamicSizing={false}
                handleIndicatorStyle={{
                    display: "none"
                }}
                handleStyle={{ padding: 0 }}
                style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 6 },
                    shadowOpacity: 0.1,
                    shadowRadius: 6,
                    elevation: 6,
                    backgroundColor: 'yellow',
                    borderRadius: 28,
                }}
                backgroundStyle={{
                    borderRadius: 28,
                }}
                backdropComponent={renderBackdrop}
                handleComponent={renderHeaderHandle}
            >
                {({ data }) => <EditProfileOtherDetailsForm
                    initialData={data?.otherData}
                    onSave={(updatedData) => {
                        updateSpecificationData(updatedData);
                    }}
                />}
            </BottomSheetModal>
        </View>
    );
}