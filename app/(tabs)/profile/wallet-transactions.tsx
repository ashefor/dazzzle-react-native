
import WalletIcon from "@/components/icons/WalletIcon";
import NavBar from "@/components/NavBar";
import SkeletonPlaceholder from "@/components/SkeletonLoader";
import { useAppSelector } from "@/hooks/reduxHooks";
import { WalletTransaction } from "@/models/subscription";
import axiosRequest from "@/utils/axios";
import { LinearGradient } from "expo-linear-gradient";
import { JSX, useCallback, useEffect, useRef, useState } from "react";
import { FlatList, View, Text, TouchableOpacity, Alert, RefreshControl, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import dayjs from 'dayjs';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';
import CustomButton from "@/components/CustomButton";
import { FREEMIUM_ACCESS_END, isFreemiumAccessActive } from '@/utils/freemiumAccess';

export interface FinancialTransaction {
    _id: number
    _uid: string
    status: string
    amount: string
    created_at: string
    currency_code: string
    payment_mode: string
    method: string
}

const SubscriptionCard = ({ planName, expiryDate }: { planName: string; expiryDate: string }) => {
    return (
        <LinearGradient
            colors={['#D946EF', '#C026D3']} // Pink/Purple Gradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="rounded-2xl p-6 shadow-lg"
            style={{ elevation: 10, shadowColor: '#D946EF', shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: { width: 0, height: 10 } }}
        >
            <View className="flex-row items-center mb-2">
                <View>
                    <Text className="text-white/80 text-base font-firaregular capitalize">Current Subscription</Text>
                    {isFreemiumAccessActive() ? <>
                    <Text className="text-white text-xl font-firabold capitalize">Freemium</Text>
                    <Text className="text-white/80 text-sm font-firaregular">Expires On: {dayjs(FREEMIUM_ACCESS_END).format('ddd, MMM D, YYYY h:mm A')}</Text>
                    </>: <>
                    <Text className="text-white text-xl font-firabold capitalize">{planName}</Text>
                    <Text className="text-white/80 text-sm font-firaregular">Expires On: {dayjs(expiryDate).format('ddd, MMM D, YYYY h:mm A')}</Text>
                    </>}
                </View>
            </View>
        </LinearGradient>
    )
}

const Skeleton = ({ style }: { style?: any }) => (
    <SkeletonPlaceholder
        style={StyleSheet.flatten([{ backgroundColor: '#F0F0F0' }, style])}
    />
);

const formatCreditAsAmountWithComma = (credits: string | number) => {
    const amount = typeof credits === 'string' ? parseFloat(credits) : credits;
    if (isNaN(amount)) return credits;
    return amount.toLocaleString();
}

const TransactionSkeleton = () => (
    <View className="flex-row items-center justify-between py-4 border-b border-gray-100">
        <View className="flex-row items-center">
            {/* Circle Icon Skeleton */}
            <Skeleton
                style={{ width: 48, height: 48, borderRadius: 24, marginRight: 16 }}
            />

            <View>
                <Skeleton style={{ width: 120, height: 16, marginBottom: 8, borderRadius: 4 }} />
                <Skeleton style={{ width: 80, height: 12, borderRadius: 4 }} />
            </View>
        </View>

        {/* Amount Skeleton */}
        <Skeleton style={{ width: 90, height: 14, borderRadius: 4 }} />
    </View>
);

const TransactionListSkeleton = () => {
    return (
        <View>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((key) => (
                <TransactionSkeleton key={key} />
            ))}
        </View>
    );
}

const NoTransactions = () => (
    <View className="flex-1 items-center justify-center py-20">
        <Text className="text-gray-400 text-base font-firaregular">No transactions found.</Text>
    </View>
);

const TransactionItem = ({ transaction, onPress }: { transaction: WalletTransaction; onPress: (transaction: any) => void }) => {
    return (
        <TouchableOpacity onPress={() => onPress(transaction.financialTransactionDetail)} style={{ minHeight: 44 }} className="py-4 flex flex-row gap-4 items-center border-b border-gray-100">
            <View className="h-8 w-8 flex rounded-full items-center justify-center bg-[#FCE6FD]">
                {/* <Ionicons name="wallet-outline" size={20} color="#E2E3DD" /> */}
                <WalletIcon color={"#E2E3DD"} />
            </View>
            <View className="flex-1 flex flex-row justify-between items-start">
                <View className="space-y-1">
                    <Text className="text-sm font-firamedium">
                        {transaction.formattedTransactionType}
                    </Text>
                    <Text className="text-xs text-[#AEAEB2] font-firaregular">{transaction.created_at}</Text>
                </View>
                <Text className="text">
                    {formatCreditAsAmountWithComma(transaction.credits)}
                </Text>
            </View>
        </TouchableOpacity>
    )
}


const WalletTransactions = () => {
    const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
    const [loading, setLoading] = useState(false);
    const insets = useSafeAreaInsets();
    const [refreshing, setRefreshing] = useState(false);
    const [singleFinancialTransaction, setSingleFinancialTransaction] = useState<FinancialTransaction | null>(null);
    const { currentSubscription, isActive } = useAppSelector(state => state.subscription);
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);


    const fetchWalletTransactions = async (refresh?: boolean) => {
        try {
            if (refresh) {
                setRefreshing(refresh);
                setLoading(false);
            } else {
                setLoading(true);
                setRefreshing(false);
            }
            const { data } = await axiosRequest.get('credit-wallet/transaction-list');
            const transactions = data.data;
            setTransactions(transactions);
            setLoading(false);
            setRefreshing(false)
        } catch (error: any) {
            setLoading(false);
            setRefreshing(false)
            Alert.alert('Error', error.errorMessage ? error.errorMessage : 'Unable to submit')
        }
    }

    useEffect(() => {
        fetchWalletTransactions();
    }, [])

    const getSubscriptionPlanNameFromPlanId = (planId?: string) => {
        return planId ? planId.split('_').join(' ') : 'Unknown';
    }

    const viewSingleTransaction = (transaction?: FinancialTransaction | Array<any>) => {
        if (transaction && Array.isArray(transaction)) {
            setSingleFinancialTransaction(null);
            // bottomSheetModalRef.current?.present();
        } else {
            setSingleFinancialTransaction(transaction as FinancialTransaction);
            bottomSheetModalRef.current?.present();
        }
    }

    const renderBackdrop = useCallback(
        (props: JSX.IntrinsicAttributes & BottomSheetDefaultBackdropProps) => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1}
                appearsOnIndex={0}
            // onPress={handleBlur}
            />
        ),
        []
    );

    return (
        <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
            <NavBar title="Account Transactions" />
            <View className="flex-1">
                <FlatList
                    className="h-full"
                    ListHeaderComponent={
                        <>
                            <SubscriptionCard planName={getSubscriptionPlanNameFromPlanId(currentSubscription?.plan_id)} expiryDate={currentSubscription?.expiry_at!} />
                            <Text className="text-base font-bold text-black mb-2 mt-6">Transactions</Text>
                        </>
                    }
                    contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: insets.bottom + 20 }}
                    data={transactions}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item) => item._uid}
                    ListEmptyComponent={loading ? <TransactionListSkeleton /> : <NoTransactions />}
                    refreshControl={
                        <RefreshControl
                            tintColor="#fff"
                            colors={['#fff']}
                            refreshing={refreshing}
                            onRefresh={() => fetchWalletTransactions(true)}
                        />}
                    renderItem={({ item }) => <TransactionItem transaction={item} onPress={viewSingleTransaction} />}
                />

                <BottomSheetModal
                    ref={bottomSheetModalRef}
                    enableDynamicSizing
                    enablePanDownToClose={true}
                    style={{
                        borderRadius: 28,
                    }}
                    backgroundStyle={{
                        borderRadius: 28,
                    }}
                    backdropComponent={renderBackdrop}
                >

                    <BottomSheetView>
                        <View className='px-4 pb-10 pt-4'>
                            <View className="mb-4">
                                <View style={{ minHeight: 44 }} className="py-2 flex flex-row justify-between gap-4 items-center">
                                    <Text className="text-black text-sm font-firaregular">
                                        Created At
                                    </Text>
                                    <Text className="font-firamedium">
                                        {singleFinancialTransaction?.created_at}
                                    </Text>
                                </View>
                                <View style={{ minHeight: 44 }} className="py-2 flex flex-row justify-between gap-4 items-center">
                                    <Text className="text-black text-sm font-firaregular">
                                        Amount
                                    </Text>
                                    <Text className="font-firamedium">
                                        {singleFinancialTransaction?.amount}
                                    </Text>
                                </View>
                                <View style={{ minHeight: 44 }} className="py-2 flex flex-row justify-between gap-4 items-center">
                                    <Text className="text-black text-sm font-firaregular">
                                        Currency
                                    </Text>
                                    <Text className="font-firamedium">
                                        {singleFinancialTransaction?.currency_code}
                                    </Text>
                                </View>
                                <View style={{ minHeight: 44 }} className="py-2 flex flex-row justify-between gap-4 items-center">
                                    <Text className="text-black text-sm font-firaregular">
                                        Status
                                    </Text>
                                    <Text className="font-firamedium">
                                        {singleFinancialTransaction?.status}
                                    </Text>
                                </View>
                                <View style={{ minHeight: 44 }} className="py-2 flex flex-row justify-between gap-4 items-center">
                                    <Text className="text-black text-sm font-firaregular">
                                        Method
                                    </Text>
                                    <Text className="font-firamedium">
                                        {singleFinancialTransaction?.method}
                                    </Text>
                                </View>
                                <View style={{ minHeight: 44 }} className="py-2 flex flex-row justify-between gap-4 items-center">
                                    <Text className="text-black text-sm font-firaregular">
                                        Mode
                                    </Text>
                                    <Text className="font-firamedium">
                                        {singleFinancialTransaction?.payment_mode}
                                    </Text>
                                </View>
                            </View>
                            <CustomButton handlePress={() => bottomSheetModalRef.current?.dismiss()} title="Close" />
                        </View>
                    </BottomSheetView>
                </BottomSheetModal>
            </View>
        </View>
    )
}

export default WalletTransactions