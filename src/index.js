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
import Geolocation from "react-native-geolocation-service";
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
import { showToastRedAlert } from "./utils/toast";
import Orientation from "react-native-orientation-locker";
import TrackPlayer from "react-native-track-player";

enableScreens();

const AppScreen = () => {
  useEffect(async () => {
    Orientation.lockToPortrait();
    await TrackPlayer.setupPlayer();
  }, []);
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
  const [subscriptionId, setSubscriptionId] = useState(null);

  useEffect(() => {
    return () => {
      clearWatch();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clearWatch = () => {
    subscriptionId !== null && Geolocation.clearWatch(subscriptionId);
    setSubscriptionId(null);
  };

  const initialData = async () => {
    try {
      await AsyncStore.storeJsonData(
        AsyncStore.Keys.TODAYSDATE,
        new Date().getDate()
      );
      await AsyncStore.storeJsonData(AsyncStore.Keys.COORDINATES, []);
      // getCoordinates();
    } catch (error) {}
  };

  const objectsEqual = (o1, o2) =>
    Object.keys(o1).length === Object.keys(o2).length &&
    Object.keys(o1).every((p) => o1[p] === o2[p]);

  const getCoordinates = async () => {
    try {
      if (true) {
        // setInterval(() => {
        const watchID = Geolocation.getCurrentPosition(
          async (lastPosition) => {
            let speed =
              lastPosition?.coords?.speed <= -1
                ? 0
                : lastPosition?.coords?.speed;
            const employeeData = await AsyncStore.getData(
              AsyncStore.Keys.LOGIN_EMPLOYEE
            );
            if (employeeData) {
              const jsonObj = JSON.parse(employeeData);
              const trackingResponse = await client.get(
                getDetailsByempIdAndorgId + `/${jsonObj.empId}/${jsonObj.orgId}`
              );
              const trackingJson = await trackingResponse.json();

              var newLatLng = {
                latitude: lastPosition.coords.latitude,
                longitude: lastPosition.coords.longitude,
              };
              if (trackingJson.length > 0) {
                let parsedValue =
                  trackingJson.length > 0
                    ? JSON.parse(trackingJson[trackingJson.length - 1].location)
                    : [];

                let x = trackingJson;
                let y = x[x.length - 1].location;
                let z = JSON.parse(y);
                let lastlocation = z[z.length - 1];

                let dist = getDistanceBetweenTwoPoints(
                  lastlocation.latitude,
                  lastlocation.longitude,
                  lastPosition?.coords?.latitude,
                  lastPosition?.coords?.longitude
                );
                let distance = dist * 1000;
                let newArray = [...parsedValue, ...[newLatLng]];
                let date = new Date(
                  trackingJson[trackingJson.length - 1]?.createdtimestamp
                );
                let condition =
                  new Date(date).getDate() == new Date().getDate();
                if (trackingJson.length > 0 && condition) {
                  let tempPayload = {
                    id: trackingJson[trackingJson.length - 1]?.id,
                    orgId: jsonObj?.orgId,
                    empId: jsonObj?.empId,
                    branchId: jsonObj?.branchId,
                    currentTimestamp:
                      trackingJson[trackingJson.length - 1]?.createdtimestamp,
                    updateTimestamp: new Date().getTime(),
                    purpose: "",
                    location: JSON.stringify(newArray),
                    kmph: speed.toString(),
                    speed: speed.toString(),
                  };
                  if (speed <= 10 && distance > distanceFilterValue) {
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
                    location: JSON.stringify([newLatLng]),
                    kmph: speed.toString(),
                    speed: speed.toString(),
                  };
                  if (speed <= 10) {
                    const response = await client.post(saveLocation, payload);
                    const json = await response.json();
                  }
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
                  location: JSON.stringify([newLatLng]),
                  kmph: speed.toString(),
                  speed: speed.toString(),
                };
                if (speed <= 10) {
                  const response = await client.post(saveLocation, payload);
                  const json = await response.json();
                }
              }
            }
          },
          (error) => {},
          {
            enableHighAccuracy: true,
            //  distanceFilter: distanceFilterValue,
            //  timeout: 2000,
            //  maximumAge: 0,
            //  interval: 5000,
            //  fastestInterval: 2000,
            accuracy: {
              android: "high",
            },
            // useSignificantChanges: true,
          }
        );
        setSubscriptionId(watchID);
        // }, 5000);
      }
    } catch (error) {
      // showToastRedAlert(error);
    }
  };

  const veryIntensiveTask = async (taskDataArguments) => {
    // Example of an infinite loop task
    const { delay } = taskDataArguments;
    await new Promise(async (resolve) => {
      for (let i = 0; BackgroundService.isRunning(); i++) {
        try {
                      getCoordinates();

          // let todaysDate = await AsyncStore.getData(AsyncStore.Keys.TODAYSDATE);
          // if (todaysDate) {
          //   getCoordinates();
          // } else {
          //   initialData();
          // }
        } catch (error) {}
        await sleep(delay);
      }
    });
  };

  const startTracking = async () => {
    if (Platform.OS === "ios") {
      Geolocation.requestAuthorization("always");
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
    }
    const checkUserToken = async () => {
      await BackgroundService.stop();
      let userToken = await AsyncStore.getData(AsyncStore.Keys.USER_TOKEN);
      dispatch({ type: "RESTORE_TOKEN", token: userToken });
      const employeeData = await AsyncStore.getData(
        AsyncStore.Keys.LOGIN_EMPLOYEE
      );
      if (employeeData) {
        const jsonObj = JSON.parse(employeeData);
        if (jsonObj.isGeolocation === "Y") {
          if (jsonObj.hrmsRole == "MD" || jsonObj.hrmsRole == "CEO") {
            BackgroundService.stop();
          } else {
            if (userToken) {
              startTracking();
            } else {
              await BackgroundService.stop();
            }
          }
        }
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
        Orientation.lockToPortrait();
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
