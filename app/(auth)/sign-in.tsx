import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import Images from '@/constants/images'
import { YStack } from 'tamagui'
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
            const { user, isProfileComplete } = await dispatch(userLogin({ email_or_username, password })).unwrap();
            if (user) {
                if (isProfileComplete) {
                    if (user.is_premium) {
                        router.replace('/(tabs)');
                    } else {
                        router.replace('/paywall');
                    }
                } else {
                    router.replace('/onboard');
                }
            }
        } catch (error) {
            Alert.alert('Error', error ? String(error) : 'Failed to log in');
        }
    }

    return (
        <SafeAreaView style={{ flex: 1 }} className=' h-full'>
            <KeyboardAvoidingView behavior={"padding"}
         style={{ flex: 1 }} >
                <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 16 }}>
                    <View className='w-full h-full py-16 justify-between'>
                        <Formik
                            initialValues={{ password: '', email_or_username: '' }}
                            onSubmit={logUserIn}
                            enableReinitialize
                            validationSchema={signInValidationSchema}
                        >
                            {({ handleChange, handleBlur, handleSubmit, values, errors, isValid }) => {
                                return (
                                    <View className='flex-1 '>
                                        <YStack>
                                            <Image source={Images.logo} className='w-20 h-20 mx-auto' resizeMode='contain' />
                                            <Text className='text-2xl text-black font-semibold mt-10 font-firabold'>Sign In</Text>
                                            <Text className='text-sm text-black font-firamedium mt-3'>Join our community and experience seamlessness finding a soulmate. </Text>
                                        </YStack>
                                        <YStack gap="$3" mt={20} mb={20}>
                                            <FormField
                                                editable={!loading}
                                                title="Username"
                                                placeholder='Enter username'
                                                onChangeText={handleChange('email_or_username')}
                                                onBlur={handleBlur('email_or_username')}
                                                showCustomError={errors.email_or_username ? true : false}
                                                errorMessage={errors.email_or_username}
                                                value={values.email_or_username}
                                            />
                                            <FormField
                                                title="Password"
                                                editable={!loading}
                                                placeholder='Enter password'
                                                onChangeText={handleChange('password')}
                                                onBlur={handleBlur('password')}
                                                secureTextEntry
                                                showCustomError={errors.password ? true : false}
                                                value={values.password}
                                                errorMessage={errors.password}
                                            />

                                        </YStack>
                                        <View className='mt-auto'>
                                            <CustomButton disabled={loading || !isValid} title={loading ? 'Loading...' : 'Sign In'} handlePress={handleSubmit} />
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
        .min(8, ({ min }) => `Password must be at least ${min} characters`)
        .required('Password is required'),
    email_or_username: yup
        .string()
        .matches(
            /^(?:[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}|[A-Z0-9._-]{3,30})$/i,
            "Please enter a valid email or username"
        )
        .required("Username is required"),
})