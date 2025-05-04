import CustomButton from "@/components/CustomButton";
import { API_URL } from "@/constants/constants";
import { useAxiosContext } from "@/context/AxiosProvider";
import { ReactionCodes } from "@/models/general";
import { CreatePaystackOrderResponse, CreditPlan, PremiumFeature, PremiumFeatureType, SubscriptionResponse } from "@/models/subscription";
import { LoggedInUser, LoggedInUserProfile } from "@/models/user";
import { getItem } from "@/utils/asyncStorage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Alert } from "react-native";
import { usePaystack } from 'react-native-paystack-webview';

const Subscription = () => {
    const { popup } = usePaystack();
    const { axiosRequest } = useAxiosContext();
    const [premiumfeatures, setPremiumFeatures] = useState<string[]>([]);
    const [creditPlans, setCreditPlans] = useState<CreditPlan[]>([]);
    const [selectedCreditPlan, setSelectedCreditPlan] = useState<CreditPlan | null>(null);
    const [user, setUser] = useState<LoggedInUserProfile | null>(null);

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

    const fetchSubscriptionDetails = async () => {
        try {
            const { data } = await axiosRequest.get(API_URL + '/premium-plan/premium-plan-data');
            const reaction = data.reaction;
            const responseData = data.data;
            if (reaction === ReactionCodes.SUCCESS) {
                const premiumPlanData = responseData['premiumPlanData'] as SubscriptionResponse;
                const premiumFeature = premiumPlanData.premiumFeature;
                const creditPlans = premiumPlanData.creditPlans;
                const premiumFeatureStrings = convertObjectToArrayOfStrings(premiumFeature);
                setPremiumFeatures(premiumFeatureStrings);
                setCreditPlans(creditPlans);

            }
        } catch (error: any) {
            Alert.alert('Error', error.errorMessage ? error.errorMessage : 'Failed to log in');
        }
    }

    useEffect(() => {
        fetchSubscriptionDetails();
    }, [])

    const formatAsCurrency = (amount: string) => {
        return Number(amount).toLocaleString('en-US', { style: 'currency', currency: 'NGN' });
    }

    const convertObjectToArrayOfStrings = (obj: PremiumFeature) => {
        return Object.values(obj).filter((value: PremiumFeatureType) => value.enable).map((value: PremiumFeatureType) => value.title);
    }

    const createPaystackOrder = async () => {
        try {
            const params = {
                packagePrice: selectedCreditPlan?.price,
                packageUid: selectedCreditPlan?._uid,
                packageName: selectedCreditPlan?.title,
                select_payment_method: "paystack-checkout"
            }
            const { data } = await axiosRequest.post(API_URL + '/premium-plan/capture-paystack-order', params);
            console.log(data);
            const responseData = data.data as CreatePaystackOrderResponse;
            if (responseData && responseData.reference) {
                processPaystackPayment(responseData);
            }
        } catch (error: any) {
            Alert.alert('Error', error.errorMessage ? error.errorMessage : 'Failed to log in');
        }
    }

    const verifyPaystackPayment = async (response: any) => {
        try {
            const { data } = await axiosRequest.post(API_URL + '/premium-plan/paystack-order-submit', { response });
            if (data.reaction === ReactionCodes.SUCCESS) {
                router.replace('/(tabs)');
            }
        } catch (error: any) {
            Alert.alert('Error', error.errorMessage ? error.errorMessage : 'Failed to log in');
        }
    }

    return (
        <SafeAreaView className='bg-[#1A1A1A] h-full'>
            <ScrollView className='h-full'>
                <View className="w-full min-h-[95vh] justify-center px-4 pb-4 my-6">
                    <Text className="text-white text-2xl font-firabold text-center">Choose your plan</Text>
                    <Text className="text-white text-base font-firamedium text-center underline underline-offset-8 underline-tertiary">Premium Membership</Text>
                    {premiumfeatures && (
                        <View className="space-y-1 my-7">
                            <Text className="text-white text-sm">Premium Features</Text>
                            {premiumfeatures.map((feature, index) => (
                                <View key={index} className="flex flex-row items-center justify-start pl-5">
                                    <View className="w-1 h-1 bg-tertiary rounded-full mr-1" />
                                    <Text className="text-white text-xs">{feature}</Text>
                                </View>
                            ))}
                        </View>
                    )}
                    <View className="space-y-4 mb-10">
                        {creditPlans.map((creditPlan, index) => (
                            <TouchableOpacity onPress={() => setSelectedCreditPlan(creditPlan)} key={creditPlan._uid} className={`p-4 bg-[#FFFFFF1A] rounded-lg ${selectedCreditPlan?._uid === creditPlan._uid ? 'bg-tertiary' : ''}`}>
                                <Text className="text-white text-base font-firamedium text-center">{creditPlan.title}</Text>
                                <Text className="text-white text-sm text-center">{formatAsCurrency(creditPlan.price)}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <CustomButton disabled={!selectedCreditPlan} title="Subscribe" handlePress={createPaystackOrder} />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Subscription;