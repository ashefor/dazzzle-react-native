import { useEffect, useMemo, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, TextInput } from 'react-native';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { fetchChats } from '@/redux/slices/chatsSlice';
import { MessengerUser } from '@/models/chat';
import { router } from 'expo-router';
import NavBar from '@/components/NavBar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ChatListsSkeleton from '@/components/ChatListsSkeleton';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { useIsFocused } from '@react-navigation/native';
import { usePremiumAction } from '@/hooks/usePremiumAction';
import { PremiumActionModal } from '@/components/PremiumActionModal';

export default function ChatsScreen() {
    const dispatch = useAppDispatch();
    const insets = useSafeAreaInsets();
    const isFocused = useIsFocused()
    const { items, loading } = useAppSelector((state => state.chats));
    const { requirePremium, showModal, setShowModal, modalOptions } = usePremiumAction();

    const [search, setSearch] = useState('');

    useEffect(() => {
        dispatch(fetchChats());
    }, [dispatch, isFocused]);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return items;
        return items.filter(c =>
            c.user_full_name.toLowerCase().includes(q) ||
            c.username.toLowerCase().includes(q)
        );
    }, [items, search]);

    const renderItem = ({ item }: { item: MessengerUser & { unreadCount?: number } }) => (
        <TouchableOpacity style={styles.row} onPress={() => requirePremium(() => {
            router.navigate({
                pathname: '/single-chat/[userId]',
                params: { userId: item.user_id.toString() },
            })
        })}>
            <Image source={{ uri: item.profile_picture }} style={styles.avatar} />
            <View style={{ flex: 1 }}>
                <View style={styles.rowTop}>
                    <View>
                        <Text style={styles.title}>{item.user_full_name}</Text>
                    <Text className='text-xs font-firaregular'>@{item.username}</Text>
                    </View>
                    <Text style={styles.time}>{item.last_seen_at_time_ago_format}</Text>
                </View>
                <View style={styles.rowBottom}>
                    <Text style={styles.status}>
                        {/* {item.is_online ? 'Online' : `Last seen ${item.last_seen_at_time_ago_format}`} */}
                        {item.last_seen_at ? `Last seen ${item.last_seen_at_time_ago_format}` : 'No activity yet'}
                    </Text>
                    {!!item.unreadCount && item.unreadCount > 0 && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{item.unreadCount}</Text>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
             <NavBar
          leftItem={<Text className='text-2xl text-primary font-firasemibold'>Chats</Text>}
        />
          {loading ? (
                <ChatListsSkeleton/>
            ) : (
                <KeyboardAvoidingView style={{ flex: 1 }} behavior='padding'>
 <View style={styles.search}>
                <TextInput
                    value={search}
                    onChangeText={setSearch}
                    placeholder="Search"
                    placeholderTextColor="#AFAFAF"
                    style={styles.searchInput}
                />
            </View>
                    <FlatList
                    data={filtered}
                    keyExtractor={(item) => String(item.user_id)}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: insets.bottom + 16, paddingTop: 8 }}
                />
                    </KeyboardAvoidingView>
            )}
            <PremiumActionModal
                visible={showModal}
                onClose={() => setShowModal(false)}
                {...modalOptions}
            /> 
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: { fontSize: 28, fontWeight: '700', color: '#A020F0', marginTop: 12, marginHorizontal: 16 },
    search: {
        marginTop: 4,
        marginHorizontal: 16,
        backgroundColor: '#F4F4F4',
        borderRadius: 16,
        paddingHorizontal: 16,
        // paddingVertical: 4,
    },
    searchInput: { color: '#333', fontSize: 16, height: 48 },
    row: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 12, },
    avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 12, backgroundColor: '#EEE' },
    rowTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    title: { fontSize: 16, fontWeight: '600', fontFamily: 'Onest_600SemiBold', color: '#111' },
    time: { fontSize: 12, color: '#777' },
    rowBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    status: { fontSize: 12, color: '#666', marginTop: 4, flex: 1, marginRight: 8 },
    badge: { backgroundColor: '#FF4DD2', borderRadius: 12, paddingHorizontal: 8, paddingVertical: 2, alignSelf: 'flex-start' },
    badgeText: { color: '#fff', fontSize: 12, fontWeight: '700', fontFamily: 'Onest_700Bold' },
});