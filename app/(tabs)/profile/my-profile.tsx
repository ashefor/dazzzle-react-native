import { Text, View, TouchableOpacity, Alert, SafeAreaView as SafeAreaViewIOS, Pressable, Platform } from 'react-native';
import React, { Fragment, useCallback, useEffect, useState } from 'react'
import { Avatar, XStack, YStack } from 'tamagui';
import { router, Stack } from 'expo-router';
import ArrowBackIcon from '@/components/icons/ArrowBackIcon';
import UserPhotos from '../../../components/UserPhotos';
import BasicInfo from '@/components/BasicInfo';
import UserInterests from '@/components/UserInterests';
import { SingleUserDetails } from '@/models/user';
import { ReactionCodes } from '@/models/general';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import axiosRequest from '@/utils/axios';
import SkeletonPlaceholder from '@/components/SkeletonLoader';
import * as ImagePicker from 'expo-image-picker';
import Toast from '@/components/toast/toast';
import { Feather } from '@expo/vector-icons';
import { Loader } from '@/components/loader/LoaderWrapper';
import { updateUserInfo } from '@/redux/slices/authSlice';
import { fetchUserProfileData } from '@/redux/thunks/userActions';
import { Tabs, MaterialTabBar, MaterialTabBarProps } from 'react-native-collapsible-tab-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


const MyProfile = () => {
    const { userInfo, userProfileData, loadingUserProfileData } = useAppSelector(state => state.auth);
    const dispatch = useAppDispatch();
    const [userDetails, setUserDetails] = useState<SingleUserDetails | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [profile_picture_url, setProfilePictureUrl] = useState<string | undefined>(undefined);
    const [editMode, setEditMode] = useState<boolean>(false);
        const insets = useSafeAreaInsets();
    const fetchUserDetails = async () => {
        try {
            const userName = userInfo?.username;
            setProfilePictureUrl(userInfo?.profile_picture_url);
            setLoading(true);
            const { data } = await axiosRequest.get(`/${userName}/get-user-profile-data`);
            const userData = data.userData;
            setUserDetails(data);
            const profilePicture = userData?.profilePicture;
            const { first_name, last_name } = userData;
            // const newUser = {...oldUser, first_name, last_name, profile_picture_url: profilePicture}
            if (userData && profilePicture) {
                setProfilePictureUrl(profilePicture);
            }
            setLoading(false);
            dispatch(updateUserInfo({ first_name, last_name, profile_picture_url: profilePicture }));
            // await setItem('dazzzle-user', newUser);
        } catch (error: any) {
            setLoading(false);
            console.log(error)
            Alert.alert('Error', error.errorMessage ? error.errorMessage : 'Unable to fetch user details')
        }
    }

    useEffect(() => {
        setProfilePictureUrl(userInfo?.profile_picture_url);
        dispatch(fetchUserProfileData());
    }, [])

    const handleEditDone = () => {
        dispatch(fetchUserProfileData());
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
                Loader.show();
                const data: any = await axiosRequest.post('/upload-profile-image', formData, { headers: { "Content-Type": "multipart/form-data" } });
                const response = data.data
                const image_url = response.image_url;
                if (image_url) {
                    setProfilePictureUrl(image_url);
                    dispatch(updateUserInfo({ profile_picture_url: image_url }));
                }
                if (data.reaction === ReactionCodes.SUCCESS) {
                    Toast.success('Profile picture updated successfully');
                } else {
                    Alert.alert('Error', data.message ? data.message : 'Unable to proceed')
                }
                Loader.hide();
            }
        } catch (error) {
            Loader.hide();
            console.error('Error picking image:', error);
        }
    };

    const HeaderComponent = () => {
        return (
            userInfo ? <View className='bg-[#1A1A1A] h-full relative' style={{ pointerEvents: 'box-none' }}>
                <YStack >
                    <View className='py-5 px-4'>
                        <YStack gap="$5">
                            <YStack alignItems="center" gap="$4" justifyContent='center'>
                                <View className='rounded-full relative'>
                                    <Avatar className='' gap="$2" circular size="$10">
                                        <Avatar.Image
                                            accessibilityLabel="Nate Wienert"
                                            src={profile_picture_url ? profile_picture_url : undefined}
                                        />
                                        <Avatar.Fallback delayMs={600} backgroundColor="$black12" />
                                    </Avatar>
                                </View>
                                 <TouchableOpacity onPress={pickImage} activeOpacity={0.8}>
                                    <XStack>
                                        <Text className='text-sm text-white font-firaregular'>Change Photo</Text>
                                        <Feather name="edit-3" size={16} color="white" />
                                    </XStack>
                                </TouchableOpacity>
                            </YStack>
                            <YStack>
                                <Text className='text-lg font-firasemibold text-center text-white'>
                                    {userInfo.first_name} {userInfo.last_name}
                                </Text>
                                {userProfileData?.userProfileData.aboutMe && <Text className='text-sm font-firaregular text-center text-white'>
                                    {userProfileData?.userProfileData.aboutMe}
                                </Text>}
                            </YStack>
                        </YStack>
                    </View>
                </YStack>
            </View> :
                null
        )
    }

    const renderTabBar = (props: MaterialTabBarProps<any>) => {
        return (
            <MaterialTabBar
                {...props}
                indicatorStyle={{ backgroundColor: '#DD3FE5' }}
                style={{ backgroundColor: '#1A1A1A', borderBottomWidth: 0, borderBottomColor: '#E4E4E7' }}
                activeColor='#DD3FE5'
                inactiveColor='#fff'
            />
        )
    };

    const toggleEditModalVisible = useCallback(() => setEditMode(!editMode), [editMode]);
    return (
        <Fragment>
            <Stack.Screen
                options={{
                    headerTitle: 'My Profile',
                    headerStyle: { backgroundColor: '#1A1A1A' },
                    headerLeft: () => <TouchableOpacity onPress={() => router.back()} className='flex items-center justify-center pr-4 w-9 h-8'>
                        <ArrowBackIcon />
                    </TouchableOpacity>,
                    // headerRight: () => <Pressable onPress={toggleEditModalVisible} className='flex  items-center justify-center'>
                    //     <Text className='text-sm text-[#DD3FE5] font-firaregular'>{editMode ? 'Done' : 'Edit'}</Text>
                    // </Pressable>
                }}
            />
            <Tabs.Container
                renderTabBar={renderTabBar}
                renderHeader={HeaderComponent}
            >
                <Tabs.Tab name="A" label={'Profile'}>
                    <Tabs.ScrollView className='py-5 px-4 bg-primary'>
                        {loadingUserProfileData ? <SectionSkeletonLoader /> : <View style={{ height: '100%', paddingBottom: insets.bottom + 20 }}>
                            <BasicInfo editable={true} onEditDone={handleEditDone}  userProfileData={userProfileData?.userProfileData} userSpecificationData={userProfileData?.userSpecificationData} />
                            </View>}

                    </Tabs.ScrollView>
                </Tabs.Tab>
                <Tabs.Tab name="B" label={'Photos'}>
                    <Tabs.ScrollView className='py-5 px-4 bg-primary'>
                        {loadingUserProfileData ? 
                        <UserPhotosSkeletonLoader/>
                        : <View style={{ height: '100%', paddingBottom: insets.bottom + 20 }}>
                            <UserPhotos editable={true} userPhotos={userProfileData?.photosData} />
                            </View>}
                    </Tabs.ScrollView>
                </Tabs.Tab>
                <Tabs.Tab name="C" label={'Interests'}>
                    <Tabs.ScrollView className='py-5 px-4 bg-primary'>
                        {loadingUserProfileData ? 
                        <UserInterestsSkeletonLoader/>
                        : <View style={{ height: '100%', paddingBottom: insets.bottom + 20 }}>
                            <UserInterests interests={userProfileData?.userProfileData.interest} />
                            </View>}
                    </Tabs.ScrollView>
                </Tabs.Tab>
            </Tabs.Container>
        </Fragment>
    )
}

const SectionSkeletonLoader = () => {
    return (
        <View className='space-y-5'>
            <View className="rounded-lg h-72 w-full flex items-center  overflow-hidden justify-center">
                <SkeletonPlaceholder style={{ height: '100%', width: '100%', backgroundColor: "#FFFFFF1A" }} />
            </View>

            <View className="rounded-lg h-72 w-full flex items-center  overflow-hidden justify-center">
                <SkeletonPlaceholder style={{ height: '100%', width: '100%', backgroundColor: "#FFFFFF1A" }} />
            </View>

            <View className="rounded-lg h-72 w-full flex items-center  overflow-hidden justify-center">
                <SkeletonPlaceholder style={{ height: '100%', width: '100%', backgroundColor: "#FFFFFF1A" }} />
            </View>
        </View>
    )
}

const UserPhotosSkeletonLoader = () => {
    return (
        <View className='flex flex-row justify-between'>
                            <View className="w-[31%] h-40 rounded-2xl">
                <SkeletonPlaceholder style={{ height: '100%', width: '100%', backgroundColor: "#FFFFFF1A" }} />
            </View>
            <View className="w-[31%] h-40 rounded-2xl">
                <SkeletonPlaceholder style={{ height: '100%', width: '100%', backgroundColor: "#FFFFFF1A" }} />
            </View>
            <View className="w-[31%] h-40 rounded-2xl">
                <SkeletonPlaceholder style={{ height: '100%', width: '100%', backgroundColor: "#FFFFFF1A" }} />
            </View>
                        </View>
    )
}

const UserInterestsSkeletonLoader = () => {
    return (
        <View className='flex flex-row flex-wrap gap-3'>
                            <View className="w-16 h-7 rounded-lg">
                <SkeletonPlaceholder style={{ height: '100%', width: '100%', backgroundColor: "#FFFFFF1A" }} />
            </View>
            <View className="w-24 h-7 rounded-lg">
                <SkeletonPlaceholder style={{ height: '100%', width: '100%', backgroundColor: "#FFFFFF1A" }} />
            </View>
            <View className="w-20 h-7 rounded-lg">
                <SkeletonPlaceholder style={{ height: '100%', width: '100%', backgroundColor: "#FFFFFF1A" }} />
            </View>
            <View className="w-16 h-7 rounded-lg">
                <SkeletonPlaceholder style={{ height: '100%', width: '100%', backgroundColor: "#FFFFFF1A" }} />
            </View>
            <View className="w-24 h-7 rounded-lg">
                <SkeletonPlaceholder style={{ height: '100%', width: '100%', backgroundColor: "#FFFFFF1A" }} />
            </View>
            <View className="w-20 h-7 rounded-lg">
                <SkeletonPlaceholder style={{ height: '100%', width: '100%', backgroundColor: "#FFFFFF1A" }} />
            </View>
            <View className="w-16 h-7 rounded-lg">
                <SkeletonPlaceholder style={{ height: '100%', width: '100%', backgroundColor: "#FFFFFF1A" }} />
            </View>
            <View className="w-24 h-7 rounded-lg">
                <SkeletonPlaceholder style={{ height: '100%', width: '100%', backgroundColor: "#FFFFFF1A" }} />
            </View>
            <View className="w-20 h-7 rounded-lg">
                <SkeletonPlaceholder style={{ height: '100%', width: '100%', backgroundColor: "#FFFFFF1A" }} />
            </View>
                        </View>
    )
}

// const TabsAdvancedBackground = () => {
//     const { userProfileData } = useAppSelector(state => state.auth);
//     const AnimatedYStack = styled(YStack, {
//         flex: 1,
//         x: 0,
//         opacity: 1,

//         animation: '100ms',
//         variants: {
//             // 1 = right, 0 = nowhere, -1 = left
//             direction: {
//                 ':number': (direction) => ({
//                     enterStyle: {
//                         x: direction > 0 ? -25 : 25,
//                         opacity: 0,
//                     },
//                     exitStyle: {
//                         zIndex: 0,
//                         x: direction < 0 ? -25 : 25,
//                         opacity: 0,
//                     },
//                 }),
//             },
//         } as const,
//     })
//     const [tabState, setTabState] = React.useState<{
//             currentTab: string
//             /**
//              * Layout of the Tab user might intend to select (hovering / focusing)
//              */
//             intentAt: TabLayout | null
//             /**
//              * Layout of the Tab user selected
//              */
//             activeAt: TabLayout | null
//             /**
//              * Used to get the direction of activation for animating the active indicator
//              */
//             prevActiveAt: TabLayout | null
//         }>({
//             activeAt: null,
//             currentTab: 'profile',
//             intentAt: null,
//             prevActiveAt: null,
//         })

//         const setCurrentTab = (currentTab: string) => setTabState({ ...tabState, currentTab })
//         const setIntentIndicator = (intentAt: LayoutRectangle | null) => setTabState({ ...tabState, intentAt })
//         const setActiveIndicator = (activeAt: LayoutRectangle | null) =>
//             setTabState({ ...tabState, prevActiveAt: tabState.activeAt, activeAt })
//         const { activeAt, intentAt, prevActiveAt, currentTab } = tabState

//         // 1 = right, 0 = nowhere, -1 = left
//         const direction = (() => {
//             if (!activeAt || !prevActiveAt || activeAt.x === prevActiveAt.x) {
//                 return 0
//             }
//             return activeAt.x > prevActiveAt.x ? -1 : 1
//         })()

//         const handleOnInteraction: TabsTabProps['onInteraction'] = (type, layout) => {
//             if (type === 'select') {
//                 setActiveIndicator(layout)
//             } else {
//                 setIntentIndicator(layout)
//             }
//         }

//         useEffect(() => {
//             console.log({userProfileData})
//         }, [userProfileData])

//         const TabsRovingIndicator = ({ active, ...props }: { active?: boolean } & StackProps) => {
//         return (
//             <YStack
//                 position="absolute"
//                 backgroundColor="$color5"
//                 opacity={0.7}
//                 animation="100ms"
//                 enterStyle={{
//                     opacity: 0,
//                 }}
//                 exitStyle={{
//                     opacity: 0,
//                 }}
//                 {...(active && {
//                     backgroundColor: '$color8',
//                     opacity: 0.6,
//                 })}
//                 {...props}
//             />
//         )
//     }

//         return (
//             <TabsTamagui
//                 // className='bg-transparent mt-5'
//                 backgroundColor={"$colorTransparent"}
//                 value={currentTab}
//                 onValueChange={setCurrentTab}
//                 orientation="horizontal"
//                 size="$4"
//                 marginTop="$3"
//                 flexDirection="column"
//                 activationMode="manual"
//                 borderRadius="$4"
//                 position="relative"
//             >
//                 <View className='justify-between w-full bg-[#5B5B5B] rounded-[50px]'>
//                     <AnimatePresence>
//                         {intentAt && (
//                             <TabsRovingIndicator
//                                 className='bg-black text-white rounded-[40px]'
//                                 borderRadius="$4"
//                                 width={intentAt.width}
//                                 height={intentAt.height}
//                                 x={intentAt.x}
//                                 y={intentAt.y}
//                             />
//                         )}
//                     </AnimatePresence>
//                     <AnimatePresence>
//                         {activeAt && (
//                             <TabsRovingIndicator
//                                 className='bg-black text-white rounded-[40px]'
//                                 theme="active"
//                                 width={activeAt.width}
//                                 height={activeAt.height}
//                                 x={activeAt.x}
//                                 y={activeAt.y}
//                             />
//                         )}
//                     </AnimatePresence>

//                     <TabsTamagui.List
//                         unstyled
//                         disablePassBorderRadius
//                         loop={false}
//                         gap="$2"
//                         backgroundColor={"$colorTransparent"}
//                         justifyContent="space-between"
//                     >
//                         <TabsTamagui.Tab
//                             unstyled
//                             paddingVertical="$2"
//                             paddingHorizontal="$3"
//                             marginVertical="$1.5"
//                             marginHorizontal="$1.5"
//                             value="profile"
//                             flex={1}
//                             justifyContent='center'
//                             alignItems='center'
//                             borderRadius={50}
//                             onInteraction={handleOnInteraction}
//                         >
//                             <SizableText
//                                 className={`font-firamedium text-white`}>Profile</SizableText>
//                         </TabsTamagui.Tab>
//                         <TabsTamagui.Tab
//                             unstyled
//                             paddingVertical="$2"
//                             paddingHorizontal="$3"
//                             marginVertical="$1.5"
//                             marginHorizontal="$1.5"
//                             value="photos"
//                             flex={1}
//                             justifyContent='center'
//                             alignItems='center'
//                             borderRadius={50}
//                             onInteraction={handleOnInteraction}
//                         >
//                             <SizableText
//                                 className={`font-firamedium text-white`}>Photos</SizableText>
//                         </TabsTamagui.Tab>
//                         <TabsTamagui.Tab
//                             unstyled
//                             paddingVertical="$2"
//                             paddingHorizontal="$3"
//                             marginVertical="$1.5"
//                             marginHorizontal="$1.5"
//                             value="interest"
//                             flex={1}
//                             justifyContent='center'
//                             alignItems='center'
//                             borderRadius={50}
//                             onInteraction={handleOnInteraction}
//                         >
//                             <SizableText
//                                 className={`font-firamedium text-white`}>Interests</SizableText>
//                         </TabsTamagui.Tab>
//                     </TabsTamagui.List>
//                 </View>
//                     <AnimatePresence exitBeforeEnter custom={{ direction }} initial={false}>
//                         <AnimatedYStack key={currentTab}>
//                             <TabsTamagui.Content value={currentTab} forceMount flex={1} className='mt-6' justifyContent="center">
//                                 {currentTab === 'profile' && <BasicInfo editable={true} userProfileData={userProfileData?.userProfileData} userSpecificationData={userProfileData?.userSpecificationData} />}
//                                 {currentTab === 'photos' && <UserPhotos editable={true} userPhotos={userProfileData!.photosData} />}
//                                 {currentTab === 'interest' && <UserInterests interests={userProfileData!.userProfileData.interest} />}
//                             </TabsTamagui.Content>
//                         </AnimatedYStack>
//                     </AnimatePresence>
//             </TabsTamagui>
//         )
//     }

export default MyProfile;