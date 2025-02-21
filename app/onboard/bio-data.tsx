import { Alert, Image, KeyboardAvoidingView, SafeAreaView, Platform, ScrollView, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View, TextInput, Keyboard } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
// import { SafeAreaView } from 'react-native-safe-area-context'

import { Link, router, useFocusEffect } from 'expo-router'
import { useGlobalContext } from '@/context/GlobalProvider'
import Images from '@/constants/images'
import { Button, Form, H4, Spinner, YStack, Input, Label, Checkbox, XStack, Progress, Sheet, } from 'tamagui'
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

type BioDataForm = {
    first_name: string;
    last_name: string;
    phone_number: string;
    birthday: string;
    gender: string;
    country_code: string;
};
const OnboardBioData = () => {
    const {axiosRequest} = useAxiosContext();
    const userGenders = useGeneralConfig()?.genders.map((gender) => ({ label: gender.value, value: gender.value }));
    const [progress, setProgress] = React.useState(0)

    const [status, setStatus] = React.useState<'off' | 'submitting' | 'submitted'>('off')
    const [form, setForm] = useState<BioDataForm>({
        first_name: '',
        last_name: '',
        phone_number: '',
        birthday: '',
        gender: '',
        country_code: ''
    })

    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchUserProfileUpdateStatus = async () => {
        try {
          const response = await axiosRequest.get('/profile/check-profile-updated');
          const reaction = response.data.reaction;
          const responseData = response.data.data;
          console.log('responseData', responseData);
          if (reaction === ReactionCodes.SUCCESS) {
            const profileData = responseData['profileInfo'];
            console.log('profileData', profileData);
            if (profileData) {
                setForm({
              first_name: profileData.first_name,
              last_name: profileData.last_name,
              phone_number: profileData.mobile_number,
              birthday: profileData.birthday,
              gender: profileData.gender,
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
            console.log("'Hello, I'm focused!'");

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

    const _handlePressButtonAsync = async (link: string) => {
        await WebBrowser.openBrowserAsync(link);
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
                                            <XStack gap="$2"
                                                className='flex-1 h-12 items-center font-firaregular text-white divide divide-x divide-[#A9A9A9]'>
                                                <CountryCodePicker onCountryCodeSelect={country => updateForm('country_code', country)} />
                                                <TextInput
                                                    style={{ lineHeight: Platform.OS == 'ios' ? 0 : undefined }}
                                                    className='flex-1 h-full px-4 font-firaregular text-white text-base'
                                                    value={form.phone_number}
                                                    inputMode="tel"
                                                    onChangeText={(text: string) => updateForm('phone_number', text)}
                                                    placeholder="Phone Number"
                                                    placeholderTextColor={"#fbfbfb73"}
                                                    selectionColor={'#DD3FE5'}
                                                />
                                            </XStack>
                                        </View>
                                    </View>
                                    <DateOfBirthPicker onDateOfBirthSelected={(params) => updateForm('birthday', params)} />
                                    <Dropdown title='Pet' data={userGenders || []}
                                        onChange={(item) => updateForm('gender', item.value)}
                                        placeholder="Select pet"
                                    />

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
                </ScrollView>
            </SafeAreaView>
        </KeyboardAvoidingView>
    )
}

export default OnboardBioData

const styles = StyleSheet.create({})