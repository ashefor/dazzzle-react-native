
import ArrowBackIcon from "@/components/icons/ArrowBackIcon";
import SkeletonPlaceholder from "@/components/SkeletonLoader";
import { WalletTransaction } from "@/models/subscription";
import axiosRequest from "@/utils/axios";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { Fragment, useEffect, useState } from "react"
import { FlatList, View, Text, TouchableOpacity, Alert, RefreshControl } from "react-native"
import { Sheet } from "tamagui";

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

const WalletTransactions = () => {
    const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [isSheetOpen, setSheetOpen] = useState(false);
    const [singleFinancialTransaction, setSingleFinancialTransaction] = useState<FinancialTransaction | null>(null);


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

    const viewSingleTransaction = (transaction?: FinancialTransaction | Array<any>) => {
        if (transaction && Array.isArray(transaction)) {
            setSingleFinancialTransaction(null);
            setSheetOpen(false);
        } else {
            setSingleFinancialTransaction(transaction as FinancialTransaction);
            setSheetOpen(true);
        }
    }

    return (
        <Fragment>
            <Stack.Screen
                options={{
                    headerStyle: { backgroundColor: '#1A1A1A' },
                    headerLeft: () => <TouchableOpacity onPress={() => router.back()} className='flex items-center justify-center pr-4 w-9 h-8'>
                        <ArrowBackIcon />
                    </TouchableOpacity>
                }}
            />
            <View className="bg-primary p-4">
                {loading ? (
                    ItemSkeleton()
                ) :
                    (
                        <FlatList
                            className="h-full"
                            data={transactions}
                            ItemSeparatorComponent={() => <View className="h-px bg-[#5B5B5B]" />}
                            refreshControl={
                                <RefreshControl
                                tintColor="#fff"
                                colors={['#fff']}
                                    refreshing={refreshing}
                                    onRefresh={() => fetchWalletTransactions(true)}
                                />}
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => viewSingleTransaction(item.financialTransactionDetail)} style={{ minHeight: 44 }} className="py-2 flex flex-row gap-4 items-center">
                                    <View className="rounded h-8 w-8 flex items-center justify-center bg-[#5B5B5B]">
                                        <Ionicons name="wallet-outline" size={20} color="#E2E3DD" />
                                    </View>
                                    <View className="flex-1 flex flex-row justify-between items-start">
                                        <View className="space-y-1">
                                            <Text className="text-white text-xs">{item.created_at}</Text>
                                            <Text className="text-white text-sm">
                                                {item.formattedTransactionType}
                                            </Text>
                                        </View>
                                        <Text className="text-white">
                                            {item.credits}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                        />
                    )}

                <Sheet
                    forceRemoveScrollEnabled={isSheetOpen}
                    modal={true}
                    open={isSheetOpen}
                    disableDrag={true}
                    onOpenChange={setSheetOpen}
                    snapPointsMode={'fit'}
                    dismissOnSnapToBottom
                    zIndex={100_000}
                    animation="quicker"
                >
                    <Sheet.Overlay
                        onPress={() => setSheetOpen(false)}
                        animation="quicker"
                        enterStyle={{ opacity: 0 }}
                        exitStyle={{ opacity: 0 }}
                    />
                    <Sheet.Frame paddingBottom="$2" gap="$5" backgroundColor={'#1A1A1A'}>
                        <View className='bg-[#1A1A1A] flex-row items-center  h-12 relative' >
                            <View className='px-4' style={{ zIndex: 10 }}>
                                <TouchableOpacity onPress={() => setSheetOpen(false)} className='z-10 flex items-center  pr-4'>
                                    <Ionicons name="close-circle" size={24} color="#ffffff" />
                                </TouchableOpacity>
                            </View>

                            <Text className='absolute  text-white text-base font-firamedium flex w-full flex-row text-center justify-center items-center'>Financial Transaction</Text>
                        </View>
                        <View className='px-6 pb-10'>
                            <View style={{ minHeight: 44 }} className="py-2 flex flex-row justify-between gap-4 items-center">
                                <Text className="text-white text-sm">
                                    Created At
                                </Text>
                                <Text className="text-white">
                                    {singleFinancialTransaction?.created_at}
                                </Text>
                            </View>
                            <View style={{ minHeight: 44 }} className="py-2 flex flex-row justify-between gap-4 items-center">
                                <Text className="text-white text-sm">
                                    Amount
                                </Text>
                                <Text className="text-white">
                                    {singleFinancialTransaction?.amount}
                                </Text>
                            </View>
                            <View style={{ minHeight: 44 }} className="py-2 flex flex-row justify-between gap-4 items-center">
                                <Text className="text-white text-sm">
                                    Currency
                                </Text>
                                <Text className="text-white">
                                    {singleFinancialTransaction?.currency_code}
                                </Text>
                            </View>
                            <View style={{ minHeight: 44 }} className="py-2 flex flex-row justify-between gap-4 items-center">
                                <Text className="text-white text-sm">
                                    Status
                                </Text>
                                <Text className="text-white">
                                    {singleFinancialTransaction?.status}
                                </Text>
                            </View>
                            <View style={{ minHeight: 44 }} className="py-2 flex flex-row justify-between gap-4 items-center">
                                <Text className="text-white text-sm">
                                    Method
                                </Text>
                                <Text className="text-white">
                                    {singleFinancialTransaction?.method}
                                </Text>
                            </View>
                            <View style={{ minHeight: 44 }} className="py-2 flex flex-row justify-between gap-4 items-center">
                                <Text className="text-white text-sm">
                                    Mode
                                </Text>
                                <Text className="text-white">
                                    {singleFinancialTransaction?.payment_mode}
                                </Text>
                            </View>
                            <TouchableOpacity onPress={() => setSheetOpen(false)} className='mt-4 flex items-center justify-center self-center py-2 w-fit px-4'>
                                <Text className='text-white text-sm font-firamedium'>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </Sheet.Frame>
                </Sheet>
            </View>
        </Fragment>
    )
}

const ItemSkeleton = () => {
    return (
        <Fragment>
            <View style={{ minHeight: 44 }} className="py-2 flex flex-row gap-4 items-center">
                <View className="rounded h-8 w-8 flex items-center justify-center">
                    <SkeletonPlaceholder style={{ height: '100%', width: '100%' }} />
                </View>
                <View className="flex-1 space-y-1">
                    <SkeletonPlaceholder style={{ height: 8, width: '40%' }} />
                    <SkeletonPlaceholder style={{ height: 10, width: '70%' }} />
                </View>
                <SkeletonPlaceholder style={{ height: 5, width: '10%' }} />
            </View>
            <View style={{ minHeight: 44 }} className="py-2 flex flex-row gap-4 items-center">
                <View className="rounded h-8 w-8 flex items-center justify-center">
                    <SkeletonPlaceholder style={{ height: '100%', width: '100%' }} />
                </View>
                <View className="flex-1 space-y-1">
                    <SkeletonPlaceholder style={{ height: 8, width: '40%' }} />
                    <SkeletonPlaceholder style={{ height: 10, width: '70%' }} />
                </View>
                <SkeletonPlaceholder style={{ height: 5, width: '10%' }} />
            </View>
            <View style={{ minHeight: 44 }} className="py-2 flex flex-row gap-4 items-center">
                <View className="rounded h-8 w-8 flex items-center justify-center">
                    <SkeletonPlaceholder style={{ height: '100%', width: '100%' }} />
                </View>
                <View className="flex-1 space-y-1">
                    <SkeletonPlaceholder style={{ height: 8, width: '40%' }} />
                    <SkeletonPlaceholder style={{ height: 10, width: '70%' }} />
                </View>
                <SkeletonPlaceholder style={{ height: 5, width: '10%' }} />
            </View>
            <View style={{ minHeight: 44 }} className="py-2 flex flex-row gap-4 items-center">
                <View className="rounded h-8 w-8 flex items-center justify-center">
                    <SkeletonPlaceholder style={{ height: '100%', width: '100%' }} />
                </View>
                <View className="flex-1 space-y-1">
                    <SkeletonPlaceholder style={{ height: 8, width: '40%' }} />
                    <SkeletonPlaceholder style={{ height: 10, width: '70%' }} />
                </View>
                <SkeletonPlaceholder style={{ height: 5, width: '10%' }} />
            </View>
            <View style={{ minHeight: 44 }} className="py-2 flex flex-row gap-4 items-center">
                <View className="rounded h-8 w-8 flex items-center justify-center">
                    <SkeletonPlaceholder style={{ height: '100%', width: '100%' }} />
                </View>
                <View className="flex-1 space-y-1">
                    <SkeletonPlaceholder style={{ height: 8, width: '40%' }} />
                    <SkeletonPlaceholder style={{ height: 10, width: '70%' }} />
                </View>
                <SkeletonPlaceholder style={{ height: 5, width: '10%' }} />
            </View>
        </Fragment>
    )
}

export default WalletTransactions