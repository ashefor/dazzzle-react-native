import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import React, { memo, useCallback, useEffect, useState } from 'react'
import { PlaceAutocompletePrediction, ReactionCodes } from '@/models/general'
import CustomButton from '@/components/CustomButton'
import Toast from '@/components/toast/toast'
import axiosRequest from '@/utils/axios'
import { useLoader } from '@/context/loader/LoaderProvider'
import { OnboardPagesProps } from '.'
import FormField from '@/components/FormField'
import { KEYBOARD_GAP } from '@/constants/constants'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'

const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || '';

const SEARCH_DEBOUNCE_MS = 350;

const DROPDOWN_MAX_HEIGHT = 250;

if (!GOOGLE_MAPS_API_KEY) {
    // Surfaces the #1 cause of "Places returns nothing" in release builds:
    // the EXPO_PUBLIC_ env var wasn't available at build time (e.g. .env not
    // uploaded to EAS). See eas.json > build.*.env.
    console.warn('[Places] GOOGLE_MAPS_API_KEY is empty — env var missing at build time.');
}

const findPlaceFromText = async (
    input: string,
    signal: AbortSignal
): Promise<PlaceAutocompletePrediction[]> => {
    const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
            input
        )}&key=${GOOGLE_MAPS_API_KEY}`,
        { signal }
    );
    const result = await response.json();

    if (result.status !== 'OK') {
        // Log denials (bad/empty key, API not enabled, billing) so they surface
        // instead of silently becoming zero results.
        if (result.status !== 'ZERO_RESULTS') {
            console.warn('[Places] autocomplete non-OK:', result.status, result.error_message);
        }
        return [];
    }

    return result.predictions ?? [];
};

const OnboardLocation: React.FC<OnboardPagesProps> = ({ pageData, goToNextPage, onLogOut }) => {
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

    // Debounced so typing doesn't fire one Places call per keystroke, and
    // aborted on change so a slow earlier response can't overwrite a newer one.
    useEffect(() => {
        const query = searchText.trim();
        if (!query) {
            setSearchResults([]);
            setLoading(false);
            return;
        }

        const controller = new AbortController();
        setLoading(true);

        const timeoutId = setTimeout(() => {
            findPlaceFromText(query, controller.signal)
                .then((results) => {
                    setSearchResults(results);
                    setLoading(false);
                })
                .catch((error) => {
                    if (controller.signal.aborted) return;
                    console.error('Autocomplete error:', error);
                    setSearchResults([]);
                    setLoading(false);
                });
        }, SEARCH_DEBOUNCE_MS);

        return () => {
            clearTimeout(timeoutId);
            controller.abort();
        };
    }, [searchText]);

    const fetchLocationFromLatLong = useCallback(async (latitude: number, longitude: number) => {
        try {
            const data: any = await axiosRequest.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`);
            const results = data.results[0];
            setLocation(results.formatted_address);
            setGoogleMapsLocation({
                placeData: results.address_components,
                locality: results.vicinity,
                longitude,
                latitude
            });
        } catch (error) {
            console.error('Error fetching location from lat/long:', error);
            Alert.alert('Error', 'Failed to fetch location from lat/long');
        }
    }, []);

    useEffect(() => {
        if (pageData?.location_latitude && pageData?.location_longitude) {
            fetchLocationFromLatLong(pageData.location_latitude, pageData.location_longitude);
        }
    }, [pageData, fetchLocationFromLatLong])

    const fetchLocationFromPlacesApi = useCallback(async (placeId?: string) => {
        if (!placeId) {
            Alert.alert('Error', 'Please select a location');
            return;
        }
        try {
            show();
            const data: any = await axiosRequest.get(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_MAPS_API_KEY}`);
            const results = data.result;
            const { lat, lng } = results.geometry.location;
            setLocation(results.formatted_address);
            setGoogleMapsLocation({
                placeData: results.address_components,
                locality: results.vicinity || '',
                longitude: lng,
                latitude: lat
            });
        } catch (error) {
            console.error('Error fetching location details:', error);
            Alert.alert('Error', 'Failed to fetch location details');
        } finally {
            hide();
        }
    }, [show, hide]);

    const handleSearchTextChange = useCallback((text: string) => {
        setSearchText(text);
        setShowOptions(Boolean(text));
    }, []);

    const handleSelectPlace = useCallback((item: PlaceAutocompletePrediction) => {
        setSearchText(item.description);
        setShowOptions(false);
        fetchLocationFromPlacesApi(item.place_id);
    }, [fetchLocationFromPlacesApi]);

    const submit = useCallback(async () => {
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
    }, [googleMapsLocation, show, hide, goToNextPage]);

    return (
        <View className='flex-1 space-y-4'>
            <View className='px-4 pb-2'>
                <Text className='text-2xl text-black font-firabold'>Choose location</Text>
                <Text className='text-sm text-[#8C8C8C] font-firaregular'>Join our community and experience seamlessness finding a soulmate. </Text>
            </View>
            {/* bottomOffset is the gap kept between the focused input and the top of
                the keyboard. Left at its 0 default the input sits flush against the
                keyboard; when the results dropdown is open we also reserve its height,
                since it renders *below* the input and would otherwise be covered. */}
            <KeyboardAwareScrollView
                className='flex-1'
                contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 16, paddingBottom: 20 }}
                keyboardShouldPersistTaps="handled"
                bottomOffset={showOptions ? DROPDOWN_MAX_HEIGHT + KEYBOARD_GAP : KEYBOARD_GAP}
            >
                <View className="relative z-50 w-full">
                    <FormField
                        title=''
                        value={searchText}
                        secureTextEntry={false}
                        placeholder='Search location'
                        onChangeText={handleSearchTextChange}
                    />

                    {/* Dropdown Container */}
                    {(showOptions && (searchResults.length > 0 || loading)) && (
                        <View style={{ maxHeight: DROPDOWN_MAX_HEIGHT }} className="absolute top-[100%] left-0 right-0 bg-white rounded-b-xl shadow-lg border border-gray-200 z-50 overflow-hidden mt-1">
                            {loading ? (
                                <View className="p-4">
                                    <Text className='text-sm text-gray-500 font-firaregular'>Loading...</Text>
                                </View>
                            ) : (
                                <ScrollView keyboardShouldPersistTaps="handled" nestedScrollEnabled>
                                    {searchResults.map((item) => (
                                        <TouchableOpacity
                                            key={item.place_id}
                                            onPress={() => handleSelectPlace(item)}
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
                            )}
                        </View>
                    )}
                </View>

                {location ? (
                    <View className='mt-12 mb-8 space-y-2'>
                        <Text className='text-xs font-firamedium'>Selected Location</Text>
                        <Text className='text-[#8C8C8C] font-firaregular'>{location}</Text>
                    </View>
                ) : null}

                <View className='mt-auto w-full'>
                    <CustomButton title='Next' handlePress={submit} />
                    <View className='justify-center pt-5 flex-row gap-2'>
                        <TouchableOpacity onPress={onLogOut}>
                            <Text className='text-sm text-black font-firaregular underline'>Log Out</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAwareScrollView>
        </View>
    )
}

export default memo(OnboardLocation)
