import Images from '@/constants/images';
import { View, Image, Animated } from 'react-native';
import PagerView from 'react-native-pager-view';
const AnimatedPagerView = Animated.createAnimatedComponent(PagerView);

export default function HomeScreen() {
    return (
        <View className='flex-1'>
            <AnimatedPagerView style={{ flex: 0.7 }} initialPage={0}>
                <View key={1}>
                    <Image source={Images.onboardScreenOne} style={{ width: '100%', height: '100%' }}/>
                </View>
            </AnimatedPagerView>
        </View>
    );
}
