import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/bg.jpg")}
        style={styles.backgroundImage}
      />
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("OTP Verification")}
        >
          <Text style={styles.buttonText}>Vibration Based OTP</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  backgroundImage: {
    width: 400,
    height: 400,
    marginTop: -300,
    resizeMode: "stretch",
  },
  content: {
    position: "absolute",
    bottom: 50,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 5,
    backgroundColor: "#007AFF",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
});

export default HomeScreen;
