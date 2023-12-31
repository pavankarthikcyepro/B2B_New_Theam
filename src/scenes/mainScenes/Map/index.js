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
import moment from "moment";
import { getDistanceBetweenTwoPoints } from "../../../service";
import { G, Path, Svg } from "react-native-svg";
import { LOCATION_PIN, LOCATION_PIN2 } from "../../../assets/icon";

const dateFormat = "YYYY-MM-DD";
const currentDate = moment().format(dateFormat);
const MapScreen = ({ route }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [coordinates, setCoordinates] = useState([]);
  const [longitude, setLongitude] = useState(0);
  const [latitude, setLatitude] = useState(0);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [data, setData] = useState([]);
  const [distance, setDistance] = useState([]);
  const [startAddress, setStartAddress] = useState("");
  const [endAddress, setEndAddress] = useState("");

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
    setLoading(true);
    if (route.params) {
      getLocation(route.params);
    }
  }, [route.params]);

  const getLocation = async (params) => {
    try {
      const response = await client.get(
        URL.GET_MAP_COORDINATES_BY_ID(params.empId, params.orgId, currentDate)
      );
      const json = await response.json();

      if (json.length > 0) {
        setData(json);
        const newArr = json.map((item) => item.location[0]);
        let arr = [];
        for (let i = 0; i < json.length; i++) {
          const element = json[i];
          arr.push(...element.location);
        }
        const longitude = newArr.reduce(
          (total, next) => total + next.longitude,
          0
        );
        const latitude = newArr.reduce(
          (total, next) => total + next.latitude,
          0
        );
        setLatitude(arr[arr.length - 1].latitude);
        setLongitude(arr[arr.length - 1].longitude);
        // setLatitude(latitude / newArr.length);
        // setLongitude(longitude / newArr.length);
        setCoordinates(arr);
        var result = [];
        for (var i = 0; i < arr.length - 1; i++) {
          result.push(
            getDistanceBetweenTwoPoints(
              arr[i].latitude,
              arr[i].longitude,
              arr[i + 1].latitude,
              arr[i + 1].longitude
            )
          );
        }
        const startNameResponse = await client.get(
          URL.ADDRESS_NAME(arr[0].latitude, arr[0].longitude)
        );
        const startJson = await startNameResponse.json();
        const endNameResponse = await client.get(
          URL.ADDRESS_NAME(
            arr[arr.length - 1].latitude,
            arr[arr.length - 1].longitude
          )
        );
        const endJson = await endNameResponse.json();
        setStartAddress(startJson.results[0].formatted_address);
        setEndAddress(endJson.results[0].formatted_address);
        setDistance(result);
        setLoading(false);
      } else {
        Alert.alert("No data are Available", "", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
        setLoading(false);
      }
    } catch (error) {
      Alert.alert("Something went wrong", "", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
      setData([]);
      setLoading(false);
    }
  };

  function sumArray(array) {
    const ourArray = array;
    let sum = 0;

    for (let i = 0; i < ourArray.length; i += 1) {
      sum += ourArray[i];
    }

    return sum;
  }

  const getLocationByDate = async (params) => {
    try {
      setLatitude(0);
      setLongitude(0);
      let date = moment(params).format(dateFormat);
      const response = await client.get(
        URL.GET_MAP_COORDINATES_BY_ID(
          route.params.empId,
          route.params.orgId,
          date
        )
      );
      const json = await response.json();

      if (json.length > 0) {
        setData(json);

        const newArr = json.map((item) => item.location[0]);
        let arr = [];
        for (let i = 0; i < json.length; i++) {
          const element = json[i];
          arr.push(...element.location);
        }
        const longitude = newArr.reduce(
          (total, next) => total + next.longitude,
          0
        );
        const latitude = newArr.reduce(
          (total, next) => total + next.latitude,
          0
        );
        setLatitude(arr[arr.length - 1].latitude);
        setLongitude(arr[arr.length - 1].longitude);
        // setLatitude(latitude / newArr.length);
        // setLongitude(longitude / newArr.length);
        setCoordinates(arr);
        var result = [];
        for (var i = 0; i < arr.length - 1; i++) {
          result.push(
            getDistanceBetweenTwoPoints(
              arr[i].latitude,
              arr[i].longitude,
              arr[i + 1].latitude,
              arr[i + 1].longitude
            )
          );
        }
        const startNameResponse = await client.get(
          URL.ADDRESS_NAME(arr[0].latitude, arr[0].longitude)
        );
        const startJson = await startNameResponse.json();
        const endNameResponse = await client.get(
          URL.ADDRESS_NAME(
            arr[arr.length - 1].latitude,
            arr[arr.length - 1].longitude
          )
        );
        const endJson = await endNameResponse.json();
        setStartAddress(startJson.results[0].formatted_address);
        setEndAddress(endJson.results[0].formatted_address);
        setDistance(result);
        setLoading(false);
      } else {
        setData([]);
        Alert.alert("No data are Available", "", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
        setLoading(false);
      }
    } catch (error) {
      setData([]);
      Alert.alert("Something went wrong", "", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
      setLoading(false);
    }
  };

  function diff_minutes(dt2, dt1) {
    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= 60;
    return Math.abs(Math.round(diff));
  }

  const position = [
    { latitude: 37.37457281, longitude: -122.14588663 },
    { latitude: 37.37709618, longitude: -122.14869624 },
    { latitude: 37.38009618, longitude: -122.15169624 },
    { latitude: 37.38409618, longitude: -122.15469624 },
  ];

  const addIcon = () => {
    return (
      <Svg
        width="30px"
        height="30px"
        // viewBox="0 0 40 56"
        viewBox="0 0 24 24"
        // fill="none"
        xmlns="http://www.w3.org/2000/svg"
        // fill="#FFF"
        // opacity="0.6"
      >
        <G opacity="0.4">
          <Path
            d="M9.25 11H14.75"
            stroke="#292D32"
            stroke-width="1.5"
            stroke-linecap="round"
          />
          <Path
            d="M12 13.75V8.25"
            stroke="#292D32"
            stroke-width="1.5"
            stroke-linecap="round"
          />
        </G>
        <Path
          d="M3.61971 8.49C5.58971 -0.169998 18.4197 -0.159997 20.3797 8.5C21.5297 13.58 18.3697 17.88 15.5997 20.54C13.5897 22.48 10.4097 22.48 8.38971 20.54C5.62971 17.88 2.46971 13.57 3.61971 8.49Z"
          stroke="#292D32"
          stroke-width="1.5"
        />
      </Svg>
    );
  };

  const tickIcon = () => {
    return (
      <Svg
        width="30px"
        height="30px"
        // viewBox="0 0 40 56"
        viewBox="0 0 24 24"
        // fill="none"
        xmlns="http://www.w3.org/2000/svg"
        // fill="#FFF"
        // opacity="0.6"
      >
        <Path
          d="M3.61971 8.49C5.58971 -0.169998 18.4197 -0.159997 20.3797 8.5C21.5297 13.58 18.3697 17.88 15.5997 20.54C13.5897 22.48 10.4097 22.48 8.38971 20.54C5.62971 17.88 2.46971 13.57 3.61971 8.49Z"
          stroke="#292D32"
          stroke-width="1.5"
        />
        <Path
          opacity="0.4"
          d="M9.25 11.5L10.75 13L14.75 9"
          stroke="#292D32"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </Svg>
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <DatePickerComponent
        visible={showDatePicker}
        mode={"date"}
        maximumDate={new Date()}
        value={new Date()}
        onChange={(event, selectedDate) => {
          getLocationByDate(selectedDate);
          setShowDatePicker(false);
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
            {coordinates.map((marker, index) => (
              <Marker.Animated
                key={`marker-${index}`}
                coordinate={marker}
                tracksViewChanges={false}
                image={Platform.OS === "ios" ? LOCATION_PIN : LOCATION_PIN2}
              >
                {/* <View
                  style={{ width: 33, height: Platform.OS === "ios" ? 59 : 37 }}
                >
                  {addIcon()}
                </View> */}
              </Marker.Animated>
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
            {distance.length > 0 ? (
              <Text style={styles.valueTxt}>
                {/* {Math.round(
                  getDistanceBetweenTwoPoints(
                    coordinates[0].latitude,
                    coordinates[0].longitude,
                    coordinates[coordinates.length - 1].latitude,
                    coordinates[coordinates.length - 1].longitude
                  ) || 0
                )} */}
                {parseFloat(sumArray(distance)).toFixed(2) || 0}
                {" KM"}
              </Text>
            ) : (
              <Text style={styles.valueTxt}>{"-- KM"}</Text>
            )}
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
            {data.length > 0 ? (
              <Text style={styles.valueTxt}>
                {parseFloat(
                  diff_minutes(
                    new Date(data[data.length - 1].updatedtimestamp),
                    new Date(data[0].createdtimestamp)
                  )
                ).toFixed(2) || 0}
                {" min"}
              </Text>
            ) : (
              <Text style={styles.valueTxt}>{"-- min"}</Text>
            )}
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

export default MapScreen;

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
    bottom: "30%",
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
    top: "80%",
    width: "85%",
    alignSelf: "center",
  },
});
