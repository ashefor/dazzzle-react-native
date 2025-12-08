import React, { memo } from "react";
import { ImageBackground, StyleSheet, View, Text } from "react-native";
import type { UserCard } from "./folder/api";
import LocationIcon from "./LocationIcon";

type Props = {
  user: UserCard;
  width: number;
  height: number;
  borderRadius?: number;
};

function CardComponent({ user, width, height, borderRadius = 24 }: Props) {
  return (
    <View style={[styles.container, { width, height, borderRadius }]}>
      <ImageBackground
        source={{ uri: user.profileImage }}
        resizeMode="cover"
        style={[StyleSheet.absoluteFill, { borderRadius, backgroundColor: "#E0E0E0" }]}
        imageStyle={{ borderRadius }}
      />
      <View style={styles.infoContainer}>
        <View style={styles.row}>
          <Text style={styles.locationIcon}>
            <LocationIcon />
          </Text>
          <Text style={styles.locationText}>{user.countryName}</Text>
        </View>
        <Text style={styles.nameText}>
          {user.fullName}, {user.userAge}
        </Text>
      </View>
      <View style={styles.bottomShadow} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { overflow: "hidden" },
  infoContainer: {
    position: "absolute",
    left: 16,
    bottom: 20,
    right: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  locationIcon: { color: "#fff", fontSize: 16, marginRight: 8 },
  locationText: { color: "#fff", fontSize: 16, opacity: 0.95 },
  nameText: { color: "#fff", fontSize: 24, fontWeight: "700" },
  bottomShadow: {
    position: "absolute",
    left: 24,
    right: 24,
    bottom: -10,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.08)",
  },
});

export const Card = memo(CardComponent);