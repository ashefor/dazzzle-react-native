import { Text, View, TouchableOpacity } from 'react-native'
import React, { forwardRef } from 'react'
const CustomButton = forwardRef<typeof TouchableOpacity, {
    title: string;
    handlePress: () => void;
    containerStyles?: string;
    textStyles?: string;
    isLoading?: boolean;
}>((props, ref) => {
    const { title, handlePress, containerStyles, textStyles, isLoading } = props
    return (
        <TouchableOpacity 
        onPress={handlePress}
        activeOpacity={0.7}
        disabled={isLoading}
        className={`bg-tertiary rounded-lg min-h-[44px] justify-center items-center ${containerStyles} ${isLoading ? 'opacity-50' : ''}`}>
            <Text className={`text-white font-firamedium text-base ${textStyles}`}>
                {title}
            </Text>
        </TouchableOpacity>
    )
})

export default CustomButton
