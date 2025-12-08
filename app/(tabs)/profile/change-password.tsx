import { View, ScrollView, Alert, TouchableOpacity, Text, StyleSheet } from 'react-native';
import React, { JSX, useCallback, useRef } from 'react';
import CustomButton from '@/components/CustomButton';
import FormField from '@/components/FormField';
import { YStack } from 'tamagui';
import Toast from '@/components/toast/toast';
import { ReactionCodes } from '@/models/general';
import { router } from 'expo-router';
import { useLoader } from '@/context/loader/LoaderProvider';
import axiosRequest from '@/utils/axios';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as yup from 'yup';
import NavBar from '@/components/NavBar';
import { Formik } from 'formik';
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';
import LottieView from 'lottie-react-native';


type ChangePasswordForm = {
    current_password: string;
    new_password: string;
    new_password_confirmation: string;
};
const ChangePasswordScreen = () => {
    const insets = useSafeAreaInsets();
    const { show, hide } = useLoader();
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const animationRef = useRef<LottieView>(null);

    const handleChangePassword = async (formValues: ChangePasswordForm) => {
        try {
            show();
            const data: any = await axiosRequest.post('/profile/change-password-process', formValues);
            hide();
            if (data.reaction === ReactionCodes.SUCCESS) {
                const response = data.data;
                Toast.success(response.message || 'Password changed successfully', 2000)
                router.replace('/profile');
            }
        } catch (error: any) {
            hide();
            Alert.alert('Error', error.errorMessage ? error.errorMessage : 'Unable to change password')
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
        <View className='flex-1 bg-white' style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
            <NavBar title='Change Password' />
            <KeyboardAvoidingView behavior={"padding"}
                 style={{ flex: 1 }} >
                <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 16 }}>
                    <View className='w-full h-full justify-center'>
                        <Formik
                            initialValues={{ current_password: '', new_password_confirmation: '', new_password: '', }}
                            onSubmit={handleChangePassword}
                            validationSchema={changePasswordValidationSchema}
                        >
                            {({ handleChange, handleBlur, handleSubmit, values, errors, isValid, setFieldValue }) => {
                                return (
                                    <View className='flex-1 '>
                                        <YStack gap="$3" mb={20}>
                                            <FormField
                                                title="Current Password"
                                                placeholder=''
                                                secureTextEntry
                                                onChangeText={handleChange('current_password')}
                                                onBlur={handleBlur('current_password')}
                                                showCustomError={errors.current_password ? true : false}
                                                errorMessage={errors.current_password}
                                                value={values.current_password}
                                            />
                                            <FormField
                                                title="New Password"
                                                placeholder=''
                                                value={values.new_password}
                                                secureTextEntry
                                                onChangeText={handleChange('new_password')}
                                                onBlur={handleBlur('new_password')}
                                                showCustomError={errors.new_password ? true : false}
                                                errorMessage={errors.new_password}
                                            />
                                            <FormField
                                                title="Confirm Password"
                                                placeholder=''
                                                value={values.new_password_confirmation}
                                                secureTextEntry
                                                onChangeText={handleChange('new_password_confirmation')}
                                                onBlur={handleBlur('new_password_confirmation')}
                                                showCustomError={errors.new_password_confirmation ? true : false}
                                                errorMessage={errors.new_password_confirmation}
                                            />
                                        </YStack>
                                        <View className='mt-auto'>
                                            <CustomButton title='Update Password' disabled={!isValid} handlePress={handleSubmit} />
                                        </View>
                                    </View>
                                )
                            }}
                        </Formik>
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
                onDismiss={() => router.back()}
            >

                <BottomSheetView>
                    <View style={{ paddingBottom: insets.bottom + 10, paddingHorizontal: 16 }}>
                        <View style={styles.lottieContainer}>
                            <LottieView
                                ref={animationRef}
                                source={require('../../../assets/checkmark.json')} // Point to your JSON file
                                style={styles.lottie}
                                autoPlay={true} // Set to true if you want it to loop or start immediately
                                loop={true}     // Set to true if you want it to repeat
                            />
                        </View>
                        <View className='mb-7'>
                            <Text className='text-2xl font-semibold mb-2 text-center'>
                                Successful!
                            </Text>
                            <Text className='text-base font-firaregular text-center'>
                                Password changed successfully
                            </Text>
                        </View>
                        <TouchableOpacity onPress={() => bottomSheetModalRef.current?.dismiss()} className='rounded-[26px] h-12 bg-primary flex items-center justify-center'>
                            <Text className='text-base font-firamedium text-white'>
                                Done
                            </Text>
                        </TouchableOpacity>
                    </View>
                </BottomSheetView>
            </BottomSheetModal>
        </View>
    )
}

export default ChangePasswordScreen

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

const changePasswordValidationSchema = yup.object().shape({
    current_password: yup
        .string()
        .min(6, ({ min }) => `Password must be at least ${min} characters`)
        .required('Password is required'),
    new_password: yup
        .string()
        .matches(/\w*[a-z]\w*/, "Password must have a small letter")
        .matches(/\w*[A-Z]\w*/, "Password must have a capital letter")
        .matches(/\d/, "Password must have a number")
        .matches(/[!@#$%^&*()\-_"=+{}; :,<.>]/, "Password must have a special character")
        .min(8, ({ min }) => `Password must be at least ${min} characters`)
        .required('Password is required'),
    new_password_confirmation: yup
        .string()
        .oneOf([yup.ref('new_password')], 'Passwords do not match')
        .required('Confirm password is required'),
})