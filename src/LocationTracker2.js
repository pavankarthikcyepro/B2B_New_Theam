import React, { useEffect, useState } from "react";
import { PermissionsAndroid, Platform, View, Text } from "react-native";
import Geolocation from "@react-native-community/geolocation";
import BackgroundActions from "react-native-background-actions";
import { Colors } from "./styles";

const LocationTracker = () => {
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [currentLat, setCurrentLat] = useState(0);
  const [currentLong, setCurrentLong] = useState(0);

  useEffect(() => {
    const taskRandomLocation = async (taskDataArguments) => {
      const { delay, period } = taskDataArguments;

      const trackLocation = () => {
        const watchId = Geolocation.watchPosition(
          (position) => {
            const { latitude, longitude, speed } = position.coords;
            console.log("Latitude:", latitude);
            console.log("Longitude:", longitude);
            console.log("Speed:", speed);

            // Handle the updated location information here
          },
          (error) => {
            console.warn(error.message);
            // Handle location tracking errors here
          },
          {
            enableHighAccuracy: true,
          }
        );

        const stopTracking = () => {
          Geolocation.clearWatch(watchId);
        };

        return stopTracking;
      };

      const stopTracking = trackLocation();

      const intervalId = setInterval(() => {
        stopTracking();
        trackLocation();
      }, period);

      return () => {
        clearInterval(intervalId);
        stopTracking();
      };
    };

    const requestLocationPermission = async () => {
      if (Platform.OS === "android") {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log("Location permission granted");
            startBackgroundTracking();
          } else {
            console.log("Location permission denied");
            // Handle permission denial
          }
        } catch (err) {
          console.warn(err);
        }
      } else {
        startBackgroundTracking();
      }
    };

    const startBackgroundTracking = async () => {
      try {
        await BackgroundActions.start(taskRandomLocation, {
          taskName: "Location Tracking",
          taskTitle: "Location Tracking",
          taskDesc: "Track location in the background",
          taskIcon: {
            name: "@mipmap/cy",
            type: "mipmap",
          },
          parameters: {
            delay: 1000,
            period: 5000,
          },
        });
      } catch (err) {
        console.warn(err);
      }
    };

    requestLocationPermission();

    return () => {
      BackgroundActions.stop();
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
