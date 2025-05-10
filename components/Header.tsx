import { TouchableOpacity, View, Text, SafeAreaView as SafeAreaViewIOS, Platform, StyleSheet, } from "react-native"
import ArrowBackIcon from "./icons/ArrowBackIcon"
import { SafeAreaView as SafeAreaViewAndroid } from "react-native-safe-area-context";
import { router } from "expo-router";

interface CustomHeaderProps {
    title?: string,
    rightContent?: React.ReactNode,
    leftButton?: React.ReactNode
    showBackButton?: boolean
}

const SafeArea = Platform.OS === 'ios' ? SafeAreaViewIOS : SafeAreaViewAndroid;

const Default = (props: CustomHeaderProps) => {
    const { title, rightContent, leftButton } = props;
    return (
        <View className="bg-primary">
            <SafeArea />
            <View style={{ paddingHorizontal: 16, }}>
                <View style={[styles.header]}>
                    <View>
                    {leftButton}
                    </View>
                    {title && <Text style={{ pointerEvents: 'none' }} className='z-0 absolute px-16 left-0 top-0 w-full h-full  py-2 text-white text-lg font-firamedium flex items-center justify-center flex-1 text-center'>{title}</Text>}
                    <View>
                    {rightContent}
                    </View>
                </View>
            </View>
        </View>
    )
}

const Normal = (props: CustomHeaderProps) => {
    const { title, rightContent } = props;
    return (
        <View>
            <SafeArea />
            <View style={[styles.header]}>
                <TouchableOpacity onPress={() => router.back()} className='flex items-center justify-center '>
                    <ArrowBackIcon />
                </TouchableOpacity>
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