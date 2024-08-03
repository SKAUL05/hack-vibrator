import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/home_screen.jpg")}
        style={styles.backgroundImage}
      />
      <View style={styles.content}>
        <Text style={styles.title}>iCAN</Text>
        <Text style={styles.subtitle}>Banking made accessible</Text>
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
    width: 200,
    height: 200,
    marginTop: -300,
    marginLeft: 20,
  },
  content: {
    position: "absolute",
    bottom: 50,
    alignItems: "center", // Center the text and button horizontally
    marginBottom: 160,
  },
  title: {
    fontSize: 50,
    fontWeight: "bold",
    color: "#000", // Black or any color that contrasts with the background
    marginBottom: 2, // Space between title and subtitle
  },
  subtitle: {
    fontSize: 23,
    color: "#333", // Darker color for subtitle
    marginBottom: 50, // Space between subtitle and button
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
