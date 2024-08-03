import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./screens/HomeScreen";
import OTPVerificationScreen from "./screens/OTPVerificationScreen";
import CameraRecognitionScreen from "./screens/CameraRecognition";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="iCAN" component={HomeScreen} />
        <Stack.Screen
          name="OTP Verification"
          component={OTPVerificationScreen}
        />
        <Stack.Screen
          name="Gesture Recognition"
          component={CameraRecognitionScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
