import React, { useEffect } from 'react';
import { Slot, Redirect } from 'expo-router';
import { useAppSelector } from '@/hooks/reduxHooks';
import { Alert } from 'react-native';

export default function AuthLayout() {
  const { userInfo, isProfileCompleted, error } = useAppSelector(state => state.auth);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error ? String(error) : 'An unknown error occurred');
    }
  }, [error]);

  if (userInfo) {
    // If logged in, immediately redirect away from auth screens
    const destination = !isProfileCompleted ? '/onboard' : userInfo.is_premium ? '/(tabs)' : '/paywall';
    return <Redirect href={destination} />;
  }

  // not logged in -> show auth screens (SignIn, SignUp, etc.)
  return <Slot />;
}