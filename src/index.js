import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AuthStackNavigator } from "./navigations/authNavigator";
import { MainStackNavigator } from "./navigations/appNavigator";
import { Provider } from "react-redux";
import reduxStore from "./redux/reduxStore";
import * as AsyncStore from "./asyncStore";
import { AuthContext } from "./utils/authContext";
import {
  checkLocationPermission,
  distanceFilterValue,
  getDistanceBetweenTwoPointsLatLong,
  GlobalSpeed,
} from "./service";
import { client } from "./networking/client";
import URL, { locationUpdate, saveLocation } from "./networking/endpoints";
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import { Platform } from "react-native";
import PushNotification from "react-native-push-notification";
import { enableScreens } from "react-native-screens";
import { showToastRedAlert } from "./utils/toast";
import Orientation from "react-native-orientation-locker";
import { registerCrashListener } from "./CrashListener";
import TrackPlayer from "react-native-track-player";
import moment from "moment";
import Geolocation from "@react-native-community/geolocation";
import GetLocation from "react-native-get-location";
import haversine from "haversine";
import BackgroundActions from "react-native-background-actions";
import { Colors } from "./styles";
import RNLocation from "react-native-location";
import BackgroundServices from "./backgroundServices";

let locationSubscription = null;

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

  const checkTheDate = async (employeeData, lastPosition) => {
    const { longitude, latitude, speed } = lastPosition;
    if (employeeData) {
      const jsonObj = JSON.parse(employeeData);
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
        // Have Today's Data
        if (
          hasObjectWithCurrentDate.isStart === "true" &&
          hasObjectWithCurrentDate.isEnd === "false" // Trip Not yet Ended
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
          if (distance >= distanceFilterValue) {
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
          hasObjectWithCurrentDate.isEnd === "true" // Trip Ended
        ) {
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
      } else {
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
          if (distance >= distanceFilterValue) {
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
      }
    }
  };

  useEffect(async () => {
    let todaysDate = await AsyncStore.getData(AsyncStore.Keys.COORDINATES);
    if (todaysDate) {
    } else {
      await AsyncStore.storeJsonData(AsyncStore.Keys.COORDINATES, "");
    }
    if (Platform.OS === "ios") {
      PushNotificationIOS.checkPermissions((item) => {
        if (!item.alert) {
          PushNotificationIOS.requestPermissions();
        }
      });
    }
    const checkUserToken = async () => {
      let userToken = await AsyncStore.getData(AsyncStore.Keys.USER_TOKEN);
      dispatch({ type: "RESTORE_TOKEN", token: userToken });
      const employeeData = await AsyncStore.getData(
        AsyncStore.Keys.LOGIN_EMPLOYEE
      );
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

  useEffect(async () => {
    if (state.userToken) {
      BackgroundServices.start();
      const employeeData = await AsyncStore.getData(
        AsyncStore.Keys.LOGIN_EMPLOYEE
      );
      if (employeeData) {
        const jsonObj = JSON.parse(employeeData);
        if (jsonObj.isGeolocation === "Y") {
          if (jsonObj.hrmsRole == "MD" || jsonObj.hrmsRole == "CEO") {
            BackgroundServices.stop();
          }
        } else {
          BackgroundServices.stop();
        }
      }
      RNLocation.requestPermission({
        ios: "always",
        android: {
          detail: "fine",
        },
      }).then((granted) => {
        if (Platform.OS === "android") {
          checkLocationPermission();
        }
        if (granted) {
          locationSubscription = RNLocation.subscribeToLocationUpdates(
            async (locations) => {
              console.log("locations", locations[0]);
              if (locations[0].speed >= GlobalSpeed) {
                checkTheDate(employeeData, locations[0]);
              }
              if (locations[0].speed < GlobalSpeed) {
                checkTheEndDate(employeeData, locations[0]);
              }
            }
          );
        }
      });

      return () => {
        locationSubscription && locationSubscription();
        BackgroundServices.stop();
      };
    }
  }, [state.userToken]);

  useEffect(() => {
    return () => {
      locationSubscription && locationSubscription();
      BackgroundServices.stop();
    };
  }, []);

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
