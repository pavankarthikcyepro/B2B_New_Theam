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
import { options, sleep, veryIntensiveTask } from "./service";
import Geolocation from "@react-native-community/geolocation";
import { client } from "./networking/client";
import {
  getDetailsByempIdAndorgId,
  locationUpdate,
  saveLocation,
} from "./networking/endpoints";

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

  function createDateTime(time) {
    var splitted = time.split(":");
    if (splitted.length != 2) return undefined;

    var date = new Date();
    date.setHours(parseInt(splitted[0], 10));
    date.setMinutes(parseInt(splitted[1], 10));
    date.setSeconds(0);
    return date;
  }

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
        var endDate = createDateTime("21:30");
        var now = new Date();
        var isBetween = startDate <= now && now <= endDate;
        if (isBetween) {
          Geolocation.watchPosition(
            async (lastPosition) => {
              const employeeData = await AsyncStore.getData(
                AsyncStore.Keys.LOGIN_EMPLOYEE
              );
              if (employeeData) {
                const jsonObj = JSON.parse(employeeData);
                const trackingResponse = await client.get(
                  getDetailsByempIdAndorgId +
                    `/${jsonObj.empId}/${jsonObj.orgId}`
                );

                const trackingJson = await trackingResponse.json();
                console.log("ROOOT", trackingJson);
                var newLatLng = {
                  latitude: lastPosition.coords.latitude,
                  longitude: lastPosition.coords.longitude,
                };
                console.log("CHANGED LOCATION", coordinates);
                let parsedValue =
                  trackingJson.length > 0
                    ? JSON.parse(trackingJson[0].location)
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

                // console.log("CURRENTLOCATION", lastPosition);

                let newArray = [...coordinates, ...[newLatLng]];

                if (trackingJson.length > 0) {
                  // return; //// API integration
                  let tempPayload = {
                    id: trackingJson[0]?.id,
                    orgId: jsonObj?.orgId,
                    empId: jsonObj?.empId,
                    branchId: jsonObj?.branchId,
                    currentTimestamp: new Date().getTime(),
                    updateTimestamp: new Date().getTime(),
                    purpose: "",
                    location: JSON.stringify(newArray),
                  };
                  console.log("newArray", tempPayload);

                  const response = await client.put(
                    locationUpdate + `/${trackingJson[0].id}`,
                    tempPayload
                  );
                  const json = await response.json();
                  console.log("RESPONSEmmmmm", json);

                  await AsyncStore.storeJsonData(
                    AsyncStore.Keys.COORDINATES,
                    newArray
                  );
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
                  };
                  const response = await client.post(saveLocation, payload);
                  const json = await response.json();
                  console.log("RESPONSEmmmmsssmELSE", json);
                  await AsyncStore.storeJsonData(
                    AsyncStore.Keys.COORDINATES,
                    newArray
                  );
                }
              }
            },
            (error) => {
              console.log(error);
              return;
              alert(JSON.stringify(error));
            },
            { enableHighAccuracy: true, distanceFilter: 10 }
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
        try {
          let todaysDate = await AsyncStore.getData(AsyncStore.Keys.TODAYSDATE);
          // console.log("todaysDate", todaysDate);
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
        alert(value);
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
