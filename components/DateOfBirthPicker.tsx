import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React, { JSX, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import dayjs from 'dayjs'
import DateTimePicker, { DateType } from 'react-native-ui-datepicker'
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'
import { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types'
import { Feather, Ionicons } from '@expo/vector-icons'

const renderBackdrop = (props: JSX.IntrinsicAttributes & BottomSheetDefaultBackdropProps) => (
    <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
);

const DateOfBirthPicker = ({ onDateOfBirthSelected, dateOfBirth }: { onDateOfBirthSelected: (selectedCountry: string) => void, dateOfBirth: string }) => {
    // `draftBirthday` is only what the calendar is currently showing. The committed
    // value is the `dateOfBirth` prop — the label reads from that, never from the
    // draft. Previously the draft was pre-filled with the 18-years-ago bound and
    // rendered as though it were chosen, while the parent form still held '', so
    // submitting without touching the calendar sent an empty birthday and the
    // server rejected it with a minimum-age error.
    const [draftBirthday, setDraftBirthday] = useState<DateType>();
    const searchBottomSheetModalRef = useRef<BottomSheetModal>(null);

    const atLeast18YearsOld = useMemo(() => dayjs().subtract(18, 'year').format('YYYY-MM-DD'), []);

    const dismissSheet = useCallback(() => searchBottomSheetModalRef.current?.dismiss(), []);
    const presentSheet = useCallback(() => searchBottomSheetModalRef.current?.present(), []);

    const emitSelectedDate = useCallback(() => {
        onDateOfBirthSelected(draftBirthday ? dayjs(draftBirthday).format('YYYY-MM-DD') : '');
        searchBottomSheetModalRef.current?.dismiss();
    }, [draftBirthday, onDateOfBirthSelected]);

    // Sync the draft to the committed value. With no committed value the calendar
    // still opens positioned at the 18-years-ago bound, but the label stays on
    // its placeholder so nothing is submitted that the user didn't pick.
    useEffect(() => {
        setDraftBirthday(dayjs(dateOfBirth || atLeast18YearsOld).format('YYYY-MM-DD'))
    }, [dateOfBirth, atLeast18YearsOld])

    const handleDateChange = useCallback((params: { date: DateType }) => setDraftBirthday(params.date), []);

    return (
        <>
            <View className="space-y-2">
                <Text className='text-sm text-black font-firamedium'>Birthday</Text>
                <TouchableOpacity className='px-4 h-14 bg-[#F2F2F7] rounded-xl focus:border-primary flex-row items-center justify-between gap-0.5 flex-1 border border-[#cccccc80]' onPress={presentSheet}>
                    <Text className={`text-sm font-firaregular flex-1 ${dateOfBirth ? 'text-black' : 'text-[#5B5B5B3A]'}`}>{dateOfBirth ? dayjs(dateOfBirth).format('DD MMM YYYY') : 'Select date'}</Text>
                    <Feather name="calendar" size={20} color="#666" />
                </TouchableOpacity>
            </View>
            <BottomSheetModal
                ref={searchBottomSheetModalRef}
                enableDynamicSizing
                enablePanDownToClose={true}
                handleIndicatorStyle={styles.handleIndicator}
                stackBehavior="push"
                handleStyle={styles.handle}
                detached={true}
                style={styles.sheet}
                backgroundStyle={styles.sheetBackground}
                backdropComponent={renderBackdrop}
            >
                <BottomSheetView>
                    <View className="py-4 relative">
                        <View className=' w-full'>
                            <TouchableOpacity onPress={dismissSheet} className=' flex items-center justify-center' style={styles.closeButton}>
                                <Ionicons name="close-circle" size={24} color="black" />
                            </TouchableOpacity>
                            <Text className='font-firabold text-black text-base mx-auto text-center'>Select Date of Birth</Text>
                        </View>
                    </View>
                    <View style={styles.calendarContainer}>
                        <DateTimePicker
                            calendarTextStyle={styles.calendarText}
                            headerTextStyle={styles.calendarText}
                            weekDaysTextStyle={styles.calendarText}
                            selectedItemColor='#DF3FE5'
                            maxDate={atLeast18YearsOld}
                            mode="single"
                            date={draftBirthday}
                            onChange={handleDateChange}
                        />
                        <View className='flex-row items-center justify-end'>
                            <TouchableOpacity className='py-2 px-4 border border-primary rounded-full' onPress={emitSelectedDate}>
                                <Text className='text-base text-primary font-firaregular'>Done</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </BottomSheetView>
            </BottomSheetModal>
        </>
    )
}

export default React.memo(DateOfBirthPicker)

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
    calendarContainer: {
        paddingTop: 8,
        paddingHorizontal: 12,
        paddingBottom: 28,
        flex: 1,
    },
    calendarText: {
        fontSize: 16,
    },
})
