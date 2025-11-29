import { TouchableOpacity, View, Text, SafeAreaView as SafeAreaViewIOS, Platform, StyleSheet, } from "react-native";
import ArrowBackIcon from "./icons/ArrowBackIcon";
import { SafeAreaView as SafeAreaViewAndroid, useSafeAreaInsets } from "react-native-safe-area-context";
import { Href, router } from "expo-router";

interface CustomHeaderProps {
    title?: string,
    rightContent?: React.ReactNode,
    leftContent?: React.ReactNode
    showBackButton?: boolean,
    onLeftPress?: () => void,
    disabled?: boolean,
    defaultHref?: Href,
}

const SafeArea = Platform.OS === 'ios' ? SafeAreaViewIOS : SafeAreaViewAndroid;

const Default = (props: CustomHeaderProps) => {
    const { title, rightContent, leftContent } = props;
    const insets = useSafeAreaInsets();
    return (
        <View className="bg-white" style={{ paddingTop: insets.top }}>
            {/* <SafeArea /> */}
            <View>
                <View style={[styles.header]}>
                    <View style={{ zIndex: 100, paddingLeft: 16 }}>
                        {leftContent}
                    </View>
                    {title && <View className="  z-0 absolute left-0 top-0 w-full h-full flex flex-col justify-center items-center">
                        <Text style={{ pointerEvents: 'none' }} className=' text-white text-lg font-firamedium'>{title}</Text>
                    </View>}
                    <View style={{ zIndex: 100, paddingRight: 16 }}>
                        {rightContent}
                    </View>
                </View>
            </View>
        </View>
    )
}

const Normal = (props: CustomHeaderProps) => {
    const { title, rightContent, onLeftPress, disabled, defaultHref } = props;
    const insets = useSafeAreaInsets();
    return (
        <View style={{ paddingTop: insets.top }} >
            <View style={[styles.header]}>
                {router.canGoBack() ? (
                    <TouchableOpacity
                        activeOpacity={0.5}
                        disabled={disabled} onPress={() => onLeftPress ? onLeftPress?.() : router.back()} className='flex items-center justify-center bg-red-500 w-8 h-8 rounded-full'>
                        <ArrowBackIcon />
                    </TouchableOpacity>
                ) : defaultHref ? (
                    <TouchableOpacity
                        activeOpacity={0.5}
                        disabled={disabled} onPress={() => onLeftPress ? onLeftPress?.() : router.push(defaultHref)} className='flex items-center justify-center w-8 h-8 rounded-full'>
                        <ArrowBackIcon />
                    </TouchableOpacity>
                ) : null}
                {title && <Text className='text-white text-base font-firamedium flex-1 text-center'>{title}</Text>}
                {rightContent && rightContent}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        // height: Platform.OS === 'android' ? 97 : 'auto',
        // height: 97,
        // paddingHorizontal: 16,
        // paddingVertical: 10,
        minHeight: 44,
        backgroundColor: 'transparent',
        borderBottomWidth: 0,
        borderBottomColor: '#ddd',
        width: '100%',
        overflow: 'hidden',
    },
})

export default { Default, Normal }