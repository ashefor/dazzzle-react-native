import { View, Text, FlatList, TouchableWithoutFeedback, ImageBackground, ActivityIndicator, RefreshControl, Platform, Dimensions } from 'react-native';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { ReactionCodes } from '@/models/general';
import { LikedUserProfile } from '@/models/user';
import { useRouter } from 'expo-router';
import axiosRequest from '@/utils/axios';
import { useLoader } from '@/context/loader/LoaderProvider';
import NavBar from '@/components/NavBar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';
import { PremiumActionModal } from '@/components/PremiumActionModal';
import { usePremiumAction } from '@/hooks/usePremiumAction';

const { width } = Dimensions.get('window');
const numColumns = width > 600 ? 3 : width > 991 ? 4 : 2;

const BlockedUsers = () => {
    const { show, hide } = useLoader();
    const [users, setUsers] = useState<LikedUserProfile[]>([]);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [paginationDetails, setPaginationDetails] = useState<{ totalCount: number, nextPageUrl: string } | null>(null);
    const insets = useSafeAreaInsets();
    const isFocused = useIsFocused();
    const { requirePremium, showModal, setShowModal, modalOptions } = usePremiumAction();

    const fetchBlockedUsers = async () => {
        try {
            show();
            const data: any = await axiosRequest.get('/blocked-users-list');
            if (data.reaction === ReactionCodes.SUCCESS) {
                const { usersData, totalCount, nextPageUrl } = data.data;
                setUsers(usersData);
                setPaginationDetails({ totalCount, nextPageUrl });
            }
            hide();
        } catch (error) {
            hide();
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
        return <LikeItem item={item} />;
    }, []);

    useEffect(() => {
        if (isFocused) {
            fetchBlockedUsers();
        }
    }, [isFocused]);

    return (
        <View className='flex-1 h-full bg-white' style={{ paddingTop: insets.top }}>
            <NavBar title='Blocked Users' />
            <FlatList
                className='p-1'
                data={users}
                keyExtractor={(item, index) => `${item._uid}-${index}`}
                numColumns={numColumns}
                windowSize={5}
                maxToRenderPerBatch={10}
                removeClippedSubviews={Platform.OS === 'android'}
                onEndReached={() => fetchMoreUsers()}
                onRefresh={() => refreshUsers()}
                refreshing={refreshing}
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

const LikeItem = memo(({ item }: { item: LikedUserProfile }) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { requirePremium, showModal, setShowModal, modalOptions } = usePremiumAction();

    return (
        <>
            <TouchableWithoutFeedback
                onPress={() => requirePremium(() => {
                    router.push({
                        pathname: '/[userName]',
                        params: { userName: item.username }
                    })
                })}
            >
                <View className='m-2 h-52' style={{ width: (width / numColumns) - 16 }}>
                    <View className='flex-1 rounded-xl overflow-hidden bg-[#ccc]'>
                        <ImageBackground
                            source={{ uri: item.userImageUrl }}
                            resizeMode='cover'
                            className='flex-1'
                            onLoadStart={() => setLoading(true)}
                            onLoadEnd={() => setLoading(false)}
                        >
                            <View className='bg-black/50 h-full flex flex-col justify-end p-4 relative'>
                                {loading && (
                                    <View className="absolute top-2 left-2 flex items-center justify-center">
                                        <ActivityIndicator color="white" />
                                    </View>
                                )}
                                <Text className='text-sm font-firabold text-white' numberOfLines={1}>{item.userFullName}</Text>
                                <Text className='text-xs font-firamedium text-white'>{item.detailString}</Text>
                                <Text className='text-xs font-firamedium text-white'>{item.countryName}</Text>
                            </View>
                        </ImageBackground>
                    </View>
                </View>
            </TouchableWithoutFeedback>
            <PremiumActionModal
                visible={showModal}
                onClose={() => setShowModal(false)}
                {...modalOptions}
            />
        </>
    );
});

export default BlockedUsers