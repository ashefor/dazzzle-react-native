import { Dimensions } from "react-native";

const { width, height } = Dimensions.get('window');
    // const CARD_WIDTH = width * 0.9;
    // const CARD_HEIGHT = height * 0.6;

// 1. Define constraints
const MAX_TABLET_WIDTH = 500; // Max width for iPad/Tablets so cards don't look like giant squares
const MAX_HEIGHT_PERCENTAGE = 0.65; // Card stack should never exceed 65% of screen height

// 2. Calculate Responsive Width
// On phone: uses (Screen - 32). On Tablet: uses 500.
const responsiveCardWidth = Math.min(width - 32, MAX_TABLET_WIDTH);

// 3. Calculate Height
// First, try the ideal aspect ratio (1.25)
const idealHeight = responsiveCardWidth * 1.25;

// Second, cap it at 65% of the screen height to ensure it fits on short devices
export const CARD_HEIGHT = Math.round(Math.min(idealHeight, height * MAX_HEIGHT_PERCENTAGE));

// (Optional) You can export CARD_WIDTH if your components need it
export const CARD_WIDTH = responsiveCardWidth;

export const arrayToObject = (data: any) => {
    const result: any = {};
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            const itemsArray = data[key].items;
            const convertedObject: any = {};
            itemsArray.forEach((item: any) => {
                convertedObject[item.label] = item.value;
            });
            result[key] = convertedObject;
        }
    }
    return result;
}

export const getRandomUniqueId = () => {
        const randomId = Math.floor(Math.random() * 1000000).toString();
        return randomId;
    };

export const convertObjectToSelectPickerArray = (obj: any) : {id: string, value: string}[] => {
    return Object.entries(obj).map(([key, value]) => ({
        id: key,
        value: String(value)
    }));
}

/**
 * Helper function that checks if supplied parameter is an object type or not.
 * @param {any} data - Represents the data to run check on.
 * @returns {boolean} - Returns true if supplied parameter (data) is an object or false if it's not.
 */
export const isObject = (data: unknown) => {
  return (
    typeof data === "object" &&
    Object.prototype.toString.call(data) ===
      "[object Object]"
  );
};

/**
 * Helper function that checks if supplied parameter is an array or not.
 * @param {any} data - Represents the data to run check on.
 * @returns {boolean} - Returns true if supplied parameter (data) is an array or false if it's not.
 */
export const isArray = (data: unknown) => {
  return (
    (typeof data === "object" &&
      Object.prototype.toString.call(data) === "[object Array]") ||
    Array.isArray(data)
  );
};

/**
 * Helper function that checks if supplied parameter is a string type or not.
 * @param {any} data - Represents the data to run check on.
 * @returns {boolean} - Returns true if supplied parameter (data) is a string or false if it's not.
 */
export const isString = (data: unknown) => {
  return typeof data === "string";
};

/**
 * Helper function that checks if supplied parameter is a number type or not.
 * @param {any} value - Represents the data to run check on.
 * @returns {boolean} - Returns true if supplied parameter (data) is a number or false if it's not.
 */
export const isNumber = (value: unknown) => {
  try {
    return (
      typeof value === "number" &&
      value === value &&
      value !== Infinity &&
      value !== -Infinity
    );
  } catch (err) {
    return false;
  }
};

/**
 * Helper function that checks if supplied parameter is a boolean type or not.
 * @param {any} data - Represents the data to run check on.
 * @returns {boolean} - Returns true if supplied parameter (data) is a boolean type or false if it's not.
 */
export const isBoolean = (data: unknown) => {
  return typeof data === "boolean" || data === true || data === false;
};





/**
 * Helper function that checks if supplied parameter is undefined type or not.
 * @param {any} data - Represents the data to run check on.
 * @returns {boolean} - Returns true if supplied parameter (data) is undefined or false if it's not.
 */
export const isUndefined = (data: unknown = null) => {
  return typeof data === "undefined" || data == undefined ? true : false;
};

/**
 * Helper function that checks if supplied parameter is defined or not.
 * @param {any} data - Represents the data to run check on.
 * @returns {boolean} - Returns true if supplied parameter (data) is defined or false if it's not.
 */
export const isDefined = (data: unknown) => {
  return typeof data !== "undefined";
};

/**
 * Helper function that checks if supplied parameter is null type or not.
 * @param {any} data - Represents the data to run check on. Accepts international numbers too
 * @returns {boolean} - Returns true if supplied parameter (data) is a valid phone number or false if it's not.
 */
export const isNull = (data: unknown) => {
  return data == null || false;
};

/**
 * Cloned Helper function that checks if supplied parameter is empty (has no value) or not.
 * Cloned from the isEmpty() function
 * @param {any} data - Represents the data to run check on.
 * @returns {boolean} - Returns true if supplied parameter (data) is empty or false if it's not.
 */
export let empty = (data: unknown) => {
  return isEmpty(data);
};

/**
 * Helper function that checks if supplied parameter is empty (has no value) or not.
 * @param {any} data - Represents the data to run check on.
 * @returns {boolean} - Returns true if supplied parameter (data) is empty or false if it's not.
 */
export const isEmpty = (data: any) => {
  let returnValue = false;
  if (isString(data) && (data === "" || data.trim() === "")) returnValue = true;
  else if (isNumber(data) && data === 0) returnValue = true;
  else if (isBoolean(data) && data === false) returnValue = true;
  else if (isObject(data) && Object.values(data).length === 0) returnValue = true;
  else if (isArray(data) && data.length === 0) returnValue = true;
  else if (isUndefined(data)) returnValue = true;
  else if (isNull(data)) returnValue = true;

  return returnValue;
};
