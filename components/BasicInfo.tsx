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
import { UserProfileData, UserSpecificationsData } from '@/models/user'

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

const BasicInfo = ({ editable, userSpecificationData, userProfileData, ...props }: { editable?: boolean, userProfileData?: UserProfileData, userSpecificationData?: UserSpecificationsData }) => {
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
                                    <View className='flex-[0_0_45%] space-y-1'>
                                        <Text className='text-sm font-firamedium text-white'>Gender </Text>
                                        <Text className=' text-white font-firaregular'>{userProfileData?.gender_text} </Text>
                                    </View>
                                    <View className='flex-[0_0_45%] space-y-1'>
                                        <Text className='text-sm font-firamedium text-white'>Preferred Language </Text>
                                        <Text className=' text-white font-firaregular'>{userProfileData?.formatted_preferred_language} </Text>
                                    </View>
                                </XStack>
                                <XStack gap="$4">
                                    <View className='flex-[0_0_45%] space-y-1'>
                                        <Text className='text-sm font-firamedium text-white'>Relationship Status </Text>
                                        <Text className=' text-white font-firaregular'>{userProfileData?.formatted_relationship_status
                                        } </Text>
                                    </View>
                                    <View className='flex-[0_0_45%] space-y-1'>
                                        <Text className='text-sm font-firamedium text-white'>Work Status </Text>
                                        <Text className=' text-white font-firaregular'>{userProfileData?.formatted_work_status} </Text>
                                    </View>
                                </XStack>
                                <XStack gap="$4">
                                    <View className='flex-[0_0_45%] space-y-1'>
                                        <Text className='text-sm font-firamedium text-white'>Education </Text>
                                        <Text className=' text-white font-firaregular'>{userProfileData?.formatted_education} </Text>
                                    </View>
                                    <View className='flex-[0_0_45%] space-y-1'>
                                        <Text className='text-sm font-firamedium text-white'>Birthday </Text>
                                        <Text className=' text-white font-firaregular'>{userProfileData?.birthday} </Text>
                                    </View>
                                </XStack>
                                <XStack gap="$4">
                                    <View className='flex-[0_0_45%] space-y-1'>
                                        <Text className='text-sm font-firamedium text-white'>Relationship Type </Text>
                                        <View className='pl-2 space-y-1'>
                                            {userProfileData?.relationship_type.map((type, index) => {
                                                return (
                                                    <View className='flex-row flex-wrap space-x-2' key={type}>
                                                        <Text className='text-white font-firaregular'>{index + 1}.</Text>
                                                        <Text className='flex-1 text-white font-firaregular word-break text-wrap'>{type} </Text>
                                                    </View>
                                                )
                                            })}
                                        </View>
                                    </View>
                                    <View className='flex-[0_0_45%] space-y-1'>
                                        <Text className='text-sm font-firamedium text-white'>Interests </Text>
                                        <View className='pl-2 space-y-1'>
                                            {userProfileData?.interest.map((type, index) => {
                                                return (
                                                    <View className='flex-row flex-wrap space-x-2' key={type}>
                                                        <Text className='text-white font-firaregular'>{index + 1}.</Text>
                                                        <Text className='flex-1 text-white font-firaregular word-break text-wrap'>{type} </Text>
                                                    </View>
                                                )
                                            })}
                                        </View>
                                    </View>
                                </XStack>
                                <XStack gap="$4">
                                    <YStack gap="$3" flex={1}>
                                        <Text className='text-sm font-firamedium text-white'>Location </Text>
                                        <Text className='text-white font-firaregular'>{userProfileData?.city && userProfileData?.city}, {userProfileData?.country_name && userProfileData?.country_name} </Text>
                                    </YStack>
                                </XStack>
                            </YStack>
                        </View>
                    </YStack>
                </YStack>
                {userSpecificationData && Object.values(userSpecificationData).map((item) => {
                    return (
                        <YStack gap="$3" key={item.title}>
                            <Text className='text-sm text-white font-firamedium'>{item.title}</Text>
                            <YStack gap="$3">
                                <View className='p-4 rounded-lg bg-[#5B5B5B]'>
                                    <YStack gap="$4">
                                         <XStack gap="$4" flexWrap="wrap">

                                    {item.items.map((data, index) => {
                                                return (
                                                    <View key={data.label} className='flex-[0_0_45%] space-y-1'>
                                                        <Text className='text-sm font-firamedium text-white'>{data.label} </Text>
                                                        <Text className='text-white'>{data.value || "-"}</Text>
                                                    </View>
                                                )
                                            })}
                                </XStack>
                                    </YStack>
                                </View>
                            </YStack>
                        </YStack>
                    )
                })}
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
                                        </YStack>
                                        <Form.Trigger asChild disabled={status !== 'off'}>
                                            <CustomButton title='Save Changes' handlePress={() => { }} />
                                        </Form.Trigger>
                                    </Form>
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