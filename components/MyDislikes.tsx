import { View, Text, FlatList, ImageBackground, TouchableWithoutFeedback, ActivityIndicator, RefreshControl, useWindowDimensions } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { router } from 'expo-router'
import { ReactionCodes } from '@/models/general'
import { LikedUserProfile } from '@/models/user'
import axiosRequest from '@/utils/axios'
import { Loader } from './loader/LoaderWrapper'

const MyDislikes = () => {
    const { width } = useWindowDimensions();
    const numColumns = width > 600 ? 3 : width > 991 ? 4 : 2;
    const [users, setUsers] = useState<LikedUserProfile[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [paginationDetails, setPaginationDetails] = useState<{ totalCount: number, nextPageUrl: string } | null>(null);

    const fetchLikedUsers = async (pageUrl = '/disliked', hideLoader = true) => {
        try {
            Loader.show();
            const data: any = await axiosRequest.get(pageUrl);
            if (data.reaction === ReactionCodes.SUCCESS) {
                const { usersData, totalCount, nextPageUrl } = data.data;
                setUsers(usersData);
                setPaginationDetails({ totalCount, nextPageUrl });
            }
            Loader.hide();
        } catch (error) {
            Loader.hide();
            console.error('Error fetching disliked users:', error);
            setPaginationDetails(null);
        }
    };

    const fetchMoreUsers = async () => {
        try {
            if (paginationDetails?.nextPageUrl) {
                const url = paginationDetails.nextPageUrl;
                setIsLoadingMore(true);
                const data: any = await axiosRequest.get(url);
                if (data.reaction === ReactionCodes.SUCCESS) {
                    const { usersData, totalCount, nextPageUrl } = data.data;
                    const newUsers = [users, usersData];
                    setUsers(newUsers.flat());
                    setPaginationDetails({ totalCount, nextPageUrl });
                }
                setIsLoadingMore(false);
            }
        } catch (error) {
            setIsLoadingMore(false);
        }
    };

    const refreshUsers = async () => {
        try {
            setRefreshing(true);
            const data: any = await axiosRequest.get('/disliked', { headers: { 'hide-loader': 'true' } });
            if (data.reaction === ReactionCodes.SUCCESS) {
                const { usersData, totalCount, nextPageUrl } = data.data;
                setUsers(usersData);
                setPaginationDetails({ totalCount, nextPageUrl });
            }
            setRefreshing(false);
        } catch (error) {
            setRefreshing(false);
            console.error('Error refreshing disliked users:', error);
            setPaginationDetails(null);
        }
    }


    const renderItem = useCallback(({ item }: { item: LikedUserProfile }) => {
        return (
            <TouchableWithoutFeedback onPress={() => router.push(`/view-user/${item.username}`)} className='relative'>
                <View className='m-2 h-72' style={{ flex: 1 / numColumns, width: width / numColumns }}>
                    <View className='w-full h-full rounded-xl overflow-hidden'>
                        <ImageBackground resizeMode='cover' className='h-full w-full rounded-xl flex-1 bg-[#ccc]' source={{ uri: item.userImageUrl }}>
                            <View className='bg-black/[0.5] h-full flex flex-col justify-end p-4'>
                                <Text className='text-sm font-firabold text-white'>{item.userFullName}</Text>
                                <Text className='text-xs font-firamedium text-white'>{item.detailString}</Text>
                                <Text className='text-xs font-firamedium text-white'>{item.countryName}</Text>
                            </View>
                        </ImageBackground>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        )
    }, [])


    useEffect(() => {
        fetchLikedUsers('/disliked', false);
    }, []);

    return (
        <View className='bg-[#1A1A1A] h-full'>
            <FlatList
                className='p-1'
                data={users}
                horizontal={false}
                numColumns={numColumns}
                keyExtractor={(item, index) => `${item.username}-${item._uid}-${index}`}
                onEndReachedThreshold={0.5}
                onEndReached={() => fetchMoreUsers()}
                refreshing={refreshing}
                onRefresh={() => refreshUsers()}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={refreshUsers}
                        tintColor={'#fff'}
                    />}
                ListFooterComponent={() => isLoadingMore && <View className='p-3'><ActivityIndicator size={'small'} color={'#fff'} /></View>}
                renderItem={renderItem}
            />
        </View>

    )
}

export default MyDislikes