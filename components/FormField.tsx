import { NativeSyntheticEvent, StyleProp, Text, TextInput, TextInputFocusEventData, TextInputProps, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import Animated, { FadeIn } from 'react-native-reanimated';

interface CustomTextInputProps extends Omit<TextInputProps, 'style'> {
  title: string;
  value: string;
  // New prop: we explicitly ask if the field has been touched
  touched?: boolean;
  // If this string exists, we assume there is an error
  errorMessage?: string | null; 
  secureTextEntry?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  labelStyle?: StyleProp<TextStyle>;
  editable?: boolean;
}

const FormField: React.FC<CustomTextInputProps> = ({
  title,
  onChangeText,
  secureTextEntry = false,
  containerStyle,
  errorMessage,
  onBlur,
  value,
  touched = false, // Default to false
  editable = true,
  ...restProps
}) => {
  const [isSecureTextEntry, setIsSecureTextEntry] = React.useState<boolean>(true);
  const [isFocused, setIsFocused] = React.useState(false);

  // Derived state: An error exists if the field has been touched AND there is an error message
  const hasError = touched && !!errorMessage;

  const labelColor = "#333";

  function getBorderColor() {
    if (hasError) return '#8E1F0B';
    if (isFocused) return "#DD3FE5";
    return "#cccccc80";
  }

  function getLabelColor() {
    if (hasError) return '#8E1F0B';
    if (isFocused) return "#DD3FE5";
    return labelColor;
  }

  const handleFocus = () => setIsFocused(true);

  const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setIsFocused(false);
    // Directly call the parent's onBlur (Formik's handleBlur)
    onBlur && onBlur(e);
  };

  return (
    <View className='space-y-1'>
      <View className={`w-full space-y-2 ${containerStyle} ${editable ? '' : 'opacity-80'}`}>
        {title && (
          <Text 
            className="text-black text-sm font-firamedium" 
            style={{ color: getLabelColor() }}
          >
            {title}
          </Text>
        )}
        
        <View 
          className='border h-14 w-full px-4 bg-[#F2F2F7] rounded-xl items-center flex-row' 
          style={{ borderColor: getBorderColor() }}
        >
          <TextInput
            className='flex-1 h-full font-firaregular text-black text-sm'
            value={value}
            onChangeText={onChangeText}
            onBlur={handleBlur}
            onFocus={handleFocus}
            editable={editable}
            placeholderTextColor={"#5B5B5B3A"}
            selectionColor={'#DD3FE5'}
            secureTextEntry={secureTextEntry && isSecureTextEntry}
            autoCapitalize="none"
            {...restProps}
          />
          
          {secureTextEntry && (
            <TouchableOpacity onPress={() => setIsSecureTextEntry(!isSecureTextEntry)}>
              <Ionicons 
                name={isSecureTextEntry ? "eye-outline" : "eye-off-outline"} 
                size={20} 
                color="black" 
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Only show error if hasError is true */}
      {hasError && (
        <Animated.View entering={FadeIn} className='flex-row gap-x-2 items-center'>
          <Text className='text-xs text-red-500 font-firaregular'>
            {errorMessage}
          </Text>
        </Animated.View>
      )}
    </View>
  );
};

export default FormField;