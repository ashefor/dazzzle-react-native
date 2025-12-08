import React, { useEffect } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  interpolate,
  withTiming,
  Extrapolation,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const SWIPE_THRESHOLD = width * 0.3;

interface SwipeableCardProps {
  item: any;
  index: number;
  onSwipe: (direction: 'left' | 'right') => void;
  children: React.ReactNode;
  activeIndex: number;
  triggerSwipe?: 'left' | 'right' | null; // Prop to trigger swipe from outside
}

const SwipeableCard: React.FC<SwipeableCardProps> = ({
  index,
  onSwipe,
  children,
  activeIndex,
  triggerSwipe,
}) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotation = useSharedValue(0);

  // If the index matches activeIndex and we get a trigger, animate out
  useEffect(() => {
    if (index === activeIndex && triggerSwipe) {
      const destinationX = triggerSwipe === 'right' ? width * 1.5 : -width * 1.5;
      const rotateDest = triggerSwipe === 'right' ? 15 : -15;

      translateX.value = withTiming(destinationX, { duration: 200 });
      rotation.value = withTiming(rotateDest, { duration: 200 }, () => {
         runOnJS(onSwipe)(triggerSwipe);
      });
    }
  }, [triggerSwipe, activeIndex, index]);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (index !== activeIndex) return; // Only move top card
      translateX.value = event.translationX;
      translateY.value = event.translationY;
      rotation.value = interpolate(event.translationX, [-width / 2, width / 2], [-15, 15], Extrapolation.CLAMP);
    })
    .onEnd((event) => {
      if (index !== activeIndex) return;

      if (Math.abs(event.translationX) > SWIPE_THRESHOLD) {
        const direction = event.translationX > 0 ? 'right' : 'left';
        const destinationX = direction === 'right' ? width * 1.5 : -width * 1.5;

        // translateX.value = withSpring(destinationX, { damping: 50, stiffness: 200 }, () => {
        //   runOnJS(onSwipe)(direction);
        // });
        translateX.value = withTiming(destinationX, { duration: 200 });
        rotation.value = withTiming(direction === 'right' ? 15 : -15, { duration: 200 }, () => {
          runOnJS(onSwipe)(direction);
        });
      } else {
        // Reset position
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        rotation.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    // Optimization: If this card is far behind in stack (e.g. index > activeIndex + 3), hide it to save resources
    const isVisible = index >= activeIndex && index < activeIndex + 3;
    
    // Stack effect logic
    const stackIndex = index - activeIndex;
    const scale = interpolate(stackIndex, [0, 1, 2], [1, 0.95, 0.9], Extrapolation.CLAMP);
    const translateYOffset = interpolate(stackIndex, [0, 1, 2], [0, 20, 40], Extrapolation.CLAMP);

    return {
      opacity: isVisible ? 1 : 0,
      zIndex: -index, // Higher index is physically lower in stack visually
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value + translateYOffset },
        { rotate: `${rotation.value}deg` },
        { scale: scale },
      ],
    };
  });

  // Overlay for Like/Nope labels
  const likeOpacityStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, width / 4], [0, 1], Extrapolation.CLAMP),
  }));
  const nopeOpacityStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, -width / 4], [0, 1], Extrapolation.CLAMP),
  }));

  if (index < activeIndex) return null; // Don't render swiped cards

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.container, animatedStyle]}>
        {children}
        
        {/* Visual Feedback Overlays */}
        <Animated.View style={[styles.overlayLabel, styles.likeLabel, likeOpacityStyle]}>
          <Animated.Text style={styles.labelText}>LIKE</Animated.Text>
        </Animated.View>
        <Animated.View style={[styles.overlayLabel, styles.nopeLabel, nopeOpacityStyle]}>
          <Animated.Text style={[styles.labelText, { color: 'red', borderColor: 'red' }]}>NOPE</Animated.Text>
        </Animated.View>

      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    alignSelf: 'center',
  },
  overlayLabel: {
    position: 'absolute',
    top: 40,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 4,
    borderRadius: 10,
    transform: [{ rotate: '-20deg' }],
  },
  likeLabel: {
    left: 40,
    borderColor: '#4ade80',
    transform: [{ rotate: '-30deg' }],
  },
  nopeLabel: {
    right: 40,
    borderColor: '#ef4444',
    transform: [{ rotate: '30deg' }],
  },
  labelText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4ade80',
    textTransform: 'uppercase',
  },
});

export default SwipeableCard;