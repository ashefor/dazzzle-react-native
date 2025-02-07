import { View, Text, Image, TouchableOpacity, SafeAreaView,ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import React from 'react'
import ActionSheet, { SheetManager, SheetProps, useSheetRef, FlatList, useScrollHandlers } from 'react-native-actions-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ListItem, Separator, XStack, YGroup, YStack } from 'tamagui';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import icons from '@/constants/icons';
import FormField from './FormField';
import {NativeViewGestureHandler} from 'react-native-gesture-handler';

const CountryCodePickerSheet = (props: SheetProps<"country-code-action-sheet">) => {
    const [countries, setCountries] = React.useState(Array(20).fill(0));
    const insets = useSafeAreaInsets();
    const ref = useSheetRef();
    const handlers = useScrollHandlers();
  
    return (
        <ActionSheet ref={ref} containerStyle={{ backgroundColor: '#1A1A1A'}} safeAreaInsets={insets} useBottomSafeAreaPadding drawUnderStatusBar={false}>
            <SafeAreaView/>
            <XStack className='bg-[#1A1A1A] p-4' gap="$2">
                <TouchableOpacity onPress={() => ref.current?.hide()} className=' absolute top-4 left-4 z-10 flex items-center justify-center pr-4'>
                    <Ionicons name="close-circle" size={24} color="#ffffff" />
                </TouchableOpacity>
                <Text className='font-firabold text-white text-base mx-auto'>Select Country</Text>
            </XStack>
            <View className='px-4'>
            <FormField placeholder='Search' value='' handleChangeText={(value) => console.log(value)}/>
            </View>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
           <ScrollView className='p-4' style={{flexGrow: 1}}>
                <YStack gap="$2">
                    {countries.map((country, index) => (
                        <ListItem onPress={() => ref.current?.hide()} key={index} className='bg-gray-800 rounded-lg  text-white'>
                                    <XStack gap="$3">
                                    <Image source={icons.nigeriaFlag} className='w-5 h-5' resizeMode='contain' />
                                    <Text className='text-lg text-white'>Nigeria</Text>
                                    </XStack>
                            </ListItem>
                    //     <TouchableWithoutFeedback key={index}>
                    //     <XStack className='flex h-11 rounded-lg bg-gray-800 items-center px-2' gap="$3">
                    //         <Feather name='image' size={24} color="#DD3FE5" />
                    //         <Text className='text-base text-white'>
                    //             Nigeria
                    //         </Text>
                    //     </XStack>
                    // </TouchableWithoutFeedback>
                    ))}
                </YStack>
            </ScrollView>
           </KeyboardAvoidingView>
        </ActionSheet>
    )
}

export default CountryCodePickerSheet