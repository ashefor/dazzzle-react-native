import { SafeAreaView, Text, Image, View, ScrollView, TouchableOpacity, Animated, Dimensions, StatusBar } from 'react-native';
import Images from '@/constants/images';
import React, { useEffect, useRef, useState } from 'react'
import { AnimatePresence, Avatar, Button, SizableText, StackProps, styled, TabLayout, Tabs, TabsTabProps, XStack, YStack } from 'tamagui';
import { router, Stack } from 'expo-router';
import ArrowBackIcon from '@/components/icons/ArrowBackIcon';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import UserPhotos from '../../../components/UserPhotos';
import BasicInfo from '@/components/BasicInfo';
import UserInterests from '@/components/UserInterests';
import { getItem } from '@/utils/asyncStorage';
import { LoggedInUser, LoggedInUserProfile, SingleUserDetails } from '@/models/user';
import { useAxiosContext } from '@/context/AxiosProvider';
import { ReactionCodes } from '@/models/general';

const MyProfile = () => {
    const { axiosRequest } = useAxiosContext();
    const [isLoading, setIsLoading] = useState(true);
    const [userDetails, setUserDetails] = useState<SingleUserDetails | null>(null);
    const [loggedInUserProfile, setLoggedInUserProfile] = useState<LoggedInUserProfile | null>(null);
    const scrollY = useRef(new Animated.Value(0)).current;

    const fetchUserDetails = async () => {
        try {
            setIsLoading(true);
            const {profile} = await getItem('dazzzle-user') as LoggedInUser;
            setLoggedInUserProfile(profile);
            const userName = profile.username;
            const { data } = await axiosRequest.get(`/${userName}/get-user-profile-data`, { headers: { 'hide-loader': 'true' } });
            if (data.reaction === ReactionCodes.SUCCESS) {
                console.log('user details', data.data);
                const user = data.data;
                setUserDetails(user);
                setIsLoading(false);
            }
        } catch (error) {
            setIsLoading(false);
        }
    }
    
    useEffect(() => {
        fetchUserDetails();
    }, [])

    const AnimatedYStack = styled(YStack, {
        flex: 1,
        x: 0,
        opacity: 1,

        animation: '100ms',
        variants: {
            // 1 = right, 0 = nowhere, -1 = left
            direction: {
                ':number': (direction) => ({
                    enterStyle: {
                        x: direction > 0 ? -25 : 25,
                        opacity: 0,
                    },
                    exitStyle: {
                        zIndex: 0,
                        x: direction < 0 ? -25 : 25,
                        opacity: 0,
                    },
                }),
            },
        } as const,
    })

    const TabsRovingIndicator = ({ active, ...props }: { active?: boolean } & StackProps) => {
        return (
            <YStack
                position="absolute"
                backgroundColor="$color5"
                opacity={0.7}
                animation="100ms"
                enterStyle={{
                    opacity: 0,
                }}
                exitStyle={{
                    opacity: 0,
                }}
                {...(active && {
                    backgroundColor: '$color8',
                    opacity: 0.6,
                })}
                {...props}
            />
        )
    }

    const TabsAdvancedBackground = () => {
        const [tabState, setTabState] = React.useState<{
            currentTab: string
            /**
             * Layout of the Tab user might intend to select (hovering / focusing)
             */
            intentAt: TabLayout | null
            /**
             * Layout of the Tab user selected
             */
            activeAt: TabLayout | null
            /**
             * Used to get the direction of activation for animating the active indicator
             */
            prevActiveAt: TabLayout | null
        }>({
            activeAt: null,
            currentTab: 'profile',
            intentAt: null,
            prevActiveAt: null,
        })

        const setCurrentTab = (currentTab: string) => setTabState({ ...tabState, currentTab })
        const setIntentIndicator = (intentAt: LayoutRectangle | null) => setTabState({ ...tabState, intentAt })
        const setActiveIndicator = (activeAt: LayoutRectangle | null) =>
            setTabState({ ...tabState, prevActiveAt: tabState.activeAt, activeAt })
        const { activeAt, intentAt, prevActiveAt, currentTab } = tabState

        // 1 = right, 0 = nowhere, -1 = left
        const direction = (() => {
            if (!activeAt || !prevActiveAt || activeAt.x === prevActiveAt.x) {
                return 0
            }
            return activeAt.x > prevActiveAt.x ? -1 : 1
        })()

        const handleOnInteraction: TabsTabProps['onInteraction'] = (type, layout) => {
            if (type === 'select') {
                setActiveIndicator(layout)
            } else {
                setIntentIndicator(layout)
            }
        }

        return (
            <Tabs
                // className='bg-transparent mt-5'
                        backgroundColor={"$colorTransparent"}
                value={currentTab}
                onValueChange={setCurrentTab}
                orientation="horizontal"
                size="$4"
                marginTop="$3"
                flexDirection="column"
                activationMode="manual"
                borderRadius="$4"
                position="relative"
            >
                <View className='justify-between w-full bg-[#5B5B5B] rounded-[50px]'>
                <AnimatePresence>
                        {intentAt && (
                            <TabsRovingIndicator
                                className='bg-black text-white rounded-[40px]'
                                borderRadius="$4"
                                width={intentAt.width}
                                height={intentAt.height}
                                x={intentAt.x}
                                y={intentAt.y}
                            />
                        )}
                    </AnimatePresence>
                    <AnimatePresence>
                        {activeAt && (
                            <TabsRovingIndicator
                                className='bg-black text-white rounded-[40px]'
                                theme="active"
                                width={activeAt.width}
                                height={activeAt.height}
                                x={activeAt.x}
                                y={activeAt.y}
                            />
                        )}
                    </AnimatePresence>

                    <Tabs.List
                        unstyled
                        disablePassBorderRadius
                        loop={false}
                        gap="$2"
                        backgroundColor={"$colorTransparent"}
                        justifyContent="space-between"
                    >
                        <Tabs.Tab
                            unstyled
                            paddingVertical="$2"
                            paddingHorizontal="$3"
                            marginVertical="$1.5"
                            marginHorizontal="$1.5"
                            value="profile"
                            flex={1}
                            justifyContent='center'
                            alignItems='center'
                            borderRadius={50}
                            onInteraction={handleOnInteraction}
                        >
                            <SizableText
                                className={`font-firamedium text-white`}>Profile</SizableText>
                        </Tabs.Tab>
                        <Tabs.Tab
                            unstyled
                            paddingVertical="$2"
                            paddingHorizontal="$3"
                            marginVertical="$1.5"
                            marginHorizontal="$1.5"
                            value="photos"
                            flex={1}
                            justifyContent='center'
                            alignItems='center'
                            borderRadius={50}
                            onInteraction={handleOnInteraction}
                        >
                            <SizableText
                                className={`font-firamedium text-white`}>Photos</SizableText>
                        </Tabs.Tab>
                        <Tabs.Tab
                            unstyled
                            paddingVertical="$2"
                            paddingHorizontal="$3"
                            marginVertical="$1.5"
                            marginHorizontal="$1.5"
                            value="interest"
                            flex={1}
                            justifyContent='center'
                            alignItems='center'
                            borderRadius={50}
                            onInteraction={handleOnInteraction}
                        >
                            <SizableText
                                className={`font-firamedium text-white`}>Interests</SizableText>
                        </Tabs.Tab>
                    </Tabs.List>
                </View>

                <AnimatePresence exitBeforeEnter custom={{ direction }} initial={false}>
                    <AnimatedYStack key={currentTab}>
                        <Tabs.Content value={currentTab} forceMount flex={1} className='mt-6' justifyContent="center">
                            {currentTab === 'profile' && <BasicInfo editable={true} userProfileData={userDetails?.userProfileData} userSpecificationData={userDetails?.userSpecificationData}/>}
                            {currentTab === 'photos' && <UserPhotos editable={true} userPhotos={userDetails!.photosData} />}
                            {currentTab === 'interest' && <UserInterests interests={userDetails!.userProfileData.interest}/>}
                        </Tabs.Content>
                    </AnimatedYStack>
                </AnimatePresence>
            </Tabs>
        )
    }

    return (
        <View className='flex-1 bg-primary h-full'>
            <ScrollView className='h-full bg-primary relative'
                onScroll={
                    Animated.event(
                        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                        { useNativeDriver: false } // For color interpolation, native driver must be false
                    )
                }
                scrollEventThrottle={16}

            >
                <Stack.Screen
                    options={{
                        headerTitle: 'My Profile',
                        headerStyle: { backgroundColor: '#1A1A1A' },
                        headerLeft: () => <TouchableOpacity onPress={() => router.back()} className='flex items-center justify-center pr-4 w-9 h-8'>
                            <ArrowBackIcon />
                        </TouchableOpacity>,
                        headerRight: () => <TouchableOpacity>
                            <Text className='text-white font-firamedium text-sm'>
                                Edit 
                            </Text>
                        </TouchableOpacity>
                    }}
                />
                {loggedInUserProfile && <View className='bg-[#1A1A1A] h-full relative flex-1'>
                    <YStack >
                        <View className='py-5 px-4'>
                        <YStack gap="$5">
                                <XStack alignItems="center" gap="$4" justifyContent='center'>
                                    <View className='rounded-full'>
                                        <Avatar className='' gap="$2" circular size="$10">
                                            <Avatar.Image
                                                accessibilityLabel="Nate Wienert"
                                                src={loggedInUserProfile.profile_picture_url ? loggedInUserProfile.profile_picture_url : 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?&w=100&h=100&dpr=2&q=80'}
                                            />
                                            <Avatar.Fallback delayMs={600} backgroundColor="$black12" />
                                        </Avatar>
                                    </View>
                                </XStack>
                                <YStack>
                                    <Text className='text-lg font-firasemibold text-center text-white'>
                                        {loggedInUserProfile.first_name} {loggedInUserProfile.last_name}
                                    </Text>
                                    {loggedInUserProfile.about_me && <Text className='text-sm font-firaregular text-center text-white'>
                                    {loggedInUserProfile.about_me}
                                    </Text>}
                                </YStack>
                            </YStack>
                            <TabsAdvancedBackground />
                        </View>

                    </YStack>
                </View>}

            </ScrollView>
        </View>
    )
}

export default MyProfile;