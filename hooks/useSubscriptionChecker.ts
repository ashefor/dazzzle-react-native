
import { useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useAppDispatch, useAppSelector } from './reduxHooks';
import { signUserOut } from '@/redux/thunks/authActions';
import { router } from 'expo-router';

const CHECK_INTERVAL = 60000;

export const useSubscriptionChecker = () => {
  const { currentSubscription, } = useAppSelector(state => state.subscription);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const checkLocalExpiry = () => {
      if (!currentSubscription) return;
      const now = Date.now();
      const expiryTime = new Date(currentSubscription.expiry_at).getTime();
      if (now >= expiryTime) {
        dispatch(signUserOut()).unwrap().then(() => router.replace('/(auth)/sign-in'))
      }
    };


    const handleAppStateChange = (state: AppStateStatus) => {
      if (state === 'active') {
        checkLocalExpiry();
      }
    };

    const intervalId = setInterval(checkLocalExpiry, CHECK_INTERVAL);
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      clearInterval(intervalId);
      subscription.remove();
    };
  }, [currentSubscription, dispatch]);
};
