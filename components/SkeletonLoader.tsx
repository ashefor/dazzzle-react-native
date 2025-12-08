// SkeletonPlaceholder.js
import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, ViewStyle } from 'react-native';

// import LinearGradient from 'react-native-linear-gradient';

const SkeletonPlaceholder = ({ style }: { style?: ViewStyle }) => {
  // Use useRef to persist the animated value across renders
  const animatedValue = useRef(new Animated.Value(0)).current;

  // Start animation in useEffect with proper cleanup
  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    );
    animation.start();
    
    // Cleanup: stop animation when component unmounts
    return () => animation.stop();
  }, [animatedValue]);

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

export const Skeleton = ({ style }: { style?: any }) => (
        <SkeletonPlaceholder
            style={StyleSheet.flatten([{ backgroundColor: '#F0F0F0' }, style])}
        />
    );

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