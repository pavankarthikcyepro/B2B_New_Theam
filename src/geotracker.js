import React, { useEffect, useState } from "react";
import { PermissionsAndroid, Platform, View, Text } from "react-native";
import Geolocation from "@react-native-community/geolocation";
import BackgroundActions from "react-native-background-actions";
import { Colors } from "./styles";
import ReactNativeForegroundService from "@supersami/rn-foreground-service";
import RNLocation from "react-native-location";

const LocationTracker = () => {
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [currentLat, setCurrentLat] = useState(0);
  const [currentLong, setCurrentLong] = useState(0);

  useEffect(() => {

    RNLocation.configure({
      distanceFilter: 100, // Meters
      desiredAccuracy: {
        ios: "best",
        android: "balancedPowerAccuracy",
      },
      // Android only
      androidProvider: "auto",
      interval: 5000, // Milliseconds
      fastestInterval: 10000, // Milliseconds
      maxWaitTime: 5000, // Milliseconds
      // iOS Only
      activityType: "other",
      allowsBackgroundLocationUpdates: false,
      headingFilter: 1, // Degrees
      headingOrientation: "portrait",
      pausesLocationUpdatesAutomatically: false,
      showsBackgroundLocationIndicator: false,
    });
    let locationSubscription = null;
    let locationTimeout = null;

const startTracking=()=>{
  console.log("Ssss");
  ReactNativeForegroundService.add_task(
    () => {
      RNLocation.requestPermission({
        ios: "whenInUse",
        android: {
          detail: "fine",
        },
      })
        .then((granted) => {
          console.log("Location Permissions: ", granted);
          // if has permissions try to obtain location with RN location
          if (granted) {
            locationSubscription && locationSubscription();
            locationSubscription = RNLocation.subscribeToLocationUpdates(
              ([locations]) => {
                locationSubscription();
                locationTimeout && clearTimeout(locationTimeout);
                console.log(locations);
              }
            );
          } else {
            locationSubscription && locationSubscription();
            locationTimeout && clearTimeout(locationTimeout);
            console.log("no permissions to obtain location");
          }
        })
        .catch((e) => {
          console.log("ERROR", e);
        });
    },
    {
      delay: 1000,
      onLoop: true,
      taskId: "taskid",
      onError: (e) => console.log("Error logging:", e),
    }
  );
}
  
    
    const requestLocationPermission = async () => {
      if (Platform.OS === "android") {
        try {
          const backgroundgranted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
            {
              title: "Background Location Permission",
              message:
                "We need access to your location " +
                "so you can get live quality updates.",
              buttonNegative: "Cancel",
              buttonPositive: "OK",
            }
          );
          if (backgroundgranted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log("sssss", backgroundgranted);
            startTracking()
            //do your thing!
          }
            console.log("backgroundgranted", backgroundgranted);
        } catch (err) {
          console.warn(err);
        }
      } else {
      }
    };


    requestLocationPermission();

    return () => {
    };
  }, []);

  return (
    <View>
      <Text>Location Tracker</Text>
      <Text>{"SPEED: " + currentSpeed}</Text>
      <Text>{"Lat: " + currentLat}</Text>
      <Text>{"Long: " + currentLong}</Text>
      {/* Render additional components or UI elements here */}
    </View>
  );
};

export default LocationTracker;
