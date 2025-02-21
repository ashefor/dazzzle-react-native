import { ApiResponse, ReactionCodes } from "./general";

export interface Profile {
  _id: number;
  _uid: string;
  username: string;
  full_name: string;
  first_name: string;
  last_name: string;
  country: number;
  email: string;
  role_id: number;
  role: string;
  authority_id: number;
  profile_picture: string;
  profile_picture_url: string;
  cover_picture_url: string;
  about_me: string | null;
  is_premium: boolean;
  additional_user_info: AdditionalUserInfo;
}

export interface AdditionalUserInfo {
  features_availability: {
    no_ads: boolean;
  };
  is_premium_only: {
    show_likes: boolean;
  };
}

export interface Notifications {
  notificationData: any[]; // Adjust type as needed
  notificationCount: number;
}

export interface AuthInfo {
  authorization_token: string;
  authorized: boolean;
  reaction_code: typeof ReactionCodes[keyof typeof ReactionCodes];
  isProfileComplete: boolean;
  profile: Profile;
  personnel: number;
  timezone: boolean;
  notifications: Notifications;
}

export interface AuthApiResponseData {
  message: string;
  auth_info: AuthInfo;
  access_token: string;
  incident: any | null;
}

export interface AuthApiResponse extends ApiResponse {
  data: AuthApiResponseData;
}

export interface RandomUser {
  _uid: string;
  id: number;
  username: string;
  fullName: string;
  profileImage: string;
  coverImage: string;
  gender: string;
  dob: string;
  userAge: number;
  countryName: string;
  userOnlineStatus: number;
  isPremiumUser: boolean;
  detailString: string;
}

export interface FeaturedUser {
  _id: number;
  username: string;
  userFullName: string;
  userImageUrl: string;
  userCoverUrl: string;
  profile_picture: string;
  created_at: string;
  isPremiumUser: boolean;
  _uid: string;
}

export interface RandomUserResponse extends ApiResponse {
  data: {
    totalCount: number;
    filterData?: RandomUser[];
    usersData?: RandomUser[];
    incident: any | null;
  };
}

export interface FeaturedUsersResponse extends ApiResponse {
  data: {
    totalCount: number;
    getFeatureUserList?: FeaturedUser[];
    incident: any | null;
  };
}
