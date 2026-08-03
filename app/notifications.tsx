import NavBar from "@/components/NavBar";
import { useLoader } from "@/context/loader/LoaderProvider";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { ReactionCodes } from "@/models/general";
import { markAllNotificationsRead, markNotificationsRead } from "@/redux/slices/notificationsSlice";
import axiosRequest from "@/utils/axios";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useRef, useState } from "react";
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

/**
 * The API stores unread as null and read as 1, so is_read arrives as null/0/1
 * rather than a real boolean. Anything not truthy is unread.
 */
const isUnread = (item: Notification) => !item.is_read || Number(item.is_read) === 0;

const NotificationItem = ({ item, onPress }: { item: Notification; onPress: (item: Notification) => void }) => {
    return (
        <TouchableOpacity onPress={() => onPress(item)}>
            <View className="bg-[#F2F2F7] rounded-lg p-4 mb-3 flex-row justify-between items-center">
            <View className="flex-1">
                <Text className="text-sm font-firaregular">{item.message}</Text>
                <Text className="text-xs text-[#AEAEB2] mt-2">{item.created_at}</Text>
            </View>
            <View className="ml-4 justify-between items-end">
                <View className={`w-3 h-3 rounded-full ${isUnread(item) ? 'bg-green-500' : 'bg-transparent'}`} />
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
    const dispatch = useAppDispatch();
    const unreadCount = useAppSelector((state) => state.notifications.unreadCount);
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
            const data: any = await axiosRequest.notifications.list(page);
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

    /**
     * Opening the screen is the read signal: fetch first, then clear.
     *
     * Order matters. The list renders from the payload captured before the
     * write, so the green dots survive this visit — the badge clears, but the
     * user can still see which ones were new. They go on the next fetch.
     *
     * useFocusEffect rather than useEffect: coming back from a tapped profile
     * does not remount this screen, and that return should re-sync.
     */
    useFocusEffect(
        useCallback(() => {
            let cancelled = false;

            (async () => {
                await fetchNotifications();
                if (cancelled) return;
                // Deliberately not awaited. A failed write leaves the badge up,
                // which is the safe direction to fail in.
                dispatch(markAllNotificationsRead());
            })();

            return () => {
                cancelled = true;
            };
        }, [fetchNotifications, dispatch])
    );

    /**
     * A tap marks that row read on its own. Mark-all on focus usually covers
     * it, but this keeps the row correct when that call failed, and it is the
     * path a push deep-link into a single notification takes.
     */
    const onNotificationPress = useCallback((item: Notification) => {
        if (isUnread(item)) {
            setNotifications(prev =>
                prev.map(entry => (entry._uid === item._uid ? { ...entry, is_read: true } : entry))
            );
            dispatch(markNotificationsRead([item._uid]));
        }

        const userName = extractUsername(item.action);
        if (userName) {
            router.navigate({
                pathname: '/[userName]',
                params: { userName: userName }
            })
        }
    }, [dispatch]);

    const onMarkAllReadPress = useCallback(() => {
        setNotifications(prev => prev.map(entry => ({ ...entry, is_read: true })));
        dispatch(markAllNotificationsRead());
    }, [dispatch]);

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

    const renderItem = useCallback(
        ({ item }: { item: Notification }) => <NotificationItem item={item} onPress={onNotificationPress} />,
        [onNotificationPress]
    );

    // unreadCount is the server's number across every page; the loaded list may
    // only hold the first one, so either signal is enough to offer the action.
    const hasUnread = unreadCount > 0 || notifications.some(isUnread);

    return (
        <View style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom, backgroundColor: 'white' }}>
            <NavBar
                title='Notifications'
                rightItem={
                    hasUnread ? (
                        <TouchableOpacity
                            onPress={onMarkAllReadPress}
                            accessibilityRole='button'
                            accessibilityLabel='Mark all notifications as read'
                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        >
                            <Text className='text-xs text-[#DD3FE5] font-firamedium'>Mark all read</Text>
                        </TouchableOpacity>
                    ) : undefined
                }
            />
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
