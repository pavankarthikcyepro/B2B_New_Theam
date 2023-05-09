/**
 * @format
 */

import "react-native-gesture-handler";

import { AppRegistry } from "react-native";
import AppScreen from "./src";
import { name as appName } from "./app.json";
import messaging from "@react-native-firebase/messaging";
import TrackPlayer from "react-native-track-player";

if (__DEV__) {
  import("./config/ReactotronConfig").then(() => {});
}

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log("Message handled in the background!", remoteMessage);
});

AppRegistry.registerComponent(appName, () => AppScreen);
TrackPlayer.registerPlaybackService(() => require("./trackServices"));