import React from 'react';
import { View, StyleSheet } from 'react-native';
import SkeletonPlaceholder from './SkeletonLoader';
// Adjust this import to the real path of your Skeleton component if different

export default function ChatListsSkeleton() {
    const Skeleton = ({ style }: { style?: any }) => (
        <SkeletonPlaceholder
            style={StyleSheet.flatten([{ backgroundColor: '#F0F0F0' }, style])}
        />
    );
    // number of chat rows to show
    const rows = 6;

    return (
        <View style={styles.container}>
            {/* Search bar skeleton */}
            <Skeleton style={styles.searchSkeleton} />

            {/* Chat rows */}
            <View style={styles.list}>
                {Array.from({ length: rows }).map((_, i) => (
                    <View key={i} style={styles.row}>
                        {/* Avatar circle */}
                        <Skeleton style={styles.avatar} />

                        {/* Text column */}
                        <View style={styles.textCol}>
                            <Skeleton style={styles.nameLine} />
                            <Skeleton style={styles.statusLine} />
                        </View>

                        {/* Right-side time/badge */}
                        <View style={styles.rightCol}>
                            <Skeleton style={styles.timeLine} />
                            <Skeleton style={styles.badgeCircle} />
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { paddingHorizontal: 16, paddingTop: 12, backgroundColor: '#fff' },
    headerSkeleton: { width: 140, height: 34, borderRadius: 8, marginBottom: 16 },
    searchSkeleton: { width: '100%', height: 48, borderRadius: 16, marginBottom: 16 },

    list: { paddingBottom: 24 },

    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#eee',
    },
    avatar: { width: 44, height: 44, borderRadius: 22, marginRight: 12 },

    textCol: { flex: 1, justifyContent: 'center' },
    nameLine: { width: '60%', height: 16, borderRadius: 8, marginBottom: 8 },
    statusLine: { width: '40%', height: 12, borderRadius: 8 },

    rightCol: { width: 64, alignItems: 'flex-end', justifyContent: 'center' },
    timeLine: { width: 40, height: 12, borderRadius: 8, marginBottom: 8 },
    badgeCircle: { width: 28, height: 28, borderRadius: 14 },
});