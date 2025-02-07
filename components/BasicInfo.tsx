import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { YStack, XStack } from 'tamagui'
import Feather from '@expo/vector-icons/Feather'

const BasicInfo = ({ editable }: { editable: boolean }) => {
    return (
        <YStack gap="$4">
            <YStack gap="$3">
                <XStack gap="$4" justifyContent='space-between' alignItems='center'>
                    <Text className='text-sm text-white font-firamedium'>Basic Info</Text>
                    {editable && <TouchableOpacity activeOpacity={0.8}>
                        <XStack>
                            <Text className='text-sm text-[#DD3FE5] font-firaregular'>Edit</Text>
                            <Feather name="edit-3" size={16} color="#DD3FE5" />
                        </XStack>
                    </TouchableOpacity>}
                </XStack>
                <YStack gap="$3">
                    <View className='p-4 rounded-lg bg-[#5B5B5B]'>
                        <YStack gap="$4">
                            <XStack gap="$4">
                                <YStack gap="$3" className='flex-1'>
                                    <Text className='text-sm font-firamedium text-white'>Gender </Text>
                                    <Text className=' text-white font-firaregular'>Female </Text>
                                </YStack>
                                <YStack gap="$3" className='flex-1'>
                                    <Text className='text-sm font-firamedium text-white'>Preferred Language </Text>
                                    <Text className=' text-white font-firaregular'>English </Text>
                                </YStack>
                            </XStack>
                            <XStack gap="$4">
                                <YStack gap="$3" className='flex-1'>
                                    <Text className='text-sm font-firamedium text-white'>Gender </Text>
                                    <Text className=' text-white font-firaregular'>Female </Text>
                                </YStack>
                                <YStack gap="$3" className='flex-1'>
                                    <Text className='text-sm font-firamedium text-white'>Preferred Language </Text>
                                    <Text className=' text-white font-firaregular'>English </Text>
                                </YStack>
                            </XStack>
                            <XStack gap="$4">
                                <YStack gap="$3" className='flex-1'>
                                    <Text className='text-sm font-firamedium text-white'>Gender </Text>
                                    <Text className=' text-white font-firaregular'>Female </Text>
                                </YStack>
                                <YStack gap="$3" className='flex-1'>
                                    <Text className='text-sm font-firamedium text-white'>Preferred Language </Text>
                                    <Text className=' text-white font-firaregular'>English </Text>
                                </YStack>
                            </XStack>
                            <XStack gap="$4">
                                <YStack gap="$3" className='flex-1'>
                                    <Text className='text-sm font-firamedium text-white'>Gender </Text>
                                    <Text className=' text-white font-firaregular'>Female </Text>
                                </YStack>
                                <YStack gap="$3" className='flex-1'>
                                    <Text className='text-sm font-firamedium text-white'>Preferred Language </Text>
                                    <Text className=' text-white font-firaregular'>English </Text>
                                </YStack>
                            </XStack>
                        </YStack>
                    </View>
                </YStack>
            </YStack>
            <YStack gap="$3">
                <Text className='text-sm text-white font-firamedium'>Basic Info</Text>
                <YStack gap="$3">
                    <View className='p-4 rounded-lg bg-[#5B5B5B]'>
                        <YStack gap="$4">
                            <XStack gap="$4">
                                <YStack gap="$3" className='flex-1'>
                                    <Text className='text-sm font-firamedium text-white'>Gender </Text>
                                    <Text className=' text-white'>Female </Text>
                                </YStack>
                                <YStack gap="$3" className='flex-1'>
                                    <Text className='text-sm font-firamedium text-white'>Preferred Language </Text>
                                    <Text className=' text-white'>English </Text>
                                </YStack>
                            </XStack>
                            <XStack gap="$4">
                                <YStack gap="$3" className='flex-1'>
                                    <Text className='text-sm font-firamedium text-white'>Gender </Text>
                                    <Text className=' text-white'>Female </Text>
                                </YStack>
                                <YStack gap="$3" className='flex-1'>
                                    <Text className='text-sm font-firamedium text-white'>Preferred Language </Text>
                                    <Text className=' text-white'>English </Text>
                                </YStack>
                            </XStack>
                            <XStack gap="$4">
                                <YStack gap="$3" className='flex-1'>
                                    <Text className='text-sm font-firamedium text-white'>Gender </Text>
                                    <Text className=' text-white'>Female </Text>
                                </YStack>
                                <YStack gap="$3" className='flex-1'>
                                    <Text className='text-sm font-firamedium text-white'>Preferred Language </Text>
                                    <Text className=' text-white'>English </Text>
                                </YStack>
                            </XStack>
                            <XStack gap="$4">
                                <YStack gap="$3" className='flex-1'>
                                    <Text className='text-sm font-firamedium text-white'>Gender </Text>
                                    <Text className=' text-white'>Female </Text>
                                </YStack>
                                <YStack gap="$3" className='flex-1'>
                                    <Text className='text-sm font-firamedium text-white'>Preferred Language </Text>
                                    <Text className=' text-white'>English </Text>
                                </YStack>
                            </XStack>
                        </YStack>
                    </View>
                </YStack>
            </YStack>
            <YStack gap="$3">
                <Text className='text-sm text-white font-firamedium'>Basic Info</Text>
                <YStack gap="$3">
                    <View className='p-4 rounded-lg bg-[#5B5B5B]'>
                        <YStack gap="$4">
                            <XStack gap="$4">
                                <YStack gap="$3" className='flex-1'>
                                    <Text className='text-sm font-firamedium text-white'>Gender </Text>
                                    <Text className=' text-white'>Female </Text>
                                </YStack>
                                <YStack gap="$3" className='flex-1'>
                                    <Text className='text-sm font-firamedium text-white'>Preferred Language </Text>
                                    <Text className=' text-white'>English </Text>
                                </YStack>
                            </XStack>
                            <XStack gap="$4">
                                <YStack gap="$3" className='flex-1'>
                                    <Text className='text-sm font-firamedium text-white'>Gender </Text>
                                    <Text className=' text-white'>Female </Text>
                                </YStack>
                                <YStack gap="$3" className='flex-1'>
                                    <Text className='text-sm font-firamedium text-white'>Preferred Language </Text>
                                    <Text className=' text-white'>English </Text>
                                </YStack>
                            </XStack>
                            <XStack gap="$4">
                                <YStack gap="$3" className='flex-1'>
                                    <Text className='text-sm font-firamedium text-white'>Gender </Text>
                                    <Text className=' text-white'>Female </Text>
                                </YStack>
                                <YStack gap="$3" className='flex-1'>
                                    <Text className='text-sm font-firamedium text-white'>Preferred Language </Text>
                                    <Text className=' text-white'>English </Text>
                                </YStack>
                            </XStack>
                            <XStack gap="$4">
                                <YStack gap="$3" className='flex-1'>
                                    <Text className='text-sm font-firamedium text-white'>Gender </Text>
                                    <Text className=' text-white'>Female </Text>
                                </YStack>
                                <YStack gap="$3" className='flex-1'>
                                    <Text className='text-sm font-firamedium text-white'>Preferred Language </Text>
                                    <Text className=' text-white'>English </Text>
                                </YStack>
                            </XStack>
                        </YStack>
                    </View>
                </YStack>
            </YStack>
        </YStack>
    )
}

export default BasicInfo