// Replace these with your real implementations.
import { ChatsResponse, MessengerUser, SingleChatResponse, UserConversation } from '@/models/chat';
import axiosRequest from './axios';

export async function fetchChatsApi(): Promise<MessengerUser[]> {
  // GET /chats
  const { data }: { data: ChatsResponse } = await axiosRequest.get('/messenger/get-user-conversations');
  return data.messengerUsers;
}

export async function fetchSingleChatApi(user_id: number): Promise<SingleChatResponse> {
  // GET /chats/{user_id}
  const { data }: { data: SingleChatResponse } = await axiosRequest.get(`/messenger/${user_id}/get-user-messages`);
  return data;
}

export async function hydrateMessageApi(user_id: number, messageId: number | string): Promise<UserConversation> {
  // GET /chats/{user_id}/messages/{messageId}
  return {
    chat_id: Number(messageId),
    created_on: new Date().toISOString(),
    is_message_received: true,
    message: 'New message',
    message_from: '123',
    message_from_username: 'sender',
    message_to: `${user_id}`,
    optionalLoggedInUserId: user_id,
    type: 0,
  };
}

export async function sendMessageApi(user_id: number, params: any): Promise<UserConversation> {
  console.log('sendMessageApi params', params);
  const { data } = await axiosRequest.post(`/messenger/${user_id}/send-message`, params);
  console.log('data', data);
  const storedData = data.storedData;
  return storedData;
}