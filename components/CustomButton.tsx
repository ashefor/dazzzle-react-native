import { Text, View, TouchableOpacity, StyleSheet } from 'react-native'
import React, { forwardRef } from 'react'
import { LinearGradient } from 'expo-linear-gradient';
const CustomButton = forwardRef<typeof TouchableOpacity, {
    title: string;
    handlePress: () => void;
    containerStyles?: string;
    textStyles?: string;
    isLoading?: boolean;
}>((props, ref) => {
    const { title, handlePress, containerStyles, textStyles, isLoading } = props
    return (
        <TouchableOpacity 
        onPress={handlePress}
        activeOpacity={0.7}
        disabled={isLoading}
        className={`min-h-[44px] ${containerStyles} ${isLoading ? 'opacity-50' : ''}`}>
            <LinearGradient
            colors={["#DD3FE5", "#3D58F1"]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            locations={[0.2075, 1]} // Convert 20.75% and 100% to decimals
        className='flex-1 w-full flex items-center justify-center rounded-lg'
          >
          <Text className={`text-white font-firamedium text-base ${textStyles}`}>
                {title}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
    )
})

export default CustomButton

const styles = StyleSheet.create({
    gradient: {
        // flex: 1,
      },
      background: {
        // position: 'absolute',
        
        // zIndex: -1
      },
    linearGradient: {
      flex: 1,
      paddingLeft: 15,
      paddingRight: 15,
      borderRadius: 5
    },
    buttonText: {
      fontSize: 18,
      fontFamily: 'Gill Sans',
      textAlign: 'center',
      margin: 10,
      color: '#ffffff',
      backgroundColor: 'transparent',
    },
  
  });