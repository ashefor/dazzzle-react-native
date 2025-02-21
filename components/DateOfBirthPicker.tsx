import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Sheet, XStack } from 'tamagui'
import dayjs, { Dayjs } from 'dayjs'
import Ionicons from '@expo/vector-icons/Ionicons'
import DateTimePicker, { DateType } from 'react-native-ui-datepicker'

const DateOfBirthPicker = ({ onDateOfBirthSelected }: { onDateOfBirthSelected: (selectedCountry: string) => void }) => {
    const [birthday, setBirthday] = useState<DateType>();
    const [showDatePicker, setShowDatePicker] = useState(false);

    const emitSelectedDate = () => {
        onDateOfBirthSelected(birthday ? dayjs(birthday).format('DD MMM YYYY'): '');
        setShowDatePicker(false)
    }

    return (
        <>
            <View className="space-y-2">
                <Text className='text-base text-white font-firamedium'>Birthday</Text>
                <View className='border border-transparent w-full px-4 bg-[#5B5B5B] rounded-md focus:border-secondary items-center flex-row'>
                    <XStack gap="$2"
                        className='flex-1 h-12 items-center font-firaregular text-white divide divide-x divide-[#A9A9A9]'>
                        <TouchableOpacity className='flex-row items-center gap-0.5 flex-1 h-full' onPress={() => setShowDatePicker(true)}>
                            <Text className='text-base text-white font-firaregular'>{birthday ? dayjs(birthday).format('DD MMM YYYY') : 'Select date'}</Text>
                            {/* <Text className='text-base text-white font-firaregular'>{birthday ? birthday.toString() : 'Select date'}</Text> */}
                        </TouchableOpacity>
                    </XStack>
                </View>
            </View>
            <Sheet
                forceRemoveScrollEnabled={showDatePicker}
                modal={true}
                open={showDatePicker}
                disableDrag={true}
                onOpenChange={setShowDatePicker}
                snapPoints={[62]}
                snapPointsMode={'percent'}
                dismissOnSnapToBottom
                zIndex={100_000}
                animation="medium"
            >
                <Sheet.Overlay
                    animation="lazy"
                    enterStyle={{ opacity: 0 }}
                    exitStyle={{ opacity: 0 }}
                />
                <Sheet.Frame gap="$5" backgroundColor={'#1A1A1A'}>
                    <XStack className='items-center justify-end pt-4 px-4'>
                        <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                            <Ionicons name="close-circle" size={24} color="#FFFFFF" />
                        </TouchableOpacity>
                    </XStack>
                    <DateTimePicker
                        calendarTextStyle={{ color: '#FFFFFF', fontSize: 16 }}
                        headerTextStyle={{ color: '#FFFFFF', fontSize: 16 }}
                        weekDaysTextStyle={{ color: '#FFFFFF', fontSize: 16 }}
                        selectedItemColor='#DF3FE5'
                        headerButtonColor="#ffffff"
                        monthContainerStyle={{ backgroundColor: '#1A1A1A' }}
                        yearContainerStyle={{backgroundColor: '1A1A1A'}}
                        mode="single"
                        date={birthday}
                        onChange={(params) => setBirthday(params.date)}
                    />
                    <XStack className='items-center justify-end p-4'>
                        <TouchableOpacity className='py-2 px-4 border border-white rounded-full' onPress={emitSelectedDate}>
                            <Text className='text-base text-white font-firaregular'>Done</Text>
                        </TouchableOpacity>
                    </XStack>
                </Sheet.Frame>
            </Sheet>
        </>
    )
}

export default DateOfBirthPicker