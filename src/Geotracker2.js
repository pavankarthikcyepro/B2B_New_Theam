import React, { useEffect, useState } from "react";
import { Alert, AppState, Text, View } from "react-native";
import RNLocation from "react-native-location";
import BackgroundServices from "./backgroundServices";
import { StyleSheet } from "react-native";
import moment from "moment";
let locationSubscription = null;

const HelloWorldApp = () => {
  const [location, setLocation] = useState(null);
  useEffect(() => {
    BackgroundServices.start();

    RNLocation.requestPermission({
      ios: "whenInUse",
      android: {
        detail: 'fine',
      },
    }).then((granted) => {
      if (granted) {
        locationSubscription = RNLocation.subscribeToLocationUpdates(
          (locations) => {
            console.log("LOCations", AppState.currentState, locations);
            setLocation(locations[0]);
            if (AppState.currentState === "background") {
              Alert.alert("BACKGROUND", JSON.stringify(locations[0]));
            }
            if (AppState.currentState === "active") {
              // Alert.alert("FOREGROUND", JSON.stringify(locations[0]));
            }
          }
        );
      }
    });

    return () => {
      locationSubscription && locationSubscription();
      BackgroundServices.stop();
    };
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Hello, world!</Text>
      {location && (
        <React.Fragment>
          <View style={styles.row}>
            <View style={[styles.detailBox, styles.third]}>
              <Text style={styles.valueTitle}>Course</Text>
              <Text style={[styles.detail, styles.largeDetail]}>
                {location.course}
              </Text>
            </View>

            <View style={[styles.detailBox, styles.third]}>
              <Text style={styles.valueTitle}>Speed</Text>
              <Text style={[styles.detail, styles.largeDetail]}>
                {location.speed}
              </Text>
            </View>

            <View style={[styles.detailBox, styles.third]}>
              <Text style={styles.valueTitle}>Altitude</Text>
              <Text style={[styles.detail, styles.largeDetail]}>
                {location.altitude}
              </Text>
            </View>
          </View>

          <View style={{ alignItems: "flex-start" }}>
            <View style={styles.row}>
              <View style={[styles.detailBox, styles.half]}>
                <Text style={styles.valueTitle}>Latitude</Text>
                <Text style={styles.detail}>{location.latitude}</Text>
              </View>

              <View style={[styles.detailBox, styles.half]}>
                <Text style={styles.valueTitle}>Longitude</Text>
                <Text style={styles.detail}>{location.longitude}</Text>
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.detailBox, styles.half]}>
                <Text style={styles.valueTitle}>Accuracy</Text>
                <Text style={styles.detail}>{location.accuracy}</Text>
              </View>

              <View style={[styles.detailBox, styles.half]}>
                <Text style={styles.valueTitle}>Altitude Accuracy</Text>
                <Text style={styles.detail}>{location.altitudeAccuracy}</Text>
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.detailBox, styles.half]}>
                <Text style={styles.valueTitle}>Timestamp</Text>
                <Text style={styles.detail}>{location.timestamp}</Text>
              </View>

              <View style={[styles.detailBox, styles.half]}>
                <Text style={styles.valueTitle}>Date / Time</Text>
                <Text style={styles.detail}>
                  {moment(location.timestamp).format("MM-DD-YYYY h:mm:ss")}
                </Text>
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.detailBox, styles.full]}>
                <Text style={styles.json}>{JSON.stringify(location)}</Text>
              </View>
            </View>
          </View>
        </React.Fragment>
      )}
    </View>
  );
};
export default HelloWorldApp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#CCCCCC",
  },
  innerContainer: {
    marginVertical: 30,
  },
  title: {
    textAlign: "center",
    fontSize: 30,
    fontWeight: "bold",
  },
  repoLink: {
    textAlign: "center",
    fontSize: 12,
    fontWeight: "bold",
    color: "#0000CC",
    textDecorationLine: "underline",
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginTop: 5,
    marginBottom: 5,
  },
  detailBox: {
    padding: 15,
    justifyContent: "center",
  },
  button: {
    flex: 1,
    marginHorizontal: 10,
    marginTop: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  buttonText: {
    fontSize: 30,
    color: "#FFFFFF",
  },
  valueTitle: {
    fontSize: 12,
  },
  detail: {
    fontSize: 15,
    fontWeight: "bold",
  },
  largeDetail: {
    fontSize: 20,
  },
  json: {
    fontSize: 12,
    textAlign: "center",
    fontWeight: "bold",
  },
  full: {
    width: "100%",
  },
  half: {
    width: "50%",
  },
  third: {
    width: "33%",
  },
});