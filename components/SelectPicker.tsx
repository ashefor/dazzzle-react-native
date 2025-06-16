import { Feather, Ionicons } from "@expo/vector-icons";
import { memo, useRef, useState } from "react";
import { KeyboardAvoidingView, TouchableOpacity, View, Text, Keyboard, Platform, ScrollView, SafeAreaView as SafeAreaViewIOS, FlatList } from "react-native"
import { SafeAreaView as SafeAreaViewAndroid } from "react-native-safe-area-context";
import { Sheet, XStack, YStack, ListItem as ListItemBase } from "tamagui";

const SafeArea = Platform.OS === 'ios' ? SafeAreaViewIOS : SafeAreaViewAndroid;
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
    const [openPicker, setOpenPicker] = useState(false);
    const flatListRef = useRef<FlatList>(null);

    const selectOption = (option: number | string) => {
        Keyboard.dismiss();
        onSelectOption(String(option));
        setOpenPicker(false);
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
            const selectedOptionIndex = options.findIndex(g => g.id.toString() === defaultOption.toString());
            if (selectedOptionIndex !== -1) {
                flatListRef.current.scrollToIndex({ index: selectedOptionIndex, animated: true });
            }
        }
    }

    const openSelectPicker = () => {
        Keyboard.dismiss();
        setOpenPicker(true);
        scrollToSelectedOption();
    }

    const ListItem = memo(({ item }: any) => {
        return (
            <TouchableOpacity onPress={() => selectOption(item.id)} className={`bg-gray-800 min-h-[44px] py-2.5 px-[18px] rounded-lg ${defaultOption == item.id.toString() ? 'bg-secondary' : ''}`}>
                <XStack gap="$3" alignItems='center'>
                    <Text className={`text-lg ${defaultOption == item.id.toString() ? 'text-black' : 'text-white'}`}>{item.value}</Text>
                </XStack>
            </TouchableOpacity>
        );
    });

    const renderItem2 = ({ item }: { item: { id: string | number, value: string } }) => <ListItem item={item} />;

    const renderItem = ({ item }: { item: { id: string | number, value: string } }) => <ListItemBase onPress={() => selectOption(item.id)} className={`bg-gray-800 rounded-lg ${defaultOption == item.id.toString() ? 'bg-secondary' : ''}`}>
        <XStack gap="$3" alignItems='center'>
            <Text className={`text-lg ${defaultOption == item.id.toString() ? 'text-black' : 'text-white'}`}>{item.value}</Text>
        </XStack>
    </ListItemBase>;

    return (
        <>
            <View className="space-y-2">
                <Text className='text-base text-white font-firamedium capitalize'>{title}</Text>
                <View className='border border-transparent w-full px-4 bg-[#5B5B5B] rounded-md focus:border-secondary items-center flex-row'>
                    <View
                        className='flex-1 flex-row gap-x-2 h-12 items-center font-firaregular text-white divide divide-x divide-[#A9A9A9]'>
                        <TouchableOpacity className='flex-row items-center justify-between gap-0.5 flex-1 h-full' onPress={openSelectPicker}>
                            <Text className='text-base text-white font-firaregular'>{defaultOption ? getPickerLabel(defaultOption) : placeholder}</Text>
                            <Feather className='ml-auto' name="chevron-down" size={20} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <Sheet
                forceRemoveScrollEnabled={openPicker}
                modal={true}
                open={openPicker}
                disableDrag={true}
                onOpenChange={setOpenPicker}
                snapPointsMode={'fit'}
                dismissOnSnapToBottom
                zIndex={100_000_000}
                animation="quicker"
            >
                <Sheet.Overlay
                    onPress={() => setOpenPicker(false)}
                    animation="quicker"
                    enterStyle={{ opacity: 0 }}
                    exitStyle={{ opacity: 0 }}
                />
                <Sheet.Frame paddingBottom="$5" gap="$1" backgroundColor={'#1A1A1A'}>
                    <SafeArea className='bg-[#1A1A1A] h-full'>
                        <View className='bg-[#1A1A1A] p-4 flex-row justify-center'>
                            <TouchableOpacity onPress={() => { Keyboard.dismiss(); setOpenPicker(false) }} className=' absolute top-4 left-4 z-10 flex items-center justify-center pr-4'>
                                <Ionicons name="close-circle" size={24} color="#ffffff" />
                            </TouchableOpacity>
                            <Text className='font-firabold text-white text-base mx-auto'>Select {title || 'Option'}</Text>
                        </View>
                        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                            {/* <Sheet.ScrollView className='px-4'>
                            <YStack gap="$2">
                                {options.map((option, index) => (
                                    <ListItem onPress={() => selectOption(option.id)} key={index} className={`bg-gray-800 rounded-lg ${defaultOption == option.id.toString() ? 'bg-secondary' : ''}`}>
                                        <XStack gap="$3" alignItems='center'>
                                            <Text className={`text-lg ${defaultOption == option.id.toString() ? 'text-black' : 'text-white'}`}>{option.value}</Text>
                                        </XStack>
                                    </ListItem>
                                ))}
                            </YStack>
                        <View className='h-14' />
                        </Sheet.ScrollView> */}
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
                    </SafeArea>
                </Sheet.Frame>
            </Sheet>
        </>
    )
}


export default SelectPicker