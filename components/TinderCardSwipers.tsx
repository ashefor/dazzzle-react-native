import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  Animated,
  PanResponder,
  SafeAreaView,
  ImageBackground,
} from 'react-native';
import { Button, XStack, YStack } from 'tamagui';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

const Users = [
    { id: "1", uri: require('../assets/images/onboard.jpg') },
    { id: "2", uri: require('../assets/images/onboard2.jpg') },
    { id: "3", uri: require('../assets/images/onboard3.png') },
    { id: "4", uri: require('../assets/images/onboard.jpg') },
    { id: "5", uri: require('../assets/images/onboard2.jpg') },
];

const TinderCardSwipers = () => {
  const position = useRef(new Animated.ValueXY()).current;
  const [currentIndex, setCurrentIndex] = useState(0);

  const rotate = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: ['-30deg', '0deg', '10deg'],
    extrapolate: 'clamp',
  });

  const rotateAndTranslate = {
    transform: [
      { rotate },
      ...position.getTranslateTransform(),
    ],
  };

  const likeOpacity = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: [0, 0, 1],
    extrapolate: 'clamp',
  });

  const dislikeOpacity = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: [1, 0, 0],
    extrapolate: 'clamp',
  });

  const nextCardOpacity = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: [1, 0, 1],
    extrapolate: 'clamp',
  });

  const nextCardScale = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: [1, 0.8, 1],
    extrapolate: 'clamp',
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        position.setValue({ x: gestureState.dx, y: gestureState.dy });
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > 120) {
          Animated.spring(position, {
            toValue: { x: SCREEN_WIDTH + 275, y: gestureState.dy },
            useNativeDriver: false,
          }).start(() => {
            setCurrentIndex((prevIndex) => prevIndex + 1);
            position.setValue({ x: 0, y: 0 });
          });
        } else if (gestureState.dx < -120) {
          Animated.spring(position, {
            toValue: { x: -SCREEN_WIDTH - 275, y: gestureState.dy },
            useNativeDriver: false,
          }).start(() => {
            setCurrentIndex((prevIndex) => prevIndex + 1);
            position.setValue({ x: 0, y: 0 });
          });
        } else {
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            friction: 4,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  const renderUsers = () => {
    return Users.map((item, i) => {
      if (i < currentIndex) {
        return null;
      } else if (i === currentIndex) {
        return (
          <Animated.View
            {...panResponder.panHandlers}
            key={item.id}
            style={[
              rotateAndTranslate,
              {
                height: SCREEN_HEIGHT - 275,
                width: SCREEN_WIDTH,
                paddingHorizontal: 16,
                paddingVertical: 20,
                position: 'absolute',
              },
            ]}
          >
            <Animated.View
              style={{
                opacity: likeOpacity,
                transform: [{ rotate: '-30deg' }],
                position: 'absolute',
                top: 50,
                left: 40,
                zIndex: 1000,
              }}
            >
              <Text
                style={{
                  borderWidth: 1,
                  borderColor: 'green',
                  color: 'green',
                  fontSize: 32,
                  fontWeight: '800',
                  backgroundColor: 'white',
                  padding: 10,
                }}
              >
                LIKE
              </Text>
            </Animated.View>

            <Animated.View
              style={{
                opacity: dislikeOpacity,
                transform: [{ rotate: '30deg' }],
                position: 'absolute',
                top: 50,
                right: 40,
                zIndex: 1000,
              }}
            >
              <Text
                style={{
                  borderWidth: 1,
                  borderColor: 'red',
                  color: 'red',
                  fontSize: 32,
                  fontWeight: '800',
                  backgroundColor: 'white',
                  padding: 10,
                }}
              >
                NOPE
              </Text>
            </Animated.View>
                <ImageBackground
              style={{
                flex: 1,
                height: null,
                width: null,
                borderRadius: 20,
                overflow: 'hidden'
              }}
              source={item.uri}
            >
                <YStack className='flex-1 bg-black/[0.6]'>
                    <YStack justifyContent="flex-end" className='px-7 pt-7 pb-14' flex={1}>
                    <Link href={'../view-user/2'}>
                        <YStack>
                        <XStack alignItems='center' gap="$2" className=''>
                        <Text className='font-firasemibold text-2xl text-white'>
                            Michael,
                            </Text>
                            <Text className='text-white font-firaregular text-2xl text-white'>
                            25
                            </Text>
                        </XStack>
                        <Text className='text-white text-sm font-firaregular'>
                            Female
                            </Text>
                        </YStack>
                        </Link>
                    </YStack>
                </YStack>
                </ImageBackground>
            
          </Animated.View>
        );
      } else {
        return (
          <Animated.View
            key={item.id}
            style={{
              opacity: nextCardOpacity,
              transform: [{ scale: nextCardScale }],
              height: SCREEN_HEIGHT - 275,
              width: SCREEN_WIDTH,
              paddingHorizontal: 16,
              paddingVertical: 20,
              position: 'absolute',
            }}
          >

            <ImageBackground
              style={{
                flex: 1,
                height: null,
                width: null,
                borderRadius: 20,
                overflow: 'hidden'
              }}
              source={item.uri}
            >
                <YStack className='flex-1 bg-black/[0.6]'>
                    <YStack justifyContent="flex-end" className='px-7 pt-7 pb-14' flex={1}>
                    <Link href={'../view-user/2'}>
                        <YStack>
                        <XStack alignItems='center' gap="$2" className=''>
                        <Text className='font-firasemibold text-2xl text-white'>
                            Michael,
                            </Text>
                            <Text className='text-white font-firaregular text-2xl'>
                            25
                            </Text>
                        </XStack>
                        <Text className='text-white text-sm font-firaregular'>
                            Female
                            </Text>
                        </YStack>
                        </Link>
                    </YStack>
                </YStack>
                </ImageBackground>

          </Animated.View>
        );
      }
    }).reverse();
  };

  return (
    <View className='flex-1'>
      <View className=' bg-green-500'>{renderUsers()}</View>
      <YStack className='absolute bottom-0 w-full py-6' alignItems='center' justifyContent='center'>
                <XStack alignItems='center' flex={1} gap="$4" justifyContent='center'>
                    <Button className='w-[60px] h-[60px] bg-white flex items-center justify-center rounded-full' unstyled>
                        <FontAwesome name="close" size={36} color="#aeb11a" />
                    </Button>
                    <Button className='w-[60px] h-[60px] bg-white flex items-center justify-center rounded-full' unstyled>
                        <Ionicons name="chatbox-ellipses" size={24} color="#59C526" />
                    </Button>
                    <Button className='w-[60px] h-[60px] bg-white flex items-center justify-center rounded-full' unstyled>
                        <Ionicons name="heart" size={36} color="#EB4242" />
                    </Button>
                </XStack>
            </YStack>
    </View>
  );
};

export default TinderCardSwipers;
