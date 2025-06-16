import { View, Text, FlatList, TouchableWithoutFeedback, ImageBackground, ActivityIndicator, RefreshControl, useWindowDimensions, TouchableOpacity } from 'react-native'
import React, { Fragment, useCallback, useEffect, useState } from 'react'
import { ReactionCodes } from '@/models/general';
import { LikedUserProfile } from '@/models/user';
import { router, Stack } from 'expo-router';
import ArrowBackIcon from '@/components/icons/ArrowBackIcon';
import axiosRequest from '@/utils/axios';
import { Loader } from '@/components/loader/LoaderWrapper';

const BlockedUsers = () => {
     const { width } = useWindowDimensions();
     const numColumns = width > 600 ? 3 : width > 991 ? 4 : 2;
     const [users, setUsers] = useState<LikedUserProfile[]>([]);
     const [isLoadingMore, setIsLoadingMore] = useState(false);
     const [refreshing, setRefreshing] = useState(false);
     const [paginationDetails, setPaginationDetails] = useState<{ totalCount: number, nextPageUrl: string } | null>(null);
 
     const fetchLikedUsers = async () => {
         try {
            Loader.show();
             const data: any = await axiosRequest.get('/blocked-users-list');
             if (data.reaction === ReactionCodes.SUCCESS) {
                 const { usersData, totalCount, nextPageUrl } = data.data;
                 setUsers(usersData);
                 setPaginationDetails({ totalCount, nextPageUrl });
             }
            Loader.hide();
         } catch (error) {
            Loader.hide();
             console.error('Error fetching liked users:', error);
             setPaginationDetails(null);
         }
     };
 
     const refreshUsers = async () => {
         try {
             setRefreshing(true);
             const data: any = await axiosRequest.get('/blocked-users-list');
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
                                 <View className='flex-1 rounded-xl overflow-hidden'>
                                     <ImageBackground resizeMode='cover' className='rounded-xl flex-1 bg-[#ccc]' source={{ uri: item.userImageUrl }}>
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
         fetchLikedUsers();
     }, []);
 
     return (
        <Fragment>
            <Stack.Screen
                    options={{
                        headerStyle: { backgroundColor: '#1A1A1A' },
                        headerLeft: () => <TouchableOpacity onPress={() => router.back()} className='flex items-center justify-center pr-4 w-9 h-8'>
                            <ArrowBackIcon />
                        </TouchableOpacity>
                    }}
                />
         <View className='bg-[#1A1A1A] h-full'>
             <FlatList
                 className='p-1'
                 data={users}
                keyExtractor={(item, index) => `${item._uid}-${index}`}
                 numColumns={numColumns}
                 onEndReached={() => fetchMoreUsers()}
                 onRefresh={() => refreshUsers()}
                 refreshing={refreshing}
                 onEndReachedThreshold={0.5}
                 refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={refreshUsers}
                        tintColor={'#fff'}
                    />}
                 ListFooterComponent={isLoadingMore ? <View className='p-3'><ActivityIndicator size={'small'} color={'#fff'} /></View> : null}
                 renderItem={renderItem}
             />
         </View>
        </Fragment>
 
     )
}

export default BlockedUsers