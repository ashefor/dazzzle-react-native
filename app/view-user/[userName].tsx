import { SafeAreaView as SafeAreaViewIOS, StyleSheet, Text, Image, View, ImageBackground, ScrollView, TouchableOpacity, Animated, LayoutRectangle, Platform, Alert, ActivityIndicator } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { AlertDialog, AnimatePresence, Avatar, Button, ListItem, Popover, PopoverProps, Separator, SizableText, StackProps, styled, TabLayout, Tabs, TabsTabProps, XStack, YGroup, YStack } from 'tamagui';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import ArrowBackIcon from '@/components/icons/ArrowBackIcon';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView as SafeAreaViewAndroid } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Images from '@/constants/images';
import BasicInfo from '../../components/BasicInfo';
import UserPhotos from '../../components/UserPhotos';
import UserInterests from '../../components/UserInterests';
import { useAxiosContext } from '@/context/AxiosProvider';
import { ReactionCodes } from '@/models/general';
import { SingleUserDetails } from '@/models/user';
import SkeletonLoading from 'expo-skeleton-loading'
import icons from '@/constants/icons';


const SafeArea = Platform.OS === 'ios' ? SafeAreaViewIOS : SafeAreaViewAndroid;

const AnimatedSafeAreaView = Animated.createAnimatedComponent(SafeArea);

const User = () => {
    const { userName } = useLocalSearchParams();
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


    const handleLikeOrDislikeUser = async (likeOrDislike: string) => {
        try {
            const userId = userDetails?.userData.userId;
        const url = `/${userId}/${likeOrDislike}/user-like-dislike`;
        const {data} = await axiosRequest.post(url, {}, { headers: { 'hide-loader': 'true' } });
        if (data.reaction === ReactionCodes.SUCCESS) {
            fetchUserDetails();
        }
        } catch (error) {
            
        }
      };


    const handleBlockUser = async () => {
        try {
            const params = {
                block_user_id: userDetails?.userData.userId
            }
            console.log(params);
            const { data } = await axiosRequest.post(`/block-user`, params);
            console.log('user data from block', data);
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
            console.log(params);
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
            <Popover size="$2" allowFlip {...props}>
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
                    <YStack gap="$3">
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

    // const hasUserLikedOrDisliked = (likeData: {like: number, _id: number}[] | {like: number, _id: number}) => {
    //     if (likeData && Array.isArray(likeData)) {
    //         return likeData.some((like) => like.like == 1)
    //     } else if (likeData && typeof likeData === 'object') {
    //         return likeData.like == 0
    //     } else {
    //         return false
    //     }
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
                        headerStyle: { backgroundColor: 'red' },
                        headerShown: true,
                        headerTransparent: true,
                        header: (props) => <View>
                            <AnimatedSafeAreaView style={{ backgroundColor: headerBackgroundColor, }} />
                            <Animated.View style={[styles.header, { backgroundColor: headerBackgroundColor }]}>
                                <TouchableOpacity onPress={() => router.back()} className='flex items-center justify-center pr-4 w-9 h-8'>
                                    <ArrowBackIcon />
                                </TouchableOpacity>
                                <Animated.Text style={[styles.title, { opacity: headerOpacity }]} className='font-firabold text-center'>{userDetails?.userData.first_name} {userDetails?.userData.last_name}</Animated.Text>
                                {userDetails && <UserMoreActionsPopover
                                    placement="bottom"
                                />}
                            </Animated.View>
                        </View>
                    }}
                />
                <View className='bg-[#1A1A1A] h-full relative pb-24 flex-1'>
                    <View className='h-[150px]'>
                        <ImageBackground source={{ uri: userDetails?.userData.coverPicture }} className='w-full h-full' resizeMode='cover' >
                            <View className='h-full w-full bg-black/[0.8]'>

                            </View>
                        </ImageBackground>
                    </View>
                    {isLoading ? <View className='py-5 px-4 space-y-3'>
                        <SkeletonLoading background={"#adadad"} highlight={"#ffffff"}>
                        <View style={{ width: 100, height: 100, backgroundColor: "#adadad", marginLeft: 'auto', marginRight: 'auto', borderRadius: 100 }} />
                    </SkeletonLoading>
                    <SkeletonLoading background={"#adadad"} highlight={"#ffffff"}>
                        <View className='mt-2'>
                        <View style={{ backgroundColor: "#adadad", width: "40%", height: 10, marginLeft: 'auto', marginRight: 'auto', marginBottom: 3, borderRadius: 5 }} />
                           <View style={{ backgroundColor: "#adadad", width: "60%", height: 10, marginTop: 16, marginLeft: 'auto', marginRight: 'auto', marginBottom: 3, borderRadius: 5 }} />
                           <View style={{ backgroundColor: "#adadad", width: "75%", height: 10, marginLeft: 'auto', marginRight: 'auto', marginBottom: 16, borderRadius: 5 }} />
                        </View>
                    </SkeletonLoading>
                    <ActivityIndicator size="large" color="#fff" />
                    </View> : (
                        userDetails ? (
                            <YStack >
                                <View className='py-5 px-4 space-y-2'>
                                <YStack gap="$3">
                                        <XStack alignItems="center" gap="$4" justifyContent='center'>
                                            <View className='rounded-full relative'>
                                                {userDetails.isPremiumUser && <Image source={icons.premium} className='w-6 h-6 z-[1000]' resizeMode='contain' style={{ position: 'absolute', right: 0, bottom: 0 }}/>}
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
                                        <Text className='text-lg font-firasemibold text-center text-white'>@{userDetails?.userData.userName} is blocked</Text>
                                    </View> : <TabsAdvancedBackground />}
                                </View>
                            </YStack>
                        ) :
                            <View>

                            </View>
                    )}

                </View>

            </ScrollView>
            {userDetails && !userDetails.blockByMeUser && <View className='absolute bottom-0 w-full py-7 items-center justify-center'>
                <XStack alignItems='center' flex={1} gap="$4" justifyContent='center'>
                    <Button onPress={() => handleLikeOrDislikeUser('0')} className='w-[60px] h-[60px] bg-white flex items-center justify-center rounded-full' unstyled>
                        <FontAwesome name="close" size={36} color={hasUserDisliked(userDetails.userLikeData) ? "#EB4242" : "#cccccc"} />
                        {/* #EB4242 */}
                    </Button>
                    <Button className='w-[60px] h-[60px] bg-white flex items-center justify-center rounded-full' unstyled>
                        <Ionicons name="chatbox-ellipses" size={24} color="#59C526" />
                    </Button>
                    <Button onPress={() => handleLikeOrDislikeUser('1')} className='w-[60px] h-[60px] bg-white flex items-center justify-center rounded-full' unstyled>
                        <Ionicons name="heart" size={36} color={hasUserLiked(userDetails.userLikeData) ? "#EB4242" : "#cccccc"} />
                    </Button>
                </XStack>
                <SafeArea />
            </View>}
            <StatusBar style="light" />
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
        paddingHorizontal: 16,
        paddingVertical: 8,
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