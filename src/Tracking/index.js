import React, { Component } from "react";
import BackgroundGeolocation from "react-native-mauron85-background-geolocation";

class BgTracking extends Component {
  componentWillMount() {
    BackgroundGeolocation.configure({
      desiredAccuracy: 10,
      stationaryRadius: 50,
      distanceFilter: 50,
      locationTimeout: 30,
      notificationTitle: "Background tracking",
      notificationText: "enabled",
      debug: true,
      startOnBoot: false,
      stopOnTerminate: false,
      locationProvider: 1, // 0 => ANDROID_DISTANCE_FILTER_PROVIDER | 1 => ANDROID_ACTIVITY_PROVIDER
      interval: 10000,
      fastestInterval: 5000,
      activitiesInterval: 10000,
      stopOnStillActivity: false,
      url: "http://192.168.81.15:3000/location",
      httpHeaders: {
        "X-FOO": "bar",
      },
    });

    BackgroundGeolocation.on("location", (location) => {
      //handle your locations here
      Actions.sendLocation(location);
    });

    BackgroundGeolocation.on("error", (error) => {
      console.log("[ERROR] BackgroundGeolocation error:", error);
    });

    BackgroundGeolocation.start(() => {
      console.log("[DEBUG] BackgroundGeolocation started successfully");
    });
  }
}

export default BgTracking;
