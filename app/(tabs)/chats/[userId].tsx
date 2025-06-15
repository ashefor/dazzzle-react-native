import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TouchableOpacity, View, Text, SafeAreaView as SafeAreaViewIOS, Platform, StyleSheet, KeyboardAvoidingView, TextInput, FlatList, } from "react-native"
import { SafeAreaView as SafeAreaViewAndroid } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import ArrowBackIcon from '@/components/icons/ArrowBackIcon';
import { Avatar, XStack, YStack } from 'tamagui';
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import axiosRequest from '@/utils/axios';
import { useEffect, useState } from 'react';
import {  SingleChatResponse, UserConversation } from '@/models/chat';
import SkeletonPlaceholder from '@/components/SkeletonLoader';
import React from 'react';


const SafeArea = Platform.OS === 'ios' ? SafeAreaViewIOS : SafeAreaViewAndroid;
export const INPUT_MAX_HEIGHT = 80;
export const CONNECTION_STATE_HEIGHT = 24;
const KEYBOARD_AVOID_BEHAVIOR = Platform.select({ ios: 'padding' as const, default: undefined });

const ViewSingleChat = () => {
    const height = 10;
    const { bottom } = useSafeAreaInsets();
    const { userId } = useLocalSearchParams();
    const [chatDetails, setChatDetails] = useState<SingleChatResponse>();
    const [chats, setChats] = useState<UserConversation[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<string>('');

    const flatListRef = React.useRef<FlatList>(null);

    const fetchMessages = async () => {
        try {
            setIsLoading(true);
            const { data }: { data: SingleChatResponse } = await axiosRequest.get(`/messenger/${userId}/get-user-messages`);
            setChatDetails(data);
            const chats = data.userConversations;
            console.log('chats', data);
            setChats(chats);
            setIsLoading(false);
            setTimeout(() => {
            flatListRef.current?.scrollToIndex({ index: chats.length - 1, animated: true });
            }, 200);
        } catch (error) {
            setIsLoading(false);
        }
    }

    const getRandomUniqueId = () => {
    const randomId = Math.floor(Math.random() * 1000000).toString();
    return randomId;
  };

    useEffect(() => {
        fetchMessages();
    }, [])

    const sendMessage = async() => {
        try {
            if (message.trim() !== '') {
                const params = {
                type: 1,
                message,
                unique_id: getRandomUniqueId(),
                optionalLoggedInUserId: chatDetails?.userData.optionalLoggedInUserId
            }

            const {data} = await axiosRequest.post(`/messenger/${userId}/send-message`, params);
            const sentMessage = data.storedData;
            // setChatDetails((prevChatDetails) => {
            //     return {
            //         ...prevChatDetails!,
            //         userConversations: [...prevChatDetails!.userConversations, sentMessage]
            //     }
            // })
            setChats((prevChats) => {
                return [
                    ...prevChats,
                    sentMessage,
                ]
            })
            setMessage('');
            }
        } catch (error) {
            
        }
    }



    return (
        <View style={[
            //   {
            //     paddingTop: Platform.OS == 'android' ? insets.top : 0,
            //     paddingBottom: insets.bottom,
            //   },
        ]} className="flex-1 bg-primary">
            <View style={{
                flex: 1, marginTop: 0,
                zIndex: 1,
            }}>
                <SafeArea />
                <View style={{ paddingHorizontal: 16, }}>
                    <View style={[styles.header]}>
                        <View style={{ zIndex: 99 }}>
                            <TouchableOpacity onPress={() => router.back()} className='flex justify-center w-7 h-7' style={{ zIndex: 99 }}>
                                <ArrowBackIcon />
                            </TouchableOpacity>
                        </View>
                        <XStack alignItems="center" gap="$4">
                            <Avatar gap="$2" circular size="$4">
                                <Avatar.Image
                                accessibilityLabel={chatDetails?.userData.full_name}
                                source={{ uri: chatDetails?.userData.profile_picture_image }}
                                />
                                <Avatar.Fallback delayMs={600} backgroundColor="$black12" />
                            </Avatar>
                            <YStack>
                                <Text style={{backgroundColor: 'transparent'}} className="text-white text-sm font-firamedium">{chatDetails?.userData.full_name || '-'}</Text>
                                <Text className="text-gray-400 text-xs font-firasemibold">{chatDetails?.userData.message_from_username || '-'}</Text>
                            </YStack>
                        </XStack>
                        <View>
                        </View>
                    </View>
                </View>
                {isLoading ? (
                    <ChatLoaders/>
                ) : (
                    <FlatList
                    ref={flatListRef}
                className='bg-primary p-4'  
                contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
                data={chats}
                keyExtractor={(item, index) => index.toString()}
                ItemSeparatorComponent={() => <View className='h-2' />}
                ListEmptyComponent={() => <View className=" items-center justify-center p-4 bg-gray-300 rounded-lg">
                        <Text className=" text-sm font-firamedium">No messages yet</Text>
                    </View>}
                renderItem={({ item }) => 
                <View className={` items-end gap-x-1 ${item.is_message_received ? 'flex-row' : 'flex-row-reverse'}`}>
                    <View className={` rounded-lg w-fit max-w-[70%] self-start p-3 ${item.is_message_received ? 'items-start rounded-bl-none bg-white' : 'items-end rounded-br-none bg-[#242124]'}`}>
                        <Text className={`text-sm font-firaregular ${item.is_message_received ? 'text-black' : 'text-white'}`}>{item.message}</Text>
                        <Text className={`text-[8px] font-firaregular ${item.is_message_received ? 'text-black' : 'text-white'}`}>{item.created_on}</Text>
                    </View>
                    </View>}
                /> 
                )}
                {/* <FlatList
                className='bg-primary p-4'  
                contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
                data={chats}
                keyExtractor={(item, index) => index.toString()}
                ItemSeparatorComponent={() => <View className='h-2' />}
                renderItem={({ item }) => 
                <View className={` items-end gap-x-1 ${item.is_message_received ? 'flex-row' : 'flex-row-reverse'}`}>
                    <View className={` rounded-lg w-fit max-w-[70%] self-start p-3 ${item.is_message_received ? 'items-start rounded-bl-none bg-white' : 'items-end rounded-br-none bg-[#242124]'}`}>
                        <Text className={`text-sm font-firaregular ${item.is_message_received ? 'text-black' : 'text-white'}`}>{item.message}</Text>
                        <Text className={`text-[8px] font-firaregular ${item.is_message_received ? 'text-black' : 'text-white'}`}>{item.created_on}</Text>
                    </View>
                    </View>}
                /> */}
            </View>

            {!isLoading && (
                <KeyboardAvoidingView keyboardVerticalOffset={-bottom + height + CONNECTION_STATE_HEIGHT} behavior={KEYBOARD_AVOID_BEHAVIOR}>
                <View style={{
                    width: '100%',
                    borderTopWidth: 0.2,
                    borderColor: '#f2f2f2',
                }}>
                    <View style={{ flexShrink: 1, flexDirection: "row" }} className="items-center gap-x-3 px-4 py-3">
                        <View style={{ flex: 1, flexDirection: "row" }} className=" items-center bg-[#242124] rounded-[20px] h-[40px] px-3 py-1">
                            <TouchableOpacity className="rounded-md  items-center justify-center">
                                <MaterialIcons name="emoji-emotions" size={24} color="white" />
                            </TouchableOpacity>
                            <TextInput value={message} onChangeText={setMessage} placeholderTextColor={'#A1A1A1'} multiline style={{ flex: 1, maxHeight: INPUT_MAX_HEIGHT, alignSelf: 'center' }}
                                className="text-sm h-full mx-3 items-center text-white" placeholder="Type a message" />
                        </View>
                        <View style={{ flexDirection: "row" }} className="items-center">
                            <TouchableOpacity className="mr-5 items-center justify-center">
                                <Feather name="plus-circle" size={24} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={sendMessage} className="items-center justify-center">
                                <Ionicons name="send" size={24} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>
                {/* <View style={{ height: bottom }} /> */}
            </KeyboardAvoidingView>
            )}
        </View>
    )
}

const ChatLoaders = () => {
    return (
         <View className="flex-1 space-y-1 p-4">
                    <SkeletonPlaceholder style={{ height: 40, width: '40%', borderTopLeftRadius: 10, borderTopRightRadius: 10, borderBottomLeftRadius: 0, borderBottomRightRadius: 10 }} />
                    <SkeletonPlaceholder style={{ height: 40, marginLeft: 'auto', width: '40%', borderTopLeftRadius: 10, borderTopRightRadius: 10, borderBottomLeftRadius: 10, borderBottomRightRadius: 0 }} />
                    <SkeletonPlaceholder style={{ height: 40, width: '40%', borderTopLeftRadius: 10, borderTopRightRadius: 10, borderBottomLeftRadius: 0, borderBottomRightRadius: 10 }} />
                    <SkeletonPlaceholder style={{ height: 40, marginLeft: 'auto', width: '40%', borderTopLeftRadius: 10, borderTopRightRadius: 10, borderBottomLeftRadius: 10, borderBottomRightRadius: 0 }} />
                    <SkeletonPlaceholder style={{ height: 40, width: '40%', borderTopLeftRadius: 10, borderTopRightRadius: 10, borderBottomLeftRadius: 0, borderBottomRightRadius: 10 }} />
                    <SkeletonPlaceholder style={{ height: 40, marginLeft: 'auto', width: '40%', borderTopLeftRadius: 10, borderTopRightRadius: 10, borderBottomLeftRadius: 10, borderBottomRightRadius: 0 }} />
                    <SkeletonPlaceholder style={{ height: 40, width: '40%', borderTopLeftRadius: 10, borderTopRightRadius: 10, borderBottomLeftRadius: 0, borderBottomRightRadius: 10 }} />
                    <SkeletonPlaceholder style={{ height: 40, marginLeft: 'auto', width: '40%', borderTopLeftRadius: 10, borderTopRightRadius: 10, borderBottomLeftRadius: 10, borderBottomRightRadius: 0 }} />
                </View>
    )
}

const styles = StyleSheet.create({
    header: {
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center',
        // height: Platform.OS === 'android' ? 97 : 'auto',
        // height: 97,
        // paddingHorizontal: 16,
        // paddingVertical: 10,
        minHeight: 44,
        backgroundColor: 'transparent',
        borderBottomWidth: 0,
        borderBottomColor: '#ddd',
        width: '100%',
        overflow: 'hidden',
    },
})

export default ViewSingleChat