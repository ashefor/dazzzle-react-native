import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import LocationIcon from './icons/LocationIcon';
import { RandomUser } from '@/models/user';
import { CARD_HEIGHT } from '@/utils/helpers';

const { width, height } = Dimensions.get('window');
    // const CARD_WIDTH = width * 0.9;
    // const CARD_HEIGHT = height * 0.6;

const CARD_WIDTH = width - 32;
// const CARD_HEIGHT = Math.round(height - 400);

interface CardProps {
  user: RandomUser;
  width: number;  // New prop
  height: number;
}

const Card: React.FC<CardProps> = ({ user, width, height }) => {
  return (
    <View style={[styles.cardContainer, { width, height }]}>
      <Image source={{ uri: user.profileImage }} style={styles.image} resizeMode="cover" />
      
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.gradient}
      >
        <View style={styles.infoContainer}>
          <View style={styles.locationRow}>
            <LocationIcon/>
            <Text style={styles.locationText}>{user.countryName}</Text>
          </View>
          <Text style={styles.nameText}>
            {user.fullName.split(' ')[0]}, {user.userAge}
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '40%',
    justifyContent: 'flex-end',
    padding: 20,
  },
  infoContainer: {
    marginBottom: 10,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  locationText: {
    color: 'white',
    marginLeft: 5,
    fontSize: 16,
    fontWeight: '500',
  },
  nameText: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
});

export default Card;