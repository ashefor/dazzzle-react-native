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
import { SafeAreaView } from "react-native-safe-area-context";
import { useLoader } from "@/context/loader/LoaderProvider";
import * as WebBrowser from "expo-web-browser";
import { updateUserInfo } from "@/redux/slices/authSlice";
import { handlePermissionNavigation } from "@/utils/notificationHandler";
import { useIAPContext } from "@/context/IAPProvider";
import { resetIAP } from "@/redux/slices/iapSlice";
import type { Product } from "expo-iap";

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
  // const { popup } = usePaystack();

  // IAP (iOS)
  const {
    products: iapProducts,
    connected: iapConnected,
    purchaseProduct,
    restorePurchases,
  } = useIAPContext();

  const dispatch = useAppDispatch();
  const { show, hide } = useLoader();
  const { userInfo } = useAppSelector((s) => s.auth);
  const { currentSubscription } = useAppSelector((s) => s.subscription);
  const iapStatus = useAppSelector((s) => s.iap.status);
  const iapError = useAppSelector((s) => s.iap.error);

  const [premiumFeatures, setPremiumFeatures] = useState<string[]>([]);
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
        setPremiumFeatures(convertFeaturesToStrings(premiumPlanData.premiumFeature));
        setCreditPlans(
          premiumPlanData.creditPlans.filter((p) => p.credits !== 0)
        );
      }
    } catch (error: any) {
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
          fetchSubscriptionDetails();
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
        fetchSubscriptionDetails();
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
    // popup.checkout({
    //   amount: paystackOrderData.amount,
    //   email: paystackOrderData.email,
    //   reference: paystackOrderData.reference,
    //   onSuccess: (data) => {
    //     verifyPaystackPayment(data.reference);
    //   },
    //   onCancel: () => {
    //     Alert.alert("Payment Cancelled", "Your payment was cancelled");
    //   },
    // });
  };

  const verifyPaystackPayment = async (reference: string) => {
    try {
      show();
      const data: any = await axiosRequest.post(
        API_URL + "/premium-plan/verify-paystack-order",
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

  const openPrivacyPolicy = async () => {
    await WebBrowser.openBrowserAsync("https://dazzzle.org/privacy-policy");
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────

  const isIAPBusy = iapStatus === 'loading';

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <ScrollView>
        {/* Hero image */}
        <View>
          {/* <Image
            source={require("@/assets/images/paywall.png")}
            style={{ height: 260 }}
            resizeMode="cover"
            className="w-full h-full"
          /> */}
        </View>

        <View className="p-4 gap-4">
          {checking ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <View className="gap-4">
              <Text className="text-white text-3xl font-onestsemibold">
                Upgrade to{" "}
                <Text className="text-secondary">Premium </Text>
              </Text>

              {/* Feature list */}
              <View className="gap-2">
                <Text className="text-white text-sm font-onestregular">
                  Get unlimited access to all features
                </Text>
                {premiumFeatures.map((feature, index) => (
                  <View className="gap-2 flex-row items-center" key={index}>
                    <View className="h-5 w-5 rounded-full bg-secondary flex items-center justify-center">
                      <Text className="text-xs text-primary font-onestbold">✓</Text>
                    </View>
                    <Text className="text-white text-sm font-onestregular">
                      {feature}
                    </Text>
                  </View>
                ))}
              </View>

              {/* ── iOS: App Store products ─────────────────────────────── */}
              {Platform.OS === "ios" && (
                <IOSPlanSection
                  iapProducts={iapProducts}
                  iapConnected={iapConnected}
                  creditPlans={creditPlans}
                  isIAPBusy={isIAPBusy}
                  onPurchase={handleIOSPurchase}
                  onRestore={restorePurchases}
                />
              )}

              {/* ── Android: Paystack plan cards ────────────────────────── */}
              {Platform.OS === "android" && (
                <AndroidPlanSection
                  creditPlans={creditPlans}
                  selectedCreditPlan={selectedCreditPlan}
                  onSelectPlan={setSelectedCreditPlan}
                  onSubscribe={createPaystackOrder}
                  formatAsCurrency={formatAsCurrency}
                />
              )}

              {/* Footer links */}
              <View className="flex-row items-center justify-center gap-3">
                <TouchableOpacity onPress={openPrivacyPolicy}>
                  <Text className="text-white/50 text-xs font-onestregular">
                    Privacy Policy
                  </Text>
                </TouchableOpacity>
                <Text className="text-white/50 text-xs font-onestregular">•</Text>
                <TouchableOpacity>
                  <Text className="text-white/50 text-xs font-onestregular">
                    Terms of Use
                  </Text>
                </TouchableOpacity>
                {Platform.OS === "ios" && (
                  <>
                    <Text className="text-white/50 text-xs font-onestregular">•</Text>
                    <TouchableOpacity onPress={restorePurchases} disabled={isIAPBusy}>
                      <Text className="text-white/50 text-xs font-onestregular">
                        Restore Purchases
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
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
  creditPlans: CreditPlan[];
  isIAPBusy: boolean;
  onPurchase: (product: Product) => void;
  onRestore: () => void;
}

function IOSPlanSection({
  iapProducts,
  iapConnected,
  creditPlans,
  isIAPBusy,
  onPurchase,
  onRestore,
}: IOSPlanSectionProps) {
  if (!iapConnected) {
    return (
      <View className="py-6 items-center gap-2">
        <ActivityIndicator color="#fff" />
        <Text className="text-white/60 text-xs font-onestregular">
          Connecting to App Store…
        </Text>
      </View>
    );
  }

  if (iapProducts.length === 0) {
    return (
      <View className="py-6 items-center">
        <Text className="text-white/60 text-sm font-onestregular">
          No products available right now.
        </Text>
      </View>
    );
  }

  return (
    <View className="gap-3">
      {iapProducts.map((product) => (
        <IOSProductCard
          key={product.id}
          product={product}
          creditPlans={creditPlans}
          isLoading={isIAPBusy}
          onPress={() => onPurchase(product)}
        />
      ))}
    </View>
  );
}

// ── iOS individual product card ───────────────────────────────────────────────

interface IOSProductCardProps {
  product: Product;
  creditPlans: CreditPlan[];
  isLoading: boolean;
  onPress: () => void;
}

function IOSProductCard({ product, creditPlans, isLoading, onPress }: IOSProductCardProps) {
  // Show the backend plan title if mapped, otherwise fall back to App Store title
  const planUid = (IAP_PRODUCT_TO_PLAN_UID as Record<string, string>)[product.id] as string | undefined;
  const matchedPlan = planUid ? creditPlans.find((p) => p._uid === planUid) : undefined;
  const displayTitle = matchedPlan?.title ?? product.title;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isLoading}
      activeOpacity={0.75}
      className="p-4 rounded-2xl bg-white/10"
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1 mr-3">
          <Text className="font-onestsemibold text-base text-white">
            {displayTitle}
          </Text>
          {product.description ? (
            <Text
              className="font-onestregular text-xs text-white/60 mt-1"
              numberOfLines={2}
            >
              {product.description}
            </Text>
          ) : null}
        </View>

        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <View className="bg-secondary px-3 py-1.5 rounded-xl">
            <Text className="font-onestbold text-sm text-primary">
              {product.displayPrice}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

// ── Android plan section (unchanged from original) ────────────────────────────

interface AndroidPlanSectionProps {
  creditPlans: CreditPlan[];
  selectedCreditPlan: CreditPlan | null;
  onSelectPlan: (plan: CreditPlan) => void;
  onSubscribe: () => void;
  formatAsCurrency: (amount: string) => string;
}

function AndroidPlanSection({
  creditPlans,
  selectedCreditPlan,
  onSelectPlan,
  onSubscribe,
  formatAsCurrency,
}: AndroidPlanSectionProps) {
  return (
    <View className="gap-3">
      {creditPlans.map((plan) => (
        <TouchableOpacity
          key={plan._id}
          onPress={() => onSelectPlan(plan)}
          className={`p-4 rounded-2xl ${
            selectedCreditPlan?._id === plan._id ? "bg-secondary" : "bg-white/10"
          }`}
        >
          <Text
            className={`font-onestsemibold text-base ${
              selectedCreditPlan?._id === plan._id ? "text-primary" : "text-white"
            }`}
          >
            {plan.title}
          </Text>
          <Text
            className={`font-onestregular text-sm ${
              selectedCreditPlan?._id === plan._id ? "text-primary" : "text-white/70"
            }`}
          >
            {formatAsCurrency(plan.price)}
          </Text>
        </TouchableOpacity>
      ))}

      <CustomButton
        title={
          selectedCreditPlan
            ? `Subscribe for ${formatAsCurrency(selectedCreditPlan.price)}`
            : "Select a Plan"
        }
        handlePress={onSubscribe}
        disabled={!selectedCreditPlan}
      />
    </View>
  );
}