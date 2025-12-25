import React, { JSX, useCallback, useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Dimensions,
    Pressable,
    LayoutChangeEvent,
    Modal,
    TouchableWithoutFeedback, Alert,
    Platform
} from 'react-native';
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


const { width } = Dimensions.get('window');
const HEADER_HEIGHT = 60;

// --- SUB-COMPONENTS ---

const Chip = ({ label, type }: { label: string; type?: 'pill' | 'transparent' }) => (
    <View style={[styles.chip, type === 'transparent' && styles.transparentChip]}>
        <Text style={styles.chipText}>{label}</Text>
    </View>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.sectionContent}>{children}</View>
    </View>
);

const InfoPiills = (infoArray: string[]) => {
    if (!infoArray || infoArray.length === 0) return <Text style={styles.bodyText}>-</Text>;
    return (
        <View className='flex-1 space-y-1'>
            {infoArray.map((info, index) => (
                <Text className='flex-1 text-right text-black text-xs font-firaregular' key={index}>{info}</Text>
            ))}
        </View>
    );
}

const BasicInfoTab = ({ userDetails }: { userDetails: SingleUserDetails }) => {
    const { userProfileData, userSpecificationData, formatteduserSpecificationData } = userDetails;
    const { aboutMe, interest, formatted_preferred_language, formatted_education, formatted_work_status, city, country_name, gender_text, birthday, relationship_type, formatted_relationship_status, mobile_number } = userProfileData;
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
                <ProfileInfoItem icon={<Feather name="phone" size={18} color="#666" />} label="Phone No." value={mobile_number} />
                <ProfileInfoItem icon={<Feather name="calendar" size={18} color="#666" />} label="Date of Birth" value={birthday} />
                <ProfileInfoItem icon={<MaterialCommunityIcons name="gender-male-female" size={18} color="#666" />} label="Gender" value={gender_text} />
                <ProfileInfoItem icon={<Feather name="users" size={18} color="#666" />} label="Rel. Status" value={formatted_relationship_status} />
                <ProfileInfoItem icon={<Feather name="heart" size={18} color="#666" />} label="Rel. Type" value={InfoPiills(relationship_type)} />
                <ProfileInfoItem icon={<MaterialIcons name="school" size={18} color="#666" />} label="Education" value={formatted_education} />
                <ProfileInfoItem icon={<Fontisto name="language" size={18} color="#666" />} label="Preferred Language" value={formatted_preferred_language} />
                <ProfileInfoItem icon={<Feather name="briefcase" size={18} color="#666" />} label="Work Status" value={formatted_work_status} />
                <ProfileInfoItem icon={<Feather name="heart" size={18} color="#666" />} label="Interest" value={InfoPiills(interest)} />
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [item, setItem] = useState<{ image_url: string } | null>(null);
  const closeModal = () => {
    setIsModalOpen(false);
    setItem(null);
  };
  const openModal = (item: { image_url: string }) => {
    setItem(item);
    setIsModalOpen(true);
  };
    return (
        <><View className='mx-4'>
            {photos.length === 0 ? (
                <Text style={styles.bodyText}>No photos available.</Text>
            ) : (
                <View style={[styles.photoGrid]}>
                    {photos.map((photo, index) => (
                        <TouchableWithoutFeedback onPress={() => openModal(photo)} key={`${photo.image_url}_${index}`}>
                            <Image key={index} source={{ uri: photo.image_url }} style={styles.gridPhoto} />
                        </TouchableWithoutFeedback>
                    ))}
                </View>
            )}
        </View>
        <Modal
            visible={isModalOpen}
            animationType="fade"
            onRequestClose={closeModal}
        >
                <View className='flex-1'>
                    <NavBar leftItem={<TouchableOpacity onPress={closeModal} className=' flex items-center justify-center'>
                        <Ionicons name="close-circle" size={24} color="black" />
                    </TouchableOpacity>} title={'View Image'} />
                    <View className='flex-1 justify-center items-center p-6'>
                        <Image source={{ uri: item?.image_url }} style={{ resizeMode: 'contain', width: '100%', height: '100%', maxHeight: Dimensions.get('screen').height * 0.9, maxWidth: Dimensions.get('screen').width * 0.9, margin: 'auto' }} />
                    </View>
                </View>
            </Modal>
            </>
    )
}

export default function UserDetailsScreen() {
    const { userName } = useLocalSearchParams();
    const insets = useSafeAreaInsets();
    const { show, hide } = useLoader();
    const dispatch = useAppDispatch();

    // State
    const [activeTab, setActiveTab] = useState<'basic' | 'photos'>('basic');
    const [isMenuVisible, setMenuVisible] = useState(false);
    const [userDetails, setUserDetails] = useState<SingleUserDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [reportReason, setReportReason] = useState('');
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);

    // Layout Measurements (Reset these on data fetch to prevent jumpiness)
    const [tabContainerWidth, setTabContainerWidth] = useState(0);
    const [nameLayoutY, setNameLayoutY] = useState(0);

    // Shared Values
    const scrollY = useSharedValue(0);
    const activeTabValue = useSharedValue(0);

    // --- EFFECT: STATE SYNC & RESET ---
    // This solves the issue where animation state persists after data refresh/hot-reload
    useEffect(() => {
        // Reset layout dependent states
        setNameLayoutY(0);
        setTabContainerWidth(0);

        // Reset Shared Values to 0 (Top of screen, first tab)
        scrollY.value = 0;
        activeTabValue.value = 0;
        setActiveTab('basic');

        fetchUserDetails();
    }, [userName]);

    // Sync active tab state with animation value
    useEffect(() => {
        activeTabValue.value = withTiming(activeTab === 'basic' ? 0 : 1, { duration: 150 });
    }, [activeTab]);

    const fetchUserDetails = async () => {
        try {
            setIsLoading(true);
            const data: any = await axiosRequest.get(`/${userName}/get-user-profile-data`, { headers: { 'hide-loader': 'true' } });
            if (data.reaction === ReactionCodes.SUCCESS) {
                const userDetails: SingleUserDetails = data.data;
                const userSpecificationData = userDetails.userSpecificationData;
                const formatteduserSpecificationData = arrayToObject(userSpecificationData);
                const userProfileData = { ...userDetails, formatteduserSpecificationData: formatteduserSpecificationData };
                setUserDetails(userProfileData);
            }
            setIsLoading(false);
        } catch (error: any) {
            Alert.alert('Error', error && error.errorMessage ? error.errorMessage : 'An error occurred while fetching user details. Please try again later.');
            setUserDetails(null);
            setIsLoading(false);
        }
    }

    // --- HANDLERS ---
    const handleScroll = useAnimatedScrollHandler((event) => {
        scrollY.value = event.contentOffset.y;
    });

    const onNameLayout = (event: LayoutChangeEvent) => {
        setNameLayoutY(event.nativeEvent.layout.y);
    };

    const handleTabPress = (tab: 'basic' | 'photos') => {
        setActiveTab(tab);
    };

    const locationText = useCallback(() => {
        if (!userDetails) return '-';
        const { city, country_name } = userDetails.userProfileData;
        return city && country_name ? `${city}, ${country_name}` : country_name ? `${country_name}` : city ? `${city}` : '-';
    }, [userDetails]);

    const hasUserLiked = useCallback((likeData: { like: number, _id: number }[] | { like: number, _id: number }) => {
        if (likeData && Array.isArray(likeData)) {
            return likeData.some((like) => like.like == 1)
        } else if (likeData && typeof likeData === 'object') {
            return likeData.like == 1
        } else {
            return false
        }
    }, [userDetails?.userLikeData])

    const hasUserDisliked = useCallback((likeData: { like: number, _id: number }[] | { like: number, _id: number }) => {
        if (likeData && Array.isArray(likeData)) {
            return likeData.some((like) => like.like == 0)
        } else if (likeData && typeof likeData === 'object') {
            return likeData.like == 0
        } else {
            return false
        }
    }, [userDetails?.userLikeData])

    const handleBlockUser = async () => {
        closeMenu();
        try {
            const params = {
                block_user_id: userDetails?.userData.userId
            }
            show();
            const data: any = await axiosRequest.post(`/block-user`, params);
            hide();
            if (data.reaction === ReactionCodes.SUCCESS) {
                setUserDetails((prevUserDetails) => {
                    return {
                        ...prevUserDetails!,
                        blockByMeUser: true
                    }
                })
            }
        } catch (error: any) {
            Alert.alert('Error', error && error.errorMessage ? error.errorMessage : 'An error occurred while blocking the user. Please try again later.');
            hide();
        }
    }

    const unblockUser = async () => {
        closeMenu();
        try {
            const userId = userDetails?.userData.userId;
            const params = {
                block_user_id: userDetails?.userData.userId
            }
            show();
            const data: any = await axiosRequest.post(`${userId}/unblock-user-data`, {});
            hide();
            if (data.reaction === ReactionCodes.SUCCESS) {
                setUserDetails((prevUserDetails) => {
                    return {
                        ...prevUserDetails!,
                        blockByMeUser: false
                    }
                })
            }
        } catch (error: any) {
            hide();
            Alert.alert('Error', error && error.errorMessage ? error.errorMessage : 'An error occurred while unblocking the user. Please try again later.');
        }
    }

    const likeUser = async () => {
        try {
            const userId = userDetails?.userData.userId;
            if (!userId) {
                return new Error('User ID not found');
            }
            show();
            const data: any = await axiosRequest.post(`/${userId}/1/user-like-dislike`, {})
            hide();
            dispatch(popCard());
            if (data.reaction === ReactionCodes.SUCCESS) {
                const oldUserDetails = Object.assign({}, userDetails);
                if (oldUserDetails) {
                    let newLikeData = oldUserDetails.userLikeData || [];
                    if (Array.isArray(newLikeData)) {
                        if (newLikeData.some((like) => like.like == 1)) {
                            // User has already liked, remove the like
                            newLikeData = newLikeData.filter((like) => like.like != 1);
                        } else {
                            newLikeData.push({ like: 1, _id: Date.now() });
                        }
                    } else {
                        if (newLikeData.like == 1) {
                            newLikeData = [];
                        } else {
                            newLikeData = [{ like: 1, _id: Date.now() }];
                        }
                    }
                    setUserDetails({
                        ...oldUserDetails,
                        userLikeData: newLikeData
                    });
                }
            } else {
                throw new Error('Failed to like user');
            }
        } catch (error: any) {
            hide();
            Alert.alert('Error', error && error.errorMessage ? error.errorMessage : 'An error occurred while liking the user. Please try again later.');
        }
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

    const renderHeaderHandle = useCallback(
        (props: BottomSheetHandleProps) => (
            <BottomSheetHandle
                {...props}
            >
                <View className="py-4 relative">

                    <View className=' w-full'>
                        <TouchableOpacity onPress={() => bottomSheetModalRef.current?.dismiss()} className=' flex items-center justify-center' style={{
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
                        <Text className='font-firabold text-black text-base mx-auto text-center'>Report User</Text>
                    </View>
                </View>
            </BottomSheetHandle>
        ),
        []
    );

    const dislikeUser = async () => {
        try {
            const userId = userDetails?.userData.userId;
            if (!userId) {
                return new Error('User ID not found');
            }
            show();
            const data: any = await axiosRequest.post(`/${userId}/0/user-like-dislike`, {})
            hide();
            dispatch(popCard());
            if (data.reaction === ReactionCodes.SUCCESS) {
                const oldUserDetails = Object.assign({}, userDetails);
                if (oldUserDetails) {
                    let newLikeData = oldUserDetails.userLikeData || [];
                    if (Array.isArray(newLikeData)) {
                        if (newLikeData.some((like) => like.like == 0)) {
                            // User has already disliked, remove the dislike
                            newLikeData = newLikeData.filter((like) => like.like != 0);
                        } else {
                            newLikeData.push({ like: 0, _id: Date.now() });
                        }
                    } else {
                        if (newLikeData.like == 0) {
                            newLikeData = [];
                        } else {
                            newLikeData = [{ like: 0, _id: Date.now() }];
                        }
                    }
                    setUserDetails({
                        ...oldUserDetails,
                        userLikeData: newLikeData
                    });
                }
            } else {
                throw new Error('Failed to like user');
            }
        } catch (error: any) {
            hide();
            Alert.alert('Error', error && error.errorMessage ? error.errorMessage : 'An error occurred while disliking the user. Please try again later.');
        }
    }

    const toggleMenu = () => setMenuVisible(!isMenuVisible);
    const closeMenu = () => setMenuVisible(false);

    const handleMenuItemPress = (action: string) => {
        closeMenu();
        // API Logic here
        if (action === 'block') {
            handleBlockUser();
        } else if (action === 'report') {
            bottomSheetModalRef.current?.present();
        }
    };

    const reportAccount = async () => {
        try {
            const userId = userDetails?.userData.userId;
            if (!userId) {
                return new Error('User ID not found');
            }
            show();
            const params = {
                report_reason: reportReason
            }
            const data: any = await axiosRequest.post(`/${userId}/report-user`, params)
            hide();
            dispatch(popCard());
            if (data.reaction === ReactionCodes.SUCCESS) {
                Toast.success('User reported successfully');
                bottomSheetModalRef.current?.dismiss();
            } else {
                throw new Error('Failed to report user');
            }
        } catch (error: any) {
            hide();
            Alert.alert('Error', error && error.errorMessage ? error.errorMessage : 'An error occurred while reporting the user. Please try again later.');
        }
    }

    const createBlockNotificationAlert = () => {
        closeMenu();
        Alert.alert(`Block @${userDetails?.userData.userName}`, 'Are you sure you want to block this user?', [
            {
                text: 'Cancel',
                onPress: () => {},
                style: 'cancel',
            },
            { text: 'Block', style: 'destructive', onPress: () => handleBlockUser() },
        ])
    };

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
                rightItem={userDetails ? <TouchableOpacity onPress={toggleMenu} style={styles.iconButton}>
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
                transparent={true}
                visible={isMenuVisible}
                animationType="fade"
                onRequestClose={closeMenu}
            >
                <TouchableWithoutFeedback onPress={closeMenu}>
                    <View style={styles.modalOverlay}>
                        <View style={[styles.menuContainer, { top: HEADER_HEIGHT + insets.top + 5 }]}>
                            {/* <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuItemPress('message')}>
                                <Ionicons name="chatbubble-outline" size={20} color="#333" style={styles.menuIcon} />
                                <Text style={styles.menuText}>Message User</Text>
                            </TouchableOpacity>
                            <View style={styles.menuDivider} /> */}
                            <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuItemPress('report')}>
                                <Ionicons name="flag-outline" size={20} color="#FF3B30" style={styles.menuIcon} />
                                <Text style={[styles.menuText, styles.destructiveText]}>Report Account</Text>
                            </TouchableOpacity>
                            <View style={styles.menuDivider} />
                            {userDetails && !userDetails.blockByMeUser && <TouchableOpacity style={styles.menuItem} onPress={createBlockNotificationAlert}>
                                <Ionicons name="ban-outline" size={20} color="#FF3B30" style={styles.menuIcon} />
                                <Text style={[styles.menuText, styles.destructiveText]}>Block User</Text>
                            </TouchableOpacity>}
                            {userDetails && userDetails.blockByMeUser && <TouchableOpacity style={styles.menuItem} onPress={unblockUser}>
                                <Ionicons name="ban-outline" size={20} color="#FF3B30" style={styles.menuIcon} />
                                <Text style={[styles.menuText, styles.destructiveText]}>Unblock User</Text>
                            </TouchableOpacity>}
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            {isLoading ? (
                <UserDetailsSkeleton />
            ) : (
                !userDetails ? (
                    <View style={[styles.contentPadding, { marginTop: 20 }]}>
                         <Skeleton style={{ width: '100%', height: 350, borderRadius: 24, marginBottom: 20 }} />
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
                                    source={{ uri: userDetails?.userData.profilePicture }}
                                    style={styles.mainImage}
                                    resizeMode='cover'
                                    resizeMethod='resize'
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
                                        <Text style={styles.locationText}>{locationText()}</Text>
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
                                        onLayout={(e) => setTabContainerWidth(e.nativeEvent.layout.width)}
                                    >
                                        <Animated.View style={[styles.activeTabIndicator, tabIndicatorStyle]} />

                                        <Pressable style={styles.tabButton} onPress={() => handleTabPress('basic')}>
                                            <Animated.Text style={[styles.tabText, basicTextStyle]}>Basic Info</Animated.Text>
                                        </Pressable>

                                        <Pressable style={styles.tabButton} onPress={() => handleTabPress('photos')}>
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
                        
                        {!(userDetails?.blockByMeUser || userDetails.isBlockUser) && 
                            <View style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            zIndex: 90,
                            paddingBottom: insets.bottom,
                            borderTopLeftRadius: 12,
                            borderTopRightRadius: 12,
                            paddingHorizontal: 16,
                            backgroundColor: 'rgba(255,255,255,0.95)',
                        }}>
                            <View className='flex-row items-center justify-center gap-8 py-2'>
                                <TouchableOpacity onPress={likeUser} className='items-center justify-center space-y-0.5'>
                                    <HeartOutlineIcon fill={hasUserLiked(userDetails.userLikeData) ? "#DD3FE5" : "#fff"} stroke={hasUserLiked(userDetails.userLikeData) ? "#fff" : "#141B34"} />
                                    <Text className={`text-xs font-firaregular ${hasUserLiked(userDetails.userLikeData) ? "text-[#DD3FE5]" : "text-[#141B34]"}`}>{hasUserLiked(userDetails.userLikeData) ? "Liked" : "Like"}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={dislikeUser} className='items-center justify-center space-y-0.5'>
                                    <HeartbreakIcon fill={hasUserDisliked(userDetails.userLikeData) ? "#FF383C" : "#fff"} stroke={hasUserDisliked(userDetails.userLikeData) ? "#fff" : "#141B34"} />
                                    <Text className={`text-xs font-firaregular ${hasUserDisliked(userDetails.userLikeData) ? "text-[#FF383C]" : "text-[#141B34]"}`}>{hasUserDisliked(userDetails.userLikeData) ? "Disliked" : "Dislike"}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => router.navigate({
                                    pathname: '/single-chat/[userId]',
                                    params: { userId: userDetails?.userData.userId }
                                })} className='items-center justify-center space-y-0.5'>
                                    <CommentIcon />
                                    <Text className="text-xs font-firaregular">Message</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
}
                    </View>
                )
            )}

            <BottomSheetModal
                ref={bottomSheetModalRef}
                enableDynamicSizing
                enablePanDownToClose={true}
                style={{
                    borderRadius: 28,
                }}
                backgroundStyle={{
                    borderRadius: 28,
                }}
                backdropComponent={renderBackdrop}
                handleComponent={renderHeaderHandle}
                keyboardBehavior="interactive"
                enableBlurKeyboardOnGesture
                keyboardBlurBehavior='restore'
                android_keyboardInputMode={Platform.OS === 'android' ? 'adjustResize' : 'adjustPan'}
                onDismiss={() => setReportReason('')}
            >

                <BottomSheetView>
                    <View style={{ paddingBottom: insets.bottom + 10, paddingHorizontal: 16 }}>
                        <View className="bg-[#F2F2F7] text-black rounded-xl px-4 min-h-[100px] max-h-[200px] focus:border-primary border border-[#cccccc80]">
                            <BottomSheetTextInput
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
                                placeholder="Write your report here..."
                                autoCapitalize="none"
                                importantForAutofill='no'
                                placeholderTextColor={"#5B5B5B3A"}
                                selectionColor={'#DD3FE5'}
                                onChangeText={setReportReason}
                            />
                        </View>

                        <View className='mt-4'>
                            <CustomButton title="Report" handlePress={reportAccount} />
                        </View>
                    </View>
                </BottomSheetView>
            </BottomSheetModal>
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
        height: 350,
        borderRadius: 24,
        marginBottom: 20,
        backgroundColor: '#f0f0f0',
        objectFit: 'cover',
        backgroundPosition: 'center',
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
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    chip: {
        backgroundColor: '#F0F0F0',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    transparentChip: {
        backgroundColor: 'transparent',
        paddingHorizontal: 0,
        paddingVertical: 8,
        borderRadius: 0
    },
    chipText: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
        fontFamily: 'Onest_400Regular'
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
        // marginBottom: 12,
        backgroundColor: '#eee',
    },
});