import { useAppSelector } from "@/hooks/reduxHooks";
import { View, Text, ScrollView } from "react-native";
import dayjs, { Dayjs } from 'dayjs'

const ViewSubscriptions = () => {
  const { currentSubscription, isActive } = useAppSelector(state => state.subscription);
    return (
        <ScrollView className='h-full bg-[#1A1A1A]'>
            <View className='h-full p-4'>
                <View className="p-4 bg-[#FFFFFF1A] rounded-lg">
                    <Text className="text-white text-sm font-firamedium">Active Subscription</Text>
                    <Text className="text-white text-sm font-firaregular">{currentSubscription?.plan_id}</Text>
                    <Text className="text-white text-sm font-firaregular">{isActive ? 'Active' : 'Not Active'}</Text>
                    <Text className="text-white text-sm font-firaregular">Expires On: {dayjs(currentSubscription?.expiry_at).format('DD/MM/YYYY HH:mm')}</Text>
                </View>
            </View>
        </ScrollView>
    )
}

export default ViewSubscriptions