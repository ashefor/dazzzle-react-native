import React, { forwardRef, useImperativeHandle } from 'react'
import { View, PanResponder, Dimensions } from 'react-native'
import { useSpring, animated, SpringRef } from '@react-spring/native'
const { height, width } = Dimensions.get('window')

type TinderCardRef = {
    swipe: (dir: 'right' | 'left' | 'up' | 'down') => void;
  }

const settings = {
    maxTilt: 25, // in deg
    rotationPower: 50,
    swipeThreshold: 1 // need to update this threshold for RN (1.5 seems reasonable...?)
}

// physical properties of the spring
const physics = {
    touchResponsive: {
        friction: 50,
        tension: 2000
    },
    animateOut: {
        friction: 30,
        tension: 400
    },
    animateBack: {
        friction: 10,
        tension: 200
    }
}

const pythagoras = (x: number, y: number) => {
    return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
}

const animateOut = async (gesture: { vx: any; vy: any }, setSpringTarget: SpringRef<{ x: number; y: number; rot: number }>) => {
    const diagonal = pythagoras(height, width)
    const velocity = pythagoras(gesture.vx, gesture.vy)
    const finalX = diagonal * gesture.vx
    const finalY = diagonal * gesture.vy
    const finalRotation = gesture.vx * 45
    const duration = diagonal / velocity

    setSpringTarget({
        x: finalX,
        y: finalY,
        rot: finalRotation, // set final rotation value based on gesture.vx
        config: { duration: duration }
    })

    // for now animate back
    return await new Promise<void>((resolve) =>
        setTimeout(() => {
            resolve()
        }, duration)
    )
}

const animateBack = (setSpringTarget: (arg0: { x: number; y: number; rot: number; config: { friction: number; tension: number } }) => void) => {
    // translate back to the initial position
    setSpringTarget({ x: 0, y: 0, rot: 0, config: physics.animateBack })
}

const getSwipeDirection = (speed: { x: any; y: any }) => {
    if (Math.abs(speed.x) > Math.abs(speed.y)) {
        return speed.x > 0 ? 'right' : 'left'
    } else {
        return speed.y > 0 ? 'down' : 'up'
    }
}

// must be created outside of the TinderCard forwardRef
const AnimatedView = animated(View)

const TinderCard = forwardRef<TinderCardRef>(
    (
        { flickOnSwipe = true, 
            children, 
            onSwipe, 
            onCardLeftScreen, 
            className, 
            preventSwipe = []
         },
        ref
    ): React.JSX.Element => {
        const [{ x, y, rot }, setSpringTarget] = useSpring(() => ({
            x: 0,
            y: 0,
            rot: 0,
            config: physics.touchResponsive
        }))

        useImperativeHandle(ref, () => ({
            async swipe(dir = 'right') {
                if (onSwipe) onSwipe(dir)
                const power = 1.3
                const disturbance = (Math.random() - 0.5) / 2
                if (dir === 'right') {
                    await animateOut({ vx: power, vy: disturbance }, setSpringTarget)
                } else if (dir === 'left') {
                    await animateOut({ vx: -power, vy: disturbance }, setSpringTarget)
                } else if (dir === 'up') {
                    await animateOut({ vx: disturbance, vy: power }, setSpringTarget)
                } else if (dir === 'down') {
                    await animateOut({ vx: disturbance, vy: -power }, setSpringTarget)
                }
                if (onCardLeftScreen) onCardLeftScreen(dir)
            }
        }))

        const handleSwipeReleased = React.useCallback(
            async (setSpringTarget: any, gesture: { vx: number; vy: number }) => {
                // Check if this is a swipe
                if (
                    Math.abs(gesture.vx) > settings.swipeThreshold ||
                    Math.abs(gesture.vy) > settings.swipeThreshold
                ) {
                    const dir = getSwipeDirection({ x: gesture.vx, y: gesture.vy })

                    if (flickOnSwipe) {
                        if (!preventSwipe.includes(dir)) {
                            if (onSwipe) onSwipe(dir)

                            await animateOut(gesture, setSpringTarget)
                            if (onCardLeftScreen) onCardLeftScreen(dir)
                            return
                        }
                    }
                }

                // Card was not flicked away, animate back to start
                animateBack(setSpringTarget)
            },
            [flickOnSwipe, onSwipe, onCardLeftScreen, preventSwipe]
        )

        // const panResponder = React.useMemo(
        //     () =>
        //         PanResponder.create({
        //             // Ask to be the responder:
        //             onStartShouldSetPanResponder: (evt, gestureState) => true,
        //             onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
        //             onMoveShouldSetPanResponder: (evt, gestureState) => true,
        //             onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

        //             onPanResponderGrant: (evt, gestureState) => {
        //                 // The gesture has started.
        //                 // Probably wont need this anymore as postion i relative to swipe!
        //                 setSpringTarget({ x: gestureState.dx, y: gestureState.dy, rot: 0, config: physics.touchResponsive })
        //             },
        //             onPanResponderMove: (evt, gestureState) => {
        //                 // use guestureState.vx / guestureState.vy for velocity calculations
        //                 // translate element
        //                 let rot = ((300 * gestureState.vx) / width) * 15// Magic number 300 different on different devices? Run on physical device!
        //                 rot = Math.max(Math.min(rot, settings.maxTilt), -settings.maxTilt)
        //                 setSpringTarget({ x: gestureState.dx, y: gestureState.dy, rot, config: physics.touchResponsive })
        //             },
        //             onPanResponderTerminationRequest: (evt, gestureState) => {
        //                 return true
        //             },
        //             onPanResponderRelease: (evt, gestureState) => {
        //                 // The user has released all touches while this view is the
        //                 // responder. This typically means a gesture has succeeded
        //                 // enable
        //                 handleSwipeReleased(setSpringTarget, gestureState)
        //             }
        //         }),
        //     []
        // )

        const panResponder = React.useMemo(
            () =>
                PanResponder.create({
                    onStartShouldSetPanResponder: (evt, gestureState) => true,
                    onMoveShouldSetPanResponder: (evt, gestureState) => {
                        // Allow movement but only block if swipe threshold is exceeded
                        return Math.abs(gestureState.dx) > settings.swipeThreshold ||
                               Math.abs(gestureState.dy) > settings.swipeThreshold;
                    },
                    onPanResponderMove: (evt, gestureState) => {
                        let rot = ((300 * gestureState.vx) / width) * 15; // Adjust tilt based on velocity
                        rot = Math.max(Math.min(rot, settings.maxTilt), -settings.maxTilt);
                        setSpringTarget({ x: gestureState.dx, y: gestureState.dy, rot, config: physics.touchResponsive });
                    },
                    onPanResponderRelease: (evt, gestureState) => {
                        handleSwipeReleased(setSpringTarget, gestureState);
                    },
                }),
            []
        );

        return (
            <AnimatedView
                // {...panResponder.panHandlers}
                style={{
                    transform: [
                        { translateX: x },
                        { translateY: y },
                        { rotate: rot.to((rot) => `${rot}deg`) }
                    ]
                }}
            >
                <View style={{ pointerEvents: 'auto' }}>
                {children}
                </View>
            </AnimatedView>
        )
    }
)

// module.exports = TinderCard
export default TinderCard