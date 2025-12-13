// import React, { useRef, useState } from 'react';
// import { StyleSheet, Text, View, TouchableOpacity, Dimensions, StatusBar, Image } from 'react-native';
// import PagerView from 'react-native-pager-view';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import CustomButton from '@/components/CustomButton';

// const { width, height } = Dimensions.get('window');

// // --- Data ---
// const ONBOARDING_DATA = [
//   {
//     title: "Find Your Perfect Match",
//     description: "Discover meaningful connections with people who share your interests and values in a safe space."
//   },
//   {
//     title: "Connect & Chat",
//     description: "Start meaningful conversations with your matches and build genuine relationships that last."
//   },
//   {
//     title: "Your Personality Matters",
//     description: "Match based on what makes you truly unique – your interests, humor, energy, and vibe."
//   }
// ];

// // --- Illustration Components ---
// // (Kept these consistent but refined placement logic in main component)
// // const IllustrationOne = () => (
// //   <View style={styles.illustrationContainer}>
// //       <Image source={images.newonboard1} style={{ width: '100%', height: '100%' }} resizeMode='contain' />
// //   </View>
// // );

// // const IllustrationTwo = () => (
// //   <View style={styles.illustrationContainer}>
// //       <Image source={images.newonboard2} style={{ width: '100%', height: '100%' }} resizeMode='contain' />
// //   </View>
// // );

// // const IllustrationThree = () => (
// //   <View style={styles.illustrationContainer}>
// //       <Image source={images.newonboard3} style={{ width: '100%', height: '100%' }} resizeMode='contain' />
// //   </View>
// // );

// // --- Main Component ---

// export default function OnboardingScreen() {
//   const [pageIndex, setPageIndex] = useState(0);
//   const pagerRef = useRef<PagerView>(null);
//   const insets = useSafeAreaInsets();

//   return (
//      <View style={{ paddingTop: insets.top, paddingBottom: insets.bottom }} className='flex-1 bg-white h-full'>
//       <StatusBar barStyle="dark-content" />
//             <View className='p-4 flex-1'>
//                 <View style={{height: 60}}/>
//                 <View className='flex-1 justify-between'>
//                     <View className='flex-row items-center justify-center'>
//                       <Image source={require('@/assets/images/logo.png')} style={{ width: 80, height: 80 }} resizeMode='contain' />
//                       <Text className='text-3xl text-primary font-firabold ml'>Dazzzle</Text>
//                     </View>
//                     <View>
//                         <View className='mt-2'>
//                             <CustomButton handlePress={() => {}} title="Create account" />
//                         </View>
//                         <View className='mt-2'>
//                             <TouchableOpacity
//                                   onPress={() => {}}
//                                   activeOpacity={0.7}
//                                   className={`py-4 w-full bg-white border border-primary flex items-center justify-center rounded-[26px]`}>
//                                   <Text className={`text-primary font-firamedium text-base`}>
//                                     Sign in
//                                   </Text>
//                                 </TouchableOpacity>
//                         </View>
//                         <View className='mt-3'>
//                             <Text className='text-xs text-center'>By clicking 'Create account' or 'Sign in', you agree to our <Text className='text-primary font-firamedium'>Terms of Service</Text> and <Text className='text-primary font-firamedium'>Privacy Policy</Text>
//                             </Text>
//                         </View>
//                     </View>
//                 </View>
//                 <View style={{height: 50}}/>
//             </View>
//         </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#ffffff',
//   },
//   // --- Layout ---
//   pagerContainer: {
//     flex: 0.6, // 60% height for image
//   },
//   pagerView: {
//     flex: 1,
//   },
//   page: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   illustrationContainer: {
//     flex: 1,
//     width: width,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
  
//   // --- Bottom Section ---
//   bottomSection: {
//     flex: 0.4, // 40% height for text/buttons
//     paddingHorizontal: 20,
//     paddingBottom: 20,
//     justifyContent: 'space-between',
//   },
//   textWrapper: {
//     marginTop: 20,
//     height: 120, // Fixed height to prevent layout jumps during animation
//     justifyContent: 'flex-start',
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: '800',
//     color: '##CB30E0', 
//     fontFamily: 'FiraSans_800ExtraBold',
//     marginBottom: 12,
//     letterSpacing: -0.5,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#6B7280',
//     fontFamily: 'FiraSans_400Regular',
//     lineHeight: 24,
//     fontWeight: '400',
//   },
  
//   // --- Footer Controls ---
//   footer: {
//     marginBottom: 20,
//   },
//   indicatorContainer: {
//     flexDirection: 'row',
//     marginBottom: 24,
//     height: 8,
//     alignItems: 'center',
//   },
//   indicator: {
//     height: 6,
//     borderRadius: 3,
//     marginRight: 8,
//   },
//   activeIndicator: {
//     width: 32,
//     backgroundColor: '#D946EF',
//     height: 6,
//   },
//   inactiveIndicator: {
//     width: 6,
//     backgroundColor: '#E5E7EB',
//     height: 6,
//   },
//   button: {
//     flexDirection: 'row',
//     height: 64, // Taller, more tappable button
//     borderRadius: 32,
//     alignItems: 'center',
//     paddingLeft: 32,
//     paddingRight: 8,
//     justifyContent: 'space-between',
//     // Shadow
//     shadowColor: '#D946EF',
//     shadowOffset: { width: 0, height: 8 },
//     shadowOpacity: 0.3,
//     shadowRadius: 16,
//     elevation: 8,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 17,
//     fontWeight: '700',
//     letterSpacing: 0.5,
//   },
//   iconCircle: {
//     width: 48,
//     height: 48,
//     backgroundColor: '#fff',
//     borderRadius: 24,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });

import React, { useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, StatusBar, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// Ensure these are installed: npx expo install expo-blur react-native-reanimated
import { BlurView } from 'expo-blur';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import CustomButton from '@/components/CustomButton';
import { router } from 'expo-router';

// --- CONFIGURATION ---
// TODO: Replace these with the actual paths to your images in your assets folder
const slideImages = [
    // Assuming these are where you saved the images provided in the prompt
    require('@/assets/images/bg1.jpg'), // image_0.jpg
    require('@/assets/images/bg2.jpg'), // image_1.jpg
    require('@/assets/images/bg3.jpg'), // image_2.png
];
const SLIDE_DURATION = 5000; // 5 seconds per slide
const FADE_DURATION = 1000; // 1 second crossfade

// --- HELPER COMPONENT: Background Slideshow ---
function BackgroundSlideshow() {
    // We create a shared value for opacity for EACH image
    const opacityValues = slideImages.map(() => useSharedValue(0));
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Initialize: Make the first image visible immediately
        opacityValues[0].value = 1;

        let currentIndex = 0;

        // Start the slideshow timer
        intervalRef.current = setInterval(() => {
            const nextIndex = (currentIndex + 1) % slideImages.length;

            // Fade OUT current image
            opacityValues[currentIndex].value = withTiming(0, {
                duration: FADE_DURATION,
            });

            // Fade IN next image
            opacityValues[nextIndex].value = withTiming(1, {
                duration: FADE_DURATION,
            });

            // Update index for next loop
            currentIndex = nextIndex;
        }, SLIDE_DURATION);

        // Cleanup on unmount
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    return (
        <View className="absolute top-0 bottom-0 left-0 right-0 bg-black">
            {/* Render all images stacked absolutely */}
            {slideImages.map((imgSource, index) => {
                const animatedStyle = useAnimatedStyle(() => ({
                    opacity: opacityValues[index].value,
                }));

                return (
                    <Animated.Image
                        key={index}
                        source={imgSource}
                        resizeMode="cover"
                        className="absolute w-full h-full"
                        style={animatedStyle}
                    />
                );
            })}

            {/*
               Grayscale Simulation Layer:
               A black, semi-transparent layer to darken and desaturate the underlying colors.
            */}
            <View className="absolute w-full h-full bg-black/50" />

            {/* Blur Layer (from expo-blur) */}
            <BlurView
                intensity={0} // Adjust intensity (0-100) as needed
                tint="dark"    // 'dark', 'light', or 'default'
                className="absolute w-full h-full z-10"
                style={StyleSheet.absoluteFill} // Ensure it fills the space
            />
        </View>
    );
}


// --- MAIN COMPONENT ---
export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();

  return (
      // Changed bg-white to relative so background shows through
      <View className='flex-1 h-full relative'>

        {/* INSERT SLIDESHOW BACKGROUND HERE (behind content) */}
        <BackgroundSlideshow />

        {/*
           Main Content Container
           We remove 'bg-white' here so it's transparent.
           We add a 'z-10' to ensure this sits ON TOP of the blur view.
        */}
       <View style={{ paddingTop: insets.top, paddingBottom: insets.bottom }} className='flex-1 z-10'>
       <StatusBar barStyle="light-content" /> 
            <View className='p-4 flex-1'>
                <View style={{height: 50}}/>
                <View className='flex-1 justify-between'>
                    {/* Logo Section */}
                    <View className='flex-row items-center justify-center'>
                      {/* Added a white tint to logo for better visibility */}
                      <Image source={require('@/assets/images/logo.png')} style={{ width: 80, height: 80, tintColor: 'white' }} resizeMode='contain' />
                      <Text className='text-3xl text-white font-firabold'>Dazzzle</Text>
                    </View>

                    <View>
                        <View className='mt-2'>
                            <CustomButton handlePress={() => router.replace('/(auth)/sign-up')} title="Create account" />
                        </View>

                        <View className='mt-2'>
                            <TouchableOpacity
                                  onPress={() => router.replace('/(auth)/sign-in')}
                                  activeOpacity={0.7}
                                  className={`py-4 w-full bg-transparent border border-white flex items-center justify-center rounded-[26px]`}>
                                  <Text className={`text-white font-firamedium text-base`}>
                                    Sign in
                                  </Text>
                                </TouchableOpacity>
                        </View>
                        <View className='mt-3'>
                            <Text className='text-xs text-center text-gray-200'>By clicking 'Create account' or 'Sign in', you agree to our <Text className='text-white font-firamedium'>Terms of Service</Text> and <Text className='text-white font-firamedium'>Privacy Policy</Text>
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={{height: 50}}/>
            </View>
        </View>
      </View>
  );
}