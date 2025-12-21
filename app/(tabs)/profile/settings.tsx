import { View, Text, ScrollView, Switch, Platform, Alert } from 'react-native';
import React, { Fragment, useEffect, useState } from 'react';
import CustomButton from '@/components/CustomButton';
import { getItem, setItem } from '@/utils/asyncStorage';
import Toast from '@/components/toast/toast';
import NavBar from '@/components/NavBar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import axiosRequest from '@/utils/axios';
import { ReactionCodes } from '@/models/general';

const settings = () => {
    const [isEnabled, setIsEnabled] = useState(false);
    const [saving, setSaving] = useState(false);
    const [showVisitorsNotification, setShowVisitorsNotification] = useState(false);
    const [showLikesNotification, setShowLikesNotification] = useState(false);
    const [showMessagesNotification, setShowMessagesNotification] = useState(true);
    const [showLoginNotification, setShowLoginNotification] = useState(false);
    const insets = useSafeAreaInsets();

    const toggleSwitch = () => setIsEnabled(previousState => !previousState);

    const toggleShowVisitorsNotification = () => setShowVisitorsNotification(previousState => !previousState);
    const toggleShowLikesNotification = () => setShowLikesNotification(previousState => !previousState);
    const toggleShowMessagesNotification = () => setShowMessagesNotification(previousState => !previousState);
    const toggleShowLoginNotification = () => setShowLoginNotification(previousState => !previousState);

    const saveNotificationsAndSaveToLocalStorage = async () => {
        try {
            await setItem('showVisitorsNotification', showVisitorsNotification);
            await setItem('showLikesNotification', showLikesNotification);
            await setItem('showMessagesNotification', showMessagesNotification);
            await setItem('showLoginNotification', showLoginNotification);
            router.back();
            Toast.success('Settings saved successfully');
        } catch (error) {
            console.error('Error saving notification settings:', error);
        }
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

    const saveNotificationSettings = async () => {
        try {
            const params = {
                pageType: 'notification',
                push_notification: showVisitorsNotification,
                message_notification: showMessagesNotification,
                like_notification: showLikesNotification,
                email_notification: showLoginNotification
            }
            setSaving(true);
            const response: any = await axiosRequest.post('/notification/user-setting-store', params)
            setSaving(false);
            if (response.reaction === ReactionCodes.SUCCESS) {
                Toast.success('Notification settings updated successfully');
                saveNotificationsAndSaveToLocalStorage();
            }
        } catch (error) {
            setSaving(false);
            Alert.alert('Error', 'Unable to update notification settings')
        }
    }

    return (
        <Fragment>
            <View className=' h-full bg-white' style={{ paddingTop: Platform.OS === 'ios' ? 0 : insets.top, paddingBottom: insets.bottom }}>
                <NavBar title='Settings' />
                <ScrollView contentContainerStyle={{ paddingHorizontal: 16, flexGrow: 1, paddingBottom: insets.bottom + 20 }}>
                    <View className='mb-5'>
                        <Text className='text-sm text-black font-firaregular mb-2'>Notification Settings</Text>
                        <View className='bg-[#F2F2F7] pl-4 rounded-xl'>
                            <View className=' p-3 border-b border-[#F0F0F0]'>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                                    <Text className='font-firaregular flex-1'>
                                        Show Visitors Notification
                                    </Text>
                                    <Switch
                                        trackColor={{ false: '#767577', true: '#ffffff' }}
                                        thumbColor={showVisitorsNotification ? '#DD3FE5' : '#f4f3f4'}
                                        ios_backgroundColor="#3e3e3e"
                                        onValueChange={toggleShowVisitorsNotification}
                                        value={showVisitorsNotification}
                                    />
                                </View>
                            </View>
                            <View className=' p-3 border-b border-[#F0F0F0]'>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                                    <Text className=' font-firaregular flex-1'>
                                        Show Messages notification
                                    </Text>
                                    <Switch
                                        trackColor={{ false: '#767577', true: '#ffffff' }}
                                        thumbColor={showMessagesNotification ? '#DD3FE5' : '#f4f3f4'}
                                        ios_backgroundColor="#3e3e3e"
                                        onValueChange={toggleShowMessagesNotification}
                                        value={showMessagesNotification}
                                    />
                                </View>
                            </View>
                            <View className=' p-3 border-b border-[#F0F0F0]'>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                                    <Text className=' font-firaregular flex-1'>
                                        Show Likes Notification
                                    </Text>
                                    <Switch
                                        trackColor={{ false: '#767577', true: '#ffffff' }}
                                        thumbColor={showLikesNotification ? '#DD3FE5' : '#f4f3f4'}
                                        ios_backgroundColor="#3e3e3e"
                                        onValueChange={toggleShowLikesNotification}
                                        value={showLikesNotification}
                                    />
                                </View>
                            </View>
                            <View className=' p-3'>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                                    <Text className=' font-firaregular flex-1'>
                                        Show Login Notification For Your Liked Users
                                    </Text>
                                    <Switch
                                        trackColor={{ false: '#AEAEB2', true: '#ffffff' }}
                                        thumbColor={showLoginNotification ? '#DD3FE5' : '#f4f3f4'}
                                        ios_backgroundColor="#3e3e3e"
                                        onValueChange={toggleShowLoginNotification}
                                        value={showLoginNotification}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>

                    <CustomButton title='Update' isLoading={saving} disabled={saving} containerStyles='w-2/5 mt-6' handlePress={saveNotificationSettings} />
                </ScrollView>
            </View>
        </Fragment>
    )
}

export default settings