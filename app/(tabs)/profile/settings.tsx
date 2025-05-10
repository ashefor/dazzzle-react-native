import { View, Text, ScrollView, TouchableHighlight, TouchableOpacity, Switch } from 'react-native'
import React, { useState } from 'react'
import { Checkbox, Label, XStack, YStack } from 'tamagui';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import CustomButton from '@/components/CustomButton';

const settings = () => {
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);
    return (
        <View className='bg-[#1A1A1A] h-full'>
            <ScrollView>
                <View className='px-4 py-5'>
                    <View className='mb-5'>
                        <Text className='text-sm text-white font-firaregular mb-2'>Notification Settings</Text>
                        <YStack className='bg-[#5B5B5B] pl-4 rounded-xl'>
                           <View className=' py-3 border-b-[0.5px] pr-4 border-b-white'>
                           <XStack alignItems="center" justifyContent='space-between' gap="$2.5">
                                <Text className='text-white font-firaregular flex-1'>
                                    Show Visitors Notification
                                </Text>
                                <Switch
                                    trackColor={{ false: '#767577', true: '#ffffff' }}
                                    thumbColor={isEnabled ? '#DD3FE5' : '#f4f3f4'}
                                    ios_backgroundColor="#3e3e3e"
                                    onValueChange={toggleSwitch}
                                    value={isEnabled}
                                />
                            </XStack>
                           </View>
                           <View className=' py-3 border-b-[0.5px] pr-4 border-b-white'>
                           <XStack alignItems="center" justifyContent='space-between' gap="$2.5">
                                <Text className='text-white font-firaregular flex-1'>
                                Show Messages notification
                                </Text>
                                <Switch
                                    trackColor={{ false: '#767577', true: '#ffffff' }}
                                    thumbColor={isEnabled ? '#DD3FE5' : '#f4f3f4'}
                                    ios_backgroundColor="#3e3e3e"
                                    onValueChange={toggleSwitch}
                                    value={isEnabled}
                                />
                            </XStack>
                           </View>
                           <View className=' py-3 border-b-[0.5px] pr-4 border-b-white'>
                           <XStack alignItems="center" justifyContent='space-between' gap="$2.5">
                                <Text className='text-white font-firaregular flex-1'>
                                Show Likes Notification
                                </Text>
                                <Switch
                                    trackColor={{ false: '#767577', true: '#ffffff' }}
                                    thumbColor={isEnabled ? '#DD3FE5' : '#f4f3f4'}
                                    ios_backgroundColor="#3e3e3e"
                                    onValueChange={toggleSwitch}
                                    value={isEnabled}
                                />
                            </XStack>
                           </View>
                           <View className=' py-3 border-b-[0.5px] pr-4'>
                           <XStack alignItems="center" justifyContent='space-between' gap="$2.5">
                                <Text className='text-white font-firaregular flex-1'>
                                Show Login Notification For Your Liked Users
                                </Text>
                                <Switch
                                    trackColor={{ false: '#767577', true: '#ffffff' }}
                                    thumbColor={isEnabled ? '#DD3FE5' : '#f4f3f4'}
                                    ios_backgroundColor="#3e3e3e"
                                    onValueChange={toggleSwitch}
                                    value={isEnabled}
                                />
                            </XStack>
                           </View>
                        </YStack>
                    </View>

                    <CustomButton title='Update' containerStyles='w-20 min-h-[36px] mt-6' handlePress={() => { }} />
                    {/* <View className='mb-5'>
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
                    </View> */}
                </View>
            </ScrollView>
        </View>
    )
}

export default settings