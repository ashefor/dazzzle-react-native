import { View, Text, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import CustomButton from '@/components/CustomButton'
import FormField from '@/components/FormField'
import { Form, YStack } from 'tamagui'
import Toast from '@/components/toast/toast'
import { useAxiosContext } from '@/context/AxiosProvider'
import { ReactionCodes } from '@/models/general'
import { LoggedInUser } from '@/models/user'
import { getItem } from '@/utils/asyncStorage'
import { isValidEmail } from '@/utils/validators'
import { router } from 'expo-router'

type ChangePasswordForm = {
    current_password: string;
    new_password: string;
    new_password_confirmation: string;
};
const ChangePasswordScreen = () => {
    const { axiosRequest } = useAxiosContext();
    const [isFormValid, setIsFormValid] = useState(false);
    const [errors, setErrors] = useState<ChangePasswordForm | Record<string, string>>({});
    const [hasTyped, setHasTyped] = useState<Record<string, boolean>>({});
    const [form, setForm] = useState<ChangePasswordForm>({
        current_password: '',
        new_password: '',
        new_password_confirmation: ''
    })

    const updateForm = useCallback(<K extends keyof ChangePasswordForm>(key: K, value: ChangePasswordForm[K]) => {
        setForm({
            ...form,
            [key]: value
        })
    }, [form])

    const handleInputChange = (field: keyof ChangePasswordForm, value: string) => {
        // setForm(prev => ({ ...prev, [field]: value }));
        updateForm(field, value);

        // Mark field as touched
        setHasTyped(prev => ({ ...prev, [field]: true }));
    };

    const validateForm = () => {
        let errors: { [key: string]: string } = {};
        if (!form.current_password || form.current_password.length < 6) {
            errors.current_password = 'Password is required';
        }
        if (!form.new_password || form.new_password.length < 6) {
            errors.new_password = 'Password is required';
        }
        if (!form.new_password_confirmation || form.new_password_confirmation.length < 6) {
            errors.new_password_confirmation = 'Password is required';
        }
        if (form.new_password !== form.new_password_confirmation) {
            errors.new_password_confirmation = 'Passwords do not match';
        }
        setErrors(errors);
        setIsFormValid(Object.keys(errors).length === 0);
    }

    useEffect(() => {
        if (hasTyped.current_password || hasTyped.new_password || hasTyped.new_password_confirmation) {
            const timer = setTimeout(validateForm, 300); // Delay validation after typing
            return () => clearTimeout(timer);
        }
    }, [form.current_password, form.new_password, form.new_password_confirmation])

    const handleChangePassword = async () => {
        try {
            const { data } = await axiosRequest.post('/profile/change-password-process', form);
            if (data.reaction === ReactionCodes.SUCCESS) {
                const response = data.data;
                Toast.success(response.message || 'Password changed successfully', 2000)
                router.replace('/profile');
            }
        } catch (error: any) {
            console.log('error', error);
            Alert.alert('Error', error.errorMessage ? error.errorMessage : 'Unable to change password')
        }
    }

    return (
        <View className='bg-[#1A1A1A] h-full'>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }} >
                <ScrollView>
                    <View className='px-4 py-5'>
                        <Form gap="$7">
                            <YStack gap="$4">
                                <YStack gap="$1">
                                    <FormField
                                        title="Current Password"
                                        placeholder='Enter username'
                                        value={form.current_password}
                                        secureTextEntry
                                        handleChangeText={(text: string) => handleInputChange('current_password', text)}
                                    />
                                    {hasTyped.current_password && errors.current_password && <Text className='text-xs text-red-500 font-firaregular'>{errors.current_password}</Text>}
                                </YStack>
                                <YStack gap="$1">
                                    <FormField
                                        title="New Password"
                                        placeholder='Enter username'
                                        value={form.new_password}
                                        secureTextEntry
                                        handleChangeText={(text: string) => handleInputChange('new_password', text)}
                                    />
                                    {hasTyped.new_password && errors.new_password && <Text className='text-xs text-red-500 font-firaregular'>{errors.new_password}</Text>}
                                </YStack>
                                <YStack gap="$1">
                                    <FormField
                                        title="Confirm Password"
                                        value={form.new_password_confirmation}
                                        placeholder='Enter password'
                                        secureTextEntry
                                        handleChangeText={(text: string) => handleInputChange('new_password_confirmation', text)}
                                    />
                                    {hasTyped.new_password_confirmation && errors.new_password_confirmation && <Text className='text-xs text-red-500 font-firaregular'>{errors.new_password_confirmation}</Text>}
                                </YStack>
                            </YStack>
                            <Form.Trigger asChild>
                                <CustomButton title='Save' handlePress={handleChangePassword} />
                            </Form.Trigger>
                        </Form>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    )
}

export default ChangePasswordScreen