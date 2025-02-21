// import { View, Text, Platform, TextInput, TouchableOpacity, FlatList, Modal, TouchableWithoutFeedback } from 'react-native'
// import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
// import Ionicons from '@expo/vector-icons/Ionicons';
// import { XStack, YStack } from 'tamagui';


// type OptionItem = {
//     value: string;
//     label: string;
// };

// interface DropDownProps {
//     data: OptionItem[];
//     onChange: (item: OptionItem) => void;
//     placeholder?: string;
//     otherStyles?: string;
//     title?: string
// }
// const Dropdown = ({
//     data,
//     onChange,
//     placeholder = 'Select an item',
//     otherStyles,
//     title
// }: DropDownProps) => {
//     const [expanded, setExpanded] = useState(false);
//     const items = [
//         {
//             value: 'Item 1',
//             label: 'Item 1'
//         },
//         {
//             value: 'Item 2',
//             label: 'Item 2'
//         }
//     ]

//     const toggleExpanded = useCallback(() => setExpanded(!expanded), [expanded]);
//     const [value, setValue] = useState("");

//     const buttonRef = useRef<View>(null);
//     const [top, setTop] = useState(0);
//     const onSelect = useCallback((item: OptionItem) => {
//         onChange(item);
//         setValue(item.label);
//         setExpanded(false);
//     }, []);
//     useLayoutEffect(() => {
//         buttonRef.current?.measure((x, y, width, height, pageX, pageY) => {
//             // console.log('Measurements:', x, y, width, height, pageX, pageY);
//             // setTop((pageY) + height + (Platform.OS === 'android' ? -32 : 3));
//             //do something with the measurements
//         });
//     }, [ /* add dependencies here */]);
//     return (
//         <View className={`space-y-2 ${otherStyles}`} ref={buttonRef}
//         onLayout={({ nativeEvent }) => {
//             // const { layout } = nativeEvent;
//             // const topOffset = layout.y;
//             // const height = layout.height;
//             // console.log('layout', layout)
//             // setTop(topOffset + height + (Platform.OS === 'android' ? -32 : 3));
//         }}>
//             {title && <Text className='text-base text-white font-firamedium'>{title}</Text>}
//             <View>
//                 <TouchableOpacity activeOpacity={0.8} onPress={() => {toggleExpanded(); buttonRef.current?.measure((x, y, width, height, pageX, pageY) => {
//                     console.log('Measurements:', x, y, width, height, pageX, pageY);
//                     setTop(pageY + height + (Platform.OS === 'android' ? -32 : 3));
//                     //do something with the measurements
//                 });
//                 }} className='bg-white h-12 border border-transparent w-full px-4 bg-[#5B5B5B] rounded-md focus:border-secondary justify-between items-center flex-row'>
//                     <Text className='flex-1 font-firaregular text-white text-base'>
//                         {value || placeholder}
//                     </Text>
//                     <Ionicons name={expanded ? "eye-outline" : "eye-off-outline"} size={24} color="white" />
//                 </TouchableOpacity>
//             </View>
//             {expanded ?
//                 <Modal transparent visible={expanded}>
//                     <TouchableWithoutFeedback onPress={() => setExpanded(false)}>
//                         <YStack className='flex-1 p-5' alignItems='center' justifyContent="center">
//                             <View style={{ top }} className='absolute z-10 w-full bg-gray-800 p-2.5 rounded-md max-h-64'>
//                                 <FlatList
//                                     keyExtractor={(item, index) => item.value}
//                                     ListHeaderComponent={() => <XStack className='py-2' alignItems='center' justifyContent='center'>
//                                         <Text className='text-white'>Select one </Text>
//                                     </XStack>}
//                                     ItemSeparatorComponent={() => <View className='h-0.5 bg-white' />}
//                                     data={items}
//                                     renderItem={({ item }) => (
//                                         <TouchableOpacity
//                                             onPress={() => onSelect(item)} activeOpacity={0.8} className='h-10 justify-center'>
//                                             <Text className='text-white'>
//                                                 {item.label}
//                                             </Text>
//                                         </TouchableOpacity>
//                                     )}
//                                 />
//                             </View>
//                         </YStack>
//                     </TouchableWithoutFeedback>
//                 </Modal>
//                 : null}
//         </View>
//     )
// }

// export default Dropdown
import { 
    View, 
    Text, 
    Platform, 
    TouchableOpacity, 
    FlatList, 
    Modal, 
    TouchableWithoutFeedback, 
    Dimensions 
} from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { XStack, YStack } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';

type OptionItem = {
    value: string;
    label: string;
};

interface DropDownProps {
    data: OptionItem[];
    onChange: (item: OptionItem) => void;
    placeholder?: string;
    otherStyles?: string;
    title?: string;
}

const screenHeight = Dimensions.get('window').height; // Get full screen height

const Dropdown = ({
    data,
    onChange,
    placeholder = 'Select an item',
    otherStyles,
    title
}: DropDownProps) => {
    const [expanded, setExpanded] = useState(false);
    const [selectedValue, setSelectedValue] = useState<string>("");
    const buttonRef = useRef<View>(null);
    const [position, setPosition] = useState({ top: 0, bottom: 0, width: 0 });
    const [dropdownHeight, setDropdownHeight] = useState(0); // Store dropdown height

    const toggleExpanded = useCallback(() => {
        setExpanded(prev => !prev);
    }, []);

    const onSelect = useCallback((item: OptionItem) => {
        onChange(item);
        setSelectedValue(item.label);
        setExpanded(false);
    }, [onChange]);

    const measurePosition = () => {
        buttonRef.current?.measureInWindow((x, y, width, height) => {
            const spaceBelow = screenHeight - (y + height); // Space below button
            const isAbove = spaceBelow < dropdownHeight; // Decide to show above or below
            const topPosition = isAbove ? y - dropdownHeight - 4  : y + height + 4;
            console.log('Measurements:', spaceBelow, isAbove, topPosition);

            setPosition({ top: y + height, bottom: y, width });
        });
    };

    useEffect(() => {
        if (expanded) {
            measurePosition();
        }
    }, [expanded, dropdownHeight]);

    return (
        <View className={`space-y-2 ${otherStyles}`} ref={buttonRef}>
            {title && <Text className='text-base text-white font-firamedium'>{title}</Text>}
            
            <TouchableOpacity 
                activeOpacity={0.8} 
                onPress={toggleExpanded} 
                className='bg-white h-12 border border-transparent w-full px-4 bg-[#5B5B5B] rounded-md focus:border-secondary justify-between items-center flex-row'
            >
                <Text className='flex-1 font-firaregular text-white text-base'>
                    {selectedValue || placeholder}
                </Text>
                <Ionicons name={expanded ? "chevron-up-outline" : "chevron-down-outline"} size={20} color="white" />
            </TouchableOpacity>

            {expanded && (
                <Modal transparent visible={expanded}>
                    <TouchableWithoutFeedback onPress={() => setExpanded(false)}>
                        <YStack className='flex-1' alignItems='center' justifyContent="center">
                        <View  className=''

                                onLayout={e => setDropdownHeight(e.nativeEvent.layout.height)} 
                                style={{
                                    position: 'absolute',
                                    top:
                                        position.top + dropdownHeight > (Platform.OS === 'ios' ? 700 : 600)
                                            ? position.bottom - dropdownHeight - 4
                                            : position.top + 4,
                                    left: 20,
                                    width: position.width - 8,
                                    backgroundColor: '#1a1a1a',
                                    paddingVertical: 10,
                                    borderRadius: 8,
                                    maxHeight: 300,
                                    borderWidth: 1,
                                    borderColor: '#5B5B5B',

                                }}
                            >
                                <FlatList
                                    keyExtractor={(item, index) => index.toString()}
                                    // ListHeaderComponent={() => (
                                    //     <XStack className='bg-[#1a1a1a] pb-4' alignItems='center' justifyContent='center'>
                                    //         <Text className='text-white text-lg font-firamedium'>Select one </Text>
                                    //     </XStack>
                                    // )}
                                    // stickyHeaderIndices={[0]}
                                    ItemSeparatorComponent={() => <View className='h-1' />}
                                    data={data}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            onPress={() => onSelect(item)} 
                                            activeOpacity={0.8} 
                                            className='h-10 justify-center p-2.5'
                                        >
                                            <Text className='text-white text-base'>{item.label}</Text>
                                        </TouchableOpacity>
                                    )}
                                />
                                <SafeAreaView/>
                            </View>
                        </YStack>
                    </TouchableWithoutFeedback>
                </Modal>
            )}
        </View>
    );
};

export default Dropdown;
