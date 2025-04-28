import { useAxiosContext } from '@/context/AxiosProvider';
import { ReactionCodes } from '@/models/general';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Link, router, useFocusEffect } from 'expo-router';
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  Text,
  View,
  Dimensions,
  ImageBackground,
  Pressable,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Button, XStack, YStack } from 'tamagui';
import TinderCard from './TinderCard';
import icons from '@/constants/icons';
import { Foundation } from '@expo/vector-icons';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

interface User {
  countryName: string
  coverImage: string
  detailString: string
  dob: string
  fullName: string
  gender: string
  id: number
  isPremiumUser: boolean
  profileImage: string
  userAge: number
  userOnlineStatus: number
  username: string
}

const alreadyRemoved: string[] = []
const TinderCardSwipers = () => {
  const { axiosRequest } = useAxiosContext();
  const [users, setUsers] = useState<User[]>([]);
  const childRefs = useRef<any[]>([]);
  const [lastDirection, setLastDirection] = useState<string>();
  const [initialLoading, setInitialLoading] = useState(true);
  let isThrottled = false;

  useEffect(() => {
    childRefs.current = childRefs.current.slice(0, users.length);
  }, [users]);

  const swiped = async (direction: string, item: any) => {
    if (isThrottled) {
      return; // Skip swipes if throttling is active
    }
    setLastDirection(direction)
    alreadyRemoved.push(item.username)
    const swipePromise = saveSwipeChoice(item.id, direction);
    if (users.length < 6) {
      fetchUsers();
    }

    isThrottled = true;
    setTimeout(() => {
      isThrottled = false;
    }, 1000);

    await swipePromise;
  }

  const saveSwipeChoice = async (userId: string, direction: string) => {
    const isLike = direction === 'right' || direction === 'up';
    const url = `/${userId}/${isLike ? `1` : '0'}/user-like-dislike`;
    const request = axiosRequest.post(url, {}, { headers: { 'hide-loader': 'true' } });
    return request;
  };

  const outOfFrame = (name: string) => {
    setUsers((prevUsers) => prevUsers.filter(character => character.username !== name))
  }

  const swipe = (dir: string) => {
    const cardsLeft = users.filter(person => !alreadyRemoved.includes(person.username))
    if (cardsLeft.length) {
      const toBeRemoved = cardsLeft[cardsLeft.length - 1].username // Find the card object to be removed
      const index = users.map(person => person.username).indexOf(toBeRemoved) // Find the index of which to make the reference to
      alreadyRemoved.push(toBeRemoved) // Make sure the next card gets removed next time if this card do not have time to exit the screen
      if (childRefs.current[index]) {
        childRefs.current[index].swipe(dir); // Call swipe method on the specific card
      }
    }
  }

  const fetchUsers = async (shouldFetchInitialItems = false) => {
    try {
      if (shouldFetchInitialItems) {
        setInitialLoading(true);
      }
      const { data } = await axiosRequest.get('/random-user', { headers: { 'hide-loader': 'true' } });
      if (data.reaction === ReactionCodes.SUCCESS) {
        const users = data.data.filterData || [];
        setUsers((prevUsers) => [...prevUsers, ...users]);
      }
      setInitialLoading(false);
    } catch (error) {
      console.log(error);
      setInitialLoading(false);
    }
  };

  // useEffect(() => {
  //   fetchUsers(true);
  // }, [])
  
  useFocusEffect(useCallback(() => {
    fetchUsers(true);
  }, []))

  const refreshUsers = async () => {
    try {
      setInitialLoading(true);
      const { data } = await axiosRequest.get('/random-user', { headers: { 'hide-loader': 'true' } });
      if (data.reaction === ReactionCodes.SUCCESS) {
        const users = data.data.filterData || [];
        setUsers(users);
      }
      setInitialLoading(false);
    } catch (error) {
      setInitialLoading(false);
      console.error('Error fetching liked users:', error);
      // setUsers(prevUsers => [...prevUsers]);
    }
  }

  const renderUsers = () => {
    return users.map((item, index) =>
    <TinderCard ref={(el) => (childRefs.current[index] = el)} key={`${item.username}-${index}`}>
        <View
          key={`${item.id}-${index}`}
          style={{
            height: SCREEN_HEIGHT - 225,
            // width: '95%',
            // marginHorizontal: '2.5%',
            width: SCREEN_WIDTH,
            paddingHorizontal: 16,
            paddingVertical: 20,
            position: 'absolute',
            pointerEvents: 'auto',
          }}
        >
          <ImageBackground
            style={{
              flex: 1,
              width: '100%',
              height: '100%',
              borderRadius: 20,
              overflow: 'hidden',
              backgroundColor: 'white',
            }}
            source={{ uri: item.profileImage }}
          >
            <View className='flex-1 bg-black/[0.2]'>
              <View className='px-7 pt-7 pb-14 flex-1 justify-end'>
              <Pressable style={{ zIndex: 1000 , pointerEvents: 'auto'}} onPress={() => router.navigate({
                    pathname: './view-user/[userName]',
                  params: { userName: item.username },
                  })}>
                    <View className='flex-row items-center justify-between space-x-2'>
                    <View className='flex-shrink'>
                        <XStack alignItems='center' gap="$2" flexWrap="wrap">
                          <Text numberOfLines={2} lineBreakMode='tail' className='font-firasemibold text-2xl text-white capitalize'>
                            {item.username}
                          </Text>
                          <Text className='text-white font-firaregular text-2xl text-white'>
                            {item.userAge}
                          </Text>
                        </XStack>
                        <XStack gap="$2" alignItems='center'>
                        <Text className='text-white text-sm font-firaregular'>
                          {item.gender}
                        </Text>
                        {item.isPremiumUser && <Image source={icons.premium} className='w-5 h-5' resizeMode='contain'/>}
                        </XStack>
                      </View>
                      <Ionicons name="chevron-forward" size={20} color="#E2E3DD" />
                    </View>
                  </Pressable>
              </View>
            </View>
          </ImageBackground>
        </View>
      </TinderCard>
    )
  };

  return (
    <View className='flex-1'>
      <View>{initialLoading ? ( <View style={{
        height: SCREEN_HEIGHT - 225,
        width: SCREEN_WIDTH,
        paddingHorizontal: 16,
        paddingVertical: 20,
        position: 'absolute',
        pointerEvents: 'auto',
      }}>
        <View style={{ flex: 1, width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', borderRadius: 20, overflow: 'hidden', backgroundColor: '#ccc' }}>
          <ActivityIndicator size={'large'} color={'#000'} />
          </View>
        </View>):  
        users.length === 0 ? (
          <View style={{
            height: SCREEN_HEIGHT - 225,
            width: SCREEN_WIDTH,
            paddingHorizontal: 16,
            paddingVertical: 20,
            position: 'absolute',
            pointerEvents: 'auto',
          }}>
            <View style={{ flex: 1, width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', borderRadius: 20, overflow: 'hidden', backgroundColor: '#ccc' }}>
              <Text className='text-2xl font-firaregular text-black'>No more users</Text>
              </View>
            </View>
        ) : (
          renderUsers()
        )
        }</View>
      <View className='absolute bottom-0 w-full py-6 flex-row items-center justify-center'>
        <XStack alignItems='center' flex={1} gap="$4" justifyContent='center'>
          <Button onPress={() => swipe('left')} className='w-[60px] h-[60px] bg-white flex items-center justify-center rounded-full' unstyled>
            <FontAwesome name="close" size={36} color="#aeb11a" />
          </Button>
          <Button onPress={refreshUsers} className='w-[50px] h-[50px] bg-white flex items-center justify-center rounded-full' unstyled>
            {/* <Ionicons name="chatbox-ellipses" size={24} color="#59C526" /> */}
            <Foundation name="refresh" size={24} color="#59C526" />
          </Button>
          <Button onPress={() => swipe('right')} className='w-[60px] h-[60px] bg-white flex items-center justify-center rounded-full' unstyled>
            <Ionicons name="heart" size={36} color="#EB4242" />
          </Button>
        </XStack>
      </View>
    </View>
  );
};

export default TinderCardSwipers;
