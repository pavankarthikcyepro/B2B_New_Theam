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
import { locationUpdate } from "./networking/endpoints";

const AppScreen = () => {
  const [track, setTrack] = useState([]);
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

  const getCoordinates = async () => {
    try {
      let coordinates = await AsyncStore.getJsonData(
        AsyncStore.Keys.COORDINATES
      );
      let todaysDate = await AsyncStore.getData(AsyncStore.Keys.TODAYSDATE);
      console.log("SSSSS", todaysDate, new Date().getDate());
      if (todaysDate != new Date().getDate()) {
        initialData();
        console.log("INNNNN");
      } else {
        var startDate = createDateTime("8:30");
        var endDate = createDateTime("21:30");
        var now = new Date();
        var isBetween = startDate <= now && now <= endDate;
        console.log("isBetween", isBetween);
        if (isBetween) {
          await Geolocation.watchPosition(
            async (lastPosition) => {
              const employeeData = await AsyncStore.getData(
                AsyncStore.Keys.LOGIN_EMPLOYEE
              );
              if (employeeData) {
                const jsonObj = JSON.parse(employeeData);
                console.log("CHANGED LOACTION", coordinates);

                console.log("CURRENTLOCATION", lastPosition);
                var newLatLng = {
                  latitude: lastPosition.coords.latitude,
                  longitude: lastPosition.coords.longitude,
                };

                let newArray = [...coordinates, ...[newLatLng]];
                console.log("newArray", newArray);
                return //// API integration
                let tempPayload = {
                  id: jsonObj?.id,
                  orgId: jsonObj?.orgId,
                  empId: jsonObj?.empId,
                  branchId: jsonObj?.branchId,
                  currentTimestamp: new Date().getTime(),
                  updateTimestamp: new Date().getTime(),
                  purpose: "json",
                  location: "json",
                };
                const response = await client.post(locationUpdate, tempPayload);
                console.log("RESPONSEmmmmm", response);
                const json = await response.json();
                await AsyncStore.storeJsonData(
                  AsyncStore.Keys.COORDINATES,
                  newArray
                );
              }

              //   setTrack([...track, ...[newLatLng]]);
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
