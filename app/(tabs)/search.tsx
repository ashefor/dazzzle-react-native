import { View, LayoutRectangle, Image, Modal, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert, useWindowDimensions, ImageBackground, TouchableWithoutFeedback, ActivityIndicator, FlatList, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { StackProps, YStack, TabLayout, TabsTabProps, Tabs, AnimatePresence, SizableText, styled, Text, XStack } from 'tamagui'
import UsersBasicFilter, { BasicFilter } from '@/components/UsersBasicFilter';
import { router, Stack } from 'expo-router';
import icons from '@/constants/icons';
import Images from '@/constants/images'
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAxiosContext } from '@/context/AxiosProvider';
import { ReactionCodes } from '@/models/general';
import { LikedUserProfile } from '@/models/user';
import Header from '@/components/Header';

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
        currentTab: 'basic',
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
            className='bg-transparent mt-5 h-full'
            value={currentTab}
            onValueChange={setCurrentTab}
            orientation="horizontal"
            width={'auto'}
            flexDirection="column"
            activationMode="manual"
            backgroundColor="$background"
            borderRadius="$4"
            position="relative"
        >
            <YStack className='w-full bg-[#5B5B5B] ' alignSelf='center' justifyContent="space-between">
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
                    disablePassBorderRadius
                    loop={false}
                    gap="$2"
                    justifyContent="space-between"
                >
                    <Tabs.Tab
                        unstyled
                        paddingVertical="$2"
                        paddingHorizontal="$1"
                        marginVertical="$1"
                        marginHorizontal="$1"
                        value="basic"
                        flex={1}
                        onInteraction={handleOnInteraction}
                    >
                        <SizableText
                            className='text-white text-sm'>Personal</SizableText>
                    </Tabs.Tab>
                    <Tabs.Tab
                        unstyled
                        paddingVertical="$2"
                        paddingHorizontal="$1"
                        marginVertical="$1"
                        marginHorizontal="$1"
                        flex={1}
                        value="advanced"
                        onInteraction={handleOnInteraction}
                    >
                        <SizableText
                            className='text-white text-sm'>Looks</SizableText>
                    </Tabs.Tab>
                    <Tabs.Tab
                        unstyled
                        paddingVertical="$2"
                        paddingHorizontal="$1"
                        marginVertical="$1"
                        marginHorizontal="$1"
                        flex={1}
                        value="advanced"
                        onInteraction={handleOnInteraction}
                    >
                        <SizableText
                            className='text-white text-sm'>Personality</SizableText>
                    </Tabs.Tab>

                    <Tabs.Tab
                        unstyled
                        paddingVertical="$2"
                        paddingHorizontal="$1"
                        marginVertical="$1"
                        marginHorizontal="$1"
                        flex={1}
                        value="advanced"
                        onInteraction={handleOnInteraction}
                    >
                        <SizableText
                            className='text-white text-sm'>Lifestyle</SizableText>
                    </Tabs.Tab>


                </Tabs.List>
            </YStack>

            <AnimatePresence exitBeforeEnter custom={{ direction }} initial={false}>
                <AnimatedYStack key={currentTab} className=''>
                    <Tabs.Content value={currentTab} forceMount flex={1} className=' py-6 h-full' justifyContent="center">
                        {currentTab === 'basic' && <UsersBasicFilter />}
                        {/* {currentTab === 'advanced' && <UserPhotos />} */}
                    </Tabs.Content>
                </AnimatedYStack>
            </AnimatePresence>
        </Tabs>
    )
}

const FilterUsers = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const { axiosRequest } = useAxiosContext();
    const { width } = useWindowDimensions();
    const numColumns = width > 600 ? 3 : width > 991 ? 4 : 2;
    const [users, setUsers] = useState<LikedUserProfile[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [isFiltering, setIsFiltering] = useState(false);
    const [filterParams, setFilterParams] = useState<BasicFilter | null>(null)

    const fetchLikedUsers = async (pageUrl = '/get-featured-user-data', hideLoader = true) => {
        try {
            setLoading(true);
            const { data } = await axiosRequest.get(pageUrl, { headers: { 'hide-loader': hideLoader ? 'true' : 'false' } });
            if (data.reaction === ReactionCodes.SUCCESS) {
                const { getFeatureUserList } = data.data;
                // setUsers(prevUsers => [...prevUsers, ...getFeatureUserList]);
                setUsers(getFeatureUserList);
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error('Error fetching liked users:', error);
        }
    };

    const refreshUsers = async () => {
        try {
            setRefreshing(true);
            const { data } = await axiosRequest.get('/get-featured-user-data', { headers: { 'hide-loader': 'true' } });
            if (data.reaction === ReactionCodes.SUCCESS) {
                const { getFeatureUserList, totalCount, nextPageUrl } = data.data;
                setUsers(getFeatureUserList);
            }
            setRefreshing(false);
        } catch (error) {
            setRefreshing(false);
        }
    }

    const handleLoadMore = async () => {
        // if (paginationDetails?.nextPageUrl) {
        //     fetchLikedUsers(paginationDetails.nextPageUrl);
        // }
        fetchLikedUsers('/get-featured-user-data');
    };


    useEffect(() => {
        fetchLikedUsers('/get-featured-user-data', false);
    }, []);

    const filterUsers = async(params: BasicFilter) => {
        try {
            const filterParams = {
                username: params.username,
                min_age: params.age[0].toString(),
                max_age: params.age[1].toString(),
                looking_for: params.looking_for,
                distance: params.distance
            } as {
                username: string;
                min_age: string;
                max_age: string
                looking_for: string;
                distance: string;
            }
            const searchParams = new URLSearchParams(filterParams);
            setModalVisible(false);
            setFilterParams(params);
            setUsers([]);
            const { data } = await axiosRequest.get(`/find-matches-data?${searchParams.toString()}`, { headers: { 'hide-loader': 'true' } });
            if (data.reaction === ReactionCodes.SUCCESS) {
                const { filterData } = data.data;
                setUsers([...filterData]);
            }
        } catch (error) {
        }
    }

    const clearFilter = () => {
        setFilterParams(null);
        setUsers([]);
    }

    return (
        <>
            {/* <Stack.Screen options={{
                headerRight: () => <XStack gap={'$4'} className='px-4'>
                    <TouchableOpacity onPress={() => setModalVisible(true)} className=' flex items-center justify-center rounded-full'>
                        <Image source={icons.filter} className='w-6 h-6' resizeMode='contain' />
                    </TouchableOpacity>
                </XStack>,
            }} /> */}
            <Header.Default title='Search' rightContent={<TouchableOpacity onPress={() => setModalVisible(true)} className=' flex items-center justify-center rounded-full'>
                        <Image source={icons.filter} className='w-6 h-6' resizeMode='contain' />
                    </TouchableOpacity>}></Header.Default>
            <View className='bg-[#1A1A1A] h-full'>
                {filterParams && <XStack justifyContent='space-between' alignItems='center' className='px-4 py-2'>
                <Text className='text-white'>Showing filter</Text>
                <TouchableOpacity onPress={clearFilter} className='items-center justify-center'>
                                {/* <Image source={icons.} className='w-6 h-6' resizeMode='contain' /> */}
                                <Ionicons name="close" size={24} color="#ffffff" />
                            </TouchableOpacity>
                </XStack>}
                <View style={{flexGrow: 1}} className='pb-[25%]'>
                <FlatList
                    className='p-1'
                    data={users}
                    keyExtractor={(item, index) => `${item._id}-${index}`}
                    numColumns={width > 600 ? 3 : width > 991 ? 4 : 2}
                    // onEndReached={filterParams ? null : handleLoadMore}
                    refreshing={refreshing}
                    onRefresh={() => refreshUsers()}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={refreshUsers}
                            tintColor='#fff'
                        />
                    }
                    onEndReachedThreshold={0.5}
                    ListEmptyComponent={
                        <View className='my-4 p-4'>
                            <View className='p-4 text-center bg-[#ccc] justify-center items-center rounded-md'>
                                <Text className='text-sm font-firamedium'>No users found</Text>
                            </View>
                        </View>
                    }
                    ListFooterComponent={loading ? <View className='p-3'><ActivityIndicator size={'large'} color={'#fff'} /></View> : null}
                    renderItem={
                        ({ item }) => (
                            <TouchableWithoutFeedback onPress={() => router.push(`/view-user/${item.username}`)} className=''>
                                <View className='m-2' style={{
                                    flex: 1 / numColumns,
                                    flexDirection: "row",
                                }}>
                                    <View className='w-full h-full rounded-xl overflow-hidden bg-red-500'>
                                        <ImageBackground resizeMode='cover' className='h-52 w-full rounded-xl flex-1 bg-[#ccc]' source={{ uri: item.userImageUrl }}>
                                            <View className='bg-black/[0.5] h-full flex flex-col justify-end p-4'>
                                                <Text className='text-sm font-firabold text-white'>{item.userFullName}</Text>
                                                {item.isPremiumUser && <Image source={icons.premium} className='w-5 h-5' resizeMode='contain' />}
                                            </View>
                                        </ImageBackground>
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                        )
                    }
                />
                </View>
            </View>
            <Modal
                animationType="slide"
                visible={modalVisible}
                presentationStyle="pageSheet"
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                    setModalVisible(!modalVisible);
                }}
            >
                <SafeAreaProvider>
                    <SafeAreaView className='bg-[#1A1A1A] h-full'>
                        <View className='bg-[#1A1A1A] flex-row items-center justify-center px-4 py-3 relative'>
                            <TouchableOpacity onPress={() => setModalVisible(false)} className='absolute z-10 left-4 items-center justify-center pr-4'>
                                {/* <Image source={icons.} className='w-6 h-6' resizeMode='contain' /> */}
                                <Ionicons name="close" size={24} color="#ffffff" />
                            </TouchableOpacity>
                            <Text className='font-firabold text-white text-center flex-1 mx-auto text-base'>Search filters</Text>
                        </View>
                        <UsersBasicFilter filterUsers={filterUsers}/>
                    </SafeAreaView>
                </SafeAreaProvider>
            </Modal>
        </>

    )
}

export default FilterUsers