import { Alert, Image, ScrollView, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native'
import React, { JSX, useCallback, useRef, useState } from 'react'
import { router } from 'expo-router'
import Images from '@/constants/images'
import CustomButton from '@/components/CustomButton'
import FormField from '@/components/FormField'
import * as WebBrowser from 'expo-web-browser'
import { ReactionCodes } from '@/models/general'
import Toast from '@/components/toast/toast'
import Checkbox from 'expo-checkbox'
import axiosRequest from '@/utils/axios'
import { useLoader } from '@/context/loader/LoaderProvider'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import * as yup from 'yup'
import { Formik } from 'formik'
import { KeyboardAvoidingView } from "react-native-keyboard-controller"
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'
import { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types'
import LottieView from 'lottie-react-native'


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
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);


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
                bottomSheetModalRef.current?.present();
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
       <SafeAreaView className='flex-1 bg-white'>
                <KeyboardAvoidingView behavior={'padding'}>
                    <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 16 }}>
                        <View className='w-full h-full justify-center'>
                            <Formik
                                initialValues={{ password: '', username: '', repeat_password: '', email: '', accepted_terms: false }}
                                onSubmit={createAccount}
                                validationSchema={signUpValidationSchema}
                            >
                                {({ handleChange, handleBlur, handleSubmit, values, errors, isValid, touched, setFieldValue }) => {
                                    return (
                                        <View className='flex-1 '>
                                            <View>
                                                <Image source={Images.logo} className='w-20 h-20 mx-auto' resizeMode='contain' />
                                                <Text className='text-2xl text-black font-semibold mt-10 font-firabold'>Create an Account</Text>
                                                <Text className='text-sm text-black font-semibold font-firamedium mt-3'>Join our community and experience seamlessness finding a soulmate. </Text>
                                            </View>
                                            <View className='my-5 space-y-3'>
                                                <View>
                                                    <FormField
                                                    title="Username"
                                                    placeholder=''
                                                    onChangeText={handleChange('username')}
                                                    onBlur={handleBlur('username')}

                                                    errorMessage={errors.username}
                                                    value={values.username}
                                                    touched={touched.username}
                                                />
                                                </View>
                                                <View>
                                                    <FormField
                                                    title="Email"
                                                    placeholder=''
                                                    onChangeText={(t) => {
                                                        handleChange('email')(t);
                                                        setEmail(t);
                                                    }}
                                                    onBlur={handleBlur('email')}
                                                    errorMessage={errors.email}
                                                    value={values.email}
                                                    keyboardType='email-address'
                                                    touched={touched.email}
                                                />
                                                </View>
                                                <View>
                                                    <FormField
                                                    title="Password"
                                                    placeholder=''
                                                    onChangeText={handleChange('password')}
                                                    onBlur={handleBlur('password')}
                                                    errorMessage={errors.password}
                                                    value={values.password}
                                                    touched={touched.password}
                                                    secureTextEntry
                                                />
                                                </View>
                                                <View>
                                                    <FormField
                                                    title="Confirm Password"
                                                    placeholder=''
                                                    onChangeText={handleChange('repeat_password')}
                                                    onBlur={handleBlur('repeat_password')}
                                                    touched={touched.repeat_password}
                                                    errorMessage={errors.repeat_password}
                                                    value={values.repeat_password}
                                                    secureTextEntry
                                                />
                                                </View>
                                                <View className='flex flex-row items-center py-2.5 gap-2'>
                                                    <Checkbox value={values.accepted_terms} onValueChange={(checked: boolean) => setFieldValue('accepted_terms', checked)} />
                                                    <View className='flex flex-wrap flex-1 flex-row gap-1'>
                                                        <Text className='text-sm text-black font-firaregular'>I accept all</Text>
                                                        <TouchableHighlight onPress={() => _handlePressButtonAsync('https://dazzzle.org/privacy-policy')}>
                                                            <Text className='text-sm text-primary font-firaregular underline'>terms and conditions</Text>
                                                        </TouchableHighlight>
                                                        <Text className='text-sm text-black font-firaregular'>and</Text>
                                                        <TouchableHighlight onPress={() => _handlePressButtonAsync('https://dazzzle.org/privacy-policy')}>
                                                            <Text className='text-sm text-primary font-firaregular underline'>privacy policy</Text>
                                                        </TouchableHighlight>
                                                    </View>
                                                </View>
                                            </View>

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

                 <BottomSheetModal
                ref={bottomSheetModalRef}
                enableDynamicSizing
                enablePanDownToClose={true}
                style={{
                    borderRadius: 28,
                }}
                backgroundStyle={{
                    borderRadius: 28,
                }}
                backdropComponent={renderBackdrop}
                onDismiss={() => router.replace('/(auth)/sign-in')}
            >

                <BottomSheetView>
                    <View style={{ paddingBottom: insets.bottom + 10, paddingHorizontal: 20 }}>
                        <View style={styles.lottieContainer}>
                            <LottieView
                                source={require('../../assets/checkmark.json')} // Point to your JSON file
                                style={styles.lottie}
                                autoPlay={true} // Set to true if you want it to loop or start immediately
                                loop={true}     // Set to true if you want it to repeat
                            />
                        </View>
                        <View className='mb-7'>
                            <Text className='text-2xl font-semibold mb-2 text-center'>
                               Account Created!
                            </Text>
                            <Text className='text-base font-firaregular text-center'>
                                Your account created successfully, to activate your account please check your email.
                            </Text>
                             <View className='justify-center pt-5 flex-row gap-2'>
                                <Text className='text-sm text-black font-firaregular'>Didn't get the email?</Text>
                                <TouchableOpacity onPress={handleResendEmail}>
                                    <Text className='text-sm text-primary font-firaregular underline'>Resend Email</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => bottomSheetModalRef.current?.dismiss()} className='rounded-[26px] h-12 bg-primary flex items-center justify-center'>
                            <Text className='text-base font-firamedium text-white'>
                                Take me to Sign In
                            </Text>
                        </TouchableOpacity>
                    </View>
                </BottomSheetView>
            </BottomSheetModal>

       </SafeAreaView>
    )
}

export default SignIn

const styles = StyleSheet.create({
    lottieContainer: {
        width: 120,
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 'auto'
    },
    lottie: {
        width: '100%',
        height: '100%',
    },
})

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
