import { Alert, Image, KeyboardAvoidingView, SafeAreaView, Platform, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
// import { SafeAreaView } from 'react-native-safe-area-context'

import { Link, router } from 'expo-router'
import { useGlobalContext } from '@/context/GlobalProvider'
import { Button, Form, H4, Spinner, YStack, Input, Label, Checkbox, XStack, Progress, ScrollView } from 'tamagui'
import CustomButton from '@/components/CustomButton'
import * as ImagePicker from 'expo-image-picker';
import Feather from '@expo/vector-icons/Feather'

const OnboardProfilePicture = () => {
    const [image, setImage] = useState<ImagePicker.ImagePickerAsset | undefined>(undefined);
    const [progress, setProgress] = React.useState(Math.ceil((1 / 5) * 100));

    useEffect(() => {
        setTimeout(() => {
            setProgress(Math.ceil((2 / 5) * 100))
        }, 500);
    }, [])

    const [form, setForm] = useState({
        first_name: '',
        last_name: '',
        phone_number: '',
        birthday: '',
        gender: '',
    })

    const [isSubmitting, setIsSubmitting] = useState(false)

    const submit = async () => {

        setIsSubmitting(true);
        try {
            // await signIn(form.email, form.password);
            // const user = await getCurrentUser();
            // setUser(user);
            router.push('/onboard/location');
        } catch (error: any) {
            Alert.alert('Error', error.message ? error.message : 'Failed to log in')
        } finally {
            setIsSubmitting(false);
        }
    }

    const pickImage = async () => {
        try {
            // No permissions request is necessary for launching the image library
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                allowsMultipleSelection: false,
                cameraType: ImagePicker.CameraType.front,
                aspect: [4, 3],
                quality: 1,
            });

            console.log(result);

            if (!result.canceled) {
                setImage(result.assets[0]);
            }
        } catch (error) {
            console.error('Error picking image:', error);
        }
    };

    return (
        <SafeAreaView className='bg-[#1A1A1A] h-full'>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <YStack gap="$5" className='px-4'>
                    <Progress size="$3" value={progress}>
                        <Progress.Indicator backgroundColor="#DF3FE5" animation="bouncy" />
                    </Progress>
                </YStack>
                <ScrollView className='h-full'>
                    <YStack className='p-4' gap="$5">
                        <YStack>
                            <Text className='text-2xl text-white font-firabold'>Profile Picture</Text>
                            <Text className='text-sm text-[#A9A9A9] font-firaregular'>Join our community and experience seamlessness finding a soulmate. </Text>
                        </YStack>
                        <YStack>
                            <YStack>
                                <TouchableOpacity onPress={pickImage}>
                                    <View className='h-56 w-56 mx-auto my-10'>
                                    {image ? (
                                        <Image source={{ uri: image.uri }} style={{ width: '100%', height: '100%', borderRadius: 200 }} />
                                    ) : (
                                        <YStack gap="$2" className='w-full h-full rounded-full flex items-center justify-center items-center border border-dashed border-[#DD3FE5]'>
                                        <Feather name='image' size={32} color="#DD3FE5" />
                                        <Text className='text-sm text-white font-firamedium'>Add Profile Picture</Text>
                                    </YStack>
                                    )
}
                                    </View>
                                </TouchableOpacity>
                            </YStack>
                            <YStack>
                                <CustomButton title='Next' handlePress={submit} />
                                <View className='justify-center pt-5 flex-row gap-2'>
                                    <Text className='text-sm text-white font-firaregular'>Already have an account?</Text>
                                    <Link className='text-sm text-tertiary font-firaregular underline' href='./sign-in'>Sign In</Link>
                                </View>
                            </YStack>
                        </YStack>
                    </YStack>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default OnboardProfilePicture

const styles = StyleSheet.create({})