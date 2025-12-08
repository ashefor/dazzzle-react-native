import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Dimensions, StyleSheet, View, Text, Platform } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
  interpolate,
  withSpring,
} from "react-native-reanimated";
import { Card } from "./UserCard";
import { StackedCard } from "./StackedCard";
import { UserCard } from "./folder/api";

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
  function SwiperStack({ top, below, onSwiped, onKeepTop, onInfo }, ref) {
    // 1. Animation Hooks
    const tx = useSharedValue(0);
    const ty = useSharedValue(0);
    const rot = useSharedValue(0);
    const isDragging = useSharedValue(false);

    const [exitingCard, setExitingCard] = useState<UserCard | null>(null);
    const exTx = useSharedValue(0);
    const exTy = useSharedValue(0);
    const exRot = useSharedValue(0);

    // 2. Local Deck Hooks
    const [deck, setDeck] = useState<UserCard[]>([]);
    const deckRef = useRef<UserCard[]>([]);

    // Sync Props to Local Deck
    useEffect(() => {
      const incomingStack = top ? [top, ...below] : [...below];
      setDeck((currentDeck) => {
        let nextDeck = currentDeck;
        if (currentDeck.length === 0) {
          nextDeck = incomingStack;
        } else {
          const currentIds = new Set(currentDeck.map((c) => c.id));
          if (top && !currentIds.has(top.id) && currentDeck.length > 0) {
            nextDeck = incomingStack; // Hard refresh/reset
          } else {
             const newCards = incomingStack.filter((c) => !currentIds.has(c.id));
             if (newCards.length > 0) {
               nextDeck = [...currentDeck, ...newCards];
             }
          }
        }
        deckRef.current = nextDeck;
        return nextDeck;
      });
    }, [top, below]);

    const visibleDeck = deck.slice(0, 4);

    // 3. Constants & Refs
    const thresholdX = CARD_WIDTH * 0.25;
    const earlyBadgeThreshold = thresholdX * 0.4;
    const exitX = CARD_WIDTH * 1.2;
    const exitY = CARD_HEIGHT * 0.15;

    const isMountedRef = useRef(true);
    useEffect(() => {
      return () => { isMountedRef.current = false; };
    }, []);

    // 4. Logic Callbacks
    const resetCard = useCallback(() => {
      if (!isMountedRef.current) return;
      tx.value = withSpring(0, { damping: 15, stiffness: 200 });
      ty.value = withSpring(0, { damping: 15, stiffness: 200 });
      rot.value = withSpring(0, { damping: 15, stiffness: 200 });
    }, []);

    const completeSwipe = useCallback(() => {
      if (!isMountedRef.current) return;
      setExitingCard(null);
    }, []);

    const startExitAnimation = useCallback(
      (direction: "left" | "right", cardToSwipe: UserCard) => {
        if (!isMountedRef.current || exitingCard) return;

        setExitingCard(cardToSwipe);
        exTx.value = tx.value;
        exTy.value = ty.value;
        exRot.value = rot.value;

        setDeck((prev) => {
          const next = prev.slice(1);
          deckRef.current = next;
          return next;
        });

        onSwiped(direction, cardToSwipe);

        tx.value = 0;
        ty.value = 0;
        rot.value = 0;

        const sign = direction === "right" ? 1 : -1;
        exTx.value = withTiming(sign * exitX, { duration: 200 });
        exTy.value = withTiming(exitY, { duration: 200 });
        exRot.value = withTiming(sign * 15, { duration: 200 }, () => {
          if (isMountedRef.current) {
            runOnJS(completeSwipe)();
          }
        });
      },
      [completeSwipe, exitingCard, exitX, exitY, onSwiped]
    );

    const handleGestureEnd = useCallback((willRight: boolean, willLeft: boolean) => {
        const currentTop = deckRef.current[0];
        if (!currentTop) return;

        if (willRight) {
            startExitAnimation("right", currentTop);
        } else if (willLeft) {
            startExitAnimation("left", currentTop);
        } else {
            resetCard();
            onKeepTop(currentTop);
        }
    }, [startExitAnimation, resetCard, onKeepTop]);

    const pan = useMemo(
      () =>
        Gesture.Pan()
          .onBegin(() => {
            if (isMountedRef.current) isDragging.value = true;
          })
          .onUpdate((e) => {
            if (!isMountedRef.current) return;
            tx.value = e.translationX;
            ty.value = e.translationY;
            rot.value = e.translationX * 0.06;
          })
          .onEnd((e) => {
            isDragging.value = false;
            const willRight = e.translationX > thresholdX || e.velocityX > 800;
            const willLeft = e.translationX < -thresholdX || e.velocityX < -800;
            runOnJS(handleGestureEnd)(willRight, willLeft);
          })
          .onFinalize(() => {
            isDragging.value = false;
          }),
      [thresholdX, handleGestureEnd]
    );

    useImperativeHandle(
      ref,
      () => ({
        swipeLeft: () => {
          if (deckRef.current[0] && !exitingCard) startExitAnimation("left", deckRef.current[0]);
        },
        swipeRight: () => {
          if (deckRef.current[0] && !exitingCard) startExitAnimation("right", deckRef.current[0]);
        },
        peekInfo: () => {
          if (deckRef.current[0] && !exitingCard) onInfo(deckRef.current[0]);
        },
      }),
      [exitingCard, startExitAnimation, onInfo]
    );

    // 5. Style Hooks (MUST BE CALLED EVERY RENDER)
    const exitingStyle = useAnimatedStyle(() => ({
      transform: [
        { translateX: exTx.value },
        { translateY: exTy.value },
        { rotateZ: `${exRot.value}deg` },
      ],
      zIndex: 10001,
      elevation: Platform.OS === "android" ? 10001 : undefined,
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

    // 6. Render (No Early Return)
    return (
      <View style={{ height: CARD_HEIGHT }}>
        {/* Only render gesture detector if we have cards, but View structure remains stable */}
        {visibleDeck.length > 0 && (
          <GestureDetector gesture={pan}>
            <View style={StyleSheet.absoluteFill}>
              {visibleDeck.map((card, index) => (
                <React.Fragment key={card.id}>
                  <StackedCard
                    user={card}
                    index={index}
                    tx={tx}
                    ty={ty}
                    rot={rot}
                    isDragging={isDragging}
                    exitX={exitX}
                    cardWidth={CARD_WIDTH}
                    cardHeight={CARD_HEIGHT}
                    borderRadius={BORDER_RADIUS}
                  />
                  {index === 0 && (
                    <View style={styles.badgeContainer} pointerEvents="none">
                       <Animated.View style={[styles.badge, styles.likeBadge, likeBadgeStyle]}>
                          <Text style={styles.badgeText}>LIKE</Text>
                       </Animated.View>
                       <Animated.View style={[styles.badge, styles.dislikeBadge, dislikeBadgeStyle]}>
                          <Text style={styles.badgeText}>DISLIKE</Text>
                       </Animated.View>
                    </View>
                  )}
                </React.Fragment>
              ))}
            </View>
          </GestureDetector>
        )}

        {/* Exiting Overlay */}
        {exitingCard && (
          <Animated.View pointerEvents="none" style={[styles.topCard, exitingStyle]}>
            <Card
              key={`exit-${exitingCard.id}`}
              user={exitingCard}
              width={CARD_WIDTH}
              height={CARD_HEIGHT}
              borderRadius={BORDER_RADIUS}
            />
          </Animated.View>
        )}
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
  badgeContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
    elevation: 1000,
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
    left: 40,
    borderColor: "#2ecc71",
    backgroundColor: "rgba(46,204,113,0.12)",
  },
  dislikeBadge: {
    right: 40,
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