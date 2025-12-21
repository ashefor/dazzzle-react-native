import React, { useEffect, useState } from 'react';
import { Slot, useRouter } from 'expo-router';
import { useAppSelector } from '@/hooks/reduxHooks';
import { Alert, View, ActivityIndicator } from 'react-native';
import { handlePermissionNavigation } from '@/utils/notificationHandler';

export default function AuthLayout() {
  const { userInfo, isProfileCompleted, error } = useAppSelector(state => state.auth);
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', String(error));
    }
  }, [error]);

  useEffect(() => {
    if (!userInfo) return;

    const checkAndRedirect = async () => {
      setIsChecking(true);
      try {
        if (!isProfileCompleted) {
           router.replace('/onboard');
           return;
        }
        if (!userInfo.is_premium) {
            router.replace('/paywall');
            return;
        }
        await handlePermissionNavigation('/(tabs)', '/app-permissions');

      } catch (err) {
        console.error("Auth redirection error:", err);
      } finally {
        setIsChecking(false);
      }
    };

    checkAndRedirect();
  }, [userInfo, isProfileCompleted]);

  if (userInfo) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#DD3FE5" />
      </View>
    );
  }

  // If not logged in, render the Auth screens (SignIn, SignUp)
  return <Slot />;
}