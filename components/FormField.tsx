import { Image, InputModeOptions, Platform, ReturnKeyType, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import Icons from '@/constants/icons';
import Ionicons from '@expo/vector-icons/Ionicons';

const FormField = ({title, value, handleChangeText, otherStyles, keyBoardType, returnKeyType, placeholder, ...props}: {title?: string, value?: string, handleChangeText: (value: string) => void, otherStyles?: string, keyBoardType?: InputModeOptions, returnKeyType?: ReturnKeyType, placeholder?: string}) => {
    const [showPassword, setShowPassword] = useState(false);

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      {title && <Text className='text-base text-white font-firamedium'>{title}</Text>}
      <View className='border border-transparent w-full px-4 bg-[#5B5B5B] rounded-md focus:border-secondary items-center flex-row'>
        <TextInput
        style={{lineHeight: Platform.OS == 'ios' ? 0 : undefined}}
        className='flex-1 h-12 font-firaregular text-white text-base'
        value={value}
        inputMode={keyBoardType || 'text'}
        onChangeText={handleChangeText}
        placeholder={placeholder}
        placeholderTextColor={"#fbfbfb73"}
        selectionColor={'#DD3FE5'}
        returnKeyType={returnKeyType || 'done'}
        secureTextEntry={title === 'Password' && !showPassword}
        {...props}
        />
        {title === 'Password' && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}> 
          <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={24} color="white" />
            {/* <Image source={showPassword ? Icons.eye : Icons.eyeHide} className='w-6 h-6' resizeMode='contain'/> */}
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

export default FormField