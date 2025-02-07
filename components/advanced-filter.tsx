import { View, Text, Dimensions, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useState } from 'react'
import MultiSlider from '@ptomasroos/react-native-multi-slider'
import { YStack, XStack, RadioGroup, SizeTokens, Label } from 'tamagui'
import CustomButton from './CustomButton'
import FormField from './FormField'

const UsersAdvancedFilter = () => {
    const [filterParams, setFilterParams] = useState({
        who: '',
        age: [20, 50],
        user_status: '',
        distance: '100'
    })
    return (
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                <ScrollView className='px-4 py-2 h-full'>
                <YStack gap="$7">
                <YStack>
                    <Text className='text-base text-white font-firamedium'>Personal</Text>
                    
                </YStack>
                <CustomButton title='Apply' handlePress={() => { }} />
            </YStack>
        </ScrollView>
            </KeyboardAvoidingView>

    )
}

export default UsersAdvancedFilter