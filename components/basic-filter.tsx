import { View, Text, Dimensions, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useState } from 'react'
import MultiSlider from '@ptomasroos/react-native-multi-slider'
import { YStack, XStack, RadioGroup, SizeTokens, Label } from 'tamagui'
import CustomButton from './CustomButton'
import FormField from './FormField'

const RadioGroupItemWithLabel = (props: {
    size: SizeTokens
    value: string
    label: string
}) => {
    const id = `radiogroup-${props.value}`
    return (
        <XStack alignItems="center" justifyContent='space-between' gap="$2">


            <Label unstyled className='text-white text-sm font-firaregular flex-1' htmlFor={id}>
                {props.label}
            </Label>
            <RadioGroup.Item value={props.value} id={id} size={props.size}>
                <RadioGroup.Indicator />
            </RadioGroup.Item>
        </XStack>
    )
}
const UsersBasicFilter = () => {
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
                <YStack gap="$5">
                    <FormField
                        title="Who"
                        placeholder='Enter username'
                        value={filterParams.who}
                        handleChangeText={(text) => setFilterParams({ ...filterParams, who: text.toString() })}
                    />
                    <YStack gap="$2">
                        <Text className='text-base text-white font-firamedium'>Age</Text>
                        <XStack alignItems='center' justifyContent='center'>
                            <MultiSlider
                                values={[20, 50]}
                                min={18}
                                max={60}
                                step={1}
                                enableLabel={true}
                                customLabel={(value) =>
                                    <Text className='text-white'>Between: {value.oneMarkerValue} and {value.twoMarkerValue} </Text>}
                                markerStyle={{ backgroundColor: '#DD3FE5', borderWidth: 0 }}
                                sliderLength={Dimensions.get('window').width - 32}
                                selectedStyle={{ backgroundColor: '#DD3FE5' }}
                                onValuesChange={(values) => console.log(values)}
                                onValuesChangeFinish={(values) => console.log(values)}
                            />
                        </XStack>
                    </YStack>
                    <YStack gap="$2">
                        <Text className='text-base text-white font-firamedium'>Who are you interested in?</Text>
                        <RadioGroup aria-labelledby="Select one item" defaultValue="all" name="form">
                            <YStack gap="$3">
                                <RadioGroupItemWithLabel size="$3" value="all" label="All" />
                                <RadioGroupItemWithLabel size="$3" value="male" label="Male" />
                                <RadioGroupItemWithLabel size="$3" value="female" label="Female" />
                                <RadioGroupItemWithLabel size="$3" value="secret" label="Secret" />
                            </YStack>
                        </RadioGroup>
                    </YStack>
                    <FormField
                        title="Distance"
                        placeholder='Anywhere'
                        keyBoardType='numeric'
                        value={filterParams.distance}
                        handleChangeText={(text) => setFilterParams({ ...filterParams, distance: text.toString() })}
                    />
                </YStack>
                <CustomButton title='Apply' handlePress={() => { }} />
            </YStack>
        </ScrollView>
            </KeyboardAvoidingView>

    )
}

export default UsersBasicFilter