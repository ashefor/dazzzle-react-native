// SkeletonPlaceholder.js
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { ViewStyle } from 'tamagui';
// import LinearGradient from 'react-native-linear-gradient';

const SkeletonPlaceholder = ({ style }: { style?: ViewStyle }) => {
  const animatedValue = new Animated.Value(0);

  Animated.loop(
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    })
  ).start();

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 200], // Adjust based on width
  });

  return (
    <View style={[styles.container, style]}>
      <Animated.View style={[styles.shimmerOverlay, { transform: [{ translateX }] }]}>
        <LinearGradient
          colors={['transparent', 'rgba(255,255,255,0.4)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#5B5B5B',
    overflow: 'hidden',
    borderRadius: 4,
  },
  shimmerOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  gradient: {
    flex: 1,
    width: 200, // Width of the shimmer effect
  },
});

export default SkeletonPlaceholder;
