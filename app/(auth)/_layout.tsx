import React, { useEffect } from 'react';
import { Slot, useRouter } from 'expo-router';
import { useAppSelector } from '@/hooks/reduxHooks';
import { Alert, View, Text, Image, StyleSheet } from 'react-native';
import { handlePermissionNavigation } from '@/utils/notificationHandler';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  FadeIn
} from 'react-native-reanimated';

// --- FANCY LOADER COMPONENT ---
const AuthLoadingScreen = () => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.5);

  useEffect(() => {
    scale.value = withRepeat(withTiming(1.1, { duration: 1000 }), -1, true);
    opacity.value = withRepeat(withTiming(1, { duration: 1000 }), -1, true);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FFF0FC', '#FFFFFF', '#FFFFFF']}
        style={styles.gradient}
      >
        <Animated.View style={[styles.logoContainer, animatedStyle]}>
          <Image 
            source={require('@/assets/images/logo.png')} 
            style={styles.logo} 
            resizeMode='contain' 
          />
        </Animated.View>
        
        <Animated.View entering={FadeIn.delay(200)} style={styles.textContainer}>
          <Text style={styles.brandText}>dazzzle</Text>
          <Text style={styles.statusText}>VERIFYING SESSION...</Text>
        </Animated.View>
      </LinearGradient>
    </View>
  );
};

// --- MAIN LAYOUT ---
export default function AuthLayout() {
  const { userInfo, isProfileCompleted, error } = useAppSelector(state => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (error) {
      Alert.alert('Error', String(error));
    }
  }, [error]);

  useEffect(() => {
    // If userInfo exists, it means we are logged in but sitting in the (auth) group.
    // We need to redirect them out immediately.
    if (!userInfo) return;

    const checkAndRedirect = async () => {
      try {
        // 1. Profile Incomplete? -> Onboarding
        if (!isProfileCompleted) {
           router.replace('/onboard');
           return;
        }

        // 2. All users can access the app (premium checks at action level)
        // Go directly to app after checking permissions
        await handlePermissionNavigation('/(tabs)', '/app-permissions');

      } catch (err) {
        console.error("Auth redirection error:", err);
      }
    };

    checkAndRedirect();
  }, [userInfo, isProfileCompleted]);

  // If userInfo exists, we show the loader while the useEffect above handles the redirect.
  if (userInfo) {
    return <AuthLoadingScreen />;
  }

  // If not logged in, render the Auth screens (SignIn, SignUp) normally
  return <Slot />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 80,
    height: 80,
    tintColor: '#DD3FE5',
  },
  textContainer: {
    alignItems: 'center',
    gap: 8,
  },
  brandText: {
    fontSize: 32,
    color: '#DD3FE5',
    fontFamily: "LilitaOne_400Regular",
  },
  statusText: {
    fontSize: 12,
    color: '#9CA3AF', // Gray-400
    fontFamily: "Onest_500Medium",
    letterSpacing: 2,
    textTransform: 'uppercase',
  }
});