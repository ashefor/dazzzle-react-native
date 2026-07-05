import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { JSX, useCallback, useRef, useState } from 'react'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import Images from '@/constants/images'
import CustomButton from '@/components/CustomButton'
import FormField from '@/components/FormField'
import axiosRequest from '@/utils/axios'
import { ReactionCodes } from '@/models/general'
import * as yup from 'yup'
import { Formik } from 'formik'
import { KeyboardAvoidingView } from "react-native-keyboard-controller"
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'
import { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types'
import Ionicons from '@expo/vector-icons/Ionicons'

const ForgotPassword = () => {
    const insets = useSafeAreaInsets();
    const [loading, setLoading] = useState(false);
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);

    const requestPasswordReset = async ({ email }: { email: string }) => {
        try {
            setLoading(true);
            const data: any = await axiosRequest.post('/user/forgot-password', { email }, { showGlobalLoader: false });
            if (data.reaction === ReactionCodes.SUCCESS) {
                bottomSheetModalRef.current?.present();
            }
        } catch (error: any) {
            Alert.alert('Error', error.errorMessage ? error.errorMessage : 'Unable to send reset instructions');
        } finally {
            setLoading(false);
        }
    }

    const renderBackdrop = useCallback(
        (props: JSX.IntrinsicAttributes & BottomSheetDefaultBackdropProps) => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1}
                appearsOnIndex={0}
            />
        ),
        []
    );

    return (
        <SafeAreaView style={{ flex: 1 }} className=' h-full bg-white'>
            <KeyboardAvoidingView behavior={"padding"} style={{ flex: 1 }} >
                <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 16 }}>
                    <View className='w-full h-full py-16 justify-between'>
                        <Formik
                            initialValues={{ email: '' }}
                            onSubmit={requestPasswordReset}
                            validationSchema={forgotPasswordValidationSchema}
                        >
                            {({ handleBlur, handleSubmit, values, errors, touched, isValid, setFieldValue }) => {
                                return (
                                    <View className='flex-1'>
                                        <View>
                                            <Image source={Images.logo} className='w-20 h-20 mx-auto' resizeMode='contain' />
                                            <Text className='text-2xl text-black font-semibold mt-10 font-firabold'>Forgot Password</Text>
                                            <Text className='text-sm text-black font-firamedium mt-3'>Enter the email linked to your account and we'll send you instructions to reset your password.</Text>
                                        </View>

                                        <View className='my-5 space-y-3'>
                                            <View>
                                                <FormField
                                                    title="Email"
                                                    placeholder='Enter your email'
                                                    value={values.email}
                                                    editable={!loading}

                                                    onChangeText={(text) => setFieldValue('email', text.trim())}
                                                    onBlur={handleBlur('email')}

                                                    errorMessage={errors.email}
                                                    touched={touched.email}

                                                    textContentType="emailAddress"
                                                    autoComplete="email"
                                                    keyboardType="email-address"
                                                />
                                            </View>
                                        </View>

                                        <View className='mt-auto'>
                                            <CustomButton
                                                disabled={loading || !isValid}
                                                title={loading ? 'Loading...' : 'Send Instructions'}
                                                handlePress={handleSubmit}
                                            />
                                        </View>
                                    </View>
                                )
                            }}
                        </Formik>

                        <View className='justify-center pt-5 flex-row gap-2'>
                            <Text className='text-sm text-black font-firaregular'>Remember your password?</Text>
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
                style={{ borderRadius: 28 }}
                backgroundStyle={{ borderRadius: 28 }}
                backdropComponent={renderBackdrop}
                onDismiss={() => router.replace('/(auth)/sign-in')}
            >
                <BottomSheetView>
                    <View style={{ paddingBottom: insets.bottom + 10, paddingHorizontal: 16, paddingTop: 8 }}>
                        <View style={styles.iconContainer}>
                            <Ionicons name="mail-outline" size={44} color="#DD3FE5" />
                        </View>
                        <View className='mb-7'>
                            <Text className='text-2xl font-semibold mb-2 text-center'>
                                Check your inbox
                            </Text>
                            <Text className='text-base font-firaregular text-center'>
                                We've sent password reset instructions to your email. Please check your inbox or spam folder.
                            </Text>
                        </View>
                        <TouchableOpacity onPress={() => bottomSheetModalRef.current?.dismiss()} className='rounded-[26px] h-12 bg-primary flex items-center justify-center'>
                            <Text className='text-base font-firamedium text-white'>
                                Okay
                            </Text>
                        </TouchableOpacity>
                    </View>
                </BottomSheetView>
            </BottomSheetModal>
        </SafeAreaView>
    )
}

export default ForgotPassword

const styles = StyleSheet.create({
    iconContainer: {
        width: 88,
        height: 88,
        borderRadius: 44,
        backgroundColor: '#FDECFE',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: 16,
    },
})

const forgotPasswordValidationSchema = yup.object().shape({
    email: yup
        .string()
        .trim()
        .email('Please enter a valid email')
        .required('Email is required'),
})
