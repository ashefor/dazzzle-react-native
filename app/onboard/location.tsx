import { Alert, KeyboardAvoidingView, Platform, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { router, useFocusEffect } from 'expo-router'
import { YStack, Progress, } from 'tamagui'
import CustomButton from '@/components/CustomButton'
// import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { ReactionCodes } from '@/models/general';
import Toast from '@/components/toast/toast';
import { useAppDispatch } from '@/hooks/reduxHooks';
import { signUserOut } from '@/redux/thunks/authActions';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GooglePlacesAutocomplete } from "expo-google-places-autocomplete";
import axiosRequest from '@/utils/axios'
import { useLoader } from '@/context/loader/LoaderProvider'

const GOOGLE_MAPS_API_KEY = 'AIzaSyACkmHiKXczRqjk8clNErV4XFrxVahjrvU';
const OnboardLocation = () => {
    const dispatch = useAppDispatch();
    const { show, hide } = useLoader();
    const [progress, setProgress] = React.useState(Math.ceil((2 / 5) * 100));

    const [location, setLocation] = useState('');
    const [googleMapsLocation, setGoogleMapsLocation] = useState<{
        placeData: any;
        locality: any;
        longitude: any;
        latitude: any;
    }>();
    const insets = useSafeAreaInsets();

    useEffect(() => {
        setTimeout(() => {
            setProgress(Math.ceil((3 / 5) * 100))
        }, 500);
    }, [])


    const fetchUserProfileUpdateStatus = async () => {
        try {
            show();
            const response: any = await axiosRequest.get('/profile/check-profile-updated');
            hide();
            const reaction = response.reaction;
            const responseData = response.data;
            if (reaction === ReactionCodes.SUCCESS) {
                const profileData = responseData['profileInfo'];
                console.log('profileData', profileData);
                if (profileData) {
                    if (profileData.location_latitude && profileData.location_longitude) {
                        fetchLocationFromLatLong(profileData.location_latitude, profileData.location_longitude);
                    }
                }
            }
        } catch (error) {
            hide();
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
            return () => { };
        }, [])
    )

    const fetchLocationFromLatLong = async (latitude: number, longitude: number) => {
        // https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=YOUR_API_KEY
        const data: any = await axiosRequest.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`);
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

    const fetchLocationFromPlacesApi = async (placeId?: string) => {
        if (placeId) {
            try {
                show();;
                const data:any = await axiosRequest.get(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_MAPS_API_KEY}`);
                hide();
                const results = data.result;
                const location = results.geometry.location;
                const address = results.formatted_address;
                const params = {
                    placeData: results.address_components,
                    locality: results.vicinity || '',
                    longitude: location.lng,
                    latitude: location.lat
                }
                setLocation(address);
                setGoogleMapsLocation(params);
            } catch (error) {
                hide();
            }
        } else {
            Alert.alert('Error', 'Please select a location')
        }
    }

    const handleLogOut = async () => {
        dispatch(signUserOut()).unwrap().then(() => router.replace('/(auth)/sign-in'))
    }

    const submit = async () => {
        if (!googleMapsLocation) {
            return Alert.alert('Error', 'Please select a location')
        }
        try {
            show();
            const data: any = await axiosRequest.post('/process-location-data', googleMapsLocation);
            hide();
            const response = data.data;
            if (data.reaction === ReactionCodes.SUCCESS) {
                Toast.success(response.message || 'Location updated successfully', 2000)
                router.push('/onboard/relationship-type');
            }
        } catch (error: any) {
            hide();
            Alert.alert('Error', error.errorMessage ? error.errorMessage : 'Failed to update location')
        }
    }

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
            <View style={{ paddingBottom: insets.bottom }} className='bg-[#1A1A1A] h-full flex-1'>
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

                            {/* <GooglePlacesAutocomplete
                                placeholder="Search"
                                query={{
                                    key: GOOGLE_MAPS_API_KEY,
                                    language: 'en', // language of the results
                                }}
                                onPress={(data, details = null) => fetchLocationFromPlacesApi(data.place_id)}
                                onFail={(error) => console.error(error)}
                            /> */}

                            <GooglePlacesAutocomplete
                                placeholder="Search location"
                                searchInputStyle={{ backgroundColor: 'transparent', margin: 0, fontSize: 16 } as any}
                                containerStyle={{ flex: 0, borderRadius: 5, padding: 0 }}
                                inputContainerStyle={{ flex: 0,  borderWidth: 0, margin: 0, padding: 4, borderRadius: 5 }}
                                apiKey={GOOGLE_MAPS_API_KEY}
                                onPlaceSelected={(data) => fetchLocationFromPlacesApi(data.placeId)}
                                onSearchError={(error) => console.error(error)}
                            />

                            {location && <View className='mt-4 mb-8 space-y-2'>
                                <Text className='text-xs text-white font-firamedium'>Selected Location</Text>
                                <Text className='text-white font-firaregular'>{location}</Text>
                            </View>
                            }

                            <View className='mt-7 w-full'>
                                <CustomButton title='Next' handlePress={submit} />
                                <View className='justify-center pt-5 flex-row gap-2'>
                                    <TouchableOpacity onPress={() => handleLogOut()}>
                                        <Text className='text-sm text-tertiary font-firaregular underline'>Log Out</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    )
}

export default OnboardLocation
