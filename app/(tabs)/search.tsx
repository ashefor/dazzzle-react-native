import { View, Image, Modal, TouchableOpacity, Alert, useWindowDimensions, ImageBackground, TouchableWithoutFeedback, FlatList, RefreshControl, Text, ActivityIndicator } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { XStack } from 'tamagui'
import UsersBasicFilter, { BasicFilter } from '@/components/UsersBasicFilter';
import { router, Stack } from 'expo-router';
import icons from '@/constants/icons';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ReactionCodes } from '@/models/general';
import axiosRequest from '@/utils/axios';
import { useLoader } from '@/context/loader/LoaderProvider';

interface FeaturedUser {
  _id: number
  _uid: string
  username: string
  created_at: string
  userFullName: string
  profile_picture: string
  userImageUrl?: string
  userCoverUrl: string
  isPremiumUser: boolean
  id: number
  fullName: string
  profileImage?: string
  coverImage: string
  gender: string
  dob: string
  userAge: number
  countryName: string
  userOnlineStatus: number
  detailString: string
}
const FilterUsers = () => {
    const {show, hide} = useLoader();
    const [modalVisible, setModalVisible] = useState(false);
    const { width } = useWindowDimensions();
    const numColumns = width > 600 ? 3 : width > 991 ? 4 : 2;
    const [users, setUsers] = useState<FeaturedUser[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [isFiltering, setIsFiltering] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [nextPageUrl, setNextPageUrl] = useState<string | null>(null);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [filterParams, setFilterParams] = useState<BasicFilter | null>(null)

    const fetchLikedUsers = async () => {
        try {
            show();
            setFilterParams(null);
            const data: any = await axiosRequest.get('/get-featured-user-data');
            if (data.reaction === ReactionCodes.SUCCESS) {
                const { getFeatureUserList } = data.data;
                setUsers(getFeatureUserList);
            }
            hide();
        } catch (error) {
            hide();
            console.error('Error fetching liked users:', error);
        }
    };

    const refreshUsers = async () => {
        try {
            setRefreshing(true);
            if (filterParams) {
                const searchParams = new URLSearchParams(filterParams as any);
                const data: any = await axiosRequest.get(`/find-matches-data?${searchParams.toString()}`);
                if (data.reaction === ReactionCodes.SUCCESS) {
                    const { filterData, totalCount, filterCount, nextPageUrl} = data.data;
                    setUsers(filterData);
                    setNextPageUrl(nextPageUrl);
                    setTotalCount(totalCount);
                }
            } else {
                const data: any = await axiosRequest.get('/get-featured-user-data');
                if (data.reaction === ReactionCodes.SUCCESS) {
                    const { getFeatureUserList } = data.data;
                    setUsers(getFeatureUserList);
                }
            }
            setRefreshing(false);
        } catch (error) {
            setRefreshing(false);
        }
    }

    const fetchMoreUsers = async () => {
        try {
            if (filterParams && nextPageUrl) {
                setIsLoadingMore(true);
                const data: any = await axiosRequest.get(nextPageUrl);
                if (data.reaction === ReactionCodes.SUCCESS) {
                    const { filterData, totalCount, filterCount, nextPageUrl} = data.data;
                    const newUsers = [users, filterData];
                    setUsers(newUsers.flat());
                    setTotalCount(totalCount);
                    setNextPageUrl(nextPageUrl);
                }
                setIsLoadingMore(false);
            }
        } catch (error) {
            setIsLoadingMore(false);
        }
    };


    useEffect(() => {
        fetchLikedUsers();
    }, []);

    const filterUsers = async (params: BasicFilter) => {
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
            // const oldUSers = [...users];
            setUsers([]);
            show();
            const data: any = await axiosRequest.get(`/find-matches-data?${searchParams.toString()}`);
            if (data.reaction === ReactionCodes.SUCCESS) {
                const { filterData, totalCount, filterCount, nextPageUrl} = data.data;
                setUsers(filterData);
                setNextPageUrl(nextPageUrl);
                setTotalCount(totalCount);
            }
            hide();
        } catch (error) {
            hide();
        }
    }

    const clearFilter = () => {
        setFilterParams(null);
        setUsers([]);
        fetchLikedUsers();
    }

    const renderItem = useCallback(({ item }: { item: FeaturedUser }) => {
        return (
            <TouchableWithoutFeedback onPress={() => router.push(`/view-user/${item.username}`)} className=''>
                <View className='m-2 h-72' style={{ flex: 1 / numColumns, width: width / numColumns }}>
                    <View className='flex-1 rounded-xl overflow-hidden'>
                        <ImageBackground resizeMode='cover' className=' rounded-xl flex-1 bg-[#ccc]' source={{ uri: item.profileImage ? item.profileImage : item.userImageUrl ? item.userImageUrl : item.coverImage }}>
                            <View className='bg-black/[0.5] flex-1 justify-end p-4'>
                                <Text className='text-sm font-firabold text-white'>{item.fullName ? item.fullName : item.userFullName ? item.userFullName : item.username}</Text>
                                {item.isPremiumUser && <Image source={icons.premium} className='w-5 h-5' resizeMode='contain' />}
                            </View>
                        </ImageBackground>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        )
    }, [])

    return (
        <>
            <Stack.Screen options={{
                headerStyle: { backgroundColor: '#1A1A1A' },
                headerShadowVisible: false,
                headerRight: () => <TouchableOpacity onPress={() => setModalVisible(true)} className='flex items-center justify-center pr-4 w-9 h-8'>
                    <Image source={icons.filter} className='w-6 h-6' resizeMode='contain' />
                </TouchableOpacity>
            }} />
            <View className='bg-[#1A1A1A] h-full'>
                {filterParams && <XStack justifyContent='space-between' alignItems='center' className='px-4 py-2'>
                    <Text className='text-white'>Showing filter</Text>
                    <TouchableOpacity onPress={clearFilter} className='items-center justify-center'>
                        <Ionicons name="close" size={24} color="#ffffff" />
                    </TouchableOpacity>
                </XStack>}
                <View style={{ flexGrow: 1 }} className='h-full flex-1'>
                    <FlatList
                        className='p-1 flex-1 h-full'
                        data={users}
                        keyExtractor={(item, index) => `${item.username}-${index}`}
                        numColumns={numColumns}
                        ListFooterComponent={filterParams && (totalCount > users.length) ? <TouchableOpacity onPress={() => fetchMoreUsers()} className='flex items-center justify-center my-4'>
                            {isLoadingMore && <ActivityIndicator size='small' color='#fff' />}
                            <Text className='text-white'>Load More</Text>
                        </TouchableOpacity> : null}
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
                        renderItem={renderItem}
                    />
                </View>
            </View>
            <Modal
                animationType="slide"
                visible={modalVisible}
                presentationStyle="pageSheet"
                onRequestClose={() => {
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
                        <UsersBasicFilter filterUsers={filterUsers} />
                    </SafeAreaView>
                </SafeAreaProvider>
            </Modal>
        </>

    )
}

export default FilterUsers