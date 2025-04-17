import { Text, TouchableOpacity, ScrollView } from 'react-native';
import { XStack, Avatar, View, YStack, } from 'tamagui';
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
import { getItem, clear, removeItem } from '@/utils/asyncStorage';

export default function ProfileScreen() {
  const {setAuthState} = useGlobalContext();
      const { axiosRequest } = useAxiosContext();

  const handleLogOut = async() => {
    const {data} = await axiosRequest.post('/user/logout');
    if (data.reaction === ReactionCodes.SUCCESS) {
      await removeItem('dazzzle-user');
      await removeItem('dazzzle-token');
      setAuthState(undefined);
      router.replace('/(auth)/sign-in');
    }
  }

  return (
    <ScrollView className='h-full'>
      <View className='h-screen bg-[#1A1A1A] p-4'>
        <XStack alignItems="center" gap="$4">
          <Avatar circular size="$5">
            <Avatar.Image
              accessibilityLabel="Nate Wienert"
              src="https://images.unsplash.com/photo-1531384441138-2736e62e0919?&w=100&h=100&dpr=2&q=80"
            />
            <Avatar.Fallback delayMs={600} backgroundColor="$blue10" />
          </Avatar>
          <YStack>
            <Text className='text-xl text-white font-firasemibold'>Michael Ashefor</Text>
            <Link className='text-sm text-tertiary font-firaregular py-2' href='/profile/my-profile'>View Profile</Link>
          </YStack>
        </XStack>
        <YStack gap="$4" className='mt-8'>
        <YStack className='mt-8'>
          <TouchableOpacity activeOpacity={0.8}>
            <XStack justifyContent='space-between' className='py-3 px-4 bg-[#5B5B5B] text-white border-b-white rounded-t-xl border-b bprder-white'>
              <XStack alignItems='center' gap="$4">
                <Ionicons name="star-outline" size={20} color="#E2E3DD" />
                <Text className='text-white text-base font-firamedium'>Subscription</Text>
              </XStack>
              <Ionicons name="chevron-forward" size={20} color="#E2E3DD" />
            </XStack>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.8} onPress={() => router.push('/profile/visitors')}>
            <XStack justifyContent='space-between' className='py-3 px-4 bg-[#5B5B5B] text-white border-b-white border-b bprder-white'>
              <XStack alignItems='center' gap="$4">
                <Ionicons name="people-outline" size={20} color="#E2E3DD" />
                <Text className='text-white text-base font-firamedium'>Visitors</Text>
              </XStack>
              <Ionicons name="chevron-forward" size={20} color="#E2E3DD" />
            </XStack>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.8} onPress={() => router.push('/profile/blocked-users')}>
            <XStack justifyContent='space-between' className='py-3 px-4 bg-[#5B5B5B] text-white border-b-white border-b bprder-white'>
              <XStack alignItems='center' gap="$4">
                <Entypo name="block" size={20} color="#E2E3DD" />
                <Text className='text-white text-base font-firamedium'>My Blocked List</Text>
              </XStack>
              <Ionicons name="chevron-forward" size={20} color="#E2E3DD" />
            </XStack>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/profile/settings')} activeOpacity={0.8}>
            <XStack justifyContent='space-between' className='py-3 px-4 bg-[#5B5B5B] text-white border-b-white border-b bprder-white'>
              <XStack alignItems='center' gap="$4">
                <GearIcon />
                <Text className='text-white text-base font-firamedium'>Settings</Text>
              </XStack>
              <Ionicons name="chevron-forward" size={20} color="#E2E3DD" />
            </XStack>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/profile/change-password')} activeOpacity={0.8}>
            <XStack justifyContent='space-between' className='py-3 px-4 bg-[#5B5B5B] text-white border-b-white border-b bprder-white'>
              <XStack alignItems='center' gap="$4">
                <AccessIcon />
                <Text className='text-white text-base font-firamedium'>Change Password</Text>
              </XStack>
              <Ionicons name="chevron-forward" size={20} color="#E2E3DD" />
            </XStack>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/profile/change-email')} activeOpacity={0.8}>
            <XStack justifyContent='space-between' className='py-3 px-4 bg-[#5B5B5B] text-white border-b-white rounded-b-xl'>
              <XStack alignItems='center' gap="$4">
                <MailIcon />
                <Text className='text-white text-base font-firamedium'>Change Email</Text>
              </XStack>
              <Ionicons name="chevron-forward" size={20} color="#E2E3DD" />
            </XStack>
          </TouchableOpacity>
        </YStack>

        <YStack>
        <TouchableOpacity activeOpacity={0.8}>
            <XStack justifyContent='space-between' className='py-3 px-4 bg-[#5B5B5B] text-white border-b-white rounded-t-xl border-b bprder-white'>
              <XStack alignItems='center' gap="$4">
                <Ionicons name="help-circle-outline" size={20} color="#E2E3DD" />
                <Text className='text-white text-base font-firamedium'>Help</Text>
              </XStack>
              <Ionicons name="chevron-forward" size={20} color="#E2E3DD" />
            </XStack>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogOut} activeOpacity={0.8}>
            <XStack justifyContent='space-between' className='py-3 px-4 bg-[#5B5B5B] border-b-white rounded-b-xl'>
              <XStack alignItems='center' gap="$4">
                {/* <MailIcon /> */}
                <MaterialIcons name="logout" size={24} color="#e34747" />
                <Text className='text-[#e34747] text-base font-firamedium'>Log Out</Text>
              </XStack>
            </XStack>
          </TouchableOpacity>
        </YStack>
        </YStack>
      </View>
    </ScrollView>
  );
}
