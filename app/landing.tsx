import React, { memo, useCallback, useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { SystemBars } from 'react-native-edge-to-edge';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
} from 'react-native-reanimated';
import CustomButton from '@/components/CustomButton';
import { router } from 'expo-router';

const SLIDES = [
    { id: 'bg1', source: require('@/assets/images/bg1.jpg') },
    { id: 'bg2', source: require('@/assets/images/bg2.jpg') },
    { id: 'bg3', source: require('@/assets/images/bg3.jpg') },
];
const SLIDE_DURATION = 5000; // 5 seconds per slide
const FADE_DURATION = 1000; // 1 second crossfade

/**
 * One crossfading slide. Its shared value and animated style live here, at the top
 * level of a component, rather than being created inside a .map() in the parent —
 * that violated the rules of hooks and only worked by accident because SLIDES has a
 * fixed length. Fading is driven by `isActive` and still runs on the UI thread.
 */
const SlideImage = memo(({ source, isActive }: { source: number; isActive: boolean }) => {
    const opacity = useSharedValue(isActive ? 1 : 0);

    useEffect(() => {
        opacity.value = withTiming(isActive ? 1 : 0, { duration: FADE_DURATION });
    }, [isActive, opacity]);

    const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

    return (
        <Animated.Image
            source={source}
            resizeMode="cover"
            style={[styles.slide, animatedStyle]}
        />
    );
});
SlideImage.displayName = 'SlideImage';

const BackgroundSlideshow = memo(() => {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setActiveIndex((current) => (current + 1) % SLIDES.length);
        }, SLIDE_DURATION);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <View style={styles.slideshow}>
            {SLIDES.map((slide, index) => (
                <SlideImage key={slide.id} source={slide.source} isActive={index === activeIndex} />
            ))}
            {/* Darkens the photography so the foreground copy stays legible. */}
            <View style={styles.scrim} />
        </View>
    );
});
BackgroundSlideshow.displayName = 'BackgroundSlideshow';

export default function OnboardingScreen() {
    const insets = useSafeAreaInsets();

    const goToSignUp = useCallback(() => router.replace('/(auth)/sign-up'), []);
    const goToSignIn = useCallback(() => router.replace('/(auth)/sign-in'), []);

    return (
        <View className='flex-1 h-full relative'>
            <BackgroundSlideshow />

            <View style={{ paddingTop: insets.top, paddingBottom: insets.bottom }} className='flex-1 z-10'>
                {/* Light icons for this screen's dark backdrop. SystemBars (not RN's
                    StatusBar) so it shares one stack with the root default and pops back
                    to dark on unmount instead of leaking white-on-white into other screens. */}
                <SystemBars style="light" />
                <View className='p-4 flex-1'>
                    <View style={styles.spacer} />
                    <View className='flex-1 justify-between'>
                        <View className='flex-row items-center justify-center'>
                            <Image source={require('@/assets/images/logo.png')} style={styles.logo} resizeMode='contain' />
                            <Text className='text-5xl text-white' style={styles.brand}>dazzzle</Text>
                        </View>

                        <View>
                            <View className='mt-2'>
                                <CustomButton handlePress={goToSignUp} title="Create account" />
                            </View>

                            <View className='mt-2'>
                                <TouchableOpacity
                                    onPress={goToSignIn}
                                    activeOpacity={0.7}
                                    className='py-4 w-full bg-transparent border border-white flex items-center justify-center rounded-[26px]'>
                                    <Text className='text-white font-firamedium text-base'>
                                        Sign in
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View className='mt-3'>
                                <Text className='text-xs text-center text-gray-200'>
                                    By clicking &apos;Create account&apos; or &apos;Sign in&apos;, you agree to our <Text className='text-white font-firamedium'>Terms of Service</Text> and <Text className='text-white font-firamedium'>Privacy Policy</Text>
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.spacer} />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    slideshow: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'black',
    },
    slide: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '100%',
    },
    scrim: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    spacer: {
        height: 50,
    },
    logo: {
        width: 72,
        height: 72,
        tintColor: 'white',
    },
    brand: {
        fontFamily: 'LilitaOne_400Regular',
    },
});
