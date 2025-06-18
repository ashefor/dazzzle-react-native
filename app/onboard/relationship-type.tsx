import { Alert, Image, KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, View, Pressable, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router } from 'expo-router'
import Images from '@/constants/images'
import { YStack, Progress } from 'tamagui'
import CustomButton from '@/components/CustomButton'
import { ReactionCodes } from '@/models/general'
import Toast from '@/components/toast/toast'
import { useAppDispatch } from '@/hooks/reduxHooks'
import { signUserOut } from '@/redux/thunks/authActions'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useLoader } from '@/context/LoaderProvider'
import axiosRequest from '@/utils/axios'

const OnboardRelationshipType = () => {
    const dispatch = useAppDispatch();
    const { show, hide } = useLoader();
    const [progress, setProgress] = React.useState(Math.ceil((3 / 5) * 100));
    const [selectedRelationshipTypes, setSelectedRelationshipTypes] = useState<string[]>([]);
    const insets = useSafeAreaInsets();

    useEffect(() => {
        setTimeout(() => {
            setProgress(Math.ceil((4 / 5) * 100))
        }, 500);
    }, [])

    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchUserProfileUpdateStatus = async () => {
        try {
            show();
            const response: any = await axiosRequest.get('/profile/check-profile-updated');
            hide();
            const reaction = response.reaction;
            const responseData = response.data;
            if (reaction === ReactionCodes.SUCCESS) {
                const profileData = responseData['profileInfo'];
                console.log('profileData', responseData);
                if (profileData) {

                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchUserProfileUpdateStatus()
    }, [])

    const handleLogOut = async () => {
        dispatch(signUserOut()).unwrap().then(() => router.replace('/(auth)/sign-in'))
    }

    const submit = async () => {
        setIsSubmitting(true);
        try {
            show();
            const data: any = await axiosRequest.post('/user-process-relationship-type-update-profile', { relationship_type: selectedRelationshipTypes });
            hide();
            if (data.reaction === ReactionCodes.SUCCESS) {
                Toast.success('Profile updated successfully');
                router.push('/onboard/choose-interests');
            }
        } catch (error: any) {
            hide();
            Alert.alert('Error', error.errorMessage ? error.errorMessage : 'Failed to update')
        }
    }

    const chooseRelationshipType = (type: string) => {
        console.log('type', type);
        if (selectedRelationshipTypes.includes(type)) {
            setSelectedRelationshipTypes(selectedRelationshipTypes.filter((item) => item !== type));
        } else {
            setSelectedRelationshipTypes([...selectedRelationshipTypes, type]);
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
            <View style={{ paddingBottom: insets.bottom }} className='bg-[#1A1A1A] h-full'>
                <View className='px-4'>
                    <Progress size="$3" value={progress}>
                        <Progress.Indicator backgroundColor="#DF3FE5" animation="bouncy" />
                    </Progress>
                </View>
                <View className='flex-1'>
                    <View className='p-4 flex-1 space-y-4'>
                        <YStack>
                            <Text className='text-2xl text-white font-firabold'>Relationship Type</Text>
                            <Text className='text-sm text-[#A9A9A9] font-firaregular'>Join our community and experience seamlessness finding a soulmate. </Text>
                        </YStack>
                        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }} >
                            {selectedRelationshipTypes.length < 1 && <Text className='text-xs text-red-500 text-center font-firaregular mb-2'>Choose at least one relationship type</Text>}
                            <View className='flex-wrap mb-6 flex-row gap-y-4 justify-between'>
                                <Pressable onPress={() => chooseRelationshipType('1')} className={`h-52 w-[48.5%] border rounded-[24px] p-4 flex flex-col items-center justify-center ${selectedRelationshipTypes.includes('1') ? 'bg-[#DF3FE5] border-[#DF3FE5]' : 'border-white'}`}>
                                    <Image source={Images.relType1} className='w-20 h-20 rounded-full mb-4 bg-red-500' />
                                    <Text className='text-base text-white font-firasemibold mt-2 text-center'>Fun
                                        &
                                        Friendship</Text>
                                </Pressable>
                                <Pressable onPress={() => chooseRelationshipType('2')} className={`h-52 w-[46.5%] border rounded-[24px] p-4 flex flex-col items-center justify-center ${selectedRelationshipTypes.includes('2') ? 'bg-[#DF3FE5] border-[#DF3FE5]' : 'border-white'}`}>
                                    <Image source={Images.relType2} className='w-20 h-20 rounded-full mb-4' />
                                    <Text className='text-base text-white font-firasemibold mt-2 text-center'>
                                        Serious
                                        Relationship
                                    </Text>
                                </Pressable>
                                <Pressable onPress={() => chooseRelationshipType('3')} className={`h-52 w-[46.5%] border rounded-[24px] p-4 flex flex-col items-center justify-center ${selectedRelationshipTypes.includes('3') ? 'bg-[#DF3FE5] border-[#DF3FE5]' : 'border-white'}`}>
                                    <Image source={Images.relType3} className='w-20 h-20 rounded-full mb-4' />
                                    <Text className='text-base text-white font-firasemibold mt-2 text-center'>
                                        Male
                                        Friends
                                    </Text>
                                </Pressable>
                                <Pressable onPress={() => chooseRelationshipType('4')} className={`h-52 w-[46.5%] border rounded-[24px] p-4 flex flex-col items-center justify-center ${selectedRelationshipTypes.includes('4') ? 'bg-[#DF3FE5] border-[#DF3FE5]' : 'border-white'}`}>
                                    <Image source={Images.relType4} className='w-20 h-20 rounded-full mb-4' />
                                    <Text className='text-base text-white font-firasemibold mt-2 text-center'>
                                        Female
                                        Friends
                                    </Text>
                                </Pressable>
                                <Pressable onPress={() => chooseRelationshipType('5')} className={`h-52 w-[46.5%] border rounded-[24px] p-4 flex flex-col items-center justify-center ${selectedRelationshipTypes.includes('5') ? 'bg-[#DF3FE5] border-[#DF3FE5]' : 'border-white'}`}>
                                    <Image source={Images.relType5} className='w-20 h-20 rounded-full mb-4' />
                                    <Text className='text-base text-white font-firasemibold mt-2 text-center'>
                                        Marriage Only
                                    </Text>
                                </Pressable>
                                <Pressable onPress={() => chooseRelationshipType('6')} className={`h-52 w-[46.5%] border rounded-[24px] p-4 flex flex-col items-center justify-center ${selectedRelationshipTypes.includes('6') ? 'bg-[#DF3FE5] border-[#DF3FE5]' : 'border-white'}`}>
                                    <Image source={Images.relType6} className='w-20 h-20 rounded-full mb-4' />
                                    <Text className='text-base text-white font-firasemibold mt-2 text-center'>
                                        Flirting Only
                                    </Text>
                                </Pressable>
                            </View>
                            <YStack>
                                <CustomButton disabled={selectedRelationshipTypes.length === 0} title='Next' handlePress={submit} />
                                <View className='justify-center pt-5 flex-row gap-2'>
                                    <TouchableOpacity onPress={handleLogOut}>
                                        <Text className='text-sm text-tertiary font-firaregular underline'>Log Out</Text>
                                    </TouchableOpacity>
                                </View>
                            </YStack>
                        </ScrollView>
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    )
}

export default OnboardRelationshipType

const styles = StyleSheet.create({})