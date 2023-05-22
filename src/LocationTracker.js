import React, { useEffect, useState } from "react";
import { PermissionsAndroid, Platform, View, Text } from "react-native";
import Geolocation from "@react-native-community/geolocation";

const LocationTracker = () => {
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [currentLat, setCurrentLat] = useState(0);
  const [currentLong, setCurrentLong] = useState(0);

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === "android") {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log("Location permission granted");
            trackLocation();
          } else {
            console.log("Location permission denied");
            // Handle permission denial
          }
        } catch (err) {
          console.warn(err);
        }
      } else {
        trackLocation();
      }
    };

    requestLocationPermission();

    return () => {
      Geolocation.stopObserving();
    };
  }, []);

  const trackLocation = () => {
    Geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, speed } = position.coords;
        console.log("Latitude:", latitude);
        console.log("Longitude:", longitude);
        console.log("Speed:", speed);
        setCurrentLong(longitude);
        setCurrentLat(latitude);
        setCurrentSpeed(speed);
        // Handle the updated location information here
      },
      (error) => {
        console.warn(error.message);
        // Handle location tracking errors here
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 10, // Minimum distance (in meters) to trigger an update
        interval: 5000, // Minimum time (in milliseconds) between updates
        fastestInterval: 2000, // Fastest acceptable update interval
      }
    );
  };

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
