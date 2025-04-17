import React, { useState } from 'react'
import { ImageBackground, StyleSheet, Text, View } from 'react-native'
import TinderCard from './TinderCard'

const db = [
  {
    name: 'Richard Hendricks',
    img: require('../assets/images/onboard.jpg')
  },
  {
    name: 'Erlich Bachman',
    img: require('../assets/images/onboard2.jpg')
  },
  {
    name: 'Monica Hall',
    img: require('../assets/images/onboard3.png')
  },
  {
    name: 'Jared Dunn',
    img: require('../assets/images/onboard.jpg')
  },
  {
    name: 'Dinesh Chugtai',
    img: require('../assets/images/onboard2.jpg')
  }
]

function TinderCardSample() {
  const characters = db
  const [lastDirection, setLastDirection] = useState()

  const swiped = (direction, nameToDelete) => {
    console.log('removing: ' + nameToDelete)
    setLastDirection(direction)
  }

  const outOfFrame = (name) => {
    console.log(name + ' left the screen!')
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>React Native Tinder Card</Text>
      <View style={styles.cardContainer}>
        {characters.map((character) =>
          <TinderCard key={character.name} onSwipe={(dir) => swiped(dir, character.name)} onCardLeftScreen={() => outOfFrame(character.name)}>
            <View style={styles.card}>
              <ImageBackground style={styles.cardImage} source={character.img}>
                <Text style={styles.cardTitle}>{character.name}</Text>
              </ImageBackground>
            </View>
          </TinderCard>
        )}
      </View>
      {lastDirection ? <Text style={styles.infoText}>You swiped {lastDirection}</Text> : <Text style={styles.infoText} />}
    </View>
  )
}

export default TinderCardSample;

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
      },
      header: {
        color: '#000',
        fontSize: 30,
        marginBottom: 30,
      },
      cardContainer: {
        width: '90%',
        maxWidth: 260,
        height: 300,
      },
      card: {
        position: 'absolute',
        backgroundColor: '#fff',
        width: '100%',
        maxWidth: 260,
        height: 300,
        shadowColor: 'black',
        shadowOpacity: 0.2,
        shadowRadius: 20,
        borderRadius: 20,
        resizeMode: 'cover',
      },
      cardImage: {
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        borderRadius: 20,
      },
      cardTitle: {
        position: 'absolute',
        bottom: 0,
        margin: 10,
        color: '#fff',
      },
      infoText: {
        height: 28,
        justifyContent: 'center',
        display: 'flex',
        zIndex: -100,
      }
})