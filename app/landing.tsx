import CustomButton from '@/components/CustomButton';
import Images from '@/constants/images';
import { router } from 'expo-router';
import { View, Text, Image, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function HomeScreen() {
    return (
        <>
            <ImageBackground className='h-full w-full' source={Images.onboard} >
                <SafeAreaView className='flex-1 bg-black/[0.6]'>
                    <View className='w-full h-full items-center justify-end px-4 py-6'>
                        <Image source={Images.logo} className='w-[130px] h-[84px]' resizeMode='contain' />
                        <View className='relative mt-5'>
                            <Text className='text-3xl text-white font-firabold text-center'>
                                Discover endless possibiilty with <Text className='text-tertiary'>Dazzzle</Text>
                            </Text>
                        </View>
                        <Text className='text-base font-firaregular text-gray-100 mt-7 text-center'>Tired of being single? Dazzzle Dating is the answer to your prayers. We have a wide variety of members to choose from, so you're sure to find someone who is perfect for you. Join and start your love life today!</Text>
                        <CustomButton title='Continue with Email' containerStyles='mt-7 w-full' handlePress={() => router.replace('/sign-in')} />
                    </View>
                </SafeAreaView>
            </ImageBackground>
        </>
    );
}
