import React, { memo, useEffect } from "react";
import Animated, {
    useAnimatedStyle,
    interpolate,
    SharedValue,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";
import { StyleSheet } from "react-native";
import { Card } from "./UserCard";
import { UserCard } from "./folder/api";

type Props = {
  user: UserCard;
  index: number;
  tx: SharedValue<number>;
  exitX: number;
  cardWidth: number;
  cardHeight: number;
  borderRadius: number;
};

function BelowCardComponent({
  user,
  index,
  tx,
  exitX,
  cardWidth,
  cardHeight,
  borderRadius,
}: Props) {
  // We use a shared value for the index to animate it smoothly
  // When index changes (e.g., 1 -> 0), this value will spring to the new number
  const animatedIndex = useSharedValue(index);

  useEffect(() => {
    animatedIndex.value = withSpring(index, {
      damping: 15,
      stiffness: 150,
      mass: 0.5, // Lightweight for fast response
    });
  }, [index]);

  const animatedStyle = useAnimatedStyle(() => {
    // Calculate depth based on the ANIMATED index, not the discrete prop
    const depth = animatedIndex.value + 1;
    
    const baseScale = 1 - depth * 0.04;
    const baseTranslateY = depth * 14;

    // Combine the smooth index transition with the drag parallax
    // We limit the effect of tx so background cards don't move too aggressively
    const parallaxScale = interpolate(
      Math.abs(tx.value),
      [0, exitX],
      [0, 0.02] // Minor growth during swipe
    );
    
    const parallaxY = interpolate(
      Math.abs(tx.value),
      [0, exitX],
      [0, -4] // Minor lift during swipe
    );

    return {
      transform: [
        { translateY: baseTranslateY + parallaxY }, 
        { scale: baseScale + parallaxScale }
      ],
      opacity: 1,
      zIndex: 10 - index, // Keep zIndex discreet to avoid sorting issues
    };
  }, [exitX, index]); // Dependency on index is just for zIndex update

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.belowCard, animatedStyle]}
    >
      <Card
        user={user}
        width={cardWidth}
        height={cardHeight}
        borderRadius={borderRadius}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  belowCard: {
    position: "absolute",
    left: 16,
    right: 16,
    top: 0,
  },
});

export const BelowCard = memo(BelowCardComponent);