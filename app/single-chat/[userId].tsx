import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TouchableOpacity, View, Text, SafeAreaView as SafeAreaViewIOS, Platform, StyleSheet, Image, KeyboardAvoidingView, TextInput, FlatList, } from "react-native"
import { SafeAreaView as SafeAreaViewAndroid } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import ArrowBackIcon from '@/components/icons/ArrowBackIcon';
import { Avatar, XStack, YStack } from 'tamagui';
import { Entypo, Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import axiosRequest from '@/utils/axios';
import { Fragment, useEffect, useState } from 'react';
import { SingleChatResponse, UserConversation } from '@/models/chat';
import SkeletonPlaceholder from '@/components/SkeletonLoader';
import React from 'react';
import * as ImagePicker from 'expo-image-picker';
import { CONNECTION_STATE_HEIGHT, INPUT_MAX_HEIGHT } from '@/constants/constants';
import { ReactionCodes } from '@/models/general';
import { Loader } from '@/components/loader/LoaderWrapper';


const SafeArea = Platform.OS === 'ios' ? SafeAreaViewIOS : SafeAreaViewAndroid;

const KEYBOARD_AVOID_BEHAVIOR = Platform.select({ ios: 'padding' as const, default: undefined });

const ViewSingleChat = () => {
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
            setChats(chats);
            setIsLoading(false);
            if (chats.length > 0) {
                setTimeout(() => {
                    flatListRef.current?.scrollToIndex({ index: chats.length - 1 > 0 ? chats.length - 1 : 0, animated: true });
                }, 200);
            }
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

    const acceptOrDeclineMessageRequest = async (message_request_status: '1' | '2') => {
        try {
            const params = {
                message_request_status,
            }
            Loader.show();
            const data: any = await axiosRequest.post(`/messenger/${userId}/process-accept-decline-message-request`, params);
            if (data.reaction === ReactionCodes.SUCCESS) {
                fetchMessages();
            }
            Loader.hide();
        } catch (error) {
            Loader.hide();
        }
    }

    const sendMessage = async () => {
        try {
            if (message.trim() !== '') {
                const params = {
                    type: 1,
                    message,
                    unique_id: getRandomUniqueId(),
                    optionalLoggedInUserId: chatDetails?.userData.optionalLoggedInUserId
                }

                const { data } = await axiosRequest.post(`/messenger/${userId}/send-message`, params);
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
                setTimeout(() => {
                    flatListRef.current?.scrollToIndex({ index: chats.length - 1 > 0 ? chats.length - 1 : 0, animated: true });
                }, 200);
            }
        } catch (error) {

        }
    }

    const pickImage = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                allowsMultipleSelection: false,
                cameraType: ImagePicker.CameraType.front,
                aspect: [4, 3],
                quality: 1,
                base64: true
            });

            if (!result.canceled) {
                const image = result.assets[0];
                const formData = new FormData();
                formData.append("filepond", {
                    uri: image?.uri,
                    name: 'name' in image ? image.name : image.uri.split("/").pop() || "unknown.jpg",
                    type: image?.mimeType || "image/jpeg",
                } as any);
                formData.append("unique_id", getRandomUniqueId());
                formData.append("optionalLoggedInUserId", String(chatDetails?.userData.optionalLoggedInUserId));
                formData.append("type", "2");
                const { data } = await axiosRequest.post(`/messenger/${userId}/send-message`, formData);
                const sentMessage = data.storedData;
                setChats((prevChats) => {
                    return [
                        ...prevChats,
                        sentMessage,
                    ]
                })
                setMessage('');
                setTimeout(() => {
                    flatListRef.current?.scrollToIndex({ index: chats.length - 1 > 0 ? chats.length - 1 : 0, animated: true });
                }, 200);
            }
        } catch (error) {
            console.error('Error picking image:', error);
        }
    };


    return (
        <View style={[
        ]} className="flex-1 bg-primary">
            <View style={{
                flex: 1, marginTop: 0,
                zIndex: 1,
            }}>
                <SafeArea />
                <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
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
                                <Text style={{ backgroundColor: 'transparent' }} className="text-white text-sm font-firamedium">{chatDetails?.userData.full_name || '-'}</Text>
                                <Text className="text-gray-400 text-xs font-firasemibold">{chatDetails?.userData.message_from_username || '-'}</Text>
                            </YStack>
                        </XStack>
                        <View>
                        </View>
                    </View>
                </View>
                {isLoading ? (
                    <ChatLoaders />
                ) : (
                    <FlatList
                        ref={flatListRef}
                        className='bg-primary p-4'
                        contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
                        data={chats}
                        keyExtractor={(item, index) => index.toString()}
                        ItemSeparatorComponent={() => <View className='h-2' />}
                        ListEmptyComponent={() => <View className="mt-6 items-center justify-center p-4 bg-gray-300 rounded-lg">
                            <Text className=" text-sm font-firamedium">No messages yet</Text>
                        </View>}
                        renderItem={({ item }) =>
                            <View className={` items-end gap-x-1 ${item.is_message_received ? 'flex-row' : 'flex-row-reverse'}`}>
                                <View className={` rounded-lg w-fit max-w-[70%] self-start p-3 ${item.is_message_received ? 'items-start rounded-bl-none bg-white' : 'items-end rounded-br-none bg-[#242124]'}`}>
                                    {item.type == '1' ? <Text className={`text-sm font-firaregular ${item.is_message_received ? 'text-black' : 'text-white'}`}>{item.message}</Text> : <Image className='w-40 h-40 rounded-lg' source={{ uri: item.message }} />}
                                    <Text className={`text-[8px] font-firaregular ${item.is_message_received ? 'text-black' : 'text-white'}`}>{item.created_on}</Text>
                                </View>
                            </View>}
                    />
                )}
            </View>

            {!isLoading && <Fragment>
                {chatDetails ? <Fragment>
                    {(chatDetails.userData.messageRequestStatus === 'MESSAGE_REQUEST_ACCEPTED' || chatDetails.userData.messageRequestStatus === 'SEND_NEW_MESSAGE' || chatDetails.userData.messageRequestStatus === 'MESSAGE_REQUEST_SENT') && <SendInput message={message} setMessage={setMessage} pickImage={pickImage} sendMessage={sendMessage} />}
                    {chatDetails.userData.messageRequestStatus === 'MESSAGE_REQUEST_RECEIVED' && <ActionComponent acceptOrDeclineMessageRequest={(status) => acceptOrDeclineMessageRequest(status)} full_name={chatDetails.userData.full_name} showDeclineButton />}
                    {chatDetails.userData.messageRequestStatus === 'MESSAGE_REQUEST_DECLINE_BY_USER' && <View className='bg-red-500 p-3 justify-center items-center rounded-md m-4'>
                        <Text className='text-white text-sm'> {chatDetails.userData.full_name} declined your request</Text>
                        </View>}
                        {chatDetails.userData.messageRequestStatus === 'MESSAGE_REQUEST_DECLINE' && <ActionComponent acceptOrDeclineMessageRequest={(status) => acceptOrDeclineMessageRequest(status)} />}
                </Fragment> : null}
                </Fragment>}

                <SafeArea />
        </View>
    )
}

const SendInput = ({ message, setMessage, pickImage, sendMessage }: { message: string, setMessage: (message: string) => void, pickImage: () => void, sendMessage: () => void }) => {
    const height = 10;
    const { bottom } = useSafeAreaInsets();
    return (
        <KeyboardAvoidingView keyboardVerticalOffset={-bottom + height + CONNECTION_STATE_HEIGHT} behavior={KEYBOARD_AVOID_BEHAVIOR}>
            <View style={{
                width: '100%',
                borderTopWidth: 0.2,
                borderColor: '#f2f2f2',
            }}>
                <View style={{ flexShrink: 1, flexDirection: "row" }} className="items-center gap-x-3 px-4 py-3">
                    <View style={{ flex: 1, flexDirection: "row" }} className=" items-center bg-[#242124] rounded-[20px] h-[40px] px-3 py-1">
                        {/* <TouchableOpacity onPress={() => setIsEmojiPickerOpen(true)} className="rounded-md  items-center justify-center">
                                    <MaterialIcons name="emoji-emotions" size={24} color="white" />
                                </TouchableOpacity> */}
                        <TextInput value={message} onChangeText={setMessage} placeholderTextColor={'#A1A1A1'} multiline style={{ flex: 1, maxHeight: INPUT_MAX_HEIGHT, alignSelf: 'center' }}
                            className="text-sm h-full mx-3 items-center text-white" placeholder="Type a message" />
                    </View>
                    <View style={{ flexDirection: "row" }} className="items-center">
                        <TouchableOpacity onPress={pickImage} className="mr-5 items-center justify-center">
                            {/* <Feather name="plus-circle" size={24} color="white" /> */}
                            <Entypo name="attachment" size={24} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={sendMessage} className="items-center justify-center">
                            <Ionicons name="send" size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    )
}

const ActionComponent = ({full_name, showDeclineButton, acceptOrDeclineMessageRequest }: { acceptOrDeclineMessageRequest: (status: '1' | '2') => void, showDeclineButton?: boolean, full_name?: string, }) => {
    return (
       <View className='p-4'>
        {full_name && <Text className='text-white text-base text-center'> {full_name} wants to send you a message</Text>}
         <View className='flex-row justify-between items-center space-x-3 mt-2'>
                     {showDeclineButton && <TouchableOpacity onPress={() => acceptOrDeclineMessageRequest('2')} className='bg-red-500 flex-1 p-3 justify-center items-center rounded-md'>
                        <Text className='text-white'>Reject</Text>
                    </TouchableOpacity>}
                    <TouchableOpacity onPress={() => acceptOrDeclineMessageRequest('1')} className=' bg-[#DD3FE5] flex-1 p-3 justify-center items-center rounded-md'>
                        <Text className='text-white'>Accept</Text>
                    </TouchableOpacity>
                        </View>
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