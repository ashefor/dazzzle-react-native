import { Feather, Ionicons } from "@expo/vector-icons";
import { JSX, useCallback, useMemo, useRef } from "react";
import { TouchableOpacity, View, Text, Keyboard, FlatList, Dimensions, Platform } from "react-native";
import { ListItem as ListItemBase } from "tamagui";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomSheetBackdrop, BottomSheetHandle, BottomSheetHandleProps, BottomSheetFlatList, BottomSheetModal } from '@gorhom/bottom-sheet';
import { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';
import React from "react";

interface CustomButtonProps {
    options: { id: string | number, value: string }[];
    onSelectOption: (event: string) => void;
    title: string,
    defaultOption?: string | number;
    isLoading?: boolean;
    disabled?: boolean,
    placeholder?: string
}
const SelectPicker = ({ options, defaultOption, onSelectOption, title, placeholder = "Select option", isLoading, disabled }: CustomButtonProps) => {
    const flatListRef = useRef<FlatList>(null);
    const insets = useSafeAreaInsets();
    const searchBottomSheetModalRef = useRef<BottomSheetModal>(null);

    const MAX_HEIGHT_PX = useMemo(() => {
        return Dimensions.get("screen").height * 0.8
    }, [])

    const selectOption = (option: number | string) => {
        Keyboard.dismiss();
        onSelectOption(String(option));
        searchBottomSheetModalRef.current?.dismiss();
    }

    const getPickerLabel = (option: string | number) => {
        if (option && options) {
            const selectedOption = options.find(g => g.id.toString() === option.toString());
            return selectedOption ? selectedOption.value : '';
        }
        return '';
    }

    const scrollToSelectedOption = () => {
        if (flatListRef.current && defaultOption) {
            if (options && options.length > 0) {
                const selectedOptionIndex = options.findIndex(g => g.id.toString() === defaultOption.toString());
                if (selectedOptionIndex !== -1) {
                    setTimeout(() => {
                        if (flatListRef.current) {
                            flatListRef.current.scrollToIndex({ index: selectedOptionIndex, animated: true });
                        }
                    }, 500);
                }
            }
        }
    }

    const openSelectPicker = () => {
        Keyboard.dismiss();
        scrollToSelectedOption();
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
                        <Text className='font-firabold text-black text-base mx-auto text-center'>Select {title || 'Option'}</Text>
                    </View>
                </View>
            </BottomSheetHandle>
        ),
        []
    );

    const renderItem = ({ item }: { item: { id: string | number, value: string } }) => <ListItemBase onPress={() => selectOption(item.id)} className={`bg-[#F2F2F7] rounded-lg ${defaultOption == item.id.toString() ? 'bg-[#FCE6FD]' : 'bg-[#F2F2F7]'}`} py={"$3"}>
        <Text className={`text-base ${defaultOption == item.id.toString() ? 'text-primary' : 'text-black'}`}>{item.value}</Text>
    </ListItemBase>;

    return (
        <>
            <View className="space-y-2">
                <Text className='text-sm text-black font-firamedium capitalize'>{title}</Text>
                <TouchableOpacity className='px-4 h-14 bg-[#F2F2F7] rounded-xl focus:border-primary flex-row items-center justify-between gap-0.5 flex-1 border border-[#cccccc80]' onPress={() => searchBottomSheetModalRef.current?.present()} disabled={disabled}>
                    <Text className={`text-sm text-black font-firaregular ${defaultOption ? 'text-black' : 'text-[#5B5B5B3A]'}`}>{defaultOption ? getPickerLabel(defaultOption) : placeholder}</Text>
                    <Feather className='ml-auto' name="chevron-down" size={20} color="black" />
                </TouchableOpacity>
            </View>

            <BottomSheetModal
                ref={searchBottomSheetModalRef}
                enableDynamicSizing
                maxDynamicContentSize={MAX_HEIGHT_PX}
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
                // onDismiss={() => setSearch('')}
                android_keyboardInputMode={Platform.OS === 'android' ? 'adjustResize' : 'adjustPan'}
            >

                <BottomSheetFlatList
                    // ref={flatListRef}
                    ItemSeparatorComponent={() => <View className='h-3' />}
                    style={{ marginBottom: 20 }}
                    contentContainerStyle={{
                        paddingTop: 16,
                        paddingHorizontal: 16,
                        paddingBottom: 16 + insets.bottom,
                        borderRadius: 28,
                    }} data={options}
                    renderItem={renderItem}
                    keyExtractor={(_, index) => index.toString()} />
            </BottomSheetModal>


            {/* <Sheet
                modal={true}
                open={openPicker}
                disableDrag={true}
                snapPointsMode={'fit'}
                dismissOnSnapToBottom
                moveOnKeyboardChange={true}
                zIndex={100_000_000}
                animation="medium"
            >
                <Sheet.Overlay
                    onPress={() => setOpenPicker(false)}
                    animation="medium"
                    enterStyle={{ opacity: 0 }}
                    exitStyle={{ opacity: 0 }}
                />
                <Sheet.Frame paddingBottom="$5" gap="$1" backgroundColor={'#1A1A1A'}>
                    <View style={{paddingTop: insets.top, paddingBottom: insets.bottom}} className=' h-full'>
                        <View className=' p-4 flex-row justify-center'>
                            <TouchableOpacity onPress={() => { Keyboard.dismiss(); setOpenPicker(false) }} className=' absolute top-4 left-4 z-10 flex items-center justify-center pr-4'>
                                <Ionicons name="close-circle" size={24} color="#ffffff" />
                            </TouchableOpacity>
                            <Text className='font-firabold text-black text-base mx-auto'>Select {title || 'Option'}</Text>
                        </View>
                        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                            <FlatList ref={flatListRef}
                                contentContainerStyle={{ paddingBottom: 40 }}
                                data={options}
                                keyExtractor={(item) => item.id.toString()}
                                className='px-4'
                                ItemSeparatorComponent={() => <View className='h-2' />}
                                ListFooterComponent={() => <View className='h-14' />}
                                initialNumToRender={24}
                                maxToRenderPerBatch={24}
                                renderItem={renderItem}
                            >
                            </FlatList>
                        </KeyboardAvoidingView>
                    </View>
                </Sheet.Frame>
            </Sheet> */}
        </>
    )
}


export default React.memo(SelectPicker)