import { View, Text, Platform, TouchableOpacity, useWindowDimensions, InteractionManager, StyleSheet, Keyboard } from 'react-native';
import React, { JSX, useCallback, useMemo, useRef, useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { CountryPhoneCode } from '@/models/general';
import { useAppSelector } from '@/hooks/reduxHooks';
import { countryCodes } from '@/constants/constants';
import { BottomSheetBackdrop, BottomSheetFlatList, BottomSheetHandle, BottomSheetHandleProps, BottomSheetModal, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const renderBackdrop = (props: JSX.IntrinsicAttributes & BottomSheetDefaultBackdropProps) => (
    <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
);

const ItemSeparator = () => <View className='h-2' />;

const ListEmpty = () => (
    <View className='h-40 w-full flex-col justify-center items-center gap-2'>
        <Feather name="search" size={48} color="black" />
        <Text className='text-center text-black text-base font-firaregular'>No country found</Text>
    </View>
);

const CountryCodePicker = ({ onCountryCodeSelect, countryCode }: { countryCode: string, onCountryCodeSelect: (selectedCountry: string) => void }) => {
    const countryPhoneCodes = useAppSelector(state => state.app.appConfig?.country_phone_codes);
    const [search, setSearch] = useState('');
    const searchBottomSheetModalRef = useRef<BottomSheetModal>(null);
    const insets = useSafeAreaInsets();
    const { height } = useWindowDimensions();

    // Falls back to the bundled list until appConfig lands, so the sheet is
    // never empty on a cold open.
    const availableCountryCodes: CountryPhoneCode[] = countryPhoneCodes ?? countryCodes;

    const filteredCountryCodes = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) return availableCountryCodes;
        return availableCountryCodes.filter((country) => country.name.toLowerCase().includes(query));
    }, [search, availableCountryCodes]);

    const MAX_HEIGHT_PX = height * 0.8;

    const dismissSheet = useCallback(() => searchBottomSheetModalRef.current?.dismiss(), []);
    const presentSheet = useCallback(() => {
        searchBottomSheetModalRef.current?.present();
        Keyboard.dismiss();
    }, []);
    const handleDismiss = useCallback(() => setSearch(''), []);

    const selectCountryCode = useCallback((country: string) => {
        searchBottomSheetModalRef.current?.dismiss();
        Keyboard.dismiss();
        InteractionManager.runAfterInteractions(() => {
            onCountryCodeSelect(country);
        });
    }, [onCountryCodeSelect]);

    const renderHeaderHandle = useCallback(
        (props: BottomSheetHandleProps) => (
            <BottomSheetHandle {...props}>
                <View className="py-4 relative">
                    <View className=' w-full'>
                        <TouchableOpacity onPress={dismissSheet} className=' flex items-center justify-center' style={styles.closeButton}>
                            <Ionicons name="close-circle" size={24} color="black" />
                        </TouchableOpacity>
                        <Text className='font-firabold text-black text-base mx-auto text-center'>Select Country</Text>
                    </View>
                </View>
                <View className='py-5 px-4'>
                    <BottomSheetTextInput
                        onChangeText={setSearch}
                        clearButtonMode='while-editing'
                        style={styles.searchInput}
                        placeholder='Search'
                    />
                </View>
            </BottomSheetHandle>
        ),
        [dismissSheet]
    );

    const renderItem = useCallback(
        ({ item }: { item: CountryPhoneCode }) => {
            const isSelected = item.phone_code.toString() === countryCode;
            return (
                <TouchableOpacity onPress={() => selectCountryCode(item.phone_code.toString())} className={`rounded-lg text-black px-4 py-3 ${isSelected ? 'bg-[#FCE6FD]' : 'bg-[#F2F2F7]'}`} >
                    <View className='flex-row items-center gap-3 justify-start flex-wrap'>
                        <Text className='text-base text-black'>(+{item.phone_code})</Text>
                        <Text className='text-base text-black flex-1'>{item.name}</Text>
                    </View>
                </TouchableOpacity>
            )
        }, [countryCode, selectCountryCode]
    )

    const listContentContainerStyle = useMemo(
        () => ({ paddingTop: 16, paddingHorizontal: 16, paddingBottom: 16 + insets.bottom, borderRadius: 28 }),
        [insets.bottom]
    );

    return (
        <>
            <TouchableOpacity className='flex-row items-center justify-end gap-0.5 min-w-[50px]' onPress={presentSheet}>
                <Text className='text-sm text-black font-firaregular'>{countryCode ? `(+${countryCode})` : ''}</Text>
                <Ionicons name="chevron-down" size={14} color="#A9A9A9" />
            </TouchableOpacity>

            <BottomSheetModal
                ref={searchBottomSheetModalRef}
                enableDynamicSizing={false}
                maxDynamicContentSize={MAX_HEIGHT_PX}
                snapPoints={['80%']}
                enablePanDownToClose={true}
                handleIndicatorStyle={styles.handleIndicator}
                handleStyle={styles.handle}
                style={styles.sheet}
                backgroundStyle={styles.sheetBackground}
                stackBehavior="push"
                backdropComponent={renderBackdrop}
                handleComponent={renderHeaderHandle}
                keyboardBehavior="extend"
                enableBlurKeyboardOnGesture
                keyboardBlurBehavior='restore'
                onDismiss={handleDismiss}
                android_keyboardInputMode={Platform.OS === 'android' ? 'adjustResize' : 'adjustPan'}
            >
                <BottomSheetFlatList
                    ItemSeparatorComponent={ItemSeparator}
                    style={styles.list}
                    contentContainerStyle={listContentContainerStyle}
                    data={filteredCountryCodes}
                    renderItem={renderItem}
                    // Keyed by name, not phone_code: codes are shared across countries
                    // (+1 is Canada/US/Sint Maarten, +44 is UK/Guernsey/Jersey/IoM).
                    keyExtractor={(item) => item.name}
                    ListEmptyComponent={ListEmpty}
                />
            </BottomSheetModal>
        </>
    )
}

export default React.memo(CountryCodePicker)

const styles = StyleSheet.create({
    closeButton: {
        position: 'absolute',
        top: '50%',
        transform: [{ translateY: '-50%' }],
        left: 16,
        zIndex: 10,
        backgroundColor: 'white',
    },
    searchInput: {
        height: 48,
        borderRadius: 8,
        borderWidth: 1,
        flex: 1,
        fontFamily: 'PlusJakartaSans_400Regular',
        fontSize: 14,
        borderColor: '#A6A6A9',
        padding: 12,
    },
    handleIndicator: {
        display: 'none',
    },
    handle: {
        padding: 0,
    },
    sheet: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 6,
        borderRadius: 28,
    },
    sheetBackground: {
        borderRadius: 28,
    },
    list: {
        marginBottom: 20,
    },
})
