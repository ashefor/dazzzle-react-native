import React, { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, View, Text, ActivityIndicator, Alert, Platform } from "react-native";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import CustomButton from "@/components/CustomButton";
import { clearSwipeError } from "@/redux/slices/usersSlice";
import { fetchProfilesAsync, swipeLeftAsync, swipeRightAsync } from "@/redux/thunks/swipeActions";
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import axiosRequest from '@/utils/axios';
import { useUsersFeed } from "@/hooks/useUsersFeed";
import { sendSwipe, UserCard } from "@/components/folder/api";
import { SwiperStack, SwiperStackHandle } from "@/components/SwiperStack";
import { ActionButtons } from "@/components/ActionButtons";
import Header from "@/components/Header";


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
  const {
    topCard,
    nextCards,
    queueLength,
    loadingInitial,
    errorInitial,
    popTop,
    prefetchNextBatch,
  } = useUsersFeed();
  const swiperRef = useRef<SwiperStackHandle | null>(null);

  const dispatch = useAppDispatch();
  const { profiles, currentIndex, loading, swipeLoading, swipeError } = useAppSelector((state) => state.users);
   const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState<Notifications.Notification | undefined>(
      undefined
    );

  const handleSwiped = useCallback(
    async (direction: "left" | "right", user: UserCard) => {
      // Optimistic removal
      popTop();

      // Fire-and-forget API
      sendSwipe({ userId: user.id.toString(), direction }).catch(() => {});

      // Encourage next prefetch cycle if needed (optional redundant safety)
      if (queueLength <= 8) {
        prefetchNextBatch();
      }
    },
    [popTop, queueLength, prefetchNextBatch]
  );

  const handleKeepTop = useCallback((_user: UserCard) => {
    // no-op when snap back
  }, []);



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
      console.log(JSON.stringify(notification, null, 2));
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

  // if (loading) {
  //   return (
  //     <View style={styles.loadingContainer}>
  //       <ActivityIndicator size="large" color="#FF4C6D" />
  //       <Text style={styles.loadingText}>Loading profiles...</Text>
  //     </View>
  //   );
  // }

  const showInitialLoader = !topCard && loadingInitial;
  return (
    <View style={styles.container}>
      <Header.Default 
      leftContent={<Text className="text-2xl font-semibold">Encounter 🔥</Text>}
      />
      <View style={styles.content}>
        {errorInitial && showInitialLoader && <Text style={styles.error}>{errorInitial}</Text>}

        {showInitialLoader ? (
          <View style={styles.loaderWrap}>
            <ActivityIndicator />
          </View>
        ) : (
          <>
            <SwiperStack
              ref={swiperRef}
              top={topCard}
              below={nextCards}
              onSwiped={handleSwiped}
              onKeepTop={handleKeepTop}
              onInfo={() => {}}
            />
            <ActionButtons
              onDislike={() => swiperRef.current?.swipeLeft()}
              onLike={() => swiperRef.current?.swipeRight()}
              onInfo={() => swiperRef.current?.peekInfo()}
              disabled={!topCard}
            />
          </>
        )}
      </View>
     </View>
  );
}

const styles = StyleSheet.create({
  
  container: { flex: 1, backgroundColor: "#fff" },
  content: { flex: 1, paddingTop: 8, marginTop: 32, justifyContent: "flex-start" },
  loaderWrap: { flex: 1, alignItems: "center", justifyContent: "center" },
  error: { color: "#f66", textAlign: "center", marginVertical: 8 },

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