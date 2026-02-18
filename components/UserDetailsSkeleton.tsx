import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SkeletonPlaceholder from './SkeletonLoader';
// Adjust the import path to where you saved your component


const { width } = Dimensions.get('window');
const HEADER_HEIGHT = 60;

export default function UserDetailsSkeleton() {
  const insets = useSafeAreaInsets();

  // Helper for consistent skeleton styling
  const Skeleton = ({ style }: { style?: any }) => (
    <SkeletonPlaceholder 
      style={StyleSheet.flatten([{ backgroundColor: '#F0F0F0' }, style])} 
    />
  );

  return (
    <View style={styles.container}>
      {/* --- CONTENT SKELETON --- */}
      <View style={[styles.contentPadding, { marginTop: 20 }]}>
        
        {/* Main Image */}
        <Skeleton style={{ width: '100%', height: Dimensions.get('screen').height * 0.35, borderRadius: 24, marginBottom: 20 }} />

        {/* Name & Age */}
        <Skeleton style={{ width: '70%', height: 32, borderRadius: 6, marginBottom: 10 }} />

        {/* Location */}
        <Skeleton style={{ width: '40%', height: 16, borderRadius: 4, marginBottom: 24 }} />

        {/* Tabs Switcher */}
        <Skeleton style={{ width: '100%', height: 48, borderRadius: 30, marginBottom: 24 }} />

        {/* --- TAB CONTENT (Simulating Basic Info) --- */}
        
        {/* Section 1: About Me */}
        <View style={styles.section}>
          <Skeleton style={{ width: 100, height: 20, borderRadius: 4, marginBottom: 12 }} />
          <Skeleton style={{ width: '100%', height: 14, borderRadius: 4, marginBottom: 8 }} />
          <Skeleton style={{ width: '95%', height: 14, borderRadius: 4, marginBottom: 8 }} />
          <Skeleton style={{ width: '80%', height: 14, borderRadius: 4, marginBottom: 8 }} />
        </View>

        {/* Section 2: Interests (Chips) */}
        <View style={styles.section}>
          <Skeleton style={{ width: 100, height: 20, borderRadius: 4, marginBottom: 12 }} />
          <View style={styles.chipRow}>
            <Skeleton style={{ width: 80, height: 32, borderRadius: 20 }} />
            <Skeleton style={{ width: 100, height: 32, borderRadius: 20 }} />
            <Skeleton style={{ width: 70, height: 32, borderRadius: 20 }} />
            <Skeleton style={{ width: 90, height: 32, borderRadius: 20 }} />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    height: HEADER_HEIGHT + 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  contentPadding: {
    paddingHorizontal: 14,
  },
  section: {
    marginBottom: 24,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
});