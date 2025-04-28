import { Alert, Image, KeyboardAvoidingView, SafeAreaView, Platform, ScrollView, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View, TextInput, Keyboard } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
// import { SafeAreaView } from 'react-native-safe-area-context'

import { Link, router, useFocusEffect } from 'expo-router'
import { useGlobalContext } from '@/context/GlobalProvider'
import Images from '@/constants/images'
import { Button, Form, H4, Spinner, YStack, Input, Label, Checkbox, XStack, Progress, Sheet, ListItem, } from 'tamagui'
import CustomButton from '@/components/CustomButton'
import FormField from '@/components/FormField'
import Ionicons from '@expo/vector-icons/Ionicons';
import * as WebBrowser from 'expo-web-browser';
import CountryCodePicker from '@/components/CountryCodePicker'
import DateTimePicker from 'react-native-ui-datepicker';
import dayjs from 'dayjs';
import DateOfBirthPicker from '@/components/DateOfBirthPicker'
import Dropdown from '@/components/Dropdown'
import { useGeneralConfig } from '@/hooks/useGeneralConfig'
import { useAxiosContext } from '@/context/AxiosProvider'
import { ReactionCodes } from '@/models/general'
import { Feather } from '@expo/vector-icons'
import Toast from '@/components/toast/toast'

type BioDataForm = {
    first_name: string;
    last_name: string;
    mobile_number: string;
    // date_of_birth: string;
    gender: string;
    country_code: string;
};
const OnboardBioData = () => {
    const {axiosRequest} = useAxiosContext();
    const userGenders = useGeneralConfig()?.genders;
    const [progress, setProgress] = React.useState(0);
    const [showGenderPicker, setShowGenderPicker] = useState(false);
    const [snapPoints, setSnapPoints] = useState(['200', 35]);

    const [status, setStatus] = React.useState<'off' | 'submitting' | 'submitted'>('off')
    const [form, setForm] = useState<BioDataForm>({
        first_name: '',
        last_name: '',
        mobile_number: '',
        // date_of_birth: '',
        gender: '',
        country_code: ''
    })

    const fetchUserProfileUpdateStatus = async () => {
        try {
          const response = await axiosRequest.get('/profile/check-profile-updated');
          const reaction = response.data.reaction;
          const responseData = response.data.data;
          if (reaction === ReactionCodes.SUCCESS) {
            const profileData = responseData['profileInfo'];
            if (profileData) {
                setForm({
              first_name: profileData.first_name,
              last_name: profileData.last_name,
              mobile_number: profileData.mobile_number,
            //   date_of_birth: profileData.birthday,
              gender: profileData.gender.toString(),
              country_code: profileData.country_code
            })
            }
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

    useEffect(() => {
        setTimeout(() => {
            setProgress(Math.ceil((1 / 5) * 100))
        }, 500);
    }, [])

    useFocusEffect(
        // Callback should be wrapped in `React.useCallback` to avoid running the effect too often.
        useCallback(() => {
            // Invoked whenever the route is focused.
            fetchUserProfileUpdateStatus();

            // Return function is invoked whenever the route gets out of focus.
            return () => {
                console.log('This route is now unfocused.');
            };
        }, [])
    )

    const updateForm = useCallback(<K extends keyof BioDataForm>(key: K, value: BioDataForm[K]) => {
        setForm({
            ...form,
            [key]: value
        })
    }, [form])

    const submit = async () => {
        try {
            const {data} = await axiosRequest.post('/update-basic-settings', form);
            if (data.reaction === ReactionCodes.SUCCESS) {
                Toast.success('Profile updated successfully');
                router.push('/onboard/profile-picture');
            }
        } catch (error: any) {
            console.log('error', error);
            Alert.alert('Error', error.message ? error.message : 'Failed to log in')
        }
    }

    const setSelectGender = (gender: number) => {
            Keyboard.dismiss();
            updateForm('gender', String(gender));
            setShowGenderPicker(false);
    }

    const getGenderName = (gender: string | number) => {
        const genderData = userGenders?.find(g => g.id.toString() === gender);
        return genderData?.value || '';
    }

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
            <SafeAreaView className='bg-[#1A1A1A] h-full'>
                <View className='px-4'>
                    <Progress size="$3" value={progress}>
                        <Progress.Indicator backgroundColor="#DF3FE5" animation="bouncy" />
                    </Progress>
                </View>
                <ScrollView>
                    <View className='p-4 space-y-5'>
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
                                        handleChangeText={(text: string) => updateForm('first_name', text)}
                                    />
                                    <FormField
                                        title="Last Name"
                                        value={form.last_name}
                                        placeholder='Enter last name'
                                        handleChangeText={(text: string) => updateForm('last_name', text)}
                                    />
                                    <View className="space-y-2">
                                        <Text className='text-base text-white font-firamedium'>Phone Number</Text>
                                        <View className='border border-transparent w-full px-4 bg-[#5B5B5B] rounded-md focus:border-secondary items-center flex-row'>
                                            <View 
                                                className='flex-1 flex-row gap-x-2 h-12 items-center font-firaregular text-white divide divide-x divide-[#A9A9A9]'>
                                                <CountryCodePicker countryCode={form.country_code} onCountryCodeSelect={country => updateForm('country_code', country)} />
                                                <TextInput
                                                    style={{ lineHeight: Platform.OS == 'ios' ? 0 : undefined }}
                                                    className='flex-1 h-full px-4 font-firaregular text-white text-base'
                                                    value={form.mobile_number}
                                                    inputMode="tel"
                                                    onChangeText={(text: string) => updateForm('mobile_number', text)}
                                                    placeholder="Phone Number"
                                                    placeholderTextColor={"#fbfbfb73"}
                                                    selectionColor={'#DD3FE5'}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                    {/* <DateOfBirthPicker onDateOfBirthSelected={(params) => updateForm('date_of_birth', params)} /> */}
                                    {/* <Dropdown title='Pet' data={userGenders || []}
                                        onChange={(item) => updateForm('gender', item.value)}
                                        placeholder="Select pet"
                                    /> */}
                                     <View className="space-y-2">
                                                    <Text className='text-base text-white font-firamedium'>Gender</Text>
                                                    <View className='border border-transparent w-full px-4 bg-[#5B5B5B] rounded-md focus:border-secondary items-center flex-row'>
                                                        <View 
                                                            className='flex-1 flex-row gap-x-2 h-12 items-center font-firaregular text-white divide divide-x divide-[#A9A9A9]'>
                                                            <TouchableOpacity className='flex-row items-center justify-between gap-0.5 flex-1 h-full' onPress={() => setShowGenderPicker(true)}>
                                                                <Text className='text-base text-white font-firaregular'>{form.gender ? getGenderName(form.gender): 'Select gender'}</Text>
                                                                <Feather className='ml-auto' name="chevron-down" size={20} color="white" />
                                                            </TouchableOpacity>
                                                        </View>
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
                    </View>
                </ScrollView>
            </SafeAreaView>
            <Sheet
                forceRemoveScrollEnabled={showGenderPicker}
                modal={true}
                open={showGenderPicker}
                disableDrag={true}
                onOpenChange={setShowGenderPicker}
                snapPointsMode={'fit'}
                dismissOnSnapToBottom
                zIndex={100_000}
                animation="quicker"
            >
                <Sheet.Overlay
                onPress={() => setShowGenderPicker(false)}
                    animation="quicker"
                    enterStyle={{ opacity: 0 }}
                    exitStyle={{ opacity: 0 }}
                />
                <Sheet.Frame paddingBottom="$5" gap="$5" backgroundColor={'#1A1A1A'}>
                    <XStack className='bg-[#1A1A1A] p-4 pb-0' gap="$2">
                        <TouchableOpacity onPress={() => { Keyboard.dismiss(); setShowGenderPicker(false) }} className=' absolute top-4 left-4 z-10 flex items-center justify-center pr-4'>
                            <Ionicons name="close-circle" size={24} color="#ffffff" />
                        </TouchableOpacity>
                        <Text className='font-firabold text-white text-base mx-auto'>Select Gender</Text>
                    </XStack>
                    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                        <YStack className='p-4' style={{ flexGrow: 1 }}>
                            <YStack gap="$2">
                                {userGenders?.map((gender, index) => (
                                    <ListItem onPress={() => setSelectGender(gender.id)} key={index} className={`bg-gray-800 rounded-lg ${form.gender == gender.id.toString() ? 'bg-secondary' : ''}`}>
                                        <XStack gap="$3" alignItems='center'>
                                            <Text className={`text-lg ${form.gender == gender.id.toString() ? 'text-black' : 'text-white'}`}>{gender.value}</Text>
                                        </XStack>
                                    </ListItem>
                                ))}
                            </YStack>
                        </YStack>
                    </KeyboardAvoidingView>
                </Sheet.Frame>
            </Sheet>
        </KeyboardAvoidingView>
    )
}

export default OnboardBioData

const styles = StyleSheet.create({})