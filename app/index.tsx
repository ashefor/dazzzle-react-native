import Images from '@/constants/images';
import { Redirect } from 'expo-router';
import { useEffect } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { fetchAppConfig } from '@/redux/thunks/appActions';
import { fetchAuthenticatedUser, signUserOut } from "@/redux/thunks/authActions";
import dayjs from 'dayjs';
import { Spinner } from 'tamagui'; // Or your preferred loader

export default function HomeScreen() {
  const dispatch = useAppDispatch();
  
  // 1. Select all necessary state in one place
  const { loading: configLoading, appConfig, error: configError } = useAppSelector(state => state.app);
  const { 
    userInfo, 
    loadingUser, 
    userToken, 
    error: authError, 
    isProfileCompleted 
  } = useAppSelector(state => state.auth);
  const { currentSubscription } = useAppSelector(state => state.subscription);

  // Combined loading state
  const isInitializing = configLoading || loadingUser;

  useEffect(() => {
    // 1. Fetch Config
    dispatch(fetchAppConfig());


    // 2. If we have a token (persisted in Redux), fetch the user immediately
    if (userToken) {
      dispatch(fetchAuthenticatedUser());
    }
  }, [dispatch, userToken]);

  // Handle Auth Errors (e.g., token expired)
  useEffect(() => {
    if (authError) {
        dispatch(signUserOut());
    }
  }, [authError, dispatch]);

  // Helper function to check subscription status
  const checkSubscriptionStatus = () => {
    if (!userInfo?.is_premium) return false;
    
    // If premium but no sub object, treat as valid or invalid based on your business logic
    // Assuming here that if is_premium is true, we check the date
    if (currentSubscription?.expiry_at) {
       return !dayjs().isAfter(dayjs(currentSubscription.expiry_at));
    }
    
    return false; // Default to false if premium flag is true but no subscription data exists
  };

  // --- RENDER LOGIC ---

  // 1. Show loading screen while fetching config OR user
  if (isInitializing) {
    return (
      <View className='bg-white flex items-center justify-center flex-1'>
        <Image source={Images.logo} className='w-32 h-32' resizeMode='contain' />
        <Spinner size="large" color="$gray10" className="mt-4" />
      </View>
    );
  }

  // 2. Error State (Config failed)
  if (!appConfig) {
    return (
      <View className='h-full flex items-center justify-center p-5 bg-white'>
        <Image source={Images.logo} className='w-32 h-32' resizeMode='contain' />
        <Text className=' text-primary text-base font-semibold'>Unable to load settings</Text>
        <Text className=' text-primary'> {configError || ''}</Text>
        <TouchableOpacity onPress={() => dispatch(fetchAppConfig())} className='rounded-[26px] px-5 h-10 mt-7 bg-primary flex items-center justify-center'>
          <Text className='text-sma font-firamedium text-white'>
            Try again
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 3. Routing Logic (The "Traffic Controller")
  
  // Scenario A: No Token -> Landing
  if (!userToken) {
    return <Redirect href="./landing" />;
  }

  // Scenario B: Token exists, but we are waiting for userInfo to populate
  // (This handles the edge case where loadingUser is false but userInfo is null briefly)
  if (!userInfo) {
     return (
        <View className='bg-white flex items-center justify-center flex-1'>
            <Spinner size="large" />
        </View>
     );
  }

  // Scenario C: User Logged in -> Check Profile Completion
  if (!isProfileCompleted) {
    return <Redirect href="./onboard/bio-data" />;
  }

  // Scenario D: Profile Complete -> Check Subscription
  const isSubActive = checkSubscriptionStatus();

  if (isSubActive) {
    return <Redirect href="./(tabs)" />;
  } else {
    return <Redirect href="./paywall" />;
  }
}