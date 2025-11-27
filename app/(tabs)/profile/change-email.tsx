import { View, Text, KeyboardAvoidingView, Platform, ScrollView, Alert, TouchableOpacity } from 'react-native'
import React, { Fragment, useCallback, useEffect, useState } from 'react'
import CustomButton from '@/components/CustomButton'
import FormField from '@/components/FormField'
import { Form, YStack } from 'tamagui'
import { ReactionCodes } from '@/models/general'
import { router, Stack } from 'expo-router'
import Toast from '@/components/toast/toast'
import { isValidEmail } from '@/utils/validators'
import ArrowBackIcon from '@/components/icons/ArrowBackIcon'
import { useAppSelector } from '@/hooks/reduxHooks'
import axiosRequest from '@/utils/axios'
import { useLoader } from '@/context/loader/LoaderProvider'

type ChangeEmailForm = {
  current_email: string;
  new_email: string;
  current_password: string;
};

const ChangeEmailScreen = () => {
  const { userInfo } = useAppSelector(state => state.auth);
      const { show, hide } = useLoader();
  const [isFormValid, setIsFormValid] = useState(false);
  const [errors, setErrors] = useState<ChangeEmailForm | Record<string, string>>({});
  const [hasTyped, setHasTyped] = useState<Record<string, boolean>>({});
  const [form, setForm] = useState<ChangeEmailForm>({
    current_email: '',
    new_email: '',
    current_password: ''
  })

  const updateForm = useCallback(<K extends keyof ChangeEmailForm>(key: K, value: ChangeEmailForm[K]) => {
    setForm({
      ...form,
      [key]: value
    })
  }, [form])

  useEffect(() => {
    if (userInfo && userInfo.email) {
      updateForm('current_email', userInfo.email);
    }
  }, [userInfo])

  const handleInputChange = (field: keyof ChangeEmailForm, value: string) => {
    // setForm(prev => ({ ...prev, [field]: value }));
    updateForm(field, value);

    // Mark field as touched
    setHasTyped(prev => ({ ...prev, [field]: true }));
  };

  const validateForm = () => {
    let errors: { [key: string]: string } = {};
    if (!isValidEmail(form.current_email) || !form.current_email) {
      errors.current_email = 'Valid email is required';
    }
    if (!isValidEmail(form.new_email) || !form.new_email) {
      errors.new_email = 'Valid email is required';
    }
    if (!form.current_password || form.current_password.length < 6) {
      errors.current_password = 'Password is required';
    }
    setErrors(errors);
    setIsFormValid(Object.keys(errors).length === 0);
  }

  useEffect(() => {
    if (hasTyped.current_email || hasTyped.new_email || hasTyped.current_password) {
      const timer = setTimeout(validateForm, 300); // Delay validation after typing
      return () => clearTimeout(timer);
    }
  }, [form.current_email, form.new_email, form.current_password])

  const handleChangeEmail = async () => {
    try {
      show();
      const data: any = await axiosRequest.post('/profile/update-email-process', form);
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

  return (
    <Fragment>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: '#1A1A1A' },
          headerLeft: () => <TouchableOpacity onPress={() => router.back()} className='flex items-center justify-center pr-4 w-9 h-8'>
            <ArrowBackIcon />
          </TouchableOpacity>
        }}
      />
      <View className=' h-full'>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }} >
          <ScrollView>
            <View className='px-4 py-5'>
              <Form gap="$7">
                <YStack gap="$4">
                  <YStack gap="$1">
                    <FormField
                      title="Current Email"
                      placeholder='Enter username'
                      value={form.current_email}
                      onChangeText={(text: string) => handleInputChange('current_email', text)}
                    />
                    {hasTyped.current_email && errors.current_email && <Text className='text-xs text-red-500 font-firaregular'>{errors.current_email}</Text>}
                  </YStack>

                  <YStack gap="$1">
                    <FormField
                      title="New Email"
                      placeholder='Enter username'
                      value={form.new_email}
                      onChangeText={(text: string) => handleInputChange('new_email', text)}
                    />
                    {hasTyped.new_email && errors.new_email && <Text className='text-xs text-red-500 font-firaregular'>{errors.new_email}</Text>}
                  </YStack>
                  <YStack gap="$1">
                    <FormField
                      title="Password"
                      value={form.current_password}
                      placeholder='Enter password'
                      onChangeText={(text: string) => handleInputChange('current_password', text)}
                    />
                    {hasTyped.current_password && errors.current_password && <Text className='text-xs text-red-500 font-firaregular'>{errors.current_password}</Text>}
                  </YStack>
                </YStack>
                <Form.Trigger asChild>
                  <CustomButton title='Change Email' handlePress={handleChangeEmail} />
                </Form.Trigger>
              </Form>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Fragment>
  )
}

export default ChangeEmailScreen