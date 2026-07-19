import { Text, View, TextInputProps, useWindowDimensions } from 'react-native'
import React, { useCallback, useState } from 'react'
import MultiSlider from '@ptomasroos/react-native-multi-slider'
import CustomButton from './CustomButton'
import SelectPicker from './SelectPicker'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { BottomSheetTextInput } from '@gorhom/bottom-sheet'

export type BasicFilter = {
    username: string;
    age: [number, number];
    looking_for: string;
    user_type?: string;
    distance: string;
}

const genderOptions = [
    { value: 'All', id: 'all' },
    { value: 'Male', id: '1' },
    { value: 'Female', id: '2' },
    { value: 'Secret', id: '3' },
]

const userTypeOptions = [
    {
        value: 'Yes', id: '1'
    },
    { value: 'No', id: '0'
    }
]

const DEFAULT_FILTERS: BasicFilter = {
    username: '',
    age: [18, 60],
    looking_for: 'all',
    distance: '',
    user_type: '0',
}

const UsersBasicFilter = ({ filterUsers, onSliderStart, onSliderEnd, filterParams: initialFilterParams }: { filterUsers: (value: BasicFilter) => void | Promise<void>, onSliderStart?: () => void, onSliderEnd?: () => void, filterParams?: BasicFilter | null }) => {
    const insets = useSafeAreaInsets();
    const { width } = useWindowDimensions();
    const [isApplying, setIsApplying] = useState(false);
    const [filterParams, setFilterParams] = useState<BasicFilter>(initialFilterParams ?? DEFAULT_FILTERS)

    const updateFilterParams = useCallback(<Key extends keyof BasicFilter>(key: Key, value: BasicFilter[Key]) => {
        setFilterParams((current) => ({ ...current, [key]: value }));
    }, [])

    const applyFilter = useCallback(async () => {
        if (isApplying) return;
        setIsApplying(true);
        try {
            await filterUsers(filterParams);
        } finally {
            setIsApplying(false);
        }
    }, [filterParams, filterUsers, isApplying])


    return (
        <View style={{ gap: 28, paddingHorizontal: 20, paddingBottom: insets.bottom + 20, paddingTop: 20 }}>
            <View style={{ gap: 20 }}>
                <View className='space-y-1'>
                    <SelectPicker options={userTypeOptions} onSelectOption={(params) => updateFilterParams('user_type', params)} defaultOption={filterParams.user_type} title='Only Verified Users' />
                </View>
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
                                <Text style={{marginLeft: -14}} className='text-primary'>Between: {value.oneMarkerValue} and {value.twoMarkerValue} </Text>}
                            markerStyle={{ backgroundColor: '#DD3FE5', borderWidth: 0 }}
                            sliderLength={Math.max(width - 64, 200)}
                            selectedStyle={{ backgroundColor: '#DD3FE5' }}
                            trackStyle={{ backgroundColor: '#ccc' }}
                            onValuesChangeStart={onSliderStart}
                            onValuesChangeFinish={(values) => {
                                updateFilterParams('age', [values[0], values[1]]);
                                onSliderEnd?.();
                            }}
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
            <CustomButton title='Apply' handlePress={applyFilter} isLoading={isApplying} disabled={isApplying} />
        </View>

    )
}

interface CustomTextInputProps extends Omit<TextInputProps, 'style'> {
    label: string;
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({ label, ...inputProps }) => (
    <View className="mb-5">
        <Text className="text-black text-sm font-firamedium mb-2">{label}</Text>
        <View className="bg-[#F2F2F7] text-black rounded-xl px-4 h-14 focus:border-primary border border-[#cccccc80]">
            <BottomSheetTextInput
                {...inputProps}
                accessibilityLabel={label}
                style={{ height: '100%', color: 'black' }}
                autoCapitalize="none"
                importantForAutofill='no'
                placeholderTextColor={"#5B5B5B3A"}
                selectionColor={'#DD3FE5'}
            />
        </View>
    </View>
);

export default UsersBasicFilter
