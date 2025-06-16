import React, { useEffect, useRef, useState } from 'react';
import { View, Image, Animated, Dimensions } from 'react-native';
import Images from '@/constants/images';

let showLoader: () => void;
let hideLoader: () => void;

export const Loader = {
    show: () => {
        showLoader?.();
    },
    hide: () => {
        hideLoader?.();
    },
};

export const LoaderWrapper = () => {
    const [visible, setVisible] = useState(false);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Register the controller functions
        showLoader = () => {
            setVisible(true);
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
        };

        hideLoader = () => {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start(() => {
                setVisible(false);
            });
        };
    }, []);

    if (!visible) return null;

    return (
        <Animated.View
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: Dimensions.get('window').width,
                height: Dimensions.get('window').height,
                zIndex: 99999999,
                opacity: fadeAnim,
            }}
        >
            <View
                className='h-full w-full items-center justify-center flex-1 bg-black/[0.6]'
            >
                <Image
                    source={Images.logo}
                    style={{ width: 80, height: 80 }}
                    resizeMode="contain"
                />
            </View>
        </Animated.View>
    );
};
