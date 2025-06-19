import { Alert, Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import Images from '@/constants/images'
import { Form, YStack, XStack, Sheet, } from 'tamagui'
import CustomButton from '@/components/CustomButton'
import FormField from '@/components/FormField'
import Ionicons from '@expo/vector-icons/Ionicons';
import * as WebBrowser from 'expo-web-browser';
import { isValidEmail } from '@/utils/validators'
import { ReactionCodes } from '@/models/general'
import Toast from '@/components/toast/toast'
import Checkbox from 'expo-checkbox';
import axiosRequest from '@/utils/axios'
import { useLoader } from '@/context/loader/LoaderProvider'

type SigUpForm = {
    username: string;
    email: string;
    password: string;
    repeat_password: string;
    accepted_terms: boolean;
}

const SignIn = () => {
    const [isFormValid, setIsFormValid] = useState(false);
    const { show, hide } = useLoader();
    const [hasCreatedAccount, setHasCreatedAccount] = useState(false);
    const [errors, setErrors] = useState<SigUpForm | Record<string, string>>({});
    const [hasTyped, setHasTyped] = useState<Record<string, boolean>>({});
    const [form, setForm] = useState<SigUpForm>({
        email: '',
        password: '',
        username: '',
        repeat_password: '',
        accepted_terms: false
    })

    const updateForm = useCallback(<K extends keyof SigUpForm>(key: K, value: SigUpForm[K]) => {
        setForm({
            ...form,
            [key]: value
        })
    }, [form])

    const _handlePressButtonAsync = async (link: string) => {
        await WebBrowser.openBrowserAsync(link);
    };

    const handleInputChange = (field: keyof SigUpForm, value: string | boolean) => {
        updateForm(field, value);

        // Mark field as touched
        setHasTyped(prev => ({ ...prev, [field]: true }));
    };

    const validateForm = () => {
        let errors: { [key: string]: string } = {};
        if (!isValidEmail(form.email) || !form.email) {
            errors.email = 'Valid email is required';
        }
        if (!form.password || form.password.length < 6) {
            errors.password = 'Password is required';
        }
        if (!form.username || form.username.length < 3) {
            errors.username = 'Username is required';
        }
        if (!form.repeat_password || form.repeat_password.length < 6) {
            errors.repeat_password = 'Password is required';
        }
        if (form.password !== form.repeat_password) {
            errors.repeat_password = 'Passwords do not match';
        }
        if (!form.accepted_terms) {
            errors.accepted_terms = 'You must accept the terms and conditions';
        }
        setErrors(errors);
        setIsFormValid(Object.keys(errors).length === 0);
    }

    useEffect(() => {
        if (hasTyped.email || hasTyped.username || hasTyped.repeat_password || hasTyped.password || hasTyped.accepted_terms) {
            const timer = setTimeout(validateForm, 300); // Delay validation after typing
            return () => clearTimeout(timer);
        }
    }, [form]);

    const submit = async () => {
        if (!isFormValid) {
            return Alert.alert('Error', 'Please fill in all fields')
        }
        try {
            show();
            const response: any = await axiosRequest.post('/user/process-sign-up', form);
            hide();
            if (response.reaction === ReactionCodes.SUCCESS) {
                setHasCreatedAccount(true);
            }
        } catch (error: any) {
            hide();
            Alert.alert('Error', error.errorMessage ? error.errorMessage : 'Failed to log in')
        }
    }

    const handleResendEmail = async () => {
        try {
            setHasCreatedAccount(false);
            show();
            const response: any = await axiosRequest.post('/user/process-resend-activation-mail', { email: form.email });
            hide();
            if (response.reaction === ReactionCodes.SUCCESS) {
                Toast.success('Verification email sent successfully');
            }
        } catch (error: any) {
            hide();
            Alert.alert('Error', error.message ? error.message : 'Failed to log in')
        }
    }
    return (
        <>
            <SafeAreaView className='bg-primary h-full'>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }} >
                    <ScrollView>
                        <View className='w-full min-h-[85vh] justify-center px-4 my-6'>
                            <Form
                                gap="$7"
                            >
                                <YStack>
                                    <Image source={Images.logo} className='w-20 h-20 mx-auto' resizeMode='contain' />
                                    <Text className='text-2xl text-white font-semibold mt-10 font-firabold'>Create an Account</Text>
                                    <Text className='text-sm text-white font-semibold font-firamedium mt-3'>Join our community and experience seamlessness finding a soulmate. </Text>
                                </YStack>
                                <YStack gap="$3">
                                    <YStack gap="$1">
                                        <FormField
                                            title="Username"
                                            value={form.username}
                                            placeholder='Enter username'
                                            handleChangeText={(text: string) => handleInputChange('username', text)}
                                        />
                                        {hasTyped.username && errors.username && <Text className='text-xs text-red-500 font-firaregular'>{errors.username}</Text>}
                                    </YStack>
                                    <YStack gap="$1">
                                        <FormField
                                            title="Email"
                                            value={form.email}
                                            placeholder='Enter email'
                                            handleChangeText={(text: string) => handleInputChange('email', text)}
                                        />
                                        {hasTyped.email && errors.email && <Text className='text-xs text-red-500 font-firaregular'>{errors.email}</Text>}
                                    </YStack>
                                    <YStack gap="$1">
                                        <FormField
                                            title="Password"
                                            value={form.password}
                                            placeholder='Enter password'
                                            secureTextEntry
                                            handleChangeText={(text: string) => handleInputChange('password', text)}
                                        />
                                        {hasTyped.password && errors.password && <Text className='text-xs text-red-500 font-firaregular'>{errors.password}</Text>}
                                    </YStack>
                                    <YStack gap="$1">
                                        <FormField
                                            title="Confirm Password"
                                            value={form.repeat_password}
                                            placeholder='Confirm password'
                                            secureTextEntry
                                            handleChangeText={(text: string) => handleInputChange('repeat_password', text)}
                                        />
                                        {hasTyped.repeat_password && errors.repeat_password && <Text className='text-xs text-red-500 font-firaregular'>{errors.repeat_password}</Text>}
                                    </YStack>
                                </YStack>
                                <YStack>
                                    <XStack alignItems="center" gap="$3">
                                        {/* <Checkbox checked={form.accepted_terms} onCheckedChange={(checked: boolean) => handleInputChange('accepted_terms', checked)} size="$4" className='bg-primary border-2 border-white'>
                                            <Checkbox.Indicator>
                                                <MaterialCommunityIcons name="check-bold" size={18} color="#ffffff" />
                                            </Checkbox.Indicator>
                                        </Checkbox> */}
                                        <Checkbox value={form.accepted_terms} onValueChange={(checked: boolean) => handleInputChange('accepted_terms', checked)} />

                                        {/* <BouncyCheckbox
                                        isChecked={form.accepted_terms}
  size={25}
  fillColor="#DD3FE5"
  unFillColor="#1A1A1A"
  text="Custom Checkbox"
  iconStyle={{ borderColor: "white" }}
  innerIconStyle={{ borderWidth: 2 }}
  onPress={(checked: boolean) => handleInputChange('accepted_terms', checked)}
/> */}
                                        <View className='flex flex-wrap flex-1 flex-row gap-1'>
                                            <Text className='text-base text-white font-firaregular'>I accept all</Text>
                                            <TouchableHighlight onPress={() => _handlePressButtonAsync('https://dazzzle.org/privacy-policy')}>
                                                <Text className='text-base text-tertiary font-firaregular'>terms and conditions</Text>
                                            </TouchableHighlight>
                                            <Text className='text-base text-white font-firaregular'>and</Text>
                                            <TouchableHighlight onPress={() => _handlePressButtonAsync('https://dazzzle.org/privacy-policy')}>
                                                <Text className='text-base text-tertiary font-firaregular'>privacy policy</Text>
                                            </TouchableHighlight>
                                        </View>
                                    </XStack>
                                    {hasTyped.accepted_terms && errors.accepted_terms && <Text className='text-xs text-red-500 font-firaregular'>{errors.accepted_terms}</Text>}
                                </YStack>
                                <Form.Trigger asChild>
                                    <CustomButton title='Register' handlePress={submit} />
                                </Form.Trigger>
                            </Form>
                            <View className='justify-center pt-5 flex-row gap-2'>
                                <Text className='text-sm text-white font-firaregular'>Already have an account?</Text>
                                <TouchableOpacity onPress={() => router.replace('/(auth)/sign-in')}>
                                    <Text className='text-sm text-tertiary font-firaregular underline'>Sign In</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
            <Sheet
                forceRemoveScrollEnabled={hasCreatedAccount}
                modal={true}
                open={hasCreatedAccount}
                disableDrag={true}
                onOpenChange={setHasCreatedAccount}
                snapPointsMode={'fit'}
                dismissOnSnapToBottom
                zIndex={100_000}
                animation="medium"
            >
                <Sheet.Overlay
                    onPress={() => setHasCreatedAccount(false)}
                    animation="medium"
                    enterStyle={{ opacity: 0 }}
                    exitStyle={{ opacity: 0 }}
                />
                <Sheet.Frame paddingBottom="$2" gap="$5" backgroundColor={'#1A1A1A'}>
                    <View className='bg-[#1A1A1A] flex-row items-center p-4 pb-0 space-x-1' >
                        <TouchableOpacity onPress={() => setHasCreatedAccount(false)} className='z-10 flex items-center justify-center pr-4'>
                            <Ionicons name="close-circle" size={24} color="#ffffff" />
                        </TouchableOpacity>
                    </View>
                    <View className='px-6 pt-4 pb-10'>
                        <View className='space-y-4 text-center mb-5'>
                            <Text className='text-white text-lg font-firabold text-center'>Account Created!</Text>
                            <Text className='text-white text-sm font-firaregular text-center'>Your account created successfully, to activate your account please check your email.</Text>
                        </View>
                        <XStack gap="$2" alignItems="center" justifyContent="center" mb="$5">
                            <Text className='text-white text-sm font-firaregular text-center'>If you didn't receive the email,</Text>
                            <Pressable onPress={handleResendEmail}>
                                <Text className='text-tertiary font-firaregular'>Resend Email</Text>
                            </Pressable>
                        </XStack>
                        <CustomButton title="Log In" handlePress={() => router.replace('/(auth)/sign-in')} />
                    </View>
                </Sheet.Frame>
            </Sheet>
        </>
    )
}

export default SignIn

const styles = StyleSheet.create({})