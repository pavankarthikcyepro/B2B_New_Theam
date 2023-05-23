import Geolocation from "@react-native-community/geolocation";
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import {
  Alert,
  BackHandler,
  Linking,
  PermissionsAndroid,
  Platform,
} from "react-native";
import BackgroundService from "react-native-background-actions";
import PushNotification from "react-native-push-notification";
import IntentLauncher, { IntentConstant } from "react-native-intent-launcher";
import { Colors } from "../styles";
import * as AsyncStore from "../asyncStore";
import URL from "../networking/endpoints";
import { client } from "../networking/client";
import { monthNamesCap } from "../scenes/mainScenes/Attendance/AttendanceTop";
import DeviceInfo from "react-native-device-info";

export const GoogleMapKey = "AIzaSyD1p1YFpi2w3yBrYl1aUpudMqe9IzMQt2Y";
var startDate = createDateTime("8:30");
var endDate = createDateTime("12:00");
var now = new Date();
var isBetween = startDate <= now && now <= endDate;

export const distanceFilterValue = 50; // Meters
export const GlobalSpeed = 10 / 3.6; // 10 km/hr in m/s     ||  1 m/s = 3.6 kilometer per hour

export const officeRadius = 0.1;
export const sleep = (time) =>
  new Promise((resolve) => setTimeout(() => resolve(), time));

export const MarkAbsent = async (absentRequest = false) => {
  try {
    let employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
    let isPresent = await AsyncStore.getData(AsyncStore.Keys.IS_PRESENT);
    if (isPresent) {
      if (isPresent !== new Date().getDate()) {
        if (employeeData) {
          const jsonObj = JSON.parse(employeeData);
          let payload = {
            id: 0,
            orgId: jsonObj.orgId,
            empId: jsonObj.empId,
            branchId: jsonObj.branchId,
            isPresent: 0,
            isAbsent: 1,
            status: "Active",
            comments: "",
            reason: "",
          };
          var d = new Date();
          const response = await client.get(
            URL.GET_ATTENDANCE_EMPID(
              jsonObj.empId,
              jsonObj.orgId,
              monthNamesCap[d.getMonth()]
            )
          );
          const json = await response.json();

          let latestDate = new Date(
            json[json?.length - 1]?.createdtimestamp
          )?.getDate();
          let todaysDate = new Date().getDate();
          if (json?.length !== 0 && latestDate !== todaysDate) {
            saveData(payload, true);
            AsyncStore.storeData(AsyncStore.Keys.IS_PRESENT, todaysDate);
          }
        }
      } else {
        return;
      }
    } else {
      AsyncStore.storeData(AsyncStore.Keys.IS_PRESENT, "0");
    }
  } catch (error) {
    console.error("MAIN", error);
  }
};

const saveData = async (payload, absentRequest = false) => {
  try {
    const saveData = await client.post(URL.SAVE_EMPLOYEE_ATTENDANCE(), payload);
    const savedJson = await saveData.json();
  } catch (error) {
    console.error("savedJsonERROR", error);
  }
};

// You can do anything in your task such as network requests, timers and so on,
// as long as it doesn't touch UI. Once your task completes (i.e. the promise is resolved),
// React Native will go into "paused" mode (unless there are other tasks running,
// or there is a foreground app).
export const veryIntensiveTask = async (taskDataArguments) => {
  // Example of an infinite loop task
  const { delay } = taskDataArguments;
  await new Promise(async (resolve) => {
    for (let i = 0; BackgroundService.isRunning(); i++) {
      try {
        await Geolocation.watchPosition(
          (lastPosition) => {
            var newLatLng = {
              latitude: lastPosition.coords.latitude,
              longitude: lastPosition.coords.longitude,
            };
          },
          (error) => alert(JSON.stringify(error)),
          { enableHighAccuracy: true, distanceFilter: 100 }
        );
        Geolocation.watchPosition((data) => {});
      } catch (error) {}

      await BackgroundService.updateNotification({
        taskTitle: "test",
      });
      await sleep(delay);
    }
  });
};

export const options = {
  taskName: "Cyepro",
  taskTitle: "Cyepro",
  taskDesc: "Cyepro is tracking",
  taskIcon: {
    name: "@mipmap/cy",
    type: "mipmap",
  },
  color: Colors.PINK,
  linkingURI: "yourSchemeHere", // See Deep Linking for more info
  parameters: {
    delay: 10000,
  },
};

export function getDistanceBetweenTwoPoints(lat1, lon1, lat2, lon2) {
  if (lat1 == lon1?.lat && lat2 == lon2) {
    return 0;
  }

  const radlat1 = (Math.PI * lat1) / 180;
  const radlat2 = (Math.PI * lat2) / 180;

  const theta = lon1 - lon2;
  const radtheta = (Math.PI * theta) / 180;

  let dist =
    Math.sin(radlat1) * Math.sin(radlat2) +
    Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);

  if (dist > 1) {
    dist = 1;
  }

  dist = Math.acos(dist);
  dist = (dist * 180) / Math.PI;
  dist = dist * 60 * 1.1515;
  dist = dist * 1.609344; //convert miles to km

  return dist;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

export const getDistanceBetweenTwoPointsLatLong = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceInMeters = R * c * 1000; // Distance in meters
  return distanceInMeters;
};

export function createDateTime(time) {
  var splitted = time.split(":");
  if (splitted.length != 2) return undefined;

  var date = new Date();
  date.setHours(parseInt(splitted[0], 10));
  date.setMinutes(parseInt(splitted[1], 10));
  date.setSeconds(0);
  return date;
}

export const sendLocalNotification = (alert) => {
  if (Platform.OS === "ios") {
    PushNotificationIOS.presentLocalNotification({
      alertTitle: isBetween ? "Good Morning" : "Good Evening",
      alertBody: isBetween
        ? `Please Punch Your Attendance`
        : "Please LogOut Your Attendance",
      applicationIconBadgeNumber: 1,
    });
  }
  if (Platform.OS === "android") {
    PushNotification.createChannel(
      {
        channelId: "mychannel", // (required)
        channelName: "My channel", // (required)
        vibrate: true,
      },
      (created) => {
        PushNotification.localNotification({
          channelId: "mychannel",
          autoCancel: true,
          // bigText: "data",
          // subText: "Notification",
          title: isBetween ? "Good Morning" : "Good Evening",
          message: isBetween
            ? `Please Punch Your Attendance`
            : "Please LogOut Your Attendance",
          vibrate: true,
          vibration: 300,
          playSound: true,
          soundName: "default",
          ignoreInForeground: false,
          importance: "high",
          invokeApp: true,
          allowWhileIdle: true,
          priority: "high",
          visibility: "public",
          largeIcon: "@mipmap/cy",
          smallIcon: "@mipmap/cy",
        });
      }
    );
  }
};

export const sendAlertLocalNotification = (alert) => {
  if (Platform.OS === "ios") {
    PushNotificationIOS.presentLocalNotification({
      alertTitle: isBetween ? "Good Morning" : "Good Evening",
      alertBody: "You are 100 meters Away from Your Office",
      applicationIconBadgeNumber: 1,
    });
  }
  if (Platform.OS === "android") {
    PushNotification.createChannel(
      {
        channelId: "mychannel", // (required)
        channelName: "My channel", // (required)
        vibrate: true,
      },
      (created) => {
        PushNotification.localNotification({
          channelId: "mychannel",
          autoCancel: true,
          // bigText: "data",
          // subText: "Notification",
          title: "You are 100 meters Away from Your Office",
          message: "You are 100 meters Away from Your Office",
          vibrate: true,
          vibration: 300,
          playSound: true,
          soundName: "default",
          ignoreInForeground: false,
          importance: "high",
          invokeApp: true,
          allowWhileIdle: true,
          priority: "high",
          visibility: "public",
          largeIcon: "@mipmap/cy",
          smallIcon: "@mipmap/cy",
        });
      }
    );
  }
};

export const checkLocationPermission = async () => {
  try {
    const granted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION
    );
    if (granted) {
      console.log("Location permission is granted");
      const settingsGranted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
        null,
        "always"
      );
      console.log("settingsGranted", settingsGranted);
      if (settingsGranted) {
        console.log('Location option is set to "Always"');
        // Handle the case where "Always" is selected
      } else {
        console.log('Location option is set to "Allow While Using App"');
        // Handle the case where "Allow While Using App" is selected
      }

      // Do something with the location permission
    } else {
      console.log("Location permission not granted");
      Alert.alert(
        "Location Permission Required",
        'Permissions -> Location ->  Please enable "Allow All the Time" for location in your device settings.',
        [
          {
            text: "Cancel",
            style: "cancel",
            onPress: () => {
              BackHandler.exitApp();
            },
          },
          {
            text: "Open Settings",
            onPress: () => {
              // Linking.openSettings();
              IntentLauncher.startActivity({
                action: "android.settings.APPLICATION_DETAILS_SETTINGS",
                data: "package:" + DeviceInfo.getBundleId(),
              });
            },
          },
        ]
      );
    }
  } catch (error) {
    console.error("Error checking or requesting location permission:", error);
  }
};

export const requestNotificationPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.NOTIFICATIONS
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("Notification permission granted");
      // Handle notification logic here
    } else {
      console.log("Notification permission denied");
      // Handle permission denied case
    }
  } catch (error) {
    console.log("Error while requesting notification permission:", error);
    // Handle error case
  }
};