import { View, Text, FlatList, ImageBackground, TouchableWithoutFeedback, ActivityIndicator, Alert, RefreshControl, useWindowDimensions } from 'react-native'
import React, { use, useCallback, useEffect, useState } from 'react'
import { router } from 'expo-router'
import { ReactionCodes } from '@/models/general'
import { LikedUserProfile } from '@/models/user'
import axiosRequest from '@/utils/axios'
import { useLoader } from '@/context/loader/LoaderProvider'

const WhoLikesMe = () => {
    const { width } = useWindowDimensions();
    const { show, hide } = useLoader();
    const numColumns = width > 600 ? 3 : width > 991 ? 4 : 2;
    const [users, setUsers] = useState<LikedUserProfile[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [paginationDetails, setPaginationDetails] = useState<{ totalCount: number, nextPageUrl: string } | null>(null);

    const fetchLikedUsers = async (pageUrl = '/who-liked-me', hideLoader = true) => {
        try {
            show();
            const data: any = await axiosRequest.get(pageUrl);
            hide();
            if (data.reaction === ReactionCodes.SUCCESS) {
                const { usersData, totalCount, nextPageUrl } = data.data;
                setUsers(usersData);
                setPaginationDetails({ totalCount, nextPageUrl });
            }
        } catch (error) {
            hide();
            console.error('Error fetching liked users:', error);
            setPaginationDetails(null);
        }
    };

    const refreshUsers = async () => {
        try {
            setRefreshing(true);
            const data: any = await axiosRequest.get('/who-liked-me');
            if (data.reaction === ReactionCodes.SUCCESS) {
                const { usersData, totalCount, nextPageUrl } = data.data;
                setUsers(usersData);
                setPaginationDetails({ totalCount, nextPageUrl });
            }
            setRefreshing(false);
        } catch (error) {
            setRefreshing(false);
            console.error('Error fetching liked users:', error);
            setPaginationDetails(null);
        }
    }

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
        fetchLikedUsers('/who-liked-me', false);
    }, []);

    return (
        <View className='bg-[#1A1A1A] h-full'>
            <FlatList
                className='p-1'
                data={users}
                keyExtractor={(item, index) => `${item._uid}-${index}`}
                numColumns={numColumns}
                onEndReached={() => fetchMoreUsers()}
                refreshing={refreshing}
                onRefresh={() => refreshUsers()}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={refreshUsers}
                        tintColor={'#fff'}
                    />}
                onEndReachedThreshold={0.5}
                ListFooterComponent={isLoadingMore ? <View className='p-3'><ActivityIndicator size={'small'} color={'#fff'} /></View> : null}
                renderItem={renderItem}
            />
        </View>

    )
}

export default WhoLikesMe