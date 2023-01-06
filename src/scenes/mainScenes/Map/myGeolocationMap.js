import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  Platform,
  SafeAreaView,
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
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const GeolocationMapScreen = ({ route }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [coordinates, setCoordinates] = useState(position);
  const [longitude, setLongitude] = useState(0);
  const [latitude, setLatitude] = useState(0);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useLayoutEffect(() => {
    // navigation.setOptions({
    //   headerRight: () => (
    //     <IconButton
    //       icon="filter"
    //       color={Colors.WHITE}
    //       size={30}
    //       onPress={() => setShowDatePicker(true)}
    //     />
    //   ),
    // });
  }, [navigation]);

  useEffect(() => {
    console.log(route.params);
    setLoading(true);
    if (route.params) {
      getLocation(route.params);
    }
  }, [route.params]);

  const getLocation = async (params) => {
    try {
      const response = await client.get(
        URL.GET_MAP_COORDINATES_BY_ID(params.empId, params.orgId, params.date)
      );
      // const response = await fetch(URL.GET_MAP_COORDINATES_BY_ID(params.empId, params.orgId, params.date))  ;
      // const response = await client.get(URL.GET_LOCATION_COORDINATES(919, 18));
      console.log("SSS", response, JSON.stringify(response.data));
      const json = await response.json();
      console.log("json", json);

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
        {/* {latitude != 0 && longitude != 0 && ( */}
        {true && (
          <MapView
            style={styles.mapView}
            mapType={"standard"}
            provider={
              Platform.OS === "ios" ? PROVIDER_DEFAULT : PROVIDER_GOOGLE
            }
            initialRegion={{
              latitude: 37.37457281,
              longitude: -122.14588663,
              latitudeDelta: 0.04,
              longitudeDelta: 0.05,
            }}
            zoomEnabled={true}
            showsUserLocation={true}
          >
            <Polyline
              coordinates={position}
              strokeColor={Colors.PINK} // fallback for when `strokeColors` is not supported by the map-provider
              strokeColors={[Colors.PINK]}
              strokeWidth={4}
              onPress={(text) => {
                console.log(text);
                // alert(text);
              }}
            />
            {position.map((marker, index) => (
              <Marker
                key={index}
                coordinate={marker}
                image={index === position?.length - 1 ? CYEPRO : HISTORY_LOC}
                // title={marker}
                // description={}
              />
            ))}
          </MapView>
        )}
      </View>
      <View style={styles.bottomView}>
        <View style={styles.tableRow}>
          <View style={styles.colums}>
            <View style={styles.innerRow}>
              <MaterialCommunityIcons
                name="map-marker-distance"
                size={20}
                color={Colors.RED}
              />
              <Text style={styles.columnsTitle}>{"Travel Distance"}</Text>
            </View>
            <Text style={styles.valueTxt}>{"10 KM"}</Text>
          </View>
          <View style={styles.colums}>
            <View style={styles.innerRow}>
              <MaterialCommunityIcons
                name="clock-time-four-outline"
                size={20}
                color={Colors.RED}
              />
              <Text style={styles.columnsTitle}>{"Travel Time"}</Text>
            </View>
            <Text style={styles.valueTxt}>{"25 min"}</Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          {/* <View style={styles.colums}>
            <View style={styles.innerRow}>
              <MaterialCommunityIcons
                name="speedometer"
                size={20}
                color={Colors.RED}
              />
              <Text style={styles.columnsTitle}>{"Top Speed"}</Text>
            </View>
            <Text style={styles.valueTxt}>{"44 km/h"}</Text>
          </View> */}
          {/* <View style={styles.colums}>
            <View style={styles.innerRow}>
              <MaterialCommunityIcons
                name="chart-bar"
                size={20}
                color={Colors.RED}
              />
              <Text style={styles.columnsTitle}>{"Avg. Speed"}</Text>
            </View>
            <Text style={styles.valueTxt}>{"20 km/h"}</Text>
          </View> */}
        </View>
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
    bottom: "40%",
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
  colums: {
    justifyContent: "flex-start",
    width: "50%",
    flexDirection: "column",
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    height: 60,
  },
  innerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  columnsTitle: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 5,
  },
  valueTxt: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 5,
    color: Colors.BLUE,
  },
  bottomView: {
    flex: 1,
    top: "70%",
    width: "85%",
    alignSelf: "center",
  },
});
