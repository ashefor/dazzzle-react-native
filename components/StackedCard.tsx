import React, { memo, useEffect } from "react";
import Animated, {
    useAnimatedStyle,
    interpolate,
    SharedValue,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";
import { StyleSheet, Platform } from "react-native";
import { Card } from "./UserCard";
import { UserCard } from "./folder/api";

type Props = {
  user: UserCard;
  index: number; // 0 = Top/Active, 1+ = Background
  tx: SharedValue<number>;
  ty: SharedValue<number>;
  rot: SharedValue<number>;
  isDragging: SharedValue<boolean>;
  exitX: number;
  cardWidth: number;
  cardHeight: number;
  borderRadius: number;
};

function StackedCardComponent({
  user,
  index,
  tx,
  ty,
  rot,
  isDragging,
  exitX,
  cardWidth,
  cardHeight,
  borderRadius,
}: Props) {
  // Animate the index change (e.g. when moving from 1 -> 0)
  const animatedIndex = useSharedValue(index);

  useEffect(() => {
    // Spring to the new index position
    animatedIndex.value = withSpring(index, {
      damping: 15,
      stiffness: 150,
    });
  }, [index]);

  const animatedStyle = useAnimatedStyle(() => {
    // If we are the top card (index 0), we follow the drag gestures
    if (index === 0) {
      return {
        transform: [
          { translateX: tx.value },
          { translateY: ty.value },
          { rotateZ: `${rot.value}deg` },
          { scale: interpolate(Math.abs(tx.value), [0, exitX], [1, 0.95]) },
        ],
        zIndex: isDragging.value ? 100 : 10, // High zIndex for top
        elevation: Platform.OS === "android" ? (isDragging.value ? 100 : 10) : 10,
      };
    }

    // If we are a background card (index > 0), we use the calculated depth
    // Note: We use animatedIndex for smooth visual transitions between slots
    const depth = animatedIndex.value; 
    // 0 = Top (handled above usually, but for smooth entry), 1 = First Below, etc.
    
    const baseScale = 1 - depth * 0.04;
    const baseTranslateY = depth * 14;

    return {
      transform: [
        { translateX: 0 }, // Background cards never move X
        { translateY: baseTranslateY }, 
        { rotateZ: "0deg" }, 
        { scale: baseScale }
      ],
      zIndex: 10 - index, // Lower zIndex for background
      elevation: Platform.OS === "android" ? 10 - index : undefined,
    };
  });

  return (
    <Animated.View
      // Only the top card (index 0) can receive touches.
      // Background cards (index > 0) let touches pass through to the Gesture Handler on the parent.
      pointerEvents={index === 0 ? "auto" : "none"}
      style={[styles.cardContainer, animatedStyle]}
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
  cardContainer: {
    position: "absolute",
    left: 16,
    right: 16,
    top: 0,
  },
});

export const StackedCard = memo(StackedCardComponent);