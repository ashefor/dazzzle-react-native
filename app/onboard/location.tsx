import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router } from 'expo-router'
import CustomButton from '@/components/CustomButton'
// import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { PlaceAutocompletePrediction, ReactionCodes } from '@/models/general'
import Toast from '@/components/toast/toast'
import { useAppDispatch } from '@/hooks/reduxHooks'
import { signUserOut } from '@/redux/thunks/authActions'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
// import { GooglePlacesAutocomplete } from "expo-google-places-autocomplete"
import axiosRequest from '@/utils/axios'
import { useLoader } from '@/context/loader/LoaderProvider'
import { OnboardPagesProps } from '.'
import FormField from '@/components/FormField'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'

const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || '';

const OnboardLocation: React.FC<OnboardPagesProps> = ({ pageData, goToNextPage }) => {
    const dispatch = useAppDispatch();
    const { show, hide } = useLoader();
    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState<PlaceAutocompletePrediction[]>([]);
    const [loading, setLoading] = useState(false);
    const [showOptions, setShowOptions] = useState(false);

    const [location, setLocation] = useState('');
    const [googleMapsLocation, setGoogleMapsLocation] = useState<{
        placeData: any;
        locality: any;
        longitude: any;
        latitude: any;
    }>();
    const insets = useSafeAreaInsets();

    const findPlaceFromText = async (input: string, countries: string[] = []) => {
        if (!input || input.length === 0) return [];

        const fetchPromises = [fetch(
            `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
                input
            )}&key=${GOOGLE_MAPS_API_KEY}`
        ).then((res) => res.json())]

        try {
            const results = await Promise.all(fetchPromises);
            const allPredictions = results
                .filter((res) => res.status === 'OK')
                .flatMap((res) => res.predictions);

            return allPredictions as any[];
        } catch (err) {
            console.error('Autocomplete error:', err);
            return [];
        }
    };

    useEffect(() => {
        setLoading(true);
        findPlaceFromText(searchText, []).then((res: PlaceAutocompletePrediction[] | []) => {
            setLoading(false);
            setSearchResults(res || [])
        })
    }, [searchText])

    useEffect(() => {
        if (pageData) {
            if (pageData.location_latitude && pageData.location_longitude) {
                fetchLocationFromLatLong(pageData.location_latitude, pageData.location_longitude);
            }
        }

    }, [pageData])


    const fetchLocationFromLatLong = async (latitude: number, longitude: number) => {
        try {
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
        } catch (error) {
            console.error('Error fetching location from lat/long:', error);
            Alert.alert('Error', 'Failed to fetch location from lat/long');
        }
    }

    const fetchLocationFromPlacesApi = async (placeId?: string) => {
        if (placeId) {
            try {
                show();;
                const data: any = await axiosRequest.get(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_MAPS_API_KEY}`);
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
                console.error('Error fetching location details:', error);
                Alert.alert('Error', 'Failed to fetch location details');
            } finally {
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
                goToNextPage?.();
            }
        } catch (error: any) {
            hide();
            Alert.alert('Error', error.errorMessage ? error.errorMessage : 'Failed to update location')
        }
    }

    return (
        <View className='flex-1 space-y-4'>
            <View className='px-4 pb-2'>
                <Text className='text-2xl text-black font-firabold'>Choose location</Text>
                <Text className='text-sm text-[#8C8C8C] font-firaregular'>Join our community and experience seamlessness finding a soulmate. </Text>
            </View>
            <KeyboardAwareScrollView contentContainerStyle={{flex: 1, flexGrow: 1, paddingHorizontal: 16, paddingBottom: insets.bottom + 20 }}>
                <View className="relative z-50 w-full">
                    <FormField
                        title=''
                        value={searchText}
                        secureTextEntry={false}
                        placeholder='Search location'
                        onChangeText={(text) => {
                            if (text) {
                                if (!showOptions) {
                                    setShowOptions(true);
                                }
                                setSearchText(text)
                            } else {
                                setShowOptions(false);
                                setSearchText(text)
                                setSearchResults([])
                            }
                        }}
                    />

                    {/* Dropdown Container */}
                    {(showOptions && (searchResults.length > 0 || loading)) && (
                        <View style={{maxHeight: 250}} className="absolute top-[100%] left-0 right-0 bg-white rounded-b-xl shadow-lg border border-gray-200 z-50 max-h-[250px] overflow-hidden mt-1">

                            {loading ? (
                                <View className="p-4">
                                    <Text className='text-sm text-gray-500 font-firaregular'>Loading...</Text>
                                </View>
                            ) : (
                                <ScrollView>
                                    {searchResults.map((item, index) => (
                                        <TouchableOpacity
                                        key={index.toString()}
                                            onPress={() => {
                                                setSearchText(item.description);
                                                setShowOptions(false);
                                                fetchLocationFromPlacesApi(item.place_id)
                                            }}
                                            className="active:bg-gray-100"
                                        >
                                            <View className='p-4 border-b border-gray-100'>
                                                <Text
                                                    numberOfLines={1}
                                                    className='font-ps_regular text-[14px] text-black'
                                                >
                                                    {item.description}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                                    </ScrollView>
                                // <FlatList
                                //     data={searchResults}
                                //     keyExtractor={(item, index) => index.toString()}
                                //     keyboardShouldPersistTaps="handled"
                                //     nestedScrollEnabled={true}
                                //     showsVerticalScrollIndicator={true}
                                //     renderItem={({ item }) => (
                                //         <TouchableOpacity
                                //             onPress={() => {
                                //                 setSearchText(item.description);
                                //                 setShowOptions(false);
                                //                 fetchLocationFromPlacesApi(item.place_id)
                                //             }}
                                //             className="active:bg-gray-100"
                                //         >
                                //             <View className='p-4 border-b border-gray-100'>
                                //                 <Text
                                //                     numberOfLines={1}
                                //                     className='font-ps_regular text-[14px] text-black'
                                //                 >
                                //                     {item.description}
                                //                 </Text>
                                //             </View>
                                //         </TouchableOpacity>
                                //     )}
                                // />
                            )}
                        </View>
                    )}
                </View>

                {location && <View className='mt-12 mb-8 space-y-2'>
                    <Text className='text-xs  font-firamedium'>Selected Location</Text>
                    <Text className='text-[##8C8C8C] font-firaregular'>{location}</Text>
                </View>
                }

                <View className='mt-auto w-full'>
                    <CustomButton title='Next' handlePress={submit} />
                    <View className='justify-center pt-5 flex-row gap-2'>
                        <TouchableOpacity onPress={() => handleLogOut()}>
                            <Text className='text-sm text-black font-firaregular underline'>Log Out</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAwareScrollView>
        </View>
    )
}

export default OnboardLocation
