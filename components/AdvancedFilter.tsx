import React, { useState } from 'react'
import { KeyboardAvoidingView, ScrollView, Text } from 'react-native'
import { YStack } from 'tamagui'
import CustomButton from './CustomButton'

const UsersAdvancedFilter = () => {
    const [filterParams, setFilterParams] = useState({
        who: '',
        age: [20, 50],
        user_status: '',
        distance: '100'
    })
    return (
            <KeyboardAvoidingView behavior={'padding'} style={{ flex: 1 }}>
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