import { AuthInfo } from "./user";

export const ReactionCodes = Object.freeze({
  SUCCESS: 1,
  ERROR: 2,
  VALIDATION_ERROR: 3,
  CLIENT_SIDE_VALIDATION: 4,
  UNAUTHORIZED_AREA: 5,
  INVALID_ACCESS_LEVEL: 6,
  INVALID_REQUEST: 7,
  NOT_FOUND: 8,
  NOT_AUTHENTICATED: 9,
  AUTHENTICATED: 10,
  ACCESS_DENIED: 11,
  EMAIL_SENT: 12,
  EMAIL_NOT_SENT: 13,
  NO_CHANGES: 14,
  UPLOADING: 15,
  UPLOADING_SUCCESS: 16,
  UPLOADING_ERROR: 17,
  RECORDS_NOT_EXIST: 18,
  SERVER_SIDE_UNHANDLED_ERRORS: 19,
  REQUEST_TOKEN_MISMATCH: 20,
  REDIRECT: 21, // Data should contain the key redirect_to
  RESTRICTION_IMPOSED: 22, // For restrictions like subscription restriction etc
  DEBUG: 23
});

export interface AppGeneralState {
  user?: AuthInfo;
  token?: string | null;
  refresh_token?: string | null;
  showBiometricsAuth: boolean;
  hasBiometricsAuth: boolean;
  generalConfigSettings: BasicAppInterface | undefined
}

export interface ApiResponse {
  response_token: number;
  reaction: typeof ReactionCodes[keyof typeof ReactionCodes];
  incident: any | null; // Adjust type as needed
  client_models: [],
}

export interface UserGender {
  id: number;
  value: string;
}

export interface RelationshipType {
  id: number;
  value: string;
}

export interface Interest {
  id: number;
  value: string;
}

export interface CountryPhoneCode {
  name: string;
  phone_code: number;
}

export interface BasicAppInterface {
  privacy_policy_url: string;
  terms_and_conditions_url: string;
  age_restrictions: {
    min: string;
    max: string
  },
  genders: UserGender[],
  relationship_types: RelationshipType[],
  interests: Interest[],
  country_phone_codes: CountryPhoneCode[]
}

export interface BasicAppInterfaceResponse extends ApiResponse {
  data: BasicAppInterface;
}

export interface SuccessReponse {
  incident: any | null;
  message: string;
}

export interface GenericSuccessReponse extends ApiResponse {
  data: SuccessReponse;
}

export interface PlaceAutocompletePrediction {
    description: string;
    matched_substrings: Array<{
        length: number;
        offset: number;
    }>;
    place_id: string;
    reference: string;
    structured_formatting: {
        main_text: string;
        main_text_matched_substrings: Array<{
            length: number;
            offset: number;
        }>;
        secondary_text: string;
    };
    terms: Array<{
        offset: number;
        value: string;
    }>;
    types: string[];
}

export interface FormattedAddress {
    streetNumber?: string;
    streetName: string;
    unitNumber?: string; // usually from user input
    city: string;
    state: string;
    postalCode?: string;
    country: string;
    latitude: number;
    longitude: number;
    address: string; // original formatted address or description
}

export interface PlaceDetails {
    address_components: AddressComponent[];
    adr_address: string;
    geometry: {
        location: {
            lat: number;
            lng: number;
        };
        viewport: {
            northeast: {
                lat: number;
                lng: number;
            };
            southwest: {
                lat: number;
                lng: number;
            };
        };
    };
    name: string;
    place_id: string;
}

export interface AddressComponent {
    long_name: string;
    short_name: string;
    types: string[]; // You can restrict this with specific string union types if needed
}
