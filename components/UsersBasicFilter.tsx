import { Text, Dimensions, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useCallback, useState } from 'react'
import MultiSlider from '@ptomasroos/react-native-multi-slider'
import { YStack, XStack, RadioGroup, SizeTokens, Label } from 'tamagui'
import CustomButton from './CustomButton'
import FormField from './FormField'

export type BasicFilter = {
    username: string;
    age: number[];
    looking_for: string;
    user_type?: string;
    distance: string;
}

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
const UsersBasicFilter = ({ filterUsers }: { filterUsers: (value: BasicFilter) => void }) => {
    const [filterParams, setFilterParams] = useState<BasicFilter>({
        username: '',
        age: [18, 60],
        looking_for: 'all',
        distance: ''
    })

    const updateFilterParams = useCallback((key: string, value: any) => {
        setFilterParams({
            ...filterParams,
            [key]: value
        })
    }, [filterParams])

    const resetFilterParams = useCallback(() => {
        setFilterParams({
            username: '',
            age: [18, 60],
            looking_for: 'all',
            distance: ''
        })
    }, [])

    const applyFilter = useCallback(() => {
        filterUsers(filterParams);
        // resetFilterParams();
    }, [filterParams])


    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
            <ScrollView className='px-4 py-2 h-full'>
                <YStack gap="$7">
                    <YStack gap="$5">
                        <FormField
                            title="Username"
                            placeholder='Enter Username'
                            value={filterParams.username}
                            onChangeText={(value) => updateFilterParams('username', value)}
                        />
                        <YStack gap="$2">
                            <Text className='text-base text-white font-firamedium'>Age</Text>
                            <XStack alignItems='center' justifyContent='center'>
                                <MultiSlider
                                    values={filterParams.age}
                                    min={18}
                                    max={60}
                                    step={1}
                                    enableLabel={true}
                                    customLabel={(value) =>
                                        <Text className='text-white'>Between: {value.oneMarkerValue} and {value.twoMarkerValue} </Text>}
                                    markerStyle={{ backgroundColor: '#DD3FE5', borderWidth: 0 }}
                                    sliderLength={Dimensions.get('window').width - 64}
                                    selectedStyle={{ backgroundColor: '#DD3FE5' }}
                                    // onValuesChange={(values) => console.log(values)}
                                    onValuesChangeFinish={(values) => updateFilterParams('age', values)}
                                />
                            </XStack>
                        </YStack>
                        <YStack gap="$2">
                            <Text className='text-base text-white font-firamedium'>Gender</Text>
                            <RadioGroup value={filterParams.looking_for} onValueChange={(value) => updateFilterParams('looking_for', value)} aria-labelledby="Select one item" defaultValue="all" name="form">
                                <YStack gap="$3">
                                    <RadioGroupItemWithLabel size="$3" value="all" label="All" />
                                    <RadioGroupItemWithLabel size="$3" value="male" label="Male" />
                                    <RadioGroupItemWithLabel size="$3" value="female" label="Female" />
                                    <RadioGroupItemWithLabel size="$3" value="secret" label="Secret" />
                                </YStack>
                            </RadioGroup>
                        </YStack>
                        <FormField
                            title="Distance(km)"
                            placeholder='Anywhere'
                            keyBoardType='numeric'
                            value={filterParams.distance}
                            onChangeText={(value) => updateFilterParams('distance', value)}
                        />
                    </YStack>
                    <CustomButton title='Apply' handlePress={applyFilter} />
                </YStack>
            </ScrollView>
        </KeyboardAvoidingView>

    )
}

export default UsersBasicFilter