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
            // if (user) {
            //     const destination = !isProfileComplete
            //         ? '/onboard'
            //         : user.is_premium
            //             ? '/(tabs)'
            //             : '/paywall';

            //     // Delay the replace so Android doesn't crash trying to reattach views
            //     InteractionManager.runAfterInteractions(() => {
            //         router.replace(destination);
            //     });

            //     // Alternative lightweight hack:
            //     // setTimeout(() => router.replace(destination), 0);
            // }
        } catch (error) {
            Alert.alert('Error', error ? String(error) : 'Failed to log in');
        }
    }

    return (
        <SafeAreaView style={{ flex: 1 }} className=' h-full bg-white'>
            <KeyboardAvoidingView behavior={"padding"}
         style={{ flex: 1 }} >
                <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 16 }}>
                    <View className='w-full h-full py-16 justify-between'>
                        <Formik
  initialValues={{ password: '', email_or_username: '' }}
  onSubmit={logUserIn}
  // Remove enableReinitialize unless you strictly need it (it can cause flickers)
  validationSchema={signInValidationSchema}
>
  {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isValid }) => {
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
              title="Username"
              placeholder='Enter username'
              value={values.email_or_username}
              editable={!loading}
              
              // 1. Pass Formik handlers directly
              onChangeText={handleChange('email_or_username')}
              onBlur={handleBlur('email_or_username')}
              
              // 2. Pass Error and Touched status directly
              errorMessage={errors.email_or_username}
              touched={touched.email_or_username}
            />
          </View>
          <View>
            <FormField
              title="Password"
              placeholder='Enter password'
              value={values.password}
              editable={!loading}
              secureTextEntry
              
              // 1. Pass Formik handlers directly
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              
              // 2. Pass Error and Touched status directly
              errorMessage={errors.password}
              touched={touched.password}
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