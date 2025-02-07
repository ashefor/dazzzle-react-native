import { View, Text, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import React from 'react'
import CustomButton from '@/components/CustomButton'
import FormField from '@/components/FormField'
import { Form, YStack } from 'tamagui'

const ChangePasswordScreen = () => {
    return (
        <View className='bg-[#1A1A1A] h-full'>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }} >
                <ScrollView>
                    <View className='px-4 py-5'>
                        <Form gap="$7">
                            <YStack gap="$5">
                                <FormField
                                    title="Current Password"
                                    placeholder='Enter username'
                                    value=''
                                    handleChangeText={(text: string) => { }}
                                />
                                <FormField
                                    title="New Password"
                                    placeholder='Enter username'
                                    value=''
                                    handleChangeText={(text: string) => { }}
                                />
                                <FormField
                                    title="Confirm Password"
                                    value=''
                                    placeholder='Enter password'
                                    handleChangeText={(text: string) => { }}
                                />

                            </YStack>
                            <Form.Trigger asChild>
                                <CustomButton title='Save' handlePress={() => { }} />
                            </Form.Trigger>
                        </Form>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    )
}

export default ChangePasswordScreen