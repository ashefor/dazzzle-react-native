import React, { JSX, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Pressable,
    LayoutChangeEvent,
    Modal,
    Alert,
    Platform,
    useWindowDimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    interpolate,
    Extrapolation
} from 'react-native-reanimated';
import { Feather, Fontisto, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import axiosRequest from '@/utils/axios';
import { ReactionCodes } from '@/models/general';
import { reportReasonOptions } from '@/constants/constants';
import { SingleUserDetails } from '@/models/user';
import EllipsisIcon from '@/components/EllipsisIcon';
import UserDetailsSkeleton from '@/components/UserDetailsSkeleton';
import { ProfileInfoSectionHeader } from '@/components/ProfileInfoSectionHeader';
import { ProfileInfoItem } from '@/components/ProfileInfoItem';
import { arrayToObject } from '@/utils/helpers';
import LocationIcon from '@/components/icons/LocationIcon';
import BadgeIcon from '@/components/icons/BadgeIcon';
import HeartbreakIcon from '@/components/icons/HeartbreakIcon';
import HeartOutlineIcon from '@/components/icons/HeartOutlineIcon';
import CommentIcon from '@/components/icons/CommentIcon';
import { useLoader } from '@/context/loader/LoaderProvider';
import NavBar from '@/components/NavBar';
import { popCard } from '@/redux/slices/encounterSlice';
import { useAppDispatch } from '@/hooks/reduxHooks';
import Toast from '@/components/toast/toast';
import { BottomSheetBackdrop, BottomSheetHandle, BottomSheetHandleProps, BottomSheetModal, BottomSheetTextInput, BottomSheetView } from '@gorhom/bottom-sheet';
import CustomButton from '@/components/CustomButton';
import { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';
import { Skeleton } from '@/components/SkeletonLoader';
import { usePremiumAction } from '@/hooks/usePremiumAction';
import { PremiumActionModal } from '@/components/PremiumActionModal';


const HEADER_HEIGHT = 60;

const getErrorMessage = (error: unknown, fallback: string) => {
    if (typeof error === 'object' && error && 'errorMessage' in error) {
        return String(error.errorMessage);
    }
    return error instanceof Error ? error.message : fallback;
};

// --- SUB-COMPONENTS ---

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.sectionContent}>{children}</View>
    </View>
);

const InfoPills = ({ values }: { values?: string[] }) => {
    if (!values?.length) return <Text style={styles.bodyText}>-</Text>;
    return (
        <View className='flex-1 space-y-1'>
            {values.map((info, index) => (
                <Text className='flex-1 text-right text-black text-xs font-firaregular' key={`${info}-${index}`}>{info}</Text>
            ))}
        </View>
    );
}

const BasicInfoTab = ({ userDetails }: { userDetails: SingleUserDetails }) => {
    const { userProfileData, formatteduserSpecificationData } = userDetails;
    const { aboutMe, interest, formatted_preferred_language, formatted_education, formatted_work_status, city, country_name, gender_text, birthday, relationship_type, formatted_relationship_status } = userProfileData;
    const { looks, personality, lifestyle, favorites } = formatteduserSpecificationData;
    const location = city && country_name ? `${city}, ${country_name}` : country_name ? `${country_name}` : city ? `${city}` : '-';
    return (
        <View style={styles.tabContent}>
            <Section title="About me">
                <Text style={styles.bodyText}>{aboutMe || '-'}</Text>
            </Section>

            {/* Basic Information Section */}
            <ProfileInfoSectionHeader title="Basic information" />
            <View className="bg-[#F2F2F7] mx-4 rounded-xl px-3 py-1">
                {/* <ProfileInfoItem icon={<Feather name="phone" size={18} color="#666" />} label="Phone No." value={mobile_number} /> */}
                <ProfileInfoItem icon={<Feather name="calendar" size={18} color="#666" />} label="Date of Birth" value={birthday} />
                <ProfileInfoItem icon={<MaterialCommunityIcons name="gender-male-female" size={18} color="#666" />} label="Gender" value={gender_text} />
                <ProfileInfoItem icon={<Feather name="users" size={18} color="#666" />} label="Rel. Status" value={formatted_relationship_status} />
                <ProfileInfoItem icon={<Feather name="heart" size={18} color="#666" />} label="Rel. Type" value={<InfoPills values={relationship_type} />} />
                <ProfileInfoItem icon={<MaterialIcons name="school" size={18} color="#666" />} label="Education" value={formatted_education} />
                <ProfileInfoItem icon={<Fontisto name="language" size={18} color="#666" />} label="Preferred Language" value={formatted_preferred_language} />
                <ProfileInfoItem icon={<Feather name="briefcase" size={18} color="#666" />} label="Work Status" value={formatted_work_status} />
                <ProfileInfoItem icon={<Feather name="heart" size={18} color="#666" />} label="Interest" value={<InfoPills values={interest} />} />
                <ProfileInfoItem icon={<LocationIcon width={18} height={18} stroke="#666" />} label="Location" value={location} />
            </View>

            {/* Looks Section */}
            <ProfileInfoSectionHeader title="Looks" />
            <View className="bg-[#F2F2F7] mx-4 rounded-xl px-3 py-1">
                <ProfileInfoItem icon={<MaterialCommunityIcons name="ruler" size={18} color="#666" />} label="Height" value={looks && looks['Height']} />
                <ProfileInfoItem icon={<Feather name="globe" size={18} color="#666" />} label="Ethnicity" value={looks && looks['Ethnicity']} />
                <ProfileInfoItem icon={<Ionicons name="body-outline" size={18} color="#666" />} label="Body Type" value={looks && looks['Body Type']} />
                <ProfileInfoItem icon={<MaterialCommunityIcons name="face-man-shimmer-outline" size={18} color="#666" />} label="Hair Color" value={looks && looks['Hair Color']} />
            </View>

            {/* Personality Section */}
            <ProfileInfoSectionHeader title="Personality" />
            <View className="bg-[#F2F2F7] mx-4 rounded-xl px-3 py-1">
                <ProfileInfoItem icon={<Feather name="smile" size={18} color="#666" />} label="Nature" value={personality && personality['Nature']} />
                <ProfileInfoItem icon={<Feather name="users" size={18} color="#666" />} label="Friends" value={personality && personality['Friends']} />
                <ProfileInfoItem icon={<MaterialCommunityIcons name="baby-carriage" size={18} color="#666" />} label="Children" value={personality && personality['Children']} />
                <ProfileInfoItem icon={<MaterialCommunityIcons name="paw" size={18} color="#666" />} label="Pets" value={personality && personality['Pets']} />
            </View>

            {/* Lifestyle Section */}
            <ProfileInfoSectionHeader title="Lifestyle" />
            <View className="bg-[#F2F2F7] mx-4 rounded-xl px-3 py-1">
                <ProfileInfoItem icon={<MaterialCommunityIcons name="book-open-page-variant" size={18} color="#666" />} label="Religion" value={lifestyle && lifestyle['Religion']} />
                <ProfileInfoItem icon={<MaterialCommunityIcons name="car" size={18} color="#666" />} label="Car" value={lifestyle && lifestyle['Car']} />
                <ProfileInfoItem icon={<Feather name="home" size={18} color="#666" />} label="I live with" value={lifestyle && lifestyle['I live with']} />
                <ProfileInfoItem icon={<Feather name="map" size={18} color="#666" />} label="Travel" value={lifestyle && lifestyle['Travel']} />
                <ProfileInfoItem icon={<MaterialCommunityIcons name="cigar" size={18} color="#666" />} label="Smoke" value={lifestyle && lifestyle['Smoke']} />
                <ProfileInfoItem icon={<MaterialCommunityIcons name="glass-wine" size={18} color="#666" />} label="Drink" value={lifestyle && lifestyle['Drink']} />
            </View>

            {/* Favorites Section */}
            <ProfileInfoSectionHeader title="Favorites" />
            <View className="bg-[#F2F2F7] mx-4 rounded-xl px-3 py-1 mb-10">
                <ProfileInfoItem
                    icon={<Feather name="music" size={18} color="#666" />}
                    label="Music Genre"
                    value={favorites && favorites['Music Genre']}
                />
                <ProfileInfoItem
                    icon={<MaterialCommunityIcons name="microphone-variant" size={18} color="#666" />}
                    label="Singer"
                    value={favorites && favorites['Singer']}
                />
                <ProfileInfoItem
                    icon={<MaterialCommunityIcons name="music-circle-outline" size={18} color="#666" />}
                    label="Song"
                    value={favorites && favorites['Song']}
                />
                <ProfileInfoItem
                    icon={<Feather name="activity" size={18} color="#666" />}
                    label="Hobby"
                    value={favorites && favorites['Hobby']}
                />
                <ProfileInfoItem
                    icon={<MaterialIcons name="sports-basketball" size={18} color="#666" />}
                    label="Sport"
                    value={favorites && favorites['Sport']}
                />
                <ProfileInfoItem
                    icon={<Feather name="book-open" size={18} color="#666" />}
                    label="Book"
                    value={favorites && favorites['Book']}
                />
                <ProfileInfoItem
                    icon={<MaterialCommunityIcons name="food-variant" size={18} color="#666" />}
                    label="Dish"
                    value={favorites && favorites['Dish']}
                />
                <ProfileInfoItem
                    icon={<Ionicons name="color-palette-outline" size={18} color="#666" />}
                    label="Color"
                    value={favorites && favorites['Color']}
                />
                <ProfileInfoItem
                    icon={<MaterialCommunityIcons name="movie-open-outline" size={18} color="#666" />}
                    label="Movie"
                    value={favorites && favorites['Movie']}
                />
                <ProfileInfoItem
                    icon={<Feather name="tv" size={18} color="#666" />}
                    label="Show"
                    value={favorites && favorites['Show']}
                />
                <ProfileInfoItem
                    icon={<MaterialCommunityIcons name="lightbulb-on-outline" size={18} color="#666" />}
                    label="Inspired From"
                    value={favorites && favorites['Inspired From']}
                />
            </View>
        </View>
    );
};

const PhotosTab = ({ photos }: { photos: { image_url: string }[] }) => {
    const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
    const insets = useSafeAreaInsets();
    const closeModal = useCallback(() => setSelectedPhoto(null), []);

    return (
        <>
            <View className="mx-4">
                {photos.length === 0 ? (
                    <Text style={styles.bodyText}>No photos available.</Text>
                ) : (
                    <View style={styles.photoGrid}>
                        {photos.map((photo) => (
                            <Pressable
                                accessibilityLabel="View profile photo"
                                accessibilityRole="button"
                                key={photo.image_url}
                                onPress={() => setSelectedPhoto(photo.image_url)}
                                style={styles.gridPhoto}
                            >
                                <Image
                                    cachePolicy="memory-disk"
                                    contentFit="cover"
                                    source={{ uri: photo.image_url }}
                                    style={styles.photoThumbnail}
                                    transition={150}
                                />
                            </Pressable>
                        ))}
                    </View>
                )}
            </View>
            <Modal visible={selectedPhoto !== null} animationType="fade" onRequestClose={closeModal}>
                <View style={[styles.photoModal, {
                    paddingTop: insets.top,
                    paddingBottom: insets.bottom,
                    paddingLeft: insets.left,
                    paddingRight: insets.right,
                }]}>
                    <NavBar
                        leftItem={(
                            <TouchableOpacity
                                accessibilityLabel="Close photo"
                                accessibilityRole="button"
                                hitSlop={8}
                                onPress={closeModal}
                                className="flex items-center justify-center"
                            >
                                <Ionicons name="close-circle" size={24} color="black" />
                            </TouchableOpacity>
                        )}
                        title="View Image"
                    />
                    <View className="flex-1 justify-center items-center p-6">
                        {selectedPhoto ? (
                            <Image
                                accessibilityLabel="Profile photo preview"
                                contentFit="contain"
                                source={{ uri: selectedPhoto }}
                                style={styles.photoPreview}
                            />
                        ) : null}
                    </View>
                </View>
            </Modal>
        </>
    );
};

export default function UserDetailsScreen() {
    const params = useLocalSearchParams<{ userName?: string | string[] }>();
    const userName = Array.isArray(params.userName) ? params.userName[0] : params.userName;
    const insets = useSafeAreaInsets();
    const { height } = useWindowDimensions();
    const { show, hide } = useLoader();
    const dispatch = useAppDispatch();
    const { requirePremium, showModal, setShowModal, modalOptions } = usePremiumAction();

    // State
    const [activeTab, setActiveTab] = useState<'basic' | 'photos'>('basic');
    const [isMenuVisible, setMenuVisible] = useState(false);
    const [userDetails, setUserDetails] = useState<SingleUserDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [reportReason, setReportReason] = useState('');
    const [reportCategory, setReportCategory] = useState('');
    const [pendingAction, setPendingAction] = useState<'block' | 'unblock' | 'like' | 'dislike' | 'report' | null>(null);
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const profileRequestId = useRef(0);
    const actionInFlight = useRef(false);

    // Layout Measurements (Reset these on data fetch to prevent jumpiness)
    const [tabContainerWidth, setTabContainerWidth] = useState(0);
    const [nameLayoutY, setNameLayoutY] = useState(0);

    // Shared Values
    const scrollY = useSharedValue(0);
    const activeTabValue = useSharedValue(0);

    const fetchUserDetails = useCallback(async (username: string, requestId: number) => {
        try {
            const data: any = await axiosRequest.get(`/${username}/get-user-profile-data`, { showGlobalLoader: false });
            if (requestId !== profileRequestId.current) return;

            if (data.reaction === ReactionCodes.SUCCESS) {
                const profile: SingleUserDetails = data.data;
                setUserDetails({
                    ...profile,
                    formatteduserSpecificationData: arrayToObject(profile.userSpecificationData),
                });
            }
        } catch (error: unknown) {
            if (requestId === profileRequestId.current) {
                const message = typeof error === 'object' && error && 'errorMessage' in error
                    ? String(error.errorMessage)
                    : 'An error occurred while fetching user details. Please try again later.';
                Alert.alert('Error', `${message} for user: ${userName}`, );
                setUserDetails(null);
            }
        } finally {
            if (requestId === profileRequestId.current) setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const requestId = ++profileRequestId.current;
        setNameLayoutY(0);
        setTabContainerWidth(0);
        setActiveTab('basic');
        setUserDetails(null);
        setIsLoading(true);
        scrollY.value = 0;
        activeTabValue.value = 0;

        if (userName) {
            fetchUserDetails(userName, requestId);
        } else {
            setIsLoading(false);
        }

        return () => {
            profileRequestId.current += 1;
        };
    }, [activeTabValue, fetchUserDetails, scrollY, userName]);

    useEffect(() => {
        activeTabValue.value = withTiming(activeTab === 'basic' ? 0 : 1, { duration: 150 });
    }, [activeTab, activeTabValue]);

    // --- HANDLERS ---
    const handleScroll = useAnimatedScrollHandler((event) => {
        scrollY.value = event.contentOffset.y;
    });

    const onNameLayout = useCallback((event: LayoutChangeEvent) => {
        setNameLayoutY(event.nativeEvent.layout.y);
    }, []);

    const handleTabPress = useCallback((tab: 'basic' | 'photos') => {
        setActiveTab(tab);
    }, []);

    const locationText = useMemo(() => {
        if (!userDetails) return '-';
        const { city, country_name } = userDetails.userProfileData;
        return city && country_name ? `${city}, ${country_name}` : country_name ? `${country_name}` : city ? `${city}` : '-';
    }, [userDetails]);

    const reactionList = useMemo(() => {
        const likeData = userDetails?.userLikeData;
        if (!likeData) return [];
        return Array.isArray(likeData) ? likeData : [likeData];
    }, [userDetails?.userLikeData]);
    const hasUserLiked = reactionList.some((reaction) => reaction.like === 1);
    const hasUserDisliked = reactionList.some((reaction) => reaction.like === 0);

    const toggleMenu = useCallback(() => setMenuVisible((visible) => !visible), []);
    const closeMenu = useCallback(() => setMenuVisible(false), []);

    const beginAction = useCallback((action: NonNullable<typeof pendingAction>) => {
        if (actionInFlight.current) return false;
        actionInFlight.current = true;
        setPendingAction(action);
        show();
        return true;
    }, [show]);

    const endAction = useCallback(() => {
        actionInFlight.current = false;
        setPendingAction(null);
        hide();
    }, [hide]);

    const handleBlockUser = useCallback(async () => {
        closeMenu();
        const userId = userDetails?.userData.userId;
        if (!userId || !beginAction('block')) return;

        try {
            const data: any = await axiosRequest.post('/block-user', { block_user_id: userId });
            if (data.reaction !== ReactionCodes.SUCCESS) throw new Error('Failed to block user');

            dispatch(popCard());
            Toast.success('User blocked successfully');
            router.replace('/(tabs)');
        } catch (error: unknown) {
            Alert.alert('Error', getErrorMessage(error, 'An error occurred while blocking the user. Please try again later.'));
        } finally {
            endAction();
        }
    }, [beginAction, closeMenu, dispatch, endAction, userDetails?.userData.userId]);

    const unblockUser = useCallback(async () => {
        closeMenu();
        const userId = userDetails?.userData.userId;
        if (!userId || !beginAction('unblock')) return;

        try {
            const data: any = await axiosRequest.post(`/${userId}/unblock-user-data`, {});
            if (data.reaction !== ReactionCodes.SUCCESS) throw new Error('Failed to unblock user');
            setUserDetails((current) => current ? { ...current, blockByMeUser: false } : current);
        } catch (error: unknown) {
            Alert.alert('Error', getErrorMessage(error, 'An error occurred while unblocking the user. Please try again later.'));
        } finally {
            endAction();
        }
    }, [beginAction, closeMenu, endAction, userDetails?.userData.userId]);

    const reactToUser = useCallback((reaction: 0 | 1) => {
        const action = reaction === 1 ? 'like' : 'dislike';
        requirePremium(async () => {
            const userId = userDetails?.userData.userId;
            if (!userId || !beginAction(action)) return;

            try {
                const data: any = await axiosRequest.post(`/${userId}/${reaction}/user-like-dislike`, {});
                if (data.reaction !== ReactionCodes.SUCCESS) throw new Error(`Failed to ${action} user`);

                dispatch(popCard());
                setUserDetails((current) => {
                    if (!current) return current;
                    const currentReactions = Array.isArray(current.userLikeData)
                        ? current.userLikeData
                        : current.userLikeData ? [current.userLikeData] : [];
                    const alreadySelected = currentReactions.some((item) => item.like === reaction);
                    const nextReactions = alreadySelected
                        ? currentReactions.filter((item) => item.like !== reaction)
                        : [
                            ...currentReactions.filter((item) => item.like !== (reaction === 1 ? 0 : 1)),
                            { like: reaction, _id: Date.now() },
                        ];
                    return { ...current, userLikeData: nextReactions };
                });
            } catch (error: unknown) {
                const verb = action === 'like' ? 'liking' : 'disliking';
                Alert.alert('Error', getErrorMessage(error, `An error occurred while ${verb} the user. Please try again later.`));
            } finally {
                endAction();
            }
        });
    }, [beginAction, dispatch, endAction, requirePremium, userDetails?.userData.userId]);

    const likeUser = useCallback(() => reactToUser(1), [reactToUser]);
    const dislikeUser = useCallback(() => reactToUser(0), [reactToUser]);

    const renderBackdrop = useCallback(
        (props: JSX.IntrinsicAttributes & BottomSheetDefaultBackdropProps) => (
            <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
        ),
        []
    );

    const dismissReportSheet = useCallback(() => bottomSheetModalRef.current?.dismiss(), []);

    const renderHeaderHandle = useCallback(
        (props: BottomSheetHandleProps) => (
            <BottomSheetHandle {...props}>
                <View style={styles.sheetHeader}>
                    <TouchableOpacity
                        accessibilityLabel="Close report form"
                        accessibilityRole="button"
                        hitSlop={8}
                        onPress={dismissReportSheet}
                        style={styles.sheetCloseButton}
                    >
                        <Ionicons name="close-circle" size={24} color="black" />
                    </TouchableOpacity>
                    <Text className="font-firabold text-black text-base text-center">Report User</Text>
                </View>
            </BottomSheetHandle>
        ),
        [dismissReportSheet]
    );

    const openReportSheet = useCallback(() => {
        closeMenu();
        bottomSheetModalRef.current?.present();
    }, [closeMenu]);

    const reportAccount = useCallback(async () => {
        const userId = userDetails?.userData.userId;
        if (!userId) return;
        if (!reportCategory) {
            Alert.alert('Select a reason', 'Please choose a reason for your report.');
            return;
        }
        if (!beginAction('report')) return;

        try {
            const params = {
                report_reason: reportReason.trim()
                    ? `[${reportCategory}] ${reportReason.trim()}`
                    : reportCategory
            };
            const data: any = await axiosRequest.post(`/${userId}/report-user`, params);
            if (data.reaction !== ReactionCodes.SUCCESS) throw new Error('Failed to report user');

            dispatch(popCard());
            Toast.success('User reported successfully');
            dismissReportSheet();
        } catch (error: unknown) {
            Alert.alert('Error', getErrorMessage(error, 'An error occurred while reporting the user. Please try again later.'));
        } finally {
            endAction();
        }
    }, [beginAction, dismissReportSheet, dispatch, endAction, reportCategory, reportReason, userDetails?.userData.userId]);

    const createBlockNotificationAlert = useCallback(() => {
        closeMenu();
        Alert.alert(`Block @${userDetails?.userData.userName}`, 'Are you sure you want to block this user? You will no longer see content from this user.', [
            {
                text: 'Cancel',
                style: 'cancel',
            },
            { text: 'Block', style: 'destructive', onPress: handleBlockUser },
        ]);
    }, [closeMenu, handleBlockUser, userDetails?.userData.userName]);

    const onTabContainerLayout = useCallback((event: LayoutChangeEvent) => {
        setTabContainerWidth(event.nativeEvent.layout.width);
    }, []);

    const messageUser = useCallback(() => {
        const userId = userDetails?.userData.userId;
        if (!userId) return;
        requirePremium(() => {
            router.navigate({ pathname: '/single-chat/[userId]', params: { userId } });
        });
    }, [requirePremium, userDetails?.userData.userId]);

    const resetReportForm = useCallback(() => {
        setReportReason('');
        setReportCategory('');
    }, []);

    const closePremiumModal = useCallback(() => setShowModal(false), [setShowModal]);

    // --- ANIMATIONS ---
    const headerNameStyle = useAnimatedStyle(() => {
        // Safety Check: If layout hasn't been measured (0) or is suspiciously small, hide header.
        // This prevents the header from flashing before the layout position is confirmed.
        if (nameLayoutY < 100) {
            return { opacity: 0, transform: [{ translateY: 10 }] };
        }

        const triggerPoint = nameLayoutY;
        const opacity = interpolate(scrollY.value, [triggerPoint, triggerPoint + 50], [0, 1], Extrapolation.CLAMP);
        const translateY = interpolate(scrollY.value, [triggerPoint, triggerPoint + 50], [10, 0], Extrapolation.CLAMP);
        return { opacity, transform: [{ translateY }] };
    });

    const tabIndicatorStyle = useAnimatedStyle(() => {
        // Hide indicator until container is measured to prevent it appearing at width 0
        if (tabContainerWidth === 0) return { opacity: 0 };

        const availableWidth = tabContainerWidth - 8;
        const tabWidth = availableWidth / 2;
        const translateX = interpolate(activeTabValue.value, [0, 1], [0, tabWidth]);

        return {
            opacity: 1,
            transform: [{ translateX }],
            width: tabWidth
        };
    });

    const basicTextStyle = useAnimatedStyle(() => {
        return { color: withTiming(activeTabValue.value === 0 ? '#FFFFFF' : '#000000', { duration: 150 }) };
    });

    const photosTextStyle = useAnimatedStyle(() => {
        return { color: withTiming(activeTabValue.value === 1 ? '#FFFFFF' : '#000000', { duration: 150 }) };
    });

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <NavBar title={<Animated.View style={[styles.headerTitleContainer, headerNameStyle]}>
                <Text style={styles.headerTitleText}>
                    {userDetails?.userData.first_name} {userDetails?.userData.last_name}, {userDetails?.userData.userAge}
                </Text>
            </Animated.View>}
                rightItem={userDetails ? <TouchableOpacity
                    accessibilityLabel="Open profile actions"
                    accessibilityRole="button"
                    disabled={pendingAction !== null}
                    onPress={toggleMenu}
                    style={styles.iconButton}
                >
                    <EllipsisIcon width={24} height={24} color="#000" />
                </TouchableOpacity> : null}
            />
            {/* <View style={[styles.headerContainer, { paddingTop: insets.top }]}>
                <TouchableOpacity onPress={handleBack} style={styles.iconButton}>
                    <ArrowBackIcon width={24} height={24} color="#000" />
                </TouchableOpacity>

                <Animated.View style={[styles.headerTitleContainer, headerNameStyle]}>
                    <Text style={styles.headerTitleText}>
                        {userDetails?.userData.first_name} {userDetails?.userData.last_name}, {userDetails?.userData.userAge}
                    </Text>
                </Animated.View>

                <TouchableOpacity onPress={toggleMenu} style={styles.iconButton}>
                    <EllipsisIcon width={24} height={24} color="#000" />
                </TouchableOpacity>
            </View> */}

            <Modal
                transparent
                visible={isMenuVisible}
                animationType="fade"
                onRequestClose={closeMenu}
            >
                <View style={styles.modalOverlay}>
                    <Pressable
                        accessibilityLabel="Close profile actions"
                        accessibilityRole="button"
                        onPress={closeMenu}
                        style={StyleSheet.absoluteFill}
                    />
                    <View style={[styles.menuContainer, { top: HEADER_HEIGHT + insets.top + 5 }]}>
                            {/* <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuItemPress('message')}>
                                <Ionicons name="chatbubble-outline" size={20} color="#333" style={styles.menuIcon} />
                                <Text style={styles.menuText}>Message User</Text>
                            </TouchableOpacity>
                            <View style={styles.menuDivider} /> */}
                            <TouchableOpacity accessibilityRole="button" style={styles.menuItem} onPress={openReportSheet}>
                                <Ionicons name="flag-outline" size={20} color="#FF3B30" style={styles.menuIcon} />
                                <Text style={[styles.menuText, styles.destructiveText]}>Report Account</Text>
                            </TouchableOpacity>
                            <View style={styles.menuDivider} />
                            {userDetails && !userDetails.blockByMeUser && <TouchableOpacity accessibilityRole="button" style={styles.menuItem} onPress={createBlockNotificationAlert}>
                                <Ionicons name="ban-outline" size={20} color="#FF3B30" style={styles.menuIcon} />
                                <Text style={[styles.menuText, styles.destructiveText]}>Block User</Text>
                            </TouchableOpacity>}
                            {userDetails && userDetails.blockByMeUser && <TouchableOpacity accessibilityRole="button" style={styles.menuItem} onPress={unblockUser}>
                                <Ionicons name="ban-outline" size={20} color="#FF3B30" style={styles.menuIcon} />
                                <Text style={[styles.menuText, styles.destructiveText]}>Unblock User</Text>
                            </TouchableOpacity>}
                    </View>
                </View>
            </Modal>

            {isLoading ? (
                <UserDetailsSkeleton />
            ) : (
                !userDetails ? (
                    <View style={[styles.contentPadding, { marginTop: 20 }]}>
                         <Skeleton style={{ width: '100%', height: height * 0.35, borderRadius: 24, marginBottom: 20 }} />
                        <Text className='text-base font-firasemibold text-center'>User not found.</Text>
                    </View>
                ) : (
                    <View className='flex-1'>
                        <Animated.ScrollView
                            onScroll={handleScroll}
                            scrollEventThrottle={16}
                            contentContainerStyle={{ flexGrow: 1, paddingBottom: insets.bottom + 20, paddingTop: 20 }}
                            showsVerticalScrollIndicator={false}
                        >
                            {/* <View style={{ height: HEADER_HEIGHT + insets.top }} /> */}

                            <View style={styles.contentPadding}>
                                <Image
                                    accessibilityLabel={`${userDetails.userData.first_name}'s profile photo`}
                                    cachePolicy="memory-disk"
                                    contentFit="cover"
                                    source={{ uri: userDetails?.userData.profilePicture }}
                                    style={[styles.mainImage, { height: height * 0.35 }]}
                                    transition={200}
                                />

                                <View onLayout={onNameLayout}>
                                    <View className='flex-row items-center gap-2'>
                                        <Text style={styles.nameText}>
                                            {userDetails?.userData.first_name} {userDetails?.userData.last_name} {userDetails?.userData.userAge && `(${userDetails?.userData.userAge})`}
                                        </Text>
                                        <BadgeIcon fill={"#DD3FE5"} />
                                    </View>
                                    <View style={styles.locationRow}>
                                        <LocationIcon stroke="#666" />
                                        <Text style={styles.locationText}>{locationText}</Text>
                                    </View>
                                </View>

                                {/* --- ANIMATED TABS --- */}
                                {userDetails?.blockByMeUser ? <View className='mt-10 py-4 bg-red-500 rounded-lg'>
                                    <Text className='text-base font-firasemibold text-center text-white'>@{userDetails?.userData.userName} is blocked. Unblock this user and see their full details.</Text>
                                </View> : userDetails.isBlockUser ? <View className='mt-10 py-4 bg-red-500 rounded-lg'>
                                    <Text className='text-base font-firasemibold text-center text-white'>@{userDetails?.userData.userName} has blocked you</Text>
                                </View> :
                                    <View
                                        style={styles.tabSwitcher}
                                        onLayout={onTabContainerLayout}
                                    >
                                        <Animated.View style={[styles.activeTabIndicator, tabIndicatorStyle]} />

                                        <Pressable accessibilityRole="tab" accessibilityState={{ selected: activeTab === 'basic' }} style={styles.tabButton} onPress={() => handleTabPress('basic')}>
                                            <Animated.Text style={[styles.tabText, basicTextStyle]}>Basic Info</Animated.Text>
                                        </Pressable>

                                        <Pressable accessibilityRole="tab" accessibilityState={{ selected: activeTab === 'photos' }} style={styles.tabButton} onPress={() => handleTabPress('photos')}>
                                            <Animated.Text style={[styles.tabText, photosTextStyle]}>Photos</Animated.Text>
                                        </Pressable>
                                    </View>
                                }
                            </View>
                            {!(userDetails?.blockByMeUser || userDetails.isBlockUser) && (activeTab === 'basic' ? (
                                <BasicInfoTab userDetails={userDetails} />
                            ) : (
                                <PhotosTab photos={userDetails.photosData} />
                            ))}
                            <View style={{ height: HEADER_HEIGHT + insets.bottom }} />
                        </Animated.ScrollView>
                        
                        {!(userDetails.blockByMeUser || userDetails.isBlockUser) ? (
                            <View style={[styles.actionBar, { paddingBottom: insets.bottom }]}>
                            <View className='flex-row items-center justify-center gap-8 py-2'>
                                <TouchableOpacity accessibilityLabel={hasUserLiked ? 'Unlike user' : 'Like user'} accessibilityRole="button" disabled={pendingAction !== null} onPress={likeUser} className='items-center justify-center space-y-0.5'>
                                    <HeartOutlineIcon fill={hasUserLiked ? "#DD3FE5" : "#fff"} stroke={hasUserLiked ? "#fff" : "#141B34"} />
                                    <Text className={`text-xs font-firaregular ${hasUserLiked ? "text-[#DD3FE5]" : "text-[#141B34]"}`}>{hasUserLiked ? "Liked" : "Like"}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity accessibilityLabel={hasUserDisliked ? 'Remove dislike' : 'Dislike user'} accessibilityRole="button" disabled={pendingAction !== null} onPress={dislikeUser} className='items-center justify-center space-y-0.5'>
                                    <HeartbreakIcon fill={hasUserDisliked ? "#FF383C" : "#fff"} stroke={hasUserDisliked ? "#fff" : "#141B34"} />
                                    <Text className={`text-xs font-firaregular ${hasUserDisliked ? "text-[#FF383C]" : "text-[#141B34]"}`}>{hasUserDisliked ? "Disliked" : "Dislike"}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity accessibilityLabel="Message user" accessibilityRole="button" disabled={pendingAction !== null} onPress={messageUser} className='items-center justify-center space-y-0.5'>
                                    <CommentIcon />
                                    <Text className="text-xs font-firaregular">Message</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        ) : null}
                    </View>
                )
            )}

            <BottomSheetModal
                ref={bottomSheetModalRef}
                enableDynamicSizing
                enablePanDownToClose
                style={styles.reportSheet}
                backgroundStyle={styles.reportSheet}
                backdropComponent={renderBackdrop}
                handleComponent={renderHeaderHandle}
                keyboardBehavior="interactive"
                enableBlurKeyboardOnGesture
                keyboardBlurBehavior='restore'
                android_keyboardInputMode={Platform.OS === 'android' ? 'adjustResize' : 'adjustPan'}
                onDismiss={resetReportForm}
            >

                <BottomSheetView>
                    <View style={{ paddingBottom: insets.bottom + 10, paddingHorizontal: 16 }}>
                        <Text style={{ fontFamily: 'Onest_500Medium', fontSize: 14, color: '#000', marginBottom: 10 }}>
                            Why are you reporting this account?
                        </Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                            {reportReasonOptions.map((reason) => {
                                const selected = reportCategory === reason;
                                return (
                                    <TouchableOpacity
                                        accessibilityRole="radio"
                                        accessibilityState={{ selected }}
                                        key={reason}
                                        onPress={() => setReportCategory(reason)}
                                        style={{
                                            paddingVertical: 8,
                                            paddingHorizontal: 14,
                                            borderRadius: 20,
                                            borderWidth: 1,
                                            borderColor: selected ? '#DD3FE5' : '#cccccc80',
                                            backgroundColor: selected ? '#DD3FE51A' : '#F2F2F7',
                                        }}
                                    >
                                        <Text style={{
                                            fontFamily: 'Onest_400Regular',
                                            fontSize: 13,
                                            color: selected ? '#DD3FE5' : '#5B5B5B',
                                        }}>
                                            {reason}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                        <View className="bg-[#F2F2F7] text-black rounded-xl px-4 min-h-[100px] max-h-[200px] focus:border-primary border border-[#cccccc80]">
                            <BottomSheetTextInput
                                accessibilityLabel="Additional report details"
                                multiline
                                value={reportReason}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: 12,
                                    backgroundColor: '#F2F2F7',
                                    padding: 12,
                                    fontSize: 16,
                                    textAlignVertical: 'top',
                                    fontFamily: 'Onest_400Regular',
                                }}
                                placeholder="Add more details (optional)..."
                                autoCapitalize="none"
                                importantForAutofill='no'
                                placeholderTextColor={"#5B5B5B3A"}
                                selectionColor={'#DD3FE5'}
                                onChangeText={setReportReason}
                            />
                        </View>

                        <View className='mt-4'>
                            <CustomButton title="Report" handlePress={reportAccount} isLoading={pendingAction === 'report'} disabled={pendingAction !== null} />
                        </View>
                    </View>
                </BottomSheetView>
            </BottomSheetModal>

            <PremiumActionModal
                visible={showModal}
                onClose={closePremiumModal}
                {...modalOptions}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    headerContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 90,
        height: HEADER_HEIGHT + 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        backgroundColor: 'rgba(255,255,255,0.95)',
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#C7C7CC',
    },
    headerTitleContainer: {
        flex: 1,
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
    },
    headerTitleText: {
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'Onest_600SemiBold',
        color: '#000',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    menuContainer: {
        position: 'absolute',
        right: 20,
        width: 200,
        backgroundColor: 'white',
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        paddingVertical: 8,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    menuIcon: {
        marginRight: 12,
    },
    menuText: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
    },
    destructiveText: {
        color: '#FF3B30',
    },
    menuDivider: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginHorizontal: 16,
    },
    contentPadding: {
        paddingHorizontal: 16,
    },
    mainImage: {
        width: '100%',
        borderRadius: 24,
        marginBottom: 20,
        backgroundColor: '#f0f0f0',
    },
    nameText: {
        fontSize: 24,
        fontWeight: '600',
        fontFamily: 'Onest_600SemiBold',
        color: '#000',
        marginBottom: 4,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    locationText: {
        fontSize: 14,
        color: '#888',
        marginLeft: 4,
    },
    tabSwitcher: {
        flexDirection: 'row',
        backgroundColor: '#F2F2F7',
        borderRadius: 70,
        padding: 4,
        marginBottom: 24,
        position: 'relative',
    },
    activeTabIndicator: {
        position: 'absolute',
        top: 4,
        bottom: 4,
        left: 4,
        backgroundColor: '#D946EF',
        borderRadius: 26,
    },
    tabButton: {
        flex: 1,
        paddingVertical: 16,
        alignItems: 'center',
        borderRadius: 26,
        zIndex: 1,
    },
    tabText: {
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'Onest_600SemiBold'
    },
    tabContent: {
        minHeight: 200,
    },
    section: {
        // marginBottom: 24,
        marginHorizontal: 16
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '500',
        fontFamily: 'Onest_500Medium',
        marginBottom: 12,
        color: '#000',
    },
    sectionContent: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    bodyText: {
        fontSize: 14,
        lineHeight: 22,
        color: '#666',
    },
    photoGrid: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        flexWrap: 'wrap',
        gap: 12,
    },
    gridPhoto: {
        width: '31%',
        height: 150,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: '#eee',
    },
    photoThumbnail: {
        width: '100%',
        height: '100%',
    },
    photoModal: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    photoPreview: {
        width: '100%',
        height: '100%',
    },
    actionBar: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: 90,
        paddingHorizontal: 16,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.95)',
    },
    sheetHeader: {
        position: 'relative',
        paddingVertical: 16,
    },
    sheetCloseButton: {
        position: 'absolute',
        top: 16,
        left: 16,
        zIndex: 10,
        backgroundColor: '#FFFFFF',
    },
    reportSheet: {
        borderRadius: 28,
    },
});
