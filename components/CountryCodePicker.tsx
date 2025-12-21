import { View, Text, Platform, TouchableOpacity, Dimensions, InteractionManager } from 'react-native';
import React, { JSX, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { CountryPhoneCode } from '@/models/general';
import { useAppSelector } from '@/hooks/reduxHooks';
import { countryCodes } from '@/constants/constants';
import { BottomSheetBackdrop, BottomSheetFlatList, BottomSheetHandle, BottomSheetHandleProps, BottomSheetModal, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


const CountryCodePicker = ({ onCountryCodeSelect, countryCode }: { countryCode: string, onCountryCodeSelect: (selectedCountry: string) => void }) => {
    const { appConfig } = useAppSelector(state => state.app);
    const [filteredCountryCodes, setFilteredCountryCodes] = React.useState<CountryPhoneCode[]>(countryCodes);
    const [search, setSearch] = useState('');
    const searchBottomSheetModalRef = useRef<BottomSheetModal>(null);
    const insets = useSafeAreaInsets();
    const [selectedCountryCode, setSelectedCountryCode] = useState<string>(countryCode);

    useEffect(() => {
        if (appConfig?.country_phone_codes) {
            setFilteredCountryCodes(appConfig?.country_phone_codes)
        }
    }, [appConfig?.country_phone_codes])


    useEffect(() => {
        const items = appConfig?.country_phone_codes || [];
        if (items) {
            const lower = search.toLowerCase();
            const filtered = items.filter((country) => country!.name.toLowerCase().includes(search.toLowerCase()))
            setFilteredCountryCodes(filtered);
        }
    }, [search, appConfig?.country_phone_codes]);

    const selectCountryCode = (country: string) => {
        searchBottomSheetModalRef.current?.dismiss();
        InteractionManager.runAfterInteractions(() => {
            onCountryCodeSelect(country);
            setSelectedCountryCode(country);
        });
    }

    const renderBackdrop = useCallback(
        (props: JSX.IntrinsicAttributes & BottomSheetDefaultBackdropProps) => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1}
                appearsOnIndex={0}
            // onPress={handleBlur}
            />
        ),
        []
    );

    const MAX_HEIGHT_PX = useMemo(() => {
        return Dimensions.get("screen").height * 0.8
    }, [])

    const renderHeaderHandle = useCallback(
        (props: BottomSheetHandleProps) => (
            <BottomSheetHandle
                {...props}
            >
                <View className="py-4 relative">

                    <View className=' w-full'>
                        <TouchableOpacity onPress={() => searchBottomSheetModalRef.current?.dismiss()} className=' flex items-center justify-center' style={{
                            position: 'absolute',
                            top: '50%',
                            transform: [
                                { translateY: '-50%' }
                            ],
                            left: 16,
                            zIndex: 10,
                            backgroundColor: 'white'
                        }}>
                            <Ionicons name="close-circle" size={24} color="black" />
                        </TouchableOpacity>
                        <Text className='font-firabold text-black text-base mx-auto text-center'>Select Country</Text>
                    </View>
                </View>
                <View className='py-5 px-4'>
                   <BottomSheetTextInput
                            onChangeText={setSearch}
                            clearButtonMode='while-editing' style={{
                                height: 48,
                                borderRadius: 8,
                                borderWidth: 1,
                                flex: 1,
                                fontFamily: 'PlusJakartaSans_400Regular',
                                fontSize: 14,
                                borderColor: '#A6A6A9',
                                padding: 12,
                            }} placeholder='Search' 
                            />
                </View>
            </BottomSheetHandle>
        ),
        []
    );

    const renderItem = useCallback(
        ({ index, item }: { index: number, item: any }) => {
            const isSelected = item.phone_code.toString() == selectedCountryCode;
            return (
                (
                    <TouchableOpacity onPress={() => selectCountryCode(item.phone_code.toString())} key={index} className={`rounded-lg text-black px-4 py-3 ${isSelected ? 'bg-[#FCE6FD]' : 'bg-[#F2F2F7]'}`} >
                        <View className='flex-row items-center gap-3 justify-start flex-wrap'>
                            <Text className='text-base text-black'>(+{item.phone_code})</Text>
                            <Text className='text-base text-black flex-1' style={{ wordWrap: 'break-word' }}>{item.name}</Text>
                        </View>
                    </TouchableOpacity>
                )
            )
        }, [selectedCountryCode]
    )

    return (
        <>
            <TouchableOpacity className='flex-row items-center justify-end gap-0.5 min-w-[50px]' onPress={() => searchBottomSheetModalRef.current?.present()}>
                <Text className='text-sm text-black font-firaregular'>{selectedCountryCode ? `(+${selectedCountryCode})` : ''}</Text>
                <Ionicons name="chevron-down" size={14} color="#A9A9A9" />
            </TouchableOpacity>

            <BottomSheetModal
                ref={searchBottomSheetModalRef}
                enableDynamicSizing={false}
                maxDynamicContentSize={MAX_HEIGHT_PX}
                snapPoints={['80%']}
                enablePanDownToClose={true}
                handleIndicatorStyle={{
                    backgroundColor: "red",
                    display: "none"
                }}
                handleStyle={{ padding: 0 }}
                style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 6 },
                    shadowOpacity: 0.1,
                    shadowRadius: 6,
                    elevation: 6,
                    backgroundColor: 'yellow',
                    borderRadius: 28,
                }}
                backgroundStyle={{
                    borderRadius: 28,
                }}
                stackBehavior="push"
                backdropComponent={renderBackdrop}
                handleComponent={renderHeaderHandle}
                keyboardBehavior="extend"
                enableBlurKeyboardOnGesture
                keyboardBlurBehavior='restore'
                onDismiss={() => setSearch('')}
                android_keyboardInputMode={Platform.OS === 'android' ? 'adjustResize' : 'adjustPan'}
            >

                <BottomSheetFlatList
                    ItemSeparatorComponent={() => <View className='h-2' />}
                    style={{ marginBottom: 20 }}
                    contentContainerStyle={{
                        paddingTop: 16,
                        paddingHorizontal: 16,
                        paddingBottom: 16 + insets.bottom,
                        borderRadius: 28,
                    }} data={filteredCountryCodes}
                    renderItem={renderItem}
                    keyExtractor={(_, index) => index.toString()} 
                    ListEmptyComponent={() => <View className='h-40 w-full flex-col justify-center items-center gap-2'>
                        <Feather name="search" size={48} color="black" />
                        <Text className='text-center text-black text-base font-firaregular'>No country found</Text>
                    </View>}
                    />
            </BottomSheetModal>
        </>
    )
}

export default React.memo(CountryCodePicker)