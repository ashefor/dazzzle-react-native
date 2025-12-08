import { Href, router } from "expo-router";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import ArrowBackIcon from "./icons/ArrowBackIcon";

type HeaderProps = {
    title?:  string | React.ReactNode;
    subtitle?: string | React.ReactNode;
    leftItem?: React.ReactNode;
    rightItem?: React.ReactNode;
    onLeftPress?: () => void;
    onRightPress?: () => void;
    defaultHref?: Href;
    navBarClasses?: string;
    titleClasses?: string;
}

const NavBar: React.FC<HeaderProps> = ({ title, subtitle, leftItem, rightItem, defaultHref, navBarClasses, titleClasses }) => {
    const renderSubtitle = () => {
        if (typeof subtitle === 'string') {
            return <Text className='font-firaregular text-xs'>{subtitle}</Text>;
        }
        return subtitle ?? null;
    };

    const renderTitle = () => {
        if (typeof title === 'string') {
            return <Text className={`text-base font-firamedium ${titleClasses ?? ''}`}>{title}</Text>;
        }
        return title ?? null;
    }

    return (
        <View style={styles.headerContainer}>
            {leftItem ? <View style={{ zIndex: 100 }}>{leftItem}</View> :
                router.canGoBack() && <View style={{ zIndex: 100 }}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
                        <ArrowBackIcon width={24} height={24} color="#000" />
                    </TouchableOpacity>
                </View>
            }
            <View className="px-20 flex-1 items-center justify-center absolute left-4 w-full h-full">
                {renderTitle()}
                {renderSubtitle()}
            </View>
            {rightItem && <View style={{ zIndex: 100 }}>
                {rightItem}
            </View>}
        </View>
    )
}

export default NavBar

const styles = StyleSheet.create({
    headerContainer: {
        zIndex: 10,
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        position: 'relative',
        backgroundColor: '#FFFFFF',
        // backgroundColor: 'rgba(255,255,255,0.95)',
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#C7C7CC',
    }
})