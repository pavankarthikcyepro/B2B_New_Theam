import Reactotron from 'reactotron-react-native';
import { Platform } from "react-native";

if (Platform.OS === "android") {
    Reactotron
        .configure({
            host: 'localhost'
        })
        .useReactNative()
        .connect();
} else {
    Reactotron
        .configure()
        .useReactNative()
        .connect();
}
