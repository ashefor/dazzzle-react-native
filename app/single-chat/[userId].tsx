// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { TouchableOpacity, View, Text, Platform, StyleSheet, Image, KeyboardAvoidingView, TextInput, FlatList, } from "react-native";
// import { router, useLocalSearchParams } from "expo-router";
// import ArrowBackIcon from '@/components/icons/ArrowBackIcon';
// import { Avatar, XStack, YStack } from 'tamagui';
// import { Entypo, Ionicons } from '@expo/vector-icons';
// import axiosRequest from '@/utils/axios';
// import { Fragment, useEffect, useState } from 'react';
// import { SingleChatResponse, UserConversation } from '@/models/chat';
// import SkeletonPlaceholder from '@/components/SkeletonLoader';
// import React from 'react';
// import * as ImagePicker from 'expo-image-picker';
// import { CONNECTION_STATE_HEIGHT, INPUT_MAX_HEIGHT } from '@/constants/constants';
// import { ReactionCodes } from '@/models/general';
// import { useLoader } from '@/context/loader/LoaderProvider';

// const KEYBOARD_AVOID_BEHAVIOR = Platform.select({ ios: 'padding' as const, default: undefined });

// const ViewSingleChat = () => {
//     const { userId } = useLocalSearchParams();
//     console.log('userId:', userId);
//     const { show, hide } = useLoader();
//     const [chatDetails, setChatDetails] = useState<SingleChatResponse>();
//     const [chats, setChats] = useState<UserConversation[]>([]);
//     const [isLoading, setIsLoading] = useState(false);
//     const [message, setMessage] = useState<string>('');
//     const flatListRef = React.useRef<FlatList>(null);
//     const insets = useSafeAreaInsets();

//     const fetchMessages = async () => {
//         try {
//             setIsLoading(true);
//             const { data }: { data: SingleChatResponse } = await axiosRequest.get(`/messenger/${userId}/get-user-messages`);
//             setChatDetails(data);
//             const chats = data.userConversations;
//             setChats(chats);
//             setIsLoading(false);
//             if (chats.length > 0) {
//                 setTimeout(() => {
//                     flatListRef.current?.scrollToIndex({ index: chats.length - 1 > 0 ? chats.length - 1 : 0, animated: true });
//                 }, 200);
//             }
//         } catch (error) {
//             setIsLoading(false);
//         }
//     }

//     const getRandomUniqueId = () => {
//         const randomId = Math.floor(Math.random() * 1000000).toString();
//         return randomId;
//     };

//     useEffect(() => {
//         fetchMessages();
//     }, [])

//     const acceptOrDeclineMessageRequest = async (message_request_status: '1' | '2') => {
//         try {
//             const params = {
//                 message_request_status,
//             }
//             show();
//             const data: any = await axiosRequest.post(`/messenger/${userId}/process-accept-decline-message-request`, params);
//             if (data.reaction === ReactionCodes.SUCCESS) {
//                 fetchMessages();
//             }
//             hide();
//         } catch (error) {
//             hide();
//         }
//     }

//     const sendMessage = async () => {
//         try {
//             if (message.trim() !== '') {
//                 const params = {
//                     type: 1,
//                     message,
//                     unique_id: getRandomUniqueId(),
//                     optionalLoggedInUserId: chatDetails?.userData.optionalLoggedInUserId
//                 }

//                 const { data } = await axiosRequest.post(`/messenger/${userId}/send-message`, params);
//                 const sentMessage = data.storedData;
//                 // setChatDetails((prevChatDetails) => {
//                 //     return {
//                 //         ...prevChatDetails!,
//                 //         userConversations: [...prevChatDetails!.userConversations, sentMessage]
//                 //     }
//                 // })
//                 setChats((prevChats) => {
//                     return [
//                         ...prevChats,
//                         sentMessage,
//                     ]
//                 })
//                 setMessage('');
//                 if (chats.length > 0) {
//                     setTimeout(() => {
//                         flatListRef.current?.scrollToIndex({ index: chats.length - 1 > 0 ? chats.length - 1 : 0, animated: true });
//                     }, 200);
//                 }
//             }
//         } catch (error) {

//         }
//     }

//     const pickImage = async () => {
//         try {
//             let result = await ImagePicker.launchImageLibraryAsync({
//                 mediaTypes: ['images'],
//                 allowsEditing: true,
//                 allowsMultipleSelection: false,
//                 cameraType: ImagePicker.CameraType.front,
//                 aspect: [4, 3],
//                 quality: 1,
//                 base64: true
//             });

//             if (!result.canceled) {
//                 const image = result.assets[0];
//                 const formData = new FormData();
//                 formData.append("filepond", {
//                     uri: image?.uri,
//                     name: 'name' in image ? image.name : image.uri.split("/").pop() || "unknown.jpg",
//                     type: image?.mimeType || "image/jpeg",
//                 } as any);
//                 formData.append("unique_id", getRandomUniqueId());
//                 formData.append("optionalLoggedInUserId", String(chatDetails?.userData.optionalLoggedInUserId));
//                 formData.append("type", "2");
//                 const { data } = await axiosRequest.post(`/messenger/${userId}/send-message`, formData);
//                 const sentMessage = data.storedData;
//                 setChats((prevChats) => {
//                     return [
//                         ...prevChats,
//                         sentMessage,
//                     ]
//                 })
//                 setMessage('');
//                 if (chats.length > 0) {
//                     setTimeout(() => {
//                         flatListRef.current?.scrollToIndex({ index: chats.length - 1 > 0 ? chats.length - 1 : 0, animated: true });
//                     }, 200);
//                 }
//             }
//         } catch (error) {
//             console.error('Error picking image:', error);
//         }
//     };


//     return (
//         <View style={[
//         ]} className="flex-1 bg-primary">
//             <View style={{
//                 flex: 1, marginTop: 0,
//                 zIndex: 1,
//             }}>
//                 <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
//                     <View style={[styles.header, { paddingTop: insets.top }]}>
//                         <View style={{ zIndex: 99 }}>
//                             <TouchableOpacity onPress={() => router.back()} className='flex justify-center w-7 h-7' style={{ zIndex: 99 }}>
//                                 <ArrowBackIcon />
//                             </TouchableOpacity>
//                         </View>
//                         <XStack alignItems="center" gap="$4">
//                             <Avatar gap="$2" circular size="$4">
//                                 <Avatar.Image
//                                     accessibilityLabel={chatDetails?.userData.full_name}
//                                     source={{ uri: chatDetails?.userData.profile_picture_image }}
//                                 />
//                                 <Avatar.Fallback delayMs={600} backgroundColor="$black12" />
//                             </Avatar>
//                             <YStack>
//                                 <Text style={{ backgroundColor: 'transparent' }} className="text-white text-sm font-firamedium">{chatDetails?.userData.full_name || '-'}</Text>
//                                 <Text className="text-gray-400 text-xs font-firasemibold">{chatDetails?.userData.message_from_username || '-'}</Text>
//                             </YStack>
//                         </XStack>
//                         <View>
//                         </View>
//                     </View>
//                 </View>
//                 {isLoading ? (
//                     <ChatLoaders />
//                 ) : (
//                     <FlatList
//                         ref={flatListRef}
//                         className='bg-primary p-4'
//                         contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
//                         data={chats}
//                         keyExtractor={(item, index) => index.toString()}
//                         ItemSeparatorComponent={() => <View className='h-2' />}
//                         ListEmptyComponent={() => <View className="mt-6 items-center justify-center p-4 bg-gray-300 rounded-lg">
//                             <Text className=" text-sm font-firamedium">No messages yet</Text>
//                         </View>}
//                         renderItem={({ item }) =>
//                             <View className={` items-end gap-x-1 ${item.is_message_received ? 'flex-row' : 'flex-row-reverse'}`}>
//                                 <View className={` rounded-lg w-fit max-w-[70%] self-start p-3 ${item.is_message_received ? 'items-start rounded-bl-none bg-white' : 'items-end rounded-br-none bg-[#242124]'}`}>
//                                     {item.type == '1' ? <Text className={`text-sm font-firaregular ${item.is_message_received ? 'text-black' : 'text-white'}`}>{item.message}</Text> : <Image className='w-40 h-40 rounded-lg' source={{ uri: item.message }} />}
//                                     <Text className={`text-[8px] font-firaregular ${item.is_message_received ? 'text-black' : 'text-white'}`}>{item.created_on}</Text>
//                                 </View>
//                             </View>}
//                     />
//                 )}
//             </View>

//             {!isLoading && <Fragment>
//                 {chatDetails ? <Fragment>
//                     {(chatDetails.userData.messageRequestStatus === 'MESSAGE_REQUEST_ACCEPTED' || chatDetails.userData.messageRequestStatus === 'SEND_NEW_MESSAGE' || chatDetails.userData.messageRequestStatus === 'MESSAGE_REQUEST_SENT') && <SendInput message={message} setMessage={setMessage} pickImage={pickImage} sendMessage={sendMessage} />}
//                     {chatDetails.userData.messageRequestStatus === 'MESSAGE_REQUEST_RECEIVED' && <ActionComponent acceptOrDeclineMessageRequest={(status) => acceptOrDeclineMessageRequest(status)} full_name={chatDetails.userData.full_name} showDeclineButton />}
//                     {chatDetails.userData.messageRequestStatus === 'MESSAGE_REQUEST_DECLINE_BY_USER' && <View style={{ paddingBottom: insets.bottom }} className='bg-red-500 p-3 justify-center items-center rounded-md m-4'>
//                         <Text className='text-white text-sm'> {chatDetails.userData.full_name} declined your request</Text>
//                     </View>}
//                     {chatDetails.userData.messageRequestStatus === 'MESSAGE_REQUEST_DECLINE' && <ActionComponent acceptOrDeclineMessageRequest={(status) => acceptOrDeclineMessageRequest(status)} />}
//                 </Fragment> : null}
//             </Fragment>}

//         </View>
//     )
// }

// const SendInput = ({ message, setMessage, pickImage, sendMessage }: { message: string, setMessage: (message: string) => void, pickImage: () => void, sendMessage: () => void }) => {
//     const height = 10;
//     const { bottom } = useSafeAreaInsets();
//     return (
//         <KeyboardAvoidingView keyboardVerticalOffset={-bottom + height + CONNECTION_STATE_HEIGHT} behavior={KEYBOARD_AVOID_BEHAVIOR}>
//             <View style={{
//                 width: '100%',
//                 borderTopWidth: 0.2,
//                 borderColor: '#f2f2f2',
//                 paddingBottom: bottom
//             }}>
//                 <View style={{ flexShrink: 1, flexDirection: "row" }} className="items-center gap-x-3 px-4 py-3">
//                     <View style={{ flex: 1, flexDirection: "row" }} className=" items-center bg-[#242124] rounded-[20px] h-[48px] px-3 py-1">
//                         {/* <TouchableOpacity onPress={() => setIsEmojiPickerOpen(true)} className="rounded-md  items-center justify-center">
//                                     <MaterialIcons name="emoji-emotions" size={24} color="white" />
//                                 </TouchableOpacity> */}
//                         <TextInput autoCorrect={false} value={message} onChangeText={setMessage} placeholderTextColor={'#A1A1A1'} style={{ flex: 1, maxHeight: INPUT_MAX_HEIGHT, alignSelf: 'center' }}
//                             className="text-sm h-full mx-3 items-center text-white" placeholder="Type a message" />
//                     </View>
//                     <View style={{ flexDirection: "row" }} className="items-center">
//                         <TouchableOpacity onPress={pickImage} className="mr-5 items-center justify-center">
//                             {/* <Feather name="plus-circle" size={24} color="white" /> */}
//                             <Entypo name="attachment" size={24} color="white" />
//                         </TouchableOpacity>
//                         <TouchableOpacity onPress={sendMessage} className="items-center justify-center">
//                             <Ionicons name="send" size={24} color="white" />
//                         </TouchableOpacity>
//                     </View>
//                 </View>
//             </View>
//         </KeyboardAvoidingView>
//     )
// }

// const ActionComponent = ({ full_name, showDeclineButton, acceptOrDeclineMessageRequest }: { acceptOrDeclineMessageRequest: (status: '1' | '2') => void, showDeclineButton?: boolean, full_name?: string, }) => {
//     const { bottom } = useSafeAreaInsets();
//     return (
//         <View style={{ paddingBottom: bottom }}>
//             <View className='p-4'>
//                 {full_name && <Text className='text-white text-base text-center'> {full_name} wants to send you a message</Text>}
//                 <View className='flex-row justify-between items-center space-x-3 mt-2'>
//                     {showDeclineButton && <TouchableOpacity onPress={() => acceptOrDeclineMessageRequest('2')} className='bg-red-500 flex-1 p-3 justify-center items-center rounded-md'>
//                         <Text className='text-white'>Reject</Text>
//                     </TouchableOpacity>}
//                     <TouchableOpacity onPress={() => acceptOrDeclineMessageRequest('1')} className=' bg-[#DD3FE5] flex-1 p-3 justify-center items-center rounded-md'>
//                         <Text className='text-white'>Accept</Text>
//                     </TouchableOpacity>
//                 </View>
//             </View>
//         </View>
//     )
// }

// const ChatLoaders = () => {
//     return (
//         <View className="flex-1 space-y-1 p-4">
//             <SkeletonPlaceholder style={{ height: 40, width: '40%', borderTopLeftRadius: 10, borderTopRightRadius: 10, borderBottomLeftRadius: 0, borderBottomRightRadius: 10 }} />
//             <SkeletonPlaceholder style={{ height: 40, marginLeft: 'auto', width: '40%', borderTopLeftRadius: 10, borderTopRightRadius: 10, borderBottomLeftRadius: 10, borderBottomRightRadius: 0 }} />
//             <SkeletonPlaceholder style={{ height: 40, width: '40%', borderTopLeftRadius: 10, borderTopRightRadius: 10, borderBottomLeftRadius: 0, borderBottomRightRadius: 10 }} />
//             <SkeletonPlaceholder style={{ height: 40, marginLeft: 'auto', width: '40%', borderTopLeftRadius: 10, borderTopRightRadius: 10, borderBottomLeftRadius: 10, borderBottomRightRadius: 0 }} />
//             <SkeletonPlaceholder style={{ height: 40, width: '40%', borderTopLeftRadius: 10, borderTopRightRadius: 10, borderBottomLeftRadius: 0, borderBottomRightRadius: 10 }} />
//             <SkeletonPlaceholder style={{ height: 40, marginLeft: 'auto', width: '40%', borderTopLeftRadius: 10, borderTopRightRadius: 10, borderBottomLeftRadius: 10, borderBottomRightRadius: 0 }} />
//             <SkeletonPlaceholder style={{ height: 40, width: '40%', borderTopLeftRadius: 10, borderTopRightRadius: 10, borderBottomLeftRadius: 0, borderBottomRightRadius: 10 }} />
//             <SkeletonPlaceholder style={{ height: 40, marginLeft: 'auto', width: '40%', borderTopLeftRadius: 10, borderTopRightRadius: 10, borderBottomLeftRadius: 10, borderBottomRightRadius: 0 }} />
//         </View>
//     )
// }

// const styles = StyleSheet.create({
//     header: {
//         position: 'relative',
//         flexDirection: 'row',
//         alignItems: 'center',
//         minHeight: 56,
//         backgroundColor: 'transparent',
//         borderBottomWidth: 0,
//         borderBottomColor: '#ddd',
//         width: '100%',
//         overflow: 'hidden',
//     },
// })

// export default ViewSingleChat

import ArrowBackIcon from '@/components/icons/ArrowBackIcon';
import AttachmentIcon from '@/components/icons/AttachmentIcon';
import SendIcon from '@/components/icons/SendIcon';
import NavBar from '@/components/NavBar';
import { CONNECTION_STATE_HEIGHT } from '@/constants/constants';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { markChatAsRead } from '@/redux/slices/chatsSlice';
import { fetchMessages, sendMessage, setActiveUserId, startUpdateLoading, stopUpdateLoading } from '@/redux/slices/messagesSlice';
import { getRandomUniqueId } from '@/utils/helpers';
import { router, useLocalSearchParams } from 'expo-router';
import { Fragment, useEffect, useRef, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import {
  View,
  Text,
  StyleSheet,
  FlatList, ActivityIndicator,
  TextInput,
  TouchableOpacity, Image
} from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import axiosRequest from '@/utils/axios';
import { ReactionCodes } from '@/models/general';
import { useLoader } from '@/context/loader/LoaderProvider';
import ChatRoomSkeleton from '@/components/ChatRoomSkeleton';

type MessageItemProps = {
  item: {
    is_message_received: boolean;
    type: number | string; // "1" for text, others for image
    message: string; // text or image URL
    created_on: string;
  };
  styles: any; // pass your existing styles from ChatRoomScreen
};


export default function ChatRoomScreen() {
  const { userId } = useLocalSearchParams();
  const { show, hide } = useLoader();
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const bucket = useAppSelector(state => state.messages.byUserId[+userId]);
  const meta = useAppSelector(state => state.messages.userMeta[+userId]);
  const userData = meta?.userData;
  const userLikeData = meta?.userLikeData;
  const loggedInUserProfilePicture = meta?.loggedInUserProfilePicture;
  const loadingInitial = bucket?.loadingInitial ?? false;
  const loadingUpdate = bucket?.loadingUpdate ?? false;
  const messages = bucket?.items ?? [];

  const [text, setText] = useState('');
  const listRef = useRef<FlatList<any>>(null);
  const [inputHeight, setInputHeight] = useState(40); // Initial height


  // On mount: track active chat, mark read, fetch
  useEffect(() => {
    dispatch(setActiveUserId(+userId));
    dispatch(markChatAsRead({ user_id: +userId }));
    dispatch(fetchMessages({ user_id: +userId }));
    return () => {
      dispatch(setActiveUserId(undefined));
    };
  }, [userId, dispatch]);
  // Auto-scroll to bottom whenever messages count changes (initial load or updates)
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 50);
    }
  }, [messages.length]);

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
        formData.append("optionalLoggedInUserId", String(meta?.userData.optionalLoggedInUserId));
        formData.append("type", "2");

        dispatch(startUpdateLoading({ user_id: +userId }));
        await dispatch(sendMessage({ user_id: +userId, params: formData }));
        dispatch(stopUpdateLoading({ user_id: +userId }));
        // After sending, ensure we show the latest at bottom
        setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 50);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const acceptOrDeclineMessageRequest = async (message_request_status: '1' | '2') => {
    try {
      const params = {
        message_request_status,
      }
      show();
      const data: any = await axiosRequest.post(`/messenger/${userId}/process-accept-decline-message-request`, params);
      if (data.reaction === ReactionCodes.SUCCESS) {
        dispatch(setActiveUserId(+userId));
        dispatch(markChatAsRead({ user_id: +userId }));
        dispatch(fetchMessages({ user_id: +userId }));
      }
      hide();
    } catch (error) {
      hide();
    }
  }

  const onSend = async () => {
    const content = text.trim();
    const params = {
      type: 1,
      message: content,
      unique_id: getRandomUniqueId(),
      optionalLoggedInUserId: meta?.userData.optionalLoggedInUserId
    }
    if (!content) return;
    setText('');
    dispatch(startUpdateLoading({ user_id: +userId }));
    await dispatch(sendMessage({ user_id: +userId, params }));
    dispatch(stopUpdateLoading({ user_id: +userId }));
    // After sending, ensure we show the latest at bottom
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 50);
  };

  const renderItem = ({ item }: any) => <MessageItem item={item} styles={styles} />;


  return (
    <KeyboardAvoidingView
      style={styles.kav}
      behavior={'padding'}
      keyboardVerticalOffset={-insets.bottom + CONNECTION_STATE_HEIGHT}
    >
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <PageHeader userData={userData} />

        {loadingInitial ? (
          <ChatRoomSkeleton />
        ) : (
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={(item) => String(item.chat_id)}
            renderItem={renderItem}
            contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + CONNECTION_STATE_HEIGHT }}
            // This ensures that when content grows (e.g., after refresh or send) we scroll to the bottom
            onContentSizeChange={() => {
              setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 50);
            }}
          />
        )}

        {loadingUpdate && (
          <View style={styles.inlineLoader}>
            <ActivityIndicator color="#A020F0" />
            <Text style={{ marginLeft: 8, color: '#666' }}>Updating…</Text>
          </View>
        )}

        {/* <SendInput text={text} setText={setText} pickImage={pickImage} onSend={onSend} /> */}
        {!loadingInitial && <Fragment>
          {meta ? <Fragment>
            {(meta.userData.messageRequestStatus === 'MESSAGE_REQUEST_ACCEPTED' || meta.userData.messageRequestStatus === 'SEND_NEW_MESSAGE' || meta.userData.messageRequestStatus === 'MESSAGE_REQUEST_SENT') && <SendInput text={text} setText={setText} pickImage={pickImage} onSend={onSend} />}
            {meta.userData.messageRequestStatus === 'MESSAGE_REQUEST_RECEIVED' && <ActionComponent acceptOrDeclineMessageRequest={(status) => acceptOrDeclineMessageRequest(status)} full_name={meta.userData.full_name} showDeclineButton />}
            {meta.userData.messageRequestStatus === 'MESSAGE_REQUEST_DECLINE_BY_USER' && <View style={{ marginBottom: insets.bottom }} className='bg-red-500 p-3 justify-center items-center rounded-md m-4'>
              <Text className='text-white text-sm'> {meta.userData.full_name} declined your request</Text>
            </View>}
            {meta.userData.messageRequestStatus === 'MESSAGE_REQUEST_DECLINE' && <ActionComponent acceptOrDeclineMessageRequest={(status) => acceptOrDeclineMessageRequest(status)} />}
          </Fragment> : null}
        </Fragment>}
      </View>
    </KeyboardAvoidingView>
  );
}

const MessageItem = ({ item, styles }: MessageItemProps) => {
  const isMine = !item.is_message_received;
  const [loading, setLoading] = useState(false);

  const isText = String(item.type) === '1';

  return (
    <View style={[styles.msgContainer, isMine ? { alignSelf: 'flex-end' } : { alignSelf: 'flex-start' }]}>
      <View style={[styles.msgBubble, isMine ? styles.msgMine : styles.msgTheirs]}>
        {isText ? (
          <Text style={[styles.msgText, isMine ? styles.msgTextMine : styles.msgTextTheirs]}>
            {item.message}
          </Text>
        ) : (
          <View>
            {loading && (
              <ActivityIndicator style={{ position: 'absolute', top: '50%', left: '50%', zIndex: 1 }} />
            )}
            <Image
              style={{ width: 160, height: 160, borderRadius: 8, opacity: loading ? 0.75 : 1 }}
              source={{ uri: item.message }}
              onLoadStart={() => setLoading(true)}
              onLoadEnd={() => setLoading(false)}
            />
          </View>
        )}
      </View>
      <Text style={styles.msgTime}>{item.created_on}</Text>
    </View>
  );
}

const PageHeader = ({ userData }: { userData?: { full_name?: string, profile_picture_image?: string, message_from_username?: string } }) => {
  return (
    <NavBar leftItem={<View className='flex-row gap-x-2 items-center'>
      <TouchableOpacity
        activeOpacity={0.5} onPress={() => router.back()} className='flex items-center justify-center w-10 h-10 rounded-full bg-white border border-[#C7C7CC]'>
        <ArrowBackIcon />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.navigate({
        pathname: '/[userName]',
        params: {userName: userData?.message_from_username || ''},
      })}>
<View className='flex-row items-center gap-x-2'>
        <Image style={{ width: 50, height: 50, borderRadius: 25, marginRight: 12, backgroundColor: '#EEE' }} source={userData?.profile_picture_image ? { uri: userData.profile_picture_image } : undefined} />
        <Text className='text-base font-firamedium'>
          {userData?.full_name || 'Chat'}
        </Text>
      </View>
      </TouchableOpacity>
    </View>} />
  )
}

const SendInput = ({ text, setText, pickImage, onSend }: { text: string, setText: (text: string) => void, pickImage: () => void, onSend: () => void }) => {
  const { bottom } = useSafeAreaInsets();
  return (
    // <View style={styles.inputBar}>
    //       <TextInput
    //         autoCorrect={false}
    //         style={[styles.input, { height: inputHeight }]}
    //         placeholder="Type a message"
    //         value={text}
    //         onChangeText={setText}
    //         onContentSizeChange={(event) => {
    //           console.log('onContentSizeChange', event.nativeEvent.contentSize.height);
    //           setInputHeight(event.nativeEvent.contentSize.height);
    //         }}
    //         onSubmitEditing={onSend}
    //         returnKeyType="send"
    //       />
    //       <View className='flex-row items-center gap-x-4'>
    //         <TouchableOpacity onPress={pickImage}>
    //           <AttachmentIcon />
    //         </TouchableOpacity>
    //         {text.trim().length > 0 && <TouchableOpacity onPress={onSend}>
    //           <SendIcon />
    //         </TouchableOpacity>}
    //       </View>
    //     </View>
    <View style={{
      width: '100%',
      borderTopWidth: 0.2,
      borderColor: '#f2f2f2',
      paddingBottom: bottom
    }}>
      <View style={{ flexShrink: 1, flexDirection: "row" }} className="items-center gap-x-3 px-4 py-3">
        <View style={{ flex: 1, flexDirection: "row" }} className=" items-center bg-[#F2F2F7] rounded-[20px] h-[48px] px-3 py-1">
          <TextInput autoCorrect={false} value={text} onChangeText={setText} placeholderTextColor={'#A1A1A1'} style={{ flex: 1, maxHeight: 150, alignSelf: 'center', minHeight: 52 }}
            className="text-sm h-full mx-3 items-center text-black font-firaregular" placeholder="Type a message" />
        </View>
        <View style={{ flexDirection: "row" }} className="items-center">
          <TouchableOpacity onPress={pickImage} className="mr-5 items-center justify-center">
            <AttachmentIcon />
          </TouchableOpacity>
          {text.trim().length > 0 && <TouchableOpacity onPress={onSend} className="items-center justify-center">
            <SendIcon />
          </TouchableOpacity>}
        </View>
      </View>
    </View>
  )
}

const ActionComponent = ({ full_name, showDeclineButton, acceptOrDeclineMessageRequest }: { acceptOrDeclineMessageRequest: (status: '1' | '2') => void, showDeclineButton?: boolean, full_name?: string, }) => {
  const { bottom } = useSafeAreaInsets();
  return (
    <View style={{ paddingBottom: bottom }}>
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
    </View>
  )
}

function formatTime(iso: string) {
  try {
    const d = new Date(iso);
    const hours = d.getHours();
    const minutes = `${d.getMinutes()}`.padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const h = ((hours + 11) % 12) + 1;
    return `${h}:${minutes} ${ampm}`;
  } catch {
    return '';
  }
}

const styles = StyleSheet.create({
  kav: { flex: 1, backgroundColor: 'white' },
  container: { flex: 1, backgroundColor: '#fff' },
  header: { height: 56, justifyContent: 'center', alignItems: 'center', borderBottomColor: '#eee', borderBottomWidth: 1 },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  msgBubble: { padding: 12 },
  msgContainer: { maxWidth: '80%', marginBottom: 12 },
  msgMine: { backgroundColor: '#A020F0', borderTopLeftRadius: 10, borderTopRightRadius: 10, borderBottomLeftRadius: 10, alignSelf: 'flex-end' },
  msgTheirs: { backgroundColor: '#F3E5FF', borderTopLeftRadius: 10, borderTopRightRadius: 10, borderBottomRightRadius: 10, alignSelf: 'flex-start' },
  msgText: { fontSize: 15, fontFamily: 'Onest_400Regular' },
  msgTextMine: { color: '#fff' },
  msgTextTheirs: { color: '#333' },
  msgTime: { fontSize: 10, color: '#0D082C66', fontFamily: 'Onest_400Regular', marginTop: 4 },
  inlineLoader: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    backgroundColor: '#FFF',
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
    paddingBottom: 24
  },
  input: {
    fontSize: 16,
    fontFamily: 'Onest_400Regular',
    flex: 1,
    backgroundColor: '#F2F2F7',
    borderRadius: 52,
    paddingHorizontal: 16,
    paddingVertical: 10,
    minHeight: 52, // Set a minimum height
    maxHeight: 150,
  },
});