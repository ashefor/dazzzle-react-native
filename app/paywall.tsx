// import CustomButton from "@/components/CustomButton";
// import Toast from "@/components/toast/toast";
// import { API_URL } from "@/constants/constants";
// import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
// import { ReactionCodes } from "@/models/general";
// import { CreatePaystackOrderResponse, CreditPlan, PremiumFeature, PremiumFeatureType, SubscriptionResponse } from "@/models/subscription";
// import { signUserOut } from "@/redux/thunks/authActions";
// import axiosRequest from "@/utils/axios";
// import dayjs from "dayjs";
// import { router } from "expo-router";
// import { useEffect, useState } from "react";
// import { View, Text, Image, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
// import { usePaystack } from 'react-native-paystack-webview';
// import { SafeAreaView } from "react-native-safe-area-context";
// import { useLoader } from '@/context/loader/LoaderProvider';
// import * as WebBrowser from 'expo-web-browser';
// import { updateUserInfo } from "@/redux/slices/authSlice";
// import { handlePermissionNavigation } from "@/utils/notificationHandler";

// const defaultCreditPlans = [
//     {
//         "_id": 3,
//         "_uid": "9a4d25be-7e3a-4d4e-bce9-66629e12c7a1",
//         "created_at": "2024-06-10T15:08:20.000000Z",
//         "updated_at": "2024-07-08T12:07:45.000000Z",
//         "status": 1,
//         "title": "One Week Subscription",
//         "credits": 1000,
//         "price": "1000.0000",
//         "image": "1000.jpg",
//         "is_subscription_package": 1,
//         "users__id": 1
//     },
//     {
//         "_id": 4,
//         "_uid": "ee88daa5-9d7e-431d-9bd3-ff45c34a1ad8",
//         "created_at": "2024-06-10T15:20:38.000000Z",
//         "updated_at": "2024-07-08T12:07:22.000000Z",
//         "status": 1,
//         "title": "One Month Subscription",
//         "credits": 2000,
//         "price": "2000.0000",
//         "image": "2000.jpg",
//         "is_subscription_package": 1,
//         "users__id": 1
//     }
// ]

// const PayWallScreen = () => {
//     const { popup } = usePaystack();
//     const dispatch = useAppDispatch();
//     const { show, hide } = useLoader();
//     const { userInfo } = useAppSelector(state => state.auth);
//     const { currentSubscription, } = useAppSelector(state => state.subscription);
//     const [premiumfeatures, setPremiumFeatures] = useState<string[]>([]);
//     const [creditPlans, setCreditPlans] = useState<CreditPlan[]>(defaultCreditPlans);
//     const [selectedCreditPlan, setSelectedCreditPlan] = useState<CreditPlan | null>(null);
//     const [checking, setChecking] = useState(false);

//     const processPaystackPayment = (response: CreatePaystackOrderResponse) => {
//         popup.checkout({
//             email: response.email || '',
//             amount: Number(response.amount) / 100,
//             reference: response.reference,
//             metadata: {
//                 custom_fields: response
//             },
//             onSuccess: (res) => verifyPaystackPayment(res),
//             onCancel: () => console.log('User cancelled'),
//             onLoad: (res) => console.log('WebView Loaded:', res),
//             onError: (err) => console.log('WebView Error:', err)
//         });
//     };

//     const handleLogOut = async () => {
//         show();
//         await dispatch(signUserOut()).unwrap();
//         hide();
//         router.replace('/(auth)/sign-in');
//     }

//     const fetchSubscriptionDetails = async () => {
//         try {
//             show();
//             const data: any = await axiosRequest.get(API_URL + '/premium-plan/premium-plan-data');
//             hide();
//             const reaction = data.reaction;
//             const responseData = data.data;
//             if (reaction === ReactionCodes.SUCCESS) {
//                 const premiumPlanData = responseData['premiumPlanData'] as SubscriptionResponse;
//                 const premiumFeature = premiumPlanData.premiumFeature;
//                 const creditPlans = premiumPlanData.creditPlans;
//                 const premiumFeatureStrings = convertObjectToArrayOfStrings(premiumFeature);
//                 setPremiumFeatures(premiumFeatureStrings);
//                 // if (currentSubscription) {
//                 //     setCreditPlans(creditPlans.filter((creditPlan) => creditPlan.credits !== 0));
//                 // } else {
//                 //     setCreditPlans(creditPlans);
//                 // }
//                 // setCreditPlans(creditPlans)
//                 setCreditPlans(creditPlans.filter((creditPlan) => creditPlan.credits !== 0))

//             }
//         } catch (error: any) {
//             hide();
//             Alert.alert('Error', error.errorMessage ? error.errorMessage : 'Unable to fetch subscription details');
//         }
//     }

//     useEffect(() => {
//         const init = async () => {
//             if (currentSubscription) {
//                 if (dayjs().isAfter(dayjs(currentSubscription.expiry_at))) {
//                     fetchSubscriptionDetails();
//                 } else {
//                     setChecking(true);
//                     await handlePermissionNavigation('/(tabs)', '/app-permissions');
//                     setChecking(false);
//                 }
//             } else {
//                 fetchSubscriptionDetails();
//             }
//         }
//         init();
//     }, [])

//     const formatAsCurrency = (amount: string) => {
//         return Number(amount).toLocaleString('en-US', { style: 'currency', currency: 'NGN' });
//     }

//     const convertObjectToArrayOfStrings = (obj: PremiumFeature) => {
//         return Object.values(obj).filter((value: PremiumFeatureType) => value.enable).map((value: PremiumFeatureType) => value.title) || [];
//     }

//     const payPlanFromWallet = async () => {
//         try {
//             const params = {
//                 "selectedPlan": { "select_plan": "one_day" }
//             }
//             show();
//             const data: any = await axiosRequest.post(API_URL + '/premium-plan/buy-plans', params);
//             hide();
//             if (data.reaction === ReactionCodes.SUCCESS) {
//                 if (userInfo) {
//                     dispatch(updateUserInfo({ ...userInfo, is_premium: true }));
//                 }
//                 Toast.success('Subscription successful');
//                 await handlePermissionNavigation('/(tabs)', '/app-permissions');
//             }
//         } catch (error: any) {
//             hide();
//             Alert.alert('Error', error.errorMessage ? error.errorMessage : 'Unable to buy plan');
//         }
//     }

//     const openPrivacyPolicy = async () => {
//         await WebBrowser.openBrowserAsync('https://dazzzle.org/privacy-policy');
//     };

//     const createPaystackOrder = async () => {
//         try {
//             if (selectedCreditPlan?.credits === 0) {
//                 payPlanFromWallet();
//             } else {
//                 const params = {
//                     packagePrice: selectedCreditPlan?.price,
//                     packageUid: selectedCreditPlan?._uid,
//                     packageName: selectedCreditPlan?.title,
//                     select_payment_method: "paystack-checkout"
//                 }
//                 show();
//                 const data = await axiosRequest.post(API_URL + '/premium-plan/capture-paystack-order', params);
//                 hide();
//                 const responseData = data.data as CreatePaystackOrderResponse;
//                 if (responseData && responseData.reference) {
//                     processPaystackPayment(responseData);
//                 }
//             }
//         } catch (error: any) {
//             hide();
//             Alert.alert('Error', error.errorMessage ? error.errorMessage : 'Failed to log in');
//         }
//     }

//     const verifyPaystackPayment = async (response: any) => {
//         try {
//             show();
//             const data: any = await axiosRequest.post(API_URL + '/premium-plan/paystack-order-submit', { response });
//             hide();

//             if (data.reaction === ReactionCodes.SUCCESS) {
//                 if (userInfo) {
//                     const updatedUser = {
//                         ...userInfo,
//                         is_premium: true
//                     };

//                     dispatch(updateUserInfo(updatedUser));
//                 }

//                 Toast.success('Subscription successful');
//                 await handlePermissionNavigation('/(tabs)', '/app-permissions');
//             }
//         } catch (error: any) {
//             hide();
//             Alert.alert('Error', error.errorMessage ? error.errorMessage : 'Failed to verify payment');
//         }
//     }

//     return (
//         <SafeAreaView className=' bg-white flex-1'>
//             <ScrollView className='flex-1' contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
//                {checking ? (
//                 <View className="flex-1 justify-center items-center">
//                     <View className='flex-row items-center justify-center mb-6'>
//                                           <Image source={require('@/assets/images/logo.png')} style={{ width: 48, height: 48, tintColor: '#DD3FE5' }} resizeMode='contain' />
//                                           <Text className='text-3xl text-primary' style={{
//                                             fontFamily: "LilitaOne_400Regular",
//                                           }}>dazzzle</Text>
//                                         </View>
//                     <ActivityIndicator size="large" color="#DD3FE5" />
//                     <Text className="text-sm font-medium text-gray-700 mt-6">Checking your active subscription...</Text>
//                 </View>
//                ) : (
//                  <View className="w-full justify-center px-4 my-6 py-10">
//                     <View className='flex-row items-center justify-center mb-4'>
//                                           <Image source={require('@/assets/images/logo.png')} style={{ width: 48, height: 48, tintColor: '#DD3FE5' }} resizeMode='contain' />
//                                           <Text className='text-3xl text-primary' style={{
//                                             fontFamily: "LilitaOne_400Regular",
//                                           }}>dazzzle</Text>
//                                         </View>
//                     <Text className="text-black-200 text-2xl font-firabold text-center">Choose your plan</Text>
//                     <Text className="text-black-200 text-base font-firamedium text-center underline underline-offset-8 underline-tertiary">Unlock Premium Features</Text>
//                     {premiumfeatures && (
//                         <View className="space-y-3 my-7">
//                             {premiumfeatures.map((feature, index) => (
//                                 <View key={index} className="flex flex-row items-center justify-start pl-5">
//                                     <View className="w-1 h-1 bg-tertiary rounded-full mr-1" />
//                                     <Text className="text-black-200 text-sm">{feature}</Text>
//                                 </View>
//                             ))}
//                         </View>
//                     )}
//                     <View className="space-y-4 mb-10">
//                         {creditPlans.map((creditPlan, index) => (
//                             <TouchableOpacity onPress={() => setSelectedCreditPlan(creditPlan)} key={creditPlan._uid} className={`p-4 bg-[#F2F2F7] rounded-lg ${selectedCreditPlan?._uid === creditPlan._uid ? 'bg-tertiary' : ''}`}>
//                                 <Text className="text-black-200 text-base font-firamedium text-center">{creditPlan.title}</Text>
//                                 <Text className="text-black-200 text-sm text-center font-firabold">{formatAsCurrency(creditPlan.price)}</Text>
//                             </TouchableOpacity>
//                         ))}
//                     </View>
//                     <CustomButton disabled={!selectedCreditPlan} title={`Subscribe ${selectedCreditPlan ? 'for ' + formatAsCurrency(selectedCreditPlan.price) : ''}`} handlePress={createPaystackOrder} />
//                     <View className="flex flex-wrap flex-1 flex-row gap-1 mt-3 mb-5 items-center justify-center">
//                         <Text className="text-black-200 text-xs text-center">
//                             By subscribing, you agree to our
//                         </Text>
//                         <TouchableOpacity onPress={openPrivacyPolicy}>
//                             <Text className="text-primary text-xs text-center">
//                                 Terms of Service and Privacy Policy.
//                             </Text>
//                         </TouchableOpacity>
//                     </View>
//                     <View className='justify-center pt-5 flex-row gap-2'>
//                         <TouchableOpacity onPress={() => handleLogOut()}>
//                             <Text className='text-sm text-primary font-firaregular underline'>Log Out</Text>
//                         </TouchableOpacity>

//                     </View>
//                 </View>
//                )}
//             </ScrollView>
//         </SafeAreaView>
//     )
// }

// export default PayWallScreen;

import CustomButton from "@/components/CustomButton";
import Toast from "@/components/toast/toast";
import { API_URL, IAP_PRODUCT_TO_PLAN_UID } from "@/constants/constants";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { ReactionCodes } from "@/models/general";
import {
  CreatePaystackOrderResponse,
  CreditPlan,
  PremiumFeature,
  PremiumFeatureType,
  SubscriptionResponse,
} from "@/models/subscription";
import axiosRequest from "@/utils/axios";
import dayjs from "dayjs";
import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text, ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform
} from "react-native";
import { router } from "expo-router";
import { signUserOut } from "@/redux/thunks/authActions";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLoader } from "@/context/loader/LoaderProvider";
import * as WebBrowser from "expo-web-browser";
import { updateUserInfo } from "@/redux/slices/authSlice";
import { handlePermissionNavigation } from "@/utils/notificationHandler";
import { useIAPContext } from "@/context/IAPProvider";
import { resetIAP } from "@/redux/slices/iapSlice";
import type { Product } from "expo-iap";
import { usePaystack } from "react-native-paystack-webview";

// ─── Default plan data (used while API loads) ─────────────────────────────────

const defaultCreditPlans: CreditPlan[] = [
  {
    _id: 3,
    _uid: "9a4d25be-7e3a-4d4e-bce9-66629e12c7a1",
    created_at: "2024-06-10T15:08:20.000000Z",
    updated_at: "2024-07-08T12:07:45.000000Z",
    status: 1,
    title: "One Week Subscription",
    credits: 1000,
    price: "1000.0000",
    image: "1000.jpg",
    is_subscription_package: 1,
    users__id: 1,
  },
  {
    _id: 4,
    _uid: "ee88daa5-9d7e-431d-9bd3-ff45c34a1ad8",
    created_at: "2024-06-10T15:20:38.000000Z",
    updated_at: "2024-07-08T12:07:22.000000Z",
    status: 1,
    title: "One Month Subscription",
    credits: 2000,
    price: "2000.0000",
    image: "2000.jpg",
    is_subscription_package: 1,
    users__id: 1,
  },
];

const defaultPremiumFeatures: string[] = [
  "Unlimited Likes",
  "See Who Likes You",
  "Boost Your Profile",
  "Notifications for New Matches",
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatAsCurrency = (amount: string) =>
  Number(amount).toLocaleString("en-US", { style: "currency", currency: "NGN" });

const convertFeaturesToStrings = (obj: PremiumFeature): string[] =>
  Object.values(obj)
    .filter((v: PremiumFeatureType) => v.enable)
    .map((v: PremiumFeatureType) => v.title);



// ─── Main screen ──────────────────────────────────────────────────────────────

const PayWallScreen = () => {
  // Paystack (Android)
  const { popup } = usePaystack();

  // IAP (iOS)
  const {
    products: iapProducts,
    connected: iapConnected,
    productsLoading: iapProductsLoading,
    purchaseProduct,
    restorePurchases,
  } = useIAPContext();

  const dispatch = useAppDispatch();
  const { show, hide } = useLoader();
  const { userInfo } = useAppSelector((s) => s.auth);
  const { currentSubscription } = useAppSelector((s) => s.subscription);
  const iapStatus = useAppSelector((s) => s.iap.status);
  const iapError = useAppSelector((s) => s.iap.error);

  const [premiumFeatures, setPremiumFeatures] = useState<string[]>(defaultPremiumFeatures);
  const [creditPlans, setCreditPlans] = useState<CreditPlan[]>(defaultCreditPlans);
  const [selectedCreditPlan, setSelectedCreditPlan] = useState<CreditPlan | null>(null);
  const [checking, setChecking] = useState(false);

  // ── Fetch subscription plan details from backend ──────────────────────────
  const fetchSubscriptionDetails = useCallback(async () => {
    try {
      show();
      const data: any = await axiosRequest.get("/premium-plan/get-plan-details");
      hide();
      const premiumPlanData = data.data?.premiumPlanData as SubscriptionResponse;
      if (premiumPlanData) {
        console.log('Fetched subscription details:', premiumPlanData);
        setPremiumFeatures(convertFeaturesToStrings(premiumPlanData.premiumFeature));
        setCreditPlans(
          premiumPlanData.creditPlans.filter((p) => p.credits !== 0)
        );
      }
    } catch (error: any) {
      console.error("Error fetching subscription details:", JSON.stringify(error, null, 2));
      hide();
      Alert.alert(
        "Error",
        error.errorMessage ?? "Unable to fetch subscription details"
      );
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      if (currentSubscription) {
        if (dayjs().isAfter(dayjs(currentSubscription.expiry_at))) {
          // fetchSubscriptionDetails();
        } else {
          setChecking(true);
          try {
            const response: any = await axiosRequest.get("/premium-plan/get-plan-details");
            const premiumPlanData = response.data?.premiumPlanData as SubscriptionResponse;
            if (premiumPlanData) {
              setPremiumFeatures(convertFeaturesToStrings(premiumPlanData.premiumFeature));
              setCreditPlans(premiumPlanData.creditPlans.filter((p) => p.credits !== 0));
            }
            await handlePermissionNavigation("/(tabs)", "/app-permissions");
          } finally {
            setChecking(false);
          }
        }
      } else {
        // fetchSubscriptionDetails();
      }
    };
    init();
  }, []);

  // ── Dismiss IAP error after showing it ───────────────────────────────────
  useEffect(() => {
    if (iapStatus === 'error' && iapError) {
      dispatch(resetIAP());
    }
  }, [iapStatus, iapError]);

  // ─────────────────────────────────────────────────────────────────────────
  // iOS IAP handlers
  // ─────────────────────────────────────────────────────────────────────────

  const handleIOSPurchase = useCallback(
    async (product: Product) => {
      await purchaseProduct(product.id);
    },
    [purchaseProduct]
  );

  // ─────────────────────────────────────────────────────────────────────────
  // Android Paystack handlers (unchanged from original)
  // ─────────────────────────────────────────────────────────────────────────

  const payPlanFromWallet = async () => {
    try {
      const params = { selectedPlan: { select_plan: "one_day" } };
      show();
      const data: any = await axiosRequest.post(API_URL + "/premium-plan/buy-plans", params);
      hide();
      if (data.reaction === ReactionCodes.SUCCESS) {
        if (userInfo) dispatch(updateUserInfo({ ...userInfo, is_premium: true }));
        Toast.success("Subscription successful");
        await handlePermissionNavigation("/(tabs)", "/app-permissions");
      }
    } catch (error: any) {
      hide();
      Alert.alert("Error", error.errorMessage ?? "Unable to buy plan");
    }
  };

  const createPaystackOrder = async () => {
    try {
      if (selectedCreditPlan?.credits === 0) {
        payPlanFromWallet();
        return;
      }
      const params = {
        packagePrice: selectedCreditPlan?.price,
        packageUid: selectedCreditPlan?._uid,
        packageName: selectedCreditPlan?.title,
        select_payment_method: "paystack-checkout",
      };
      show();
      const data = await axiosRequest.post(API_URL + "/premium-plan/capture-paystack-order", params);
      hide();
      const responseData = data.data as CreatePaystackOrderResponse;
      if (responseData?.reference) {
        processPaystackPayment(responseData);
      }
    } catch (error: any) {
      hide();
      Alert.alert("Error", error.errorMessage ?? "Unable to create order");
    }
  };

  const processPaystackPayment = (paystackOrderData: CreatePaystackOrderResponse) => {
    popup.checkout({
      amount: paystackOrderData.amount,
      email: paystackOrderData.email,
      reference: paystackOrderData.reference,
      onSuccess: (data) => {
        verifyPaystackPayment(data.reference);
      },
      onCancel: () => {
        Alert.alert("Payment Cancelled", "Your payment was cancelled");
      },
    });
  };

  const verifyPaystackPayment = async (reference: string) => {
    try {
      show();
      const data: any = await axiosRequest.post(
        API_URL + "/premium-plan/paystack-order-submit",
        { reference }
      );
      hide();
      if (data.reaction === ReactionCodes.SUCCESS) {
        if (userInfo) dispatch(updateUserInfo({ ...userInfo, is_premium: true }));
        Toast.success("Subscription successful");
        await handlePermissionNavigation("/(tabs)", "/app-permissions");
      }
    } catch (error: any) {
      hide();
      Alert.alert("Error", error.errorMessage ?? "Unable to verify payment");
    }
  };

  const handleLogOut = async () => {
    show();
    await dispatch(signUserOut()).unwrap();
    hide();
    router.replace('/(auth)/sign-in');
  }

  const openPrivacyPolicy = async () => {
    await WebBrowser.openBrowserAsync("https://dazzzle.org/privacy-policy");
  };

  const openTermsOfUse = async () => {
    await WebBrowser.openBrowserAsync("https://dazzzle.org/terms-of-use");
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────

  const isIAPBusy = iapStatus === 'loading';

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}>
        <View className="p-4 mt-6">
          {checking ? (
            <View className="flex-1 items-center justify-center py-20">
              <ActivityIndicator color="#DD3FE5" size="large" />
            </View>
          ) : (
           <View className="gap-2">
            <View>
              <Text className=" text-2xl font-firabold text-center">Choose your plan</Text>
                    <Text className=" text-base font-firamedium text-center underline underline-offset-8 underline-tertiary">Unlock Premium Features</Text>
                    {premiumFeatures && (
                        <View className="space-y-3 my-7">
                            {premiumFeatures.map((feature, index) => (
                                <View key={index} className="flex flex-row items-center justify-start pl-5">
                                    <View className="w-1 h-1 bg-primary rounded-full mr-1" />
                                    <Text className=" text-sm">{feature}</Text>
                                </View>
                            ))}
                        </View>
                    )}
              </View>
              <View className="">
                {Platform.OS === "ios" && (
                  <IOSPlanSection
                    iapProducts={iapProducts}
                    iapConnected={iapConnected}
                    iapProductsLoading={iapProductsLoading}
                    creditPlans={creditPlans}
                    selectedProductId={selectedCreditPlan?._uid}
                    isIAPBusy={isIAPBusy}
                    onSelectProduct={(product, matchedPlan) => {
                      // We map IAP product back to CreditPlan structure so we can use single CTA if needed
                      if (matchedPlan) {
                        setSelectedCreditPlan(matchedPlan);
                      } else {
                        // fallback mock plan so the button enables
                        setSelectedCreditPlan({
                          _id: Math.random(),
                          _uid: product.id,
                          status: 1,
                          title: product.title,
                          credits: 1,
                          price: "0",
                          image: "",
                          is_subscription_package: 1,
                          users__id: 1,
                          created_at: "",
                          updated_at: ""
                        });
                      }
                    }}
                  />
                )}

                {Platform.OS === "android" && (
                  <AndroidPlanSection
                    creditPlans={creditPlans}
                    selectedCreditPlan={selectedCreditPlan}
                    onSelectPlan={setSelectedCreditPlan}
                    formatAsCurrency={formatAsCurrency}
                  />
                )}
              </View>

              <View className="mt-2">
                <CustomButton
                  title={
                    selectedCreditPlan
                      ? (Platform.OS === "ios" ? "Subscribe Now" : `Subscribe for ${formatAsCurrency(selectedCreditPlan.price)}`)
                      : "Select a Plan"
                  }
                  handlePress={() => {
                     if (Platform.OS === "ios" && selectedCreditPlan) {
                        const product = iapProducts.find((p) => p.id === selectedCreditPlan._uid || (IAP_PRODUCT_TO_PLAN_UID as Record<string, string>)[p.id] === selectedCreditPlan._uid);
                        if (product) handleIOSPurchase(product);
                     } else {
                        createPaystackOrder();
                     }
                  }}
                  isLoading={isIAPBusy}
                  disabled={!selectedCreditPlan || isIAPBusy}
                />
 {Platform.OS === "ios" && (
                    <View className="justify-center items-center gap-2 my-3">
                      <Text className=" text-xs">or</Text>
                      <TouchableOpacity className="py-2.5 px-4 w-auto border border-primary flex items-center justify-center rounded-[26px]" onPress={restorePurchases} disabled={isIAPBusy}>
                        <Text className="text-primary text-xs font-firamedium">
                          Click to Restore Purchases
                        </Text>
                      </TouchableOpacity>
                      </View>
                  )}
                 <View className="flex flex-wrap flex-1 flex-row gap-1 mt-3 items-center justify-center">
                        <Text className=" text-xs text-center">
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
                            <Text className='text-sm font-firaregular underline'>Log Out</Text>
                        </TouchableOpacity>

                    </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PayWallScreen;

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

// ── iOS plan section ──────────────────────────────────────────────────────────

interface IOSPlanSectionProps {
  iapProducts: Product[];
  iapConnected: boolean;
  iapProductsLoading: boolean;
  creditPlans: CreditPlan[];
  selectedProductId?: string;
  isIAPBusy: boolean;
  onSelectProduct: (product: Product, matchedPlan?: CreditPlan) => void;
}

function IOSPlanSection({
  iapProducts,
  iapConnected,
  iapProductsLoading,
  creditPlans,
  selectedProductId,
  isIAPBusy,
  onSelectProduct,
}: IOSPlanSectionProps) {
  if (!iapConnected || iapProductsLoading) {
    return (
      <View className="py-6 items-center gap-2">
        <ActivityIndicator color="#DD3FE5" />
        <Text className="text-slate-500 text-xs font-firaregular">
          Connecting to App Store…
        </Text>
      </View>
    );
  }

  if (iapProducts.length === 0) {
    return (
      <View className="py-6 items-center">
        <Text className="text-slate-500 text-sm font-firaregular">
          No products available right now.
        </Text>
      </View>
    );
  }

  return (
    <View className="space-y-4">
      {iapProducts.map((product) => {
        const planUid = (IAP_PRODUCT_TO_PLAN_UID as Record<string, string>)[product.id] as string | undefined;
        const matchedPlan = planUid ? creditPlans.find((p) => p._uid === planUid) : undefined;
        const isSelected = selectedProductId === (matchedPlan?._uid || product.id);

        return (
          <IOSProductCard
            key={product.id}
            product={product}
            matchedPlan={matchedPlan}
            isSelected={isSelected}
            onPress={() => onSelectProduct(product, matchedPlan)}
          />
        );
      })}
    </View>
  );
}

// ── iOS individual product card ───────────────────────────────────────────────

interface IOSProductCardProps {
  product: Product;
  matchedPlan?: CreditPlan;
  isSelected: boolean;
  onPress: () => void;
}

function IOSProductCard({ product, matchedPlan, isSelected, onPress }: IOSProductCardProps) {
  const displayTitle = matchedPlan?.title ?? product.title;

  return (
    <View className="flex-1 mb-4">
      <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      className={`px-4 py-2.5 bg-[#FFFFFF1A] rounded-xl border border-tertiary ${
        isSelected ? "bg-tertiary border-transparent" : "bg-white"
      }`}
    >
      <View className=" justify-between">
        <View className="flex-1">
          <Text className={`font-firasemibold text-base ${isSelected ? "text-primary" : "text-slate-800"}`}>
            {displayTitle}
          </Text>
          {product.description && !matchedPlan ? (
            <Text
              className="font-firaregular text-xs text-slate-500 mt-1"
              numberOfLines={2}
            >
              {product.description}
            </Text>
          ) : null}
        </View>

        <View className="">
          <Text className={`font-firabold text-sm ${isSelected ? "text-primary" : "text-slate-800"}`}>
            {product.displayPrice}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
    </View>
  );
}

// ── Android plan section (unchanged from original) ────────────────────────────

interface AndroidPlanSectionProps {
  creditPlans: CreditPlan[];
  selectedCreditPlan: CreditPlan | null;
  onSelectPlan: (plan: CreditPlan) => void;
  formatAsCurrency: (amount: string) => string;
}

function AndroidPlanSection({
  creditPlans,
  selectedCreditPlan,
  onSelectPlan,
  formatAsCurrency,
}: AndroidPlanSectionProps) {
  return (
    <View className="gap-4">
      {creditPlans.map((plan) => {
        const isSelected = selectedCreditPlan?._id === plan._id;
        return (
          <TouchableOpacity
            key={plan._id}
            onPress={() => onSelectPlan(plan)}
            className={`px-4 py-2.5 bg-[#FFFFFF1A] rounded-xl border border-tertiary ${
        isSelected ? "bg-tertiary border-transparent" : "bg-white"
      }`}
          >
            <Text
              className={`font-firasemibold text-base ${
                isSelected ? "text-primary" : "text-slate-800"
              }`}
            >
              {plan.title}
            </Text>
            <Text
              className={`font-firabold text-sm ${
                isSelected ? "text-primary" : "text-slate-800"
              }`}
            >
              {formatAsCurrency(plan.price)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
