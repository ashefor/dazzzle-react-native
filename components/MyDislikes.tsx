import { View, Text, FlatList, ImageBackground, TouchableWithoutFeedback } from 'react-native'
import React, { useState } from 'react'
import images from '@/constants/images'
import { router } from 'expo-router'

const MyDislikes = () => {
    const [users, setUsers] = useState<string[]>(Array.from({ length: 20 }));

    return (
        <View className='bg-[#1A1A1A] h-full'>
            <FlatList
                className='p-1'
                data={users}
                keyExtractor={(item, index) => index.toString()}
                numColumns={2}
                renderItem={
                    ({ item }) => (
                        <TouchableWithoutFeedback onPress={() => router.push('/view-user/56')} className='relative'>
                            <View className='p-2' style={{
                                flex: 1,
                                alignItems: "center",
                                flexDirection: "row",
                            }}>
                                <View className='w-full h-full rounded-xl overflow-hidden'>
                                    <ImageBackground resizeMode='cover' className='h-48 w-full rounded-xl flex-1' source={images.coverPhoto}>
                                        <View className='bg-black/[0.5] h-full flex flex-col justify-end p-4'>
                                            <Text className='text-sm font-firabold text-white'>Michael Ashefor</Text>
                                            <Text className='text-xs font-firamedium text-white'>32, Male</Text>
                                            <Text className='text-xs font-firamedium text-white'>Lagos</Text>
                                        </View>
                                    </ImageBackground>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    )
                }
            />
        </View>

    )
}

export default MyDislikes