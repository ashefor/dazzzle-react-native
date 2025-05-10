import { View, Text, FlatList, ImageBackground, TouchableWithoutFeedback, ActivityIndicator, RefreshControl, useWindowDimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router } from 'expo-router'
import { useAxiosContext } from '@/context/AxiosProvider'
import { ReactionCodes } from '@/models/general'
import { LikedUserProfile } from '@/models/user'

const MyDislikes = () => {
    const { axiosRequest } = useAxiosContext();
    const { width } = useWindowDimensions();
    const numColumns = width > 600 ? 3 : width > 991 ? 4 : 2;
    const [users, setUsers] = useState<LikedUserProfile[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [paginationDetails, setPaginationDetails] = useState<{ totalCount: number, nextPageUrl: string } | null>(null);

    const fetchLikedUsers = async (pageUrl = '/disliked', hideLoader = true) => {
        try {
            setLoading(true);
            const { data } = await axiosRequest.get(pageUrl, { headers: { 'hide-loader': hideLoader ? 'true' : 'false' } });
            if (data.reaction === ReactionCodes.SUCCESS) {
                const { usersData, totalCount, nextPageUrl } = data.data;
                setUsers(prevUsers => [...prevUsers, ...usersData]);
                setPaginationDetails({ totalCount, nextPageUrl });
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error('Error fetching liked users:', error);
            setPaginationDetails(null);
        }
    };

    const refreshUsers = async () => {
        try {
            setRefreshing(true);
            const { data } = await axiosRequest.get('/disliked', { headers: { 'hide-loader': 'true' } });
            if (data.reaction === ReactionCodes.SUCCESS) {
                const { usersData, totalCount, nextPageUrl } = data.data;
                setUsers(usersData);
                setPaginationDetails({ totalCount, nextPageUrl });
            }
            setRefreshing(false);
        } catch (error) {
            setRefreshing(false);
            console.error('Error fetching liked users:', error);
            // setUsers(prevUsers => [...prevUsers]);
            setPaginationDetails(null);
        }
    }

    const handleLoadMore = async () => {
        if (paginationDetails?.nextPageUrl) {
            fetchLikedUsers(paginationDetails.nextPageUrl);
        }
    };


    useEffect(() => {
        fetchLikedUsers('/disliked', false);
    }, []);

    return (
        <View className='bg-[#1A1A1A] h-full'>
            <FlatList
                className='p-1'
                data={users}
                keyExtractor={(item, index) => `${item._uid}-${index}`}
                numColumns={width > 600 ? 3 : width > 991 ? 4 : 2}
                onEndReached={handleLoadMore}
                refreshing={refreshing}
                onRefresh={() => refreshUsers()}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={refreshUsers}
                        tintColor={'#fff'}
                    />}
                onEndReachedThreshold={0.5}
                ListFooterComponent={loading ? <View className='p-3'><ActivityIndicator size={'large'} color={'#fff'} /></View> : null}
                renderItem={
                    ({ item }) => (
                        <TouchableWithoutFeedback onPress={() => router.push(`/view-user/${item.username}`)} className='relative'>
                            <View className='m-2' style={{
                                flex: 1 / numColumns,
                                flexDirection: "row",
                            }}>
                                <View className='w-full h-full rounded-xl overflow-hidden'>
                                    <ImageBackground resizeMode='cover' className='h-52 w-full rounded-xl flex-1 bg-[#ccc]' source={{ uri: item.userImageUrl }}>
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
                }
            />
        </View>

    )
}

export default MyDislikes