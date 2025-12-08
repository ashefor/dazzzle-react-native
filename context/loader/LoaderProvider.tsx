import React, { createContext, useContext, useState, useRef, useCallback, useMemo } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import Images from '@/constants/images';

// Define Context
const LoaderContext = createContext({
    show: () => {},
    hide: () => {},
});

export const useLoader = () => useContext(LoaderContext);

export const LoaderProvider = ({ children }: { children: React.ReactNode }) => {
    // We use 'active' to control pointerEvents. 
    // We don't unmount the view, we just hide it visually and continuously.
    const [active, setActive] = useState(false);

    // Animation Values
    const opacityAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;

    // 1. Pulse Animation Loop
    const startPulse = useCallback(() => {
        scaleAnim.setValue(1);
        Animated.loop(
            Animated.sequence([
                Animated.timing(scaleAnim, {
                    toValue: 1.1, // Scale up slightly
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1, // Scale back down
                    duration: 500,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [scaleAnim]);

    const stopPulse = useCallback(() => {
        scaleAnim.stopAnimation();
    }, [scaleAnim]);

    // 2. Show Function
    const show = useCallback(() => {
        // requestAnimationFrame fixes the "useInsertionEffect" warning
        // by ensuring we don't update state during a render pass
        requestAnimationFrame(() => {
            setActive(true);
            startPulse();
            Animated.timing(opacityAnim, {
                toValue: 1,
                duration: 250,
                useNativeDriver: true,
            }).start();
        });
    }, [opacityAnim, startPulse]);

    // 3. Hide Function
    const hide = useCallback(() => {
        requestAnimationFrame(() => {
            Animated.timing(opacityAnim, {
                toValue: 0,
                duration: 250,
                useNativeDriver: true,
            }).start(({ finished }) => {
                if (finished) {
                    setActive(false);
                    stopPulse();
                }
            });
        });
    }, [opacityAnim, stopPulse]);

    // Memoize context value to prevent unnecessary re-renders of consumers
    const contextValue = useMemo(() => ({ show, hide }), [show, hide]);

    return (
        <LoaderContext.Provider value={contextValue}>
            {children}
            
            {/* 
               We keep this mounted but control interaction via pointerEvents.
               This is much more performant than {visible && <View>} 
            */}
            <Animated.View
                pointerEvents={active ? 'auto' : 'none'}
                style={[
                    styles.overlay,
                    { opacity: opacityAnim }
                ]}
            >
                <View style={styles.container}>
                    <Animated.Image
                        source={Images.logo}
                        style={[
                            styles.logo,
                            { transform: [{ scale: scaleAnim }] }
                        ]}
                        resizeMode="contain"
                    />
                </View>
            </Animated.View>
        </LoaderContext.Provider>
    );
};

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject, // Replaces top:0, left:0, width/height
        zIndex: 99999999,
        backgroundColor: 'rgba(0,0,0,0.6)', // Semi-transparent black
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        padding: 20,
        borderRadius: 16,
        // backgroundColor: 'rgba(255, 255, 255, 0.9)', // Optional: Add a small card background behind logo
        // shadowColor: "#000",
        // shadowOffset: {
        //     width: 0,
        //     height: 2,
        // },
        // shadowOpacity: 0.25,
        // shadowRadius: 3.84,
        // elevation: 5,
    },
    logo: {
        width: 60, 
        height: 60
    }
});