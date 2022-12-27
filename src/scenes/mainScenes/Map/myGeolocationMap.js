import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  Keyboard,
  Platform,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import {
  DatePickerComponent,
  DropDownComponant,
  HeaderComp,
  LoaderComponent,
} from "../../../components";
import { Colors } from "../../../styles";
import CYEPRO from "../../../assets/images/cy.png";
import HISTORY_LOC from "../../../assets/images/cyOld.png";
import MapView, {
  Marker,
  Polyline,
  PROVIDER_DEFAULT,
  PROVIDER_GOOGLE,
} from "react-native-maps";
import { client } from "../../../networking/client";
import URL from "../../../networking/endpoints";
import { useNavigation } from "@react-navigation/native";
import { IconButton } from "react-native-paper";

const GeolocationMapScreen = ({ route }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [coordinates, setCoordinates] = useState([]);
  const [longitude, setLongitude] = useState(0);
  const [latitude, setLatitude] = useState(0);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          icon="filter"
          color={Colors.WHITE}
          size={30}
          onPress={() => setShowDatePicker(true)}
        />
      ),
    });
  }, [navigation]);

  useEffect(() => {
    console.log(route.params);
    // getLocation(route.params);

    setLoading(true);
    if (route.params) {
      getLocation(route.params);
    }
  }, [route.params]);

  const getLocation = async (params) => {
    try {
      const response = await client.get(
        URL.GET_LOCATION_COORDINATES(params.empId, params.orgId)
      );
      // const response = await client.get(URL.GET_LOCATION_COORDINATES(919, 18));
      const json = await response.json();
      if (json) {
        const longitude = json.reduce(
          (total, next) => total + next.longitude,
          0
        );
        const latitude = json.reduce((total, next) => total + next.latitude, 0);
        console.log(
          "AVERGARE LAT LOG",
          latitude / json.length,
          longitude / json.length,
          "\n",
          json
        );
        setLatitude(latitude / json.length);
        setLongitude(longitude / json.length);
        setCoordinates(json);
        setLoading(false);
      }
    } catch (error) {
    //   Alert.alert("Something went wrong", "", [
    //     { text: "OK", onPress: () => navigation.goBack() },
    //   ]);
      setLoading(false);
    }
  };

  const position = [
    { latitude: 37.37457281, longitude: -122.14588663 },
    { latitude: 37.37709618, longitude: -122.14869624 },
    { latitude: 37.38009618, longitude: -122.15169624 },
    { latitude: 37.38409618, longitude: -122.15469624 },
  ];
  return (
    <SafeAreaView style={styles.container}>
      <DatePickerComponent
        visible={showDatePicker}
        mode={"date"}
        maximumDate={new Date()}
        value={new Date()}
        onChange={(event, selectedDate) => {
          console.log("date: ", selectedDate);
        }}
        onRequestClose={() => setShowDatePicker(false)}
      />
      <View style={styles.mapContainer}>
        {latitude != 0 && longitude != 0 && (
          <MapView
            style={styles.mapView}
            mapType={"standard"}
            provider={
              Platform.OS === "ios" ? PROVIDER_DEFAULT : PROVIDER_GOOGLE
            }
            initialRegion={{
              latitude: latitude,
              longitude: longitude,
              latitudeDelta: 0.04,
              longitudeDelta: 0.05,
            }}
            zoomEnabled={true}
            // showsUserLocation={true}
          >
            <Polyline
              coordinates={coordinates}
              strokeColor={Colors.PINK} // fallback for when `strokeColors` is not supported by the map-provider
              strokeColors={[Colors.PINK]}
              strokeWidth={4}
            />
            {position.map((marker, index) => (
              <Marker
                key={index}
                coordinate={marker}
                image={index === coordinates.length - 1 ? CYEPRO : HISTORY_LOC}
                // title={marker}
                // description={}
              />
            ))}
          </MapView>
        )}
      </View>

      <LoaderComponent visible={loading} />
    </SafeAreaView>
  );
};

export default GeolocationMapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: Colors.LIGHT_GRAY,
  },
  mapContainer: {
    flex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  mapView: {
    flex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
