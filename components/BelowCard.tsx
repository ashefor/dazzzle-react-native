import React, { memo } from "react";
import Animated, { useAnimatedStyle, interpolate, SharedValue } from "react-native-reanimated";
import { StyleSheet } from "react-native";

import { UserCard } from "./folder/api";
import { Card } from "./UserCard";

type Props = {
  user: UserCard;
  index: number; // logical depth (0 = directly under top)
  tx: SharedValue<number>;
  exitX: number;
  isExiting: boolean;
  cardWidth: number;
  cardHeight: number;
  borderRadius: number;
};

function BelowCardComponent({
  user,
  index,
  tx,
  exitX,
  isExiting,
  cardWidth,
  cardHeight,
  borderRadius,
}: Props) {
  const depth = index + 1;

  const animatedStyle = useAnimatedStyle(() => {
    const baseScale = 1 - depth * 0.04;
    const baseTranslateY = depth * 14;
    const moving = !isExiting;

    const scale = moving
      ?  interpolate(Math.abs(tx.value), [0, exitX], [baseScale, baseScale - 0.02])
      : baseScale;
    const translateY = moving
      ? interpolate(Math.abs(tx.value), [0, exitX], [baseTranslateY, baseTranslateY + 4])
      : baseTranslateY;

    return {
      transform: [{ translateY }, { scale }],
      opacity: 1,
    };
  }, [isExiting, depth, exitX]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.belowCard, animatedStyle, { zIndex: 10 - index }]}
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