import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Link, router } from 'expo-router'
import { useGlobalContext } from '@/context/GlobalProvider'
import Images from '@/constants/images'
import { Button, Form, H4, Spinner, YStack, Input, Label, Checkbox, XStack, } from 'tamagui'
import CustomButton from '@/components/CustomButton'
import FormField from '@/components/FormField'
import Ionicons from '@expo/vector-icons/Ionicons';
import * as WebBrowser from 'expo-web-browser';
import { WebBrowserResult } from 'expo-web-browser'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'

const SignIn = () => {
    const { setUser, setIsLoggedIn } = useGlobalContext();
    const [result, setResult] = useState<WebBrowserResult>();

    const [status, setStatus] = React.useState<'off' | 'submitting' | 'submitted'>('off')
    const [form, setForm] = useState({
        email: '',
        password: '',
        username: ''
    })

    const [isSubmitting, setIsSubmitting] = useState(false)

    const _handlePressButtonAsync = async (link: string) => {
        await WebBrowser.openBrowserAsync(link);
    };

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
            router.replace('/onboard/bio-data');
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
                                <Text className='text-2xl text-white font-semibold mt-10 font-firabold'>Create an Account</Text>
                                <Text className='text-sm text-white font-semibold font-firamedium mt-3'>Join our community and experience seamlessness finding a soulmate. </Text>
                            </YStack>
                            <YStack gap="$3">
                                <FormField
                                    title="Username"
                                    value={form.password}
                                    placeholder='Enter username'
                                    handleChangeText={(text: string) => setForm({ ...form, username: text })}
                                />
                                <FormField
                                    title="Email"
                                    value={form.password}
                                    placeholder='Enter email'
                                    handleChangeText={(text: string) => setForm({ ...form, email: text })}
                                />
                                <FormField
                                    title="Password"
                                    value={form.password}
                                    placeholder='Enter password'
                                    handleChangeText={(text: string) => setForm({ ...form, password: text })}
                                />
                            </YStack>
                            <XStack alignItems="center" gap="$2">
                                <Checkbox size="$4" className='bg-primary border-2 border-white'>
                                    <Checkbox.Indicator>
                                        <MaterialCommunityIcons name="check-bold" size={18} color="#ffffff" />
                                    </Checkbox.Indicator>
                                </Checkbox>
                                <View className='flex flex-wrap flex-1 flex-row gap-1'>
                                    <Text className='text-base text-white font-firaregular'>I accept all</Text>
                                    <TouchableHighlight onPress={() => _handlePressButtonAsync('https://dazzzle.org/privacy-policy')}>
                                        <Text className='text-base text-tertiary font-firaregular'>terms and conditions</Text>
                                    </TouchableHighlight>
                                    <Text className='text-base text-white font-firaregular'>and</Text>
                                    <TouchableHighlight onPress={() => _handlePressButtonAsync('https://dazzzle.org/privacy-policy')}>
                                        <Text className='text-base text-tertiary font-firaregular'>privacy policy</Text>
                                    </TouchableHighlight>
                                </View>
                            </XStack>
                            <Form.Trigger asChild disabled={status !== 'off'}>
                                <CustomButton title='Register' handlePress={submit} />
                            </Form.Trigger>
                        </Form>
                        <View className='justify-center pt-5 flex-row gap-2'>
                            <Text className='text-sm text-white font-firaregular'>Already have an account?</Text>
                            <Link className='text-sm text-tertiary font-firaregular underline' href='./sign-in'>Sign In</Link>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default SignIn

const styles = StyleSheet.create({})