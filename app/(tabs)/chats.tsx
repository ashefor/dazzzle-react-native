import React, { useCallback, useDeferredValue, useMemo, useState } from 'react';
import {
    FlatList,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import NavBar from '@/components/NavBar';
import ChatListsSkeleton from '@/components/ChatListsSkeleton';
import { PremiumActionModal } from '@/components/PremiumActionModal';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { usePremiumAction } from '@/hooks/usePremiumAction';
import { MessengerUser } from '@/models/chat';
import { fetchChats } from '@/redux/slices/chatsSlice';

type ChatListItem = MessengerUser & { unreadCount?: number };

type ChatRowProps = {
    item: ChatListItem;
    onOpen: (userId: number) => void;
};

const ChatRow = React.memo(({ item, onOpen }: ChatRowProps) => {
    const unreadCount = item.unreadCount ?? 0;
    const displayName = item.user_full_name || item.username;
    const status = item.last_seen_at
        ? `Last seen ${item.last_seen_at_time_ago_format}`
        : 'No activity yet';
    const openChat = useCallback(() => onOpen(item.user_id), [item.user_id, onOpen]);

    return (
        <TouchableOpacity
            accessibilityLabel={`${displayName}${unreadCount > 0 ? `, ${unreadCount} unread messages` : ''}`}
            accessibilityRole="button"
            activeOpacity={0.7}
            onPress={openChat}
            style={styles.row}
        >
            <Image
                accessible={false}
                cachePolicy="memory-disk"
                contentFit="cover"
                source={{ uri: item.profile_picture }}
                style={styles.avatar}
                transition={150}
            />
            <View style={styles.rowContent}>
                <View style={styles.rowTop}>
                    <View style={styles.identity}>
                        <Text numberOfLines={1} style={styles.title}>{displayName}</Text>
                        <Text className="text-xs font-firaregular" numberOfLines={1}>@{item.username}</Text>
                    </View>
                    <Text numberOfLines={1} style={styles.time}>{item.last_seen_at_time_ago_format}</Text>
                </View>
                <View style={styles.rowBottom}>
                    <Text numberOfLines={1} style={styles.status}>{status}</Text>
                    {unreadCount > 0 ? (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{unreadCount > 99 ? '99+' : unreadCount}</Text>
                        </View>
                    ) : null}
                </View>
            </View>
        </TouchableOpacity>
    );
});

ChatRow.displayName = 'ChatRow';

const ItemSeparator = () => <View style={styles.separator} />;

export default function ChatsScreen() {
    const dispatch = useAppDispatch();
    const insets = useSafeAreaInsets();
    const { items, loading, error } = useAppSelector((state) => state.chats);
    const { requirePremium, showModal, setShowModal, modalOptions } = usePremiumAction();
    const [search, setSearch] = useState('');
    const deferredSearch = useDeferredValue(search);

    useFocusEffect(
        useCallback(() => {
            dispatch(fetchChats());
        }, [dispatch]),
    );

    const refreshChats = useCallback(() => {
        dispatch(fetchChats());
    }, [dispatch]);

    const filteredChats = useMemo(() => {
        const query = deferredSearch.trim().toLocaleLowerCase();
        if (!query) return items;

        return items.filter((chat) => (
            chat.user_full_name?.toLocaleLowerCase().includes(query)
            || chat.username?.toLocaleLowerCase().includes(query)
        ));
    }, [deferredSearch, items]);

    const openChat = useCallback((userId: number) => {
        requirePremium(() => {
            router.navigate({
                pathname: '/single-chat/[userId]',
                params: { userId: String(userId) },
            });
        });
    }, [requirePremium]);

    const renderItem = useCallback(({ item }: { item: ChatListItem }) => (
        <ChatRow item={item} onOpen={openChat} />
    ), [openChat]);

    const keyExtractor = useCallback((item: ChatListItem) => String(item.user_id), []);
    const getItemLayout = useCallback((_: ArrayLike<ChatListItem> | null | undefined, index: number) => ({
        index,
        length: 75,
        offset: 75 * index,
    }), []);

    const emptyComponent = useMemo(() => {
        if (loading) return null;

        if (error && items.length === 0) {
            return (
                <View accessibilityRole="alert" style={styles.emptyState}>
                    <Text className="text-gray-500 text-base font-firaregular text-center">
                        We couldn&apos;t load your chats.
                    </Text>
                    <TouchableOpacity accessibilityRole="button" onPress={refreshChats} style={styles.retryButton}>
                        <Text style={styles.retryText}>Try again</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        return (
            <View style={styles.emptyState}>
                <Text className="text-gray-400 text-base font-firaregular text-center">
                    {deferredSearch.trim() ? 'No chats match your search.' : 'No chats yet.'}
                </Text>
            </View>
        );
    }, [deferredSearch, error, items.length, loading, refreshChats]);

    const listContentStyle = useMemo(() => ({
        flexGrow: filteredChats.length === 0 ? 1 : 0,
        paddingTop: 8,
        paddingBottom: insets.bottom + 16,
    }), [filteredChats.length, insets.bottom]);

    const clearSearch = useCallback(() => setSearch(''), []);
    const closePremiumModal = useCallback(() => setShowModal(false), [setShowModal]);
    const showInitialSkeleton = loading && items.length === 0;

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <NavBar leftItem={<Text className="text-2xl text-primary font-firasemibold">Chats</Text>} />

            {showInitialSkeleton ? (
                <ChatListsSkeleton />
            ) : (
                <>
                    <View style={styles.search}>
                        <Ionicons accessible={false} name="search" size={20} color="#777777" />
                        <TextInput
                            accessibilityLabel="Search chats"
                            autoCapitalize="none"
                            autoCorrect={false}
                            clearButtonMode="while-editing"
                            onChangeText={setSearch}
                            placeholder="Search chats"
                            placeholderTextColor="#777777"
                            returnKeyType="search"
                            style={styles.searchInput}
                            value={search}
                        />
                        {search.length > 0 && Platform.OS !== 'ios' ? (
                            <TouchableOpacity
                                accessibilityLabel="Clear chat search"
                                accessibilityRole="button"
                                hitSlop={8}
                                onPress={clearSearch}
                            >
                                <Ionicons name="close-circle" size={20} color="#777777" />
                            </TouchableOpacity>
                        ) : null}
                    </View>

                    <FlatList
                        contentContainerStyle={listContentStyle}
                        data={filteredChats}
                        getItemLayout={getItemLayout}
                        initialNumToRender={12}
                        ItemSeparatorComponent={ItemSeparator}
                        keyboardDismissMode="on-drag"
                        keyboardShouldPersistTaps="handled"
                        keyExtractor={keyExtractor}
                        ListEmptyComponent={emptyComponent}
                        maxToRenderPerBatch={12}
                        onRefresh={refreshChats}
                        refreshing={loading && items.length > 0}
                        removeClippedSubviews={Platform.OS === 'android'}
                        renderItem={renderItem}
                        showsVerticalScrollIndicator={false}
                        windowSize={7}
                    />
                </>
            )}

            <PremiumActionModal visible={showModal} onClose={closePremiumModal} {...modalOptions} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    search: {
        height: 48,
        marginTop: 4,
        marginHorizontal: 16,
        paddingHorizontal: 14,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        borderRadius: 16,
        backgroundColor: '#F4F4F4',
    },
    searchInput: {
        flex: 1,
        height: 48,
        color: '#333333',
        fontSize: 16,
    },
    row: {
        height: 74,
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 50,
        height: 50,
        marginRight: 12,
        borderRadius: 25,
        backgroundColor: '#EEEEEE',
    },
    rowContent: {
        flex: 1,
        minWidth: 0,
    },
    rowTop: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
    },
    identity: {
        flex: 1,
        minWidth: 0,
        marginRight: 8,
    },
    title: {
        color: '#111111',
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'Onest_600SemiBold',
    },
    time: {
        maxWidth: '35%',
        color: '#777777',
        fontSize: 12,
    },
    rowBottom: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    status: {
        flex: 1,
        marginTop: 4,
        marginRight: 8,
        color: '#666666',
        fontSize: 12,
    },
    badge: {
        minWidth: 24,
        paddingHorizontal: 7,
        paddingVertical: 2,
        alignItems: 'center',
        alignSelf: 'flex-start',
        borderRadius: 12,
        backgroundColor: '#FF4DD2',
    },
    badgeText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '700',
        fontFamily: 'Onest_700Bold',
    },
    separator: {
        height: 1,
        marginLeft: 78,
        backgroundColor: '#EEEEEE',
    },
    emptyState: {
        flex: 1,
        paddingHorizontal: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    retryButton: {
        marginTop: 16,
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: '#DD3FE5',
    },
    retryText: {
        color: '#FFFFFF',
        fontFamily: 'Onest_600SemiBold',
    },
});
