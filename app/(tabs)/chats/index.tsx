import SkeletonPlaceholder from "@/components/SkeletonLoader";
import { ChatsResponse, MessengerUser } from "@/models/chat";
import axiosRequest from "@/utils/axios";
import { router, useFocusEffect } from "expo-router";
import { Fragment, useCallback, useEffect, useState } from "react"
import { FlatList, Text, TouchableOpacity, View } from "react-native"
import { Avatar, XStack, YStack } from "tamagui";

const Chats = () => {
    const [chats, setChats] = useState<MessengerUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchChats = async () => {
        try {
            setIsLoading(true);
            const { data }: { data: ChatsResponse } = await axiosRequest.get('/messenger/get-user-conversations');
            setChats(data.messengerUsers);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching chats:', error);
            setIsLoading(false);
        }
    };

    // useEffect(() => {
    //     fetchChats();
    // }, [])

    useFocusEffect(
        // Callback should be wrapped in `React.useCallback` to avoid running the effect too often.
        useCallback(() => {
            // Invoked whenever the route is focused.
            fetchChats();

            // Return function is invoked whenever the route gets out of focus.
            return () => {
                console.log('This route is now unfocused.');
            };
        }, [])
    )

    return (
        <Fragment>
            {isLoading ? <ChatLoaders /> : (
                <FlatList
                    className="bg-[#1A1A1A]"
                    contentContainerStyle={{ paddingBottom: 100, padding: 20 }}
                    data={chats}
                    keyExtractor={(item, index) => item.user_id.toString()}
                ItemSeparatorComponent={() => <View className='h-6' />}
                    ListEmptyComponent={() => <View className="flex-1 items-center justify-center p-4 bg-gray-300 rounded-lg">
                        <Text className=" text-sm font-firamedium">No messages yet</Text>
                    </View>}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => router.push(`/chats/${item.user_id}`)}>
                            <XStack alignItems="center" gap="$4">
                                <Avatar gap="$2" circular size="$5">
                                    <Avatar.Image
                                        accessibilityLabel={item.user_full_name}
                                        source={{ uri: item.profile_picture }}
                                    />
                                    <Avatar.Fallback delayMs={600} backgroundColor="$black12" />
                                </Avatar>
                                <YStack>
                                    <Text className="text-white text-sm font-firamedium">{item.user_full_name} <Text className="text-gray-400 text-xs font-firasemibold">{item.username}</Text></Text>
                                    {/* <Text className="text-gray-400 text-xs font-firasemibold">{item.username}</Text> */}
                                    <XStack gap="$2">
                                        <Text className="text-white text-[10px]">Last seen:</Text>
                                        <Text className="text-gray-300 text-[10px]">{item.last_seen_at_time_ago_format}</Text>
                                    </XStack>
                                </YStack>
                            </XStack>
                        </TouchableOpacity>
                    )}
                />
            )}
        </Fragment>
    )
}


const ChatLoaders = () => {
    return (
        <View className="flex-1 space-y-1 p-4">
            <View style={{ minHeight: 44 }} className="py-2 flex flex-row gap-4 items-center">
                <View className="rounded-full h-14 w-14 flex items-center justify-center">
                    <SkeletonPlaceholder style={{ height: '100%', width: '100%', borderRadius: 50 }} />
                </View>
                <View className="flex-1 space-y-1">
                    <SkeletonPlaceholder style={{ height: 8, width: '40%' }} />
                    <SkeletonPlaceholder style={{ height: 10, width: '70%' }} />
                <SkeletonPlaceholder style={{ height: 5, width: '10%' }} />
                </View>
            </View>
            <View style={{ minHeight: 44 }} className="py-2 flex flex-row gap-4 items-center">
                <View className="rounded-full h-14 w-14 flex items-center justify-center">
                    <SkeletonPlaceholder style={{ height: '100%', width: '100%', borderRadius: 50 }} />
                </View>
                <View className="flex-1 space-y-1">
                    <SkeletonPlaceholder style={{ height: 8, width: '40%' }} />
                    <SkeletonPlaceholder style={{ height: 10, width: '70%' }} />
                <SkeletonPlaceholder style={{ height: 5, width: '10%' }} />
                </View>
            </View>
            <View style={{ minHeight: 44 }} className="py-2 flex flex-row gap-4 items-center">
                <View className="rounded-full h-14 w-14 flex items-center justify-center">
                    <SkeletonPlaceholder style={{ height: '100%', width: '100%', borderRadius: 50 }} />
                </View>
                <View className="flex-1 space-y-1">
                    <SkeletonPlaceholder style={{ height: 8, width: '40%' }} />
                    <SkeletonPlaceholder style={{ height: 10, width: '70%' }} />
                <SkeletonPlaceholder style={{ height: 5, width: '10%' }} />
                </View>
            </View>
            <View style={{ minHeight: 44 }} className="py-2 flex flex-row gap-4 items-center">
                <View className="rounded-full h-14 w-14 flex items-center justify-center">
                    <SkeletonPlaceholder style={{ height: '100%', width: '100%', borderRadius: 50 }} />
                </View>
                <View className="flex-1 space-y-1">
                    <SkeletonPlaceholder style={{ height: 8, width: '40%' }} />
                    <SkeletonPlaceholder style={{ height: 10, width: '70%' }} />
                <SkeletonPlaceholder style={{ height: 5, width: '10%' }} />
                </View>
            </View>
            <View style={{ minHeight: 44 }} className="py-2 flex flex-row gap-4 items-center">
                <View className="rounded-full h-14 w-14 flex items-center justify-center">
                    <SkeletonPlaceholder style={{ height: '100%', width: '100%', borderRadius: 50 }} />
                </View>
                <View className="flex-1 space-y-1">
                    <SkeletonPlaceholder style={{ height: 8, width: '40%' }} />
                    <SkeletonPlaceholder style={{ height: 10, width: '70%' }} />
                <SkeletonPlaceholder style={{ height: 5, width: '10%' }} />
                </View>
            </View>
        </View>
    )
}

export default Chats