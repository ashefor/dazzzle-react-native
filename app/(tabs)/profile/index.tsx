import { StyleSheet, Image, Platform, Text, TouchableOpacity } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { SafeAreaView } from 'react-native-safe-area-context';
import { XStack, Avatar, View, YStack, ListItem, YGroup, Separator } from 'tamagui';
import { Link, router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import Entypo from '@expo/vector-icons/Entypo';
import AccessIcon from '@/components/icons/AccessIcon';
import MailIcon from '@/components/icons/MailIcon';
import GearIcon from '@/components/icons/GearIcon';

export default function ProfileScreen() {
  return (
    <View className='h-full bg-black/[0.7] p-4'>
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
        <Link className='text-sm text-tertiary font-firaregular' href='/profile/change-password'>View Profile</Link>
      </YStack>
    </XStack>
    
    {/* <YGroup  separator={<Separator />}  className='mt-8'>
      <YGroup.Item>
        <ListItem icon={() => <Ionicons name="star-outline" size={18} color="#E2E3DD" />}  iconAfter={() => <Ionicons name="chevron-forward" size={20} color="#E2E3DD" />}  className='bg-[#5B5B5B] text-white  text-base border-b-white'>
        Subsrciptions
        </ListItem>
      </YGroup.Item>
      <YGroup.Item>
        <ListItem icon={() => <Ionicons name="star-outline" size={18} color="#E2E3DD" />}  iconAfter={() => <Ionicons name="chevron-forward" size={20} color="#E2E3DD" />}  className='bg-[#5B5B5B] text-white text-base border-b-white'>
        My Blocked List
        </ListItem>
      </YGroup.Item>
      <YGroup.Item>
        <ListItem icon={() => <Ionicons name="star-outline" size={18} color="#E2E3DD" />}  iconAfter={() => <Ionicons name="chevron-forward" size={20} color="#E2E3DD" />}  className='bg-[#5B5B5B] text-white text-base border-b-white'>
        My Blocked List
        </ListItem>
      </YGroup.Item>
      <YGroup.Item>
        <ListItem icon={() => <Ionicons name="star-outline" size={18} color="#E2E3DD" />}  iconAfter={() => <Ionicons name="chevron-forward" size={20} color="#E2E3DD" />}  className='bg-[#5B5B5B] text-white  text-base border-b-white'>
        Settings
        </ListItem>
      </YGroup.Item>
      <YGroup.Item>
        <ListItem onPress={()=> alert('Hiii')} icon={() => <Ionicons name="star-outline" size={18} color="#E2E3DD" />}  iconAfter={() => <Ionicons name="chevron-forward" size={20} color="#E2E3DD" />}  className='bg-[#5B5B5B] text-white text-base border-b-white'>
        Change Password
        </ListItem>
      </YGroup.Item>
      <YGroup.Item>
        <ListItem icon={() => <Ionicons name="star-outline" size={18} color="#E2E3DD" />}  iconAfter={() => <Ionicons name="chevron-forward" size={20} color="#E2E3DD" />}  className='bg-[#5B5B5B] text-white text-base border-b-white'>
        Change Email
        </ListItem>
      </YGroup.Item>
    </YGroup> */}
    <YStack className='mt-8'>
    <TouchableOpacity activeOpacity={0.8}>
        <XStack justifyContent='space-between' className='py-3 px-4 bg-[#5B5B5B] text-white border-b-white rounded-t-xl border-b bprder-white'>
            <XStack alignItems='center' gap="$4">
            <Ionicons name="star-outline" size={20} color="#E2E3DD" />
            <Text className='text-white text-base font-firamedium'>Subscription</Text>
            </XStack>
            <Ionicons name="star-outline" size={20} color="#E2E3DD" />
        </XStack>
    </TouchableOpacity>
    <TouchableOpacity activeOpacity={0.8}>
        <XStack justifyContent='space-between' className='py-3 px-4 bg-[#5B5B5B] text-white border-b-white border-b bprder-white'>
            <XStack alignItems='center' gap="$4">
            <Ionicons name="people-outline" size={20} color="#E2E3DD" />
            <Text className='text-white text-base font-firamedium'>Visitors</Text>
            </XStack>
            <Ionicons name="star-outline" size={20} color="#E2E3DD" />
        </XStack>
    </TouchableOpacity>
    <TouchableOpacity activeOpacity={0.8}>
        <XStack justifyContent='space-between' className='py-3 px-4 bg-[#5B5B5B] text-white border-b-white border-b bprder-white'>
            <XStack alignItems='center' gap="$4">
            <Entypo name="block" size={20} color="#E2E3DD" />
            <Text className='text-white text-base font-firamedium'>My Blocked List</Text>
            </XStack>
            <Ionicons name="star-outline" size={20} color="#E2E3DD" />
        </XStack>
    </TouchableOpacity>
    <TouchableOpacity activeOpacity={0.8}>
        <XStack justifyContent='space-between' className='py-3 px-4 bg-[#5B5B5B] text-white border-b-white border-b bprder-white'>
            <XStack alignItems='center' gap="$4">
            <GearIcon/>
            <Text className='text-white text-base font-firamedium'>Settings</Text>
            </XStack>
            <Ionicons name="star-outline" size={20} color="#E2E3DD" />
        </XStack>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => router.push('/profile/change-password')} activeOpacity={0.8}>
        <XStack justifyContent='space-between' className='py-3 px-4 bg-[#5B5B5B] text-white border-b-white border-b bprder-white'>
            <XStack alignItems='center' gap="$4">
            <AccessIcon/>
            <Text className='text-white text-base font-firamedium'>Change Password</Text>
            </XStack>
            <Ionicons name="star-outline" size={20} color="#E2E3DD" />
        </XStack>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => router.push('/profile/change-email')} activeOpacity={0.8}>
        <XStack justifyContent='space-between' className='py-3 px-4 bg-[#5B5B5B] text-white border-b-white rounded-b-xl'>
            <XStack alignItems='center' gap="$4">
            <MailIcon/>
            <Text className='text-white text-base font-firamedium'>Change Email</Text>
            </XStack>
            <Ionicons name="star-outline" size={20} color="#E2E3DD" />
        </XStack>
    </TouchableOpacity>
    </YStack>
    </View>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
