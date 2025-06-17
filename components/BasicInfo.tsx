import { View, Text, TouchableOpacity, Modal, KeyboardAvoidingView, Platform, ScrollView, TextInput, Pressable, Keyboard, FlatList, Alert } from 'react-native'
import React, { memo, useCallback, useEffect, useState } from 'react'
import { YStack, XStack, Form, Select, Adapt, Sheet, Dialog, Fieldset, Input, Label, TooltipSimple, Unspaced, Button, ListItem } from 'tamagui'
import Feather from '@expo/vector-icons/Feather'
import { SafeAreaView } from 'react-native-safe-area-context'
import Ionicons from '@expo/vector-icons/Ionicons'
import CustomButton from './CustomButton'
import FormField from './FormField'
import { UserProfileData, UserSpecification, UserSpecificationsData } from '@/models/user'
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks'
import DateOfBirthPicker from './DateOfBirthPicker';
import axiosRequest from '@/utils/axios';
import SelectPicker from './SelectPicker'
import { educationOptions, preferredLanguageOptions, relationshipStatusOptions, workStatusOptions } from '@/constants/constants'
import Toast from './toast/toast'
import { ReactionCodes } from '@/models/general'
import { Loader } from './loader/LoaderWrapper'
import SpecificationData from './SpecificationInfo'
import { fetchUserProfileData } from '@/redux/thunks/userActions'

type BasicInfoForm = {
    first_name: string;
    last_name: string;
    phone_number: string;
    birthday: string;
    gender: string;
    preferred_language?: string | number;
    work_status?: string | number;
    relationship_type: string[];
    interest: string[],
    about_me?: string,
    relationship_status?: string | number,
    education?: string | number
};

const BasicInfo = memo(({ editable, userSpecificationData, userProfileData, onEditDone, ...props }: { editable?: boolean, userProfileData?: UserProfileData, userSpecificationData?: UserSpecificationsData, onEditDone?: () => void }) => {
    const dispatch = useAppDispatch();
    const [editBioDataModalVisible, setEditBioDataModalVisible] = useState(false);
    const [status, setStatus] = React.useState<'off' | 'submitting' | 'submitted'>('off');
    const { userInfo } = useAppSelector(state => state.auth);
    const { loading, appConfig } = useAppSelector(state => state.app);
    const [showRelationShipTypePicker, setShowRelationShipTypePicker] = useState(false);
    const [showInterestPicker, setShowInterestPicker] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [basicInfoForm, setBasicInfoForm] = useState<BasicInfoForm>({
        first_name: '',
        last_name: '',
        phone_number: '',
        birthday: '',
        gender: '',
        relationship_type: [],
        interest: [],
        about_me: '',
        relationship_status: ''
    })

    const flatListRef = React.useRef<FlatList>(null);

    useEffect(() => {
        if (userProfileData && userInfo) {
            if (editable) {
                setBasicInfoForm({
                first_name: userInfo?.first_name,
                last_name: userInfo.last_name,
                phone_number: userProfileData.mobile_number,
                birthday: userProfileData.dob,
                gender: userProfileData.gender?.toString(),
                relationship_type: userProfileData.relationship_type,
                interest: userProfileData.interest,
                about_me: userProfileData.aboutMe,
                relationship_status: userProfileData.relationship_status,
                education: userProfileData.education,
                preferred_language: userProfileData.preferred_language,
                work_status: userProfileData.work_status,
            })
            }
        }
    }, [userProfileData, userInfo, editable])

    const updateBasicInfoForm = useCallback(<K extends keyof BasicInfoForm>(key: K, value: BasicInfoForm[K]) => {
        setBasicInfoForm({
            ...basicInfoForm,
            [key]: value
        })
    }, [basicInfoForm])

    const toggleEditModalVisible = useCallback(() => setEditBioDataModalVisible(!editBioDataModalVisible), [editBioDataModalVisible]);

    const setSelectedRelationshipType = (relationshipType: string) => {
        Keyboard.dismiss();
        const selectedRelationshipType = [...basicInfoForm.relationship_type]
        if (selectedRelationshipType?.includes(String(relationshipType))) {
            const updatedRelationshipType = selectedRelationshipType.filter((type: string) => type !== String(relationshipType))
            updateBasicInfoForm('relationship_type', updatedRelationshipType);
        } else {
            updateBasicInfoForm('relationship_type', [...selectedRelationshipType!, String(relationshipType)]);
        }
    }

    const setSelectedInterests = (interest: string) => {
        Keyboard.dismiss();
        const selectedInterest = [...basicInfoForm.interest!]
        if (selectedInterest?.includes(String(interest))) {
            const updatedRelationshipType = selectedInterest.filter((type: string) => type !== String(interest))
            updateBasicInfoForm('interest', updatedRelationshipType);
        } else {
            updateBasicInfoForm('interest', [...selectedInterest!, String(interest)]);
        }
    }

    const getGenderName = (gender: string | number) => {
        const genderData = appConfig?.genders?.find(g => g.id.toString() === gender);
        return genderData?.value || '';
    }

    const truncateText = (text: string, maxLength: number) => {
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + '...';
        }
        return text;
    };

    const scrollToSelectedInterestIndex = () => {
        const interest = appConfig?.interests.findIndex((interest) => interest.value === basicInfoForm.interest[0]);
        if (interest !== undefined) {
            setTimeout(() => {
                flatListRef.current?.scrollToIndex({ index: interest, animated: true });
            }, 500);
        } else {
            console.warn('Selected interest index not found');
            flatListRef.current?.scrollToIndex({ index: 0, animated: true });
        }
    }

    const openPickInterestSheet = () => {
        Keyboard.dismiss();
        setShowInterestPicker(true);
        scrollToSelectedInterestIndex();
    }

    const updateBasicInfo = async () => {
        try {
            setUpdating(true);
            const params = {
                ...userProfileData,
                ...basicInfoForm
            }
            Loader.show();
            const { data } = await axiosRequest.post(`/update-basic-settings`, params);
            Loader.hide();
            Toast.success('Profile updated successfully');
            toggleEditModalVisible();
            onEditDone && onEditDone();
            dispatch(fetchUserProfileData());
        } catch (error: any) {
            Loader.hide();
            console.log('error', error);
            Alert.alert('Error', error.errorMessage ? error.errorMessage : 'Unable to update')
        }
    }

    return (
        <>
            <YStack gap="$4">
                <YStack gap="$3">
                    <XStack gap="$4" justifyContent='space-between' alignItems='center'>
                        <Text className='text-sm text-white font-firamedium'>Basic Info</Text>
                        {editable && <TouchableOpacity onPress={toggleEditModalVisible} activeOpacity={0.8}>
                            <XStack>
                                <Text className='text-sm text-[#DD3FE5] font-firaregular'>Edit</Text>
                                <Feather name="edit-3" size={16} color="#DD3FE5" />
                            </XStack>
                        </TouchableOpacity>}
                    </XStack>
                    <YStack gap="$3">
                        <View className='p-4 rounded-lg bg-[#5B5B5B]'>
                            <YStack gap="$4">
                                <XStack gap="$4">
                                    <View className='flex-[0_0_45%] space-y-1'>
                                        <Text className='text-sm font-firamedium text-white'>Gender </Text>
                                        <Text className=' text-white font-firaregular'>{userProfileData?.gender_text} </Text>
                                    </View>
                                    <View className='flex-[0_0_45%] space-y-1'>
                                        <Text className='text-sm font-firamedium text-white'>Preferred Language </Text>
                                        <Text className=' text-white font-firaregular'>{userProfileData?.formatted_preferred_language} </Text>
                                    </View>
                                </XStack>
                                <XStack gap="$4">
                                    <View className='flex-[0_0_45%] space-y-1'>
                                        <Text className='text-sm font-firamedium text-white'>Relationship Status </Text>
                                        <Text className=' text-white font-firaregular'>{userProfileData?.formatted_relationship_status
                                            || '-'} </Text>
                                    </View>
                                    <View className='flex-[0_0_45%] space-y-1'>
                                        <Text className='text-sm font-firamedium text-white'>Work Status </Text>
                                        <Text className=' text-white font-firaregular'>{userProfileData?.formatted_work_status || '-'} </Text>
                                    </View>
                                </XStack>
                                <XStack gap="$4">
                                    <View className='flex-[0_0_45%] space-y-1'>
                                        <Text className='text-sm font-firamedium text-white'>Education </Text>
                                        <Text className=' text-white font-firaregular'>{userProfileData?.formatted_education || '-'} </Text>
                                    </View>
                                    <View className='flex-[0_0_45%] space-y-1'>
                                        <Text className='text-sm font-firamedium text-white'>Birthday </Text>
                                        <Text className=' text-white font-firaregular'>{userProfileData?.birthday} </Text>
                                    </View>
                                </XStack>
                                <XStack gap="$4">
                                    <View className='flex-[0_0_45%] space-y-1'>
                                        <Text className='text-sm font-firamedium text-white'>Relationship Type </Text>
                                        <View className='pl-2 space-y-1'>
                                            {userProfileData?.relationship_type.map((type, index) => {
                                                return (
                                                    <View className='flex-row flex-wrap space-x-2' key={type}>
                                                        <Text className='text-white font-firaregular'>{index + 1}.</Text>
                                                        <Text className='flex-1 text-white font-firaregular word-break text-wrap'>{type} </Text>
                                                    </View>
                                                )
                                            })}
                                        </View>
                                    </View>
                                    <View className='flex-[0_0_45%] space-y-1'>
                                        <Text className='text-sm font-firamedium text-white'>Interests </Text>
                                        <View className='pl-2 space-y-1'>
                                            {userProfileData?.interest.map((type, index) => {
                                                return (
                                                    <View className='flex-row flex-wrap space-x-2' key={type}>
                                                        <Text className='text-white font-firaregular'>{index + 1}.</Text>
                                                        <Text className='flex-1 text-white font-firaregular word-break text-wrap'>{type} </Text>
                                                    </View>
                                                )
                                            })}
                                        </View>
                                    </View>
                                </XStack>
                                <XStack gap="$4">
                                    <YStack gap="$3" flex={1}>
                                        <Text className='text-sm font-firamedium text-white'>Location </Text>
                                        <Text className='text-white font-firaregular'>{userProfileData?.city && userProfileData?.city}, {userProfileData?.country_name && userProfileData?.country_name} </Text>
                                    </YStack>
                                </XStack>
                            </YStack>
                        </View>
                    </YStack>
                </YStack>
                {userSpecificationData && Object.values(userSpecificationData).map((item) => {
                    return (
                        // <YStack gap="$3" key={item.title}>
                        //     <Text className='text-sm text-white font-firamedium'>{item.title}</Text>
                        //     <YStack gap="$3">
                        //         <View className='p-4 rounded-lg bg-[#5B5B5B]'>
                        //             <YStack gap="$4">
                        //                 <XStack gap="$4" flexWrap="wrap">

                        //                     {item.items.map((data, index) => {
                        //                         return (
                        //                             <View key={data.label} className='flex-[0_0_45%] space-y-1'>
                        //                                 <Text className='text-sm font-firamedium text-white'>{data.label} </Text>
                        //                                 <Text className='text-white'>{data.value || "-"}</Text>
                        //                             </View>
                        //                         )
                        //                     })}
                        //                 </XStack>
                        //             </YStack>
                        //         </View>
                        //     </YStack>
                        // </YStack>
                        <SpecificationData item={item} editable={editable || false} key={item.title} onEditDone={onEditDone} />
                    )
                })}
            </YStack>

            {/* edit bio data modal */}
            <Sheet
                forceRemoveScrollEnabled={editBioDataModalVisible}
                modal={true}
                open={editBioDataModalVisible}
                disableDrag={true}
                onOpenChange={setEditBioDataModalVisible}
                snapPoints={[100]}
                snapPointsMode={'percent'}
                dismissOnSnapToBottom
                zIndex={100_000}
                animation="medium"
            >
                <Sheet.Overlay
                    animation="medium"
                    enterStyle={{ opacity: 0 }}
                    exitStyle={{ opacity: 0 }}
                />
                <Sheet.Frame gap="$5" backgroundColor={'#1A1A1A'}>
                    <SafeAreaView className='bg-[#1A1A1A] h-full'>
                        <View className='bg-[#1A1A1A] flex-row items-center justify-center px-4 py-3 relative'>
                            <TouchableOpacity onPress={() => setEditBioDataModalVisible(false)} className='absolute z-10 left-4 items-center justify-center pr-4'>
                                <Ionicons name="close" size={24} color="#ffffff" />
                            </TouchableOpacity>
                            <Text className='font-firabold text-white text-center flex-1 mx-auto text-base'>Edit Basic Info</Text>
                        </View>
                        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }} >
                            <ScrollView className='px-4 py-2 h-full'>
                                <Form gap="$7">
                                    <YStack gap="$3">
                                        <FormField
                                            title="First Name"
                                            value={basicInfoForm.first_name}
                                            placeholder='Enter first name'
                                            handleChangeText={(text: string) => updateBasicInfoForm('first_name', text)}
                                        />
                                        <FormField
                                            title="Last Name"
                                            value={basicInfoForm.last_name}
                                            placeholder='Enter last name'
                                            handleChangeText={(text: string) => updateBasicInfoForm('last_name', text)}
                                        />
                                        <View className='space-y-2'>
                                            <Text className='text-base text-white font-firamedium'>Bio</Text>
                                            <TextInput
                                                editable
                                                multiline
                                                numberOfLines={4}
                                                placeholderTextColor={"#fbfbfb73"}
                                                defaultValue={basicInfoForm.about_me}
                                                onChangeText={(text: string) => updateBasicInfoForm('about_me', text)}
                                                textAlignVertical='top'
                                                className='border border-transparent font-firaregular text-white text-base w-full px-4 bg-[#5B5B5B] rounded-md focus:border-secondary min-h-[100px]'
                                            />
                                        </View>
                                        <DateOfBirthPicker dateOfBirth={basicInfoForm.birthday} onDateOfBirthSelected={(params) => updateBasicInfoForm('birthday', params)} />
                                        <SelectPicker options={appConfig?.genders!} onSelectOption={(params) => updateBasicInfoForm('gender', params)} defaultOption={basicInfoForm.gender} title='Gender' />
                                        <SelectPicker options={preferredLanguageOptions} onSelectOption={(params) => updateBasicInfoForm('preferred_language', params)} defaultOption={basicInfoForm.preferred_language} title='Preferred Language' />
                                        <SelectPicker options={relationshipStatusOptions} onSelectOption={(params) => updateBasicInfoForm('relationship_status', params)} defaultOption={basicInfoForm.relationship_status} title='Relationship Status' />
                                        <SelectPicker options={workStatusOptions} onSelectOption={(params) => updateBasicInfoForm('work_status', params)} defaultOption={basicInfoForm.work_status} title='Work Status' />
                                        <SelectPicker options={educationOptions} onSelectOption={(params) => updateBasicInfoForm('education', params)} defaultOption={basicInfoForm.education} title='Education' />
                                        {/* <View className="space-y-2">
                                                <Text className='text-base text-white font-firamedium'>Relationship Type</Text>
                                                <View className='border border-transparent w-full px-4 bg-[#5B5B5B] rounded-md focus:border-secondary items-center flex-row'>
                                                    <View
                                                        className='flex-1 flex-row gap-x-2 h-12 items-center font-firaregular text-white divide divide-x divide-[#A9A9A9]'>
                                                        <TouchableOpacity className='flex-row justify-between flex-nowrap overflow-hidden flex-1 space-x-3' onPress={() => setShowRelationShipTypePicker(true)}>
                                                            <Text className='text-base text-white font-firaregular overflow-ellipsis flex-1'>{truncateText(basicInfoForm.relationship_type?.join(', '), 30) || 'Select relationship type'}</Text>
                                                            <Feather className='ml-auto' name="chevron-down" size={20} color="white" />
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            </View>
                                            <View className="space-y-2">
                                                <Text className='text-base text-white font-firamedium'>Interest</Text>
                                                <View className='border border-transparent w-full px-4 bg-[#5B5B5B] rounded-md focus:border-secondary items-center flex-row'>
                                                    <View
                                                        className='flex-1 flex-row gap-x-2 h-12 items-center font-firaregular text-white divide divide-x divide-[#A9A9A9]'>
                                                        <TouchableOpacity className='flex-row justify-between flex-nowrap overflow-hidden flex-1 space-x-3' onPress={openPickInterestSheet}>
                                                            <Text className='text-base text-white font-firaregular overflow-ellipsis flex-1'>{truncateText(basicInfoForm.interest.join(', '), 30) || 'Select relationship type'}</Text>
                                                            <Feather className='ml-auto' name="chevron-down" size={20} color="white" />
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            </View> */}
                                    </YStack>
                                    <Form.Trigger asChild disabled={status !== 'off'}>
                                        <View>
                                            <CustomButton title='Save Changes' handlePress={updateBasicInfo} />
                                            <View className='h-5' />
                                        </View>
                                    </Form.Trigger>
                                </Form>
                            </ScrollView>
                        </KeyboardAvoidingView>
                    </SafeAreaView>
                </Sheet.Frame>
            </Sheet>



            {/* relationship type picker */}
            <Sheet
                forceRemoveScrollEnabled={showRelationShipTypePicker}
                modal={true}
                open={showRelationShipTypePicker}
                disableDrag={true}
                onOpenChange={setShowRelationShipTypePicker}
                snapPointsMode={'fit'}
                dismissOnSnapToBottom
                zIndex={100_000}
                animation="quicker"
            >
                <Sheet.Overlay
                    onPress={() => setShowRelationShipTypePicker(false)}
                    animation="quicker"
                    enterStyle={{ opacity: 0 }}
                    exitStyle={{ opacity: 0 }}
                />
                <Sheet.Frame paddingBottom="$5" gap="$1" backgroundColor={'#1A1A1A'}>
                    <View className='bg-[#1A1A1A] p-4 flex-row justify-center'>
                        <TouchableOpacity onPress={() => { Keyboard.dismiss(); setShowRelationShipTypePicker(false) }} className=' absolute top-4 left-4 z-10 flex items-center justify-center pr-4'>
                            <Ionicons name="close-circle" size={24} color="#ffffff" />
                        </TouchableOpacity>
                        <Text className='font-firabold text-white text-base mx-auto'>Select Relationship Type</Text>
                    </View>
                    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                        <View className='px-4 pb-4' style={{ flexGrow: 1 }}>
                            <YStack gap="$2">
                                {appConfig?.relationship_types?.map((type, index) => (
                                    <ListItem onPress={() => setSelectedRelationshipType(type.value)} key={index} className={`bg-gray-800 rounded-lg ${basicInfoForm.relationship_type?.includes(type.value.toString()) ? 'bg-secondary' : ''}`}>
                                        <XStack gap="$3" alignItems='center'>
                                            <Text className={`text-lg ${basicInfoForm.relationship_type?.includes(type.value.toString()) ? 'text-black' : 'text-white'}`}>{type.value}</Text>
                                        </XStack>
                                    </ListItem>
                                ))}
                            </YStack>
                        </View>
                    </KeyboardAvoidingView>
                </Sheet.Frame>
            </Sheet>

            {/* interest picker */}
            <Sheet
                forceRemoveScrollEnabled={showInterestPicker}
                modal={true}
                open={showInterestPicker}
                disableDrag={true}
                onOpenChange={setShowInterestPicker}
                // snapPointsMode={'fit'}
                dismissOnSnapToBottom
                zIndex={100_000}
                animation="quicker"
            >
                <Sheet.Overlay
                    onPress={() => setShowInterestPicker(false)}
                    animation="quicker"
                    enterStyle={{ opacity: 0 }}
                    exitStyle={{ opacity: 0 }}
                />

                <Sheet.Frame paddingBottom="$5" gap="$1" backgroundColor={'#1A1A1A'}>
                    <View className='bg-[#1A1A1A] flex-1'>
                        <View className='bg-[#1A1A1A] p-4'>
                            <TouchableOpacity onPress={() => { Keyboard.dismiss(); setShowInterestPicker(false) }} className='absolute top-4 left-4 z-10 flex items-center justify-center pr-4'>
                                <Ionicons name="close-circle" size={24} color="#ffffff" />
                            </TouchableOpacity>
                            <Text className='font-firabold text-white text-base mx-auto'>Select Interests</Text>
                        </View>
                        <FlatList ref={flatListRef}
                            data={appConfig?.interests}
                            keyExtractor={(item, index) => item.value}
                            ItemSeparatorComponent={() => <View className='h-2' />}
                            renderItem={({ item }) => <ListItem onPress={() => setSelectedInterests(item.value)} className={`bg-gray-800 rounded-lg ${basicInfoForm.interest?.includes(item.value.toString()) ? 'bg-secondary' : ''}`}>
                                <XStack gap="$3" alignItems='center'>
                                    <Text className={`text-lg ${basicInfoForm.interest?.includes(item.value.toString()) ? 'text-black' : 'text-white'}`}>{item.value}</Text>
                                </XStack>
                            </ListItem>} className='px-4 h-full' />

                    </View>
                </Sheet.Frame>
            </Sheet>
        </>
    )
})


// const SpecificationData = ({ item, editable, onEditDone }: { item: UserSpecification, editable: boolean, onEditDone?: () => void }) => {
//     const [editSpecificationModalVisible, setEditSpecificationModalVisible] = useState(false);
//     const [formData, setFormData] = useState<{ [key: string]: string }>({});
//     const [options, setOptions] = useState<any>([]);

//     const toggleEditModal = useCallback(() => setEditSpecificationModalVisible(!editSpecificationModalVisible), [editSpecificationModalVisible]);

//     useEffect(() => {
//         const { items } = item
//         const optionsArray = items.map(item => {
//             return {
//                 [item.name]: Object.entries(item.options).map(([id, value]) => ({
//                     id,
//                     value,
//                 }))
//             }
//         })

//         const options = optionsArray.reduce((acc, item) => {
//             const key = Object.keys(item)[0];
//             acc[key] = item[key];
//             return acc;
//         }, {});
//         setOptions(options);

//         const formItems = item.items.map(item => {
//             return {
//                 [item.name]: item.selected_options,
//             }
//         })
//         const form = formItems.reduce((acc, item) => {
//             const key = Object.keys(item)[0];
//             acc[key] = item[key];
//             return acc;
//         }, {});
//         setFormData(form);
//     }, [item.items])

//     const updateForm = useCallback(<K extends keyof any>(key: K, value: any[K]) => {
//         setFormData({
//             ...formData,
//             [key]: value
//         })
//     }, [formData])

//     const updateSpecificationData = async () => {
//         try {
//             Loader.show();
//             await axiosRequest.post(`/update-profile-settings`, formData);
//             Loader.hide();
//             Toast.success('Profile updated successfully');
//             toggleEditModal();
//             onEditDone && onEditDone();
//         } catch (error: any) {
//             Loader.hide();
//             console.log('error', error);
//             Alert.alert('Error', error.errorMessage ? error.errorMessage : 'Unable to update')
//         }
//     }

//     return (
//         <>
//             <YStack gap="$3" key={item.title}>
//                 <XStack gap="$4" justifyContent='space-between' alignItems='center'>
//                     <Text className='text-sm text-white font-firamedium'>{item.title}</Text>
//                     {editable && <TouchableOpacity onPress={toggleEditModal} activeOpacity={0.8}>
//                         <XStack>
//                             <Text className='text-sm text-[#DD3FE5] font-firaregular'>Edit</Text>
//                             <Feather name="edit-3" size={16} color="#DD3FE5" />
//                         </XStack>
//                     </TouchableOpacity>}
//                 </XStack>
//                 <YStack gap="$3">
//                     <View className='p-4 rounded-lg bg-[#5B5B5B]'>
//                         <YStack gap="$4">
//                             <XStack gap="$4" flexWrap="wrap">

//                                 {item.items.map((data, index) => {
//                                     return (
//                                         <View key={data.label} className='flex-[0_0_45%] space-y-1'>
//                                             <Text className='text-sm font-firamedium text-white'>{data.label} </Text>
//                                             <Text className='text-white'>{data.value || "-"}</Text>
//                                         </View>
//                                     )
//                                 })}
//                             </XStack>
//                         </YStack>
//                     </View>
//                 </YStack>
//             </YStack>
//             <Sheet
//                 forceRemoveScrollEnabled={editSpecificationModalVisible}
//                 modal={true}
//                 open={editSpecificationModalVisible}
//                 disableDrag={true}
//                 onOpenChange={setEditSpecificationModalVisible}
//                 snapPoints={[100]}
//                 snapPointsMode={'percent'}
//                 dismissOnSnapToBottom
//                 zIndex={100_000}
//                 animation="medium"
//             >
//                 <Sheet.Overlay
//                     animation="lazy"
//                     enterStyle={{ opacity: 0 }}
//                     exitStyle={{ opacity: 0 }}
//                 />
//                 <Sheet.Frame gap="$5" backgroundColor={'#1A1A1A'}>
//                     <SafeAreaView className='bg-[#1A1A1A] h-full'>
//                         <View className='bg-[#1A1A1A] flex-row items-center justify-center px-4 py-3 relative'>
//                             <TouchableOpacity onPress={() => setEditSpecificationModalVisible(false)} className='absolute z-10 left-4 items-center justify-center pr-4'>
//                                 <Ionicons name="close" size={24} color="#ffffff" />
//                             </TouchableOpacity>
//                             <Text className='font-firabold text-white text-center flex-1 mx-auto text-base'>Edit {item.title}</Text>
//                         </View>
//                         <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }} >
//                             <ScrollView className='px-4 py-2 h-full'>
//                                 <Form gap="$7">
//                                     <YStack gap="$3">
//                                         {Object.entries(formData).map((data, index) => {
//                                             const key = data[0];
//                                             const value = data[1];
//                                             return (
//                                                 <SelectPicker key={index} options={options[key]} onSelectOption={(params) => updateForm(key, params)} defaultOption={value} title={key.toUpperCase()} />
//                                             )
//                                         })}

//                                     </YStack>
//                                     <Form.Trigger asChild>
//                                         <View>
//                                             <CustomButton title='Save Changes' handlePress={updateSpecificationData} />
//                                             <View className='h-5' />
//                                         </View>
//                                     </Form.Trigger>
//                                 </Form>
//                             </ScrollView>
//                         </KeyboardAvoidingView>
//                     </SafeAreaView>
//                 </Sheet.Frame>
//             </Sheet>
//         </>
//     )
// }

export default BasicInfo