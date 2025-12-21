import { View, Text, FlatList, ImageBackground, TouchableWithoutFeedback, TouchableOpacity, useWindowDimensions, ActivityIndicator, RefreshControl, Alert, Platform } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import axiosRequest from '@/utils/axios';
import { ReactionCodes } from '@/models/general';
import { LikedUserProfile } from '@/models/user';
import Toast from '@/components/toast/toast';
import { useLoader } from '@/context/loader/LoaderProvider';

export interface UserListProps {
    /** The API endpoint to fetch users from */
    endpoint: string;
    /** Whether to show the action button (heart) on each user card */
    showActionButton?: boolean;
    /** The action to perform when the button is pressed (0 = dislike/unlike) */
    actionValue?: '0' | '1';
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
    actionValue = '0', // Default to 0 (Unlike)
    emptyMessage = 'No users found',
    actionAlertTitle = 'Unlike User?',
    actionAlertMessage = 'Are you sure you want to unlike this user?',
    actionButtonText = 'Unlike',
    actionSuccessMessage = 'User updated successfully',
}) => {
    const { width } = useWindowDimensions();
    const { show, hide } = useLoader();
    
    // Grid calculation
    const numColumns = width > 600 ? 3 : width > 991 ? 4 : 2;
    
    const [users, setUsers] = useState<LikedUserProfile[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [paginationDetails, setPaginationDetails] = useState<{ totalCount: number, nextPageUrl: string } | null>(null);
    const [hasLoadedInitial, setHasLoadedInitial] = useState(false);

    const fetchUsers = useCallback(async (url: string, isRefresh = false, isLoadMore = false) => {
        try {
            // Only show global loader on first load (not on refresh or infinite scroll)
            if (!isRefresh && !isLoadMore) show();
            
            const config = (isRefresh || isLoadMore) ? { headers: { 'hide-loader': 'true' } } : {};
            const data: any = await axiosRequest.get(url, config);

            if (!isRefresh && !isLoadMore) hide();

            if (data.reaction === ReactionCodes.SUCCESS) {
                const { usersData, totalCount, nextPageUrl } = data.data;
                
                if (isLoadMore) {
                    setUsers(prev => [...prev, ...usersData]);
                } else {
                    setUsers(usersData);
                }
                
                setPaginationDetails({ totalCount, nextPageUrl });
            }
        } catch (error) {
            if (!isRefresh && !isLoadMore) hide();
            console.error('Error fetching users:', error);
        } finally {
            setHasLoadedInitial(true);
        }
    }, [endpoint, show, hide]);

    // Initial Load
    useEffect(() => {
        fetchUsers(endpoint);
    }, [endpoint]);

    // Pull to Refresh
    const onRefresh = async () => {
        setRefreshing(true);
        await fetchUsers(endpoint, true);
        setRefreshing(false);
    };

    // Infinite Scroll
    const onEndReached = async () => {
        if (isLoadingMore || !paginationDetails?.nextPageUrl) return;
        
        setIsLoadingMore(true);
        await fetchUsers(paginationDetails.nextPageUrl, false, true);
        setIsLoadingMore(false);
    };

    // Action Logic (Unlike)
    const performAction = useCallback(async (userId: number | string) => {
        try {
            show();
            // Ensure userId is string for API URL construction
            const data: any = await axiosRequest.post(`/${userId}/${actionValue}/user-like-dislike`, {});
            hide();

            if (data.reaction === ReactionCodes.SUCCESS) {
                const response = data.data;
                Toast.success(response.message || actionSuccessMessage, 2000);
                
                // FIXED: Use String() conversion to ensure strict equality doesn't fail due to type mismatch (number vs string)
                setUsers(prevUsers => prevUsers.filter(user => String(user._id) !== String(userId)));
            }
        } catch (error) {
            hide();
            console.error('Error performing action:', error);
        }
    }, [actionValue, actionSuccessMessage, show, hide]);

    const createActionAlert = useCallback((userId: number) =>
        Alert.alert(actionAlertTitle, actionAlertMessage, [
            { text: 'Cancel', style: 'cancel' },
            { text: actionButtonText, onPress: () => performAction(userId) },
        ]), [actionAlertTitle, actionAlertMessage, actionButtonText, performAction]);

    const renderItem = useCallback(({ item }: { item: LikedUserProfile }) => (
        <TouchableWithoutFeedback onPress={() => router.push({
                pathname: '/[userName]',
                params: { userName: item.username }
            })}>
            <View className='m-2' style={{ flex: 1 / numColumns }}>
                <View className='relative h-52 w-full'>
                    {showActionButton && (
                        <View className='absolute top-4 right-4 z-10'>
                            <TouchableOpacity onPress={() => createActionAlert(item._id)} className='p-2 bg-white rounded-full shadow-sm'>
                                <Ionicons name="heart" size={20} color="red" />
                            </TouchableOpacity>
                        </View>
                    )}
                    <View className='w-full h-full rounded-xl overflow-hidden bg-[#ccc]'>
                        <ImageBackground 
                            resizeMode='cover' 
                            className='h-full w-full justify-end' 
                            source={{ uri: item.userImageUrl }}
                        >
                            <View className='bg-black/50 h-full flex flex-col justify-end p-3'>
                                <Text className='text-sm font-firabold text-white' numberOfLines={1}>{item.userFullName}</Text>
                                <Text className='text-xs font-firamedium text-white' numberOfLines={1}>{item.detailString}</Text>
                                <Text className='text-xs font-firamedium text-white' numberOfLines={1}>{item.countryName}</Text>
                            </View>
                        </ImageBackground>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    ), [numColumns, showActionButton, createActionAlert]);

    return (
        <View className='h-full bg-white'> 
             <FlatList
                className='p-1'
                data={users}
                keyExtractor={(item, index) => `${item._uid}-${item._id}-${index}`}
                numColumns={numColumns}
                // Key property to force re-render if columns change (though pure keyExtractor handles most cases, this is safer for grid layout changes)
                key={`grid-${numColumns}`} 
                
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={'#DD3FE5'} />
                }
                
                onEndReached={onEndReached}
                onEndReachedThreshold={0.5}
                
                removeClippedSubviews={Platform.OS === 'android'}
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                windowSize={5}

                ListEmptyComponent={
                    hasLoadedInitial ? (
                        <View className='flex-1 items-center justify-center pt-20'>
                            <Text className='text-gray-500 font-firamedium'>{emptyMessage}</Text>
                        </View>
                    ) : null
                }
                ListFooterComponent={
                    isLoadingMore ? <View className='p-4'><ActivityIndicator size='small' color='#DD3FE5' /></View> : null
                }
                renderItem={renderItem}
            />
        </View>
    );
};

export default UserList;