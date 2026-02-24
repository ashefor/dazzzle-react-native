import React, { useState, useRef, useEffect } from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
    Alert,
    Platform,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import * as WebBrowser from 'expo-web-browser';
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

const PAYMENT_SUCCESS_URL = 'https://dazzzle.org/user/premium/success';
const PAYMENT_CANCEL_URL = 'https://dazzzle.org/payment/cancel';
const UPGRADE_WEBSITE_URL = 'https://dazzzle.org/user/premium/subscription-gate';

// For optimal UX: Change your website to redirect to these deep links instead of HTTPS URLs:
// Success: 'dazzzle://payment/success' (browser will auto-close)
// Cancel:  'dazzzle://payment/cancel'  (browser will auto-close)
// Current: Website redirects to HTTPS URLs (user must tap 'Done' to close browser)

export const PremiumActionModal: React.FC<PremiumActionModalProps> = ({
    visible,
    onClose,
    onSuccess,
    title = "Upgrade Required",
    message = "Upgrade your account to unlock exclusive features and enhance your experience!",
}) => {
    const dispatch = useAppDispatch();
    const { show, hide } = useLoader();
    const isIOS = Platform.OS === 'ios';
    
    const [paymentUrl, setPaymentUrl] = useState<string>('');
    const [checkingStatus, setCheckingStatus] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const webViewRef = useRef<WebView>(null);

    useEffect(() => {
        // Only load payment URL for Android
        if (visible && !isIOS) {
            loadPaymentUrl();
        }
    }, [visible, isIOS]);

    const loadPaymentUrl = async () => {
        try {
            const token = await getItem(TOKEN_KEY);
            if (token) {
                const url = `https://dazzzle.org/user/premium/subscription-gate?access_token=${token}`;
                setPaymentUrl(url);
            } else {
                Alert.alert('Error', 'Unable to load upgrade page. Please try logging in again.');
                onClose();
            }
        } catch (error) {
            console.error('Error loading payment URL:', error);
            Alert.alert('Error', 'Unable to load upgrade page. Please try again.');
            onClose();
        }
    };

    const handleUpgradeOnWebsite = async () => {
        try {
            const token = await getItem(TOKEN_KEY);
            const url = token 
                ? `${UPGRADE_WEBSITE_URL}?access_token=${token}`
                : UPGRADE_WEBSITE_URL;
            
            // Open in SFSafariViewController (iOS) or Chrome Custom Tabs (Android)
            // This provides better UX while staying Apple-compliant
            // 
            // CURRENT: Website redirects to HTTPS URL -> user must tap "Done" to close
            // OPTIMAL: Website redirects to 'dazzzle://payment/success' -> auto-closes
            const result = await WebBrowser.openAuthSessionAsync(url, 'dazzzle://payment');
            
            console.log('WebBrowser result:', result);
            
            // Handle different result types
            if (result.type === 'success' && result.url) {
                // Website redirected to deep link (dazzzle://payment/*)
                // Browser auto-closed - this is the optimal flow
                const redirectUrl = result.url;
                console.log('Deep link redirect detected:', redirectUrl);
                
                if (redirectUrl.includes('success')) {
                    // Payment successful - verify account status
                    show();
                    await verifyPaymentAndRoute();
                } else if (redirectUrl.includes('cancel') || redirectUrl.includes('failed')) {
                    // Payment cancelled
                    Alert.alert(
                        'Upgrade Cancelled',
                        'Your upgrade was not completed. Please try again.',
                        [{ text: 'OK' }]
                    );
                } else {
                    // Unknown redirect - check account status to be safe
                    await checkAccountStatus();
                }
            } else {
                // User manually closed browser (current flow with HTTPS redirect)
                // Website navigated to HTTPS success page, user tapped "Done"
                console.log('Browser closed by user, checking account status...');
                await checkAccountStatus();
            }
        } catch (error) {
            console.error('Error opening browser:', error);
            Alert.alert('Error', 'Unable to open upgrade page. Please try again.');
        }
    };

    const checkAccountStatus = async () => {
        try {
            setCheckingStatus(true);
            const result = await dispatch(fetchAuthenticatedUser()).unwrap();

            
            const { user, userSubscription } = result;
            
            if (user) {
                dispatch(updateUserInfo(user));
            }
            console.log('Account status check result:', result);
            if (user?.is_premium && userSubscription) {
                const isExpired = dayjs().isAfter(dayjs(userSubscription.expiry_at));
                
                if (!isExpired) {
                    Toast.success('Account upgraded successfully!');
                    onClose();
                    if (onSuccess) {
                        onSuccess();
                    }
                } else {
                    Alert.alert(
                        'Account Status',
                        'Your access has expired. Please upgrade again to continue',
                        [{ text: 'OK' }]
                    );
                }
            } else {
                Alert.alert(
                    'Account Status',
                    'We could not verify your upgrade. If you completed it, please contact support.',
                    [{ text: 'OK' }]
                );
            }
        } catch (error: any) {
            console.error('Account verification error:', error);
            Alert.alert(
                'Verification Error',
                'Unable to verify account status. Please try again.',
                [{ text: 'OK' }]
            );
        } finally {
            setCheckingStatus(false);
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
                    Toast.success('Upgrade successful!');
                    onClose();
                    if (onSuccess) {
                        onSuccess();
                    }
                } else {
                    Alert.alert(
                        'Access Expired',
                        'Your access has expired. Please upgrade again to continue.',
                        [{ text: 'OK' }]
                    );
                }
            } else {
                Alert.alert(
                    'Upgrade Not Complete',
                    'We could not verify your upgrade. If you completed it, please contact support.',
                    [{ text: 'OK' }]
                );
            }
        } catch (error: any) {
            hide();
            setIsVerifying(false);
            console.error('Verification error:', error);
            Alert.alert(
                'Verification Error',
                'Unable to verify status. Please try again or contact support.',
                [{ text: 'OK' }]
            );
        }
    };

    const handleNavigationStateChange = async (navState: any) => {
        const { url } = navState;
        
        console.log('WebView URL changed:', url);
        
        if (url.includes(PAYMENT_SUCCESS_URL) || url.includes('success')) {
            console.log('Success URL detected, verifying...');
            setTimeout(async () => {
                await verifyPaymentAndRoute();
            }, 300);
        }
        
        if (url.includes(PAYMENT_CANCEL_URL) || url.includes('cancel') || url.includes('failed')) {
            console.log('Cancelled/failed URL detected');
            onClose();
            Alert.alert(
                'Upgrade Cancelled',
                'Your upgrade was not completed. Please try again.',
                [{ text: 'OK' }]
            );
        }
    };

    const handleClose = () => {
        onClose();
    };

    // iOS: Apple App Store guideline 3.1.1 prohibits in-app purchase flows for digital
    // content that use external payment processors. We show a neutral informational modal
    // only. Users who subscribed via dazzzle.org will have their premium status applied
    // automatically from the backend. No prices, no purchase buttons, no external purchase links.
    if (isIOS) {
        return (
            <Modal
                visible={visible}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={handleClose}
            >
                <SafeAreaView style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Premium Feature</Text>
                        <TouchableOpacity
                            disabled={checkingStatus || isVerifying}
                            onPress={handleClose}
                            style={styles.closeButton}
                        >
                            <Text style={styles.closeButtonText}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
                        <View style={styles.iconContainer}>
                            <Text style={styles.upgradeIcon}>⭐</Text>
                        </View>

                        <Text style={styles.messageTitle}>Premium Members Only</Text>
                        <Text style={styles.message}>
                            This feature is available to premium members. Manage your membership at dazzzle.org.
                        </Text>

                        <View style={styles.featuresContainer}>
                            <Text style={styles.featuresTitle}>Premium includes:</Text>
                            <View style={styles.featureItem}>
                                <Text style={styles.bulletPoint}>•</Text>
                                <Text style={styles.featureText}>Unlimited likes and connections</Text>
                            </View>
                            <View style={styles.featureItem}>
                                <Text style={styles.bulletPoint}>•</Text>
                                <Text style={styles.featureText}>See who likes you</Text>
                            </View>
                            <View style={styles.featureItem}>
                                <Text style={styles.bulletPoint}>•</Text>
                                <Text style={styles.featureText}>Send unlimited messages</Text>
                            </View>
                            <View style={styles.featureItem}>
                                <Text style={styles.bulletPoint}>•</Text>
                                <Text style={styles.featureText}>Access to advanced filters</Text>
                            </View>
                            <View style={styles.featureItem}>
                                <Text style={styles.bulletPoint}>•</Text>
                                <Text style={styles.featureText}>Priority support</Text>
                            </View>
                        </View>

                        <View style={styles.buttonContainer}>
                            {checkingStatus || isVerifying ? (
                                <View style={styles.checkStatusButton}>
                                    <ActivityIndicator size="small" color="#DD3FE5" />
                                </View>
                            ) : (
                                <TouchableOpacity onPress={checkAccountStatus} style={styles.checkStatusButton}>
                                    <Text style={styles.checkStatusText}>
                                        Already a member? Tap to verify
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </Modal>
        );
    }

    // Android: In-app payment flow with WebView
    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="fullScreen"
            onRequestClose={handleClose}
        >
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Upgrade Account</Text>
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
                                <Text style={styles.loadingText}>Loading upgrade page...</Text>
                            </View>
                        )}
                        onError={(syntheticEvent) => {
                            const { nativeEvent } = syntheticEvent;
                            console.error('WebView error:', nativeEvent);
                            Alert.alert('Error', 'Failed to load upgrade page. Please try again.');
                        }}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        originWhitelist={['*']}
                        mixedContentMode="always"
                    />
                ) : (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#DD3FE5" />
                        <Text style={styles.loadingText}>Preparing upgrade...</Text>
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
        color: '#000',
        fontFamily: 'Onest_600SemiBold'
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
    content: {
        flex: 1,
    },
    contentContainer: {
        padding: 24,
        paddingBottom: 40,
    },
    iconContainer: {
        alignItems: 'center',
        marginVertical: 6,
    },
    upgradeIcon: {
        fontSize: 64,
    },
    messageTitle: {
        fontSize: 24,
        fontFamily: 'Onest_700Bold',
        color: '#000',
        textAlign: 'center',
        marginBottom: 12,
    },
    message: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 24,
        fontFamily: 'Onest_400Regular',
    },
    featuresContainer: {
        marginBottom: 32,
        backgroundColor: '#F9F9F9',
        borderRadius: 12,
        padding: 20,
    },
    featuresTitle: {
        fontSize: 18,
        fontFamily: 'Onest_600SemiBold',
        color: '#000',
        marginBottom: 16,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    bulletPoint: {
        fontSize: 18,
        color: '#DD3FE5',
        marginRight: 12,
        fontFamily: 'Onest_700Bold'
    },
    featureText: {
        fontSize: 15,
        color: '#333',
        flex: 1,
        lineHeight: 22,
        fontFamily: 'Onest_400Regular',
    },
    buttonContainer: {
        marginBottom: 20,
    },
    upgradeButton: {
        marginBottom: 12,
    },
    checkStatusButton: {
        paddingVertical: 12,
        alignItems: 'center',
    },
    checkStatusText: {
        fontSize: 15,
        color: '#DD3FE5',
        fontFamily: 'Onest_600SemiBold',
    },
    footerNote: {
        fontSize: 13,
        color: '#999',
        textAlign: 'center',
        fontStyle: 'italic',
        fontFamily: 'Onest_400Regular',
        lineHeight: 20,
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
        fontFamily: 'Onest_400Regular',
    },
});
