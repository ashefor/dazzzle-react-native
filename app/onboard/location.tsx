import { Alert, Image, KeyboardAvoidingView, SafeAreaView, Platform, ScrollView, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View, TextInput, Keyboard } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { Link, router, useFocusEffect } from 'expo-router'
import { useGlobalContext } from '@/context/GlobalProvider'
import { Button, Form, H4, Spinner, YStack, Input, Label, Checkbox, XStack, Progress, Sheet, } from 'tamagui'
import CustomButton from '@/components/CustomButton'
import FormField from '@/components/FormField';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { GooglePlacesAutocompleteRef } from 'react-native-google-places-autocomplete';
import { useAxiosContext } from '@/context/AxiosProvider';
import { ReactionCodes } from '@/models/general';
import { Feather } from '@expo/vector-icons';
import Toast from '@/components/toast/toast'

const GOOGLE_MAPS_API_KEY = 'AIzaSyACkmHiKXczRqjk8clNErV4XFrxVahjrvU';
const OnboardLocation = () => {
    const { axiosRequest } = useAxiosContext();
    const [progress, setProgress] = React.useState(Math.ceil((2 / 5) * 100));

    const [status, setStatus] = React.useState<'off' | 'submitting' | 'submitted'>('off')
    const [location, setLocation] = useState('');
    const [googleMapsLocation, setGoogleMapsLocation] = useState<{
        placeData: any;
        locality: any;
        longitude: any;
        latitude: any;
    }>();

    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        setTimeout(() => {
            setProgress(Math.ceil((3 / 5) * 100))
        }, 500);
    }, [])

    
        const fetchUserProfileUpdateStatus = async () => {
            try {
                const response = await axiosRequest.get('/profile/check-profile-updated');
                const reaction = response.data.reaction;
                const responseData = response.data.data;
                if (reaction === ReactionCodes.SUCCESS) {
                    const profileData = responseData['profileInfo'];
                    if (profileData) {
                        if (profileData.location_latitude && profileData.location_longitude) {
                            fetchLocationFromLatLong(profileData.location_latitude, profileData.location_longitude);
                        }
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
    
        useFocusEffect(
            // Callback should be wrapped in `React.useCallback` to avoid running the effect too often.
            useCallback(() => {
                setProgress(Math.ceil((2 / 5) * 100))
                // Invoked whenever the route is focused.
                fetchUserProfileUpdateStatus();
    
                // Return function is invoked whenever the route gets out of focus.
                return () => {
                    console.log('This route is now unfocused.');
                };
            }, [])
        )

    const fetchLocationFromLatLong = async (latitude: number, longitude: number) => {
        // https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=YOUR_API_KEY
        const { data } = await axiosRequest.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`);
        const results = data.results[0];
        const address = results.formatted_address;
        const params = {
            placeData: results.address_components,
            locality: results.vicinity,
            longitude: longitude,
            latitude: latitude
        }
        setLocation(address);
        setGoogleMapsLocation(params);
    }

    const fetchLocationFromPlacesApi = async (placeId: string) => {
        const { data } = await axiosRequest.get(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_MAPS_API_KEY}`);

        const results = data.result;
        const location = results.geometry.location;
        const address = results.formatted_address;
        const params = {
            placeData: results.address_components,
            locality: results.vicinity,
            longitude: location.lng,
            latitude: location.lat
        }
        setLocation(address);
        setGoogleMapsLocation(params);
    }

    const submit = async () => {
        if (!googleMapsLocation) {
            return Alert.alert('Error', 'Please select a location')
        }

        setIsSubmitting(true);
        try {
            const { data } = await axiosRequest.post('/process-location-data', googleMapsLocation);
            const response = data.data;
            if (data.reaction === ReactionCodes.SUCCESS) {
                Toast.success(response.message || 'Location updated successfully', 2000)
                router.push('/onboard/relationship-type');
            }
        } catch (error: any) {
            Alert.alert('Error', error.errorMessage ? error.errorMessage : 'Failed to update location')
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
            <SafeAreaView className='bg-[#1A1A1A] h-full flex-1'>
                <View className='px-4'>
                    <Progress size="$3" value={progress}>
                        <Progress.Indicator backgroundColor="#DF3FE5" animation="bouncy" />
                    </Progress>
                </View>
                <View className='flex-1'>
                    <View className='p-4 flex-1 space-y-4'>
                    <YStack>
                            <Text className='text-2xl text-white font-firabold'>Choose location</Text>
                            <Text className='text-sm text-[#A9A9A9] font-firaregular'>Join our community and experience seamlessness finding a soulmate. </Text>
                        </YStack>
                        <View className='flex-1 justify-between'>

                        <GooglePlacesAutocomplete
                                placeholder="Search"
                                query={{
                                    key: GOOGLE_MAPS_API_KEY,
                                    language: 'en', // language of the results
                                }}
                                onPress={(data, details = null) => fetchLocationFromPlacesApi(data.place_id)}
                                onFail={(error) => console.error(error)}
                            // requestUrl={{
                            //     url:
                            //         'https://maps.googleapis.com/maps/api/place/autocomplete/json',
                            //     useOnPlatform: 'all',
                            // }} // this in only required for use on the web. See https://git.io/JflFv more for details.
                            />

{location &&  <View className='mt-4 mb-8 space-y-2'>
    <Text className='text-xs text-white font-firamedium'>Selected Location</Text>
                                    <Text className='text-white font-firaregular'>{location}</Text>
                                </View>
}

                            <View className='mt-7 w-full'>
                                <CustomButton title='Next' handlePress={submit} />
                                <View className='justify-center pt-5 flex-row gap-2'>
                                    <Text className='text-sm text-white font-firaregular'>Already have an account?</Text>
                                    <Link className='text-sm text-tertiary font-firaregular underline' href='../(auth)/sign-in'>Sign In</Link>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </KeyboardAvoidingView>
    )
}

export default OnboardLocation
