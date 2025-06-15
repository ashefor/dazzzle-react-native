import CustomButton from '@/components/CustomButton';
import Images from '@/constants/images';
import { Redirect } from 'expo-router';
import { useEffect } from 'react';
import { View, Text, ImageBackground } from 'react-native';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { fetchAppConfig } from '@/redux/thunks/appActions';


export default function HomeScreen() {
  const dispatch = useAppDispatch();
  const { loading, appConfig } = useAppSelector(state => state.app);
  const { userInfo, userToken } = useAppSelector(state => state.auth);

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
    // loadInitialSettings();
    // fetchAppConfigSettings()
  }, [])

  if (loading) {
    console.log('loading');
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
      return <View className='h-full bg-[#1A1A1A] flex items-center justify-center p-5'>
        <Text className='text-white'>
          Unable to load settings
        </Text>
        <CustomButton title='Try again' handlePress={fetchAppConfigSettings} containerStyles='mt-7 w-full' />
      </View>
    }
  }
}
