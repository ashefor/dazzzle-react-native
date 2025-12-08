import { NativeSyntheticEvent, StyleProp, Text, TextInput, TextInputFocusEventData, TextInputProps, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import Animated from 'react-native-reanimated';


interface CustomTextInputProps extends Omit<TextInputProps, 'style'> {
  title: string;
  leftIcon?: React.ReactElement | null;
  secureTextEntry?: boolean;
  errorMessage?: string | null;
  showCustomError?: boolean;
  containerStyle?: StyleProp<ViewStyle> | undefined;
  inputStyle?: StyleProp<TextStyle> | undefined;
  labelStyle?: StyleProp<TextStyle> | undefined;
  value: string, isValid?: boolean,
  showErrorIcon?: boolean;
}


const FormField: React.FC<CustomTextInputProps> = ({
  title,
  leftIcon,
  onChangeText,
  secureTextEntry = false,
  placeholder,
  containerStyle,
  inputStyle,
  labelStyle,
  showCustomError,
  errorMessage,
  onBlur,
  value,
  isValid,
  editable,
  showErrorIcon,
  ...restProps
}) => {
  const [isTouched, setIsTouched] = React.useState<boolean>(false);
  const [isSecureTextEntry, setIsSecureTextEntry] = React.useState<boolean>(true);
  const [isFocused, setIsFocused] = React.useState(false);

  const labelColor = "#333";

  function getBorderColor() {
    if (!isTouched) return "#cccccc80";
    if (isFocused) return "#DD3FE5";
    return showError() ? '#8E1F0B' : "#cccccc80";
  }

  function getLabelColor() {
    if (!isTouched) return labelColor;
    if (isFocused) return "#DD3FE5";
    return showError() ? '#8E1F0B' : labelColor;
  }

  function getTextColor() {
    if (!isTouched) return "#303030";
    return showError() ? '#8E1F0B' : "#303030";
  }

  function showError() {
    return showCustomError != undefined ? showCustomError && isTouched : (!isValid) && isTouched;
  }

  const handleFocus = () => setIsFocused(true);

  const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setIsTouched(true);
    setIsFocused(false);
    onBlur && onBlur(e);
  };

  return (
    <View className=' space-y-1'>
      <View className={`w-full space-y-2 ${containerStyle} ${editable ? '': 'opacity-80'}`}>
        {title && <Text className="text-black text-sm font-firamedium" style={{ color: getLabelColor() }}>{title}</Text>}
        <View className='border h-14 w-full px-4 bg-[#F2F2F7] rounded-xl focus:border-primary items-center flex-row' style={{ borderColor: getBorderColor() }}>
          <TextInput
            // style={{ lineHeight: Platform.OS == 'ios' ? 0 : undefined }}
            className='flex-1 h-full font-firaregular text-black text-sm'
            value={value}
            onChangeText={onChangeText}
            onBlur={handleBlur}
            onFocus={handleFocus}
            autoComplete='off'
            autoCorrect={false}
            autoCapitalize="none"
            importantForAutofill='no'
            placeholderTextColor={"#5B5B5B3A"}
            selectionColor={'#DD3FE5'}
            secureTextEntry={secureTextEntry && isSecureTextEntry}
            {...restProps}
          />
          {(secureTextEntry) && (
            <TouchableOpacity onPress={() => setIsSecureTextEntry(!isSecureTextEntry)}>
              <Ionicons name={isSecureTextEntry ? "eye-outline" : "eye-off-outline"} size={20} color="black" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      {showError() && (
        <Animated.View className='flex-row gap-x-2 items-center'>
          <Text className='text-xs text-red-500 font-firaregular'>
            {errorMessage ? errorMessage : 'Invalid input'}
          </Text>
        </Animated.View>
      )}
    </View>
  )
}

export default FormField