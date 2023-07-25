import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Vibration, Image } from 'react-native';
import { Audio } from 'expo-av';

export default function App() {
  const [randomNumber, setRandomNumber] = useState(null);

  const generateRandomNumber = () => {
    let randomNumber = '';
    let displayNumber = '';
    for (let i = 0; i < 4; i++) {
      let digit = Math.floor(Math.random() * 5) + 1; // Generates a random number between 1 and 5 (inclusive).
      if (digit >=4){
        digit = 3;
      }
      randomNumber += digit;
      displayNumber += (digit+1);
    }
    setRandomNumber("");
    // playNumberAudio(randomNumber);
    console.log("Random Number :", displayNumber);
    vibrateNumber(randomNumber);
  };

  const playNumberAudio = async (number) => {
    const soundObject = new Audio.Sound();
    try {
      await soundObject.loadAsync(require('./assets/sounds/numbers.mp3'));
      await soundObject.playAsync();
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_MIX_WITH_OTHERS,
      });
    } catch (error) {
      console.error(error);
    }
  };

  // const duration = 200; // Duration of each individual vibration in milliseconds
  // const waitTime = 2000; // Wait time in milliseconds between each set of vibrations
  
  const vibrateAndWait = (vibrationCount, duration, waitTime) => {
    Vibration.vibrate(Array(vibrationCount).fill(duration), true);
    setTimeout(() => {
      Vibration.cancel();
    }, vibrationCount * duration + waitTime);
  };

  const vibrateNumber = (number) => {
    let delay = 0;

    // console.log("In Vibrate Number:", number);
    for (let i = 0; i < number.length; i++) {
      const digit = parseInt(number[i], 10);
      const vibrationCount = digit === 0 ? 1 : digit; // Avoiding zero vibrations
      const duration = 600; // Vibration duration in milliseconds
      const waitTime = 1000; // Wait time in milliseconds between vibrations

      setTimeout(() => {
        vibrateAndWait(vibrationCount, duration, waitTime);
      }, delay);

      delay += (vibrationCount + 2) * duration + waitTime;      }
    };


  return (
    <View style={styles.container}>
      <Image
        source={require('./assets/bg.jpg')}
        style={styles.backgroundImage}
      />
      <View style={styles.content}>
        <Text style={styles.title}></Text>
        {randomNumber && (
          <Text style={styles.generatedNumber}>{randomNumber}</Text>
        )}
        <Button
          title="Generate OTP"
          color="#007AFF"
          variant="outlined"
          onPress={generateRandomNumber}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  generatedNumber: {
    fontSize: 36,
    marginBottom: 20,
  },
  button: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'black',
  },
  backgroundImage: {
    resizeMode: 'stretch', // or 'stretch'
    width: 400,
    height: 400,
    marginTop: 100
  },
});
