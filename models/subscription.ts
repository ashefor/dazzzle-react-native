export interface SubscriptionResponse {
    isPremiumUser: boolean
    isPremiumUserExpired: boolean
    userSubscriptionData: UserSubscriptionData
    premiumPlans: PremiumPlans
    creditPlans: CreditPlan[]
    premiumFeature: PremiumFeature
  }
  
  export interface UserSubscriptionData {
    _id: number
    _uid: string
    created_at: string
    users__id: number
    expiry_at: string
    credit_wallet_transactions__id: number
    debitedCredits: number
    plan_id: string
    planTitle: string
    planPrice: string
    long_expiry: boolean
  }
  
  export interface PremiumPlans {
    one_day: OneDay
    one_week: OneWeek
    one_month: OneMonth
    half_year: HalfYear
    year: Year
    life_time: LifeTime
  }
  
  export interface OneDay {
    title: string
    enable: boolean
    price: string
  }
  
  export interface OneWeek {
    title: string
    enable: boolean
    price: string
  }
  
  export interface OneMonth {
    title: string
    enable: boolean
    price: string
  }
  
  export interface HalfYear {
    title: string
    enable: boolean
    price: string
  }
  
  export interface Year {
    title: string
    enable: boolean
    price: string
  }
  
  export interface LifeTime {
    title: string
    enable: boolean
    price: string
  }
  
  export interface CreditPlan {
    _id: number
    _uid: string
    created_at: string
    updated_at: string
    status: number
    title: string
    credits: number
    price: string
    image: string
    is_subscription_package: number
    users__id: number
  }
  
  export interface PremiumFeature {
    no_adds: PremiumFeatureType
    browse_incognito_mode: PremiumFeatureType
    show_like: PremiumFeatureType
    user_encounter: PremiumFeatureType
    // audio_call_via_messenger: AudioCallViaMessenger
    // video_call_via_messenger: VideoCallViaMessenger
  }
  
  export interface PremiumFeatureType {
    title: string
    enable: boolean
    select_user: string
    icon: string
    options: Option[]
  }
  
  export interface Option {
    value: string
    label: string
  }
  
  export interface AudioCallViaMessenger {
    select_user: string
  }
  
  export interface VideoCallViaMessenger {
    select_user: string
  }

  export interface CreatePaystackOrderResponse {
    email: string
    first_name: string
    last_name: string
    packageUid: string
    reference: string
    package_name: string
    amount: number
    currency: string
    order_id: string
  }

  export interface WalletTransaction {
    _id: number
    _uid: string
    created_at: string
    credits: number
    credit_type: any
    transactionType: number
    formattedTransactionType: string
    financialTransactionDetail: any[]
  }
  
  
  // ...existing code...

// ── iOS IAP ───────────────────────────────────────────────────────────────────

export interface IAPValidationPayload {
  productId: string;
  transactionId: string | null;
  /** Base-64 encoded App Store receipt */
  transactionReceipt: string | null | undefined;
  /** Plan UID resolved from IAP_PRODUCT_TO_PLAN_UID */
  planUid: string;
}

export interface IAPValidationResponse {
  reaction: string;
  message: string;
}