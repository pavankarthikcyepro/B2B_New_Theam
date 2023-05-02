/**
 * @format
 */

import "react-native-gesture-handler";

import { AppRegistry } from "react-native";
import AppScreen from "./src";
import { name as appName } from "./app.json";
import EventFormScreen from "./src/scenes/mainScenes/EventCamp/Event";
import CampaignFormScreen from "./src/scenes/mainScenes/EventCamp/Campaign";

if (__DEV__) {
  import("./config/ReactotronConfig").then(() => {});
}

AppRegistry.registerComponent(appName, () => CampaignFormScreen);
