import { View, Text, TouchableOpacity } from 'react-native'
import React, { JSX, useCallback, useEffect, useRef, useState } from 'react'
import dayjs from 'dayjs'
import DateTimePicker, { DateType } from 'react-native-ui-datepicker'
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'
import { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types'
import { Feather, Ionicons } from '@expo/vector-icons'

const DateOfBirthPicker = ({ onDateOfBirthSelected, dateOfBirth }: { onDateOfBirthSelected: (selectedCountry: string) => void, dateOfBirth: string }) => {
    const [birthday, setBirthday] = useState<DateType>();
    // const age18yearsFromNow = dayjs().add(18, 'year').format('YYYY-MM-DD');
    const atLeast18YearsOld = dayjs().subtract(18, 'year').format('YYYY-MM-DD');
    const searchBottomSheetModalRef = useRef<BottomSheetModal>(null);

    const emitSelectedDate = () => {
        onDateOfBirthSelected(birthday ? dayjs(birthday).format('YYYY-MM-DD') : '');
        searchBottomSheetModalRef.current?.dismiss();
    }

    useEffect(() => {
        if (dateOfBirth) {
            setBirthday(dayjs(dateOfBirth).format('YYYY-MM-DD'))
        } else {
            setBirthday(dayjs(atLeast18YearsOld).format('YYYY-MM-DD'))
        }
    }, [dateOfBirth])

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

    return (
        <>
            <View className="space-y-2">
                <Text className='text-sm text-black font-firamedium'>Birthday</Text>
                 <TouchableOpacity className='px-4 h-14 bg-[#F2F2F7] rounded-xl focus:border-primary flex-row items-center justify-between gap-0.5 flex-1 border border-[#cccccc80]' onPress={() => searchBottomSheetModalRef.current?.present()}>
                            <Text className='text-sm text-black font-firaregular flex-1'>{birthday ? dayjs(birthday).format('DD MMM YYYY') : 'Select date'}</Text>
                            {/* <Text className='text-base text-black font-firaregular'>{birthday ? birthday.toString() : 'Select date'}</Text> */}
                            <Feather name="calendar" size={20} color="#666" />
                        </TouchableOpacity>
            </View>
            <BottomSheetModal
                ref={searchBottomSheetModalRef}
                enableDynamicSizing
                enablePanDownToClose={true}
                handleIndicatorStyle={{
                    backgroundColor: "red",
                    display: "none"
                }}
                stackBehavior="push"
                handleStyle={{ padding: 0 }}
                detached={true}
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
                backdropComponent={renderBackdrop}
            >

                <BottomSheetView>
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
                            <Text className='font-firabold text-black text-base mx-auto text-center'>Select Date of Birth</Text>
                        </View>
                    </View>
                    <View style={{
                        paddingTop: 8,
                        paddingHorizontal: 12,
                        paddingBottom: 28,
                        flex: 1
                    }}>
                        <DateTimePicker
                            calendarTextStyle={{ fontSize: 16 }}
                            headerTextStyle={{ fontSize: 16 }}
                            weekDaysTextStyle={{ fontSize: 16 }}
                            selectedItemColor='#DF3FE5'
                            maxDate={atLeast18YearsOld}
                            headerButtonColor="#1A1A1A"
                            // monthContainerStyle={{ backgroundColor: '#1A1A1A' }}
                            // yearContainerStyle={{ backgroundColor: '#1A1A1A' }}
                            mode="single"
                            date={birthday}
                            onChange={(params) => setBirthday(params.date)}
                        />
                        <View className='flex-row items-center justify-end'>
                            <TouchableOpacity className='py-2 px-4 border border-primary rounded-full' onPress={emitSelectedDate}>
                                <Text className='text-base text-primary font-firaregular'>Done</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </BottomSheetView>
            </BottomSheetModal>
            {/* <Sheet
                forceRemoveScrollEnabled={showDatePicker}
                modal={true}
                open={showDatePicker}
                disableDrag={true}
                onOpenChange={setShowDatePicker}
                snapPoints={[62]}
                snapPointsMode={'percent'}
                dismissOnSnapToBottom
                zIndex={100_000_000}
                animation="medium"
            >
                <Sheet.Overlay
                    animation="lazy"
                    enterStyle={{ opacity: 0 }}
                    exitStyle={{ opacity: 0 }}
                />
                <Sheet.Frame gap="$5" backgroundColor={'#1A1A1A'}>
                    <View style={{ paddingBottom: insets.bottom }}>
                        <View className='flex-row items-center justify-end pt-4 px-4'>
                            <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                                <Ionicons name="close-circle" size={24} color="#FFFFFF" />
                            </TouchableOpacity>
                        </View>
                        <DateTimePicker
                            calendarTextStyle={{ color: '#FFFFFF', fontSize: 16 }}
                            headerTextStyle={{ color: '#FFFFFF', fontSize: 16 }}
                            weekDaysTextStyle={{ color: '#FFFFFF', fontSize: 16 }}
                            selectedItemColor='#DF3FE5'
                            maxDate={atLeast18YearsOld}
                            headerButtonColor="#ffffff"
                            monthContainerStyle={{ backgroundColor: '#1A1A1A' }}
                            yearContainerStyle={{ backgroundColor: '#1A1A1A' }}
                            mode="single"
                            date={birthday}
                            onChange={(params) => setBirthday(params.date)}
                        />
                        <View className='flex-row items-center justify-end p-4'>
                            <TouchableOpacity className='py-2 px-4 border border-white rounded-full' onPress={emitSelectedDate}>
                                <Text className='text-base text-white font-firaregular'>Done</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Sheet.Frame>
            </Sheet> */}
        </>
    )
}

export default DateOfBirthPicker