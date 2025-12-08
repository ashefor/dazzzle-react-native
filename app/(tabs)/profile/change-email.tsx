import { View, ScrollView, Alert, TouchableOpacity, Text } from 'react-native'
import React, { JSX, useCallback, useRef } from 'react'
import CustomButton from '@/components/CustomButton'
import FormField from '@/components/FormField'
import { YStack } from 'tamagui'
import { ReactionCodes } from '@/models/general'
import { router } from 'expo-router'
import Toast from '@/components/toast/toast'
import { useAppSelector } from '@/hooks/reduxHooks'
import axiosRequest from '@/utils/axios'
import { useLoader } from '@/context/loader/LoaderProvider'
import { KeyboardAvoidingView } from "react-native-keyboard-controller"
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import * as yup from 'yup'
import { Formik } from 'formik'
import NavBar from '@/components/NavBar'
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'
import LottieView from 'lottie-react-native'
import { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types'
import { StyleSheet } from 'react-native'

type ChangeEmailForm = {
  current_email: string;
  new_email: string;
  current_password: string;
};

const ChangeEmailScreen = () => {
  const insets = useSafeAreaInsets();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const animationRef = useRef<LottieView>(null);
  const { userInfo } = useAppSelector(state => state.auth);
  const { show, hide } = useLoader();


  const handleChangeEmail = async (formValues: ChangeEmailForm) => {
    try {
      show();
      const data: any = await axiosRequest.post('/profile/update-email-process', formValues);
      hide();
      if (data.reaction === ReactionCodes.SUCCESS) {
        const response = data.data;
        Toast.success(response.message || 'Email changed successfully', 2000)
        router.replace('/profile');
      }
    } catch (error: any) {
      hide();
      Alert.alert('Error', error.errorMessage ? error.errorMessage : 'Unable to change email')
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
      <NavBar title='Change Email' />
      <KeyboardAvoidingView behavior={"padding"}
         style={{ flex: 1 }} >
        <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 16 }}>
          <View className='w-full h-full justify-center'>
            <Formik
              initialValues={{ current_email: userInfo?.email || '', new_email: '', current_password: '', }}
              onSubmit={handleChangeEmail}
              enableReinitialize
              validationSchema={changeEmailValidationSchema}
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors, isValid, setFieldValue }) => {
                return (
                  <View className='flex-1 '>
                    <YStack gap="$3" mb={20}>
                      <FormField
                        title="Current Email"
                        placeholder=''
                        editable={userInfo?.email ? false : true}
                        onChangeText={handleChange('current_email')}
                        onBlur={handleBlur('current_email')}
                        showCustomError={errors.current_email ? true : false}
                        errorMessage={errors.current_email}
                        value={values.current_email}
                        keyboardType='email-address'
                      />
                      <FormField
                        title="New Email"
                        placeholder=''
                        value={values.new_email}
                        onChangeText={handleChange('new_email')}
                        onBlur={handleBlur('new_email')}
                        showCustomError={errors.new_email ? true : false}
                        errorMessage={errors.new_email}
                        keyboardType='email-address'
                      />
                      <FormField
                        title="Password"
                        placeholder=''
                        value={values.current_password}
                        secureTextEntry
                        onChangeText={handleChange('current_password')}
                        onBlur={handleBlur('current_password')}
                        showCustomError={errors.current_password ? true : false}
                        errorMessage={errors.current_password}
                      />
                    </YStack>
                    <View className='mt-auto'>
                      <CustomButton title='Update Email' disabled={!isValid} handlePress={handleSubmit} />
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
                Email changed successfully
              </Text>
            </View>
            <TouchableOpacity className='rounded-[26px] h-12 bg-primary flex items-center justify-center'>
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

export default ChangeEmailScreen

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

const changeEmailValidationSchema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter valid email")
    .required('Email is required'),
  password: yup
    .string()
    .min(6, ({ min }) => `Password must be at least ${min} characters`)
    .required('Password is required'),
})