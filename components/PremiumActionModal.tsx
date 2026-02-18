import React, { useState, useRef, useEffect } from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { useAppDispatch } from '@/hooks/reduxHooks';
import { fetchAuthenticatedUser } from '@/redux/thunks/authActions';
import { updateUserInfo } from '@/redux/slices/authSlice';
import { useLoader } from '@/context/loader/LoaderProvider';
import Toast from '@/components/toast/toast';
import dayjs from 'dayjs';
import { TOKEN_KEY } from '@/constants/constants';
import { getItem } from '@/utils/asyncStorage';

interface PremiumActionModalProps {
    visible: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    title?: string;
    message?: string;
}

const PAYMENT_SUCCESS_URL = 'https://dazzzle.org/payment/success';
const PAYMENT_CANCEL_URL = 'https://dazzzle.org/payment/cancel';

export const PremiumActionModal: React.FC<PremiumActionModalProps> = ({
    visible,
    onClose,
    onSuccess,
    title = "Premium Feature",
    message = "This feature requires a premium subscription. Subscribe now to unlock it!",
}) => {
    const dispatch = useAppDispatch();
    const { show, hide } = useLoader();
    
    const [paymentUrl, setPaymentUrl] = useState<string>('');
    const [isVerifying, setIsVerifying] = useState(false);
    const webViewRef = useRef<WebView>(null);

    useEffect(() => {
        if (visible) {
            loadPaymentUrl();
        }
    }, [visible]);

    const loadPaymentUrl = async () => {
        try {
            const token = await getItem(TOKEN_KEY);
            if (token) {
                const url = `https://dazzzle.org/user/premium/subscription-gate?access_token=${token}`;
                setPaymentUrl(url);
            } else {
                Alert.alert('Error', 'Unable to load payment page. Please try logging in again.');
                onClose();
            }
        } catch (error) {
            console.error('Error loading payment URL:', error);
            Alert.alert('Error', 'Unable to load payment page. Please try again.');
            onClose();
        }
    };

    const verifyPaymentAndRoute = async () => {
        try {
            setIsVerifying(true);
            show();
            
            const result = await dispatch(fetchAuthenticatedUser()).unwrap();
            
            hide();
            setIsVerifying(false);
            
            const { user, userSubscription } = result;
            
            if (user) {
                dispatch(updateUserInfo(user));
            }
            
            if (user?.is_premium && userSubscription) {
                const isExpired = dayjs().isAfter(dayjs(userSubscription.expiry_at));
                
                if (!isExpired) {
                    Toast.success('Payment verified successfully!');
                    onClose();
                    if (onSuccess) {
                        onSuccess();
                    }
                } else {
                    Alert.alert(
                        'Subscription Expired',
                        'Your subscription has expired. Please select a plan to continue.',
                        [{ text: 'OK' }]
                    );
                }
            } else {
                Alert.alert(
                    'Payment Not Verified',
                    'We could not verify your payment. If you completed the payment, please contact support.',
                    [{ text: 'OK' }]
                );
            }
        } catch (error: any) {
            hide();
            setIsVerifying(false);
            console.error('Payment verification error:', error);
            Alert.alert(
                'Verification Error',
                'Unable to verify payment status. Please try again or contact support.',
                [{ text: 'OK' }]
            );
        }
    };

    const handleNavigationStateChange = async (navState: any) => {
        const { url } = navState;
        
        console.log('WebView URL changed:', url);
        
        if (url.includes(PAYMENT_SUCCESS_URL) || url.includes('success')) {
            console.log('Payment success URL detected, verifying...');
            setTimeout(async () => {
                await verifyPaymentAndRoute();
            }, 300);
        }
        
        if (url.includes(PAYMENT_CANCEL_URL) || url.includes('cancel') || url.includes('failed')) {
            console.log('Payment cancelled/failed URL detected');
            onClose();
            Alert.alert(
                'Payment Cancelled',
                'Your payment was not completed. Please try again.',
                [{ text: 'OK' }]
            );
        }
    };

    const handleClose = () => {
        onClose();
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="fullScreen"
            onRequestClose={handleClose}
        >
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Subscribe to Premium</Text>
                    <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                        <Text style={styles.closeButtonText}>✕</Text>
                    </TouchableOpacity>
                </View>
                
                {paymentUrl ? (
                    <WebView
                        ref={webViewRef}
                        source={{ uri: paymentUrl }}
                        onNavigationStateChange={handleNavigationStateChange}
                        startInLoadingState={true}
                        renderLoading={() => (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color="#DD3FE5" />
                                <Text style={styles.loadingText}>Loading payment page...</Text>
                            </View>
                        )}
                        onError={(syntheticEvent) => {
                            const { nativeEvent } = syntheticEvent;
                            console.error('WebView error:', nativeEvent);
                            Alert.alert('Error', 'Failed to load payment page. Please try again.');
                        }}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        originWhitelist={['*']}
                        mixedContentMode="always"
                    />
                ) : (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#DD3FE5" />
                        <Text style={styles.loadingText}>Preparing payment...</Text>
                    </View>
                )}
            </SafeAreaView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
    },
    closeButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F2F2F7',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonText: {
        fontSize: 20,
        color: '#000',
        fontWeight: '600',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 14,
        color: '#666',
    },
});
