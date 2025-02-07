import CustomButton from '@/components/CustomButton';
import Images from '@/constants/images';
import { useGlobalContext } from '@/context/GlobalProvider';
import { Redirect, router } from 'expo-router';
import { StatusBar, setStatusBarStyle } from 'expo-status-bar';
import { useEffect } from 'react';
import { View, Text, ScrollView, Image, ImageBackground, SafeAreaView } from 'react-native';
import { Button, XGroup, XStack, YStack } from 'tamagui'


export default function HomeScreen() {
  const { isLoggedIn, isLoading } = useGlobalContext();

  if (!isLoading && isLoggedIn) {
    return <Redirect href="./home" />;
  }
  return (
   <>
    <ImageBackground className='h-screen w-full' source={Images.onboard} >
      <SafeAreaView className='h-full bg-black/[0.6]'>
      <View className='w-full h-full items-center justify-end px-4 py-6'>
          <Image source={Images.logo} className='w-[130px] h-[84px]' resizeMode='contain' />
          {/* <Image source={Images.cards} className='max-w-[380px] w-full h-[380px]' resizeMode='contain'/> */}
          <View className='relative mt-5'>
          <Text className='text-3xl text-white font-firabold text-center'>
            Discover endless possibiilty with <Text className='text-tertiary'>Dazzzle</Text>
          </Text>
          {/* <Image source={Images.path} className='w-[136px] h-[15px] absolute -bottom-2 -right-8' resizeMode='contain'/> */}
          </View>
          <Text className='text-base font-firaregular text-gray-100 mt-7 text-center'> Lorem ipsum dolor sit amet, consectetur adipiscing elit. </Text>
          {/* <CustomButton 
          title='Continue with Email'
          handlePress={() => router.push('/sign-in')}
          containerStyles='w-full mt-7'
          /> */}
        <CustomButton title='Continue with Email' containerStyles='mt-7 w-full' handlePress={() => router.push('/sign-in')}/>
      </View>
      </SafeAreaView>
    </ImageBackground>
    <StatusBar style="light" />
   </>
  );
}
