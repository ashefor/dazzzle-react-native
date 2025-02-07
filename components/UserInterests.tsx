import { View, Text } from 'react-native'
import React from 'react'
import { XStack } from 'tamagui'

const UserInterests = () => {
        return (
            <XStack gap="$2.5" flexWrap="wrap">
                <View className='px-3 py-1.5 bg-[#FFFFFF1A] rounded-lg'>
                    <Text className='text-white text-sm font-firamedium'>Travel</Text>
                </View>
                <View className='px-3 py-1.5 bg-[#FFFFFF1A] rounded-lg'>
                    <Text className='text-white text-sm font-firamedium'>Music</Text>
                </View>
                <View className='px-3 py-1.5 bg-[#FFFFFF1A] rounded-lg'>
                    <Text className='text-white text-sm font-firamedium'>Cooking</Text>
                </View>
                <View className='px-3 py-1.5 bg-[#FFFFFF1A] rounded-lg'>
                    <Text className='text-white text-sm font-firamedium'>Dinner</Text>
                </View>
                <View className='px-3 py-1.5 bg-[#FFFFFF1A] rounded-lg'>
                    <Text className='text-white text-sm font-firamedium'>Social Media</Text>
                </View>
                <View className='px-3 py-1.5 bg-[#FFFFFF1A] rounded-lg'>
                    <Text className='text-white text-sm font-firamedium'>Shopping</Text>
                </View>
                <View className='px-3 py-1.5 bg-[#FFFFFF1A] rounded-lg'>
                    <Text className='text-white text-sm font-firamedium'>Dancing</Text>
                </View>
            </XStack>
        )
    }

export default UserInterests