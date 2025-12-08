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
  userSubscription: any | null;
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

export interface RandomUser {
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

export interface SingleUserDetails {
  isOwnProfile: boolean
  userData: UserData
  countries: Country[]
  genders: Genders
  preferredLanguages: PreferredLanguages
  relationshipStatuses: RelationshipStatuses
  workStatuses: WorkStatuses
  educations: Educations
  userProfileData: UserProfileData
  photosData: any[]
  userSpecificationData: UserSpecificationsData
  formatteduserSpecificationData: { [key: string]: { [key: string]: string } }
  likedUserProfileData: LikedUserProfile[]
  totalLikedUser: number
  userLikeData: {like: number, _id: number}[] | {like: number, _id: number};
  totalUserLike: number
  totalVisitors: number
  isBlockUser: boolean
  blockByMeUser: boolean
  giftListData: GiftListDaum[]
  userGiftData: any[]
  userOnlineStatus: number
  isPremiumUser: boolean
  incident: any
}

export interface UserData {
  userId: number
  userUId: string
  fullName: string
  first_name: string
  last_name: string
  mobile_number: string
  userName: string
  country_code: string
  profilePicture: string
  coverPicture: string
  userAge: number
}

export interface Country {
  id: number
  name: string
}

export interface Genders {
  "1": string
  "2": string
  "3": string
}

export interface PreferredLanguages {
  "1": string
  "2": string
  "3": string
  "4": string
  "5": string
  "6": string
  "7": string
  "8": string
  "9": string
  "10": string
  "11": string
  "12": string
  "13": string
  "14": string
  "15": string
  "16": string
  "17": string
  "18": string
  "19": string
  "20": string
  "21": string
  "22": string
}

export interface RelationshipStatuses {
  "1": string
  "2": string
  "3": string
  "4": string
}

export interface WorkStatuses {
  "1": string
  "2": string
  "3": string
  "4": string
  "5": string
  "6": string
}

export interface Educations {
  "1": string
  "2": string
  "3": string
  "4": string
  "5": string
  "6": string
}

export interface UserProfileData {
  aboutMe: any
  city: any
  mobile_number: string
  showMobileNumber: boolean
  gender: number
  gender_text: string
  country: number
  country_name: string
  dob: string
  birthday: string
  work_status: any
  formatted_work_status: any
  education: any
  formatted_education: any
  preferred_language: any
  formatted_preferred_language: any
  relationship_status: any
  formatted_relationship_status: any
  latitude: string
  longitude: string
  isVerified: any
  raffle_number: number
  relationship_type: string[]
  interest: string[]
}

export interface GiftListDaum {
  _id: number
  _uid: string
  normal_price: string
  premium_price: string
  formattedPrice: string
  gift_image_url: string
}

export interface UserSpecificationsData {
  // looks: Looks
  // personality: Personality
  // lifestyle: Lifestyle
  [key: string]: UserSpecification
}

export interface UserSpecification {
  title: string
  icon: string
  items: Item[]
}

export interface Looks {
  title: string
  icon: string
  items: Item[]
}

export interface Item {
  name: string
  label: string
  input_type: string
  value: string
  options: Options
  selected_options: string
}

export interface Options {
  "139"?: string
  "140"?: string
  "141"?: string
  "142"?: string
  "143"?: string
  "144"?: string
  "145"?: string
  "146"?: string
  "147"?: string
  "148"?: string
  "149"?: string
  "150"?: string
  "151"?: string
  "152"?: string
  "153"?: string
  "154"?: string
  "155"?: string
  "156"?: string
  "157"?: string
  "158"?: string
  "159"?: string
  "160"?: string
  "161"?: string
  "162"?: string
  "163"?: string
  "164"?: string
  "165"?: string
  "166"?: string
  "167"?: string
  "168"?: string
  "169"?: string
  "170"?: string
  "171"?: string
  "172"?: string
  "173"?: string
  "174"?: string
  "175"?: string
  "176"?: string
  "177"?: string
  "178"?: string
  "179"?: string
  "180"?: string
  "181"?: string
  "182"?: string
  "183"?: string
  "184"?: string
  "185"?: string
  "186"?: string
  "187"?: string
  "188"?: string
  "189"?: string
  "190"?: string
  "191"?: string
  "192"?: string
  "193"?: string
  "194"?: string
  "195"?: string
  "196"?: string
  "197"?: string
  "198"?: string
  "199"?: string
  "200"?: string
  "201"?: string
  "202"?: string
  "203"?: string
  "204"?: string
  "205"?: string
  "206"?: string
  "207"?: string
  "208"?: string
  "209"?: string
  "210"?: string
  "211"?: string
  "212"?: string
  "213"?: string
  "214"?: string
  "215"?: string
  "216"?: string
  "217"?: string
  "218"?: string
  "220"?: string
  white?: string
  black?: string
  middle_eastern?: string
  north_african?: string
  latin_american?: string
  mixed?: string
  asian?: string
  other?: string
  slim?: string
  sporty?: string
  curvy?: string
  round?: string
  supermodel?: string
  average?: string
  brown?: string
  sandy?: string
  gray_or_partially_gray?: string
  "red/auburn"?: string
  "blond/strawberry"?: string
  blue?: string
  green?: string
  orange?: string
  pink?: string
  purple?: string
  partly_or_completely_bald?: string
}

export interface Personality {
  title: string
  icon: string
  items: Item2[]
}

export interface Item2 {
  name: string
  label: string
  input_type: string
  value: string
  options: Options2
  selected_options: string
}

export interface Options2 {
  accommodating?: string
  adventurous?: string
  calm?: string
  careless?: string
  cheerful?: string
  demanding?: string
  extroverted?: string
  honest?: string
  generous?: string
  humorous?: string
  introverted?: string
  liberal?: string
  lively?: string
  loner?: string
  nervous?: string
  possessive?: string
  quiet?: string
  reserved?: string
  sensitive?: string
  shy?: string
  social?: string
  spontaneous?: string
  stubborn?: string
  suspicious?: string
  thoughtful?: string
  proud?: string
  considerate?: string
  friendly?: string
  polite?: string
  reliable?: string
  careful?: string
  helpful?: string
  patient?: string
  optimistic?: string
  no_friends?: string
  some_friends?: string
  many_friends?: string
  only_good_friends?: string
  no_never?: string
  someday_maybe?: string
  expecting?: string
  i_already_have_kids?: string
  "i_have_kids_and_don't_want_more"?: string
  none?: string
  have_pets?: string
}

export interface Lifestyle {
  title: string
  icon: string
  items: Item3[]
}

export interface Item3 {
  name: string
  label: string
  input_type: string
  value: string
  options: Options3
  selected_options: string
}

export interface Options3 {
  muslim?: string
  atheist?: string
  buddhist?: string
  catholic?: string
  christian?: string
  hindu?: string
  jewish?: string
  agnostic?: string
  sikh?: string
  other?: string
  yes_all_the_time?: string
  yes_sometimes?: string
  not_very_much?: string
  no?: string
  never?: string
  i_some_sometimes?: string
  chain_smoker?: string
  i_drink_sometimes?: string
}


export interface LikedUserProfile {
  _id: number
  _uid: string
  status: number
  like: number
  created_at: string
  updated_at: string
  userFullName: string
  username: string
  userImageUrl: string
  userCoverUrl: string
  profilePicture: string
  userOnlineStatus: number
  gender: string
  dob: string
  userAge: number
  countryName: string
  isPremiumUser: boolean
  detailString: string
}

export interface LoggedInUser {
  authorization_token: string
  authorized: boolean
  reaction_code: number
  isProfileComplete: boolean
  profile: LoggedInUserProfile
  personnel: number
  timezone: boolean
  notifications: Notifications
}

export interface LoggedInUserProfile {
  _id: number
  _uid: string
  username: string
  full_name: string
  first_name: string
  last_name: string
  country: number
  email: string
  role_id: number
  role: string
  authority_id: number
  profile_picture: string
  profile_picture_url: string
  cover_picture_url: string
  about_me: any
  is_premium: boolean
  additional_user_info: AdditionalUserInfo
}

export interface AdditionalUserInfo {
  features_availability: FeaturesAvailability
  is_premium_only: IsPremiumOnly
}

export interface FeaturesAvailability {
  no_ads: boolean
}

export interface IsPremiumOnly {
  show_likes: boolean
}

export interface Notifications {
  notificationData: any[]
  notificationCount: number
}

export type BioDataForm = {
    first_name: string;
    last_name: string;
    mobile_number: string;
    birthday: string;
    gender: string;
    country_code: string;
};

