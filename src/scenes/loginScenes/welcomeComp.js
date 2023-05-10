import React, { useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  Clipboard,
  Platform,
} from "react-native";
import { Colors } from "../../styles";
import { ButtonComp } from "../../components/buttonComp";
import { AuthNavigator } from "../../navigations";
import { useIsFocused } from "@react-navigation/native";
import Orientation from "react-native-orientation-locker";
import { getWidth } from "../../utils/helperFunctions";
import { useDispatch, useSelector } from "react-redux";
import { clearState, SetNewUpdateAvailable } from "../../redux/homeReducer";
import * as AsyncStore from "../../asyncStore";
import SpInAppUpdates, {
  IAUUpdateKind,
  StartUpdateOptions,
} from "sp-react-native-in-app-updates";
import BackgroundService from "react-native-background-actions";
import { VersionString } from "../../forceUpdate";
import { AuthContext } from "../../utils/authContext";
import { myTaskClearState } from "../../redux/mytaskReducer";
import { notificationClearState } from "../../redux/notificationReducer";
import { clearEnqState } from "../../redux/enquiryReducer";
import { clearLeadDropState } from "../../redux/leaddropReducer";
import {
  saveFilterPayload,
  updateDealerFilterData,
  updateFilterSelectedData,
} from "../../redux/targetSettingsReducer";
import PushNotification from "react-native-push-notification";
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import { updateToken } from "../../redux/loginReducer";
import messaging from "@react-native-firebase/messaging";
import firebase from "@react-native-firebase/app";

const WelcomeScreen = ({ navigation }) => {
  const { signOut } = React.useContext(AuthContext);
  const selector = useSelector((state) => state.homeReducer);
  const dispatch = useDispatch();

  useEffect(async () => {
    const token = await messaging().getToken();
    console.log("OOOOO", token);
    Clipboard.setString(token);
    messaging().requestPermission();
    messaging().onMessage(async (remoteMessage) => {
      console.log(
        "Received a new notification while the app is in the foreground:",
        remoteMessage.notification
      );
      // Display the notification in your app
    });

    // Handle incoming notifications when app is in background or not running
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log(
        "Received a new notification while the app is in the background:",
        remoteMessage.notification
      );
      // Display the notification in your app
    });
    // Get the device token
    messaging()
      .getToken()
      .then((token) => {
        if (Platform.OS === "ios") {
          dispatch(updateToken(token));
        }
        console.log("FCM Token:", token);
        // Save the token to your backend server for sending notifications later
      });

    // Listen for token refresh events
    messaging().onTokenRefresh((token) => {
      console.log("FCM Token refreshed:", token);
      // Save the new token to your backend server for sending notifications later
    });

    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (token) {
        console.log(token);
        // Clipboard.setString(token.token);
        if (Platform.OS === "android") {
          dispatch(updateToken(token.token));
        }
      },
      // (required) Called when a remote is received or opened, or local notification is opened
      onNotification: function (notification) {
        console.log("NOTI", notification);
        // if (notification.foreground) {
        //   PushNotification.localNotification({
        //     title: notification.title,
        //     message: notification.message,
        //   });
        // }
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

  const signOutClicked = async () => {
    AsyncStore.storeData(AsyncStore.Keys.USER_NAME, "");
    AsyncStore.storeData(AsyncStore.Keys.USER_TOKEN, "");
    AsyncStore.storeData(AsyncStore.Keys.EMP_ID, "");
    AsyncStore.storeData(AsyncStore.Keys.LOGIN_EMPLOYEE, "");
    AsyncStore.storeData(AsyncStore.Keys.EXTENSION_ID, "");
    AsyncStore.storeData(AsyncStore.Keys.EXTENSSION_PWD, "");
    AsyncStore.storeData(AsyncStore.Keys.IS_LOGIN, "false");
    AsyncStore.storeJsonData(AsyncStore.Keys.TODAYSDATE, new Date().getDate());
    AsyncStore.storeJsonData(AsyncStore.Keys.COORDINATES, []);
    await BackgroundService.stop();
    //realm.close();
    dispatch(clearState());
    dispatch(clearState());
    dispatch(myTaskClearState());
    dispatch(notificationClearState());
    dispatch(clearEnqState());
    dispatch(clearLeadDropState());
    dispatch(saveFilterPayload({}));
    dispatch(updateFilterSelectedData({}));
    dispatch(updateDealerFilterData({}));
    signOut();
  };

  useEffect(() => {
    // checkAppUpdate();
  }, []);

  const loginButtonClicked = () => {
    navigation.navigate(AuthNavigator.AuthStackIdentifiers.LOGIN);
  };

  const RegisterButtonClicked = () => {
    navigation.navigate(AuthNavigator.AuthStackIdentifiers.REGISTER);
  };

  const UpdateApp = () => {
    alert("Please Update to Latest Version");
  };

  const checkAppUpdate = async () => {
    try {
      const inAppUpdates = new SpInAppUpdates(
        false // isDebug
      );
      console.log("LLLL", VersionString);
      await inAppUpdates
        .checkNeedsUpdate({ curVersion: VersionString })
        .then((result) => {
          console.log("result", result);
          try {
            if (result.shouldUpdate) {
              let updateOptions: StartUpdateOptions = {};
              if (Platform.OS === "android") {
                updateOptions = {
                  updateType: IAUUpdateKind.IMMEDIATE,
                };
              } else if (Platform.OS === "ios") {
                var title = "New Version is Available";
                updateOptions = {
                  forceUpgrade: true,
                  title: title,
                  message: "Please Update to Latest Version",
                  buttonUpgradeText: "Update",
                };
              }

              inAppUpdates.startUpdate(updateOptions).finally(async () => {
                const employeeData = await AsyncStore.getData(
                  AsyncStore.Keys.LOGIN_EMPLOYEE
                );
                if (employeeData) {
                  dispatch(SetNewUpdateAvailable(true));
                  signOutClicked();
                } else {
                  dispatch(SetNewUpdateAvailable(true));
                }
              });
            } else {
              dispatch(SetNewUpdateAvailable(false));
            }
          } catch (e) {}
        })
        .catch((error) => {
          console.log("KOOOOOO", error);
        });
    } catch (e) {}
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
          style={{ width: getWidth(80), height: 95 }}
          resizeMode={"contain"}
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
        onPress={selector.newUpdateAvailable ? UpdateApp : loginButtonClicked}
        color={Colors.PINK}
      />
      {Platform.OS === "ios" && (
        <>
          <View style={{ height: 10 }} />
          <ButtonComp
            title={"REGISTER"}
            width={getWidth(100) - 40}
            onPress={
              selector.newUpdateAvailable ? UpdateApp : RegisterButtonClicked
            }
            color={Colors.PINK}
          />
        </>
      )}
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
