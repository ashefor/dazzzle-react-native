import { SafeAreaView as SafeAreaViewIOS, StyleSheet, Text, Image, View, ImageBackground, ScrollView, TouchableOpacity, Animated, LayoutRectangle, Platform, Alert, ActivityIndicator } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { AlertDialog, AnimatePresence, Avatar, Button, ListItem, Popover, PopoverProps, Separator, SizableText, StackProps, styled, Tabs, TabLayout, TabsTabProps, XStack, YGroup, YStack } from 'tamagui';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import ArrowBackIcon from '@/components/icons/ArrowBackIcon';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView as SafeAreaViewAndroid, useSafeAreaInsets } from 'react-native-safe-area-context';
import Images from '@/constants/images';
import BasicInfo from '../../components/BasicInfo';
import UserPhotos from '../../components/UserPhotos';
import UserInterests from '../../components/UserInterests';
import { useAxiosContext } from '@/context/AxiosProvider';
import { ReactionCodes } from '@/models/general';
import { SingleUserDetails } from '@/models/user';
// import SkeletonLoading from 'expo-skeleton-loading'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { swipeLeftAsync, swipeRightAsync } from '@/redux/thunks/swipeActions';
import { useAppDispatch } from '@/hooks/reduxHooks';
import {  MaterialTabBar, MaterialTabBarProps } from 'react-native-collapsible-tab-view'


const SafeArea = Platform.OS === 'ios' ? SafeAreaViewIOS : SafeAreaViewAndroid;

const AnimatedSafeAreaView = Animated.createAnimatedComponent(SafeArea);
const AnimatedView = Animated.createAnimatedComponent(View);

const User = () => {
    const { userName } = useLocalSearchParams();
        const insets = useSafeAreaInsets();
      const dispatch = useAppDispatch();
    const { axiosRequest } = useAxiosContext();
    const scrollY = useRef(new Animated.Value(0)).current;
    const [userDetails, setUserDetails] = useState<SingleUserDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Interpolate background color based on scroll position
    const headerBackgroundColor = scrollY.interpolate({
        inputRange: [0, 100], // Change as per your scroll distance
        outputRange: ['transparent', '#1A1A1A'], // From white to blue
        extrapolate: 'clamp',
    });

    const headerOpacity = scrollY.interpolate({
        inputRange: [150, 250], // Adjust range to control when opacity starts and ends
        outputRange: [0, 1], // From invisible to fully visible
        extrapolate: 'clamp',
    });

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

    const fetchUserDetails = async () => {
        try {
            setIsLoading(true);
            const { data } = await axiosRequest.get(`/${userName}/get-user-profile-data`, { headers: { 'hide-loader': 'true' } });
            if (data.reaction === ReactionCodes.SUCCESS) {
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

    const dislikeUser = async () => {
        const userId = userDetails?.userData.userId;
        if (userId) {
            dispatch(swipeLeftAsync(userId.toString())).unwrap().then((result) => {
                fetchUserDetails();
            });;
        } else {
            console.error('user id not found');
        }
    }

    const likeUser = async () => {
        const userId = userDetails?.userData.userId;
        if (userId) {
            dispatch(swipeRightAsync(userId.toString())).unwrap().then((result) => {
                fetchUserDetails();
            });
        } else {
            console.error('user id not found');
        }
    }


    const handleBlockUser = async () => {
        try {
            const params = {
                block_user_id: userDetails?.userData.userId
            }
            const { data } = await axiosRequest.post(`/block-user`, params);
            if (data.reaction === ReactionCodes.SUCCESS) {
                setUserDetails((prevUserDetails) => {
                    return {
                        ...prevUserDetails!,
                        blockByMeUser: true
                    }
                })
            }
        } catch (error) {
            console.log(error);
        }
    }

    const unblockUser = async () => {
        try {
            const userId = userDetails?.userData.userId;
            const params = {
                block_user_id: userDetails?.userData.userId
            }
            const { data } = await axiosRequest.post(`${userId}/unblock-user-data`, {});
            console.log('user data from unblock', data);
            if (data.reaction === ReactionCodes.SUCCESS) {
                setUserDetails((prevUserDetails) => {
                    return {
                        ...prevUserDetails!,
                        blockByMeUser: false
                    }
                })
            }
        } catch (error) {
            console.log(error);
        }
    }

    const HeaderComponent = () => {
        return (
            userDetails ? (
                            <YStack >
                                <View className='py-5 px-4 space-y-2'>
                                <YStack gap="$3">
                                        <XStack alignItems="center" gap="$4" justifyContent='center'>
                                            <View className='rounded-full relative'>
                                                {userDetails.isPremiumUser && 
                                                <MaterialCommunityIcons name="crown-circle-outline" size={24} color="#FFD700" style={{ position: 'absolute', right: 0, bottom: 5, zIndex: 5 }}/>
                                                }
                                                <Avatar className='' gap="$2" circular size="$10">
                                                    <Avatar.Image
                                                        accessibilityLabel="Nate Wienert"
                                                        src={userDetails?.userData.profilePicture}
                                                    />
                                                    <Avatar.Fallback delayMs={600} backgroundColor="$black12" />
                                                </Avatar>
                                            </View>
                                        </XStack>
                                        <Text className='text-lg font-firasemibold text-center text-white'>
                                            {userDetails?.userData.first_name} {userDetails?.userData.last_name} {userDetails?.userData.userAge && `(${userDetails?.userData.userAge})`}
                                        </Text>
                                        {userDetails?.userProfileData.aboutMe && <Text className='text-sm font-firaregular text-center text-white'>
                                            {userDetails?.userProfileData.aboutMe}
                                        </Text>}
                                    </YStack>
                                    {userDetails?.blockByMeUser ? <View className='mt-10 py-4'>
                                        <Text className='text-lg font-firasemibold text-center text-white'>{userDetails?.userData.userName} is blocked</Text>
                                    </View> : userDetails.isBlockUser ? <View>
                                        <Text className='text-lg font-firasemibold text-center text-white'>{userDetails?.userData.userName} has blocked you</Text>
                                    </View> : <TabsAdvancedBackground />}
                                </View>
                            </YStack>
                        ) :
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


    const createBlockNotificationAlert = () =>
        Alert.alert(`Block @${userDetails?.userData.userName}`, 'Are you sure you want to block this user?', [
            {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            { text: 'Block', style: 'destructive', onPress: () => handleBlockUser() },
        ]);

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
                className='bg-transparent mt-5'
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
                {/* <AnimatePresence>
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
                    </AnimatePresence> */}

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
                                className={`font-firamedium text-black`}>Profile</SizableText>
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
                                className={`font-firamedium text-black`}>Photos</SizableText>
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
                                className={`font-firamedium text-black`}>Interests</SizableText>
                        </Tabs.Tab>
                    </Tabs.List>
                </View>

                <AnimatePresence exitBeforeEnter custom={{ direction }} initial={false}>
                    <AnimatedYStack key={currentTab}>
                        <Tabs.Content value={currentTab} forceMount flex={1} className='mt-6' justifyContent="center">
                            {currentTab === 'profile' && <BasicInfo userProfileData={userDetails?.userProfileData} userSpecificationData={userDetails?.userSpecificationData} />}
                            {currentTab === 'photos' && <UserPhotos userPhotos={userDetails!.photosData} />}
                            {currentTab === 'interest' && <UserInterests interests={userDetails!.userProfileData.interest} />}
                        </Tabs.Content>
                    </AnimatedYStack>
                </AnimatePresence>
            </Tabs>
        )
    }


    const UserMoreActionsPopover = ({
        Icon,
        ...props
    }: PopoverProps & { Icon?: any; Name?: string; shouldAdapt?: boolean }) => {
        return (
            <Popover size="$2" allowFlip {...props} placement="bottom-end">
                <Popover.Trigger asChild>
                    <Button unstyled>
                        <Ionicons name="ellipsis-vertical-sharp" size={24} color="#ffffff" />
                    </Button>
                </Popover.Trigger>

                <Popover.Content
                    unstyled
                    enterStyle={{ y: -10, opacity: 0 }}
                    exitStyle={{ y: -10, opacity: 0 }}
                    elevate
                    animation={[
                        'quick',
                        {
                            opacity: {
                                overshootClamping: true,
                            },
                        },
                    ]}
                >
                    <YStack>
                        <Popover.Close asChild>
                            <YGroup alignSelf="center" width={240} size="$4" separator={<Separator />}>
                                {userDetails && !userDetails.blockByMeUser && <YGroup.Item>
                                    <ListItem className='bg-[#5B5B5B]' onPress={createBlockNotificationAlert}>
                                        <Text className='text-base text-white'> Block @{userDetails?.userData.userName}
                                        </Text>
                                    </ListItem>
                                </YGroup.Item>}
                                {userDetails && userDetails.blockByMeUser && <YGroup.Item>
                                    <ListItem className='bg-[#5B5B5B]' onPress={unblockUser}>
                                        <Text className='text-base text-white'> Unblock @{userDetails?.userData.userName}
                                        </Text>
                                    </ListItem>
                                </YGroup.Item>}
                                <YGroup.Item>
                                    <ListItem className='bg-[#5B5B5B]'>
                                        <Text className='text-base text-white'>Report</Text>
                                    </ListItem>
                                </YGroup.Item>
                            </YGroup>
                        </Popover.Close>
                    </YStack>
                </Popover.Content>
            </Popover>
        )
    }

    const hasUserLikedOrDisliked = (likeData: {like: number, _id: number}[] | {like: number, _id: number}) => {
        if (likeData && Array.isArray(likeData)) {
            return likeData.some((like) => like.like == 1)
        } else if (likeData && typeof likeData === 'object') {
            return likeData.like == 0
        } else {
            return false
        }
    }

    // const UserMoreActionsPopover = () => {
    //     return (
    //         <Menu>
    //   <MenuTrigger text='Select action' />
    //   <MenuOptions>
    //     <MenuOption onSelect={() => alert(`Save`)} text='Save' />
    //     <MenuOption onSelect={() => alert(`Delete`)} >
    //       <Text style={{color: 'red'}}>Delete</Text>
    //     </MenuOption>
    //     <MenuOption onSelect={() => alert(`Not called`)} disabled={true} text='Disabled' />
    //   </MenuOptions>
    // </Menu>
    //     )
    // }

    const hasUserLiked = useCallback((likeData: { like: number, _id: number }[] | { like: number, _id: number }) => {
        if (likeData && Array.isArray(likeData)) {
            return likeData.some((like) => like.like == 1)
        } else if (likeData && typeof likeData === 'object') {
            return likeData.like == 1
        } else {
            return false
        }
    }, [userDetails?.userLikeData])

    const hasUserDisliked = useCallback((likeData: { like: number, _id: number }[] | { like: number, _id: number }) => {
        if (likeData && Array.isArray(likeData)) {
            return likeData.some((like) => like.like == 0)
        } else if (likeData && typeof likeData === 'object') {
            return likeData.like == 0
        } else {
            return false
        }
    }, [userDetails?.userLikeData])

    return (
        <View className='flex-1 bg-primary h-full'>
            <Stack.Screen
                    options={{
                        headerStyle: { backgroundColor: 'transparent' },
                        headerShown: true,
                        headerTransparent: true,
                        header: (props) => <View>
                            {/* <AnimatedSafeAreaView style={{ backgroundColor: headerBackgroundColor, }} /> */}
                            <AnimatedView style={{ backgroundColor: headerBackgroundColor, paddingTop: insets.top }} />
                            <Animated.View style={[styles.header, { backgroundColor: headerBackgroundColor }]}>
                                <TouchableOpacity onPress={() => router.back()} className='flex items-center justify-center'>
                                    <ArrowBackIcon />
                                </TouchableOpacity>
                                <Animated.Text style={[styles.title, { opacity: headerOpacity }]} className='font-firabold text-center'>{userDetails?.userData.first_name} {userDetails?.userData.last_name}</Animated.Text>
                                {userDetails && !userDetails.isBlockUser && <UserMoreActionsPopover
                                    placement="bottom"
                                />}
                            </Animated.View>
                        </View>
                    }}
                />
            <ScrollView  className='h-full bg-primary relative'
                onScroll={
                    Animated.event(
                        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                        { useNativeDriver: false } // For color interpolation, native driver must be false
                    )
                }
                scrollEventThrottle={16}

            >
                <View className='bg-[#1A1A1A] h-full relative pb-32 flex-1'>
                    <View className='h-[150px]'>
                        <ImageBackground source={{ uri: userDetails?.userData.coverPicture }} className='w-full h-full' resizeMode='cover' >
                            <View className='h-full w-full bg-black/[0.8]'>

                            </View>
                        </ImageBackground>
                    </View>
                    {isLoading ? <View className='py-5 px-4 space-y-3'>
                    <ActivityIndicator size="large" color="#fff" />
                    </View> : (
                        userDetails ? (
                            <YStack >
                                <View className='py-5 px-4 space-y-2'>
                                <YStack gap="$3">
                                        <XStack alignItems="center" gap="$4" justifyContent='center'>
                                            <View className='rounded-full relative'>
                                                {userDetails.isPremiumUser && 
                                                <MaterialCommunityIcons name="crown-circle-outline" size={24} color="#FFD700" style={{ position: 'absolute', right: 0, bottom: 5, zIndex: 5 }}/>
                                                }
                                                <Avatar className='' gap="$2" circular size="$10">
                                                    <Avatar.Image
                                                        accessibilityLabel="Nate Wienert"
                                                        src={userDetails?.userData.profilePicture}
                                                    />
                                                    <Avatar.Fallback delayMs={600} backgroundColor="$black12" />
                                                </Avatar>
                                            </View>
                                        </XStack>
                                        <Text className='text-lg font-firasemibold text-center text-white'>
                                            {userDetails?.userData.first_name} {userDetails?.userData.last_name} {userDetails?.userData.userAge && `(${userDetails?.userData.userAge})`}
                                        </Text>
                                        {userDetails?.userProfileData.aboutMe && <Text className='text-sm font-firaregular text-center text-white'>
                                            {userDetails?.userProfileData.aboutMe}
                                        </Text>}
                                    </YStack>
                                    {userDetails?.blockByMeUser ? <View className='mt-10 py-4'>
                                        <Text className='text-lg font-firasemibold text-center text-white'>{userDetails?.userData.userName} is blocked</Text>
                                    </View> : userDetails.isBlockUser ? <View>
                                        <Text className='text-lg font-firasemibold text-center text-white'>{userDetails?.userData.userName} has blocked you</Text>
                                    </View> : <TabsAdvancedBackground />}
                                </View>
                            </YStack>
                        ) :
                            <View className='py-5 px-4 space-y-2'>
                                <Text className='text-lg font-firasemibold text-center text-white'>User not found</Text>
                            </View>
                    )}

                </View>

            </ScrollView>
            {userDetails && !(userDetails.blockByMeUser || userDetails?.isBlockUser) && <View style={{bottom: insets.bottom}} className='absolute w-full py-7 items-center justify-center'>
                <XStack alignItems='center' flex={1} gap="$4" justifyContent='center'>
                    <Button onPress={dislikeUser} className='w-[60px] h-[60px] bg-white flex items-center justify-center rounded-full' unstyled>
                        <FontAwesome name="close" size={36} color={hasUserDisliked(userDetails.userLikeData) ? "#EB4242" : "#cccccc"} />
                        {/* #EB4242 */}
                    </Button>
                    <Button onPress={() => router.navigate({
                        pathname: '/single-chat/[userId]',
                        params: { userId: userDetails?.userData.userId }
                    })} className='w-[60px] h-[60px] bg-white flex items-center justify-center rounded-full' unstyled>
                        <Ionicons name="chatbox-ellipses" size={24} color="#59C526" />
                    </Button>
                    <Button onPress={likeUser} className='w-[60px] h-[60px] bg-white flex items-center justify-center rounded-full' unstyled>
                        <Ionicons name="heart" size={36} color={hasUserLiked(userDetails.userLikeData) ? "#EB4242" : "#cccccc"} />
                    </Button>
                </XStack>
            </View>}
            {/* <SafeArea /> */}
        </View>
    )
}

export default User;

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        // height: Platform.OS === 'android' ? 97 : 'auto',
        // height: 97,
        minHeight: 44,
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: 'transparent',
        borderBottomWidth: 0,
        borderBottomColor: '#ddd',
    },
    iconContainer: {
        padding: 8,
    },
    title: {
        flex: 1,
        // position: 'absolute',
        // left: 0,
        // right: 0,
        textAlign: 'center',
        fontWeight: 700,
        fontSize: 20,
        fontFamily: "FiraSans_700Bold",
        color: 'white',
    },
});