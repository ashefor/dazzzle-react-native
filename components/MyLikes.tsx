import { View, Text, FlatList, ImageBackground, TouchableWithoutFeedback, TouchableOpacity, ActivityIndicator, RefreshControl, Alert, Dimensions, Platform } from 'react-native';
import React, { memo, useCallback, useEffect, useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { ReactionCodes } from '@/models/general';
import { LikedUserProfile } from '@/models/user';
import Toast from '@/components/toast/toast';
import axiosRequest from '@/utils/axios';
import { useLoader } from '@/context/loader/LoaderProvider';

const { width } = Dimensions.get('window');
const numColumns = width > 600 ? 3 : width > 991 ? 4 : 2;
const MyLikes = () => {
    const { show, hide } = useLoader();
    const [users, setUsers] = useState<LikedUserProfile[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [paginationDetails, setPaginationDetails] = useState<{ totalCount: number, nextPageUrl: string } | null>(null);

    const fetchLikedUsers = async (pageUrl = '/my-likes', hideLoader = true) => {
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
            const data: any = await axiosRequest.get('/my-likes', { headers: { 'hide-loader': 'true' } });
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
            show();
            const data: any = await axiosRequest.post(`/${userId.toString()}/0/user-like-dislike`, {});
            hide();
            if (data.reaction === ReactionCodes.SUCCESS) {
                const response = data.data;
                Toast.success(response.message || 'User Disliked successfully', 2000)
                setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
            }
        } catch (error) {
            hide();
            console.error('Error unliking user:', error);
        }
    }
    const renderItem = useCallback(({ item }: { item: LikedUserProfile }) => {
            return <LikeItem item={item}  onPress={createUnlikeUserAlert}/>;
        }, []);

    return (
        <View className=' h-full'>
            <FlatList
                className='p-1'
                data={users}
                keyExtractor={(item, index) => `${item._uid}-${index}`}
                windowSize={5}
                maxToRenderPerBatch={10}
                removeClippedSubviews={Platform.OS === 'android'}
                numColumns={numColumns}
                onEndReached={() => fetchMoreUsers()}
                refreshing={refreshing}
                onRefresh={() => refreshUsers()}
                onEndReachedThreshold={0.5}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={refreshUsers}
                        tintColor={'#DD3FE5'}
                    />}
                ListFooterComponent={isLoadingMore ? <View className='p-3'><ActivityIndicator size={'small'} color={'#DD3FE5'} /></View> : null}
                renderItem={renderItem}
            />
        </View>

    )
}

const LikeItem = memo(({ item, onPress }: { item: LikedUserProfile, onPress: (itemId:  number) => void }) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    return (
            <TouchableWithoutFeedback onPress={() => router.push({
                pathname: '/[userName]',
                params: { userName: item.username }
            })} className='relative'>
                            <View className='m-2 h-52' style={{ flex: 1 / numColumns, width: width / numColumns }}>
                                <View className='absolute top-4 right-4 z-10'>
                                    <TouchableOpacity onPress={() => onPress(item._id)} className='p-2 bg-white rounded-full'>
                                        <Ionicons name="heart" size={20} color="red" />
                                    </TouchableOpacity>
                                </View>
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
});

export default MyLikes