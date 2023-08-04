import React, { useState, createContext } from 'react';
import { View, Text, StyleSheet, Button, Vibration, Image, TextInput, Alert, Keyboard, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';


export default function App() {
  const [randomNumbers, setRandomNumber] = useState('');
  const [showTextField, setShowTextField] = useState(false);
  const [textInputValue, setTextInputValue] = useState('');
  const [isAlertVisible, setIsAlertVisible] = useState('');

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
    setRandomNumber(displayNumber);
    console.log("Random Number :", displayNumber);
    setShowTextField(true);
    setTextInputValue("")
    vibrateNumber(randomNumber);
  };

  
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

    const verifyOTP = () => {
      Keyboard.dismiss();
      const numValue = parseInt(textInputValue, 10);
      const checkNumber = randomNumbers;
      console.log(randomNumbers, checkNumber);
      const displayValue = parseInt(checkNumber, 10);
      console.log("Display Value :", displayValue);
      if (displayValue === numValue) {
        Alert.alert(
          'Success',
          'OTP Verified',
          [{ text: 'OK', onPress: () => setIsAlertVisible(false) }],
          { cancelable: false }
        )
        // setIsAlertVisible(true);
      } else {
        Alert.alert(
          'Error',
          'Oops! Wrong Number. Try Again',
          [{ text: 'OK', onPress: () => setIsAlertVisible(false) }],
          { cancelable: false }
        )
        // setIsAlertVisible(false);
      }
    };
    const handleTextInputSubmit = () => {
      // If the input length is 4, dismiss the keyboard
      if (textInputValue.length === 4) {
        Keyboard.dismiss();
      }
    };
    const handleTextInputBlur = () => {
      // Dismiss the keyboard when the input loses focus (clicking outside)
      Keyboard.dismiss();
    };


  return (
    <View style={styles.container}>
      <Image
        source={require('./assets/bg.jpg')}
        style={styles.backgroundImage}
      />
      <View style={styles.content}>
      <TouchableOpacity style={styles.button} onPress={generateRandomNumber}>
        <Text style={styles.buttonText}>Generate OTP</Text>
      </TouchableOpacity>
        {/* <Button
          title="Generate OTP"
          onPress={generateRandomNumber}
          color="#007AFF"
        /> */}
         {/* Dynamically appearing text input */}
      {showTextField && (
        <View>
          <TextInput
            style={{ borderWidth: 1, borderColor: 'gray', padding: 10, marginBottom: 20, width: 'auto', borderRadius:5,borderColor: '#CCCCCC', fontSize: 16, borderWidth: 2, marginTop:20         }}
            placeholder="Enter OTP"
            onChangeText={setTextInputValue}
            value={textInputValue}
            onSubmitEditing={handleTextInputSubmit}
            onBlur={handleTextInputBlur}
            keyboardType="number-pad"
            returnKeyType="done"
          />

          {/* Second button */}
          <TouchableOpacity style={styles.button} onPress={verifyOTP}>
          <Text style={styles.buttonText}>Verify OTP</Text>
          </TouchableOpacity>
        </View>
      )}


      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
    marginTop: -50
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});
