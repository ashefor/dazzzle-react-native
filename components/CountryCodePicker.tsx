import { View, Image, Text, KeyboardAvoidingView, Platform, ScrollView, Keyboard } from 'react-native'
import React, { useEffect, useState } from 'react'
import icons from '@/constants/icons';
import { YStack, ListItem, XStack } from 'tamagui';
import FormField from './FormField';

const CountryCodePicker = ({ onKeyboardToggle }: { onKeyboardToggle: (visible: boolean) => void }) => {
    const [countries, setCountries] = React.useState(Array(20).fill(0));
    const [country, setCountry] = React.useState('');

    const [isKeyboardVisible, setKeyboardVisible] = useState(false);

    useEffect(() => {
        const showSubscription = Keyboard.addListener("keyboardWillShow", () => onKeyboardToggle(true));
        const hideSubscription = Keyboard.addListener("keyboardWillHide", () => onKeyboardToggle(false));

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);
    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
            <View className='px-4'>
                <FormField placeholder='Search' value={country} handleChangeText={(value) => setCountry(value)} />
            </View>
            <ScrollView className='p-4' style={{ flexGrow: 1 }}>
                <YStack gap="$2">
                    {countries.map((country, index) => (
                        <ListItem key={index} className='bg-gray-800 rounded-lg  text-white'>
                            <XStack gap="$3" alignItems='center'>
                                <Image source={icons.nigeriaFlag} className='w-5 h-5' resizeMode='contain' />
                                <Text className='text-lg text-white'>Nigeria</Text>
                            </XStack>
                        </ListItem>
                    ))}
                </YStack>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

export default CountryCodePicker