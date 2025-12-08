import CustomButton from "@/components/CustomButton";
import Toast from "@/components/toast/toast";
import { API_URL } from "@/constants/constants";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { ReactionCodes } from "@/models/general";
import { CreatePaystackOrderResponse, CreditPlan, PremiumFeature, PremiumFeatureType, SubscriptionResponse } from "@/models/subscription";
import { signUserOut } from "@/redux/thunks/authActions";
import axiosRequest from "@/utils/axios";
import dayjs from "dayjs";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { usePaystack } from 'react-native-paystack-webview';
import { SafeAreaView } from "react-native-safe-area-context";
import { useLoader } from '@/context/loader/LoaderProvider';
import * as WebBrowser from 'expo-web-browser';

const defaultCreditPlans =  [
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
    const { popup } = usePaystack();
    const dispatch = useAppDispatch();
    const { show, hide } = useLoader();
    const { currentSubscription, } = useAppSelector(state => state.subscription);
    const [premiumfeatures, setPremiumFeatures] = useState<string[]>([]);
    const [creditPlans, setCreditPlans] = useState<CreditPlan[]>(defaultCreditPlans);
    const [selectedCreditPlan, setSelectedCreditPlan] = useState<CreditPlan | null>(null);

    const processPaystackPayment = (response: CreatePaystackOrderResponse) => {
        popup.checkout({
            email: response.email || '',
            amount: Number(response.amount) / 100,
            reference: response.reference,
            metadata: {
                custom_fields: response
            },
            onSuccess: (res) => verifyPaystackPayment(res),
            onCancel: () => console.log('User cancelled'),
            onLoad: (res) => console.log('WebView Loaded:', res),
            onError: (err) => console.log('WebView Error:', err)
        });
    };

    const handleLogOut = async () => {
        dispatch(signUserOut()).unwrap().then(() => router.replace('/(auth)/sign-in'))
    }

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
        if (currentSubscription) {
            if (dayjs().isAfter(dayjs(currentSubscription.expiry_at))) {
                fetchSubscriptionDetails();
            } else {
                router.replace('/(tabs)');
            }
        } else {
            fetchSubscriptionDetails();
        }
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
                Toast.success('Subscription successful');
                router.replace('/(tabs)');
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
        console.log('selectedCreditPlan', selectedCreditPlan);
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
                    processPaystackPayment(responseData);
                }
            }
        } catch (error: any) {
            hide();
            Alert.alert('Error', error.errorMessage ? error.errorMessage : 'Failed to log in');
        }
    }

    const verifyPaystackPayment = async (response: any) => {
        try {
            show();
            const data: any = await axiosRequest.post(API_URL + '/premium-plan/paystack-order-submit', { response });
            hide();
            if (data.reaction === ReactionCodes.SUCCESS) {
                Toast.success('Subscription successful');
                router.replace('/(tabs)');
            }
        } catch (error: any) {
            hide();
            Alert.alert('Error', error.errorMessage ? error.errorMessage : 'Failed to log in');
        }
    }

    return (
        <SafeAreaView className=' h-full'>
            <ScrollView className='h-full'>
                <View className="w-full min-h-[65vh] justify-center px-4 my-6 py-10">
                    <Text className="text-white text-2xl font-firabold text-center">Choose your plan</Text>
                    <Text className="text-white text-base font-firamedium text-center underline underline-offset-8 underline-tertiary">Unlock Premium Features</Text>
                    {premiumfeatures && (
                        <View className="space-y-3 my-7">
                            {premiumfeatures.map((feature, index) => (
                                <View key={index} className="flex flex-row items-center justify-start pl-5">
                                    <View className="w-1 h-1 bg-tertiary rounded-full mr-1" />
                                    <Text className="text-white text-sm">{feature}</Text>
                                </View>
                            ))}
                        </View>
                    )}
                    <View className="space-y-4 mb-10">
                        {creditPlans.map((creditPlan, index) => (
                            <TouchableOpacity onPress={() => setSelectedCreditPlan(creditPlan)} key={creditPlan._uid} className={`p-4 bg-[#FFFFFF1A] rounded-lg ${selectedCreditPlan?._uid === creditPlan._uid ? 'bg-tertiary' : ''}`}>
                                <Text className="text-white text-base font-firamedium text-center">{creditPlan.title}</Text>
                                <Text className="text-white text-sm text-center font-firabold">{formatAsCurrency(creditPlan.price)}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <CustomButton disabled={!selectedCreditPlan} title={`Subscribe ${selectedCreditPlan ? 'for ' + formatAsCurrency(selectedCreditPlan.price) : ''}`} handlePress={createPaystackOrder} />
                    <View className="flex flex-wrap flex-1 flex-row gap-1 mt-3 items-center justify-center">
                        <Text className="text-white text-xs text-center">
                        By subscribing, you agree to our 
                    </Text>
                     <TouchableOpacity onPress={openPrivacyPolicy}>
                            <Text className="text-tertiary text-xs text-center">
                                 Terms of Service and Privacy Policy.
                            </Text>
                            </TouchableOpacity>
                    </View>
                    <View className='justify-center pt-5 flex-row gap-2'>
                        <TouchableOpacity onPress={() => handleLogOut()}>
                            <Text className='text-sm text-tertiary font-firaregular underline'>Log Out</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default PayWallScreen;