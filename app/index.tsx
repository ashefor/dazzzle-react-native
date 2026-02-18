import { Redirect, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { fetchAppConfig } from '@/redux/thunks/appActions';
import { fetchAuthenticatedUser, signUserOut } from "@/redux/thunks/authActions";
import dayjs from 'dayjs';
import { handlePermissionNavigation } from '@/utils/notificationHandler';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, FadeIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';

const { width } = Dimensions.get('window');

// --- COMPONENTS FOR UI STATES ---

// 1. Fancy Loading Screen (Pulsing Logo)
const LoadingScreen = ({ message = "Loading..." }: { message?: string }) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.5);

  useEffect(() => {
    scale.value = withRepeat(withTiming(1.1, { duration: 1200 }), -1, true);
    opacity.value = withRepeat(withTiming(1, { duration: 1200 }), -1, true);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <View className="flex-1 bg-white">
      <LinearGradient
        // Subtle pink gradient from top-left
        colors={['#FFF0FC', '#FFFFFF', '#FFFFFF']}
        style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
      >
        <Animated.View style={animatedStyle} className="items-center justify-center">
          <Image 
            source={require('@/assets/images/logo.png')} 
            style={{ width: 80, height: 80, tintColor: '#DD3FE5' }} 
            resizeMode='contain' 
          />
        </Animated.View>
        
        <View className="mt-6 items-center space-y-2">
          <Text className='text-4xl text-primary' style={{ fontFamily: "LilitaOne_400Regular" }}>
            dazzzle
          </Text>
          <Text className="text-gray-400 font-firamedium text-xs tracking-widest uppercase">
            {message}
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
};

// 2. Fancy Error Screen
const ErrorScreen = ({ error, onRetry }: { error: string, onRetry: () => void }) => (
  <View className="flex-1 bg-white">
    <LinearGradient
      colors={['#FFF5F5', '#FFFFFF']}
      style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30 }}
    >
      <Animated.View entering={FadeIn.duration(500)} className="items-center">
        <View className="bg-red-50 p-6 rounded-full mb-6">
          <Ionicons name="cloud-offline-outline" size={48} color="#EF4444" />
        </View>
        
        <Text className="text-xl font-firabold text-gray-800 mb-2">
          Connection Issue
        </Text>
        
        <Text className="text-gray-500 text-center font-firaregular mb-8 leading-5">
          We couldn't load the app configuration. Please check your internet and try again.
          {'\n'}({error})
        </Text>

        <TouchableOpacity 
          onPress={onRetry} 
          activeOpacity={0.8}
          className="bg-primary px-8 py-3 rounded-full shadow-sm shadow-purple-300"
        >
          <Text className="text-white font-firamedium text-sm">Try Again</Text>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  </View>
);

// --- MAIN SCREEN LOGIC ---

export default function HomeScreen() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  
  // --- STATE ---
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

  const isInitializing = configLoading || loadingUser;

  const checkSubscriptionStatus = () => {
    if (!userInfo?.is_premium) return false;
    if (currentSubscription?.expiry_at) {
       return !dayjs().isAfter(dayjs(currentSubscription.expiry_at));
    }
    return false;
  };

  const isSubActive = checkSubscriptionStatus();

  // --- EFFECTS ---

  useEffect(() => {
    dispatch(fetchAppConfig());
    if (userToken) {
      dispatch(fetchAuthenticatedUser());
    }
  }, [dispatch, userToken]);

  useEffect(() => {
    if (authError) {
        dispatch(signUserOut());
    }
  }, [authError, dispatch]);

 // ... inside app/index.tsx

  useEffect(() => {
      const isReadyForRouting = !isInitializing && appConfig && userToken && userInfo && isProfileCompleted && !isCheckingPermissions;

      if (!isReadyForRouting) return;

      const performRouting = async () => {
          // 1. Subscription Check (Keep your existing logic)
          if (!isSubActive) {
              router.replace('./paywall');
              return;
          }

          // 2. NEW: Check for Notification Launch (Cold Start)
          try {
            const response = await Notifications.getLastNotificationResponseAsync();
            const data = response?.notification.request.content.data;
            
            // Check if it's a chat message (type '1') and has a userId
            if (data && (data.type === '1' || data.type === '2') && data.userId) {
                // Navigate directly to the chat
                // We use Number() to ensure it matches the route param expectation
                router.replace({
                  pathname: "/single-chat/[userId]",
                  params: { 
                      userId: String(data.userId),
                  }
                }); 
                return; // STOP here. Do not go to tabs.
            }
          } catch (e) {
            console.log("Failed to check notification response", e);
          }

          // 3. Default: Go to Tabs (Your existing logic)
          setIsCheckingPermissions(true);
          await handlePermissionNavigation('/(tabs)', '/permissions'); 
      };

      performRouting();
      
  }, [isInitializing, appConfig, userToken, userInfo, isProfileCompleted, isSubActive, isCheckingPermissions]);


  // --- RENDER ---

  // A. Initialization / Loading / Permission Checking
  if (isInitializing || isCheckingPermissions || (userInfo && isProfileCompleted && !appConfig)) {
    return <LoadingScreen message={isCheckingPermissions ? "VERIFYING ACCESS..." : "STARTING UP..."} />;
  }

  // B. Config Error
  if (!appConfig) {
    return (
      <ErrorScreen 
        error={configError || 'Unknown Error'} 
        onRetry={() => dispatch(fetchAppConfig())} 
      />
    );
  }

  // C. Not Logged In
  if (!userToken) {
    return <Redirect href="./landing" />;
  }

  // D. Waiting for User Data (Safety Fallback)
  if (!userInfo) {
     return <LoadingScreen message="FETCHING PROFILE..." />;
  }

  // E. Profile Incomplete
  if (!isProfileCompleted) {
    return <Redirect href="./onboard" />;
  }

  // F. Final Catch-all (Should generally trigger the LoadingScreen via isCheckingPermissions)
  return <LoadingScreen />;
}