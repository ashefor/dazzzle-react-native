import { Feather, Ionicons } from "@expo/vector-icons";
import { JSX, memo, useCallback, useMemo, useRef } from "react";
import { TouchableOpacity, View, Text, Keyboard, Platform, FlatList, Dimensions } from "react-native";
import { XStack, ListItem as ListItemBase } from "tamagui";
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


    const ListItem = memo(({ item }: any) => {
        return (
            <TouchableOpacity onPress={() => selectOption(item.id)} className={`bg-gray-800 min-h-[44px] py-2.5 px-[18px] rounded-lg ${defaultOption == item.id.toString() ? 'bg-secondary' : ''}`}>
                <XStack gap="$3" alignItems='center'>
                    <Text className={`text-lg ${defaultOption == item.id.toString() ? 'text-black' : 'text-black'}`}>{item.value}</Text>
                </XStack>
            </TouchableOpacity>
        );
    });

    const renderItem = ({ item }: { item: { id: string | number, value: string } }) => <ListItemBase onPress={() => selectOption(item.id)} className={`bg-gray-800 rounded-lg ${defaultOption == item.id.toString() ? 'bg-[#FCE6FD]' : 'bg-[#F2F2F7]'}`}>
        <XStack gap="$3" alignItems='center'>
            <Text className={`text-lg ${defaultOption == item.id.toString() ? 'text-black' : 'text-black'}`}>{item.value}</Text>
        </XStack>
    </ListItemBase>;

    return (
        <>
            <View className="space-y-2">
                <Text className='text-base text-black font-firamedium capitalize'>{title}</Text>
                <View className='border border-[#ccc] w-full px-4 bg-[#F2F2F7] rounded-md focus:border-secondary items-center flex-row'>
                    <View
                        className='flex-1 flex-row gap-x-2 h-12 items-center font-firaregular text-black divide divide-x divide-[#A9A9A9]'>
                        <TouchableOpacity className='flex-row items-center justify-between gap-0.5 flex-1 h-full' onPress={() => searchBottomSheetModalRef.current?.present()} disabled={disabled}>
                            <Text className={`text-base text-black font-firaregular ${defaultOption ? 'text-black' : 'text-[#5B5B5B3A]'}`}>{defaultOption ? getPickerLabel(defaultOption) : placeholder}</Text>
                            <Feather className='ml-auto' name="chevron-down" size={20} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <BottomSheetModal
                ref={searchBottomSheetModalRef}
                enableDynamicSizing
                maxDynamicContentSize={MAX_HEIGHT_PX}
                enablePanDownToClose={true}
                bottomInset={16}
                handleIndicatorStyle={{
                    backgroundColor: "red",
                    display: "none"
                }}
                handleStyle={{ padding: 0 }}
                detached={true}
                style={{
                    marginHorizontal: 16,
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
                backdropComponent={renderBackdrop}
                handleComponent={renderHeaderHandle}
                keyboardBehavior="extend"
                keyboardBlurBehavior='restore'
                android_keyboardInputMode={Platform.OS === 'android' ? 'adjustResize' : 'adjustPan'}
            >

                <BottomSheetFlatList
                    // ref={flatListRef}
                    ItemSeparatorComponent={() => <View className='h-2' />}
                    style={{ marginBottom: 20 }}
                    contentContainerStyle={{
                        paddingTop: 16,
                        paddingHorizontal: 16,
                        paddingBottom: 28,
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


export default SelectPicker