import { View, Text, TouchableOpacity, Modal, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, TextInput, Pressable } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { YStack, XStack, Accordion, Paragraph, Square, Form, Select, Adapt, Sheet, Dialog, Fieldset, Input, Label, TooltipSimple, Unspaced, Button } from 'tamagui'
import Feather from '@expo/vector-icons/Feather'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import Ionicons from '@expo/vector-icons/Ionicons'
import { Link } from 'expo-router'
import CustomButton from './CustomButton'
import FormField from './FormField'
import dayjs from 'dayjs'
import { SheetManager } from 'react-native-actions-sheet'
import Dropdown from './Dropdown'
import Dropdownn from './Dropdownn'

type BasicInfoForm = {
    first_name: string;
    last_name: string;
    phone_number: string;
    birthday: dayjs.Dayjs;
    gender: string;
};

const items = [
    { name: 'Apple' },
    { name: 'Pear' },
    { name: 'Blackberry' },
    { name: 'Peach' },
    { name: 'Apricot' },
    { name: 'Melon' },
    { name: 'Honeydew' },
    { name: 'Starfruit' },
    { name: 'Blueberry' },
    { name: 'Raspberry' },
    { name: 'Strawberry' },
    { name: 'Mango' },
    { name: 'Pineapple' },
    { name: 'Lime' },
    { name: 'Lemon' },
    { name: 'Coconut' },
    { name: 'Guava' },
    { name: 'Papaya' },
    { name: 'Orange' },
    { name: 'Grape' },
    { name: 'Jackfruit' },
    { name: 'Durian' },
]

const BasicInfo = ({ editable }: { editable: boolean }) => {
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [status, setStatus] = React.useState<'off' | 'submitting' | 'submitted'>('off')
    const [basicInfoForm, setBasicInfoForm] = useState<BasicInfoForm>({
        first_name: '',
        last_name: '',
        phone_number: '',
        birthday: dayjs(),
        gender: '',
    })

    const updateBasicInfoForm = useCallback(<K extends keyof BasicInfoForm>(key: K, value: BasicInfoForm[K]) => {
        setBasicInfoForm({
            ...basicInfoForm,
            [key]: value
        })
    }, [basicInfoForm])

    const toggleEditModalVisible = useCallback(() => setEditModalVisible(!editModalVisible), [editModalVisible]);

    useEffect(() => {
    }, [editModalVisible])

    return (
        <>
        <YStack gap="$4">
            <YStack gap="$3">
                <XStack gap="$4" justifyContent='space-between' alignItems='center'>
                    <Text className='text-sm text-white font-firamedium'>Basic Info</Text>
                    {editable && <TouchableOpacity onPress={toggleEditModalVisible} activeOpacity={0.8}>
                        <XStack>
                            <Text className='text-sm text-[#DD3FE5] font-firaregular'>Edit</Text>
                            <Feather name="edit-3" size={16} color="#DD3FE5" />
                        </XStack>
                    </TouchableOpacity>}
                </XStack>
                <YStack gap="$3">
                    <View className='p-4 rounded-lg bg-[#5B5B5B]'>
                        <YStack gap="$4">
                            <XStack gap="$4">
                                <YStack gap="$3" className='flex-1'>
                                    <Text className='text-sm font-firamedium text-white'>Gender </Text>
                                    <Text className=' text-white font-firaregular'>Female </Text>
                                </YStack>
                                <YStack gap="$3" className='flex-1'>
                                    <Text className='text-sm font-firamedium text-white'>Preferred Language </Text>
                                    <Text className=' text-white font-firaregular'>English </Text>
                                </YStack>
                            </XStack>
                            <XStack gap="$4">
                                <YStack gap="$3" className='flex-1'>
                                    <Text className='text-sm font-firamedium text-white'>Gender </Text>
                                    <Text className=' text-white font-firaregular'>Female </Text>
                                </YStack>
                                <YStack gap="$3" className='flex-1'>
                                    <Text className='text-sm font-firamedium text-white'>Preferred Language </Text>
                                    <Text className=' text-white font-firaregular'>English </Text>
                                </YStack>
                            </XStack>
                            <XStack gap="$4">
                                <YStack gap="$3" className='flex-1'>
                                    <Text className='text-sm font-firamedium text-white'>Gender </Text>
                                    <Text className=' text-white font-firaregular'>Female </Text>
                                </YStack>
                                <YStack gap="$3" className='flex-1'>
                                    <Text className='text-sm font-firamedium text-white'>Preferred Language </Text>
                                    <Text className=' text-white font-firaregular'>English </Text>
                                </YStack>
                            </XStack>
                            <XStack gap="$4">
                                <YStack gap="$3" className='flex-1'>
                                    <Text className='text-sm font-firamedium text-white'>Gender </Text>
                                    <Text className=' text-white font-firaregular'>Female </Text>
                                </YStack>
                                <YStack gap="$3" className='flex-1'>
                                    <Text className='text-sm font-firamedium text-white'>Preferred Language </Text>
                                    <Text className=' text-white font-firaregular'>English </Text>
                                </YStack>
                            </XStack>
                        </YStack>
                    </View>
                </YStack>
            </YStack>
            <YStack gap="$3">
                <Text className='text-sm text-white font-firamedium'>Basic Info</Text>
                <YStack gap="$3">
                    <View className='p-4 rounded-lg bg-[#5B5B5B]'>
                        <YStack gap="$4">
                            <XStack gap="$4">
                                <YStack gap="$3" className='flex-1'>
                                    <Text className='text-sm font-firamedium text-white'>Gender </Text>
                                    <Text className=' text-white'>Female </Text>
                                </YStack>
                                <YStack gap="$3" className='flex-1'>
                                    <Text className='text-sm font-firamedium text-white'>Preferred Language </Text>
                                    <Text className=' text-white'>English </Text>
                                </YStack>
                            </XStack>
                            <XStack gap="$4">
                                <YStack gap="$3" className='flex-1'>
                                    <Text className='text-sm font-firamedium text-white'>Gender </Text>
                                    <Text className=' text-white'>Female </Text>
                                </YStack>
                                <YStack gap="$3" className='flex-1'>
                                    <Text className='text-sm font-firamedium text-white'>Preferred Language </Text>
                                    <Text className=' text-white'>English </Text>
                                </YStack>
                            </XStack>
                            <XStack gap="$4">
                                <YStack gap="$3" className='flex-1'>
                                    <Text className='text-sm font-firamedium text-white'>Gender </Text>
                                    <Text className=' text-white'>Female </Text>
                                </YStack>
                                <YStack gap="$3" className='flex-1'>
                                    <Text className='text-sm font-firamedium text-white'>Preferred Language </Text>
                                    <Text className=' text-white'>English </Text>
                                </YStack>
                            </XStack>
                            <XStack gap="$4">
                                <YStack gap="$3" className='flex-1'>
                                    <Text className='text-sm font-firamedium text-white'>Gender </Text>
                                    <Text className=' text-white'>Female </Text>
                                </YStack>
                                <YStack gap="$3" className='flex-1'>
                                    <Text className='text-sm font-firamedium text-white'>Preferred Language </Text>
                                    <Text className=' text-white'>English </Text>
                                </YStack>
                            </XStack>
                        </YStack>
                    </View>
                </YStack>
            </YStack>
            <YStack gap="$3">
                <Text className='text-sm text-white font-firamedium'>Basic Info</Text>
                <YStack gap="$3">
                    <View className='p-4 rounded-lg bg-[#5B5B5B]'>
                        <YStack gap="$4">
                            <XStack gap="$4">
                                <YStack gap="$3" className='flex-1'>
                                    <Text className='text-sm font-firamedium text-white'>Gender </Text>
                                    <Text className=' text-white'>Female </Text>
                                </YStack>
                                <YStack gap="$3" className='flex-1'>
                                    <Text className='text-sm font-firamedium text-white'>Preferred Language </Text>
                                    <Text className=' text-white'>English </Text>
                                </YStack>
                            </XStack>
                            <XStack gap="$4">
                                <YStack gap="$3" className='flex-1'>
                                    <Text className='text-sm font-firamedium text-white'>Gender </Text>
                                    <Text className=' text-white'>Female </Text>
                                </YStack>
                                <YStack gap="$3" className='flex-1'>
                                    <Text className='text-sm font-firamedium text-white'>Preferred Language </Text>
                                    <Text className=' text-white'>English </Text>
                                </YStack>
                            </XStack>
                            <XStack gap="$4">
                                <YStack gap="$3" className='flex-1'>
                                    <Text className='text-sm font-firamedium text-white'>Gender </Text>
                                    <Text className=' text-white'>Female </Text>
                                </YStack>
                                <YStack gap="$3" className='flex-1'>
                                    <Text className='text-sm font-firamedium text-white'>Preferred Language </Text>
                                    <Text className=' text-white'>English </Text>
                                </YStack>
                            </XStack>
                            <XStack gap="$4">
                                <YStack gap="$3" className='flex-1'>
                                    <Text className='text-sm font-firamedium text-white'>Gender </Text>
                                    <Text className=' text-white'>Female </Text>
                                </YStack>
                                <YStack gap="$3" className='flex-1'>
                                    <Text className='text-sm font-firamedium text-white'>Preferred Language </Text>
                                    <Text className=' text-white'>English </Text>
                                </YStack>
                            </XStack>
                        </YStack>
                    </View>
                </YStack>
            </YStack>
            <Dropdown data={[
                { value: "🐈", label: "🐈 un Gato" },
                { value: "🦮", label: "🦮 un Perro" },
                { value: "🐍", label: "🐍 una serpiente" },
            ]}
                onChange={console.log}
                placeholder="Select pet" />
            <Dropdownn data={[
                { value: "🐈", label: "🐈 un Gato" },
                { value: "🦮", label: "🦮 un Perro" },
                { value: "🐍", label: "🐍 una serpiente" },
            ]}
                onChange={console.log}
                placeholder="Select pet" />
            <Pressable onPress={() => SheetManager.show('user-photo-action-sheet')}>
                <Text className='text-white'>Open Select</Text>
            </Pressable>
        </YStack>
        <Modal
        animationType="slide"
        presentationStyle='formSheet'
        visible={editModalVisible}
        onDismiss={() => setEditModalVisible(false)}
        onRequestClose={() => {
            setEditModalVisible(false);
        }}
    >
        <SafeAreaProvider>
            <SafeAreaView className='bg-[#1A1A1A] h-full'>
                <View className='bg-[#1A1A1A] flex-row items-center justify-center px-4 py-3 relative'>
                    <TouchableOpacity onPress={() => setEditModalVisible(false)} className='absolute z-10 left-4 items-center justify-center pr-4'>
                        <Ionicons name="close" size={24} color="#ffffff" />
                    </TouchableOpacity>
                    <Text className='font-firabold text-white text-center flex-1 mx-auto text-base'>Edit Basic Info</Text>
                </View>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }} >
                    <ScrollView className='px-4 py-2 h-full'>
                        <YStack>
                            <Form gap="$7">
                                <YStack gap="$3">
                                    <FormField
                                        title="First Name"
                                        value={basicInfoForm.first_name}
                                        placeholder='Enter first name'
                                        handleChangeText={(text: string) => updateBasicInfoForm('first_name', text)}
                                    />
                                    <FormField
                                        title="Last Name"
                                        value={basicInfoForm.last_name}
                                        placeholder='Enter last name'
                                        handleChangeText={(text: string) => updateBasicInfoForm('last_name', text)}
                                    />
                                    <Dropdown data={[
                                        { value: "🐈", label: "🐈 un Gato" },
                                        { value: "🦮", label: "🦮 un Perro" },
                                        { value: "🐍", label: "🐍 una serpiente" },
                                    ]}
                                        onChange={console.log}
                                        placeholder="Select pet" />
                                        <Dropdownn data={[
                { value: "🐈", label: "🐈 un Gato" },
                { value: "🦮", label: "🦮 un Perro" },
                { value: "🐍", label: "🐍 una serpiente" },
            ]}
                onChange={console.log}
                placeholder="Select pet" />
                                </YStack>
                                <Form.Trigger asChild disabled={status !== 'off'}>
                                    <CustomButton title='Save Changes' handlePress={() => { }} />
                                </Form.Trigger>
                            </Form>
                            <View className='justify-center pt-5 flex-row gap-2'>
                                <Text className='text-sm text-white font-firaregular'>Already have an account?</Text>
                                <Link className='text-sm text-tertiary font-firaregular underline' href='./sign-in'>Sign In</Link>
                            </View>
                        </YStack>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </SafeAreaProvider>
    </Modal>
        </>
    )
}

export default BasicInfo