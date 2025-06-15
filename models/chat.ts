export interface ChatsResponse {
  currentUserData: CurrentUserData
  messengerUsers: MessengerUser[]
}

export interface CurrentUserData {
  logged_in_user_about_me: any
  logged_in_user_full_name: string
  logged_in_user_id: number
  logged_in_user_profile_picture: string
}

export interface MessengerUser {
  about_me: any
  cover_photo: string
  fake_user_id: number
  is_online: number
  last_seen_at: string
  last_seen_at_time_ago_format: string
  profile_picture: string
  user_full_name: string
  user_id: number
  user_uid: string
  username: string
}


export interface SingleChatResponse {
  incident: any
  loggedInUserProfilePicture: string
  mobileAppData: MobileAppData
  userConversations: UserConversation[]
  userData: UserData
  userLikeData: UserLikeData
}

export interface MobileAppData {
  allowAudioCall: boolean
  allowGiphy: boolean
  allowVideoCall: boolean
  giphyKey: string
}

export interface UserConversation {
  chat_id: number
  created_on: string
  is_message_received: boolean
  message: string
  message_from: string
  message_from_username: string
  message_to: string
  optionalLoggedInUserId: number
  type: number
}

export interface UserData {
  about_me: any
  enableAudioVideoLinks: boolean
  full_name: string
  messageRequestStatus: string
  message_from_username: string
  optionalLoggedInUserId: number
  profile_picture_image: string
  user_id: number
  user_uid: string
}

export interface UserLikeData {
  _id: number
  like: number
}
