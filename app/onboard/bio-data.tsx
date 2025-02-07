import { Alert, Image, KeyboardAvoidingView, SafeAreaView, Platform, ScrollView, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View, TextInput, Keyboard } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
// import { SafeAreaView } from 'react-native-safe-area-context'

import { Link, router } from 'expo-router'
import { useGlobalContext } from '@/context/GlobalProvider'
import Images from '@/constants/images'
import { Button, Form, H4, Spinner, YStack, Input, Label, Checkbox, XStack, Progress, Sheet, } from 'tamagui'
import CustomButton from '@/components/CustomButton'
import FormField from '@/components/FormField'
import Ionicons from '@expo/vector-icons/Ionicons';
import * as WebBrowser from 'expo-web-browser';
import { WebBrowserResult } from 'expo-web-browser'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { SheetManager } from 'react-native-actions-sheet'
// import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import CountryCodePicker from '@/components/CountryCodePicker'
import RNDateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker'
import DateTimePicker from 'react-native-ui-datepicker';
import dayjs from 'dayjs';

const OnboardBioData = () => {
    const [key, setKey] = React.useState(0)
    const [size, setSize] = React.useState(4)
    const [progress, setProgress] = React.useState(0)
    const { setUser, setIsLoggedIn } = useGlobalContext();
    const [showCountryPicker, setShowCountryPicker] = React.useState(false)
    const [countrySheetPosition, setCountrySheetPosition] = React.useState(0);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [snapPoints, setSnapPoints] = useState([65, 85]);

    const [status, setStatus] = React.useState<'off' | 'submitting' | 'submitted'>('off')
    const [form, setForm] = useState({
        first_name: '',
        last_name: '',
        phone_number: '',
        birthday: dayjs(),
        gender: '',
    })

    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        setTimeout(() => {
            setProgress(Math.ceil((1 / 5) * 100))
        }, 500);
    }, [])

    const updateSnapPoints = (keyboardVisible: boolean) => {
        setCountrySheetPosition(keyboardVisible ? 1 : 0); // Use only 85 when keyboard is open
    };

    const updateForm = useCallback((key: string, value: string) => {
        setForm({
            ...form,
            [key]: value
        })
    }, [form])

    const _handlePressButtonAsync = async (link: string) => {
        await WebBrowser.openBrowserAsync(link);
    };

    const showMode = () => {
        setShowDatePicker(true);
    };

    const submit = async () => {

        setIsSubmitting(true);
        try {
            // await signIn(form.email, form.password);
            // const user = await getCurrentUser();
            // setUser(user);
            router.push('/onboard/profile-picture');
        } catch (error: any) {
            Alert.alert('Error', error.message ? error.message : 'Failed to log in')
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
            <SafeAreaView className='bg-[#1A1A1A] h-full'>
                <YStack gap="$5" className='px-4'>
                    <Progress size="$3" value={progress}>
                        <Progress.Indicator backgroundColor="#DF3FE5" animation="bouncy" />
                    </Progress>
                </YStack>
                <ScrollView>
                    <YStack className='p-4' gap="$5">
                        <YStack>
                            <Text className='text-2xl text-white font-firabold'>Complete your profile</Text>
                            <Text className='text-sm text-[#A9A9A9] font-firaregular'>Join our community and experience seamlessness finding a soulmate. </Text>
                        </YStack>
                        <YStack>
                            <Form
                                gap="$7"
                            >
                                <YStack gap="$3">
                                    <FormField
                                        title="First Name"
                                        value={form.first_name}
                                        placeholder='Enter first name'
                                        handleChangeText={(text: string) => setForm({ ...form, first_name: text })}
                                    />
                                    <FormField
                                        title="Last Name"
                                        value={form.last_name}
                                        placeholder='Enter last name'
                                        handleChangeText={(text: string) => setForm({ ...form, last_name: text })}
                                    />
                                    <View className="space-y-2">
                                        <Text className='text-base text-white font-firamedium'>Phone Number</Text>
                                        <View className='border border-transparent w-full px-4 bg-[#5B5B5B] rounded-md focus:border-secondary items-center flex-row'>

                                            <XStack gap="$2"
                                                className='flex-1 h-12 items-center font-firaregular text-white divide divide-x divide-[#A9A9A9]'>
                                                <TouchableOpacity className='flex-row items-center gap-0.5' onPress={() => setShowCountryPicker(true)}>
                                                    <Text className='text-base text-white font-firaregular'>+255</Text>
                                                    <Ionicons name="chevron-down" size={14} color="#A9A9A9" />
                                                </TouchableOpacity>
                                                <TextInput
                                                    style={{ lineHeight: Platform.OS == 'ios' ? 0 : undefined }}
                                                    className='flex-1 h-full px-4 font-firaregular text-white text-base'
                                                    value={form.phone_number}
                                                    inputMode="tel"
                                                    onChangeText={(text: string) => setForm({ ...form, phone_number: text })}
                                                    placeholder="Phone Number"
                                                    placeholderTextColor={"#fbfbfb73"}
                                                    selectionColor={'#DD3FE5'}
                                                />
                                            </XStack>
                                        </View>
                                    </View>
                                    <View className="space-y-2">
                                        <Text className='text-base text-white font-firamedium'>Birthday</Text>
                                        <View className='border border-transparent w-full px-4 bg-[#5B5B5B] rounded-md focus:border-secondary items-center flex-row'>
                                            <XStack gap="$2"
                                                className='flex-1 h-12 items-center font-firaregular text-white divide divide-x divide-[#A9A9A9]'>
                                                <TouchableOpacity className='flex-row items-center gap-0.5 flex-1 h-full' onPress={() => setShowDatePicker(true)}>
                                                    <Text className='text-base text-white font-firaregular'>{form.birthday.format('DD MMM YYYY')}</Text>
                                                </TouchableOpacity>
                                            </XStack>
                                        </View>
                                    </View>

                                </YStack>
                                <Form.Trigger asChild disabled={status !== 'off'}>
                                    <CustomButton title='Next' handlePress={submit} />
                                </Form.Trigger>
                            </Form>
                            <View className='justify-center pt-5 flex-row gap-2'>
                                <Text className='text-sm text-white font-firaregular'>Already have an account?</Text>
                                <Link className='text-sm text-tertiary font-firaregular underline' href='./sign-in'>Sign In</Link>
                            </View>
                        </YStack>
                    </YStack>

                    <Sheet
                        forceRemoveScrollEnabled={showCountryPicker}
                        modal={true}
                        open={showCountryPicker}
                        disableDrag={true}
                        onOpenChange={setShowCountryPicker}
                        snapPoints={snapPoints}
                        snapPointsMode={'percent'}
                        dismissOnSnapToBottom
                        position={countrySheetPosition}
                        onPositionChange={setCountrySheetPosition}
                        zIndex={100_000}
                        animation="medium"
                    >
                        <Sheet.Overlay
                            animation="lazy"
                            enterStyle={{ opacity: 0 }}
                            exitStyle={{ opacity: 0 }}
                        />
                        <Sheet.Frame paddingBottom="$5" gap="$5" backgroundColor={'#1A1A1A'}>
                            <XStack className='bg-[#1A1A1A] p-4 pb-0' gap="$2">
                                <TouchableOpacity onPress={() => { Keyboard.dismiss(); setShowCountryPicker(false) }} className=' absolute top-4 left-4 z-10 flex items-center justify-center pr-4'>
                                    <Ionicons name="close-circle" size={24} color="#ffffff" />
                                </TouchableOpacity>
                                <Text className='font-firabold text-white text-base mx-auto'>Select Country</Text>
                            </XStack>
                            <CountryCodePicker onKeyboardToggle={updateSnapPoints} />
                        </Sheet.Frame>
                    </Sheet>
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
                                mode="single"
                                date={form.birthday}
                                onChange={(params) => updateForm('birthday', params.date as string)}
                            />
                            <XStack className='items-center justify-end p-4'>
                                <TouchableOpacity className='py-2 px-4 border border-white rounded-full' onPress={() => setShowDatePicker(false)}>
                                    <Text className='text-base text-white font-firaregular'>Done</Text>
                                </TouchableOpacity>
                            </XStack>
                        </Sheet.Frame>
                    </Sheet>
                </ScrollView>
            </SafeAreaView>
        </KeyboardAvoidingView>
    )
}

export default OnboardBioData

const styles = StyleSheet.create({})