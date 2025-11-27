import CustomButton from '@/components/CustomButton';
import Images from '@/constants/images';
import { Redirect, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, ImageBackground } from 'react-native';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { fetchAppConfig } from '@/redux/thunks/appActions';
import dayjs from 'dayjs';


export default function HomeScreen() {
  const dispatch = useAppDispatch();
  const { loading, appConfig, error } = useAppSelector(state => state.app);
  const { userInfo, userToken } = useAppSelector(state => state.auth);
  const { currentSubscription, } = useAppSelector(state => state.subscription);
  const [hasExpired, setHasExpired] = useState(false);

  // const loadInitialSettings = async () => {
  //   try {
  //     setLoadingGeneralConfigSettings(true);
  //     const response = await axios.get(API_URL + '/user/prepare-sign-up')
  //     const responseData = response.data as BasicAppInterfaceResponse;
  //     if (responseData.reaction != ReactionCodes.SUCCESS) {
  //       throw new Error('Failed to load basic settings')
  //     } else {
  //       const generalConfigSettings = response.data.data;
  //       setItem('generalConfigSettings', generalConfigSettings);
  //       setLoadedGeneralConfigSettings(true);
  //       setLoadingGeneralConfigSettings(false);
  //     }
  //   } catch (error: any) {
  //     setLoadedGeneralConfigSettings(false);
  //     setLoadingGeneralConfigSettings(false);
  //     Alert.alert('Loaded error', error.message ? error.message : 'Failed to load basic settings')

  //   }
  // }

  const fetchAppConfigSettings = async () => {
    dispatch(fetchAppConfig());
  }

  useEffect(() => {
    fetchAppConfigSettings();
    checkForExpiration();
  }, [])

  const checkForExpiration = () => {
    const intervalId = setInterval(() => {
      if (currentSubscription) {
        if (dayjs().isAfter(dayjs(currentSubscription.expiry_at))) {
          setHasExpired(true);
          clearInterval(intervalId);
          router.replace('/paywall')
        }
      }
    }, 1000);
  }


  if (loading) {
    return <ImageBackground className='h-full w-full' source={Images.splash} >
    </ImageBackground>
  } else {
    if (appConfig) {
      if (userToken) {
        return <Redirect href="./user-details" />;
      } else {
        return <Redirect href="./landing" />
      }
    } else {
      return <View className='h-full  flex items-center justify-center p-5'>
        <Text className='text-white'>
          Unable to load settings
        </Text>
        <CustomButton title='Try again' handlePress={fetchAppConfigSettings} containerStyles='mt-7 w-full' />
      </View>
    }
  }
}
