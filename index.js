/**
 * @format
 */

import "react-native-gesture-handler";

import { AppRegistry } from "react-native";
import AppScreen from "./src";
import { name as appName } from "./app.json";
import crashlytics from "@react-native-firebase/crashlytics";
import messaging from "@react-native-firebase/messaging";
import TrackPlayer from "react-native-track-player";
import LocationTracker from "./src/geotracker";
import ReactNativeForegroundService from "@supersami/rn-foreground-service";
import RNLocation from "react-native-location";
import HelloWorldApp from "./src/Geotracker2";

if (__DEV__) {
  import("./config/ReactotronConfig").then(() => {});
}

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log("Message handled in the background!", remoteMessage);
});
ReactNativeForegroundService.register();

RNLocation.configure({
  distanceFilter: 25, // Meters
  desiredAccuracy: {
    ios: "best",
    android: "highAccuracy",
  },
  // Android only
  // androidProvider: 'auto',
  interval: 10000, // Milliseconds
  // fastestInterval: 3000, // Milliseconds
  // maxWaitTime: 1000, // Milliseconds
  // iOS Only
  activityType: "fitness",
  allowsBackgroundLocationUpdates: true,
  headingFilter: 0, // Degrees
  headingOrientation: "portrait",
  pausesLocationUpdatesAutomatically: false,
  showsBackgroundLocationIndicator: true,
});
AppRegistry.registerComponent(appName, () => AppScreen);
TrackPlayer.registerPlaybackService(() => require("./trackServices"));