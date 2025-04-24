import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Link, router } from 'expo-router'
import { useGlobalContext } from '@/context/GlobalProvider'
import Images from '@/constants/images'
import { Button, Form, H4, Spinner, YStack, Input, Label, } from 'tamagui'
import CustomButton from '@/components/CustomButton'
import FormField from '@/components/FormField'
import axios from 'axios'
import { AuthApiResponse } from '@/models/user'
import { isValidUsernameOrEmail } from '@/utils/validators'
import { API_URL } from '@/constants/constants'
import { useAxiosContext } from '@/context/AxiosProvider'
import { setItem } from '@/utils/asyncStorage'

const SignIn = () => {
    const { setUser, setAuthState, setToken } = useGlobalContext();
    const { axiosRequest } = useAxiosContext();
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [status, setStatus] = useState<'off' | 'submitting' | 'submitted'>('off');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const [form, setForm] = useState({
        email_or_username: '',
        password: ''
    })
    const [hasTyped, setHasTyped] = useState<{ email_or_username: boolean; password: boolean }>({
        email_or_username: false,
        password: false
    });

    useEffect(() => {
        if (hasTyped.email_or_username || hasTyped.password) {
            const timer = setTimeout(validateForm, 300); // Delay validation after typing
            return () => clearTimeout(timer);
        }
    }, [form.email_or_username, form.password])

    const validateForm = () => {
        let errors: { [key: string]: string } = {};
        if (!isValidUsernameOrEmail(form.email_or_username) || !form.email_or_username) {
            errors.email_or_username = 'Email or username is required';
        }
        if (!form.password || form.password.length < 6) {
            errors.password = 'Password is required';
        }
        setErrors(errors);
        setIsFormValid(Object.keys(errors).length === 0);
    }

    const handleInputChange = (field: string, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));

        // Mark field as touched
        setHasTyped(prev => ({ ...prev, [field]: true }));
    };

    const submit = async () => {
        if (!isFormValid) {
            return Alert.alert('Error', 'Please fill in all fields')
        }
        setIsSubmitting(true);
        try {
            const response = await axiosRequest.post(API_URL + '/user/login-process', form);
            const authApiResponse = response.data as AuthApiResponse
            const user = authApiResponse.data.auth_info;
            const token = authApiResponse.data.access_token;
            const isProfileComplete = authApiResponse.data.auth_info.isProfileComplete;
            setItem('dazzzle-user', user);
            setItem('dazzzle-token', token);
            setUser(user);
            setToken(token);
            if (!isProfileComplete) {
                setAuthState('completed');
                router.replace('/(tabs)');
            } else {
                setAuthState('incomplete');
                router.replace('/onboard/bio-data');
            }
            setIsSubmitting(false);
        } catch (error: any) {
            setIsSubmitting(false);
            console.log('error', error);
            Alert.alert('Error', error.message ? error.message : 'Failed to log in');
        } finally {
            setIsSubmitting(false);
        }
    }
    return (
        <SafeAreaView className='bg-primary h-full'>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }} >
                <ScrollView>
                    <View className='w-full min-h-[85vh] justify-center px-4 my-6'>
                        <Form
                            gap="$7"
                        >
                            <YStack>
                                <Image source={Images.logo} className='w-20 h-20 mx-auto' resizeMode='contain' />
                                <Text className='text-2xl text-white font-semibold mt-10 font-firabold'>Sign In</Text>
                                <Text className='text-sm text-white font-firamedium mt-3'>Join our community and experience seamlessness finding a soulmate. </Text>
                            </YStack>
                            <YStack gap="$3">
                                <YStack gap="$1">
                                    <FormField
                                        title="Username"
                                        value={form.email_or_username}
                                        placeholder='Enter username'
                                        handleChangeText={(text: string) => handleInputChange("email_or_username", text)}
                                    />
                                    {hasTyped.email_or_username && errors.email_or_username && <Text className='text-xs text-red-500 font-firaregular'>{errors.email_or_username}</Text>}
                                </YStack>
                                <YStack gap="$1">
                                    <FormField
                                        title="Password"
                                        value={form.password}
                                        placeholder='Enter password'
                                        handleChangeText={(text: string) => handleInputChange("password", text)}
                                    />
                                    {hasTyped.password && errors.password && <Text className='text-xs text-red-500 font-firaregular'>{errors.password}</Text>}
                                </YStack>

                            </YStack>
                            <Form.Trigger asChild disabled={status !== 'off'}>
                                <CustomButton title='Sign In' handlePress={submit} />
                            </Form.Trigger>
                        </Form>
                        <View className='justify-center pt-5 flex-row gap-2'>
                            <Text className='text-sm text-white font-firaregular'>Don't have an account?</Text>
                            <Link className='text-sm text-tertiary font-firaregular underline' href='./sign-up'>Create an Account</Link>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default SignIn

const styles = StyleSheet.create({})