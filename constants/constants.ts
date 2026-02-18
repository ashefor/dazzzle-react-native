export const TOKEN_KEY = 'dazzzle-token';
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

export const countryCodes = [
    {
        "name": "Afghanistan",
        "phone_code": 93
    },
    {
        "name": "Albania",
        "phone_code": 355
    },
    {
        "name": "Algeria",
        "phone_code": 213
    },
    {
        "name": "American Samoa",
        "phone_code": 1684
    },
    {
        "name": "Andorra",
        "phone_code": 376
    },
    {
        "name": "Angola",
        "phone_code": 244
    },
    {
        "name": "Anguilla",
        "phone_code": 1264
    },
    {
        "name": "Antigua and Barbuda",
        "phone_code": 1268
    },
    {
        "name": "Argentina",
        "phone_code": 54
    },
    {
        "name": "Armenia",
        "phone_code": 374
    },
    {
        "name": "Aruba",
        "phone_code": 297
    },
    {
        "name": "Australia",
        "phone_code": 61
    },
    {
        "name": "Austria",
        "phone_code": 43
    },
    {
        "name": "Azerbaijan",
        "phone_code": 994
    },
    {
        "name": "Bahamas",
        "phone_code": 1242
    },
    {
        "name": "Bahrain",
        "phone_code": 973
    },
    {
        "name": "Bangladesh",
        "phone_code": 880
    },
    {
        "name": "Barbados",
        "phone_code": 1246
    },
    {
        "name": "Belarus",
        "phone_code": 375
    },
    {
        "name": "Belgium",
        "phone_code": 32
    },
    {
        "name": "Belize",
        "phone_code": 501
    },
    {
        "name": "Benin",
        "phone_code": 229
    },
    {
        "name": "Bermuda",
        "phone_code": 1441
    },
    {
        "name": "Bhutan",
        "phone_code": 975
    },
    {
        "name": "Bolivia",
        "phone_code": 591
    },
    {
        "name": "Bosnia and Herzegovina",
        "phone_code": 387
    },
    {
        "name": "Botswana",
        "phone_code": 267
    },
    {
        "name": "Brazil",
        "phone_code": 55
    },
    {
        "name": "British Indian Ocean Territory",
        "phone_code": 246
    },
    {
        "name": "Brunei Darussalam",
        "phone_code": 673
    },
    {
        "name": "Bulgaria",
        "phone_code": 359
    },
    {
        "name": "Burkina Faso",
        "phone_code": 226
    },
    {
        "name": "Burundi",
        "phone_code": 257
    },
    {
        "name": "Cambodia",
        "phone_code": 855
    },
    {
        "name": "Cameroon",
        "phone_code": 237
    },
    {
        "name": "Canada",
        "phone_code": 1
    },
    {
        "name": "Cape Verde",
        "phone_code": 238
    },
    {
        "name": "Cayman Islands",
        "phone_code": 1345
    },
    {
        "name": "Central African Republic",
        "phone_code": 236
    },
    {
        "name": "Chad",
        "phone_code": 235
    },
    {
        "name": "Chile",
        "phone_code": 56
    },
    {
        "name": "China",
        "phone_code": 86
    },
    {
        "name": "Christmas Island",
        "phone_code": 61
    },
    {
        "name": "Cocos (Keeling) Islands",
        "phone_code": 672
    },
    {
        "name": "Colombia",
        "phone_code": 57
    },
    {
        "name": "Comoros",
        "phone_code": 269
    },
    {
        "name": "Congo",
        "phone_code": 242
    },
    {
        "name": "Congo, the Democratic Republic of the",
        "phone_code": 243
    },
    {
        "name": "Cook Islands",
        "phone_code": 682
    },
    {
        "name": "Costa Rica",
        "phone_code": 506
    },
    {
        "name": "Cote D'Ivoire",
        "phone_code": 225
    },
    {
        "name": "Croatia",
        "phone_code": 385
    },
    {
        "name": "Cuba",
        "phone_code": 53
    },
    {
        "name": "Cyprus",
        "phone_code": 357
    },
    {
        "name": "Czech Republic",
        "phone_code": 420
    },
    {
        "name": "Denmark",
        "phone_code": 45
    },
    {
        "name": "Djibouti",
        "phone_code": 253
    },
    {
        "name": "Dominica",
        "phone_code": 1767
    },
    {
        "name": "Dominican Republic",
        "phone_code": 1809
    },
    {
        "name": "Ecuador",
        "phone_code": 593
    },
    {
        "name": "Egypt",
        "phone_code": 20
    },
    {
        "name": "El Salvador",
        "phone_code": 503
    },
    {
        "name": "Equatorial Guinea",
        "phone_code": 240
    },
    {
        "name": "Eritrea",
        "phone_code": 291
    },
    {
        "name": "Estonia",
        "phone_code": 372
    },
    {
        "name": "Ethiopia",
        "phone_code": 251
    },
    {
        "name": "Falkland Islands (Malvinas)",
        "phone_code": 500
    },
    {
        "name": "Faroe Islands",
        "phone_code": 298
    },
    {
        "name": "Fiji",
        "phone_code": 679
    },
    {
        "name": "Finland",
        "phone_code": 358
    },
    {
        "name": "France",
        "phone_code": 33
    },
    {
        "name": "French Guiana",
        "phone_code": 594
    },
    {
        "name": "French Polynesia",
        "phone_code": 689
    },
    {
        "name": "Gabon",
        "phone_code": 241
    },
    {
        "name": "Gambia",
        "phone_code": 220
    },
    {
        "name": "Georgia",
        "phone_code": 995
    },
    {
        "name": "Germany",
        "phone_code": 49
    },
    {
        "name": "Ghana",
        "phone_code": 233
    },
    {
        "name": "Gibraltar",
        "phone_code": 350
    },
    {
        "name": "Greece",
        "phone_code": 30
    },
    {
        "name": "Greenland",
        "phone_code": 299
    },
    {
        "name": "Grenada",
        "phone_code": 1473
    },
    {
        "name": "Guadeloupe",
        "phone_code": 590
    },
    {
        "name": "Guam",
        "phone_code": 1671
    },
    {
        "name": "Guatemala",
        "phone_code": 502
    },
    {
        "name": "Guinea",
        "phone_code": 224
    },
    {
        "name": "Guinea-Bissau",
        "phone_code": 245
    },
    {
        "name": "Guyana",
        "phone_code": 592
    },
    {
        "name": "Haiti",
        "phone_code": 509
    },
    {
        "name": "Holy See (Vatican City State)",
        "phone_code": 39
    },
    {
        "name": "Honduras",
        "phone_code": 504
    },
    {
        "name": "Hong Kong",
        "phone_code": 852
    },
    {
        "name": "Hungary",
        "phone_code": 36
    },
    {
        "name": "Iceland",
        "phone_code": 354
    },
    {
        "name": "India",
        "phone_code": 91
    },
    {
        "name": "Indonesia",
        "phone_code": 62
    },
    {
        "name": "Iran, Islamic Republic of",
        "phone_code": 98
    },
    {
        "name": "Iraq",
        "phone_code": 964
    },
    {
        "name": "Ireland",
        "phone_code": 353
    },
    {
        "name": "Israel",
        "phone_code": 972
    },
    {
        "name": "Italy",
        "phone_code": 39
    },
    {
        "name": "Jamaica",
        "phone_code": 1876
    },
    {
        "name": "Japan",
        "phone_code": 81
    },
    {
        "name": "Jordan",
        "phone_code": 962
    },
    {
        "name": "Kazakhstan",
        "phone_code": 7
    },
    {
        "name": "Kenya",
        "phone_code": 254
    },
    {
        "name": "Kiribati",
        "phone_code": 686
    },
    {
        "name": "Korea, Democratic People's Republic of",
        "phone_code": 850
    },
    {
        "name": "Korea, Republic of",
        "phone_code": 82
    },
    {
        "name": "Kuwait",
        "phone_code": 965
    },
    {
        "name": "Kyrgyzstan",
        "phone_code": 996
    },
    {
        "name": "Lao People's Democratic Republic",
        "phone_code": 856
    },
    {
        "name": "Latvia",
        "phone_code": 371
    },
    {
        "name": "Lebanon",
        "phone_code": 961
    },
    {
        "name": "Lesotho",
        "phone_code": 266
    },
    {
        "name": "Liberia",
        "phone_code": 231
    },
    {
        "name": "Libyan Arab Jamahiriya",
        "phone_code": 218
    },
    {
        "name": "Liechtenstein",
        "phone_code": 423
    },
    {
        "name": "Lithuania",
        "phone_code": 370
    },
    {
        "name": "Luxembourg",
        "phone_code": 352
    },
    {
        "name": "Macao",
        "phone_code": 853
    },
    {
        "name": "Macedonia, the Former Yugoslav Republic of",
        "phone_code": 389
    },
    {
        "name": "Madagascar",
        "phone_code": 261
    },
    {
        "name": "Malawi",
        "phone_code": 265
    },
    {
        "name": "Malaysia",
        "phone_code": 60
    },
    {
        "name": "Maldives",
        "phone_code": 960
    },
    {
        "name": "Mali",
        "phone_code": 223
    },
    {
        "name": "Malta",
        "phone_code": 356
    },
    {
        "name": "Marshall Islands",
        "phone_code": 692
    },
    {
        "name": "Martinique",
        "phone_code": 596
    },
    {
        "name": "Mauritania",
        "phone_code": 222
    },
    {
        "name": "Mauritius",
        "phone_code": 230
    },
    {
        "name": "Mayotte",
        "phone_code": 269
    },
    {
        "name": "Mexico",
        "phone_code": 52
    },
    {
        "name": "Micronesia, Federated States of",
        "phone_code": 691
    },
    {
        "name": "Moldova, Republic of",
        "phone_code": 373
    },
    {
        "name": "Monaco",
        "phone_code": 377
    },
    {
        "name": "Mongolia",
        "phone_code": 976
    },
    {
        "name": "Montserrat",
        "phone_code": 1664
    },
    {
        "name": "Morocco",
        "phone_code": 212
    },
    {
        "name": "Mozambique",
        "phone_code": 258
    },
    {
        "name": "Myanmar",
        "phone_code": 95
    },
    {
        "name": "Namibia",
        "phone_code": 264
    },
    {
        "name": "Nauru",
        "phone_code": 674
    },
    {
        "name": "Nepal",
        "phone_code": 977
    },
    {
        "name": "Netherlands",
        "phone_code": 31
    },
    {
        "name": "Netherlands Antilles",
        "phone_code": 599
    },
    {
        "name": "New Caledonia",
        "phone_code": 687
    },
    {
        "name": "New Zealand",
        "phone_code": 64
    },
    {
        "name": "Nicaragua",
        "phone_code": 505
    },
    {
        "name": "Niger",
        "phone_code": 227
    },
    {
        "name": "Nigeria",
        "phone_code": 234
    },
    {
        "name": "Niue",
        "phone_code": 683
    },
    {
        "name": "Norfolk Island",
        "phone_code": 672
    },
    {
        "name": "Northern Mariana Islands",
        "phone_code": 1670
    },
    {
        "name": "Norway",
        "phone_code": 47
    },
    {
        "name": "Oman",
        "phone_code": 968
    },
    {
        "name": "Pakistan",
        "phone_code": 92
    },
    {
        "name": "Palau",
        "phone_code": 680
    },
    {
        "name": "Palestinian Territory, Occupied",
        "phone_code": 970
    },
    {
        "name": "Panama",
        "phone_code": 507
    },
    {
        "name": "Papua New Guinea",
        "phone_code": 675
    },
    {
        "name": "Paraguay",
        "phone_code": 595
    },
    {
        "name": "Peru",
        "phone_code": 51
    },
    {
        "name": "Philippines",
        "phone_code": 63
    },
    {
        "name": "Poland",
        "phone_code": 48
    },
    {
        "name": "Portugal",
        "phone_code": 351
    },
    {
        "name": "Puerto Rico",
        "phone_code": 1787
    },
    {
        "name": "Qatar",
        "phone_code": 974
    },
    {
        "name": "Reunion",
        "phone_code": 262
    },
    {
        "name": "Romania",
        "phone_code": 40
    },
    {
        "name": "Russian Federation",
        "phone_code": 7
    },
    {
        "name": "Rwanda",
        "phone_code": 250
    },
    {
        "name": "Saint Helena",
        "phone_code": 290
    },
    {
        "name": "Saint Kitts and Nevis",
        "phone_code": 1869
    },
    {
        "name": "Saint Lucia",
        "phone_code": 1758
    },
    {
        "name": "Saint Pierre and Miquelon",
        "phone_code": 508
    },
    {
        "name": "Saint Vincent and the Grenadines",
        "phone_code": 1784
    },
    {
        "name": "Samoa",
        "phone_code": 684
    },
    {
        "name": "San Marino",
        "phone_code": 378
    },
    {
        "name": "Sao Tome and Principe",
        "phone_code": 239
    },
    {
        "name": "Saudi Arabia",
        "phone_code": 966
    },
    {
        "name": "Senegal",
        "phone_code": 221
    },
    {
        "name": "Seychelles",
        "phone_code": 248
    },
    {
        "name": "Sierra Leone",
        "phone_code": 232
    },
    {
        "name": "Singapore",
        "phone_code": 65
    },
    {
        "name": "Slovakia",
        "phone_code": 421
    },
    {
        "name": "Slovenia",
        "phone_code": 386
    },
    {
        "name": "Solomon Islands",
        "phone_code": 677
    },
    {
        "name": "Somalia",
        "phone_code": 252
    },
    {
        "name": "South Africa",
        "phone_code": 27
    },
    {
        "name": "Spain",
        "phone_code": 34
    },
    {
        "name": "Sri Lanka",
        "phone_code": 94
    },
    {
        "name": "Sudan",
        "phone_code": 249
    },
    {
        "name": "Suriname",
        "phone_code": 597
    },
    {
        "name": "Svalbard and Jan Mayen",
        "phone_code": 47
    },
    {
        "name": "Swaziland",
        "phone_code": 268
    },
    {
        "name": "Sweden",
        "phone_code": 46
    },
    {
        "name": "Switzerland",
        "phone_code": 41
    },
    {
        "name": "Syrian Arab Republic",
        "phone_code": 963
    },
    {
        "name": "Taiwan, Province of China",
        "phone_code": 886
    },
    {
        "name": "Tajikistan",
        "phone_code": 992
    },
    {
        "name": "Tanzania, United Republic of",
        "phone_code": 255
    },
    {
        "name": "Thailand",
        "phone_code": 66
    },
    {
        "name": "Timor-Leste",
        "phone_code": 670
    },
    {
        "name": "Togo",
        "phone_code": 228
    },
    {
        "name": "Tokelau",
        "phone_code": 690
    },
    {
        "name": "Tonga",
        "phone_code": 676
    },
    {
        "name": "Trinidad and Tobago",
        "phone_code": 1868
    },
    {
        "name": "Tunisia",
        "phone_code": 216
    },
    {
        "name": "Turkey",
        "phone_code": 90
    },
    {
        "name": "Turkmenistan",
        "phone_code": 7370
    },
    {
        "name": "Turks and Caicos Islands",
        "phone_code": 1649
    },
    {
        "name": "Tuvalu",
        "phone_code": 688
    },
    {
        "name": "Uganda",
        "phone_code": 256
    },
    {
        "name": "Ukraine",
        "phone_code": 380
    },
    {
        "name": "United Arab Emirates",
        "phone_code": 971
    },
    {
        "name": "United Kingdom",
        "phone_code": 44
    },
    {
        "name": "United States",
        "phone_code": 1
    },
    {
        "name": "United States Minor Outlying Islands",
        "phone_code": 1
    },
    {
        "name": "Uruguay",
        "phone_code": 598
    },
    {
        "name": "Uzbekistan",
        "phone_code": 998
    },
    {
        "name": "Vanuatu",
        "phone_code": 678
    },
    {
        "name": "Venezuela",
        "phone_code": 58
    },
    {
        "name": "Viet Nam",
        "phone_code": 84
    },
    {
        "name": "Virgin Islands, British",
        "phone_code": 1284
    },
    {
        "name": "Virgin Islands, U.s.",
        "phone_code": 1340
    },
    {
        "name": "Wallis and Futuna",
        "phone_code": 681
    },
    {
        "name": "Western Sahara",
        "phone_code": 212
    },
    {
        "name": "Yemen",
        "phone_code": 967
    },
    {
        "name": "Zambia",
        "phone_code": 260
    },
    {
        "name": "Zimbabwe",
        "phone_code": 263
    },
    {
        "name": "Serbia",
        "phone_code": 381
    },
    {
        "name": "Montenegro",
        "phone_code": 382
    },
    {
        "name": "Aland Islands",
        "phone_code": 358
    },
    {
        "name": "Bonaire, Sint Eustatius and Saba",
        "phone_code": 599
    },
    {
        "name": "Curacao",
        "phone_code": 599
    },
    {
        "name": "Guernsey",
        "phone_code": 44
    },
    {
        "name": "Isle of Man",
        "phone_code": 44
    },
    {
        "name": "Jersey",
        "phone_code": 44
    },
    {
        "name": "Kosovo",
        "phone_code": 381
    },
    {
        "name": "Saint Barthelemy",
        "phone_code": 590
    },
    {
        "name": "Saint Martin",
        "phone_code": 590
    },
    {
        "name": "Sint Maarten",
        "phone_code": 1
    },
    {
        "name": "South Sudan",
        "phone_code": 211
    }
]

export const genders = [
    {
        "id": 1,
        "value": "Male"
    },
    {
        "id": 2,
        "value": "Female"
    },
    {
        "id": 3,
        "value": "Secret"
    }
]

export const defaultInterests = [
  { "id": 1, "value": "Pets" },
  { "id": 2, "value": "Exercise" },
  { "id": 3, "value": "Dancing" },
  { "id": 4, "value": "Cooking" },
  { "id": 5, "value": "Politics" },
  { "id": 6, "value": "Sport" },
  { "id": 7, "value": "Photography" },
  { "id": 8, "value": "Art" },
  { "id": 9, "value": "Learning" },
  { "id": 10, "value": "Music" },
  { "id": 11, "value": "Movies" },
  { "id": 12, "value": "Books" },
  { "id": 13, "value": "Gaming" },
  { "id": 14, "value": "Food" },
  { "id": 15, "value": "Fashion" },
  { "id": 16, "value": "Technology" },
  { "id": 17, "value": "Science" },
  { "id": 18, "value": "Health" },
  { "id": 19, "value": "Business" },
  { "id": 20, "value": "Writing" },
  { "id": 21, "value": "Blogging" },
  { "id": 22, "value": "Languages" },
  { "id": 23, "value": "Travel" },
  { "id": 24, "value": "Yoga" },
  { "id": 25, "value": "Volunteering" },
  { "id": 26, "value": "Singing" },
  { "id": 27, "value": "Jokes" },
  { "id": 28, "value": "Shopping" },
  { "id": 29, "value": "Social Media" },
  { "id": 30, "value": "Video Games" }
]


export const INPUT_MAX_HEIGHT = 80;
export const CONNECTION_STATE_HEIGHT = 24;
