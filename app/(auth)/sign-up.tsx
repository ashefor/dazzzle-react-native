import { Alert, Image, ScrollView, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { router } from 'expo-router'
import Images from '@/constants/images'
import { YStack, XStack } from 'tamagui'
import CustomButton from '@/components/CustomButton'
import FormField from '@/components/FormField'
import * as WebBrowser from 'expo-web-browser'
import { ReactionCodes } from '@/models/general'
import Toast from '@/components/toast/toast'
import Checkbox from 'expo-checkbox'
import axiosRequest from '@/utils/axios'
import { useLoader } from '@/context/loader/LoaderProvider'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import * as yup from 'yup'
import { Formik } from 'formik'
import { KeyboardAvoidingView } from "react-native-keyboard-controller"


type SigUpForm = {
    username: string;
    email: string;
    password: string;
    repeat_password: string;
    accepted_terms: boolean;
}
const SignIn = () => {
    const insets = useSafeAreaInsets();
    const { show, hide } = useLoader();
    const [hasCreatedAccount, setHasCreatedAccount] = useState(false);
    const [email, setEmail] = useState('');


    const _handlePressButtonAsync = async (link: string) => {
        await WebBrowser.openBrowserAsync(link);
    };


    const createAccount = async (formValues: SigUpForm) => {
        try {
            show();
            const response: any = await axiosRequest.post('/user/process-sign-up', formValues);
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
            const response: any = await axiosRequest.post('/user/process-resend-activation-mail', { email });
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
            <View style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }} className='h-full'>
                <KeyboardAvoidingView>
                    <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 16 }}>
                        <View className='w-full h-full justify-center'>
                            <Formik
                                initialValues={{ password: '', username: '', repeat_password: '', email: '', accepted_terms: false }}
                                onSubmit={createAccount}
                                validationSchema={signUpValidationSchema}
                            >
                                {({ handleChange, handleBlur, handleSubmit, values, errors, isValid, setFieldValue }) => {
                                    return (
                                        <View className='flex-1 '>
                                            <YStack>
                                                <Image source={Images.logo} className='w-20 h-20 mx-auto' resizeMode='contain' />
                                                <Text className='text-2xl text-black font-semibold mt-10 font-firabold'>Create an Account</Text>
                                                <Text className='text-sm text-black font-semibold font-firamedium mt-3'>Join our community and experience seamlessness finding a soulmate. </Text>
                                            </YStack>
                                            <YStack gap="$3" mt={20} mb={20}>
                                                <FormField
                                                    title="Username"
                                                    placeholder=''
                                                    onChangeText={handleChange('username')}
                                                    onBlur={handleBlur('username')}
                                                    showCustomError={errors.username ? true : false}
                                                    errorMessage={errors.username}
                                                    value={values.username}
                                                />
                                                <FormField
                                                    title="Email"
                                                    placeholder=''
                                                    onChangeText={(t) => {
                                                        handleChange('email')(t);
                                                        setEmail(t);
                                                    }}
                                                    onBlur={handleBlur('email')}
                                                    showCustomError={errors.email ? true : false}
                                                    errorMessage={errors.email}
                                                    value={values.email}
                                                    keyboardType='email-address'
                                                />
                                                <FormField
                                                    title="Password"
                                                    placeholder=''
                                                    onChangeText={handleChange('password')}
                                                    onBlur={handleBlur('password')}
                                                    showCustomError={errors.password ? true : false}
                                                    errorMessage={errors.password}
                                                    value={values.password}
                                                    secureTextEntry
                                                />
                                                <FormField
                                                    title="Confirm Password"
                                                    placeholder=''
                                                    onChangeText={handleChange('repeat_password')}
                                                    onBlur={handleBlur('repeat_password')}
                                                    showCustomError={errors.repeat_password ? true : false}
                                                    errorMessage={errors.repeat_password}
                                                    value={values.repeat_password}
                                                    secureTextEntry
                                                />
                                                <XStack alignItems="center" gap="$3" py={10}>
                                                    <Checkbox value={values.accepted_terms} onValueChange={(checked: boolean) => setFieldValue('accepted_terms', checked)} />
                                                    <View className='flex flex-wrap flex-1 flex-row gap-1'>
                                                        <Text className='text-base text-black font-firaregular'>I accept all</Text>
                                                        <TouchableHighlight onPress={() => _handlePressButtonAsync('https://dazzzle.org/privacy-policy')}>
                                                            <Text className='text-base text-primary font-firaregular underline'>terms and conditions</Text>
                                                        </TouchableHighlight>
                                                        <Text className='text-base text-black font-firaregular'>and</Text>
                                                        <TouchableHighlight onPress={() => _handlePressButtonAsync('https://dazzzle.org/privacy-policy')}>
                                                            <Text className='text-base text-primary font-firaregular underline'>privacy policy</Text>
                                                        </TouchableHighlight>
                                                    </View>
                                                </XStack>
                                            </YStack>

                                            <View className='mt-auto'>
                                                <CustomButton title='Register' disabled={!isValid} handlePress={handleSubmit} />
                                            </View>
                                        </View>
                                    )
                                }}
                            </Formik>
                            <View className='justify-center pt-5 flex-row gap-2'>
                                <Text className='text-sm text-black font-firaregular'>Already have an account?</Text>
                                <TouchableOpacity onPress={() => router.replace('/(auth)/sign-in')}>
                                    <Text className='text-sm text-primary font-firaregular underline'>Sign In</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
            {/* <Sheet
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
                    <View className=' flex-row items-center p-4 pb-0 space-x-1' >
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
            </Sheet> */}
        </>
    )
}

export default SignIn

const signUpValidationSchema = yup.object().shape({
    username: yup.string().required('Full name is required'),
    email: yup
        .string()
        .email("Please enter valid email")
        .required('Email is required'),
    password: yup
        .string()
        .matches(/\w*[a-z]\w*/, "Password must have a small letter")
        .matches(/\w*[A-Z]\w*/, "Password must have a capital letter")
        .matches(/\d/, "Password must have a number")
        .matches(/[!@#$%^&*()\-_"=+{}; :,<.>]/, "Password must have a special character")
        .min(8, ({ min }) => `Password must be at least ${min} characters`)
        .required('Password is required'),
    repeat_password: yup
        .string()
        .oneOf([yup.ref('password')], 'Passwords do not match')
        .required('Confirm password is required'),
    accepted_terms: yup
        .boolean()
        .oneOf([true], 'You must accept the terms and conditions'),
})
