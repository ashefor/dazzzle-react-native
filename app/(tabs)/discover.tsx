import React, { Fragment, useEffect, useState } from "react";
import { StyleSheet, View, Text, ActivityIndicator, Alert, Platform } from "react-native";
import SwipeCard from "@/components/SwipeCard";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import CustomButton from "@/components/CustomButton";
import { clearSwipeError } from "@/redux/slices/usersSlice";
import { fetchProfilesAsync, swipeLeftAsync, swipeRightAsync } from "@/redux/thunks/swipeActions";
import { Stack } from "expo-router";
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import axiosRequest from '@/utils/axios';


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

function handleRegistrationError(errorMessage: string) {
  alert(errorMessage);
  throw new Error(errorMessage);
}

async function registerForPushNotificationsAsync() {
  console.log('registerForPushNotificationsAsync');
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      handleRegistrationError('Permission not granted to get push token for push notification!');
      return;
    }
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
    if (!projectId) {
      handleRegistrationError('A valid expo project id is required to get push token. Restart the app and try again');
    }
    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      return pushTokenString;
    } catch (e: unknown) {
      handleRegistrationError(`${e}`);
    }
  } else {
    handleRegistrationError('Must use physical device for push notifications');
  }
}
export default function DiscoverScreen() {
  const dispatch = useAppDispatch();
  const { profiles, currentIndex, loading, swipeLoading, swipeError } = useAppSelector((state) => state.users);
   const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState<Notifications.Notification | undefined>(
      undefined
    );

  // Fetch profiles when component mounts
  useEffect(() => {
    dispatch(fetchProfilesAsync());
  }, [dispatch]);

  // Handle swipe errors
  useEffect(() => {
    if (swipeError) {
      Alert.alert("Swipe Error", swipeError, [
        { text: "OK", onPress: () => dispatch(clearSwipeError()) }
      ]);
    }
  }, [swipeError, dispatch]);

   useEffect(() => {
    registerForPushNotificationsAsync()
      .then(token => setExpoPushToken(token ?? ''))
      .catch((error: any) => {
        console.log(error);
        // Alert.alert('Error', 'Failed to get push token for push notification!');
      });

    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  useEffect(() => {
    if (expoPushToken) {
      Alert.alert('Push Notification Token', JSON.stringify(expoPushToken, null, 2));
      console.log('expoPushToken', expoPushToken);

      sendFCMTokenToServer(expoPushToken);
    }
  }, [expoPushToken]);

  const sendFCMTokenToServer = async (token: string) => {
    try {
      const response = await axiosRequest.post('/update-user-fcm-token', { fcm_token: token });
      console.log('response', response.data);
    } catch (error) {
      console.error('Error sending FCM token to server:', error);
    }
  };

  const handleSwipeLeft = () => {
    if (currentIndex < profiles.length) {
      const userId = profiles[currentIndex].id;
      dispatch(swipeLeftAsync(userId.toString()));
    }
  };

  const handleSwipeRight = () => {
    if (currentIndex < profiles.length) {
      const userId = profiles[currentIndex].id;

      // Dispatch the async action to record the like
      dispatch(swipeRightAsync(userId.toString()))
        .unwrap()
        .then((result) => {
          // If it's a match (30% chance in our mock), add to matches
          if (result.isMatch || Math.random() < 0.3) {
            // dispatch(addMatch(profiles[currentIndex]));
          }
        })
        .catch(() => {
          // Error is already handled by the useEffect above
        });
    }
  };

  const handleRefresh = () => {
    dispatch(fetchProfilesAsync());
  };

  const renderNoMoreProfiles = () => (
    <View style={styles.noMoreContainer}>
      {/* <RefreshCw size={60} color="#6C7A9C" /> */}
      <ActivityIndicator size="large" color="#FF4C6D" />
      <Text style={styles.noMoreTitle}>No More Profiles</Text>
      <Text style={styles.noMoreSubtitle}>
        Check back later for more potential matches
      </Text>
      <CustomButton
        title="Refresh"
        handlePress={handleRefresh}
        // variant="outline"
        wrapperStyles={styles.refreshButton}
      />
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF4C6D" />
        <Text style={styles.loadingText}>Loading profiles...</Text>
      </View>
    );
  }

  return (
    <Fragment>
      <Stack.Screen options={{
        headerStyle: { backgroundColor: '#1A1A1A' },
        headerShadowVisible: false,
        // headerRight: () => <TouchableOpacity className='flex items-center justify-center pr-4 w-9 h-8'>
        //         <Image source={icons.menu} className='w-6 h-6' resizeMode='contain' />
        //     </TouchableOpacity>
      }} />
      <View className="flex-1 items-center bg-primary justify-center">
        {currentIndex < profiles.length ? (
          <SwipeCard
            profile={profiles[currentIndex]}
            onSwipeLeft={handleSwipeLeft}
            onSwipeRight={handleSwipeRight}
            isLoading={swipeLoading}
          />
        ) : (
          renderNoMoreProfiles()
        )}
      </View>
    </Fragment>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8F8F8",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#6C7A9C",
  },
  noMoreContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  noMoreTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333333",
    marginTop: 16,
    marginBottom: 8,
  },
  noMoreSubtitle: {
    fontSize: 16,
    color: "#6C7A9C",
    textAlign: "center",
    marginBottom: 24,
  },
  refreshButton: {
    width: 200,
  },
});