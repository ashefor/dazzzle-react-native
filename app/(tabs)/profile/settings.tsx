import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import React, { Fragment, useEffect, useState } from 'react';
import { XStack, YStack } from 'tamagui';
import CustomButton from '@/components/CustomButton';
import { getItem, setItem } from '@/utils/asyncStorage';
import Toast from '@/components/toast/toast';
import { router, Stack } from 'expo-router';
import ArrowBackIcon from '@/components/icons/ArrowBackIcon';

const settings = () => {
    const [isEnabled, setIsEnabled] = useState(false);
    const [showVisitorsNotification, setShowVisitorsNotification] = useState(false);
    const [showLikesNotification, setShowLikesNotification] = useState(false);
    const [showMessagesNotification, setShowMessagesNotification] = useState(true);
    const [showLoginNotification, setShowLoginNotification] = useState(false);

    const toggleSwitch = () => setIsEnabled(previousState => !previousState);

    const toggleShowVisitorsNotification = () => setShowVisitorsNotification(previousState => !previousState);
    const toggleShowLikesNotification = () => setShowLikesNotification(previousState => !previousState);
    const toggleShowMessagesNotification = () => setShowMessagesNotification(previousState => !previousState);
    const toggleShowLoginNotification = () => setShowLoginNotification(previousState => !previousState);

    const saveNotificationsAndSaveToLocalStorage = async () => {
        await setItem('showVisitorsNotification', showVisitorsNotification);
        await setItem('showLikesNotification', showLikesNotification);
        await setItem('showMessagesNotification', showMessagesNotification);
        await setItem('showLoginNotification', showLoginNotification);

        Toast.success('Settings saved successfully');
    }

    const readNotificationsFromLocalStorage = async () => {
        const showVisitorsNotification = await getItem('showVisitorsNotification');
        const showLikesNotification = await getItem('showLikesNotification');
        const showMessagesNotification = await getItem('showMessagesNotification');
        const showLoginNotification = await getItem('showLoginNotification');

        setShowVisitorsNotification(showVisitorsNotification);
        setShowLikesNotification(showLikesNotification);
        setShowMessagesNotification(showMessagesNotification);
        setShowLoginNotification(showLoginNotification);
    }

    useEffect(() => {
        readNotificationsFromLocalStorage();
    }, [])

    return (
        <Fragment>
            <Stack.Screen
                options={{
                    headerTitle: 'Notification Settings',
                    headerStyle: { backgroundColor: '#1A1A1A' },
                    headerLeft: () => <TouchableOpacity onPress={() => router.back()} className='flex items-center justify-center pr-4 w-9 h-8'>
                        <ArrowBackIcon />
                    </TouchableOpacity>
                }}
            />
            <View className=' h-full'>
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
                                            thumbColor={showVisitorsNotification ? '#DD3FE5' : '#f4f3f4'}
                                            ios_backgroundColor="#3e3e3e"
                                            onValueChange={toggleShowVisitorsNotification}
                                            value={showVisitorsNotification}
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
                                            thumbColor={showMessagesNotification ? '#DD3FE5' : '#f4f3f4'}
                                            ios_backgroundColor="#3e3e3e"
                                            onValueChange={toggleShowMessagesNotification}
                                            value={showMessagesNotification}
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
                                            thumbColor={showLikesNotification ? '#DD3FE5' : '#f4f3f4'}
                                            ios_backgroundColor="#3e3e3e"
                                            onValueChange={toggleShowLikesNotification}
                                            value={showLikesNotification}
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
                                            thumbColor={showLoginNotification ? '#DD3FE5' : '#f4f3f4'}
                                            ios_backgroundColor="#3e3e3e"
                                            onValueChange={toggleShowLoginNotification}
                                            value={showLoginNotification}
                                        />
                                    </XStack>
                                </View>
                            </YStack>
                        </View>

                        <CustomButton title='Update' containerStyles='w-20 min-h-[36px] mt-6' handlePress={saveNotificationsAndSaveToLocalStorage} />
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
        </Fragment>
    )
}

export default settings