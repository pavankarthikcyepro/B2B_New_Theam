import React, { useState, useEffect } from "react";
import { View, Text, SafeAreaView } from "react-native";
import Geolocation from "@react-native-community/geolocation";

const TripTracker = () => {
  const [tripData, setTripData] = useState([]);

  const handleLocation = (location) => {
    const { latitude, longitude, speed } = location.coords;
    console.log("handleLocation", tripData);
    if (speed > 10 && tripData.length === 0) {
      const initialData = {
        Coordinates: [{ latitude, longitude, speed }],
        isStart: true,
        isEnd: false,
        startTime: new Date(),
        endTime: null,
      };
      setTripData([initialData]);
      console.log("speed > 10 && tripData.length === 0", [initialData]);
    }
    if (speed > 10 && tripData.length > 0) {
      const path = tripData[tripData.length - 1];
      if (path.isStart && !path.isEnd) {
        console.log("path.isStart && !path.isEnd");
        setTripData((prevData) => {
          const lastIndex = path;
          const lastItem = prevData[lastIndex];
          const updatedLastItem = {
            ...lastItem,
            Coordinates: [
              ...lastItem.Coordinates,
              { latitude, longitude, speed },
            ],
          };
          return [...prevData.slice(0, lastIndex), updatedLastItem];
        });
      }
      if (path.isStart && path.isEnd) {
        console.log("path.isStart && path.isEnd");
        const initialData = {
          Coordinates: [{ latitude, longitude, speed }],
          isStart: true,
          isEnd: false,
          startTime: new Date(),
          endTime: null,
        };
        setTripData([...tripData, initialData]);
      }
    }
    if (speed < 10 && tripData.length > 0) {
      console.log("speed < 10 && tripData.length > 0");
      endTrip(latitude, longitude, speed);
    }

    console.log("tripData", tripData);
  };

  const endTrip = (latitude, longitude, speed) => {
    const path = tripData[tripData.length - 1];
    setTripData((prevData) => {
      const lastIndex = path;
      const lastItem = prevData[lastIndex];
      const updatedLastItem = {
        ...lastItem,
        Coordinates: [...lastItem.Coordinates, { latitude, longitude, speed }],
        endTime: new Date(),
        isEnd: true,
      };
      return [...prevData.slice(0, lastIndex), updatedLastItem];
    });
    console.log("Trip start:", startTime, "end:", endTime);
    console.log("tripData", JSON.stringify(tripData));
  };
  useEffect(() => {
    let watchId = null;
    let tripStarted = false;
    let tripStartTime = null;
    let lastLat = null;
    let lastLong = null;
    let lastSpeed = null;

    Geolocation.requestAuthorization();
    watchId = Geolocation.watchPosition(handleLocation);

    // return () => {
    //   if (watchId) {
    //     Geolocation.clearWatch(watchId);
    //   }
    // };
  }, []);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // metres
    const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  return (
    <SafeAreaView>
      <Text>Current Trip Data:</Text>
      {tripData.map((data, index) => (
        <Text key={index}>
          {data.isStart ? "Start: " : ""}
          {data.isEnd ? "End: " : ""}
          {data.latitude}, {data.longitude}, {data.speed}
        </Text>
      ))}
    </SafeAreaView>
  );
};

export default TripTracker;
