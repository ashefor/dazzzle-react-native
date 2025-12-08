import React from "react";
import { ActivityIndicator, View, Text } from "react-native";

export const ProfileInfoItem = React.memo(({ icon, label, value, loading }: { icon: any; label: string; value: string | React.ReactNode, loading?: boolean }) => {
    const renderValue = () => {
        if (!value) {
            return <Text className="flex-1 text-right text-black text-xs font-firaregular" numberOfLines={1}>{'-'}</Text>;
        }
        if (typeof value === 'string') {
            return <Text className="flex-1 text-right text-black text-xs font-firaregular" numberOfLines={1}>{value}</Text>;
        } else {
            return value;
        }
    };
    return (
        (
            <View className="flex-row items-center py-3 border-b border-[#F2F2F7] last:border-0">
                <View className="w-8 items-center justify-center mr-2">
                    {icon}
                </View>
                <Text className="font-firamedium text-black text-xs w-1/3">{label}</Text>
                {loading ? (
                    <ActivityIndicator className='ml-auto' size="small" color="#D946EF" />
                ) : (
                    renderValue()
                )}
            </View>
        )
    )
});