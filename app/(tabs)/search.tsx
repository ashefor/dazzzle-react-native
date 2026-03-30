import { View, Image, TouchableOpacity, useWindowDimensions, ImageBackground, TouchableWithoutFeedback, FlatList, RefreshControl, Text, ActivityIndicator, Dimensions, Platform, Animated, EmitterSubscription, Keyboard } from 'react-native';
import React, { JSX, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import UsersBasicFilter, { BasicFilter } from '@/components/UsersBasicFilter';
import { router } from 'expo-router';
import icons from '@/constants/icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ReactionCodes } from '@/models/general';
import axiosRequest from '@/utils/axios';
import { useLoader } from '@/context/loader/LoaderProvider';
import NavBar from '@/components/NavBar';
import FilterIcon from '@/components/icons/FilterIcon';
import { BottomSheetBackdrop, BottomSheetHandle, BottomSheetHandleProps, BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';
import { usePremiumAction } from '@/hooks/usePremiumAction';
import { PremiumActionModal } from '@/components/PremiumActionModal';

interface FeaturedUser {
    _id: number
    _uid: string
    username: string
    created_at: string
    userFullName: string
    profile_picture: string
    userImageUrl?: string
    userCoverUrl: string
    isPremiumUser: boolean
    id: number
    fullName: string
    profileImage?: string
    coverImage: string
    gender: string
    dob: string
    userAge: number
    countryName: string
    userOnlineStatus: number
    detailString: string
}

const AnimatedView = Animated.createAnimatedComponent(View);

const FilterUsers = () => {
    const { show, hide } = useLoader();
    // const [modalVisible, setModalVisible] = useState(false);
    const { width } = useWindowDimensions();
    const numColumns = width > 600 ? 3 : width > 991 ? 4 : 2;
    const [users, setUsers] = useState<FeaturedUser[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [nextPageUrl, setNextPageUrl] = useState<string | null>(null);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [filterParams, setFilterParams] = useState<BasicFilter | null>(null)
    const searchBottomSheetModalRef = useRef<BottomSheetModal>(null);
    const insets = useSafeAreaInsets();
    const { requirePremium, showModal, setShowModal, modalOptions } = usePremiumAction();

    const snapPoints = useMemo(() => ["65%", "90%"], []);

    const fetchLikedUsers = async () => {
        try {
            show();
            setFilterParams(null);
            const data: any = await axiosRequest.get('/get-featured-user-data');
            if (data.reaction === ReactionCodes.SUCCESS) {
                const { getFeatureUserList } = data.data;
                setUsers(getFeatureUserList);
            }
            hide();
        } catch (error) {
            hide();
            console.error('Error fetching liked users:', error);
        }
    };

    const refreshUsers = async () => {
        try {
            setRefreshing(true);
            if (filterParams) {
                const searchParams = new URLSearchParams(filterParams as any);
                const data: any = await axiosRequest.get(`/find-matches-data?${searchParams.toString()}`);
                if (data.reaction === ReactionCodes.SUCCESS) {
                    const { filterData, totalCount, filterCount, nextPageUrl } = data.data;
                    setUsers(filterData);
                    setNextPageUrl(nextPageUrl);
                    setTotalCount(totalCount);
                }
            } else {
                const data: any = await axiosRequest.get('/get-featured-user-data');
                if (data.reaction === ReactionCodes.SUCCESS) {
                    const { getFeatureUserList } = data.data;
                    setUsers(getFeatureUserList);
                }
            }
            setRefreshing(false);
        } catch (error) {
            setRefreshing(false);
        }
    }

    const fetchMoreUsers = async () => {
        try {
            if (filterParams && nextPageUrl) {
                setIsLoadingMore(true);
                const data: any = await axiosRequest.get(nextPageUrl);
                if (data.reaction === ReactionCodes.SUCCESS) {
                    const { filterData, totalCount, filterCount, nextPageUrl } = data.data;
                    const newUsers = [users, filterData];
                    setUsers(newUsers.flat());
                    setTotalCount(totalCount);
                    setNextPageUrl(nextPageUrl);
                }
                setIsLoadingMore(false);
            }
        } catch (error) {
            setIsLoadingMore(false);
        }
    };


    useEffect(() => {
        fetchLikedUsers();
    }, []);

    const filterUsers = async (params: BasicFilter) => {
        try {
            const filterParams = {
                username: params.username,
                min_age: params.age[0].toString(),
                max_age: params.age[1].toString(),
                looking_for: params.looking_for,
                distance: params.distance
            } as {
                username: string;
                min_age: string;
                max_age: string
                looking_for: string;
                distance: string;
            }
            const searchParams = new URLSearchParams(filterParams);
            // setModalVisible(false);
            searchBottomSheetModalRef.current?.dismiss();
            setFilterParams(params);
            // const oldUSers = [...users];
            setUsers([]);
            show();
            const data: any = await axiosRequest.get(`/find-matches-data?${searchParams.toString()}`);
            if (data.reaction === ReactionCodes.SUCCESS) {
                const { filterData, totalCount, filterCount, nextPageUrl } = data.data;
                setUsers(filterData);
                setNextPageUrl(nextPageUrl);
                setTotalCount(totalCount);
            }
            hide();
        } catch (error) {
            hide();
        }
    }

    const clearFilter = () => {
        setFilterParams(null);
        setUsers([]);
        fetchLikedUsers();
    }

    const renderBackdrop = useCallback(
        (props: JSX.IntrinsicAttributes & BottomSheetDefaultBackdropProps) => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1}
                appearsOnIndex={0}
            // onPress={handleBlur}
            />
        ),
        []
    );

    const MAX_HEIGHT_PX = useMemo(() => {
        return Dimensions.get("screen").height * 0.8
    }, [])

    const renderHeaderHandle = useCallback(
        (props: BottomSheetHandleProps) => (
            <BottomSheetHandle
                {...props}
            >
                <View className="py-4 relative">

                    <View className=' w-full'>
                        <TouchableOpacity onPress={() => searchBottomSheetModalRef.current?.dismiss()} className=' flex items-center justify-center' style={{
                            position: 'absolute',
                            top: '50%',
                            transform: [
                                { translateY: '-50%' }
                            ],
                            left: 16,
                            zIndex: 10,
                            backgroundColor: 'white'
                        }}>
                            <Ionicons name="close-circle" size={24} color="black" />
                        </TouchableOpacity>
                        <Text className='font-firabold text-black text-base mx-auto text-center'>Filter</Text>
                    </View>
                </View>
            </BottomSheetHandle>
        ),
        []
    );

    const renderItem = useCallback(({ item }: { item: FeaturedUser }) => {
        return (
            <TouchableWithoutFeedback onPress={() => requirePremium(() => {
                router.push({
                pathname: '/[userName]',
                params: { userName: item.username }
            })
            })} className=''>
                <View className='m-2 h-52' style={{ flex: 1 / numColumns, width: width / numColumns }}>
                    <View className='flex-1 rounded-xl overflow-hidden'>
                        <ImageBackground resizeMode='cover' className=' rounded-xl flex-1 bg-[#ccc]' source={{ uri: item.profileImage ? item.profileImage : item.userImageUrl ? item.userImageUrl : item.coverImage }}>
                            <View className='bg-black/[0.5] flex-1 justify-end p-4'>
                                <Text className='text-sm font-firabold text-white'>{item.fullName ? item.fullName : item.userFullName ? item.userFullName : item.username}</Text>
                                {item.isPremiumUser && <Image source={icons.premium} className='w-5 h-5' resizeMode='contain' />}
                            </View>
                        </ImageBackground>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        )
    }, [])

    const keyboardPadding = useRef(new Animated.Value(0)).current;

    // Helper to animate paddingTop
    const animateKeyboardPadding = useCallback((toValue: number, duration = 250) => {
        Animated.timing(keyboardPadding, {
            toValue,
            duration,
            useNativeDriver: false, // paddingTop not supported by native driver
        }).start();
    }, [keyboardPadding]);

    useEffect(() => {
        // Choose event names for platform
        const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
        const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

        const onKeyboardShow = (e: any) => {
            // e.endCoordinates.height is the keyboard height
            const keyboardHeight = e?.endCoordinates?.height ?? 300;
            // convert to a reasonable top padding value (you can tweak multiplier)
            const topPadding = Math.min(keyboardHeight * 0.5, 120); // clamp to 120
            animateKeyboardPadding(topPadding, 250);
        };

        const onKeyboardHide = () => {
            animateKeyboardPadding(0, 200);
        };

        const showSub: EmitterSubscription = Keyboard.addListener(showEvent, onKeyboardShow);
        const hideSub: EmitterSubscription = Keyboard.addListener(hideEvent, onKeyboardHide);

        return () => {
            showSub.remove();
            hideSub.remove();
        };
    }, [animateKeyboardPadding]);

    return (
        <View className='flex-1 bg-white' style={{ paddingTop: insets.top }}>
            <NavBar leftItem={<Text className="text-2xl text-primary font-firasemibold">Search</Text>} rightItem={<TouchableOpacity onPress={() => requirePremium(() => searchBottomSheetModalRef.current?.present())} className='flex items-center justify-center h-10 w-10 bg-[#E0E0E0] rounded-full'>
                <FilterIcon stroke={"#DD3FE5"} />
            </TouchableOpacity>} />
            <View className='flex-1 h-full'>
                {filterParams && <View style={{ justifyContent: 'space-between', alignItems: 'center' }} className='px-4 py-2'>
                    <Text className='text-white'>Showing filter</Text>
                    <TouchableOpacity onPress={clearFilter} className='items-center justify-center'>
                        <Ionicons name="close" size={24} color="#ffffff" />
                    </TouchableOpacity>
                </View>}
                <View style={{ flexGrow: 1 }} className='h-full flex-1'>
                    <FlatList
                        className='p-1 flex-1 h-full'
                        data={users}
                        keyExtractor={(item, index) => `${item.username}-${index}`}
                        numColumns={numColumns}
                        ListFooterComponent={filterParams && (totalCount > users.length) ? <TouchableOpacity onPress={() => fetchMoreUsers()} className='flex items-center justify-center my-4'>
                            {isLoadingMore && <ActivityIndicator size='small' color='#fff' />}
                            <Text className='text-white'>Load More</Text>
                        </TouchableOpacity> : null}
                        refreshing={refreshing}
                        onRefresh={() => refreshUsers()}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={refreshUsers}
                                tintColor='#fff'
                            />
                        }
                        onEndReachedThreshold={0.5}
                        renderItem={renderItem}
                    />
                </View>
            </View>
            <BottomSheetModal
                enableDynamicSizing={false}
                maxDynamicContentSize={MAX_HEIGHT_PX}
                enablePanDownToClose={true}
                snapPoints={['80%']}
                ref={searchBottomSheetModalRef}
                handleIndicatorStyle={{
                    backgroundColor: "red",
                    display: "none"
                }}
                handleStyle={{ padding: 0 }}
                style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 6 },
                    shadowOpacity: 0.1,
                    shadowRadius: 6,
                    elevation: 6,
                    borderRadius: 28,
                }}
                backgroundStyle={{
                    borderRadius: 28,
                }}
                backdropComponent={renderBackdrop}
                handleComponent={renderHeaderHandle}
                keyboardBehavior="extend"
                enableBlurKeyboardOnGesture
                keyboardBlurBehavior='restore'
                android_keyboardInputMode={Platform.OS === 'android' ? 'adjustResize' : 'adjustPan'}
            >
                <BottomSheetScrollView>
                    <UsersBasicFilter filterUsers={filterUsers} />
                </BottomSheetScrollView>
            </BottomSheetModal>
            <PremiumActionModal
                visible={showModal}
                onClose={() => setShowModal(false)}
                {...modalOptions}
            />
        </View>

    )
}

export default FilterUsers