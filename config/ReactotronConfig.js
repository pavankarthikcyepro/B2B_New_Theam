import Reactotron from 'reactotron-react-native';
import { Platform } from "react-native";

if (Platform.OS === "android") {
    Reactotron
        .configure({
            host: '192.168.0.103'
        })
        .useReactNative()
        .connect();
} else {
    Reactotron
        .configure()
        .useReactNative()
        .connect();
}
