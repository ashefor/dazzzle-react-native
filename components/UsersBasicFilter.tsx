import { Text, Dimensions, View, TextInputProps } from 'react-native'
import React, { useCallback, useState } from 'react'
import MultiSlider from '@ptomasroos/react-native-multi-slider'
import CustomButton from './CustomButton'
import SelectPicker from './SelectPicker'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { BottomSheetTextInput } from '@gorhom/bottom-sheet'

export type BasicFilter = {
    username: string;
    age: number[];
    looking_for: string;
    user_type?: string;
    distance: string;
}

const genderOptions = [
    { value: 'All', id: 'all' },
    { value: 'Male', id: 'male' },
    { value: 'Female', id: 'female' },
    { value: 'Secret', id: 'secret' },
]

const UsersBasicFilter = ({ filterUsers }: { filterUsers: (value: BasicFilter) => void }) => {
    const insets = useSafeAreaInsets();
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
        <View style={{ gap: 28, paddingHorizontal: 20, paddingBottom: insets.bottom + 20, paddingTop: 20 }}>
            <View style={{ gap: 20 }}>
                <View>
                    <CustomTextInput
                        label="Username"
                        value={filterParams.username}
                        onChangeText={(val: string) => updateFilterParams('username', val)}
                    />
                </View>
                <View className='space-y-1'>
                    <Text className='text-sm text-black font-firaregular'>Age</Text>
                    <View className=' items-center justify-center'>
                        <MultiSlider
                            values={filterParams.age}
                            min={18}
                            max={60}
                            step={1}
                            enableLabel={true}
                            customLabel={(value) =>
                                <Text className='text-primary'>Between: {value.oneMarkerValue} and {value.twoMarkerValue} </Text>}
                            markerStyle={{ backgroundColor: '#DD3FE5', borderWidth: 0 }}
                            sliderLength={Dimensions.get('window').width - 50}
                            selectedStyle={{ backgroundColor: '#DD3FE5' }}
                            trackStyle={{ backgroundColor: '#ccc' }}
                            // onValuesChange={(values) => console.log(values)}
                            onValuesChangeFinish={(values) => updateFilterParams('age', values)}
                        />
                    </View>
                </View>
                <View className='space-y-1'>
                    <SelectPicker options={genderOptions} onSelectOption={(params) => updateFilterParams('looking_for', params)} defaultOption={filterParams.looking_for} title='Gender' />
                </View>
                <View>
                    <CustomTextInput
                        label="Distance(km)"
                        value={filterParams.distance}
                        keyboardType="numeric"
                        placeholder='Anywhere'
                        onChangeText={(val: string) => updateFilterParams('distance', val)}
                    />
                </View>
            </View>
            <CustomButton title='Apply' handlePress={applyFilter} />
        </View>

    )
}

interface CustomTextInputProps extends Omit<TextInputProps, 'style'> {
    label: string;
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({ label, value, onChangeText, keyboardType = 'default' }) => (
    <View className="mb-5">
        <Text className="text-black text-sm font-firamedium mb-2">{label}</Text>
        <View className="bg-[#F2F2F7] text-black rounded-xl px-4 h-14 focus:border-primary border border-[#cccccc80]">
            <BottomSheetTextInput
                value={value}
                style={{ height: '100%', color: 'black' }}
                onChangeText={onChangeText}
                keyboardType={keyboardType}
                autoCapitalize="none"
                importantForAutofill='no'
                placeholderTextColor={"#5B5B5B3A"}
                selectionColor={'#DD3FE5'}
            />
        </View>
    </View>
);

export default UsersBasicFilter