import { Feather, Ionicons } from "@expo/vector-icons";
import React, { JSX, useCallback, useMemo, useRef } from "react";
import { TouchableOpacity, View, Text, Keyboard, Platform, StyleSheet, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomSheetBackdrop, BottomSheetHandle, BottomSheetHandleProps, BottomSheetFlatList, BottomSheetModal } from '@gorhom/bottom-sheet';
import { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';

interface CustomButtonProps {
    options: { id: string | number, value: string }[];
    onSelectOption: (event: string) => void;
    title: string,
    defaultOption?: string | number;
    isLoading?: boolean;
    disabled?: boolean,
    placeholder?: string
}

type Option = { id: string | number, value: string };

const renderBackdrop = (props: JSX.IntrinsicAttributes & BottomSheetDefaultBackdropProps) => (
    <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
);

const ItemSeparator = () => <View className='h-3' />;

const SelectPicker = ({ options, defaultOption, onSelectOption, title, placeholder = "Select option", isLoading, disabled }: CustomButtonProps) => {
    const insets = useSafeAreaInsets();
    const searchBottomSheetModalRef = useRef<BottomSheetModal>(null);
    const { height } = useWindowDimensions();

    const MAX_HEIGHT_PX = height * 0.8;

    const dismissSheet = useCallback(() => searchBottomSheetModalRef.current?.dismiss(), []);
    const presentSheet = useCallback(() => searchBottomSheetModalRef.current?.present(), []);

    const selectOption = useCallback((option: number | string) => {
        Keyboard.dismiss();
        onSelectOption(String(option));
        searchBottomSheetModalRef.current?.dismiss();
    }, [onSelectOption]);

    const pickerLabel = useMemo(() => {
        if (!defaultOption || !options) return '';
        const selected = options.find(g => g.id.toString() === defaultOption.toString());
        return selected ? selected.value : '';
    }, [defaultOption, options]);

    const renderHeaderHandle = useCallback(
        (props: BottomSheetHandleProps) => (
            <BottomSheetHandle {...props}>
                <View className="py-4 relative">
                    <View className=' w-full'>
                        <TouchableOpacity onPress={dismissSheet} className=' flex items-center justify-center' style={styles.closeButton}>
                            <Ionicons name="close-circle" size={24} color="black" />
                        </TouchableOpacity>
                        <Text className='font-firabold text-black text-base mx-auto text-center'>Select {title || 'Option'}</Text>
                    </View>
                </View>
            </BottomSheetHandle>
        ),
        [title, dismissSheet]
    );

    const renderItem = useCallback(({ item }: { item: Option }) => {
        const isSelected = String(defaultOption) === item.id.toString();
        return (
            <TouchableOpacity onPress={() => selectOption(item.id)} className={`rounded-lg px-4 py-3 ${isSelected ? 'bg-[#FCE6FD]' : 'bg-[#F2F2F7]'}`}>
                <Text className={`text-base ${isSelected ? 'text-primary' : 'text-black'}`}>{item.value}</Text>
            </TouchableOpacity>
        );
    }, [defaultOption, selectOption]);

    const listContentContainerStyle = useMemo(
        () => ({ paddingTop: 16, paddingHorizontal: 16, paddingBottom: 16 + insets.bottom, borderRadius: 28 }),
        [insets.bottom]
    );

    return (
        <>
            <View className="space-y-2">
                <Text className='text-sm text-black font-firamedium capitalize'>{title}</Text>
                <TouchableOpacity className='px-4 h-14 bg-[#F2F2F7] rounded-xl focus:border-primary flex-row items-center justify-between gap-0.5 flex-1 border border-[#cccccc80]' onPress={presentSheet} disabled={disabled}>
                    <Text className={`text-sm text-black font-firaregular ${defaultOption ? 'text-black' : 'text-[#5B5B5B3A]'}`}>{defaultOption ? pickerLabel : placeholder}</Text>
                    <Feather className='ml-auto' name="chevron-down" size={20} color="black" />
                </TouchableOpacity>
            </View>

            <BottomSheetModal
                ref={searchBottomSheetModalRef}
                enableDynamicSizing
                maxDynamicContentSize={MAX_HEIGHT_PX}
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
                android_keyboardInputMode={Platform.OS === 'android' ? 'adjustResize' : 'adjustPan'}
            >
                <BottomSheetFlatList
                    ItemSeparatorComponent={ItemSeparator}
                    style={styles.list}
                    contentContainerStyle={listContentContainerStyle}
                    data={options}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                />
            </BottomSheetModal>
        </>
    )
}

export default React.memo(SelectPicker)

const styles = StyleSheet.create({
    closeButton: {
        position: 'absolute',
        top: '50%',
        transform: [{ translateY: '-50%' }],
        left: 16,
        zIndex: 10,
        backgroundColor: 'white',
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
