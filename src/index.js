import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AuthNavigator, AppNavigator } from "./navigations";
import { AuthStackNavigator } from "./navigations/authNavigator";
import {
  MainStackDrawerNavigator,
  MainStackNavigator,
} from "./navigations/appNavigator";
import { Provider } from "react-redux";
import reduxStore from "./redux/reduxStore";
import * as AsyncStore from "./asyncStore";
import { AuthContext } from "./utils/authContext";
import BackgroundService from "react-native-background-actions";
import {
  createDateTime,
  distanceFilterValue,
  getDistanceBetweenTwoPoints,
  MarkAbsent,
  officeRadius,
  options,
  sendAlertLocalNotification,
  sendLocalNotification,
  sleep,
  veryIntensiveTask,
} from "./service";
import Geolocation from "@react-native-community/geolocation";
import { client } from "./networking/client";
import {
  getDetailsByempIdAndorgId,
  locationUpdate,
  saveLocation,
} from "./networking/endpoints";
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import { Platform, AppState } from "react-native";
import PushNotification from "react-native-push-notification";
import { enableScreens } from "react-native-screens";

enableScreens();

const officeLocation = {
  latitude: 37.33233141,
  longitude: -122.0312186,
};

const AppScreen = () => {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case "RESTORE_TOKEN":
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case "SIGN_IN":
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case "SIGN_OUT":
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    }
  );

  const initialData = async () => {
    try {
      await AsyncStore.storeJsonData(
        AsyncStore.Keys.TODAYSDATE,
        new Date().getDate()
      );
      await AsyncStore.storeJsonData(AsyncStore.Keys.COORDINATES, []);
      getCoordinates();
    } catch (error) {}
  };

  const objectsEqual = (o1, o2) =>
    Object.keys(o1).length === Object.keys(o2).length &&
    Object.keys(o1).every((p) => o1[p] === o2[p]);

  const getCoordinates = async () => {
    try {
      let coordinates = await AsyncStore.getJsonData(
        AsyncStore.Keys.COORDINATES
      );
      let todaysDate = await AsyncStore.getData(AsyncStore.Keys.TODAYSDATE);
      if (todaysDate != new Date().getDate()) {
        initialData();
      } else {
        var startDate = createDateTime("8:30");
        var startBetween = createDateTime("9:30");
        var endBetween = createDateTime("20:30");
        var endDate = createDateTime("21:30");
        var now = new Date();
        var isBetween = startDate <= now && now <= endDate;
        if (isBetween) {
          Geolocation.watchPosition(
            async (lastPosition) => {
              console.log("lastPOSTION", lastPosition);
              let speed =
                lastPosition?.coords?.speed <= -1
                  ? 0
                  : lastPosition?.coords?.speed * 3.6;
              console.log("SPEED=============", speed);
              const employeeData = await AsyncStore.getData(
                AsyncStore.Keys.LOGIN_EMPLOYEE
              );
              // console.log("employeeData", employeeData);
              if (employeeData) {
                const jsonObj = JSON.parse(employeeData);
                const trackingResponse = await client.get(
                  getDetailsByempIdAndorgId +
                    `/${jsonObj.empId}/${jsonObj.orgId}`
                );
                const trackingJson = await trackingResponse.json();

                var newLatLng = {
                  latitude: lastPosition.coords.latitude,
                  longitude: lastPosition.coords.longitude,
                };
                let dist = getDistanceBetweenTwoPoints(
                  officeLocation.latitude,
                  officeLocation.longitude,
                  lastPosition?.coords?.latitude,
                  lastPosition?.coords?.longitude
                );
                if (dist > officeRadius) {
                  // sendAlertLocalNotification();
                } else {
                  // seteReason(false);
                }
                let parsedValue =
                  trackingJson.length > 0
                    ? JSON.parse(trackingJson[trackingJson.length - 1].location)
                    : null;

                if (coordinates.length > 0 && parsedValue) {
                  if (
                    objectsEqual(
                      coordinates[coordinates.length - 1],
                      parsedValue[parsedValue.length - 1]
                    )
                  ) {
                    return;
                  }
                }

                let newArray = [...coordinates, ...[newLatLng]];
                let date = new Date(
                  trackingJson[trackingJson.length - 1]?.createdtimestamp
                );
                let condition = date.getDate() == new Date().getDate();
                console.log("sss",trackingJson);
                if (trackingJson.length > 0 && condition) {
                  let tempPayload = {
                    id: trackingJson[trackingJson.length - 1]?.id,
                    orgId: jsonObj?.orgId,
                    empId: jsonObj?.empId,
                    branchId: jsonObj?.branchId,
                    currentTimestamp: new Date().getTime(),
                    updateTimestamp: new Date().getTime(),
                    purpose: "",
                    location: JSON.stringify(newArray),
                    kmph: speed.toString(),
                    speed: speed.toString(),
                  };
                                    console.log("SSxxxsddddsSS");

                  if (speed <= 10) {
                    await AsyncStore.storeJsonData(
                      AsyncStore.Keys.COORDINATES,
                      newArray
                    );
                    console.log("SSSS");
                    const response = await client.put(
                      locationUpdate +
                        `/${trackingJson[trackingJson.length - 1].id}`,
                      tempPayload
                    );
                    const json = await response.json();
                  }
                } else {
                  let payload = {
                    id: 0,
                    orgId: jsonObj?.orgId,
                    empId: jsonObj?.empId,
                    branchId: jsonObj?.branchId,
                    currentTimestamp: new Date().getTime(),
                    updateTimestamp: new Date().getTime(),
                    purpose: "",
                    location: JSON.stringify(newArray),
                    kmph: speed.toString(),
                    speed: speed.toString(),
                  };
                  console.log("SSxxxsssSS");

                  if (speed <= 10) {
                    console.log("SSsssSS");

                    await AsyncStore.storeJsonData(
                      AsyncStore.Keys.COORDINATES,
                      newArray
                    );
                    const response = await client.post(saveLocation, payload);
                    const json = await response.json();
                  }
                }
              }
            },
            (error) => {
              console.error(error);
            },
            { enableHighAccuracy: true, distanceFilter: distanceFilterValue }
          );
        }
      }
    } catch (error) {}
  };

  const veryIntensiveTask = async (taskDataArguments) => {
    // Example of an infinite loop task
    const { delay } = taskDataArguments;
    await new Promise(async (resolve) => {
      for (let i = 0; BackgroundService.isRunning(); i++) {
        // console.log(i);
        var startDate = createDateTime("8:30");
        var startBetween = createDateTime("9:30");
        var endBetween = createDateTime("20:30");
        var endDate = createDateTime("21:30");
        var now = new Date();
        if (startDate <= now && now <= startBetween) {
          sendLocalNotification();
        }
        // console.log("AppState", AppState.currentState);
        if (
          AppState.currentState === "background" ||
          AppState.currentState === "inactive"
        ) {
          if (now >= startBetween) {
            MarkAbsent();
          }
        }

        if (endBetween <= now && now <= endDate) {
          sendLocalNotification();
        }
        try {
          let todaysDate = await AsyncStore.getData(AsyncStore.Keys.TODAYSDATE);
          if (todaysDate) {
            getCoordinates();
          } else {
            initialData();
          }
        } catch (error) {}
        await sleep(delay);
      }
    });
  };

  const startTracking = async () => {
    if (Platform.OS === "ios") {
      Geolocation.requestAuthorization((value) => {
        // alert(value);
      });
    }
    await Geolocation.setRNConfiguration({
      skipPermissionRequests: false,
      authorizationLevel: "always" | "whenInUse" | "auto",
      locationProvider: "playServices" | "android" | "auto",
    });
    await BackgroundService.start(veryIntensiveTask, options);
  };

  useEffect(async () => {
    if (Platform.OS === "ios") {
      PushNotificationIOS.checkPermissions((item) => {
        if (!item.alert) {
          PushNotificationIOS.requestPermissions();
        }
      });
      // sendLocalNotification();
    }
    if (Platform.OS === "android") {
      PushNotification.checkPermissions((item) => {
        if (!item.alert) {
          PushNotification.requestPermissions();
        }
      });
      // sendLocalNotification();
    }

    const checkUserToken = async () => {
      await BackgroundService.stop();
      let userToken = await AsyncStore.getData(AsyncStore.Keys.USER_TOKEN);
      dispatch({ type: "RESTORE_TOKEN", token: userToken });
      if (userToken) {
        startTracking();
      } else {
        await BackgroundService.stop();
      }
    };

    checkUserToken();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async (token) => {
        dispatch({ type: "SIGN_IN", token: token });
      },
      signOut: () => {
        AsyncStore.storeData(AsyncStore.Keys.USER_TOKEN, "");
        dispatch({ type: "SIGN_OUT" });
      },
      signUp: async (data) => {
        dispatch({ type: "SIGN_IN", token: "dummy-auth-token" });
      },
    }),
    []
  );

  return (
    <AuthContext.Provider value={authContext}>
      <Provider store={reduxStore}>
        <NavigationContainer>
          {state.userToken ? <MainStackNavigator /> : <AuthStackNavigator />}
        </NavigationContainer>
      </Provider>
    </AuthContext.Provider>
  );
};

export default AppScreen;
