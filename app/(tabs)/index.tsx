import { SafeAreaView, View } from 'react-native';
import TinderCardSwipers from '@/components/TinderCardSwipers';


export default function HomeScreen() {

  return (
    <SafeAreaView className='h-full bg-[#1A1A1A]'>
        <TinderCardSwipers />
      </SafeAreaView>
  );
}
