import CustomButton from '@/components/CustomButton';
import SwipeCard from '@/components/SwipeCard';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { clearSwipeError } from '@/redux/slices/usersSlice';
import { fetchProfilesAsync, swipeLeftAsync, swipeRightAsync } from '@/redux/thunks/swipeActions';
import { Stack } from 'expo-router';
import { useEffect, Fragment } from 'react';
import { ActivityIndicator, Alert, Text, View, StyleSheet } from 'react-native';
// import TinderCardSwipers from '@/components/TinderCardSwipers';


export default function HomeScreen() {
const dispatch = useAppDispatch();
  const { profiles, currentIndex, loading, swipeLoading, swipeError } = useAppSelector((state) => state.users);

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
