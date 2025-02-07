import { View, Text, ScrollView, FlatList, ImageBackground, TouchableWithoutFeedback, TouchableOpacity, useWindowDimensions } from 'react-native'
import React, { useState } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons'
import images from '@/constants/images'
import { AlertDialog, YStack, XStack, Button } from 'tamagui'
import { router } from 'expo-router'

const UnlikeUserButton = () => {
    return (
        <View className='absolute top-4 right-4 z-10'>
            <AlertDialog native>
                <AlertDialog.Trigger asChild>
                    <TouchableOpacity className='p-2 bg-white rounded-full'>
                        <Ionicons name="heart" size={20} color="red" />
                    </TouchableOpacity>
                </AlertDialog.Trigger>

                <AlertDialog.Portal>
                    <AlertDialog.Overlay
                        key="overlay"
                        animation="quick"
                        opacity={0.5}
                        enterStyle={{ opacity: 0 }}
                        exitStyle={{ opacity: 0 }}
                    />
                    <AlertDialog.Content
                        elevate
                        key="content"
                        animation={[
                            'quick',
                            {
                                opacity: {
                                    overshootClamping: true,
                                },
                            },
                        ]}
                        enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
                        exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
                        x={0}
                        scale={1}
                        opacity={1}
                        y={0}
                    >
                        <YStack space>
                            <AlertDialog.Title>Unlike User?</AlertDialog.Title>
                            <AlertDialog.Description>
                                Are you sure you want to unlike this user?
                            </AlertDialog.Description>

                            <XStack gap="$3" justifyContent="flex-end">
                                <AlertDialog.Cancel asChild>
                                    <Button>Cancel</Button>
                                </AlertDialog.Cancel>
                                <AlertDialog.Action asChild>
                                    <Button theme="active">Accept</Button>
                                </AlertDialog.Action>
                            </XStack>
                        </YStack>
                    </AlertDialog.Content>
                </AlertDialog.Portal>

            </AlertDialog>
        </View>
    )
}
const MyLikes = () => {
    const { width } = useWindowDimensions();
    const numColumns = width > 600 ? 3 : width > 991 ? 4 : 2;
    const [blockedUsers, setblockedUsers] = useState<string[]>(Array.from({ length: 19 }));

    const chunkArray = (array: string | any[], size: number) => {
        let result = [];
        for (let i = 0; i < array.length; i += size) {
          result.push(array.slice(i, i + size));
        }
        return result;
      };
    return (
        <View className='bg-[#1A1A1A] h-full'>
            <FlatList
                className='p-1'
                data={blockedUsers}
                keyExtractor={(item, index) => index.toString()}
                numColumns={width > 600 ? 3 : width > 991 ? 4 : 2}
                // columnWrapperStyle={{ justifyContent: 'flex-start' }}
                renderItem={
                    ({ item }) => (
                        <TouchableWithoutFeedback onPress={() => router.push('/view-user/56')} className='relative'>
                            <View className='p-2' style={{
                                flex: 1/numColumns,
                                flexDirection: "row",
                            }}>
                                <UnlikeUserButton />
                                <View className='w-full h-full rounded-xl overflow-hidden'>
                                    <ImageBackground resizeMode='cover' className='h-52 w-full rounded-xl flex-1' source={images.coverPhoto}>
                                        <View className='bg-black/[0.5] h-full flex flex-col justify-end p-4'>
                                            <Text className='text-sm font-firabold text-white'>Michael Ashefor</Text>
                                            <Text className='text-xs font-firamedium text-white'>32, + Male {768}</Text>
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

export default MyLikes