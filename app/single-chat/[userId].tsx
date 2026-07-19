import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  DeviceEventEmitter,
  FlatList,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import NavBar from '@/components/NavBar';
import ChatRoomSkeleton from '@/components/ChatRoomSkeleton';
import { PremiumActionModal } from '@/components/PremiumActionModal';
import ArrowBackIcon from '@/components/icons/ArrowBackIcon';
import AttachmentIcon from '@/components/icons/AttachmentIcon';
import SendIcon from '@/components/icons/SendIcon';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { usePremiumAction } from '@/hooks/usePremiumAction';
import { UserConversation, UserData } from '@/models/chat';
import { ReactionCodes } from '@/models/general';
import { markChatAsRead } from '@/redux/slices/chatsSlice';
import {
  addNewMessage,
  deleteMessage,
  fetchMessages,
  sendMessage,
  setActiveUserId,
  startUpdateLoading,
  stopUpdateLoading,
} from '@/redux/slices/messagesSlice';
import axiosRequest from '@/utils/axios';
import { getRandomUniqueId } from '@/utils/helpers';
import { useLoader } from '@/context/loader/LoaderProvider';

type IncomingMessagePayload = {
  userId?: number | string;
  user_id?: number | string;
  message?: string;
  createdOn?: string;
  created_on?: string;
  type?: number | string;
  messageId?: number | string;
  chatId?: number | string;
  message_from_username?: string;
};

type MessageItemProps = {
  item: UserConversation;
  onDelete: (message: UserConversation) => void;
  onOpenImage: (url: string) => void;
};

type SendInputProps = {
  disabled: boolean;
  onChangeText: (text: string) => void;
  onPickImage: () => void;
  onSend: () => void;
  text: string;
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (typeof error === 'object' && error && 'errorMessage' in error) {
    return String(error.errorMessage);
  }
  return error instanceof Error ? error.message : fallback;
};

const MessageItem = React.memo(({ item, onDelete, onOpenImage }: MessageItemProps) => {
  const isMine = !item.is_message_received;
  const isText = Number(item.type) === 1;
  const openImage = useCallback(() => {
    if (!isText) onOpenImage(item.message);
  }, [isText, item.message, onOpenImage]);
  const deleteCurrentMessage = useCallback(() => onDelete(item), [item, onDelete]);

  return (
    <View style={[styles.messageContainer, isMine ? styles.messageMineAlignment : styles.messageTheirsAlignment]}>
      <Pressable
        accessibilityHint="Long press to delete this message"
        accessibilityLabel={isText ? item.message : 'Image message'}
        accessibilityRole={isText ? 'text' : 'button'}
        delayLongPress={400}
        onLongPress={deleteCurrentMessage}
        onPress={isText ? undefined : openImage}
      >
        <View style={[styles.messageBubble, isMine ? styles.messageMine : styles.messageTheirs]}>
          {isText ? (
            <Text selectable style={[styles.messageText, isMine ? styles.messageTextMine : styles.messageTextTheirs]}>
              {item.message}
            </Text>
          ) : (
            <Image
              cachePolicy="memory-disk"
              contentFit="cover"
              source={{ uri: item.message }}
              style={styles.messageImage}
              transition={150}
            />
          )}
        </View>
      </Pressable>
      <Text style={styles.messageTime}>{item.created_on}</Text>
    </View>
  );
});

MessageItem.displayName = 'MessageItem';

const PageHeader = React.memo(({ userData }: { userData?: UserData | null }) => {
  const goBack = useCallback(() => router.back(), []);
  const openProfile = useCallback(() => {
    if (!userData?.message_from_username) return;
    router.navigate({
      pathname: '/[userName]',
      params: { userName: userData.message_from_username },
    });
  }, [userData?.message_from_username]);

  return (
    <NavBar
      leftItem={(
        <View className="flex-row gap-x-2 items-center">
          <TouchableOpacity
            accessibilityLabel="Go back"
            accessibilityRole="button"
            activeOpacity={0.5}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white border border-[#C7C7CC]"
            onPress={goBack}
          >
            <ArrowBackIcon />
          </TouchableOpacity>
          <TouchableOpacity
            accessibilityLabel={userData?.full_name ? `View ${userData.full_name}'s profile` : 'Chat profile'}
            accessibilityRole="button"
            disabled={!userData?.message_from_username}
            onPress={openProfile}
          >
            <View className="flex-row items-center gap-x-2">
              <Image
                accessible={false}
                cachePolicy="memory-disk"
                contentFit="cover"
                source={userData?.profile_picture_image ? { uri: userData.profile_picture_image } : undefined}
                style={styles.headerAvatar}
                transition={150}
              />
              <Text className="text-base font-firamedium" numberOfLines={1} style={styles.headerName}>
                {userData?.full_name || 'Chat'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
    />
  );
});

PageHeader.displayName = 'PageHeader';

const SendInput = React.memo(({ disabled, onChangeText, onPickImage, onSend, text }: SendInputProps) => {
  const { bottom } = useSafeAreaInsets();
  const canSend = text.trim().length > 0 && !disabled;

  return (
    <View style={[styles.composer, { paddingBottom: bottom || 12 }]}>
      <View className="flex-row items-end gap-x-3 px-4">
        <View className="flex-1 bg-[#F2F2F7] rounded-[20px] min-h-[40px] px-3 py-2 flex-row items-center">
          <TextInput
            accessibilityLabel="Message"
            autoCorrect
            blurOnSubmit={false}
            editable={!disabled}
            maxLength={4000}
            multiline
            onChangeText={onChangeText}
            placeholder="Type a message"
            placeholderTextColor="#777777"
            style={styles.composerInput}
            value={text}
          />
        </View>

        <View className="flex-row items-center gap-x-2">
          <TouchableOpacity
            accessibilityLabel="Attach image"
            accessibilityRole="button"
            disabled={disabled}
            onPress={onPickImage}
            style={styles.composerAction}
          >
            <AttachmentIcon />
          </TouchableOpacity>
          {text.trim().length > 0 ? (
            <TouchableOpacity
              accessibilityLabel="Send message"
              accessibilityRole="button"
              disabled={!canSend}
              onPress={onSend}
              style={[styles.composerAction, !canSend && styles.disabledAction]}
            >
              <SendIcon />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </View>
  );
});

SendInput.displayName = 'SendInput';

const ActionComponent = React.memo(({
  disabled,
  fullName,
  onRespond,
  showDeclineButton,
}: {
  disabled: boolean;
  fullName?: string;
  onRespond: (status: '1' | '2') => void;
  showDeclineButton?: boolean;
}) => {
  const { bottom } = useSafeAreaInsets();
  const accept = useCallback(() => onRespond('1'), [onRespond]);
  const decline = useCallback(() => onRespond('2'), [onRespond]);

  return (
    <View style={[styles.requestActions, { paddingBottom: bottom + 12 }]}>
      <View className="p-4">
        {fullName ? (
          <Text className="text-black text-base text-center mb-2">{fullName} wants to send you a message</Text>
        ) : null}
        <View className="flex-row justify-between items-center space-x-3 mt-2">
          {showDeclineButton ? (
            <TouchableOpacity accessibilityRole="button" disabled={disabled} onPress={decline} className="bg-red-500 flex-1 p-3 justify-center items-center rounded-md">
              <Text className="text-white font-firamedium">Reject</Text>
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity accessibilityRole="button" disabled={disabled} onPress={accept} className="bg-[#DD3FE5] flex-1 p-3 justify-center items-center rounded-md">
            <Text className="text-white font-firamedium">Accept</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
});

ActionComponent.displayName = 'ActionComponent';

const ImagePreviewModal = React.memo(({ imageUrl, onClose }: { imageUrl: string | null; onClose: () => void }) => {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={imageUrl !== null} animationType="fade" onRequestClose={onClose}>
      <View style={[styles.previewModal, {
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }]}>
        <NavBar
          leftItem={(
            <TouchableOpacity accessibilityLabel="Close image" accessibilityRole="button" hitSlop={8} onPress={onClose}>
              <Ionicons name="close-circle" size={24} color="black" />
            </TouchableOpacity>
          )}
          title="View Image"
        />
        <View className="flex-1 justify-center items-center p-6">
          {imageUrl ? (
            <Image
              accessibilityLabel="Message image preview"
              cachePolicy="memory-disk"
              contentFit="contain"
              source={{ uri: imageUrl }}
              style={styles.previewImage}
            />
          ) : null}
        </View>
      </View>
    </Modal>
  );
});

ImagePreviewModal.displayName = 'ImagePreviewModal';

const EmptyMessages = ({ hasError, onRetry }: { hasError: boolean; onRetry: () => void }) => (
  <View style={styles.emptyMessages}>
    <Text className="text-gray-400 font-firaregular text-center">
      {hasError ? 'We couldn’t load this conversation.' : 'No messages yet.'}
    </Text>
    {hasError ? (
      <TouchableOpacity accessibilityRole="button" onPress={onRetry} style={styles.retryButton}>
        <Text className="text-white font-firamedium">Try again</Text>
      </TouchableOpacity>
    ) : null}
  </View>
);

export default function ChatRoomScreen() {
  const routeParams = useLocalSearchParams<{ userId?: string | string[] }>();
  const routeUserId = Array.isArray(routeParams.userId) ? routeParams.userId[0] : routeParams.userId;
  const userId = Number(routeUserId);
  const hasValidUserId = Number.isInteger(userId) && userId > 0;
  const { show, hide } = useLoader();
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const { requirePremium, showModal, setShowModal, modalOptions } = usePremiumAction();
  const bucket = useAppSelector((state) => hasValidUserId ? state.messages.byUserId[userId] : undefined);
  const meta = useAppSelector((state) => hasValidUserId ? state.messages.userMeta[userId] : undefined);
  const messages = bucket?.items;
  const loadError = bucket?.error;
  const loadingInitial = bucket?.loadingInitial ?? hasValidUserId;
  const loadingUpdate = bucket?.loadingUpdate ?? false;
  const [text, setText] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [processingRequest, setProcessingRequest] = useState(false);
  const deletingMessage = useRef(false);
  const processingRequestRef = useRef(false);
  const sendingMessage = useRef(false);

  const reversedMessages = useMemo(() => [...(messages ?? [])].reverse(), [messages]);

  useEffect(() => {
    if (!hasValidUserId) return;

    dispatch(setActiveUserId(userId));
    dispatch(markChatAsRead({ user_id: userId }));
    dispatch(fetchMessages({ user_id: userId }));

    return () => {
      dispatch(setActiveUserId(undefined));
    };
  }, [dispatch, hasValidUserId, userId]);

  useEffect(() => {
    if (!hasValidUserId) return;

    const messageListener = DeviceEventEmitter.addListener('onNewMessage', (payload: IncomingMessagePayload) => {
      const payloadUserId = Number(payload.userId ?? payload.user_id);
      if (payloadUserId !== userId || !payload.message) return;

      const newMessage: UserConversation = {
        message: String(payload.message),
        is_message_received: true,
        created_on: payload.createdOn ?? payload.created_on ?? new Date().toISOString(),
        chat_id: Number(payload.messageId ?? payload.chatId ?? Date.now()),
        type: Number(payload.type ?? 1),
        optionalLoggedInUserId: meta?.userData?.optionalLoggedInUserId ?? 0,
        message_from: '',
        message_from_username: payload.message_from_username ?? meta?.userData?.message_from_username ?? '',
        message_to: '',
      };

      dispatch(addNewMessage({ user_id: userId, message: newMessage }));
      dispatch(markChatAsRead({ user_id: userId }));
    });

    return () => messageListener.remove();
  }, [dispatch, hasValidUserId, meta?.userData?.message_from_username, meta?.userData?.optionalLoggedInUserId, userId]);

  const pickImage = useCallback(() => {
    if (!hasValidUserId || loadingUpdate) return;

    requirePremium(async () => {
      try {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          allowsMultipleSelection: false,
          quality: 0.8,
        });
        if (result.canceled || !result.assets[0]) return;
        if (sendingMessage.current) return;
        sendingMessage.current = true;

        const image = result.assets[0];
        const fileName = image.fileName || image.uri.split('/').pop() || 'upload.jpg';
        const extension = fileName.split('.').pop()?.toLocaleLowerCase();
        const mimeType = image.mimeType || (extension === 'jpg' ? 'image/jpeg' : `image/${extension || 'jpeg'}`);
        const formData = new FormData();
        formData.append('filepond', {
          uri: image.uri,
          name: fileName,
          type: mimeType,
        } as unknown as Blob);
        formData.append('unique_id', getRandomUniqueId());
        formData.append('optionalLoggedInUserId', String(meta?.userData?.optionalLoggedInUserId ?? ''));
        formData.append('type', '2');

        dispatch(startUpdateLoading({ user_id: userId }));
        await dispatch(sendMessage({ user_id: userId, params: formData })).unwrap();
      } catch (error: unknown) {
        Alert.alert('Unable to send image', getErrorMessage(error, 'Please try again.'));
      } finally {
        sendingMessage.current = false;
        dispatch(stopUpdateLoading({ user_id: userId }));
      }
    }, {
      title: 'Send Images',
      message: 'Upgrade your account to send images and photos in messages!',
    });
  }, [dispatch, hasValidUserId, loadingUpdate, meta?.userData?.optionalLoggedInUserId, requirePremium, userId]);

  const respondToMessageRequest = useCallback(async (messageRequestStatus: '1' | '2') => {
    if (!hasValidUserId || processingRequestRef.current) return;
    processingRequestRef.current = true;
    setProcessingRequest(true);
    show();

    try {
      const data: any = await axiosRequest.post(
        `/messenger/${userId}/process-accept-decline-message-request`,
        { message_request_status: messageRequestStatus },
      );
      if (data.reaction !== ReactionCodes.SUCCESS) throw new Error('Unable to update message request');

      dispatch(markChatAsRead({ user_id: userId }));
      await dispatch(fetchMessages({ user_id: userId })).unwrap();
    } catch (error: unknown) {
      Alert.alert('Unable to update request', getErrorMessage(error, 'Please try again.'));
    } finally {
      hide();
      processingRequestRef.current = false;
      setProcessingRequest(false);
    }
  }, [dispatch, hasValidUserId, hide, show, userId]);

  const sendTextMessage = useCallback(() => {
    const content = text.trim();
    if (!content || !hasValidUserId || loadingUpdate) return;

    requirePremium(async () => {
      if (sendingMessage.current) return;
      sendingMessage.current = true;
      setText('');
      dispatch(startUpdateLoading({ user_id: userId }));
      try {
        await dispatch(sendMessage({
          user_id: userId,
          params: {
            type: 1,
            message: content,
            unique_id: getRandomUniqueId(),
            optionalLoggedInUserId: meta?.userData?.optionalLoggedInUserId,
          },
        })).unwrap();
      } catch (error: unknown) {
        setText((current) => current || content);
        Alert.alert('Unable to send message', getErrorMessage(error, 'Please try again.'));
      } finally {
        sendingMessage.current = false;
        dispatch(stopUpdateLoading({ user_id: userId }));
      }
    }, {
      title: 'Send Messages',
      message: 'Upgrade your account to send messages and chat with other users!',
    });
  }, [dispatch, hasValidUserId, loadingUpdate, meta?.userData?.optionalLoggedInUserId, requirePremium, text, userId]);

  const openImagePreview = useCallback((url: string) => setPreviewImage(url), []);
  const closeImagePreview = useCallback(() => setPreviewImage(null), []);

  const deleteUserMessage = useCallback(async (message: UserConversation) => {
    if (deletingMessage.current || !hasValidUserId) return;
    deletingMessage.current = true;
    show();

    try {
      const response: any = await axiosRequest.post(`/messenger/${message.chat_id}/${userId}/delete-message`, {});
      if (response.reaction !== ReactionCodes.SUCCESS) throw new Error('Failed to delete message');
      dispatch(deleteMessage({ chatId: String(message.chat_id), user_id: String(userId) }));
    } catch (error: unknown) {
      Alert.alert('Unable to delete message', getErrorMessage(error, 'Please try again.'));
    } finally {
      hide();
      deletingMessage.current = false;
    }
  }, [dispatch, hasValidUserId, hide, show, userId]);

  const confirmDeleteMessage = useCallback((message: UserConversation) => {
    const isText = Number(message.type) === 1;
    const preview = message.message.length > 120 ? `${message.message.slice(0, 120)}…` : message.message;
    Alert.alert(
      'Delete Message',
      isText ? `Are you sure you want to delete this message?\n\n“${preview}”` : 'Are you sure you want to delete this image message?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteUserMessage(message) },
      ],
    );
  }, [deleteUserMessage]);

  const renderMessage = useCallback(({ item }: { item: UserConversation }) => (
    <MessageItem item={item} onDelete={confirmDeleteMessage} onOpenImage={openImagePreview} />
  ), [confirmDeleteMessage, openImagePreview]);

  const messageKey = useCallback((item: UserConversation) => `${item.chat_id}-${item.created_on}`, []);
  const retryMessages = useCallback(() => {
    dispatch(fetchMessages({ user_id: userId }));
  }, [dispatch, userId]);
  const emptyMessages = useMemo(() => (
    <EmptyMessages hasError={Boolean(loadError)} onRetry={retryMessages} />
  ), [loadError, retryMessages]);
  const closePremiumModal = useCallback(() => setShowModal(false), [setShowModal]);
  const messageRequestStatus = meta?.userData?.messageRequestStatus;
  const canCompose = messageRequestStatus === 'MESSAGE_REQUEST_ACCEPTED'
    || messageRequestStatus === 'SEND_NEW_MESSAGE'
    || messageRequestStatus === 'MESSAGE_REQUEST_SENT';

  if (!hasValidUserId) {
    return (
      <View style={[styles.container, styles.invalidRoute, { paddingTop: insets.top }]}>
        <Text className="text-base font-firamedium">This chat link is invalid.</Text>
        <TouchableOpacity accessibilityRole="button" onPress={() => router.back()} style={styles.backButton}>
          <Text className="text-white font-firamedium">Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.keyboardView} behavior="padding">
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <PageHeader userData={meta?.userData} />

        {loadingInitial && reversedMessages.length === 0 ? (
          <ChatRoomSkeleton />
        ) : (
          <FlatList
            contentContainerStyle={styles.messageListContent}
            data={reversedMessages}
            initialNumToRender={20}
            inverted
            keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
            keyboardShouldPersistTaps="handled"
            keyExtractor={messageKey}
            ListEmptyComponent={emptyMessages}
            maintainVisibleContentPosition={{ minIndexForVisible: 0 }}
            maxToRenderPerBatch={12}
            removeClippedSubviews={Platform.OS === 'android'}
            renderItem={renderMessage}
            showsVerticalScrollIndicator={false}
            windowSize={9}
          />
        )}

        {loadingUpdate ? (
          <View accessibilityLiveRegion="polite" style={styles.inlineLoader}>
            <ActivityIndicator color="#A020F0" size="small" />
            <Text style={styles.inlineLoaderText}>Updating…</Text>
          </View>
        ) : null}

        {!loadingInitial && meta ? (
          <>
            {canCompose ? (
              <SendInput
                disabled={loadingUpdate}
                onChangeText={setText}
                onPickImage={pickImage}
                onSend={sendTextMessage}
                text={text}
              />
            ) : null}

            {messageRequestStatus === 'MESSAGE_REQUEST_RECEIVED' ? (
              <ActionComponent
                disabled={processingRequest}
                fullName={meta.userData.full_name}
                onRespond={respondToMessageRequest}
                showDeclineButton
              />
            ) : null}

            {messageRequestStatus === 'MESSAGE_REQUEST_DECLINE_BY_USER' ? (
              <View style={{ marginBottom: insets.bottom }} className="bg-red-500 p-3 justify-center items-center rounded-md m-4">
                <Text className="text-white text-sm">{meta.userData.full_name} declined your request</Text>
              </View>
            ) : null}

            {messageRequestStatus === 'MESSAGE_REQUEST_DECLINE' ? (
              <ActionComponent disabled={processingRequest} onRespond={respondToMessageRequest} />
            ) : null}
          </>
        ) : null}
      </View>

      <ImagePreviewModal imageUrl={previewImage} onClose={closeImagePreview} />
      <PremiumActionModal visible={showModal} onClose={closePremiumModal} {...modalOptions} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  invalidRoute: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    marginTop: 16,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#DD3FE5',
  },
  headerAvatar: {
    width: 50,
    height: 50,
    marginRight: 12,
    borderRadius: 25,
    backgroundColor: '#EEEEEE',
  },
  headerName: {
    maxWidth: 180,
  },
  messageListContent: {
    flexGrow: 1,
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  emptyMessages: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ scaleY: -1 }],
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#DD3FE5',
  },
  messageBubble: {
    maxWidth: '100%',
    padding: 12,
  },
  messageContainer: {
    maxWidth: '80%',
    marginBottom: 12,
  },
  messageMineAlignment: {
    alignSelf: 'flex-end',
  },
  messageTheirsAlignment: {
    alignSelf: 'flex-start',
  },
  messageMine: {
    alignSelf: 'flex-end',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomLeftRadius: 18,
    backgroundColor: '#A020F0',
  },
  messageTheirs: {
    alignSelf: 'flex-start',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomRightRadius: 18,
    backgroundColor: '#F3E5FF',
  },
  messageText: {
    fontSize: 16,
  },
  messageTextMine: {
    color: '#FFFFFF',
  },
  messageTextTheirs: {
    color: '#000000',
  },
  messageImage: {
    width: 160,
    height: 160,
    borderRadius: 8,
    backgroundColor: '#EEEEEE',
  },
  messageTime: {
    marginTop: 4,
    alignSelf: 'flex-end',
    color: '#8E8E93',
    fontSize: 11,
  },
  inlineLoader: {
    position: 'absolute',
    bottom: 100,
    zIndex: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  inlineLoaderText: {
    marginLeft: 8,
    color: '#666666',
    fontSize: 12,
  },
  composer: {
    width: '100%',
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E5EA',
    backgroundColor: '#FFFFFF',
  },
  composerInput: {
    flex: 1,
    maxHeight: 100,
    paddingTop: 0,
    paddingBottom: 0,
    color: '#000000',
    fontSize: 16,
  },
  composerAction: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledAction: {
    opacity: 0.5,
  },
  requestActions: {
    backgroundColor: '#FFFFFF',
  },
  previewModal: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
});
