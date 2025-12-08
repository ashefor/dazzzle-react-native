import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle, Dimensions } from 'react-native';
import SkeletonPlaceholder from './SkeletonLoader';

const { width: screenWidth } = Dimensions.get('window');

export default function ChatRoomSkeleton() {
    // number of message placeholders to show
    const messages = 8;
    const Skeleton = ({ style }: { style?: StyleProp<ViewStyle> }) => (
        <SkeletonPlaceholder
            style={StyleSheet.flatten([{ backgroundColor: '#F0F0F0' }, style])}
        />
    );

    return (
        <View style={styles.container}>

            {/* Message area */}
            <View style={styles.messages}>
                {Array.from({ length: messages }).map((_, i) => {
                    // alternate left/right bubbles and widths for variety
                    const isRight = i % 3 === 0;
                    const width = i % 2 === 0 ? screenWidth * 0.72 : screenWidth * 0.48;
                    const height = i % 4 === 0 ? 120 : 48; // occasionally show image-sized skeleton
                    return (
                        <View
                            key={i}
                            style={[
                                styles.msgWrapper,
                                isRight ? { alignSelf: 'flex-end' } : { alignSelf: 'flex-start' },
                            ]}
                        >
                            <Skeleton style={{ width, height, borderRadius: 16 }} />
                            <Skeleton style={styles.msgTime} />
                        </View>
                    );
                })}
            </View>

            {/* Input bar skeleton */}
            <View style={styles.inputRow}>
                <Skeleton style={styles.inputRound} />
                <Skeleton style={styles.inputField} />
                <Skeleton style={styles.sendBtn} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: 12, backgroundColor: '#fff' },


    messages: { flex: 1, paddingVertical: 8, paddingHorizontal: 16 },
    msgWrapper: { marginBottom: 16, maxWidth: '80%' },
    msgBubble: { backgroundColor: '#eee' },
    msgTime: { width: 64, height: 12, borderRadius: 8, marginTop: 8 },

    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#eee',
        paddingBottom: 24,
        backgroundColor: 'white',
        paddingHorizontal: 16
    },
    inputRound: { width: 36, height: 36, borderRadius: 18, marginRight: 8 },
    inputField: { flex: 1, height: 44, borderRadius: 22 },
    sendBtn: { width: 44, height: 44, borderRadius: 22, marginLeft: 8 },
});