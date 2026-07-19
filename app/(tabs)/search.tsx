import React, { JSX, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    Platform,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useWindowDimensions,
} from 'react-native';
import { router } from 'expo-router';
import { ImageBackground } from 'expo-image';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
    BottomSheetBackdrop,
    BottomSheetHandle,
    BottomSheetHandleProps,
    BottomSheetModal,
    BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import UsersBasicFilter, { BasicFilter } from '@/components/UsersBasicFilter';
import NavBar from '@/components/NavBar';
import FilterIcon from '@/components/icons/FilterIcon';
import { PremiumActionModal } from '@/components/PremiumActionModal';
import icons from '@/constants/icons';
import { useLoader } from '@/context/loader/LoaderProvider';
import { usePremiumAction } from '@/hooks/usePremiumAction';
import { ReactionCodes } from '@/models/general';
import axiosRequest from '@/utils/axios';

interface FeaturedUser {
    _id: number;
    _uid: string;
    username: string;
    userFullName: string;
    userImageUrl?: string;
    isPremiumUser: boolean;
    id: number;
    fullName: string;
    profileImage?: string;
    coverImage: string;
}

type LoadMode = 'initial' | 'filter' | 'refresh';

const buildFilterQuery = (filter: BasicFilter) => new URLSearchParams({
    username: filter.username.trim(),
    min_age: String(filter.age[0]),
    max_age: String(filter.age[1]),
    looking_for: filter.looking_for,
    distance: filter.distance.trim(),
    user_type: filter.user_type ?? '0',
}).toString();

const FilterUsers = () => {
    const { show, hide } = useLoader();
    const { width, height } = useWindowDimensions();
    const numColumns = width > 991 ? 4 : width > 600 ? 3 : 2;
    const cardWidth = (width - 16 - (numColumns - 1) * 8) / numColumns;
    const [users, setUsers] = useState<FeaturedUser[]>([]);
    const [hasLoadedUsers, setHasLoadedUsers] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [nextPageUrl, setNextPageUrl] = useState<string | null>(null);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [filterParams, setFilterParams] = useState<BasicFilter | null>(null);
    const [sliderActive, setSliderActive] = useState(false);
    const searchBottomSheetModalRef = useRef<BottomSheetModal>(null);
    const latestRequestId = useRef(0);
    const isLoadingMoreRef = useRef(false);
    const insets = useSafeAreaInsets();
    const { requirePremium, showModal, setShowModal, modalOptions } = usePremiumAction();

    const loadUsers = useCallback(async (filter: BasicFilter | null, mode: LoadMode) => {
        const requestId = ++latestRequestId.current;
        const usesGlobalLoader = mode !== 'refresh';

        if (mode === 'refresh') {
            setRefreshing(true);
        } else {
            show();
            setHasLoadedUsers(false);
            if (mode === 'filter') setUsers([]);
        }
        setNextPageUrl(null);

        try {
            const endpoint = filter
                ? `/find-matches-data?${buildFilterQuery(filter)}`
                : '/get-featured-user-data';
            const data: any = await axiosRequest.get(endpoint, { showGlobalLoader: false });

            if (requestId !== latestRequestId.current) return;

            if (data.reaction === ReactionCodes.SUCCESS) {
                if (filter) {
                    const { filterData = [], nextPageUrl: nextUrl = null } = data.data;
                    setUsers(filterData);
                    setNextPageUrl(nextUrl);
                } else {
                    setUsers(data.data.getFeatureUserList ?? []);
                    setNextPageUrl(null);
                }
            }
        } catch (error) {
            if (requestId === latestRequestId.current) {
                console.error('Error fetching search users:', error);
            }
        } finally {
            if (requestId === latestRequestId.current) {
                setHasLoadedUsers(true);
                setRefreshing(false);
                if (usesGlobalLoader) hide();
            }
        }
    }, [hide, show]);

    useEffect(() => {
        loadUsers(null, 'initial');

        return () => {
            latestRequestId.current += 1;
            hide();
        };
    }, [hide, loadUsers]);

    const refreshUsers = useCallback(() => loadUsers(filterParams, 'refresh'), [filterParams, loadUsers]);

    const fetchMoreUsers = useCallback(async () => {
        if (!filterParams || !nextPageUrl || isLoadingMoreRef.current) return;

        isLoadingMoreRef.current = true;
        setIsLoadingMore(true);
        const requestId = latestRequestId.current;

        try {
            const data: any = await axiosRequest.get(nextPageUrl, { showGlobalLoader: false });
            if (requestId !== latestRequestId.current) return;

            if (data.reaction === ReactionCodes.SUCCESS) {
                const { filterData = [], nextPageUrl: nextUrl = null } = data.data;
                setUsers((currentUsers) => [...currentUsers, ...filterData]);
                setNextPageUrl(nextUrl);
            }
        } catch (error) {
            if (requestId === latestRequestId.current) {
                console.error('Error loading more search users:', error);
            }
        } finally {
            isLoadingMoreRef.current = false;
            setIsLoadingMore(false);
        }
    }, [filterParams, nextPageUrl]);

    const filterUsers = useCallback(async (params: BasicFilter) => {
        searchBottomSheetModalRef.current?.dismiss();
        setFilterParams(params);
        await loadUsers(params, 'filter');
    }, [loadUsers]);

    const clearFilter = useCallback(() => {
        setFilterParams(null);
        loadUsers(null, 'filter');
    }, [loadUsers]);

    const renderBackdrop = useCallback(
        (props: JSX.IntrinsicAttributes & BottomSheetDefaultBackdropProps) => (
            <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
        ),
        [],
    );

    const dismissFilters = useCallback(() => searchBottomSheetModalRef.current?.dismiss(), []);

    const renderHeaderHandle = useCallback(
        (props: BottomSheetHandleProps) => (
            <BottomSheetHandle {...props}>
                <View style={styles.sheetHeader}>
                    <TouchableOpacity
                        accessibilityLabel="Close filters"
                        accessibilityRole="button"
                        hitSlop={8}
                        onPress={dismissFilters}
                        style={styles.closeButton}
                    >
                        <Ionicons name="close-circle" size={24} color="black" />
                    </TouchableOpacity>
                    <Text className="font-firabold text-black text-base text-center">Filter</Text>
                </View>
            </BottomSheetHandle>
        ),
        [dismissFilters],
    );

    const openUser = useCallback((username: string) => {
        requirePremium(() => {
            router.push({ pathname: '/[userName]', params: { userName: username } });
        });
    }, [requirePremium]);

    const renderItem = useCallback(({ item }: { item: FeaturedUser }) => {
        const displayName = item.fullName || item.userFullName || item.username;
        const imageUri = item.profileImage || item.userImageUrl || item.coverImage;

        return (
            <TouchableOpacity
                accessibilityLabel={`View ${displayName}'s profile`}
                accessibilityRole="button"
                activeOpacity={0.85}
                onPress={() => openUser(item.username)}
                style={[styles.card, { width: cardWidth }]}
            >
                <ImageBackground contentFit="cover" style={styles.cardImage} source={{ uri: imageUri }}>
                    <View style={styles.cardOverlay}>
                        <Text className="text-sm font-firabold text-white" numberOfLines={1}>
                            {displayName}
                        </Text>
                        {item.isPremiumUser ? (
                            <Image source={icons.premium} style={styles.premiumIcon} resizeMode="contain" />
                        ) : null}
                    </View>
                </ImageBackground>
            </TouchableOpacity>
        );
    }, [cardWidth, openUser]);

    const keyExtractor = useCallback((item: FeaturedUser) => (
        String(item._uid || item._id || item.id || item.username)
    ), []);

    const refreshControl = useMemo(() => (
        <RefreshControl refreshing={refreshing} onRefresh={refreshUsers} tintColor="#DD3FE5" />
    ), [refreshUsers, refreshing]);

    const emptyComponent = useMemo(() => hasLoadedUsers ? (
        <View style={styles.emptyState}>
            <Text className="text-gray-500 font-firamedium">No users found</Text>
            <Text className="text-gray-500 font-firamedium text-center">
                Try adjusting your filters or refresh
            </Text>
            <TouchableOpacity
                accessibilityRole="button"
                onPress={refreshUsers}
                className="mt-4 px-4 py-2 bg-primary rounded-full"
            >
                <Text className="text-white">Refresh</Text>
            </TouchableOpacity>
        </View>
    ) : null, [hasLoadedUsers, refreshUsers]);

    const footerComponent = useMemo(() => isLoadingMore ? (
        <View style={styles.footerLoader}>
            <ActivityIndicator size="small" color="#DD3FE5" />
        </View>
    ) : null, [isLoadingMore]);

    const presentFilters = useCallback(() => {
        requirePremium(() => searchBottomSheetModalRef.current?.present());
    }, [requirePremium]);

    const closePremiumModal = useCallback(() => setShowModal(false), [setShowModal]);

    return (
        <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
            <NavBar
                leftItem={<Text className="text-2xl text-primary font-firasemibold">Search</Text>}
                rightItem={(
                    <TouchableOpacity
                        accessibilityLabel="Open search filters"
                        accessibilityRole="button"
                        onPress={presentFilters}
                        className="flex items-center justify-center h-10 w-10 bg-[#E0E0E0] rounded-full"
                    >
                        <FilterIcon stroke="#DD3FE5" />
                    </TouchableOpacity>
                )}
            />

            {filterParams ? (
                <View style={styles.clearFilterRow}>
                    <Text className="text-sm">Filters applied</Text>
                    <TouchableOpacity
                        accessibilityLabel="Clear search filters"
                        accessibilityRole="button"
                        hitSlop={8}
                        onPress={clearFilter}
                        className="items-center justify-center p-0.5 rounded-full bg-[#E0E0E0] ml-2"
                    >
                        <Ionicons name="close" size={20} color="#DD3FE5" />
                    </TouchableOpacity>
                </View>
            ) : null}

            <FlatList
                key={`search-grid-${numColumns}`}
                data={users}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                numColumns={numColumns}
                contentContainerStyle={users.length === 0 ? styles.emptyListContent : styles.listContent}
                columnWrapperStyle={styles.columnWrapper}
                ListEmptyComponent={emptyComponent}
                ListFooterComponent={footerComponent}
                refreshControl={refreshControl}
                onEndReached={fetchMoreUsers}
                onEndReachedThreshold={0.5}
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                windowSize={5}
                removeClippedSubviews={Platform.OS === 'android'}
                keyboardDismissMode="on-drag"
            />

            <BottomSheetModal
                ref={searchBottomSheetModalRef}
                enableDynamicSizing
                maxDynamicContentSize={height * 0.9}
                enablePanDownToClose
                enableContentPanningGesture={false}
                handleIndicatorStyle={styles.hiddenHandleIndicator}
                topInset={insets.top}
                handleStyle={styles.handle}
                style={styles.sheet}
                backgroundStyle={styles.sheetBackground}
                backdropComponent={renderBackdrop}
                handleComponent={renderHeaderHandle}
                keyboardBehavior="interactive"
                keyboardBlurBehavior="restore"
                enableBlurKeyboardOnGesture
                {...(Platform.OS === 'android' ? { android_keyboardInputMode: 'adjustResize' as const } : {})}
            >
                <BottomSheetScrollView scrollEnabled={!sliderActive} keyboardShouldPersistTaps="handled">
                    <UsersBasicFilter
                        key={filterParams ? buildFilterQuery(filterParams) : 'default-filters'}
                        filterUsers={filterUsers}
                        onSliderStart={() => setSliderActive(true)}
                        onSliderEnd={() => setSliderActive(false)}
                        filterParams={filterParams}
                    />
                </BottomSheetScrollView>
            </BottomSheetModal>

            <PremiumActionModal visible={showModal} onClose={closePremiumModal} {...modalOptions} />
        </View>
    );
};

const styles = StyleSheet.create({
    listContent: { padding: 8, paddingBottom: 24 },
    emptyListContent: { flexGrow: 1, padding: 16 },
    columnWrapper: { gap: 8 },
    card: {
        height: 208,
        marginBottom: 8,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#CCCCCC',
    },
    cardImage: { flex: 1 },
    cardOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        padding: 16,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    premiumIcon: { width: 20, height: 20 },
    clearFilterRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(221, 63, 229, 0.1)',
    },
    footerLoader: { padding: 16, alignItems: 'center' },
    sheetHeader: { position: 'relative', paddingVertical: 16 },
    closeButton: {
        position: 'absolute',
        left: 16,
        top: 16,
        zIndex: 1,
        backgroundColor: 'white',
    },
    hiddenHandleIndicator: { display: 'none' },
    handle: { padding: 0 },
    sheet: {
        borderRadius: 28,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 6,
    },
    sheetBackground: { borderRadius: 28 },
});

export default FilterUsers;
