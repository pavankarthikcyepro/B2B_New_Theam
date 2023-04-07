import React, { useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  Clipboard,
} from "react-native";
import { Colors } from "../../styles";
import { ButtonComp } from "../../components/buttonComp";
import { AuthNavigator } from "../../navigations";
import { useIsFocused } from "@react-navigation/native";
import Orientation from "react-native-orientation-locker";
import { getWidth } from "../../utils/helperFunctions";
import PushNotification from "react-native-push-notification";
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import { useDispatch } from "react-redux";
import { updateToken } from "../../redux/loginReducer";
import messaging from "@react-native-firebase/messaging";
import firebase from "@react-native-firebase/app";

const WelcomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (token) {
        Clipboard.setString(token.token);
        dispatch(updateToken(token.token));
      },
      // (required) Called when a remote is received or opened, or local notification is opened
      onNotification: function (notification) {
        console.log("NOTI",notification);
        if (notification.foreground) {
          PushNotification.localNotification({
            title: notification.title,
            message: notification.message,
          });
        }
        // PushNotification.localNotification({
        //   channelId: notification.channelId,
        //   autoCancel: true,
        //   title: notification.title,
        //   message: notification.message,
        //   vibrate: true,
        //   vibration: 300,
        //   playSound: true,
        //   soundName: "default",
        //   ignoreInForeground: false,
        //   importance: "high",
        //   invokeApp: true,
        //   allowWhileIdle: true,
        //   priority: "high",
        //   visibility: "public",
        //   largeIcon: "@mipmap/cy",
        //   smallIcon: "@mipmap/cy",
        // });
        // process the notification

        // (required) Called when a remote is received or opened, or local notification is opened
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },

      // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
      onAction: function (notification) {
        console.log("ACTION:", notification.action);
        console.log("NOTIFICATION:", notification);

        // process the action
      },

      // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
      onRegistrationError: function (err) {
        console.error(err.message, err);
      },

      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,

      /**
       * (optional) default: true
       * - Specified if permissions (ios) and token (android and ios) will requested or not,
       * - if not, you must call PushNotificationsHandler.requestPermissions() later
       * - if you are not using remote notification or do not have Firebase installed, use this:
       *     requestPermissions: Platform.OS === 'ios'
       */
      requestPermissions: true,
    });
  }, []);

  const loginButtonClicked = () => {
    navigation.navigate(AuthNavigator.AuthStackIdentifiers.LOGIN);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          width: "100%",
          height: 300,
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <Image
          style={{ width: getWidth(80), height: 80 }}
          resizeMode={"center"}
          source={require("../../assets/images/logo.png")}
        />
      </View>
      {/* <Image
                style={{ width: '100%', height: 300 }}
                resizeMode={'center'}
                source={require('../../assets/images/welcome.png')}
            /> */}
      {/* source={require('../../assets/images/logo.png')}
            /> */}
      <ButtonComp
        title={"LOG IN"}
        width={getWidth(100) - 40}
        onPress={loginButtonClicked}
        color={Colors.PINK}
      />

      <View style={styles.bottomViewStyle}>
        <Text style={styles.textOneStyle}>{"Important Notice"}</Text>
        <Text style={styles.textTwoStyle}>
          {
            "By using this app, you agree to the use of cookies and data processing technologies by us."
          }
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.LIGHT_GRAY,
  },
  bottomViewStyle: {
    position: "absolute",
    bottom: 0,
    paddingHorizontal: 30,
    paddingBottom: 30,
  },
  textOneStyle: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.BLACK,
  },
  textTwoStyle: {
    marginTop: 20,
    fontSize: 14,
    fontWeight: "400",
    color: Colors.DARK_GRAY,
  },
});
