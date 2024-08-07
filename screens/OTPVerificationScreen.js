import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Vibration,
  TextInput,
  Alert,
  Keyboard,
  TouchableOpacity,
  Image,
} from "react-native";

const OTPVerificationScreen = () => {
  const [randomNumbers, setRandomNumbers] = useState("");
  const [showTextField, setShowTextField] = useState(false);
  const [textInputValue, setTextInputValue] = useState("");

  const generateRandomNumber = () => {
    let randomNumber = "";
    let displayNumber = "";

    for (let i = 0; i < 4; i++) {
      let digit = Math.floor(Math.random() * 5) + 1;
      if (digit >= 4) {
        digit = 3;
      }
      randomNumber += digit;
      displayNumber += digit + 1;
    }

    console.log("OTP:", displayNumber);
    setRandomNumbers(displayNumber);
    setShowTextField(true);
    setTextInputValue("");
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
    number.split("").forEach((digit) => {
      const vibrationCount = parseInt(digit, 10) || 1;
      const duration = 600;
      const waitTime = 1000;

      setTimeout(() => {
        vibrateAndWait(vibrationCount, duration, waitTime);
      }, delay);

      delay += (vibrationCount + 2) * duration + waitTime;
    });
  };

  const verifyOTP = () => {
    Keyboard.dismiss();
    const numValue = parseInt(textInputValue, 10);
    const displayValue = parseInt(randomNumbers, 10);

    Alert.alert(
      numValue === displayValue ? "Success" : "Error",
      numValue === displayValue
        ? "OTP Verified"
        : "Oops! Wrong Number. Try Again",
      [{ text: "OK", onPress: () => setTextInputValue("") }],
      { cancelable: false }
    );
  };

  const handleTextInputSubmit = () => {
    if (textInputValue.length === 4) {
      Keyboard.dismiss();
    }
  };

  const handleTextInputBlur = () => {
    Keyboard.dismiss();
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/OTP_Screen.png")}
        style={styles.backgroundImage}
      />
      <TouchableOpacity style={styles.button} onPress={generateRandomNumber}>
        <Text style={styles.buttonText}>Generate OTP</Text>
      </TouchableOpacity>
      {showTextField && (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Enter OTP"
            onChangeText={setTextInputValue}
            value={textInputValue}
            onSubmitEditing={handleTextInputSubmit}
            onBlur={handleTextInputBlur}
            keyboardType="number-pad"
            returnKeyType="done"
          />
          <TouchableOpacity style={styles.button} onPress={verifyOTP}>
            <Text style={styles.buttonText}>Verify OTP</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  backgroundImage: {
    width: 350,
    height: 350,
    marginTop: -300,
    resizeMode: "cover",
  },
  inputContainer: {
    width: "100%",
    alignItems: "center",
    zIndex: 1,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#CCCCCC",
    padding: 10,
    marginBottom: 10,
    width: "80%",
    borderRadius: 5,
    fontSize: 16,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
    backgroundColor: "#007AFF",
    marginBottom: 10,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
});

export default OTPVerificationScreen;
