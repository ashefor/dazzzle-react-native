import { View, Text } from 'react-native'
import React from 'react'
import { XStack } from 'tamagui'

const UserInterests = ({interests}: {interests?: string[]}) => {
        return (
            <XStack gap="$2.5" flexWrap="wrap">
             {interests?.map((interest, index) => (
                <View key={index} className='px-3 py-1.5 bg-[#FFFFFF1A] rounded-lg'>
                    <Text className='text-white text-sm font-firamedium'>{interest}</Text>
                </View>
             ))}   
            
            </XStack>
        )
    }

export default UserInterests