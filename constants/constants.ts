export const TOKEN_KEY = 'dazzzle-access-token';
export const USER_KEY = 'dazzzle-user';
export const FCM_TOKEN = 'dazzzle-fcm-token';
export const REFRESH_TOKEN = 'dazzzle-access-token-refresh';
export const USE_BIOMETRICS = 'dazzzle-use-biometrics';
// export const GMAPS_API_KEY = 'dazzzle-gmaps-api-key';
// export const GMAPS_API_KEY = 'AIzaSyA4B2t-wfTGUClRl6FxE9Y5fFFYgyo6ems';
export const GOOGLE_MAPS_API_KEY = 'AIzaSyACkmHiKXczRqjk8clNErV4XFrxVahjrvU';
export const CREDENTIALS_KEY = 'dazzzle-credentials';
export const API_URL = 'https://dazzzle.org/api';

interface Item {
    id: number;
    value: string;
}

export const relationshipStatusOptions: Item[] = [
    {
        id: 1,
        value: 'Single'
    },
    {
        id: 2,
        value: 'Married'
    },
    {
        id: 3,
        value: 'Divorced'
    },
    {
        id: 4,
        value: 'Widowed'
    }
]

export const workStatusOptions: Item[] = [
    { id: 1, value: "Studying" },
    { id: 2, value: "Working" },
    { id: 3, value: "Looking for work" },
    { id: 4, value: "Retired" },
    { id: 5, value: "Self-Employed" },
    { id: 6, value: "Other" }
];

export const educationOptions: Item[] = [
    { id: 1, value: "Secondary school" },
    { id: 2, value: "ITI" },
    { id: 3, value: "College" },
    { id: 4, value: "University" },
    { id: 5, value: "Advanced degree" },
    { id: 6, value: "Other" }
];

export const preferredLanguageOptions: Item[] = [
    { id: 1, value: "English" },
    { id: 2, value: "Arabic" },
    { id: 3, value: "Dutch" },
    { id: 4, value: "French" },
    { id: 5, value: "German" },
    { id: 6, value: "Italian" },
    { id: 7, value: "Portuguese" },
    { id: 8, value: "Russian" },
    { id: 9, value: "Spanish" },
    { id: 10, value: "Turkish" },
    { id: 11, value: "Urdu" },
    { id: 12, value: "Hindi" },
    { id: 13, value: "Marathi" },
    { id: 14, value: "Chinese" },
    { id: 15, value: "Japanese" },
    { id: 16, value: "Bengali" },
    { id: 17, value: "Persian" },
    { id: 18, value: "Korean" },
    { id: 19, value: "Tamil" },
    { id: 20, value: "Hausa" },
    { id: 21, value: "Indonesian" },
    { id: 22, value: "Panjabi" }
];
