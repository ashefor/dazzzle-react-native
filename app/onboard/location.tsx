import { Alert, Image, KeyboardAvoidingView, SafeAreaView, Platform, ScrollView, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View, TextInput, Keyboard } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { Link, router } from 'expo-router'
import { useGlobalContext } from '@/context/GlobalProvider'
import { Button, Form, H4, Spinner, YStack, Input, Label, Checkbox, XStack, Progress, Sheet, } from 'tamagui'
import CustomButton from '@/components/CustomButton'
import FormField from '@/components/FormField'

const OnboardLocation = () => {
        const [progress, setProgress] = React.useState(Math.ceil((2 / 5) * 100));
    const { setUser, setIsLoggedIn } = useGlobalContext();

    const [status, setStatus] = React.useState<'off' | 'submitting' | 'submitted'>('off')
    const [location, setLocation] = useState('')

    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        setTimeout(() => {
            setProgress(Math.ceil((3 / 5) * 100))
        }, 500);
    }, [])

    // const _handlePressButtonAsync = async (link: string) => {
    //     await WebBrowser.openBrowserAsync(link);
    // };

    const submit = async () => {

        setIsSubmitting(true);
        try {
            // await signIn(form.email, form.password);
            // const user = await getCurrentUser();
            // setUser(user);
            router.push('/onboard/relationship-type');
        } catch (error: any) {
            Alert.alert('Error', error.message ? error.message : 'Failed to log in')
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
            <SafeAreaView className='bg-[#1A1A1A] h-full'>
                <YStack gap="$5" className='px-4'>
                    <Progress size="$3" value={progress}>
                        <Progress.Indicator backgroundColor="#DF3FE5" animation="bouncy" />
                    </Progress>
                </YStack>
                <ScrollView>
                    <YStack className='p-4' gap="$5">
                        <YStack>
                            <Text className='text-2xl text-white font-firabold'>Choose location</Text>
                            <Text className='text-sm text-[#A9A9A9] font-firaregular'>Join our community and experience seamlessness finding a soulmate. </Text>
                        </YStack>
                        <YStack>
                            <Form
                                gap="$7"
                            >
                                <YStack gap="$3">
                                    <FormField
                                        title="Location"
                                        value={location}
                                        placeholder='Enter location'
                                        handleChangeText={(text: string) => setLocation(text)}
                                    />
                                </YStack>
                                <Form.Trigger asChild disabled={status !== 'off'}>
                                    <CustomButton title='Next' handlePress={submit} />
                                </Form.Trigger>
                            </Form>
                            <View className='justify-center pt-5 flex-row gap-2'>
                                <Text className='text-sm text-white font-firaregular'>Already have an account?</Text>
                                <Link className='text-sm text-tertiary font-firaregular underline' href='./sign-in'>Sign In</Link>
                            </View>
                        </YStack>
                    </YStack>
                </ScrollView>
            </SafeAreaView>
        </KeyboardAvoidingView>
    )
}

export default OnboardLocation
