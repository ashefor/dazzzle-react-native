import React from "react";
import { View, StyleSheet, Pressable, Text } from "react-native";
import CloseIcon from "./icons/CloseIcon";
import HeartIcon from "./icons/HeartIcon";
import InformationCircleIcon from "./icons/InformationCircleIcon";

type Props = {
    onDislike: () => void;
    onLike: () => void;
    onInfo: () => void;
    disabled?: boolean;
};

export const ActionButtons: React.FC<Props> = ({ onDislike, onLike, onInfo, disabled }) => {
    return (
        <View style={styles.row}>
            <CircleButton
                label="✕"
                color="#e74c3c"
                bg="rgba(231,76,60,0.12)"
                onPress={onDislike}
                disabled={disabled}
            >

                <CloseIcon width={26} height={26} fill="#EB4242" />
            </CircleButton>
            <CircleButton
                label="❤"
                color="#b84ae9"
                bg="rgba(184,74,233,0.12)"
                onPress={onLike}
                disabled={disabled}
            >
                <HeartIcon width={26} height={24} fill="#DD3FE5" />
            </CircleButton>
            <CircleButton
                label="i"
                color="#fff"
                bg=""
                onPress={onInfo}
                disabled={disabled}
            >
                <InformationCircleIcon width={60} height={60} fill="black" />
            </CircleButton>
        </View>
    );
};

type CircleProps = {
    label: string;
    color: string;
    bg: string;
    onPress: () => void;
    disabled?: boolean;
    children?: React.ReactNode;
};
const CircleButton: React.FC<CircleProps> = ({ label, color, bg, onPress, disabled, children }) => {
    return (
        <Pressable
            accessibilityRole="button"
            accessibilityLabel={label === "✕" ? "Dislike" : label === "❤" ? "Like" : "Info"}
            disabled={disabled}
            onPress={onPress}
            style={({ pressed }) => [
                styles.button,
                {
                    backgroundColor: bg,
                    opacity: disabled ? 0.4 : pressed ? 0.7 : 1,
                },
            ]}
        >
            {children || <Text style={[styles.label, { color }]}>{label}</Text>}
        </Pressable>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 28,
        paddingVertical: 12,
        marginTop: 20,
    },
    button: {
        width: 60,
        height: 60,
        borderRadius: 36,
        alignItems: "center",
        justifyContent: "center",
        // shadowColor: "#000",
        // shadowOpacity: 0.25,
        // shadowOffset: { width: 0, height: 6 },
        // shadowRadius: 12,
        // elevation: 6,
    },
    label: {
        fontSize: 28,
        fontWeight: "700",
    },
});