import React, { createRef } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import { Text } from "galio-framework";

import { Camera } from "expo-camera/legacy";
import { cameraWithTensors } from "@tensorflow/tfjs-react-native";
import * as tf from "@tensorflow/tfjs";
import * as handpose from "@tensorflow-models/handpose";
import * as fp from "fingerpose";
import * as Speech from "expo-speech";
import * as facemesh from "@tensorflow-models/face-detection";
import Handsigns from "../handsigns";
import { drawMesh } from "../components/Utilities";

//import * as mobilenet from "@tensorflow-models/mobilenet";
import Canvas from "react-native-canvas"; // 0.1.20

const TensorCamera = cameraWithTensors(Camera);
const { width, height } = Dimensions.get("window");

const fingerJoints = {
  thumb: [0, 1, 2, 3, 4],
  indexFinger: [0, 5, 6, 7, 8],
  middleFinger: [0, 9, 10, 11, 12],
  ringFinger: [0, 13, 14, 15, 16],
  pinky: [0, 17, 18, 19, 20],
};

// Infinity Gauntlet Style
const style = {
  0: { color: "yellow", size: 15 },
  1: { color: "gold", size: 7 },
  2: { color: "green", size: 10 },
  3: { color: "gold", size: 7 },
  4: { color: "gold", size: 7 },
  5: { color: "purple", size: 10 },
  6: { color: "gold", size: 6 },
  7: { color: "gold", size: 6 },
  8: { color: "gold", size: 6 },
  9: { color: "blue", size: 10 },
  10: { color: "gold", size: 6 },
  11: { color: "gold", size: 6 },
  12: { color: "gold", size: 6 },
  13: { color: "red", size: 10 },
  14: { color: "gold", size: 6 },
  15: { color: "gold", size: 6 },
  16: { color: "gold", size: 6 },
  17: { color: "orange", size: 10 },
  18: { color: "gold", size: 6 },
  19: { color: "gold", size: 6 },
  20: { color: "gold", size: 6 },
};

const styles = StyleSheet.create({
  camera: {
    height: "94%",
    width: "100%",
    borderColor: "white",
    borderWidth: 2,
    // flex: 1
  },
  text: {
    textAlign: "center",
    marginTop: 3,
    textShadowColor: "black",
    fontWeight: "bold",
    textShadowOffset: { width: 5, height: 5 },
  },
  canvas: {
    position: "absolute",
    zIndex: 10000000,
    width: "100%",
    height: "94%",
  },
});

class Cameras extends React.Component {
  constructor(prop) {
    super(prop);
    this.name = "ican-camera";
    this.canvasRef = createRef();
    this.state = {
      isModelReady: false,
      useModel: {},
      model: null,
      net: null,
      faceCheck: true,
      count: 0,
      guess: "",
      lastguess: "",
      flow: {
        balance: {
          name: "Balance",
          visited: false,
          voice: "Your account balance is 65800 EURO.",
        },
        payment: {
          name: "Payment",
          visited: false,
          voice:
            "Initializing transfer of 5000 EURO to your favourite payee Tony Stark for gadget payments,  are you sure?",
        },
        gadgetPayment: {
          name: "Gadget",
          visited: false,
          voice:
            "Analysing your past transactions I can see you have already performed a high value transaction of 3500 EURO to Tony Stark around a week back. Do you still want to proceed ahead?",
        },
        noPayment: {
          name: "No",
          visited: false,
          voice:
            "Thank you Andrew for banking with us, I am logging you out for your safety. Keep well, good bye",
        },
        login: {
          name: "Login",
          visited: false,
          voice:
            "Welcome Andrew! I am Nikki, your banking partner. Your safety is my priority. How can I help you today?",
        },
      },
    };
  }

  init() {}

  async componentDidMount() {
    await tf.ready();
    tf.setBackend("cpu");
    // Signal to the app that tensorflow.js can now be used.
    // console.log("componentDidMount: tf.ready is set");
    // console.log("the MyModelLoadLocal component is mounted");
    const { status } = await Camera.requestCameraPermissionsAsync();
    console.log(status);
    console.log("Start Loading Model");
    const model = await handpose.load();
    const net = await facemesh.createDetector(
      facemesh.SupportedModels.MediaPipeFaceDetector,
      { runtime: "tfjs" }
    );
    this.setState({ isModelReady: true, model, net });
    console.log("Model Loaded");
  }

  makeHandleCameraStream() {
    return (images, updatePreview, gl) => {
      const loop = async () => {
        const nextImageTensor = images.next().value;
        // const predictions = await this.state.model.estimateHands(nextImageTensor);
        if (!nextImageTensor) console.log("Image Error");

        this.canvasRef.current.width = width;
        this.canvasRef.current.height = height;
        const predictions =
          await this.state.model.estimateHands(nextImageTensor);
        const face = await this.state.net.estimateFaces(nextImageTensor);
        // console.log(face);
        this.setState({ predictions });
        if (predictions.length > 0) {
          //loading the fingerpose model
          const GE = new fp.GestureEstimator([
            fp.Gestures.ThumbsUpGesture,
            // fp.Gestures.VictoryGesture,
            Handsigns.aSign,
            Handsigns.bSign,
            Handsigns.cSign,
            Handsigns.dSign,
            Handsigns.eSign,
            Handsigns.fSign,
            Handsigns.gSign,
            Handsigns.hSign,
            Handsigns.iSign,
            Handsigns.jSign,
            Handsigns.kSign,
            Handsigns.lSign,
            Handsigns.mSign,
            Handsigns.nSign,
            Handsigns.oSign,
            Handsigns.pSign,
            Handsigns.qSign,
            Handsigns.rSign,
            Handsigns.sSign,
            Handsigns.tSign,
            Handsigns.uSign,
            Handsigns.vSign,
            Handsigns.wSign,
            Handsigns.xSign,
            Handsigns.ySign,
            Handsigns.zSign,
          ]);
          const estimatedGestures = await GE.estimate(
            predictions[0].landmarks,
            6.5
          );
          // console.log(estimatedGestures.gestures)
          const confidence = estimatedGestures.gestures.map((p) => p.score);
          const maxConfidence = confidence.indexOf(
            Math.max.apply(undefined, confidence)
          );
          // console.log("Max:",maxConfidence);
          if (estimatedGestures.gestures.length > 0 && maxConfidence >= 0) {
            console.log(
              "Actual Guess:",
              estimatedGestures.gestures[maxConfidence].name
            );
            this.state.guess = estimatedGestures.gestures[maxConfidence].name;
          }
        } else {
          this.state.guess = "";
        }

        const ctx = this.canvasRef.current.getContext("2d");
        if (this.state.count < 49) {
          drawMesh(face, ctx);
          this.state.guess = "Login";
        }
        // requestAnimationFrame(loop);
        this.drawHand(predictions, ctx);
        this.state.count += 1;
        // console.log(this.state.count);
        if (this.state.count < 2000) requestAnimationFrame(loop);
      };
      loop();
    };
  }

  drawHand(predicts, context) {
    if (predicts.length > 0) {
      predicts.forEach((prediction) => {
        const landmarks = prediction.landmarks;
        for (let j = 0; j < Object.keys(fingerJoints).length; j++) {
          let finger = Object.keys(fingerJoints)[j];
          for (let k = 0; k < fingerJoints[finger].length - 1; k++) {
            const firstJointIndex = fingerJoints[finger][k];
            const secondJointIndex = fingerJoints[finger][k + 1];

            // Draw path
            context.beginPath();
            context.moveTo(
              landmarks[firstJointIndex][0] * 1.5,
              landmarks[firstJointIndex][1] * 2.2
            );
            context.lineTo(
              landmarks[secondJointIndex][0] * 1.5,
              landmarks[secondJointIndex][1] * 2.2
            );
            context.strokeStyle = "plum";
            context.lineWidth = 4;
            context.stroke();
          }
        }

        // Loop through landmarks and draw em
        for (let i = 0; i < landmarks.length; i++) {
          const x = landmarks[i][0] * 1.5;
          const y = landmarks[i][1] * 2.2;
          context.beginPath();
          context.arc(x, y, 5, 0, 3 * Math.PI);
          context.fillStyle = "blue";
          context.fill();
        }
      });
    }
  }

  speakGuess(guess) {
    // console.log(guess);
    if (guess.name == "Balance" && !guess.visited) {
      setTimeout(() => {
        Speech.speak("Fetching account detail", {
          voice: "com.apple.ttsbundle.siri_female_en-GB_compact",
          onDone: () => {},
        });
      }, 2000);
      setTimeout(() => {
        Speech.speak(guess.voice, {
          voice: "com.apple.ttsbundle.siri_female_en-GB_compact",
          onDone: () => {},
        });
      }, 3000);
    } else if (guess.name == "Payment" && !guess.visited) {
      this.state.flow.payment.visited = true;
      setTimeout(() => {
        Speech.speak("Analysing payment detail", {
          voice: "com.apple.ttsbundle.siri_female_en-GB_compact",
          onDone: () => {},
        });
      }, 2000);
      setTimeout(() => {
        Speech.speak(guess.voice, {
          voice: "com.apple.ttsbundle.siri_female_en-GB_compact",
          onDone: () => {},
        });
      }, 3000);
    } else if (guess.name == "No" && !guess.visited) {
      this.state.flow.noPayment.visited = true;
      setTimeout(() => {
        Speech.speak("Transaction Declined", {
          voice: "com.apple.ttsbundle.siri_female_en-GB_compact",
          onDone: () => {},
        });
      }, 2000);

      setTimeout(() => {
        Speech.speak(guess.voice, {
          voice: "com.apple.ttsbundle.siri_female_en-GB_compact",
          onDone: () => {},
        });
      }, 5000);
    } else if (guess.name == "Gadget" && !guess.visited) {
      this.state.flow.gadgetPayment.visited = true;
      setTimeout(() => {
        Speech.speak(guess.voice, {
          voice: "com.apple.ttsbundle.siri_female_en-GB_compact",
          onDone: () => {},
        });
      }, 3000);
    } else if (guess.name == "Login" && !guess.visited) {
      this.state.flow.login.visited = true;
      setTimeout(() => {
        Speech.speak("Authenticating using facial recognition", {
          voice: "com.apple.ttsbundle.siri_female_en-GB_compact",
          onDone: () => {},
        });
      }, 2000);

      setTimeout(() => {
        Speech.speak("Please move your face slightly towards right", {
          voice: "com.apple.ttsbundle.siri_female_en-GB_compact",
          onDone: () => {},
        });
      }, 5500);

      setTimeout(() => {
        this.state.lastguess = "Welcome Andrew!";
        Speech.speak(guess.voice, {
          voice: "com.apple.ttsbundle.siri_female_en-GB_compact",
        });
      }, 8500);
    }
  }

  render() {
    let textureDims;
    textureDims = {
      height: 1200,
      width: 1080,
    };
    if (this.state.guess == "B") {
      this.speakGuess(this.state.flow.balance);
      this.state.flow.balance.visited = true;
      this.state.guess = "Account Details";
      this.state.lastguess = "Account Details";
    } else if (
      this.state.guess == "D" ||
      this.state.guess == "B" ||
      this.state.guess == "M"
    ) {
      this.speakGuess(this.state.flow.payment);
      this.state.flow.payment.visited = true;
      this.state.guess = "Payment";
      this.state.lastguess = "Payment";
    } else if (this.state.guess == "R" || this.state.guess == "U") {
      this.speakGuess(this.state.flow.gadgetPayment);
      this.state.flow.gadgetPayment.visited = true;
      this.state.guess = "Initiating Transfers";
      this.state.lastguess = "Initiating Transfers";
    } else if (this.state.guess == "Z") {
      this.speakGuess(this.state.flow.noPayment);
      this.state.flow.noPayment.visited = true;
      this.state.guess = "Payment Declined";
      this.state.lastguess = "Payment Declined";
    } else if (this.state.guess == "Login") {
      this.speakGuess(this.state.flow.login);
      this.state.flow.login.visited = true;
    } else {
      this.state.guess = this.state.lastguess;
    }
    console.log("Guess Here: ", this.state.guess);

    return (
      <View>
        {this.state.model && (
          <TensorCamera
            // Standard Camera props
            style={styles.camera}
            type={Camera.Constants.Type.front}
            // Tensor related props
            cameraTextureHeight={textureDims.height}
            cameraTextureWidth={textureDims.width}
            resizeHeight={320}
            resizeWidth={240}
            resizeDepth={3}
            onReady={this.makeHandleCameraStream()}
            autorender={true}
            useCustomShadersToResize={false}
          />
        )}
        <Canvas style={styles.canvas} ref={this.canvasRef} />
        <Text h5 style={styles.text} color="red">
          {this.state.guess}
        </Text>

        {/* <Text bold color={theme.COLORS.BLACK}>{this.state.guess}</Text> */}
      </View>
    );
  }
}

export default Cameras;
