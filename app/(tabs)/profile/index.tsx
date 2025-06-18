import { Text, TouchableOpacity, ScrollView, View, Alert } from 'react-native';
import { XStack, Avatar, Sheet, } from 'tamagui';
import { Link, router, Stack } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import AccessIcon from '@/components/icons/AccessIcon';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Fragment, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { signUserOut } from '@/redux/thunks/authActions';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Feather, Octicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import * as WebBrowser from 'expo-web-browser';
import { Loader } from '@/components/loader/LoaderWrapper';

export default function ProfileScreen() {
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const dispatch = useAppDispatch();
  const { userInfo } = useAppSelector(state => state.auth);
  const { currentSubscription, isActive } = useAppSelector(state => state.subscription);

  const handleLogOut = async () => {
    dispatch(signUserOut()).unwrap().then(() => router.replace('/(auth)/sign-in'))
  }

  const getSubscriptionPlanNameFromPlanId = (planId?: string) => {
    return planId ? planId.split('_').join(' ') : 'Unknown';
  }

  const openPrivacyPolicy = async () => {
    await WebBrowser.openBrowserAsync('https://dazzzle.org/privacy-policy');
  };

  const openInstagram = async () => {
    await WebBrowser.openBrowserAsync('https://www.instagram.com/dazzzledating/');
  };

  const openContactUsPage = async () => {
    await WebBrowser.openBrowserAsync('https://dazzzle.org/contact');
  };

  return (
    <Fragment>
      <Stack.Screen
        options={{
          headerTitle: 'Profile',
          headerStyle: { backgroundColor: '#1A1A1A' }
        }}
      />
      <ScrollView className='h-full bg-[#1A1A1A]'>
        <View className='h-full p-4'>
          <XStack alignItems="center" gap="$4">
            <Avatar circular size="$5">
              <Avatar.Image
                accessibilityLabel="Nate Wienert"
                src={userInfo?.profile_picture_url}
              />
              <Avatar.Fallback delayMs={600} backgroundColor="$blue10" />
            </Avatar>
            <View>
              <Text className='text-xl text-white font-firasemibold'>{userInfo?.username}</Text>
              <Link className='text-sm text-tertiary font-firaregular py-2' href='/profile/my-profile'>View Profile</Link>
            </View>
          </XStack>
          <View className='mt-4'>
            <View className=''>
              <Text className='text-white my-3 font-firamedium text-sm'>Account</Text>
              <TouchableOpacity activeOpacity={0.8} onPress={() => setIsSubscriptionModalOpen(true)}>
                <View className='flex-row justify-between py-3 px-4 bg-[#5B5B5B] text-white border-b-white rounded-t-xl border-b-[0.5px]'>
                  <View className='flex-row items-center space-x-2'>
                    <MaterialCommunityIcons name="crown-circle-outline" size={20} color="#E2E3DD" />
                    <Text className='text-white text-base font-firamedium'>Subscriptions</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#E2E3DD" />
                </View>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.8} onPress={() => router.push('/profile/wallet-transactions')}>
                <View className='flex-row justify-between py-3 px-4 bg-[#5B5B5B] text-white border-b-white border-b-[0.5px]'>
                  <View className='flex-row items-center space-x-2'>
                    <Ionicons name="wallet-outline" size={20} color="#E2E3DD" />
                    <Text className='text-white text-base font-firamedium'>Transactions</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#E2E3DD" />
                </View>
              </TouchableOpacity>
              {/* <TouchableOpacity activeOpacity={0.8} onPress={() => router.push('/profile/visitors')}>
                <View className='flex-row justify-between py-3 px-4 bg-[#5B5B5B] text-white border-b-white border-b-[0.5px]'>
                  <View className='flex-row items-center space-x-2'>
                    <Ionicons name="people-outline" size={20} color="#E2E3DD" />
                    <Text className='text-white text-base font-firamedium'>Visitors</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#E2E3DD" />
                </View>
              </TouchableOpacity> */}
              <TouchableOpacity activeOpacity={0.8} onPress={() => router.push('/profile/blocked-users')}>
                <View className='flex-row justify-between py-3 px-4 bg-[#5B5B5B] text-white border-b-white border-b-[0.5px]'>
                  <View className='flex-row items-center space-x-2'>
                    <Octicons name="blocked" size={20} color="#E2E3DD" />
                    <Text className='text-white text-base font-firamedium'>My Blocked List</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#E2E3DD" />
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/profile/settings')} activeOpacity={0.8}>
                <View className='flex-row justify-between py-3 px-4 bg-[#5B5B5B] text-white border-b-white rounded-b-xl'>
                  <View className='flex-row items-center space-x-2'>
                    {/* <Ionicons name="notifications-outline" size={20} color="#E2E3DD" /> */}
                    <Feather name="bell" size={20} color="#E2E3DD" />
                    <Text className='text-white text-base font-firamedium'>Notification Settings</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#E2E3DD" />
                </View>
              </TouchableOpacity>
            </View>

            <View>
              <Text className='text-white my-3 font-firamedium text-sm'>Security</Text>
              <TouchableOpacity onPress={() => router.push('/profile/change-password')} activeOpacity={0.8}>
                <View className='flex-row justify-between py-3 px-4 bg-[#5B5B5B] text-white border-b-white rounded-t-xl border-b-[0.5px]'>
                  <View className='flex-row items-center space-x-2'>
                    <AccessIcon />
                    <Text className='text-white text-base font-firamedium'>Change Password</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#E2E3DD" />
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/profile/change-email')} activeOpacity={0.8}>
                <View className='flex-row justify-between py-3 px-4 bg-[#5B5B5B] text-white border-b-white rounded-b-xl'>
                  <View className='flex-row items-center space-x-2'>
                    <MaterialCommunityIcons name="email-edit-outline" size={20} color="#E2E3DD" />
                    <Text className='text-white text-base font-firamedium'>Change Email</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#E2E3DD" />
                </View>
              </TouchableOpacity>
            </View>
            <View>
              <Text className='text-white my-3 font-firamedium text-sm'>Legal</Text>
              {/* <TouchableOpacity activeOpacity={0.8} onPress={() => Alert.alert('Coming Soon')}>
                <View className='flex-row justify-between py-3 px-4 bg-[#5B5B5B] text-white border-b-white rounded-t-xl border-b-[0.5px]'>
                  <View className='flex-row items-center space-x-2'>
                    <Feather name="file-text" size={20} color="#E2E3DD" />
                    <Text className='text-white text-base font-firamedium'>Terms and Conditions</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#E2E3DD" />
                </View>
              </TouchableOpacity> */}
              <TouchableOpacity activeOpacity={0.8} onPress={openPrivacyPolicy}>
                <View className='flex-row justify-between py-3 px-4 bg-[#5B5B5B] text-white border-b-white rounded-xl'>
                  <View className='flex-row items-center space-x-2'>
                    <MaterialCommunityIcons name="shield-key-outline" size={20} color="#E2E3DD" />
                    <Text className='text-white text-base font-firamedium'>Privacy Policy</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#E2E3DD" />
                </View>
              </TouchableOpacity>
            </View>

            <View>
              <Text className='text-white my-3 font-firamedium text-sm'>More</Text>
              <TouchableOpacity activeOpacity={0.8} onPress={openInstagram}>
                <View className='flex-row justify-between py-3 px-4 bg-[#5B5B5B] text-white border-b-white rounded-xl'>
                  <View className='flex-row items-center space-x-2'>
                    <Ionicons name="logo-instagram" size={20} color="#E2E3DD" />
                    <Text className='text-white text-base font-firamedium'>Follow us on instagram</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#E2E3DD" />
                </View>
              </TouchableOpacity>
              {/* <TouchableOpacity activeOpacity={0.8} onPress={() => Alert.alert('Coming Soon')}>
                <View className='flex-row justify-between py-3 px-4 bg-[#5B5B5B] text-white border-b-white rounded-b-xl'>
                  <View className='flex-row items-center space-x-2'>
                    <Ionicons name="logo-tiktok" size={20} color="#E2E3DD" />
                    <Text className='text-white text-base font-firamedium'>Follow us on tiktok</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#E2E3DD" />
                </View>
              </TouchableOpacity> */}
            </View>

            <View className='mt-4'>
              <TouchableOpacity activeOpacity={0.8} onPress={openContactUsPage}>
                <View className='flex-row justify-between py-3 px-4 bg-[#5B5B5B] text-white border-b-white rounded-t-xl border-b-[0.5px]'>
                  <View className='flex-row items-center space-x-2'>
                    <Ionicons name="help-circle-outline" size={20} color="#E2E3DD" />
                    <Text className='text-white text-base font-firamedium'>Help</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#E2E3DD" />
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleLogOut} activeOpacity={0.8}>
                <View className='flex-row justify-between py-3 px-4 bg-[#5B5B5B] border-b-white rounded-b-xl'>
                  <View className='flex-row items-center space-x-2'>
                    {/* <MailIcon /> */}
                    <MaterialIcons name="logout" size={24} color="#e34747" />
                    <Text className='text-[#e34747] text-base font-firamedium'>Log Out</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity className='h-[44px] w-full bg-red-600 flex items-center justify-center rounded-xl my-6'>
            <Text className='text-white text-base font-firamedium'>
              Delete My Account
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Sheet
        forceRemoveScrollEnabled={isSubscriptionModalOpen}
        modal={true}
        open={isSubscriptionModalOpen}
        disableDrag={true}
        onOpenChange={setIsSubscriptionModalOpen}
        snapPointsMode={'fit'}
        dismissOnSnapToBottom
        zIndex={100_000}
        animation="quicker"
      >
        <Sheet.Overlay
          onPress={() => setIsSubscriptionModalOpen(false)}
          animation="quicker"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Sheet.Frame paddingBottom="$2" gap="$5" backgroundColor={'#1A1A1A'}>
          <View className='bg-[#1A1A1A] flex-row items-center  h-12 relative' >
            <View className='px-4' style={{ zIndex: 10 }}>
              <TouchableOpacity onPress={() => setIsSubscriptionModalOpen(false)} className='z-10 flex items-center  pr-4'>
                <Ionicons name="close-circle" size={24} color="#ffffff" />
              </TouchableOpacity>
            </View>

            <Text className='absolute  text-white text-base font-firamedium flex w-full flex-row text-center justify-center items-center'>Current Subscription</Text>
          </View>
          <View className='px-6 pb-10'>
            <View className="p-4 bg-[#FFFFFF1A] rounded-lg space-y-2">
              <Text className="text-white text-xl font-firabold capitalize">{getSubscriptionPlanNameFromPlanId(currentSubscription?.plan_id)}</Text>
              <Text className="text-white text-sm font-firaregular">Expires On: {dayjs(currentSubscription?.expiry_at).format('ddd, MMM D, YYYY h:mm A')}</Text>
            </View>
            <TouchableOpacity onPress={() => setIsSubscriptionModalOpen(false)} className='mt-4 flex items-center justify-center self-center py-2 w-fit px-4'>
              <Text className='text-white text-sm font-firamedium'>Close</Text>
            </TouchableOpacity>
          </View>
        </Sheet.Frame>
      </Sheet>
    </Fragment>
  );
}
