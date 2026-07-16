import { Alert, StyleSheet, Text, TouchableOpacity, View, Pressable, ScrollView } from 'react-native'
import React, { memo, useCallback, useState } from 'react'
import { Image } from 'expo-image'
import Images from '@/constants/images'
import CustomButton from '@/components/CustomButton'
import { ReactionCodes } from '@/models/general'
import Toast from '@/components/toast/toast'
import { useLoader } from '@/context/loader/LoaderProvider'
import axiosRequest from '@/utils/axios'
import { OnboardPagesProps } from '.'

const RELATIONSHIP_OPTIONS = [
    { id: '1', label: 'Fun\n&\nFriendship', image: Images.relType1 },
    { id: '2', label: 'Serious\nRelationship', image: Images.relType2 },
    { id: '3', label: 'Male\nFriends', image: Images.relType3 },
    { id: '4', label: 'Female\nFriends', image: Images.relType4 },
    { id: '5', label: 'Marriage Only', image: Images.relType5 },
    { id: '6', label: 'Flirting Only', image: Images.relType6 },
];

const OnboardRelationshipType: React.FC<OnboardPagesProps> = ({ goToNextPage, onLogOut }) => {
    const { show, hide } = useLoader();
    const [selectedRelationshipTypes, setSelectedRelationshipTypes] = useState<string[]>([]);

    const submit = useCallback(async () => {
        try {
            show();
            const data: any = await axiosRequest.post('/user-process-relationship-type-update-profile', { relationship_type: selectedRelationshipTypes });
            hide();
            if (data.reaction === ReactionCodes.SUCCESS) {
                Toast.success('Profile updated successfully');
                goToNextPage?.();
            }
        } catch (error: any) {
            hide();
            Alert.alert('Error', error.errorMessage ? error.errorMessage : 'Failed to update')
        }
    }, [selectedRelationshipTypes, show, hide, goToNextPage]);

    const chooseRelationshipType = useCallback((type: string) => {
        setSelectedRelationshipTypes((current) =>
            current.includes(type) ? current.filter((item) => item !== type) : [...current, type]
        );
    }, []);

    return (
        <View className='w-full h-full flex-1 space-y-4'>
            <View className='px-4 pb-2'>
                <Text className='text-2xl text-black font-firabold'>Relationship Type</Text>
                <Text className='text-sm text-[#8C8C8C] font-firaregular'>Join our community and experience seamlessness finding a soulmate. </Text>
            </View>
            <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 16, paddingBottom: 20, justifyContent: 'space-between' }} >
                {selectedRelationshipTypes.length < 1 && <Text className='text-xs text-red-500 text-center font-firaregular mb-2'>Choose at least one relationship type</Text>}
                <View className='flex-wrap mb-6 flex-row gap-y-4 justify-between'>
                    {RELATIONSHIP_OPTIONS.map((item) => {
                        const isSelected = selectedRelationshipTypes.includes(item.id);

                        return (
                            <Pressable
                                key={item.id}
                                onPress={() => chooseRelationshipType(item.id)}
                                className={`h-52 w-[48%] border rounded-[24px] p-4 flex flex-col items-center justify-center
                        ${isSelected ? 'bg-primary border-primary' : 'border-black bg-white'}`}
                            >
                                <Image
                                    source={item.image}
                                    style={styles.optionImage}
                                    contentFit="cover"
                                />
                                <Text className='text-base text-black font-firasemibold mt-2 text-center'>
                                    {item.label}
                                </Text>
                            </Pressable>
                        );
                    })}
                </View>

                <View>
                    <CustomButton disabled={selectedRelationshipTypes.length === 0} title='Next' handlePress={submit} />
                    <View className='justify-center pt-5 flex-row gap-2'>
                        <TouchableOpacity onPress={onLogOut}>
                            <Text className='text-sm text-black font-firaregular underline'>Log Out</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

export default memo(OnboardRelationshipType)

const styles = StyleSheet.create({
    optionImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 16,
    },
})
