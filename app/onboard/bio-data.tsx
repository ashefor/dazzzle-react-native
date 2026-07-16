import { Platform, Text, TouchableOpacity, View, TextInput, Alert } from 'react-native'
import React, { memo, useCallback, useMemo } from 'react'
import CustomButton from '@/components/CustomButton'
import FormField from '@/components/FormField'
import CountryCodePicker from '@/components/CountryCodePicker'
import DateOfBirthPicker from '@/components/DateOfBirthPicker'
import { useAppSelector } from '@/hooks/reduxHooks'
import SelectPicker from '@/components/SelectPicker'
import { useLoader } from '@/context/loader/LoaderProvider'
import { genders } from '@/constants/constants'
import { OnboardPagesProps } from '.'
import * as yup from 'yup'
import { Formik } from 'formik'
import Toast from '@/components/toast/toast'
import { ReactionCodes } from '@/models/general'
import axiosRequest from '@/utils/axios'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'

type FormValues = {
    first_name: string;
    last_name: string;
    country_code: string;
    mobile_number: string;
    birthday: string;
    gender: string;
};

const defaultInitial: FormValues = {
    first_name: "",
    last_name: "",
    country_code: "",
    mobile_number: "",
    birthday: "",
    gender: "",
};

const bioDataValidationSchema = yup.object().shape({
    first_name: yup.string().required('First name is required'),
    last_name: yup.string().required('First name is required'),
})

const phoneInputStyle = { lineHeight: Platform.OS === 'ios' ? 0 : undefined };

const OnboardBioData: React.FC<OnboardPagesProps> = ({ pageData, goToNextPage, onLogOut }) => {
    const { show, hide } = useLoader();
    const appConfigGenders = useAppSelector(state => state.app.appConfig?.genders);

    const initialValues: FormValues = useMemo(
        () => ({ ...defaultInitial, ...pageData }),
        [pageData]
    );

    const genderOptions = useMemo(
        () => appConfigGenders || genders,
        [appConfigGenders]
    );

    const submit = useCallback(async (values?: FormValues) => {
        try {
            show();
            const response: any = await axiosRequest.post('/update-basic-settings', values);
            hide();
            if (response.reaction === ReactionCodes.SUCCESS) {
                Toast.success('Profile updated successfully');
                goToNextPage?.();
            }
        } catch (error: any) {
            hide();
            Alert.alert('Error', error.errorMessage ? error.errorMessage : 'Unable to submit')
        }
    }, [show, hide, goToNextPage]);

    return (
        <View className='w-full h-full justify-between'>
            <View className='px-4 pb-2'>
                <Text className='text-2xl text-black font-firabold'>Complete your profile</Text>
                <Text className='text-sm text-[#8C8C8C] font-firaregular'>Join our community and experience seamlessness finding a soulmate. </Text>
            </View>
            <Formik
                initialValues={initialValues}
                onSubmit={submit}
                enableReinitialize
                validationSchema={bioDataValidationSchema}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
                    <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 20, paddingHorizontal: 16 }} keyboardShouldPersistTaps="never" className='flex-1'>
                        <View className='my-5 space-y-3 flex-1'>
                            <View>
                                <FormField
                                    title="First Name"
                                    placeholder='Enter first name'
                                    onChangeText={handleChange('first_name')}
                                    onBlur={handleBlur('first_name')}
                                    touched={touched.first_name}
                                    errorMessage={errors.first_name}
                                    value={values.first_name}
                                />
                            </View>
                            <View>
                                <FormField
                                    title="Last Name"
                                    placeholder='Enter last name'
                                    onChangeText={handleChange('last_name')}
                                    onBlur={handleBlur('last_name')}
                                    touched={touched.last_name}
                                    errorMessage={errors.last_name}
                                    value={values.last_name}
                                />
                            </View>
                            <View className="space-y-2">
                                <Text className='text-base text-black font-firamedium'>Phone Number</Text>
                                <View className='border border-[#ccc] w-full px-4 bg-[#F2F2F7] rounded-md focus:border-primary items-center flex-row'>
                                    <View
                                        className='flex-1 flex-row gap-x-2 h-12 items-center font-firaregular text-black divide divide-x divide-[#ccc]'>
                                        <CountryCodePicker countryCode={values.country_code} onCountryCodeSelect={(c) => setFieldValue("country_code", c)} />
                                        <TextInput
                                            style={phoneInputStyle}
                                            className='flex-1 h-full px-4 font-firaregular text-black text-base'
                                            value={values.mobile_number}
                                            inputMode="tel"
                                            onChangeText={handleChange('mobile_number')}
                                            onBlur={handleBlur('mobile_number')}
                                            placeholder="Phone Number"
                                            placeholderTextColor={"#5B5B5B3A"}
                                            selectionColor={'#DD3FE5'}
                                        />
                                    </View>
                                </View>
                            </View>
                            <View>
                                <DateOfBirthPicker dateOfBirth={values.birthday} onDateOfBirthSelected={(date) => setFieldValue('birthday', date)} />
                            </View>
                            <View>
                                <SelectPicker options={genderOptions} onSelectOption={(params) => setFieldValue('gender', params)} defaultOption={values.gender} title='Gender' />
                            </View>
                        </View>
                        <View className='mt-auto'>
                            <CustomButton title='Next' handlePress={handleSubmit} />
                            <View className='justify-center pt-5 flex-row gap-2'>
                                <TouchableOpacity onPress={onLogOut}>
                                    <Text className='text-sm text-black font-firaregular underline'>Log Out</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </KeyboardAwareScrollView>
                )}
            </Formik>
        </View>
    )
}

export default memo(OnboardBioData)
