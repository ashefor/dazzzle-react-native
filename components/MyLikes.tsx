import { View, Text, FlatList, ImageBackground, TouchableWithoutFeedback, TouchableOpacity, useWindowDimensions, ActivityIndicator, RefreshControl, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons'
import { router } from 'expo-router'
import { useAxiosContext } from '@/context/AxiosProvider'
import { ReactionCodes } from '@/models/general'
import { LikedUserProfile } from '@/models/user'
import Toast from '@/components/toast/toast'

const MyLikes = () => {
    const { axiosRequest } = useAxiosContext();
    const { width } = useWindowDimensions();
    const numColumns = width > 600 ? 3 : width > 991 ? 4 : 2;
    const [users, setUsers] = useState<LikedUserProfile[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [paginationDetails, setPaginationDetails] = useState<{ totalCount: number, nextPageUrl: string } | null>(null);

    const fetchLikedUsers = async (pageUrl = '/my-likes', hideLoader = true) => {
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
            // setUsers(prevUsers => [...prevUsers]);
            setPaginationDetails(null);
        }
    };

    const refreshUsers = async () => {
        try {
            setRefreshing(true);
            const { data } = await axiosRequest.get('/my-likes', { headers: { 'hide-loader': 'true' } });
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

    const createUnlikeUserAlert = (userId: number) =>
        Alert.alert('Unlike User?', 'Are you sure you want to unlike this user?', [
            {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            { 
                text: 'Unlike', 
                onPress: () => unlikeUser(userId) 
            },
        ]);

    useEffect(() => {
        fetchLikedUsers('/my-likes', false);
    }, []);

    const unlikeUser = async (userId: string | number) => {
        try {
            const { data } = await axiosRequest.post(`/${userId.toString()}/0/user-like-dislike`);
            console.log('liked data', data);

            if (data.reaction === ReactionCodes.SUCCESS) {
                const response = data.data;
                Toast.success(response.message || 'User Disliked successfully', 2000)
                setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
            }
        } catch (error) {
            console.error('Error unliking user:', error);
        }
    }

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
                onEndReachedThreshold={0.5}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={refreshUsers}
                        tintColor={'#fff'}
                    />}
                ListFooterComponent={loading ? <View className='p-3'><ActivityIndicator size={'large'} color={'#fff'} /></View> : null}
                renderItem={
                    ({ item }) => (
                        <TouchableWithoutFeedback onPress={() => router.push(`/view-user/${item.username}`)} className='relative'>
                            <View className='m-2' style={{
                                flex: 1 / numColumns,
                                flexDirection: "row",
                            }}>
                                {/* <UnlikeUserButton userId={item._id}/> */}
                                <View className='absolute top-4 right-4 z-10'>
                                    <TouchableOpacity onPress={() => createUnlikeUserAlert(item._id)} className='p-2 bg-white rounded-full'>
                                        <Ionicons name="heart" size={20} color="red" />
                                    </TouchableOpacity>
                                </View>
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

export default MyLikes