import { View, Text, FlatList, ImageBackground, TouchableWithoutFeedback, TouchableOpacity, useWindowDimensions, ActivityIndicator, RefreshControl, Alert, Platform } from 'react-native'
import React, { useEffect, useState, useCallback } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons'
import { router } from 'expo-router'
import { useAxiosContext } from '@/context/AxiosProvider'
import { ReactionCodes } from '@/models/general'
import { LikedUserProfile } from '@/models/user'
import Toast from '@/components/toast/toast'

export interface UserListProps {
    /** The API endpoint to fetch users from */
    endpoint: string;
    /** Whether to show the unlike/action button on each user card */
    showActionButton?: boolean;
    /** The action to perform when the action button is pressed (1 = like, 0 = dislike) */
    actionType?: 'like' | 'dislike';
    /** Custom empty list message */
    emptyMessage?: string;
    /** Alert title for the action confirmation */
    actionAlertTitle?: string;
    /** Alert message for the action confirmation */
    actionAlertMessage?: string;
    /** Button text for the action confirmation */
    actionButtonText?: string;
    /** Success message after action is performed */
    actionSuccessMessage?: string;
}

const UserList: React.FC<UserListProps> = ({
    endpoint,
    showActionButton = false,
    actionType = 'dislike',
    emptyMessage = 'No users found',
    actionAlertTitle = 'Unlike User?',
    actionAlertMessage = 'Are you sure you want to unlike this user?',
    actionButtonText = 'Unlike',
    actionSuccessMessage = 'User updated successfully',
}) => {
    const { axiosRequest } = useAxiosContext();
    const { width } = useWindowDimensions();
    const numColumns = width > 600 ? 3 : width > 991 ? 4 : 2;
    const [users, setUsers] = useState<LikedUserProfile[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [paginationDetails, setPaginationDetails] = useState<{ totalCount: number, nextPageUrl: string } | null>(null);

    const fetchUsers = useCallback(async (pageUrl = endpoint, hideLoader = true) => {
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
            console.error('Error fetching users:', error);
            setPaginationDetails(null);
        }
    }, [endpoint, axiosRequest]);

    const refreshUsers = useCallback(async () => {
        try {
            setRefreshing(true);
            const { data } = await axiosRequest.get(endpoint, { headers: { 'hide-loader': 'true' } });
            if (data.reaction === ReactionCodes.SUCCESS) {
                const { usersData, totalCount, nextPageUrl } = data.data;
                setUsers(usersData);
                setPaginationDetails({ totalCount, nextPageUrl });
            }
            setRefreshing(false);
        } catch (error) {
            setRefreshing(false);
            console.error('Error refreshing users:', error);
            setPaginationDetails(null);
        }
    }, [endpoint, axiosRequest]);

    const handleLoadMore = useCallback(async () => {
        if (paginationDetails?.nextPageUrl && !loading) {
            fetchUsers(paginationDetails.nextPageUrl);
        }
    }, [paginationDetails, loading, fetchUsers]);

    const createActionAlert = useCallback((userId: number) =>
        Alert.alert(actionAlertTitle, actionAlertMessage, [
            {
                text: 'Cancel',
                style: 'cancel',
            },
            {
                text: actionButtonText,
                onPress: () => performAction(userId)
            },
        ]), [actionAlertTitle, actionAlertMessage, actionButtonText]);

    const performAction = useCallback(async (userId: string | number) => {
        try {
            const actionValue = actionType === 'like' ? '1' : '0';
            const { data } = await axiosRequest.post(`/${userId.toString()}/${actionValue}/user-like-dislike`);

            if (data.reaction === ReactionCodes.SUCCESS) {
                const response = data.data;
                Toast.success(response.message || actionSuccessMessage, 2000);
                setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
            }
        } catch (error) {
            console.error('Error performing action:', error);
        }
    }, [actionType, actionSuccessMessage, axiosRequest]);

    useEffect(() => {
        fetchUsers(endpoint, false);
    }, []);

    const renderItem = useCallback(({ item }: { item: LikedUserProfile }) => (
        <TouchableWithoutFeedback onPress={() => router.push(`/view-user/${item.username}`)} className='relative'>
            <View className='m-2' style={{
                flex: 1 / numColumns,
                flexDirection: "row",
            }}>
                {showActionButton && (
                    <View className='absolute top-4 right-4 z-10'>
                        <TouchableOpacity onPress={() => createActionAlert(item._id)} className='p-2 bg-white rounded-full'>
                            <Ionicons name="heart" size={20} color="red" />
                        </TouchableOpacity>
                    </View>
                )}
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
    ), [numColumns, showActionButton, createActionAlert]);

    const keyExtractor = useCallback((item: LikedUserProfile) => item._uid, []);

    const ListEmptyComponent = useCallback(() => (
        !loading ? (
            <View className='flex-1 items-center justify-center p-8'>
                <Text className='text-white text-base font-firamedium'>{emptyMessage}</Text>
            </View>
        ) : null
    ), [loading, emptyMessage]);

    const ListFooterComponent = useCallback(() => (
        loading ? <View className='p-3'><ActivityIndicator size={'large'} color={'#fff'} /></View> : null
    ), [loading]);

    return (
        <View className='bg-[#1A1A1A] h-full'>
            <FlatList
                className='p-1'
                data={users}
                keyExtractor={keyExtractor}
                numColumns={numColumns}
                onEndReached={handleLoadMore}
                refreshing={refreshing}
                onRefresh={refreshUsers}
                onEndReachedThreshold={0.5}
                // Performance optimizations
                windowSize={5}
                maxToRenderPerBatch={10}
                removeClippedSubviews={Platform.OS === 'android'}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={refreshUsers}
                        tintColor={'#fff'}
                    />
                }
                ListEmptyComponent={ListEmptyComponent}
                ListFooterComponent={ListFooterComponent}
                renderItem={renderItem}
            />
        </View>
    );
};

export default UserList;
