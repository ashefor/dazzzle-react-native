import ArrowBackIcon from '@/components/icons/ArrowBackIcon';
import AttachmentIcon from '@/components/icons/AttachmentIcon';
import SendIcon from '@/components/icons/SendIcon';
import NavBar from '@/components/NavBar';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { markChatAsRead } from '@/redux/slices/chatsSlice';
import { addNewMessage, deleteMessage, fetchMessages, sendMessage, setActiveUserId, startUpdateLoading, stopUpdateLoading } from '@/redux/slices/messagesSlice';
import { getRandomUniqueId } from '@/utils/helpers';
import { router, useLocalSearchParams } from 'expo-router';
import { Fragment, useEffect, useMemo, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Image,
  Platform, Alert,
  DeviceEventEmitter,
  Modal, Dimensions
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import axiosRequest from '@/utils/axios';
import { ReactionCodes } from '@/models/general';
import { useLoader } from '@/context/loader/LoaderProvider';
import ChatRoomSkeleton from '@/components/ChatRoomSkeleton';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { UserConversation } from '@/models/chat';
import { Ionicons } from '@expo/vector-icons';
import { usePremiumAction } from '@/hooks/usePremiumAction';
import { PremiumActionModal } from '@/components/PremiumActionModal';

type MessageItemProps = {
  item: {
    is_message_received: boolean;
    type: number | string;
    message: string;
    created_on: string;
    chat_id: number;
    optionalLoggedInUserId?: number;
  };
  styles: any;
  userId: string;
};

export default function ChatRoomScreen() {
  const { userId } = useLocalSearchParams();
  const { show, hide } = useLoader();
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const { requirePremium, showModal, setShowModal, modalOptions } = usePremiumAction();
  const bucket = useAppSelector(state => state.messages.byUserId[+userId]);
  const meta = useAppSelector(state => state.messages.userMeta[+userId]);
  const userData = meta?.userData;
  const loadingInitial = bucket?.loadingInitial ?? false;
  const loadingUpdate = bucket?.loadingUpdate ?? false;
  const messages = bucket?.items ?? [];

  // Inverted lists need data sorted Newest -> Oldest. 
  // Assuming 'messages' is currently Oldest -> Newest (based on slice sort), we reverse it.
  const reversedMessages = useMemo(() => {
    return [...messages].reverse();
  }, [messages]);

  const [text, setText] = useState('');

  // On mount: track active chat, mark read, fetch
  useEffect(() => {
    dispatch(setActiveUserId(+userId));
    dispatch(markChatAsRead({ user_id: +userId }));
    dispatch(fetchMessages({ user_id: +userId }));
    return () => {
      dispatch(setActiveUserId(undefined));
    };
  }, [userId, dispatch]);

  useEffect(() => {
        // Subscribe to the event we created in Step 1
        const messageListener = DeviceEventEmitter.addListener('onNewMessage', (payload) => {
            
            // CRITICAL: Check if the notification belongs to THIS conversation
            // We use '==' to handle string/number mismatches (e.g. "3239" vs 3239)
            if (payload.userId == userId) {
                
                // 1. Format the payload to match your chat UI's message structure
                const newMessage: UserConversation = {
                  message: payload.message,
                  is_message_received: true,
                  created_on: payload.createdOn,
                  chat_id: +userId,
                  type: payload.type,
                  optionalLoggedInUserId: meta.userData.optionalLoggedInUserId,
                  message_from: '',
                  message_from_username: meta.userData.message_from_username,
                  message_to: ''
                };

                // 2. Update the UI instantly
                // setMessages(previousMessages => [newMessage, ...previousMessages]);
                dispatch(addNewMessage({user_id: +userId, message: newMessage}))
                
                // Optional: Play a simplified "pop" sound since we aren't showing the notification banner
            }
        });

        // Cleanup: Unsubscribe when the user leaves this screen
        return () => {
            messageListener.remove();
        };
    }, [userId]);

  // const pickImage = async () => {
  //   try {
  //     let result = await ImagePicker.launchImageLibraryAsync({
  //       mediaTypes: ['images'],
  //       allowsEditing: true,
  //       allowsMultipleSelection: false,
  //       cameraType: ImagePicker.CameraType.front,
  //       aspect: [4, 3],
  //       quality: 1,
  //       base64: true
  //     });

  //     if (!result.canceled) {
  //       const image = result.assets[0];
  //       const formData = new FormData();
  //       formData.append("filepond", {
  //         uri: image?.uri,
  //         name: 'name' in image ? image.name : image.uri.split("/").pop() || "unknown.jpg",
  //         type: image?.mimeType || "image/jpeg",
  //       } as any);
  //       formData.append("unique_id", getRandomUniqueId());
  //       formData.append("optionalLoggedInUserId", String(meta?.userData.optionalLoggedInUserId));
  //       formData.append("type", "2");

  //       dispatch(startUpdateLoading({ user_id: +userId }));

  //       await dispatch(sendMessage({ user_id: +userId, params: formData }));
  //       dispatch(stopUpdateLoading({ user_id: +userId }));
  //     } 
  //   } catch (error) {
  //     console.error('Error picking image:', error);
  //   }
  // };

  const pickImage = async () => {
    requirePremium(async () => {
      try {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images, // Use Enum for better type safety
          allowsEditing: true,
          allowsMultipleSelection: false,
          quality: 0.8, // Slightly reduced quality is often better for mobile uploads
          // base64: true, // <-- REMOVED: Unnecessary for FormData upload and causes lag
        });

        if (!result.canceled) {
          const image = result.assets[0];
          
          // Android Fix: Ensure name and type are strictly defined
          const uri = image.uri;
          // Extract filename from URI
          const fileName = uri.split('/').pop() || "upload.jpg";
          // Infer mime type from file extension if not provided by picker
          const match = /\.(\w+)$/.exec(fileName);
          const type = image.mimeType || (match ? `image/${match[1]}` : `image/jpeg`);

          const formData = new FormData();
          
          formData.append("filepond", {
            uri: uri,
            name: fileName,
            type: type,
          } as any);

          formData.append("unique_id", getRandomUniqueId());
          formData.append("optionalLoggedInUserId", String(meta?.userData.optionalLoggedInUserId));
          formData.append("type", "2");

          dispatch(startUpdateLoading({ user_id: +userId }));
          
          // When sending FormData, Axios automatically sets Content-Type to multipart/form-data
          // Do NOT manually set 'Content-Type': 'multipart/form-data' in headers, 
          // as that removes the boundary string needed for the server to parse it.
          await dispatch(sendMessage({ user_id: +userId, params: formData })).unwrap();
          
          dispatch(stopUpdateLoading({ user_id: +userId }));
          
          // Scroll to bottom
          // setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 50);
        }
      } catch (error) {
        console.error('Error picking image:', error);
        dispatch(stopUpdateLoading({ user_id: +userId }));
      }
    }, {
      title: 'Send Images',
      message: 'Upgrade your account to send images and photos in messages!'
    });
  };

  const acceptOrDeclineMessageRequest = async (message_request_status: '1' | '2') => {
    try {
      const params = { message_request_status }
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
    if (!content) return;
    
    requirePremium(async () => {
      const params = {
        type: 1,
        message: content,
        unique_id: getRandomUniqueId(),
        optionalLoggedInUserId: meta?.userData.optionalLoggedInUserId
      }
      
      setText('');
      dispatch(startUpdateLoading({ user_id: +userId }));
      await dispatch(sendMessage({ user_id: +userId, params }));
      dispatch(stopUpdateLoading({ user_id: +userId }));
    }, {
      title: 'Send Messages',
      message: 'Upgrade your account to send messages and chat with other users!'
    });
  };

  const renderItem = ({ item }: any) => <MessageItem item={item} styles={styles} userId={userId as string} />;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: 'white' }}
      behavior="padding"
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <PageHeader userData={userData} />

        {loadingInitial ? (
          <ChatRoomSkeleton />
        ) : (
          <FlatList
            inverted
            data={reversedMessages}
            keyExtractor={(item, index) => `${String(item.chat_id)}-${index}`}
            renderItem={renderItem}
            contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16 }}
            // Remove keyboardDismissMode if you want keyboard to stay open while scrolling
            keyboardDismissMode="interactive" 
          />
        )}

        {loadingUpdate && (
          <View style={styles.inlineLoader}>
            <ActivityIndicator color="#A020F0" size={'small'}/>
            <Text style={{ marginLeft: 8, fontSize: 12, color: '#666' }}>Updating…</Text>
          </View>
        )}

        {!loadingInitial && (
          <Fragment>
            {meta ? (
              <Fragment>
                {(meta.userData.messageRequestStatus === 'MESSAGE_REQUEST_ACCEPTED' || 
                  meta.userData.messageRequestStatus === 'SEND_NEW_MESSAGE' || 
                  meta.userData.messageRequestStatus === 'MESSAGE_REQUEST_SENT') && 
                  <SendInput text={text} setText={setText} pickImage={pickImage} onSend={onSend} />
                }
                
                {meta.userData.messageRequestStatus === 'MESSAGE_REQUEST_RECEIVED' && 
                  <ActionComponent 
                    acceptOrDeclineMessageRequest={acceptOrDeclineMessageRequest} 
                    full_name={meta.userData.full_name} 
                    showDeclineButton 
                  />
                }
                
                {meta.userData.messageRequestStatus === 'MESSAGE_REQUEST_DECLINE_BY_USER' && 
                  <View style={{ marginBottom: insets.bottom }} className='bg-red-500 p-3 justify-center items-center rounded-md m-4'>
                    <Text className='text-white text-sm'> {meta.userData.full_name} declined your request</Text>
                  </View>
                }
                
                {meta.userData.messageRequestStatus === 'MESSAGE_REQUEST_DECLINE' && 
                  <ActionComponent acceptOrDeclineMessageRequest={acceptOrDeclineMessageRequest} />
                }
              </Fragment>
            ) : null}
          </Fragment>
        )}
      </View>
      
      {/* Premium Action Modal */}
      <PremiumActionModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        {...modalOptions}
      />
    </KeyboardAvoidingView>
  );
}

const MessageItem = ({ item, styles, userId }: MessageItemProps) => {
  const dispatch = useAppDispatch();
  const {show, hide} = useLoader();
  const isMine = !item.is_message_received;
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const insets = useSafeAreaInsets();
  const isText = String(item.type) === '1';

  const closeModal = () => setIsModalOpen(false);
  const openModal = () => item.type == "1" ? null: setIsModalOpen(true)
  const showDeleteConfirmation = () => {
    // Implement delete confirmation logic if needed
    const alertMessage = isText ? `Are you sure you want to delete this message?\n\n"${item.message}"` : 'Are you sure you want to delete this image message?';
    Alert.alert(
      'Delete Message',
      alertMessage,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => {
          deleteUserMessage();
        } 
        }, 
      ]
    );
  }

  const deleteUserMessage = async () => {
    const chat_id = item.chat_id;
    show();
    const response: any = await axiosRequest.post(`/messenger/${chat_id}/${userId}/delete-message`, { });
    hide();
    if (response.reaction === ReactionCodes.SUCCESS) {
      dispatch(deleteMessage({ chatId: String(chat_id), user_id: String(userId) }));
    } else {
      // Handle error
      hide();
      Alert.alert('Error', 'Failed to delete message.');
    }
  }

  return (
    <>
    <View style={[styles.msgContainer, isMine ? { alignSelf: 'flex-end' } : { alignSelf: 'flex-start' }]}>
      <TouchableOpacity onPress={openModal} onLongPress={showDeleteConfirmation}>
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
      </TouchableOpacity>
      <Text style={styles.msgTime}>{item.created_on}</Text>
    </View>
      <Modal
        visible={isModalOpen}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={{ 
          flex: 1, 
          backgroundColor: 'white',
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right
        }}>
            <NavBar leftItem={<TouchableOpacity onPress={closeModal} className=' flex items-center justify-center'>
              <Ionicons name="close-circle" size={24} color="black" />
            </TouchableOpacity>} title={'View Image'}/>
            <View className='flex-1 justify-center items-center p-6'>
              <Image source={{ uri: item.message }} style={{ resizeMode: 'contain', width: '100%', height: '100%', maxHeight: Dimensions.get('screen').height * 0.9, maxWidth: Dimensions.get('screen').width * 0.9, margin: 'auto' }} />
            </View>
          </View>
      </Modal>
    </>
  );
}

const PageHeader = ({ userData }: { userData?: { full_name?: string, profile_picture_image?: string, message_from_username?: string } }) => {
  return (
    <NavBar leftItem={
      <View className='flex-row gap-x-2 items-center'>
        <TouchableOpacity
          activeOpacity={0.5} 
          onPress={() => router.back()} 
          className='flex items-center justify-center w-10 h-10 rounded-full bg-white border border-[#C7C7CC]'
        >
          <ArrowBackIcon />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.navigate({
            pathname: '/[userName]',
            params: {userName: userData?.message_from_username || ''},
          })}
        >
          <View className='flex-row items-center gap-x-2'>
            <Image 
              style={{ width: 50, height: 50, borderRadius: 25, marginRight: 12, backgroundColor: '#EEE' }} 
              source={userData?.profile_picture_image ? { uri: userData.profile_picture_image } : undefined} 
            />
            <Text className='text-base font-firamedium'>
              {userData?.full_name || 'Chat'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    } />
  )
}

const SendInput = ({ text, setText, pickImage, onSend }: { text: string, setText: (text: string) => void, pickImage: () => void, onSend: () => void }) => {
  const { bottom } = useSafeAreaInsets();
  
  // We use a small padding when keyboard is hidden to look good on iPhone X+,
  // but when keyboard is open, the View will be pushed up.
  // The logic remains simple because KeyboardAvoidingView handles the heavy lifting.
  return (
    <View style={{
      width: '100%',
      borderTopWidth: 0.5,
      borderColor: '#E5E5EA',
      backgroundColor: 'white',
      paddingBottom: bottom > 0 ? bottom : 12, 
      paddingTop: 12
    }}>
      <View className="flex-row items-end gap-x-3 px-4">
        <View className="flex-1 bg-[#F2F2F7] rounded-[20px] min-h-[40px] px-3 py-2 flex-row items-center">
          <TextInput 
            autoCorrect={false} 
            value={text} 
            onChangeText={setText} 
            placeholderTextColor={'#A1A1A1'} 
            multiline
            style={{ 
              flex: 1, 
              maxHeight: 100, 
              fontSize: 16,
              color: 'black',
              paddingTop: 0, // fix for Android alignment
              paddingBottom: 0
            }}
            placeholder="Type a message" 
          />
        </View>
        
        <View className="flex-row items-center gap-x-4 mb-2">
          <TouchableOpacity onPress={pickImage}>
            <AttachmentIcon />
          </TouchableOpacity>
          {text.trim().length > 0 && (
            <TouchableOpacity onPress={onSend}>
              <SendIcon />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  )
}

const ActionComponent = ({ full_name, showDeclineButton, acceptOrDeclineMessageRequest }: { acceptOrDeclineMessageRequest: (status: '1' | '2') => void, showDeclineButton?: boolean, full_name?: string, }) => {
  const { bottom } = useSafeAreaInsets();
  return (
    <View style={{ paddingBottom: bottom + 12, backgroundColor: 'white' }}>
      <View className='p-4'>
        {full_name && <Text className='text-black text-base text-center mb-2'> {full_name} wants to send you a message</Text>}
        <View className='flex-row justify-between items-center space-x-3 mt-2'>
          {showDeclineButton && <TouchableOpacity onPress={() => acceptOrDeclineMessageRequest('2')} className='bg-red-500 flex-1 p-3 justify-center items-center rounded-md'>
            <Text className='text-white font-firamedium'>Reject</Text>
          </TouchableOpacity>}
          <TouchableOpacity onPress={() => acceptOrDeclineMessageRequest('1')} className=' bg-[#DD3FE5] flex-1 p-3 justify-center items-center rounded-md'>
            <Text className='text-white font-firamedium'>Accept</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  msgBubble: { padding: 12, maxWidth: '100%' },
  msgContainer: { maxWidth: '80%', marginBottom: 12 },
  msgMine: { backgroundColor: '#A020F0', borderTopLeftRadius: 18, borderTopRightRadius: 18, borderBottomLeftRadius: 18, alignSelf: 'flex-end' },
  msgTheirs: { backgroundColor: '#F3E5FF', borderTopLeftRadius: 18, borderTopRightRadius: 18, borderBottomRightRadius: 18, alignSelf: 'flex-start' },
  msgText: { fontSize: 16 },
  msgTextMine: { color: '#fff' },
  msgTextTheirs: { color: '#000' },
  msgTime: { fontSize: 11, color: '#8E8E93', marginTop: 4, alignSelf: 'flex-end' },
  inlineLoader: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    backgroundColor: '#FFF',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 10
  }
});