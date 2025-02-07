import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Link, router } from 'expo-router'
import { useGlobalContext } from '@/context/GlobalProvider'
import Images from '@/constants/images'
import { Button, Form, H4, Spinner, YStack, Input, Label, } from 'tamagui'
import CustomButton from '@/components/CustomButton'
import FormField from '@/components/FormField'

const SignIn = () => {
    const { setUser, setIsLoggedIn } = useGlobalContext();
    const [status, setStatus] = React.useState<'off' | 'submitting' | 'submitted'>('off')
    const [form, setForm] = useState({
        email: '',
        password: ''
    })

    const [isSubmitting, setIsSubmitting] = useState(false)

    const submit = async () => {
        // if (!form.email || !form.password) {
        //     return Alert.alert('Error', 'Please fill in all fields')
        // }

        setIsSubmitting(true);
        try {
            // await signIn(form.email, form.password);
            // const user = await getCurrentUser();
            // setUser(user);
            setIsLoggedIn(true);
            router.replace('/(tabs)');
        } catch (error: any) {
            Alert.alert('Error', error.message ? error.message : 'Failed to log in')
        } finally {
            setIsSubmitting(false);
        }
    }
    return (
        <SafeAreaView className='bg-primary h-full'>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }} >
                <ScrollView>
                    <View className='w-full min-h-[85vh] justify-center px-4 my-6'>
                        <Form
                            gap="$7"
                        >
                            <YStack>
                                <Image source={Images.logo} className='w-20 h-20 mx-auto' resizeMode='contain' />
                                <Text className='text-2xl text-white font-semibold mt-10 font-firabold'>Sign In</Text>
                                <Text className='text-sm text-white font-firamedium mt-3'>Join our community and experience seamlessness finding a soulmate. </Text>
                            </YStack>
                            <YStack gap="$3">
                            <FormField
                title="Username"
                value={form.email}
                placeholder='Enter username'
                handleChangeText={(text: string) => setForm({...form, email: text})}
            />
                                <FormField
                title="Password"
                value={form.password}
                placeholder='Enter password'
                handleChangeText={(text: string) => setForm({...form, password: text})}
            />

                            </YStack>
                            <Form.Trigger asChild disabled={status !== 'off'}>
                            <CustomButton title='Sign In' handlePress={submit}/>
                            </Form.Trigger>
                        </Form>
                        <View className='justify-center pt-5 flex-row gap-2'>
                            <Text className='text-sm text-white font-firaregular'>Don't have an account?</Text>
                            <Link className='text-sm text-tertiary font-firaregular underline' href='./sign-up'>Create an Account</Link>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default SignIn

const styles = StyleSheet.create({})