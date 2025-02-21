import { View, Image, Text, KeyboardAvoidingView, Platform, ScrollView, Keyboard, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import icons from '@/constants/icons';
import { YStack, ListItem, XStack, Sheet } from 'tamagui';
import FormField from './FormField';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useGeneralConfig } from '@/hooks/useGeneralConfig';
import { CountryPhoneCode } from '@/models/general';

const CountryCodePicker = ({ onCountryCodeSelect }: { onCountryCodeSelect: (selectedCountry: string) => void }) => {
    const country_phone_codes = useGeneralConfig()?.country_phone_codes;
    const [country, setCountry] = React.useState('');
    const [filteredCountryCodes, setFilteredCountryCodes] = React.useState<CountryPhoneCode[]>(country_phone_codes || []);
    const [selectedCountryCode, setSelectedCountryCode] = React.useState('');
    const [showCountryPicker, setShowCountryPicker] = React.useState(false)
    const [countrySheetPosition, setCountrySheetPosition] = React.useState(0);
    const [snapPoints, setSnapPoints] = useState([65, 85]);

    useEffect(() => {
        if (country_phone_codes) {
            setFilteredCountryCodes(country_phone_codes)
        }
    }, [country_phone_codes])
    const selectCountryCode = (country: string) => {
        Keyboard.dismiss();
        setSelectedCountryCode(country);
        onCountryCodeSelect(country);
        setShowCountryPicker(false);
        setCountry('')
    }

    const filterCountries = (text: string) => {
        setCountry(text)
        if (text.length > 0) {
            const filtered = country_phone_codes!.filter((country) => country!.name.toLowerCase().includes(text.toLowerCase()))
            setCountrySheetPosition(1)
            // setSnapPoints([65, 85, filtered.length * 50])
            setFilteredCountryCodes(filtered)
        } else {
            setCountrySheetPosition(0)
            setFilteredCountryCodes(country_phone_codes || [])
            setSnapPoints([65, 85])
        }
    }

    useEffect(() => {
        const showSubscription = Keyboard.addListener("keyboardWillShow", () => setCountrySheetPosition(1));
        const hideSubscription = Keyboard.addListener("keyboardWillHide", () => setCountrySheetPosition(0));

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);
    return (
        <>
            <TouchableOpacity className='flex-row items-center gap-0.5' onPress={() => setShowCountryPicker(true)}>
                <Text className='text-base text-white font-firaregular'>{selectedCountryCode ? `(+${selectedCountryCode})` : ' '}</Text>
                <Ionicons name="chevron-down" size={14} color="#A9A9A9" />
            </TouchableOpacity>

            <Sheet
                forceRemoveScrollEnabled={showCountryPicker}
                modal={true}
                open={showCountryPicker}
                disableDrag={true}
                // onOpenChange={setShowCountryPicker}
                snapPoints={snapPoints}
                snapPointsMode={'percent'}
                dismissOnSnapToBottom
                position={countrySheetPosition}
                onPositionChange={setCountrySheetPosition}
                zIndex={100_000}
                animation="medium"
            >
                <Sheet.Overlay
                    animation="lazy"
                    enterStyle={{ opacity: 0 }}
                    exitStyle={{ opacity: 0 }}
                />
                <Sheet.Frame paddingBottom="$5" gap="$5" backgroundColor={'#1A1A1A'}>
                    <XStack className='bg-[#1A1A1A] p-4 pb-0' gap="$2">
                        <TouchableOpacity onPress={() => { Keyboard.dismiss(); setShowCountryPicker(false) }} className=' absolute top-4 left-4 z-10 flex items-center justify-center pr-4'>
                            <Ionicons name="close-circle" size={24} color="#ffffff" />
                        </TouchableOpacity>
                        <Text className='font-firabold text-white text-base mx-auto'>Select Country</Text>
                    </XStack>
                    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                        <View className='px-4'>
                            <FormField placeholder='Search' handleChangeText={(event) => filterCountries(event)} />
                        </View>
                        <ScrollView className='p-4' style={{ flexGrow: 1 }}>
                            <YStack gap="$2">
                                {filteredCountryCodes.map((country, index) => (
                                    <ListItem onPress={() => selectCountryCode(country.phone_code.toString())} key={index} className='bg-gray-800 rounded-lg  text-white'>
                                        <XStack gap="$3" alignItems='center'>
                                            <Text className='text-lg text-white'>(+{country.phone_code})</Text>
                                            <Text className='text-lg text-white'>{country.name}</Text>
                                        </XStack>
                                    </ListItem>
                                ))}
                            </YStack>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </Sheet.Frame>
            </Sheet>
        </>
    )
}

export default CountryCodePicker