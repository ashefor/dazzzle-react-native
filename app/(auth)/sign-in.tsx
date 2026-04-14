import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import Images from '@/constants/images'
import CustomButton from '@/components/CustomButton'
import FormField from '@/components/FormField'
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks'
import { userLogin } from '@/redux/thunks/authActions'
import * as yup from 'yup'
import { Formik } from 'formik'
import { KeyboardAvoidingView } from "react-native-keyboard-controller"

const SignIn = () => {
    const dispatch = useAppDispatch();
    const { loading } = useAppSelector(state => state.auth);

    const logUserIn = async ({ password, email_or_username }: { password: string; email_or_username: string }) => {
        try {
            dispatch(userLogin({ email_or_username, password }))
        } catch (error) {
            Alert.alert('Error', error ? String(error) : 'Failed to log in');
        }
    }

    return (
        <SafeAreaView style={{ flex: 1 }} className=' h-full bg-white'>
            <KeyboardAvoidingView behavior={"padding"} style={{ flex: 1 }} >
                <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 16 }}>
                    <View className='w-full h-full py-16 justify-between'>
                        <Formik
                            initialValues={{ password: '', email_or_username: '' }}
                            onSubmit={logUserIn}
                            validationSchema={signInValidationSchema}
                            // validateOnMount={true}
                        >
                            {({ handleBlur, handleSubmit, values, errors, touched, isValid, setFieldValue, setFieldTouched }) => {
                                return (
                                    <View className='flex-1'>
                                        <View>
                                            <Image source={Images.logo} className='w-20 h-20 mx-auto' resizeMode='contain' />
                                            <Text className='text-2xl text-black font-semibold mt-10 font-firabold'>Sign In</Text>
                                            <Text className='text-sm text-black font-firamedium mt-3'>Join our community...</Text>
                                        </View>

                                        <View className='my-5 space-y-3'>
                                            <View>
                                                <FormField
                                                    title="Email or Username"
                                                    placeholder='Enter email or username'
                                                    value={values.email_or_username}
                                                    editable={!loading}

                                                    onChangeText={(text) => setFieldValue('email_or_username', text.trim())}
                                                    onBlur={handleBlur('email_or_username')}

                                                    errorMessage={errors.email_or_username}
                                                    touched={touched.email_or_username}

                                                    textContentType="username"
                                                    autoComplete="username"
                                                    keyboardType="email-address"
                                                />
                                            </View>
                                            <View>
                                                <FormField
                                                    title="Password"
                                                    placeholder='Enter password'
                                                    value={values.password}
                                                    editable={!loading}
                                                    secureTextEntry

                                                    onChangeText={(text) => setFieldValue('password', text)}
                                                    onBlur={handleBlur('password')}

                                                    errorMessage={errors.password}
                                                    touched={touched.password}

                                                    textContentType="password"
                                                    autoComplete="password"
                                                />
                                            </View>
                                        </View>

                                        <View className='mt-auto'>
                                            <CustomButton
                                                disabled={loading || !isValid}
                                                title={loading ? 'Loading...' : 'Sign In'} 
                                                handlePress={handleSubmit} 
                                            />
                                        </View>
                                    </View>
                                )
                            }}
                        </Formik>
                        
                        <View className='justify-center pt-5 flex-row gap-2'>
                            <Text className='text-sm text-black font-firaregular'>Don't have an account?</Text>
                            <TouchableOpacity onPress={() => router.replace('/(auth)/sign-up')}>
                                <Text className='text-sm text-primary font-firaregular underline'>Create an Account</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default SignIn

const signInValidationSchema = yup.object().shape({
    password: yup
        .string()
        .min(6, ({ min }) => `Password must be at least ${min} characters`)
        .required('Password is required'),
    email_or_username: yup
        .string()
        .trim()
        .matches(
            /^(?:[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}|[A-Z0-9._-]{3,30})$/i,
            "Please enter a valid email or username"
        )
        .required("Username is required"),
})