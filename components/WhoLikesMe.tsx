import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { usePremiumAction } from '@/hooks/usePremiumAction';
import { PremiumActionModal } from './PremiumActionModal';
import UserList from './UserList';

const WhoLikesMe = () => {
    const { isPremium, showModal, setShowModal, requirePremium, modalOptions } = usePremiumAction();
    const [showUserList, setShowUserList] = useState(false);

    React.useEffect(() => {
        // Check account status on mount
        requirePremium(() => {
            setShowUserList(true);
        }, {
            title: 'See Who Likes You',
            message: 'Upgrade your account to see who has liked your profile!'
        });
    }, []);

    if (isPremium || showUserList) {
        return (
            <UserList 
                endpoint="/who-liked-me"
                showActionButton={false} // Read only
                emptyMessage="No one has liked you yet."
            />
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.lockContainer}>
                <Text style={styles.lockIcon}>🔒</Text>
                <Text style={styles.lockTitle}>Exclusive Feature</Text>
                <Text style={styles.lockMessage}>
                    See who has liked you by upgrading your account
                </Text>
                <TouchableOpacity 
                    style={styles.unlockButton}
                    onPress={() => {
                        requirePremium(() => {
                            setShowUserList(true);
                        }, {
                            title: 'See Who Likes You',
                            message: 'Upgrade your account to see who has liked your profile!'
                        });
                    }}
                >
                    <Text style={styles.unlockButtonText}>Unlock Now</Text>
                </TouchableOpacity>
            </View>
            
            <PremiumActionModal
                visible={showModal}
                onClose={() => setShowModal(false)}
                {...modalOptions}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    lockContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    lockIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    lockTitle: {
        fontSize: 24,
        fontFamily: 'Onest_700Bold',
        color: '#000',
        marginBottom: 8,
    },
    lockMessage: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 24,
        fontFamily: 'Onest_400Regular',
    },
    unlockButton: {
        backgroundColor: '#DD3FE5',
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderRadius: 24,
    },
    unlockButtonText: {
        fontSize: 16,
        fontFamily: 'Onest_600SemiBold',
        color: '#fff',
    },
});

export default WhoLikesMe;