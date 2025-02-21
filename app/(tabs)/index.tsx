import {  View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import TinderCardSwipers from '@/components/TinderCardSwipers';
import { useGlobalContext } from '@/context/GlobalProvider';

export default function HomeScreen() {
    const { authState, token } = useGlobalContext();
    console.log('token home', token);
  return (
    <View className='h-full bg-[#1A1A1A]'>
    <TinderCardSwipers/>
    </View>
  );
}
