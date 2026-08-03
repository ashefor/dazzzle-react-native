import NavBar from "@/components/NavBar";
import { useLoader } from "@/context/loader/LoaderProvider";
import { ReactionCodes } from "@/models/general";
import axiosRequest from "@/utils/axios";
import { clearAppBadge } from "@/utils/notificationHandler";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, FlatList, Platform, RefreshControl, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Notification = {
    _id: string;
    _uid: string;
    message: string;
    is_read: boolean;
    created_at: string;
    formattedCreatedAt?: string;
    action: string
}

type PaginationData = {
    currentPage: number;
    lastPage: number;
    nextPageURL: string;
    hasMorePages: boolean;
    remainingItems: number;
    lastItem: number;
    perPage: number;
    count: number;
    total: number;
}

const NotificationItem = ({ item }: { item: Notification }) => {
    const userName = extractUsername(item.action);
    return (
        <TouchableOpacity onPress={() => {
            if (userName) {
                router.navigate({
                    pathname: '/[userName]',
                    params: { userName: userName }
                })
            }
        }}>
            <View className="bg-[#F2F2F7] rounded-lg p-4 mb-3 flex-row justify-between items-center">
            <View className="flex-1">
                <Text className="text-sm font-firaregular">{item.message}</Text>
                <Text className="text-xs text-[#AEAEB2] mt-2">{item.created_at}</Text>
            </View>
            <View className="ml-4 justify-between items-end">
                <View className={`w-3 h-3 rounded-full ${!item.is_read ? 'bg-green-500' : 'bg-transparent'}`} />
                <Text className="text-xs text-[#AEAEB2] mt-2">{item.formattedCreatedAt}</Text>
            </View>
        </View>
        </TouchableOpacity>
    )

}

const extractUsername = (url: string): string | null => {
  const match = url.match(/@([a-zA-Z0-9_.-]+)/);
  return match ? match[1] : null;
}
const NotificationsScreen = () => {
    const insets = useSafeAreaInsets();
    const { show, hide } = useLoader();
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const paginationDetailsRef = useRef<PaginationData | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasLoadedInitial, setHasLoadedInitial] = useState(false);

    const fetchNotifications = useCallback(async (page: number = 1, isRefresh = false, isLoadMore = false) => {
        try {
            if (!isRefresh && !isLoadMore) {
                show();
            };
            const data: any = await axiosRequest.get('/notifications/notification-list', {
                params: { page },
            });
            if (!isRefresh && !isLoadMore) hide();
            if (data.reaction === ReactionCodes.SUCCESS) {
                const notificationsData = data.data;
                const incoming: Notification[] = notificationsData.data ?? [];
                const paginationData: PaginationData | null = notificationsData.paginationData ?? null;

                if (isLoadMore) {
                    // A notification arriving between page loads shifts the server-side
                    // window, so the next page can repeat rows we already hold.
                    setNotifications(prev => {
                        const seen = new Set(prev.map(item => item._id));
                        return [...prev, ...incoming.filter(item => !seen.has(item._id))];
                    });
                } else {
                    setNotifications(incoming);
                }
                // Handle notifications data
                paginationDetailsRef.current = paginationData;
            }
        } catch (error) {
            if (!isRefresh && !isLoadMore) hide();
        } finally {
            setHasLoadedInitial(true);
        }
    }, [show, hide]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            // isRefresh suppresses the fullscreen overlay; RefreshControl is the affordance here.
            await fetchNotifications(1, true);
        } finally {
            setRefreshing(false);
        }
    }, [fetchNotifications]);

    useEffect(() => {
        clearAppBadge();
        fetchNotifications();
    }, [fetchNotifications]);

    const onEndReached = async () => {
        const pagination = paginationDetailsRef.current;
        if (isLoadingMore || !pagination?.hasMorePages) return;

        setIsLoadingMore(true);
        try {
            await fetchNotifications(pagination.currentPage + 1, false, true);
        } finally {
            setIsLoadingMore(false);
        }
    };

    const renderItem = useCallback(({ item }: { item: Notification }) => <NotificationItem item={item} />, []);

    return (
        <View style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom, backgroundColor: 'white' }}>
            <NavBar title='Notifications' />
            <FlatList
            contentContainerStyle={{ padding: 16 }}
                data={notifications}
                keyExtractor={(item) => item._id}
                renderItem={renderItem}
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
                            <Text className='text-gray-500 font-firamedium'>No notifications available.</Text>
                        </View>
                    ) : null
                }
                ListFooterComponent={
                    isLoadingMore ? <View className='p-4'><ActivityIndicator size='small' color='#DD3FE5' /></View> : null
                }
            />
        </View>
    )
}

export default NotificationsScreen