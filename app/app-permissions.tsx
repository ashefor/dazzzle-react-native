import React, { useEffect, useState } from 'react';
import { View, Text, Image, AppState, Alert, Platform, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Notifications from 'expo-notifications';
import * as TrackingTransparency from 'expo-tracking-transparency';
import CustomButton from '@/components/CustomButton';
import Images from '@/constants/images'; // Ensure you have an image for this
import { registerForPushNotificationsAsync } from '@/utils/notificationHandler'; // Your existing handler

export default function PermissionsScreen() {
  const [pushStatus, setPushStatus] = useState<Notifications.PermissionStatus>(
    Notifications.PermissionStatus.UNDETERMINED
  );
  const [trackingStatus, setTrackingStatus] = useState<TrackingTransparency.PermissionStatus>(
    TrackingTransparency.PermissionStatus.UNDETERMINED
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkPermissions();
    
    // Re-check when app comes to foreground (in case user went to settings)
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        checkPermissions();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const checkPermissions = async () => {
    const { status: notifStatus } = await Notifications.getPermissionsAsync();
    setPushStatus(notifStatus);

    if (Platform.OS === 'ios') {
      const { status: trackStatus } = await TrackingTransparency.getTrackingPermissionsAsync();
      setTrackingStatus(trackStatus);
    } else {
      // Android doesn't use ATT, so we consider it 'granted' or 'unavailable'
      setTrackingStatus(TrackingTransparency.PermissionStatus.GRANTED);
    }
  };

  const handleRequestPermissions = async () => {
    setLoading(true);
    try {
      // 1. Request Tracking (iOS only)
      if (Platform.OS === 'ios' && trackingStatus !== TrackingTransparency.PermissionStatus.GRANTED) {
        const { status } = await TrackingTransparency.requestTrackingPermissionsAsync();
        setTrackingStatus(status);
      }

      // 2. Request Notifications
      // We use your existing helper which handles the logic, or call requestPermissionsAsync directly
      if (pushStatus !== Notifications.PermissionStatus.GRANTED) {
        const { status } = await Notifications.requestPermissionsAsync();
        setPushStatus(status);
        
        // If granted, we can also register the token immediately
        if (status === Notifications.PermissionStatus.GRANTED) {
           await registerForPushNotificationsAsync();
        }
      } else {
          // Already granted, just ensure token is registered
           await registerForPushNotificationsAsync();
      }

      // 3. Navigate
      router.replace('/(tabs)');
      
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong updating permissions.');
    } finally {
      setLoading(false);
    }
  };

  const openSettings = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else {
      Linking.openSettings();
    }
  };

  const handleSkip = () => {
    Alert.alert(
      "Skip Permissions?",
      "If you skip, you won't receive alerts for new likes or messages. Are you sure?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Skip Anyway",
          style: "destructive",
          onPress: () => router.replace('/(tabs)')
        }
      ]
    );
  };

  const isAllGranted = 
    pushStatus === Notifications.PermissionStatus.GRANTED && 
    (Platform.OS !== 'ios' || trackingStatus === TrackingTransparency.PermissionStatus.GRANTED);

  return (
    <SafeAreaView className="flex-1 bg-white p-6 justify-between">
      <View className="items-center mt-10">
        {/* Replace with a relevant icon/image */}
        <Image source={Images.logo} className="w-24 h-24 mb-8" resizeMode="contain" />
        
        <Text className="text-2xl font-firabold text-center mb-4 text-black">
          Stay Connected
        </Text>
        
        <Text className="text-base font-firaregular text-center text-gray-600 mb-8">
          To provide you with the best experience, Dazzzle needs your permission to send match notifications and improve our services.
        </Text>

        <View className="w-full bg-gray-50 p-4 rounded-xl space-y-4">
            <View className="flex-row items-center justify-between">
                <Text className="font-firamedium text-black">Notifications</Text>
                <Text className={`font-firabold ${pushStatus === 'granted' ? 'text-green-500' : 'text-gray-400'}`}>
                    {pushStatus === 'granted' ? 'Allowed' : 'Pending'}
                </Text>
            </View>
            <View className="h-[1px] bg-gray-200" />
            {Platform.OS === 'ios' && (
                <View className="flex-row items-center justify-between">
                    <Text className="font-firamedium text-black">App Tracking</Text>
                    <Text className={`font-firabold ${trackingStatus === 'granted' ? 'text-green-500' : 'text-gray-400'}`}>
                        {trackingStatus === 'granted' ? 'Allowed' : 'Pending'}
                    </Text>
                </View>
            )}
        </View>
      </View>

      <View className="gap-y-3">
        {pushStatus === Notifications.PermissionStatus.DENIED ? (
             <CustomButton 
                title="Open Settings" 
                handlePress={openSettings} 
                containerStyles="bg-gray-800"
            />
        ) : (
            <CustomButton 
                title={isAllGranted ? "Next" : "Continue"} 
                handlePress={handleRequestPermissions} 
                disabled={loading}
            />
        )}
        
        {/* <TouchableOpacity onPress={handleSkip} className="py-4">
            <Text className="text-center font-firamedium text-gray-400">Skip for now</Text>
        </TouchableOpacity> */}
      </View>
    </SafeAreaView>
  );
}