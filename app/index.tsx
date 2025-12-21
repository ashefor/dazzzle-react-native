import { Redirect, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { fetchAppConfig } from '@/redux/thunks/appActions';
import { fetchAuthenticatedUser, signUserOut } from "@/redux/thunks/authActions";
import dayjs from 'dayjs';
import { handlePermissionNavigation } from '@/utils/notificationHandler';

export default function HomeScreen() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  
  // --- 1. HOOKS & STATE (Always declare these first) ---
  const { loading: configLoading, appConfig, error: configError } = useAppSelector(state => state.app);
  const { 
    userInfo, 
    loadingUser, 
    userToken, 
    error: authError, 
    isProfileCompleted 
  } = useAppSelector(state => state.auth);
  const { currentSubscription } = useAppSelector(state => state.subscription);

  const [isCheckingPermissions, setIsCheckingPermissions] = useState(false);

  // --- 2. DERIVED STATE (Calculations) ---
  const isInitializing = configLoading || loadingUser;

  const checkSubscriptionStatus = () => {
    if (!userInfo?.is_premium) return false;
    if (currentSubscription?.expiry_at) {
       return !dayjs().isAfter(dayjs(currentSubscription.expiry_at));
    }
    return false;
  };

  const isSubActive = checkSubscriptionStatus();

  // --- 3. EFFECTS (Must run before any return statements) ---

  // Effect A: Fetch Data
  useEffect(() => {
    dispatch(fetchAppConfig());
    if (userToken) {
      dispatch(fetchAuthenticatedUser());
    }
  }, [dispatch, userToken]);

  // Effect B: Handle Auth Errors
  useEffect(() => {
    if (authError) {
        dispatch(signUserOut());
    }
  }, [authError, dispatch]);

  // Effect C: Routing Logic (Permission & Subscription)
  useEffect(() => {
      // Only attempt routing if we are fully ready:
      // 1. Not initializing
      // 2. Have config
      // 3. Have user & token
      // 4. Profile is completed
      // 5. Not already checking permissions
      const isReadyForRouting = !isInitializing && appConfig && userToken && userInfo && isProfileCompleted && !isCheckingPermissions;

      if (!isReadyForRouting) return;

      const performRouting = async () => {
          if (isSubActive) {
              setIsCheckingPermissions(true);
              // Use the helper: 
              // - Checks Permission
              // - If Granted -> Register Token -> router.replace('/(tabs)')
              // - If Denied -> router.replace('/permissions')
              await handlePermissionNavigation('/(tabs)', '/permissions'); 
          } else {
              // No sub -> Paywall
              router.replace('./paywall');
          }
      };

      performRouting();
      
  }, [isInitializing, appConfig, userToken, userInfo, isProfileCompleted, isSubActive, isCheckingPermissions]);


  // --- 4. RENDER (Early returns allowed here) ---

  // A. Initialization / Loading
  if (isInitializing) {
    return (
      <View className='bg-white flex items-center justify-center flex-1'>
        <View className='flex-row items-center justify-center mb-6'>
          <Image source={require('@/assets/images/logo.png')} style={{ width: 48, height: 48, tintColor: '#DD3FE5' }} resizeMode='contain' />
          <Text className='text-3xl text-primary' style={{
            fontFamily: "LilitaOne_400Regular",
          }}>dazzzle</Text>
        </View>
        <ActivityIndicator size="large" color="#DD3FE5" className="mt-4" />
      </View>
    );
  }

  // B. Config Error
  if (!appConfig) {
    return (
      <View className='h-full flex items-center justify-center p-5 bg-white'>
        <Text className=' text-primary text-base font-semibold'>Unable to load settings</Text>
        <Text className=' text-primary'> {configError || ''}</Text>
        <TouchableOpacity onPress={() => dispatch(fetchAppConfig())} className='rounded-[26px] px-5 h-10 mt-7 bg-primary flex items-center justify-center'>
            <Text className='text-sma font-firamedium text-white'>Try again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // C. Not Logged In
  if (!userToken) {
    return <Redirect href="./landing" />;
  }

  // D. Waiting for User Data (Edge case safety)
  if (!userInfo) {
     return (
          <View className='bg-white flex items-center justify-center flex-1'>
        <ActivityIndicator size="large" />
        </View>
     );
  }

  // E. Profile Incomplete
  if (!isProfileCompleted) {
    return <Redirect href="./onboard/bio-data" />;
  }

  // F. Final Loading State
  // If we reached here, the Effect C is running or we are checking permissions.
  // Show the loader to prevent a blank white screen.
  return (
      <View className='bg-white flex items-center justify-center flex-1'>
        <View className='flex-row items-center justify-center mb-6'>
          <Image source={require('@/assets/images/logo.png')} style={{ width: 48, height: 48, tintColor: '#DD3FE5' }} resizeMode='contain' />
          <Text className='text-3xl text-primary' style={{
            fontFamily: "LilitaOne_400Regular",
          }}>dazzzle</Text>
        </View>
        <ActivityIndicator size="large" color="#DD3FE5" className="mt-4" />
      </View>
  );
}