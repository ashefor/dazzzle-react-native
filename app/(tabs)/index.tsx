import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { fetchMoreUsers, popCard, processSwipe } from '@/redux/slices/encounterSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import SwipeableCard from '@/components/RandomUserCardDeck';
import Card from '@/components/RandomUserCard';
import CloseIcon from '@/components/icons/CloseIcon';
import HeartIcon from '@/components/icons/HeartIcon';
import InformationCircleIcon from '@/components/icons/InformationCircleIcon';
import NavBar from '@/components/NavBar';
import NotificationIcon from '@/components/icons/NotificationIcon';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');
    // const CARD_WIDTH = width * 0.9;
    // const CARD_HEIGHT = height * 0.6;

const CARD_WIDTH = width - 32;
const CARD_HEIGHT = Math.round(width * 1.25);

const EncounterScreen = () => {
  const dispatch = useAppDispatch();
  const route = useRoute<any>();
  
  const { users, topCardIndex, status } = useAppSelector((state) => state.encounter);
  
  // Local state to trigger programmatic swipes
  const [triggerSwipeDirection, setTriggerSwipeDirection] = useState<'left' | 'right' | null>(null);

  // 1. Initial Fetch
  useEffect(() => {
    if (users.length === 0) {
      dispatch(fetchMoreUsers());
    }
  }, []);

  // 2. Continuous Fetching: Maintain buffer of 6
  useEffect(() => {
    const remaining = users.length - topCardIndex;
    if (remaining < 6 && status !== 'loading') {
      dispatch(fetchMoreUsers());
    }
  }, [topCardIndex, users.length, status]);

  // 3. Handle External Actions (Returning from Details screen)

  const handleSwipeComplete = (direction: 'left' | 'right') => {
    // Reset trigger
    setTriggerSwipeDirection(null);
    
    const currentUser = users[topCardIndex]
    // Logic for Like/Dislike
    console.log(`User swiped ${direction} on ${users[topCardIndex].username}`);
    
    // Update Redux - This is instant and makes the next card active
    dispatch(popCard());

    dispatch(processSwipe({ 
      userId: currentUser.id, 
      action: direction === 'left' ? 'dislike' : 'like' 
    })).unwrap().then(() => {
        // Successfully processed swipe
        console.log('Swipe processed successfully');
    }).catch(() => {
        // Handle error if needed (e.g., show toast)
        console.log('Error processing swipe');
    });
  };

  const handleInfoPress = () => {
    const currentUser = users[topCardIndex];
    if (currentUser) {
      router.navigate({
        pathname: '/[userName]',
        params: { userName: currentUser.username }
      })
    }
  };

  // Button handlers for the bottom bar
  const onButtonPress = (direction: 'left' | 'right') => {
      setTriggerSwipeDirection(direction);
  };

  const isDisabled = users.length === 0 || status === 'loading';
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <NavBar leftItem={<Text className="text-2xl text-primary font-firasemibold">Encounter 🔥</Text>} rightItem={<TouchableOpacity onPress={() => router.push('/notifications')} className='flex items-center justify-center h-10 w-10 bg-[#E0E0E0] rounded-full'>
        <NotificationIcon color={"#DD3FE5"} />
      </TouchableOpacity>} />

      {/* Card Stack */}
      <View style={styles.stackContainer}>
        {users.length > 0 ? (
           users.slice(topCardIndex, topCardIndex + 4).map((user, i) => {
             const actualIndex = topCardIndex + i;
             return (
                <SwipeableCard
                    key={user.id}
                    index={actualIndex}
                    activeIndex={topCardIndex}
                    onSwipe={handleSwipeComplete}
                    item={user}
                    triggerSwipe={actualIndex === topCardIndex ? triggerSwipeDirection : null}
                >
                    <Card user={user} />
                </SwipeableCard>
             );
           }).reverse() // We reverse so the first element in slice (topCard) is rendered LAST (on top of Z-index stack) by React
        ) : (
            <ActivityIndicator size="large" color="#E94057" />
        )}
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity disabled={isDisabled} style={[styles.circleBtn, {backgroundColor: 'rgba(231,76,60,0.12)', opacity: isDisabled ? 0.5 : 1}]} onPress={() => onButtonPress('left')}>
           <CloseIcon width={26} height={26} fill="#EB4242" />
        </TouchableOpacity>

        <TouchableOpacity disabled={isDisabled} style={[styles.circleBtn, {backgroundColor: 'rgba(184,74,233,0.12)', opacity: isDisabled ? 0.5 : 1} ]} onPress={() => onButtonPress('right')}>
            <HeartIcon fill="#DD3FE5" />
        </TouchableOpacity>

        <TouchableOpacity disabled={isDisabled} style={[styles.circleBtn, {opacity: isDisabled ? 0.5 : 1}]} onPress={handleInfoPress}>
            <InformationCircleIcon width={60} height={60} fill="black" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  headerIcons: {
      flexDirection: 'row',
  },
  iconBtn: {
      padding: 10,
      backgroundColor: '#f3f3f3',
      borderRadius: 20,
  },
  stackContainer: {
    // flex: 1,
    height: CARD_HEIGHT,
    justifyContent: 'center', // Vertically center the cards
    alignItems: 'center',
    zIndex: 100,
    marginTop: 20
  },
  controls: {
    flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 28,
        paddingVertical: 12,
        marginTop: 20,
    zIndex: 2,
  },
  circleBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    // backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bigCircle: {
      width: 70,
      height: 70,
      borderRadius: 35,
      marginBottom: 10,
      backgroundColor: 'rgba(184,74,233,0.12)'
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  }
});

export default EncounterScreen;