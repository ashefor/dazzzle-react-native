import { Text, TouchableOpacity, ScrollView, View, Alert } from 'react-native';
import { XStack, Avatar, } from 'tamagui';
import { Link, router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import Entypo from '@expo/vector-icons/Entypo';
import AccessIcon from '@/components/icons/AccessIcon';
import MailIcon from '@/components/icons/MailIcon';
import GearIcon from '@/components/icons/GearIcon';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useGlobalContext } from '@/context/GlobalProvider';
import { useAxiosContext } from '@/context/AxiosProvider';
import { ReactionCodes } from '@/models/general';
import { getItem, removeItem } from '@/utils/asyncStorage';
import { useEffect, useState } from 'react';
import { LoggedInUser, LoggedInUserProfile } from '@/models/user';

export default function ProfileScreen() {
  const { setAuthState } = useGlobalContext();
  const { axiosRequest } = useAxiosContext();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<LoggedInUserProfile | null>(null);

  const handleLogOut = async () => {
    const { data } = await axiosRequest.post('/user/logout');
    if (data.reaction === ReactionCodes.SUCCESS) {
      await removeItem('dazzzle-user');
      await removeItem('dazzzle-token');
      setAuthState(undefined);
      router.replace('/(auth)/sign-in');
    }
  }

  const fetchUserDetails = async () => {
    try {
      setIsLoading(true);
      const { profile } = await getItem('dazzzle-user') as LoggedInUser;
      if (profile) {
        setUser(profile);
      }
    } catch (error) {
      setIsLoading(false);
      setUser(null);
    }
  }

  useEffect(() => {
    fetchUserDetails();
  }, [])

  return (
    <ScrollView className='h-full'>
      <View className='h-screen bg-[#1A1A1A] p-4'>
        <XStack alignItems="center" gap="$4">
          <Avatar circular size="$5">
            <Avatar.Image
              accessibilityLabel="Nate Wienert"
              src={user?.profile_picture_url}
            />
            <Avatar.Fallback delayMs={600} backgroundColor="$blue10" />
          </Avatar>
          <View>
            <Text className='text-xl text-white font-firasemibold'>{user?.first_name} {user?.last_name}</Text>
            <Link className='text-sm text-tertiary font-firaregular py-2' href='/profile/my-profile'>View Profile</Link>
          </View>
        </XStack>
        <View className='mt-8 space-y-2'>
          <View className='mt-8'>
            <TouchableOpacity activeOpacity={0.8} onPress={() => Alert.alert('Coming Soon')}>
              <View className='flex-row justify-between py-3 px-4 bg-[#5B5B5B] text-white border-b-white rounded-t-xl border-b bprder-white'>
                <View className='flex-row items-center space-x-2'>
                  <Ionicons name="star-outline" size={20} color="#E2E3DD" />
                  <Text className='text-white text-base font-firamedium'>Subscriptions</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#E2E3DD" />
              </View>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.8} onPress={() => router.push('/profile/visitors')}>
              <View className='flex-row justify-between py-3 px-4 bg-[#5B5B5B] text-white border-b-white border-b bprder-white'>
                <View className='flex-row items-center space-x-2'>
                  <Ionicons name="people-outline" size={20} color="#E2E3DD" />
                  <Text className='text-white text-base font-firamedium'>Visitors</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#E2E3DD" />
              </View>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.8} onPress={() => router.push('/profile/blocked-users')}>
              <View className='flex-row justify-between py-3 px-4 bg-[#5B5B5B] text-white border-b-white border-b bprder-white'>
                <View className='flex-row items-center space-x-2'>
                  <Entypo name="block" size={20} color="#E2E3DD" />
                  <Text className='text-white text-base font-firamedium'>My Blocked List</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#E2E3DD" />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/profile/settings')} activeOpacity={0.8}>
              <View className='flex-row justify-between py-3 px-4 bg-[#5B5B5B] text-white border-b-white border-b bprder-white'>
                <View className='flex-row items-center space-x-2'>
                  <GearIcon />
                  <Text className='text-white text-base font-firamedium'>Settings</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#E2E3DD" />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/profile/change-password')} activeOpacity={0.8}>
              <View className='flex-row justify-between py-3 px-4 bg-[#5B5B5B] text-white border-b-white border-b bprder-white'>
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
                  <MailIcon />
                  <Text className='text-white text-base font-firamedium'>Change Email</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#E2E3DD" />
              </View>
            </TouchableOpacity>
          </View>

          <View>
            <TouchableOpacity activeOpacity={0.8} onPress={() => Alert.alert('Coming Soon')}>
              <View className='flex-row justify-between py-3 px-4 bg-[#5B5B5B] text-white border-b-white rounded-t-xl border-b bprder-white'>
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
      </View>
    </ScrollView>
  );
}
