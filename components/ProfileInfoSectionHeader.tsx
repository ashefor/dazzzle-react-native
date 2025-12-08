import { Feather } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity, View, Text } from "react-native";

export const ProfileInfoSectionHeader = React.memo(({ title, onEdit, editable }: { title: string; onEdit?: () => void; editable?: boolean }) => (
    <View className="flex-row justify-between items-center mb-2 mt-6 px-4">
        <Text className="text-base font-firamedium text-black">{title}</Text>
        {editable && (
            <TouchableOpacity onPress={onEdit} className="flex-row items-center">
                <Feather name="edit-2" size={14} color="#D946EF" />
                <Text className="text-primary font-firamedium ml-1">Edit</Text>
            </TouchableOpacity>
        )}
    </View>
));