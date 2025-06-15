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
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks'
import { userLogin } from '@/redux/thunks/authActions'
import { Loader } from '@/components/loader/LoaderWrapper'

const SignIn = () => {
    const dispatch = useAppDispatch();
    const { loading, isProfileCompleted, userInfo, error } = useAppSelector(state => state.auth);
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
        // setIsSubmitting(true);
        // try {
        //     const {data} = await axiosRequest.post(API_URL + '/user/login-process', form);
        //     const authApiResponse = data as AuthApiResponse;
        //     console.log('authApiResponse', authApiResponse);
        //     const user = authApiResponse.data.auth_info;
        //     const token = authApiResponse.data.access_token;
        //     const isProfileComplete = authApiResponse && authApiResponse.data && authApiResponse.data.auth_info? authApiResponse.data.auth_info.isProfileComplete : false;
        //     await setItem('dazzzle-user', user);
        //     await setItem('dazzzle-token', token);
        //     setUser(user);
        //     setToken(token);
        //     if (isProfileComplete) {
        //         const isPremium = user.profile.is_premium;
        //         const userSubscription = authApiResponse.data.userSubscription; 
        //         if (isPremium || userSubscription) {
        //             await setItem('profileCompletion', 'completed');
        //             router.replace('/(tabs)/discover');
        //         } else {
        //             router.replace('../subscription');
        //         }
        //     } else {
        //         await setItem('profileCompletion', 'incomplete');
        //         router.replace('/onboard/bio-data');
        //     }
        //     setIsSubmitting(false);
        // } catch (error: any) {
        //     setIsSubmitting(false);
        //     Alert.alert('Error', error.errorMessage ? error.errorMessage : 'Failed to log in');
        // } finally {
        //     setIsSubmitting(false);
        // }
        dispatch(userLogin(form));
    }

    useEffect(() => {
        if (error) {
            Alert.alert('Error', error ? error : 'Failed to log in');
        }
    },[error])

    useEffect(() => {
        if (userInfo) {
            if (isProfileCompleted) {
                if (userInfo.is_premium) {
                    // router.replace('/(tabs)/discover');
                    router.replace('/user-details')
                } else {
                    router.replace('/paywall');
                }
            } else {
                router.replace('/onboard/bio-data');
            }
        }
    }, [userInfo, isProfileCompleted])

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
                                <CustomButton disabled={loading} title={loading ? 'Loading...' : 'Sign In'} handlePress={submit} />
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