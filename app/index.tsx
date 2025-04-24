import CustomButton from '@/components/CustomButton';
import Images from '@/constants/images';
import { useGlobalContext } from '@/context/GlobalProvider';
import { Redirect, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { View, Text, Image, ImageBackground, SafeAreaView, Alert } from 'react-native';
import { Spinner } from 'tamagui';
import axios from 'axios';
import { API_URL } from '@/constants/constants';
import { BasicAppInterfaceResponse, ReactionCodes } from '@/models/general';
import { setItem } from '@/utils/asyncStorage';


export default function HomeScreen() {
  const { isLoading, authState } = useGlobalContext();
  const [loadedGeneralConfigSettings, setLoadedGeneralConfigSettings] = useState<boolean>(true);
  const [loadingGeneralConfigSettings, setLoadingGeneralConfigSettings] = useState<boolean>(false);

  console.log('isLoading', isLoading);
  const loadInitialSettings = async () => {
    try {
      setLoadingGeneralConfigSettings(true);
      const response = await axios.get(API_URL + '/user/prepare-sign-up')
      const responseData = response.data as BasicAppInterfaceResponse;
      if (responseData.reaction != ReactionCodes.SUCCESS) {
        throw new Error('Failed to load basic settings')
      } else {
        const generalConfigSettings = response.data;
        setItem('generalConfigSettings', generalConfigSettings);
        setLoadedGeneralConfigSettings(true);
        setLoadingGeneralConfigSettings(false);
      }
    } catch (error: any) {
      setLoadedGeneralConfigSettings(false);
      setLoadingGeneralConfigSettings(false);
      Alert.alert('Loaded error', error.message ? error.message : 'Failed to load basic settings')

    }
  }

  useEffect(() => {
    // loadInitialSettings();
  }, [])

  if (isLoading || loadingGeneralConfigSettings) {
    return <ImageBackground className='h-full w-full' source={Images.splash} >
    </ImageBackground>
  } else {
    console.log('loadedGeneralConfigSettings', loadedGeneralConfigSettings);
    if (loadedGeneralConfigSettings) {
      if (authState === 'completed') {
        return <Redirect href="./(tabs)" />;
      } else if (authState === 'incomplete') {
        return <Redirect href="./(auth)/sign-in" />
      } else {
        return <Redirect href="./landing" />
      }
    } else {
      return <View className='h-full bg-[#1A1A1A] flex items-center justify-center p-5'>
        <Text className='text-white'>
          Unable to load settings
        </Text>
        <CustomButton title='Try again' handlePress={() => loadInitialSettings()} containerStyles='mt-7 w-full' />
      </View>
    }
  }
}
