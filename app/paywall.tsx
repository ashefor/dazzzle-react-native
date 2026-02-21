import CustomButton from "@/components/CustomButton";
import Toast from "@/components/toast/toast";
import { API_URL, TOKEN_KEY } from "@/constants/constants";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { ReactionCodes } from "@/models/general";
import { CreatePaystackOrderResponse, CreditPlan, PremiumFeature, PremiumFeatureType, SubscriptionResponse } from "@/models/subscription";
import { signUserOut, fetchAuthenticatedUser } from "@/redux/thunks/authActions";
import axiosRequest from "@/utils/axios";
import dayjs from "dayjs";
import { router } from "expo-router";
import { useEffect, useState, useRef } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Modal, StyleSheet } from "react-native";
// import { usePaystack } from 'react-native-paystack-webview';
import { SafeAreaView } from "react-native-safe-area-context";
import { useLoader } from '@/context/loader/LoaderProvider';
import * as WebBrowser from 'expo-web-browser';
import { WebView } from 'react-native-webview';
import { updateUserInfo } from "@/redux/slices/authSlice";
import { handlePermissionNavigation } from "@/utils/notificationHandler";
import { getItem } from "@/utils/asyncStorage";

const defaultCreditPlans = [
    {
        "_id": 3,
        "_uid": "9a4d25be-7e3a-4d4e-bce9-66629e12c7a1",
        "created_at": "2024-06-10T15:08:20.000000Z",
        "updated_at": "2024-07-08T12:07:45.000000Z",
        "status": 1,
        "title": "One Week Subscription",
        "credits": 1000,
        "price": "1000.0000",
        "image": "1000.jpg",
        "is_subscription_package": 1,
        "users__id": 1
    },
    {
        "_id": 4,
        "_uid": "ee88daa5-9d7e-431d-9bd3-ff45c34a1ad8",
        "created_at": "2024-06-10T15:20:38.000000Z",
        "updated_at": "2024-07-08T12:07:22.000000Z",
        "status": 1,
        "title": "One Month Subscription",
        "credits": 2000,
        "price": "2000.0000",
        "image": "2000.jpg",
        "is_subscription_package": 1,
        "users__id": 1
    }
]

const PayWallScreen = () => {
    // const { popup } = usePaystack();
    const dispatch = useAppDispatch();
    const { show, hide } = useLoader();
    const { userInfo } = useAppSelector(state => state.auth);
    const { currentSubscription, } = useAppSelector(state => state.subscription);
    const [premiumfeatures, setPremiumFeatures] = useState<string[]>([]);
    const [creditPlans, setCreditPlans] = useState<CreditPlan[]>(defaultCreditPlans);
    const [selectedCreditPlan, setSelectedCreditPlan] = useState<CreditPlan | null>(null);
    const [checking, setChecking] = useState(false);
    
    // WebView states
    const [showPaymentWebView, setShowPaymentWebView] = useState(false);
    const [paymentUrl, setPaymentUrl] = useState<string>('');
    const [isVerifying, setIsVerifying] = useState(false);
    const webViewRef = useRef<WebView>(null);
    
    // URL that indicates successful payment - CUSTOMIZE THIS TO YOUR PAYMENT SUCCESS URL
    const PAYMENT_SUCCESS_URL = 'https://dazzzle.org/payment/success';
    const PAYMENT_CANCEL_URL = 'https://dazzzle.org/payment/cancel';

    const processPaystackPayment = (response: CreatePaystackOrderResponse) => {
        // popup.checkout({
        //     email: response.email || '',
        //     amount: Number(response.amount) / 100,
        //     reference: response.reference,
        //     metadata: {
        //         custom_fields: response
        //     },
        //     onSuccess: (res) => verifyPaystackPayment(res),
        //     onCancel: () => console.log('User cancelled'),
        //     onLoad: (res) => console.log('WebView Loaded:', res),
        //     onError: (err) => console.log('WebView Error:', err)
        // });
    };

    const handleLogOut = async () => {
        show();
        await dispatch(signUserOut()).unwrap();
        hide();
        router.replace('/(auth)/sign-in');
    }

    /**
     * Verifies the user's payment status by fetching updated user details
     * and routes based on whether they have an active premium subscription
     */
    const verifyPaymentAndRoute = async () => {
        try {
            setIsVerifying(true);
            show();
            
            // Fetch updated user information including subscription status
            const result = await dispatch(fetchAuthenticatedUser()).unwrap();
            
            hide();
            setIsVerifying(false);
            
            const { user, userSubscription } = result;
            
            // Update user info in state
            if (user) {
                dispatch(updateUserInfo(user));
            }
            
            // Check if user has active premium subscription
            if (user?.is_premium && userSubscription) {
                const isExpired = dayjs().isAfter(dayjs(userSubscription.expiry_at));
                
                if (!isExpired) {
                    // User has valid premium subscription
                    Toast.success('Payment verified successfully!');
                    await handlePermissionNavigation('/(tabs)', '/app-permissions');
                } else {
                    // Subscription expired
                    Alert.alert(
                        'Subscription Expired',
                        'Your subscription has expired. Please select a plan to continue.',
                        [{ text: 'OK' }]
                    );
                }
            } else {
                // User is not premium or payment not verified
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

    /**
     * Scenario 1: Handle manual close of the payment WebView
     * Verifies payment status when user closes the browser
     */
    const handleWebViewClose = async () => {
        setShowPaymentWebView(false);
        
        // Give a small delay to ensure UI updates smoothly
        setTimeout(async () => {
            await verifyPaymentAndRoute();
        }, 300);
    };

    /**
     * Scenario 2: Handle URL changes in the WebView
     * Auto-closes when payment success URL is detected
     */
    const handleNavigationStateChange = async (navState: any) => {
        const { url } = navState;
        
        console.log('WebView URL changed:', url);
        
        // Check if URL matches the success URL
        if (url.includes(PAYMENT_SUCCESS_URL) || url.includes('success')) {
            console.log('Payment success URL detected, closing WebView...');
            
            // Close WebView automatically
            setShowPaymentWebView(false);
            
            // Verify payment and route
            setTimeout(async () => {
                await verifyPaymentAndRoute();
            }, 300);
        }
        
        // Optionally handle cancel/failure URL
        if (url.includes(PAYMENT_CANCEL_URL) || url.includes('cancel') || url.includes('failed')) {
            console.log('Payment cancelled/failed URL detected');
            setShowPaymentWebView(false);
            
            Alert.alert(
                'Payment Cancelled',
                'Your payment was not completed. Please try again.',
                [{ text: 'OK' }]
            );
        }
    };

    const fetchSubscriptionDetails = async () => {
        try {
            show();
            const data: any = await axiosRequest.get(API_URL + '/premium-plan/premium-plan-data');
            hide();
            const reaction = data.reaction;
            const responseData = data.data;
            if (reaction === ReactionCodes.SUCCESS) {
                const premiumPlanData = responseData['premiumPlanData'] as SubscriptionResponse;
                const premiumFeature = premiumPlanData.premiumFeature;
                const creditPlans = premiumPlanData.creditPlans;
                const premiumFeatureStrings = convertObjectToArrayOfStrings(premiumFeature);
                setPremiumFeatures(premiumFeatureStrings);
                // if (currentSubscription) {
                //     setCreditPlans(creditPlans.filter((creditPlan) => creditPlan.credits !== 0));
                // } else {
                //     setCreditPlans(creditPlans);
                // }
                // setCreditPlans(creditPlans)
                setCreditPlans(creditPlans.filter((creditPlan) => creditPlan.credits !== 0))

            }
        } catch (error: any) {
            hide();
            Alert.alert('Error', error.errorMessage ? error.errorMessage : 'Unable to fetch subscription details');
        }
    }

    useEffect(() => {
        const init = async () => {
            if (currentSubscription) {
                if (dayjs().isAfter(dayjs(currentSubscription.expiry_at))) {
                    fetchSubscriptionDetails();
                } else {
                    setChecking(true);
                    await handlePermissionNavigation('/(tabs)', '/app-permissions');
                    setChecking(false);
                }
            } else {
                fetchSubscriptionDetails();
            }
        }
        init();
    }, [])

    const formatAsCurrency = (amount: string) => {
        return Number(amount).toLocaleString('en-US', { style: 'currency', currency: 'NGN' });
    }

    const convertObjectToArrayOfStrings = (obj: PremiumFeature) => {
        return Object.values(obj).filter((value: PremiumFeatureType) => value.enable).map((value: PremiumFeatureType) => value.title) || [];
    }

    const payPlanFromWallet = async () => {
        try {
            const params = {
                "selectedPlan": { "select_plan": "one_day" }
            }
            show();
            const data: any = await axiosRequest.post(API_URL + '/premium-plan/buy-plans', params);
            hide();
            if (data.reaction === ReactionCodes.SUCCESS) {
                if (userInfo) {
                    dispatch(updateUserInfo({ ...userInfo, is_premium: true }));
                }
                Toast.success('Subscription successful');
                await handlePermissionNavigation('/(tabs)', '/app-permissions');
            }
        } catch (error: any) {
            hide();
            Alert.alert('Error', error.errorMessage ? error.errorMessage : 'Unable to buy plan');
        }
    }

    const openPrivacyPolicy = async () => {
        await WebBrowser.openBrowserAsync('https://dazzzle.org/privacy-policy');
    };

    const createPaystackOrder = async () => {
        try {
            if (selectedCreditPlan?.credits === 0) {
                payPlanFromWallet();
            } else {
                const params = {
                    packagePrice: selectedCreditPlan?.price,
                    packageUid: selectedCreditPlan?._uid,
                    packageName: selectedCreditPlan?.title,
                    select_payment_method: "paystack-checkout"
                }
                show();
                const data = await axiosRequest.post(API_URL + '/premium-plan/capture-paystack-order', params);
                hide();
                const responseData = data.data as CreatePaystackOrderResponse;
                
                if (responseData && responseData.reference) {
                    // Construct the payment URL - CUSTOMIZE THIS URL TO YOUR PAYMENT PAGE
                    // Example: You might want to redirect to your payment gateway with the order reference
                    const paymentPageUrl = `https://dazzzle.org/user/premium/subscription-gate`;
                    const access_token = await getItem(TOKEN_KEY);
                    console.log('Redirecting to payment page:', paymentPageUrl, 'with reference:', access_token);
                    const paymentPageUrlWithAuth = `${paymentPageUrl}?access_token=${access_token}`;
                    // Set the payment URL and show WebView
                    setPaymentUrl(paymentPageUrlWithAuth);
                    setShowPaymentWebView(true);
                    
                    // Alternative: If you want to keep using Paystack's inline popup, uncomment below:
                    // processPaystackPayment(responseData);
                }
            }
        } catch (error: any) {
            hide();
            Alert.alert('Error', error.errorMessage ? error.errorMessage : 'Failed to create payment order');
        }
    }

    const verifyPaystackPayment = async (response: any) => {
        try {
            show();
            const data: any = await axiosRequest.post(API_URL + '/premium-plan/paystack-order-submit', { response });
            hide();

            if (data.reaction === ReactionCodes.SUCCESS) {
                if (userInfo) {
                    const updatedUser = {
                        ...userInfo,
                        is_premium: true
                    };

                    dispatch(updateUserInfo(updatedUser));
                }

                Toast.success('Subscription successful');
                await handlePermissionNavigation('/(tabs)', '/app-permissions');
            }
        } catch (error: any) {
            hide();
            Alert.alert('Error', error.errorMessage ? error.errorMessage : 'Failed to verify payment');
        }
    }

    return (
        <SafeAreaView className=' bg-white flex-1'>
            <ScrollView className='flex-1' contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
               {checking ? (
                <View className="flex-1 justify-center items-center">
                    <View className='flex-row items-center justify-center mb-6'>
                                          <Image source={require('@/assets/images/logo.png')} style={{ width: 48, height: 48, tintColor: '#DD3FE5' }} resizeMode='contain' />
                                          <Text className='text-3xl text-primary' style={{
                                            fontFamily: "LilitaOne_400Regular",
                                          }}>dazzzle</Text>
                                        </View>
                    <ActivityIndicator size="large" color="#DD3FE5" />
                    <Text className="text-sm font-medium text-gray-700 mt-6">Checking your active subscription...</Text>
                </View>
               ) : (
                 <View className="w-full justify-center px-4 my-6 py-10">
                    <View className='flex-row items-center justify-center mb-4'>
                                          <Image source={require('@/assets/images/logo.png')} style={{ width: 48, height: 48, tintColor: '#DD3FE5' }} resizeMode='contain' />
                                          <Text className='text-3xl text-primary' style={{
                                            fontFamily: "LilitaOne_400Regular",
                                          }}>dazzzle</Text>
                                        </View>
                    <Text className="text-black-200 text-2xl font-firabold text-center">Choose your plan</Text>
                    <Text className="text-black-200 text-base font-firamedium text-center underline underline-offset-8 underline-tertiary">Unlock Premium Features</Text>
                    {premiumfeatures && (
                        <View className="space-y-3 my-7">
                            {premiumfeatures.map((feature, index) => (
                                <View key={index} className="flex flex-row items-center justify-start pl-5">
                                    <View className="w-1 h-1 bg-tertiary rounded-full mr-1" />
                                    <Text className="text-black-200 text-sm">{feature}</Text>
                                </View>
                            ))}
                        </View>
                    )}
                    <View className="space-y-4 mb-10">
                        {creditPlans.map((creditPlan, index) => (
                            <TouchableOpacity onPress={() => setSelectedCreditPlan(creditPlan)} key={creditPlan._uid} className={`p-4 bg-[#F2F2F7] rounded-lg ${selectedCreditPlan?._uid === creditPlan._uid ? 'bg-tertiary' : ''}`}>
                                <Text className="text-black-200 text-base font-firamedium text-center">{creditPlan.title}</Text>
                                <Text className="text-black-200 text-sm text-center font-firabold">{formatAsCurrency(creditPlan.price)}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <CustomButton disabled={!selectedCreditPlan} title={`Subscribe ${selectedCreditPlan ? 'for ' + formatAsCurrency(selectedCreditPlan.price) : ''}`} handlePress={createPaystackOrder} />
                    <View className="flex flex-wrap flex-1 flex-row gap-1 mt-3 mb-5 items-center justify-center">
                        <Text className="text-black-200 text-xs text-center">
                            By subscribing, you agree to our
                        </Text>
                        <TouchableOpacity onPress={openPrivacyPolicy}>
                            <Text className="text-primary text-xs text-center">
                                Terms of Service and Privacy Policy.
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View className='justify-center pt-5 flex-row gap-2'>
                        <TouchableOpacity onPress={() => handleLogOut()}>
                            <Text className='text-sm text-primary font-firaregular underline'>Log Out</Text>
                        </TouchableOpacity>

                    </View>
                </View>
               )}
            </ScrollView>
            
            {/* Payment WebView Modal */}
            <Modal
                visible={showPaymentWebView}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={handleWebViewClose}
            >
                <SafeAreaView style={styles.webViewContainer}>
                    {/* Header with close button */}
                    <View style={styles.webViewHeader}>
                        <Text style={styles.webViewTitle}>Complete Payment</Text>
                        <TouchableOpacity 
                            onPress={handleWebViewClose}
                            style={styles.closeButton}
                        >
                            <Text style={styles.closeButtonText}>✕</Text>
                        </TouchableOpacity>
                    </View>
                    
                    {/* WebView */}
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
                            onHttpError={(syntheticEvent) => {
                                const { nativeEvent } = syntheticEvent;
                                console.error('WebView HTTP error:', nativeEvent.statusCode);
                            }}
                            // Allow JavaScript
                            javaScriptEnabled={true}
                            domStorageEnabled={true}
                            // Security settings
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
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    webViewContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    webViewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
        backgroundColor: '#fff',
    },
    webViewTitle: {
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

export default PayWallScreen;