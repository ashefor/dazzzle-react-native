import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Pressable, SafeAreaView, useAnimatedValue } from 'react-native';
import Toast, { ToastType } from './toast';



const ToastWrapper = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [duration, setDuration] = useState<number>(3000);
  const [type, setType] = useState<'success' | 'error' | 'default'>('default');

  const fadeAnim = useAnimatedValue(0);

  useEffect(() => {
    Toast.setShowToast((toastData: { message: string; duration: number; type: keyof typeof ToastType }) => {
      setMessage(toastData.message);
      setDuration(toastData.duration);
      setType(toastData.type);
      showToast();
    });
  }, []);

  const showToast = () => {
    setVisible(true);

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      hideToast();
    }, duration);
  };

  const hideToast = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      setVisible(false);
    }, 300);
  };

  if (!visible) return null;

  const toastStyles = styles[type] || styles.default;

  return (
    <Animated.View style={[styles.toastContainer, toastStyles, { opacity: fadeAnim, paddingTop: 50 }]}>
      <Pressable onPress={hideToast} className='w-full h-full pb-4'>
        <Text style={styles.toastText}>{message}</Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: 0,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100000,
  },
  toastText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  default: {
    backgroundColor: 'rgba(0, 0, 0, 1)',
  },
  success: {
    backgroundColor: 'rgba(0, 128, 0, 1)',
  },
  error: {
    backgroundColor: 'rgba(255, 0, 0, 1)',
  },
});

export default ToastWrapper;
