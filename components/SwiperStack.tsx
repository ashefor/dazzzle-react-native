import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    forwardRef,
    useImperativeHandle,
} from "react";
import { Dimensions, StyleSheet, View, Text } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    runOnJS,
    interpolate,
} from "react-native-reanimated";
import { UserCard } from "./folder/api";
import { Card } from "./UserCard";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH - 32;
const CARD_HEIGHT = Math.round(SCREEN_WIDTH * 1.25);
const BORDER_RADIUS = 24;

export type SwiperStackHandle = {
  swipeLeft: () => void;
  swipeRight: () => void;
  peekInfo: () => void;
};

type Props = {
  top: UserCard | undefined;
  below: UserCard[];
  onSwiped: (direction: "left" | "right", user: UserCard) => void;
  onKeepTop: (user: UserCard) => void;
  onInfo: (user: UserCard) => void;
};

export const SwiperStack = forwardRef<SwiperStackHandle, Props>(
  ({ top, below, onSwiped, onKeepTop, onInfo }, ref) => {
    const tx = useSharedValue(0);
    const ty = useSharedValue(0);
    const rot = useSharedValue(0);

    const [exitingCard, setExitingCard] = useState<UserCard | null>(null);
    const exitDirectionRef = useRef<"left" | "right" | null>(null);

    const thresholdX = useMemo(() => CARD_WIDTH * 0.25, []);
    const earlyBadgeThreshold = thresholdX * 0.4;
    const exitX = useMemo(() => CARD_WIDTH * 1.2, []);
    const exitY = useMemo(() => CARD_HEIGHT * 0.15, []);

    const resetCard = useCallback(() => {
      tx.value = withSpring(0, { damping: 15, stiffness: 200 });
      ty.value = withSpring(0, { damping: 15, stiffness: 200 });
      rot.value = withSpring(0, { damping: 15, stiffness: 200 });
    }, [tx, ty, rot]);

    useEffect(() => {
      // Ensure fresh neutral transforms for new top card
      tx.value = 0;
      ty.value = 0;
      rot.value = 0;
    }, [top?.id, tx, ty, rot]);

    const completeSwipe = useCallback(
      (direction: "left" | "right", user: UserCard) => {
        runOnJS(onSwiped)(direction, user);
        setExitingCard(null);
        exitDirectionRef.current = null;
      },
      [onSwiped]
    );

    const fling = useCallback(
      (direction: "left" | "right", user: UserCard) => {
        if (exitingCard) return; // already animating
        setExitingCard(user);
        exitDirectionRef.current = direction;
        const sign = direction === "right" ? 1 : -1;
        tx.value = withTiming(sign * exitX, { duration: 180 });
        ty.value = withTiming(exitY, { duration: 180 });
        rot.value = withTiming(sign * 15, { duration: 180 }, () => {
          runOnJS(completeSwipe)(direction, user);
        });
      },
      [exitX, exitY, completeSwipe, tx, ty, rot, exitingCard]
    );

    const gesture = useMemo(
      () =>
        Gesture.Pan()
          .onUpdate((e) => {
            if (exitingCard) return;
            tx.value = e.translationX;
            ty.value = e.translationY;
            rot.value = e.translationX * 0.06;
          })
          .onEnd((e) => {
            if (!top || exitingCard) return;
            const willRight = e.translationX > thresholdX || e.velocityX > 800;
            const willLeft = e.translationX < -thresholdX || e.velocityX < -800;
            if (willRight) {
              runOnJS(fling)("right", top);
            } else if (willLeft) {
              runOnJS(fling)("left", top);
            } else {
              runOnJS(resetCard)();
              runOnJS(onKeepTop)(top);
            }
          }),
      [top, thresholdX, fling, resetCard, onKeepTop, exitingCard]
    );

    // Imperative handle for buttons
    useImperativeHandle(
      ref,
      () => ({
        swipeLeft: () => {
          if (top) fling("left", top);
        },
        swipeRight: () => {
          if (top) fling("right", top);
        },
        peekInfo: () => {
          if (top && !exitingCard) onInfo(top);
        },
      }),
      [fling, top, onInfo, exitingCard]
    );

    const topStyle = useAnimatedStyle(() => ({
      transform: [
        { translateX: tx.value },
        { translateY: ty.value },
        { rotateZ: `${rot.value}deg` },
        { scale: interpolate(Math.abs(tx.value), [0, exitX], [1, 0.95]) },
      ],
    }));

    const likeBadgeStyle = useAnimatedStyle(() => {
      const show = tx.value > earlyBadgeThreshold;
      const progress = interpolate(Math.abs(tx.value), [earlyBadgeThreshold, thresholdX], [0, 1], {
        extrapolateRight: "clamp",
        extrapolateLeft: "clamp",
      });
      return {
        opacity: show ? progress : 0,
        transform: [{ rotateZ: "-15deg" }, { scale: 0.8 + progress * 0.2 }],
      };
    });

    const dislikeBadgeStyle = useAnimatedStyle(() => {
      const show = tx.value < -earlyBadgeThreshold;
      const progress = interpolate(Math.abs(tx.value), [earlyBadgeThreshold, thresholdX], [0, 1], {
        extrapolateRight: "clamp",
        extrapolateLeft: "clamp",
      });
      return {
        opacity: show ? progress : 0,
        transform: [{ rotateZ: "15deg" }, { scale: 0.8 + progress * 0.2 }],
      };
    });

    const logicalBelow = below.slice(0, 3);
    const belowAnimatedStyles = logicalBelow.map((_, idx) =>
      useAnimatedStyle(
        () => {
          const depth = idx + 1;
          const baseScale = 1 - depth * 0.04;
          const baseTranslateY = depth * 14;
          const moving = !exitingCard;
          const scale = moving
            ? interpolate(Math.abs(tx.value), [0, exitX], [baseScale, baseScale - 0.02])
            : baseScale;
          const translateY = moving
            ? interpolate(Math.abs(tx.value), [0, exitX], [baseTranslateY, baseTranslateY + 4])
            : baseTranslateY;
          return { transform: [{ translateY }, { scale }], opacity: 1 };
        },
        [exitingCard]
      )
    );

    const activeTopCard = exitingCard ?? top;
    if (!activeTopCard) return <View style={{ height: CARD_HEIGHT }} />;

    return (
      <View style={{ height: CARD_HEIGHT }}>
        {logicalBelow.map((card, idx) => (
          <Animated.View
            key={card.id}
            pointerEvents="none"
            style={[styles.belowCard, belowAnimatedStyles[idx], { zIndex: 10 - idx }]}
          >
            <Card user={card} width={CARD_WIDTH} height={CARD_HEIGHT} borderRadius={BORDER_RADIUS} />
          </Animated.View>
        ))}

        <GestureDetector gesture={gesture}>
          <Animated.View style={[styles.topCard, { zIndex: 999 }, topStyle]}>
            <Card
              user={activeTopCard}
              width={CARD_WIDTH}
              height={CARD_HEIGHT}
              borderRadius={BORDER_RADIUS}
            />

            <Animated.View style={[styles.badge, styles.likeBadge, likeBadgeStyle]}>
              <Text style={styles.badgeText}>LIKE</Text>
            </Animated.View>
            <Animated.View style={[styles.badge, styles.dislikeBadge, dislikeBadgeStyle]}>
              <Text style={styles.badgeText}>DISLIKE</Text>
            </Animated.View>
          </Animated.View>
        </GestureDetector>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  topCard: {
    position: "absolute",
    left: 16,
    right: 16,
    top: 0,
  },
  belowCard: {
    position: "absolute",
    left: 16,
    right: 16,
    top: 0,
  },
  badge: {
    position: "absolute",
    top: 28,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 3,
    borderRadius: 8,
  },
  likeBadge: {
    left: 24,
    borderColor: "#2ecc71",
    backgroundColor: "rgba(46,204,113,0.12)",
  },
  dislikeBadge: {
    right: 24,
    borderColor: "#e74c3c",
    backgroundColor: "rgba(231,76,60,0.12)",
  },
  badgeText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 1,
  },
});