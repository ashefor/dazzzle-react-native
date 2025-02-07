import { View, Text, ScrollView, TouchableHighlight, TouchableOpacity } from 'react-native'
import React from 'react'
import { Checkbox, Label, XStack, YStack } from 'tamagui';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import CustomButton from '@/components/CustomButton';

const settings = () => {
    return (
        <View className='bg-[#1A1A1A] h-full'>
            <ScrollView>
                <View className='px-4 py-5'>
                    <View className='mb-5'>
                    <Text className='text-sm text-white font-firaregular mb-2'>Notification Settings</Text>
                    <YStack className='bg-[#5B5B5B] px-4 py-4 rounded-xl'>
                        <XStack alignItems="center" gap="$2.5">
                            <Checkbox size="$4" className='bg-[#5B5B5B] border-2 border-white' id='show-visitors-notifications'>
                                <Checkbox.Indicator>
                                    <MaterialCommunityIcons name="check-bold" size={18} color="#ffffff" />
                                </Checkbox.Indicator>
                            </Checkbox>
                            <Label className='text-white font-firaregular' size="$4" htmlFor="show-visitors-notifications">
                                Show Visitors Notification
                            </Label>
                        </XStack>
                        <XStack alignItems="center" gap="$2.5">
                            <Checkbox size="$4" className='bg-[#5B5B5B] border-2 border-white' id='show-messages-notifications'>
                                <Checkbox.Indicator>
                                    <MaterialCommunityIcons name="check-bold" size={18} color="#ffffff" />
                                </Checkbox.Indicator>
                            </Checkbox>
                            <Label className='text-white font-firaregular' size="$4" htmlFor="show-messages-notifications">
                                Show Messages notification
                            </Label>
                        </XStack>
                        <XStack alignItems="center" gap="$2.5">
                            <Checkbox size="$4" className='bg-[#5B5B5B] border-2 border-white' id='show-likes-notifications'>
                                <Checkbox.Indicator>
                                    <MaterialCommunityIcons name="check-bold" size={18} color="#ffffff" />
                                </Checkbox.Indicator>
                            </Checkbox>
                            <Label className='text-white font-firaregular' size="$4" htmlFor="show-likes-notifications">
                                Show Likes Notification
                            </Label>
                        </XStack>
                        <XStack alignItems="center" gap="$2.5">
                            <Checkbox size="$4" className='bg-[#5B5B5B] border-2 border-white' id='show-login-notifications'>
                                <Checkbox.Indicator>
                                    <MaterialCommunityIcons name="check-bold" size={18} color="#ffffff" />
                                </Checkbox.Indicator>
                            </Checkbox>
                            <Label className='text-white font-firaregular' size="$4" htmlFor="show-login-notifications">
                                Show Login Notification For Your Liked Users
                            </Label>
                        </XStack>

                        <CustomButton title='Update' containerStyles='w-20 min-h-[36px] mt-6' handlePress={() => { }} />
                    </YStack>
                    </View>
                    <View className='mb-5'>
                    <Text className='text-sm text-white font-firaregular mb-2'>Delete account</Text>
                    <YStack className='bg-[#5B5B5B] px-4 py-4 rounded-xl'>
                        <Text className='text-white font-firaregular'>
                        All content including photos and other data will be permanently removed!
                        </Text>

                        <TouchableOpacity className='p-3 bg-[#EB4242] w-[120px] rounded-md mt-7'>
                            <Text className='text-white font-firaregular'>
                                Delete Account
                            </Text>
                        </TouchableOpacity>
                        
                    </YStack>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

export default settings