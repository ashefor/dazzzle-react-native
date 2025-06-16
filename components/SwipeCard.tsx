import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  PanResponder,
  Animated,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import { AntDesign, FontAwesome, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import icons from "@/constants/icons";
import { router } from "expo-router";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

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
interface SwipeCardProps {
  profile: User;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  isLoading?: boolean;
}

const SwipeCard: React.FC<SwipeCardProps> = ({
  profile,
  onSwipeLeft,
  onSwipeRight,
  isLoading = false,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const position = new Animated.ValueXY();
  const rotate = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: ["-10deg", "0deg", "10deg"],
    extrapolate: "clamp",
  });

  const likeOpacity = position.x.interpolate({
    inputRange: [0, SCREEN_WIDTH / 4],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const dislikeOpacity = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 4, 0],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const nextCardOpacity = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: [1, 0.5, 1],
    extrapolate: "clamp",
  });

  const nextCardScale = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: [1, 0.9, 1],
    extrapolate: "clamp",
  });

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => !isLoading,
    onPanResponderMove: (_, gesture) => {
      position.setValue({ x: gesture.dx, y: gesture.dy });
    },
    onPanResponderRelease: (_, gesture) => {
      if (gesture.dx > SWIPE_THRESHOLD) {
        forceSwipeRight();
      } else if (gesture.dx < -SWIPE_THRESHOLD) {
        forceSwipeLeft();
      } else {
        resetPosition();
      }
    },
  });

  const forceSwipeLeft = () => {
    Animated.timing(position, {
      toValue: { x: -SCREEN_WIDTH, y: 0 },
      duration: 250,
      useNativeDriver: false,
    }).start(() => {
      onSwipeLeft();
      position.setValue({ x: 0, y: 0 });
    });
  };

  const forceSwipeRight = () => {
    Animated.timing(position, {
      toValue: { x: SCREEN_WIDTH, y: 0 },
      duration: 250,
      useNativeDriver: false,
    }).start(() => {
      onSwipeRight();
      position.setValue({ x: 0, y: 0 });
    });
  };

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      friction: 4,
      useNativeDriver: false,
    }).start();
  };

  const handleNextImage = () => {
    // if (currentImageIndex < profile.images.length - 1) {
    //   setCurrentImageIndex(currentImageIndex + 1);
    // }
  };

  const handlePrevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };


  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            { translateX: position.x },
            { rotate },
          ],
        },
      ]}
      {...panResponder.panHandlers}
    >
      <Animated.View style={[styles.likeContainer, { opacity: likeOpacity }]}>
        <Text style={styles.likeText}>LIKE</Text>
      </Animated.View>
      <Animated.View style={[styles.dislikeContainer, { opacity: dislikeOpacity }]}>
        <Text style={styles.dislikeText}>NOPE</Text>
      </Animated.View>

      <Image
        source={{ uri: profile.profileImage }}
        style={styles.image}
      />

      {/* <TouchableOpacity
        style={styles.leftImageNav}
        onPress={handlePrevImage}
        activeOpacity={0.8}
        disabled={isLoading}
      >
        <View />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.rightImageNav}
        onPress={handleNextImage}
        activeOpacity={0.8}
        disabled={isLoading}
      >
        <View />
      </TouchableOpacity> */}

      <View style={styles.infoContainer}>
        <View style={styles.nameAgeContainer}>
          <Text style={styles.nameText}>{profile.username}</Text>
          <Text style={styles.ageText}>{profile.userAge}</Text>
        </View>
        <View className="flex flex-row items-center gap-x-2">
        <Text style={styles.distanceText}>{profile.gender}</Text>
        {profile.isPremiumUser && <MaterialCommunityIcons name="crown-circle-outline" size={24} color="#FFD700" />}
        </View>
        <Text style={styles.distanceText}>{profile.countryName}</Text>        
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.dislikeButton]}
          onPress={forceSwipeLeft}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FF3B30" />
          ) : (
            <FontAwesome name="close" size={36} color="#aeb11a" />
          )}
        </TouchableOpacity>
        <TouchableOpacity
        onPress={() => router.push({
                            pathname: '/view-user/[userName]',
                          params: { userName: profile.username },
                          })}
          style={[styles.actionButton, styles.infoButton]}
          disabled={isLoading}
        >
          {/* <Info size={24} color="#6C7A9C" /> */}
          <Ionicons name="information-circle-outline" size={32} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.likeButton]}
          onPress={forceSwipeRight}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FF4C6D" />
          ) : (
            // <AntDesign name="heart" size={24} color="#FF4C6D" />
            <Ionicons name="heart" size={36} color="#EB4242" />
          )}
        </TouchableOpacity>
      </View>

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    // width: SCREEN_WIDTH - 32,
    width: "90%",
    height: "80%",
    borderRadius: 20,
    // backgroundColor: "#FFFFFF",
    backgroundColor: "#5B5B5B",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    position: "absolute",
    top: '5%',
  },
  image: {
    width: "100%",
    height: "100%",
    // borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,
    borderRadius: 20,
    // backgroundPosition: "center",
    // position: "absolute",
    // top: 0,
    // left: 0
    
  },
  leftImageNav: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "30%",
    height: "70%",
  },
  rightImageNav: {
    position: "absolute",
    top: 0,
    right: 0,
    width: "30%",
    height: "70%",
  },
  dotContainer: {
    position: "absolute",
    top: 16,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 3,
  },
  infoContainer: {
    padding: 16,
    height: "30%",
    position: "absolute",
    bottom: 0,
    backgroundColor: "#5B5B5B",
    width: "100%",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  nameAgeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  nameText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginRight: 8,
  },
  ageText: {
    fontSize: 22,
    color: "#fff",
  },
  distanceText: {
    fontSize: 14,
    color: "#fff",
    marginTop: 4,
  },
  bioText: {
    fontSize: 14,
    color: "#fff",
    marginTop: 8,
    lineHeight: 20,
  },
  interestsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  interestBadge: {
    backgroundColor: "#F0F2F5",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  interestText: {
    fontSize: 12,
    color: "#6C7A9C",
  },
  actionsContainer: {
    position: "absolute",
    bottom: -25,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    backgroundColor: "#FFFFFF",
  },
  likeButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  dislikeButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  infoButton: {
    marginHorizontal: 16,
  },
  likeContainer: {
    position: "absolute",
    top: 50,
    left: 40,
    transform: [{ rotate: "-30deg" }],
    zIndex: 1000,
  },
  likeText: {
    borderWidth: 4,
    borderColor: "#4CD964",
    color: "#4CD964",
    fontSize: 32,
    fontWeight: "bold",
    padding: 8,
  },
  dislikeContainer: {
    position: "absolute",
    top: 50,
    right: 40,
    transform: [{ rotate: "30deg" }],
    zIndex: 1000,
  },
  dislikeText: {
    borderWidth: 4,
    borderColor: "#FF3B30",
    color: "#FF3B30",
    fontSize: 32,
    fontWeight: "bold",
    padding: 8,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
});

export default SwipeCard;