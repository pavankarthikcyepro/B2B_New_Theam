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
  getDistanceBetweenTwoPointsLatLong,
  GlobalSpeed,
  MarkAbsent,
  officeRadius,
  options,
  sendAlertLocalNotification,
  sendLocalNotification,
  sleep,
  veryIntensiveTask,
} from "./service";
// import Geolocation from "react-native-geolocation-service";
import { client } from "./networking/client";
import URL, {
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
import { registerCrashListener } from "./CrashListener";
import TrackPlayer from "react-native-track-player";
import moment from "moment";
import Geolocation from "@react-native-community/geolocation";
import GetLocation from "react-native-get-location";

enableScreens();
const dateFormat = "YYYY-MM-DD";
const currentDateMoment = moment().format(dateFormat);
const AppScreen = () => {
  
  useEffect(() => {
    registerCrashListener();
  }, []);

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

  const checkTheDate = async (employeeData, lastPosition) => {
    const { longitude, latitude, speed } = lastPosition;
    if (employeeData) {
      const jsonObj = JSON.parse(employeeData);
      // const trackingResponse = await client.get(
      //   getDetailsByempIdAndorgId + `/${jsonObj.empId}/${jsonObj.orgId}`
      // );
      const trackingResponse = await client.get(
        URL.GET_MAP_COORDINATES_BY_ID(
          jsonObj.empId,
          jsonObj.orgId,
          currentDateMoment
        )
      );
      const trackingJson = await trackingResponse.json();
      const currentDate = new Date();
      const hasObjectWithCurrentDate1 = trackingJson.filter((obj) => {
        const selectedDate = new Date(obj.createdtimestamp);
        return (
          selectedDate.getDate() === currentDate.getDate() &&
          selectedDate.getMonth() === currentDate.getMonth() &&
          selectedDate.getFullYear() === currentDate.getFullYear()
        );
      });
      const hasObjectWithCurrentDate =
        hasObjectWithCurrentDate1[hasObjectWithCurrentDate1.length - 1];
      if (hasObjectWithCurrentDate) {
        console.log(
          `There is an object named ${JSON.stringify(
            hasObjectWithCurrentDate.isStart
          )} with the same date as the current date.`
        );
        if (
          hasObjectWithCurrentDate.isStart === "true" &&
          hasObjectWithCurrentDate.isEnd === "false"
        ) {
          const tempArray =JSON.parse(JSON.parse(hasObjectWithCurrentDate.location));
          console.log(
            "TeyhasObjectWithCurrentDatepe",
             tempArray
          );
          const finalArray = tempArray.concat([{ longitude, latitude }]);
          const distanceCheck = tempArray[tempArray.length - 1];
          let distance = getDistanceBetweenTwoPointsLatLong(
            distanceCheck.latitude,
            distanceCheck.longitude,
            latitude,
            longitude
          );
          if (distance >= 10) {
            const payload = {
              id: hasObjectWithCurrentDate.id,
              orgId: jsonObj?.orgId,
              empId: jsonObj?.empId,
              branchId: jsonObj?.branchId,
              currentTimestamp: new Date(
                hasObjectWithCurrentDate.createdtimestamp
              ).getTime(),
              updateTimestamp: new Date().getTime(),
              purpose: "",
              location: JSON.stringify(finalArray),
              kmph: speed.toString(),
              speed: speed.toString(),
              isStart: "true",
              isEnd: "false",
            };
            const response = await client.put(
              locationUpdate + `/${trackingJson[trackingJson.length - 1].id}`,
              payload
            );
            const json = await response.json();
          }
        }
        if (
          hasObjectWithCurrentDate.isStart === "true" &&
          hasObjectWithCurrentDate.isEnd === "true"
        ) {
          const tempArray = JSON.parse(JSON.parse(hasObjectWithCurrentDate.location));
          const finalArray = tempArray.concat([{ longitude, latitude }]);
          const distanceCheck = tempArray[tempArray.length - 1];
          let distance = getDistanceBetweenTwoPointsLatLong(
            distanceCheck.latitude,
            distanceCheck.longitude,
            latitude,
            longitude
          );
          if (true) {
            const payload = {
              id: 0,
              orgId: jsonObj?.orgId,
              empId: jsonObj?.empId,
              branchId: jsonObj?.branchId,
              currentTimestamp: new Date().getTime(),
              updateTimestamp: new Date().getTime(),
              purpose: "",
              location: JSON.stringify([{ longitude, latitude }]),
              kmph: speed.toString(),
              speed: speed.toString(),
              isStart: "true",
              isEnd: "false",
            };
            const response = await client.post(saveLocation, payload);
            const json = await response.json();
          }
        }
      } else {
        console.log(
          "There is no object with the same date as the current date."
        );
        const payload = {
          id: 0,
          orgId: jsonObj?.orgId,
          empId: jsonObj?.empId,
          branchId: jsonObj?.branchId,
          currentTimestamp: new Date().getTime(),
          updateTimestamp: new Date().getTime(),
          purpose: "",
          location: JSON.stringify([{ longitude, latitude }]),
          kmph: speed.toString(),
          speed: speed.toString(),
          isStart: "true",
          isEnd: "false",
        };
        const response = await client.post(saveLocation, payload);
        const json = await response.json();
      }
    }
  };

  const checkTheEndDate = async (employeeData, lastPosition) => {
    const { longitude, latitude, speed } = lastPosition;
    if (employeeData) {
      const jsonObj = JSON.parse(employeeData);
      // const trackingResponse = await client.get(
      //   getDetailsByempIdAndorgId + `/${jsonObj.empId}/${jsonObj.orgId}`
      // );
      const trackingResponse = await client.get(
        URL.GET_MAP_COORDINATES_BY_ID(
          jsonObj.empId,
          jsonObj.orgId,
          currentDateMoment
        )
      );
      const trackingJson = await trackingResponse.json();
      const currentDate = new Date();
      const hasObjectWithCurrentDate1 = trackingJson.filter((obj) => {
        const selectedDate = new Date(obj.createdtimestamp);
        return (
          selectedDate.getDate() === currentDate.getDate() &&
          selectedDate.getMonth() === currentDate.getMonth() &&
          selectedDate.getFullYear() === currentDate.getFullYear()
        );
      });
      const hasObjectWithCurrentDate =
        hasObjectWithCurrentDate1[hasObjectWithCurrentDate1.length - 1];
      if (hasObjectWithCurrentDate) {
        console.log(
          `There is an object named ${JSON.stringify(
            hasObjectWithCurrentDate1
          )} with the same date as the current hasObjectWithCurrentDate1date.`
        );
        if (
          hasObjectWithCurrentDate.isStart === "true" &&
          hasObjectWithCurrentDate.isEnd === "false"
        ) {
          const tempArray = JSON.parse(
            JSON.parse(hasObjectWithCurrentDate.location)
          );
          const finalArray = tempArray.concat([{ longitude, latitude }]);
          const distanceCheck = tempArray[tempArray.length - 1];
          let distance = getDistanceBetweenTwoPointsLatLong(
            distanceCheck.latitude,
            distanceCheck.longitude,
            latitude,
            longitude
          );
          console.log("distanssssce", distance);
          if (true) {
            const payload = {
              id: hasObjectWithCurrentDate.id,
              orgId: jsonObj?.orgId,
              empId: jsonObj?.empId,
              branchId: jsonObj?.branchId,
              currentTimestamp: new Date(
                hasObjectWithCurrentDate.createdtimestamp
              ).getTime(),
              updateTimestamp: new Date().getTime(),
              purpose: "",
              location: JSON.stringify(finalArray),
              kmph: speed.toString(),
              speed: speed.toString(),
              isStart: "true",
              isEnd: "true",
            };
            const response = await client.put(
              locationUpdate + `/${trackingJson[trackingJson.length - 1].id}`,
              payload
            );
            const json = await response.json();
          }
        }
      } else {
        console.log(
          "There is no object with the same date as the current End date."
        );
      }
    }
  };
  
  const getCoordinates = async () => {
    try {
      if (true) {
        // setInterval(() => {
        const watchID = GetLocation.getCurrentPosition({
          enableHighAccuracy: true,
        }).then(
          async (lastPosition) => {
            let speed = lastPosition?.speed <= -1 ? 0 : lastPosition?.speed;
            const employeeData = await AsyncStore.getData(
              AsyncStore.Keys.LOGIN_EMPLOYEE
            );
            console.log("SPEDDd", lastPosition);
            if (speed >= GlobalSpeed) {
              checkTheDate(employeeData, lastPosition);
            }
            if (speed < GlobalSpeed && speed >= 0) {
              checkTheEndDate(employeeData, lastPosition);
            }

            return;
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
        ).catch(()=>{});
        setSubscriptionId(watchID);
        // }, 5000);
      }
    } catch (error) {
      // showToastRedAlert(error);
    }
  };

  // useEffect(() => {
  //   const watchId = Geolocation.watchPosition(
  //     async (position) => {
  //       const { latitude, longitude, speed } = position.coords;
  //       console.log("speed", speed);
  //       if (speed >= 10) {
  //         EventTripStartCheck()
  //       }
  //       if (speed < 10) {
  //       }
  //     },
  //     (error) => {
  //       console.log(error.code, error.message);
  //     },
  //     { distanceFilter: 50 }
  //   );

  //   return () => {
  //     Geolocation.clearWatch(watchId);
  //   };
  // }, []);

  // const EventTripStartCheck = async () => {
  //   try {
  //     const employeeData = await AsyncStore.getData(
  //       AsyncStore.Keys.LOGIN_EMPLOYEE
  //     );
  //     if (employeeData) {
  //       const jsonObj = JSON.parse(employeeData);
  //       const trackingResponse = await client.get(
  //         getDetailsByempIdAndorgId + `/${jsonObj.empId}/${jsonObj.orgId}`
  //       );
  //       const trackingJson = await trackingResponse.json();
  //       console.log("trackingResponse", trackingResponse);

  //     }
  //   } catch (error) {}
  // };

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
