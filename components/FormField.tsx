import { Text, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';
import React, { useCallback, useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import Animated, { FadeIn } from 'react-native-reanimated';

interface CustomTextInputProps extends Omit<TextInputProps, 'style'> {
  title: string;
  value: string;
  touched?: boolean;
  errorMessage?: string | null;
  secureTextEntry?: boolean;
  containerStyle?: string;
  editable?: boolean;
}

const ERROR_COLOR = '#8E1F0B';
const FOCUS_COLOR = '#DD3FE5';

const FormField: React.FC<CustomTextInputProps> = ({
  title,
  onChangeText,
  secureTextEntry = false,
  containerStyle = '',
  errorMessage,
  onBlur,
  value,
  touched = false,
  editable = true,
  ...restProps // This contains textContentType, autoComplete, etc.
}) => {
  const [isSecureTextEntry, setIsSecureTextEntry] = useState<boolean>(true);
  const [isFocused, setIsFocused] = useState(false);

  // Error Logic: Show error if touched exists and there is an error message
  const hasError = touched && !!errorMessage;

  const borderColor = hasError ? ERROR_COLOR : isFocused ? FOCUS_COLOR : '#cccccc80';
  const labelColor = hasError ? ERROR_COLOR : isFocused ? FOCUS_COLOR : '#333';

  const handleFocus = useCallback(() => setIsFocused(true), []);

  const handleBlur = useCallback<NonNullable<TextInputProps['onBlur']>>((e) => {
    setIsFocused(false);
    onBlur?.(e);
  }, [onBlur]);

  const toggleSecureEntry = useCallback(() => setIsSecureTextEntry((current) => !current), []);

  return (
    <View className='space-y-1'>
      <View className={`w-full space-y-2 ${containerStyle} ${editable ? '' : 'opacity-80'}`}>
        {title && (
          <Text
            className="text-black text-sm font-firamedium"
            style={{ color: labelColor }}
          >
            {title}
          </Text>
        )}

        <View
          className='border h-14 w-full px-4 bg-[#F2F2F7] rounded-xl items-center flex-row'
          style={{ borderColor }}
        >
          <TextInput
            className='flex-1 h-full font-firaregular text-black text-sm'
            value={value}
            onChangeText={onChangeText}
            onBlur={handleBlur}
            onFocus={handleFocus}
            editable={editable}
            placeholderTextColor={"#5B5B5B3A"}
            selectionColor={FOCUS_COLOR}
            secureTextEntry={secureTextEntry && isSecureTextEntry}
            autoCapitalize="none"
            // Important: This ensures autofill props passed from parent are applied
            {...restProps}
          />

          {secureTextEntry && (
            <TouchableOpacity onPress={toggleSecureEntry}>
              <Ionicons
                name={isSecureTextEntry ? "eye-outline" : "eye-off-outline"}
                size={20}
                color="black"
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Error Message */}
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
