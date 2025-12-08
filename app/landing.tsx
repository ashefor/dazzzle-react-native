import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions, SafeAreaView, StatusBar, Animated, Easing } from 'react-native';
import PagerView, { PagerViewOnPageSelectedEvent } from 'react-native-pager-view';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import images from '@/constants/images';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

// --- Data ---
const ONBOARDING_DATA = [
  {
    title: "Find Your Perfect Match",
    description: "Discover meaningful connections with people who share your interests and values in a safe space."
  },
  {
    title: "Connect & Chat",
    description: "Start meaningful conversations with your matches and build genuine relationships that last."
  },
  {
    title: "Your Personality Matters",
    description: "Match based on what makes you truly unique – your interests, humor, energy, and vibe."
  }
];

// --- Illustration Components ---
// (Kept these consistent but refined placement logic in main component)
const IllustrationOne = () => (
  <View style={styles.illustrationContainer}>
      <Image source={images.newonboard1} style={{ width: '100%', height: '100%' }} resizeMode='contain' />
  </View>
);

const IllustrationTwo = () => (
  <View style={styles.illustrationContainer}>
      <Image source={images.newonboard2} style={{ width: '100%', height: '100%' }} resizeMode='contain' />
  </View>
);

const IllustrationThree = () => (
  <View style={styles.illustrationContainer}>
      <Image source={images.newonboard3} style={{ width: '100%', height: '100%' }} resizeMode='contain' />
  </View>
);

// --- Main Component ---

export default function OnboardingScreen() {
  const [pageIndex, setPageIndex] = useState(0);
  const pagerRef = useRef<PagerView>(null);
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(1)).current; 
  const slideAnim = useRef(new Animated.Value(0)).current; // 0 = center position
  
  // Animate Text Content
  useEffect(() => {
    // 1. Fade Out & Slide Down slightly
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 10, // Move down 10px
        duration: 150,
        useNativeDriver: true,
      })
    ]).start(() => {
      // 2. Reset position to slightly above (hidden)
      slideAnim.setValue(-10);
      
      // 3. Fade In & Slide Up to Center
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
        Animated.timing(slideAnim, {
          toValue: 0, // Back to center
          duration: 400,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        })
      ]).start();
    });
  }, [pageIndex]);

  const handlePageSelected = (e: PagerViewOnPageSelectedEvent) => {
    setPageIndex(e.nativeEvent.position);
  };

  const handleNext = () => {
    if (pageIndex < 2) {
      pagerRef.current?.setPage(pageIndex + 1);
    } else {
        console.log("Navigate to Login");
        router.replace('/(auth)/sign-in');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Top Section: Illustrations */}
      <View style={styles.pagerContainer}>
        <PagerView 
            style={styles.pagerView} 
            initialPage={0} 
            ref={pagerRef}
            onPageSelected={handlePageSelected}
        >
            <View key="1" style={styles.page}><IllustrationOne /></View>
            <View key="2" style={styles.page}><IllustrationTwo /></View>
            <View key="3" style={styles.page}><IllustrationThree /></View>
        </PagerView>
      </View>

      {/* Bottom Section: Content Card */}
      <View style={styles.bottomSection}>
        
        {/* Text Content */}
        <View style={styles.textWrapper}>
            <Animated.View 
              style={{ 
                opacity: fadeAnim, 
                transform: [{ translateY: slideAnim }] 
              }}
            >
              <Text style={styles.title}>{ONBOARDING_DATA[pageIndex].title}</Text>
              <Text style={styles.subtitle}>{ONBOARDING_DATA[pageIndex].description}</Text>
            </Animated.View>
        </View>

        {/* Footer Controls */}
        <View style={styles.footer}>
            {/* Indicators */}
            <View style={styles.indicatorContainer}>
            {[0, 1, 2].map((i) => (
                <Animated.View
                key={i}
                style={[
                    styles.indicator,
                    pageIndex === i ? styles.activeIndicator : styles.inactiveIndicator
                ]}
                />
            ))}
            </View>

            {/* Primary Action Button */}
            <TouchableOpacity onPress={handleNext} activeOpacity={0.9}>
                <LinearGradient
                    colors={['#D946EF', '#A855F7']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>
                        {pageIndex === 2 ? "Start Matching" : "Get Started"}
                    </Text>
                    <View style={styles.iconCircle}>
                        <Feather name="arrow-right" size={20} color="#D946EF" />
                    </View>
                </LinearGradient>
            </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  // --- Layout ---
  pagerContainer: {
    flex: 0.6, // 60% height for image
  },
  pagerView: {
    flex: 1,
  },
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustrationContainer: {
    flex: 1,
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // --- Bottom Section ---
  bottomSection: {
    flex: 0.4, // 40% height for text/buttons
    paddingHorizontal: 20,
    paddingBottom: 20,
    justifyContent: 'space-between',
  },
  textWrapper: {
    marginTop: 20,
    height: 120, // Fixed height to prevent layout jumps during animation
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '##CB30E0', 
    fontFamily: 'FiraSans_800ExtraBold',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    fontFamily: 'FiraSans_400Regular',
    lineHeight: 24,
    fontWeight: '400',
  },
  
  // --- Footer Controls ---
  footer: {
    marginBottom: 20,
  },
  indicatorContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    height: 8,
    alignItems: 'center',
  },
  indicator: {
    height: 6,
    borderRadius: 3,
    marginRight: 8,
  },
  activeIndicator: {
    width: 32,
    backgroundColor: '#D946EF',
    height: 6,
  },
  inactiveIndicator: {
    width: 6,
    backgroundColor: '#E5E7EB',
    height: 6,
  },
  button: {
    flexDirection: 'row',
    height: 64, // Taller, more tappable button
    borderRadius: 32,
    alignItems: 'center',
    paddingLeft: 32,
    paddingRight: 8,
    justifyContent: 'space-between',
    // Shadow
    shadowColor: '#D946EF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  iconCircle: {
    width: 48,
    height: 48,
    backgroundColor: '#fff',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});