import React, { createContext, useContext, useState, useRef, useCallback } from 'react';
import { Animated, Dimensions, View, Image } from 'react-native';
import Images from '@/constants/images';

const LoaderContext = createContext({
    show: () => {},
    hide: () => {},
});

export const useLoader = () => useContext(LoaderContext);

export const LoaderProvider = ({ children }: { children: React.ReactNode }) => {
    const [visible, setVisible] = useState(false);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const show = useCallback(() => {
        setVisible(true);
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [fadeAnim]);

    const hide = useCallback(() => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setVisible(false);
        });
    }, [fadeAnim]);

    return (
        <LoaderContext.Provider value={{ show, hide }}>
            {children}
            {visible && (
                <Animated.View
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: Dimensions.get('window').width,
                        height: Dimensions.get('window').height,
                        zIndex: 99999999,
                        opacity: fadeAnim,
                        backgroundColor: 'transparent'
                    }}
                >
                    <View style={{height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: '#00000099'}}>
                        <Image
                            source={Images.logo}
                            style={{ width: 80, height: 80 }}
                            resizeMode="contain"
                        />
                    </View>
                </Animated.View>
            )}
        </LoaderContext.Provider>
    );
};
