import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  Platform,
  SafeAreaView,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import {
  DatePickerComponent,
  DropDownComponant,
  HeaderComp,
  LoaderComponent,
} from "../../../components";
import { Colors } from "../../../styles";
import CYEPRO from "../../../assets/images/cyepro-tick.svg";
import HISTORY_LOC from "../../../assets/images/cyepro-add.svg";
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
import haversine from "haversine";

const dateFormat = "YYYY-MM-DD";
const currentDate = moment().format(dateFormat);
const GeolocationMapScreen = ({ route }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [coordinates, setCoordinates] = useState([]);
  const [longitude, setLongitude] = useState(0);
  const [latitude, setLatitude] = useState(0);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [data, setData] = useState([]);
  const [distance, setDistance] = useState(0);
  const [startAddress, setStartAddress] = useState("");
  const [endAddress, setEndAddress] = useState("");
  const [Time, setTime] = useState("");

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
    setLoading(true);
    if (route.params) {
      const response = JSON.parse(JSON.parse(route.params.item.location));
      setLatitude(response[response.length - 1].latitude);
      setLongitude(response[response.length - 1].longitude);
      setCoordinates(response);
      setLoading(false);
      const timestamp1 = new Date(route.params.item.createdtimestamp).getTime(); // replace with your timestamp
      const timestamp2 = new Date(route.params.item.updatedtimestamp).getTime(); // replace with your timestamp
      const diffInMs = Math.abs(timestamp2 - timestamp1);
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      setTime(diffInMinutes);
      getTotalDistance(response);
      getAddress(response);
    }
  }, [route.params]);

  const getAddress = async (arr) => {
    try {
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
    } catch (error) {}
  };
  const calculateDistance = (coord1, coord2) => {
    return haversine(coord1, coord2, { unit: "km" });
  };

  // function to calculate the total distance traveled
  const getTotalDistance = (coordinates) => {
    let totalDistance = 0;
    for (let i = 1; i < coordinates.length; i++) {
      const coord1 = coordinates[i - 1];
      const coord2 = coordinates[i];
      const distance = calculateDistance(coord1, coord2);
      totalDistance += distance;
    }
    setDistance(totalDistance);
  };

  const getLocation = async (params) => {
    try {
      const response = await client.get(
        URL.GET_MAP_COORDINATES_BY_ID(params.empId, params.orgId, params.date)
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
            getDistanceFromLatLonInKm(
              arr[i].latitude,
              arr[i].longitude,
              arr[i + 1].latitude,
              arr[i + 1].longitude
            )
          );
        }
        // const startNameResponse = await client.get(
        //   URL.ADDRESS_NAME(arr[0].latitude, arr[0].longitude)
        // );
        // const startJson = await startNameResponse.json();
        // const endNameResponse = await client.get(
        //   URL.ADDRESS_NAME(
        //     arr[arr.length - 1].latitude,
        //     arr[arr.length - 1].longitude
        //   )
        // );
        // const endJson = await endNameResponse.json();
        // setStartAddress(startJson.results[0].formatted_address);
        // setEndAddress(endJson.results[0].formatted_address);
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
            getDistanceFromLatLonInKm(
              arr[i].latitude,
              arr[i].longitude,
              arr[i + 1].latitude,
              arr[i + 1].longitude
            )
          );
        }
        // const startNameResponse = await client.get(
        //   URL.ADDRESS_NAME(arr[0].latitude, arr[0].longitude)
        // );
        // const startJson = await startNameResponse.json();
        // const endNameResponse = await client.get(
        //   URL.ADDRESS_NAME(
        //     arr[arr.length - 1].latitude,
        //     arr[arr.length - 1].longitude
        //   )
        // );
        // const endJson = await endNameResponse.json();
        // setStartAddress(startJson.results[0].formatted_address);
        // setEndAddress(endJson.results[0].formatted_address);
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

    return Math.abs(parseFloat(diff).toFixed(2));
  }

  function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const earthRadius = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1); // deg2rad below
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c; // Distance in km
    return distance;
  }

  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

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
                // icon={require("../../../assets/images/cyepro-tick.svg")}
                style={{
                  height: 15,
                  width: 15,
                  // padding:5,
                  // flex:1
                }}
                // image={index === coordinates.length - 1 ? CYEPRO : HISTORY_LOC}
                image={Platform.OS === "ios" ? LOCATION_PIN : LOCATION_PIN2}
                // title={marker}
                // description={}
              >
                {/* <View
                  style={{ width: 33, height: Platform.OS === "ios" ? 59 : 37 }}
                >
                  {IconMarker()}
                </View> */}
                {/* <Svg width={40} height={30}>
                  <Image
                    source={require("../../../assets/images/cyepro-tick.svg")}
                    // style={{
                    //   height: 20,
                    //   width: 20,
                    // }}
                    resizeMode="contain"
                  />
                </Svg> */}
              </Marker.Animated>
            ))}
          </MapView>
        )}
      </View>
      <View style={styles.bottomView}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={{
              flexDirection: "column",
              // justifyContent: "space-around",
              marginBottom: 15,
            }}
          >
            <View style={{ flexDirection: "row", marginVertical: 10 }}>
              <View style={{ width: "15%" }}>
                <Text style={{ ...styles.columnsTitle }}>{"Start"}</Text>
              </View>
              <View style={{ width: "85%" }}>
                <Text style={{ ...styles.valueTxt }}>{startAddress}</Text>
              </View>
            </View>
            <View style={{ flexDirection: "row", marginVertical: 10 }}>
              <View style={{ width: "15%" }}>
                <Text style={{ ...styles.columnsTitle, marginVertical: 15 }}>
                  {"Goal"}
                </Text>
              </View>
              <View style={{ width: "85%" }}>
                <Text style={{ ...styles.valueTxt, marginVertical: 15 }}>
                  {endAddress}
                </Text>
              </View>
            </View>
          </View>
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
              {/* {distance > 0 ? (
              <Text style={styles.valueTxt}>
                {parseFloat(sumArray(distance)).toFixed(2) || 0}
                {distance || 0}
                {" KM"}
              </Text>
            ) : ( */}
              <Text style={styles.valueTxt}>
                {distance?.toFixed(2) || "--"}
                {" KM"}
              </Text>
              {/* )} */}
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
              {coordinates.length > 0 ? (
                <Text style={styles.valueTxt}>
                  {/* {parseFloat(
                  diff_minutes(
                    new Date(data[data.length - 1].updatedtimestamp),
                    new Date(data[0].createdtimestamp)
                  )
                ).toFixed(2) || 0} */}
                  {Time}
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
          <View style={{ height: 450 }} />
        </ScrollView>
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
    // bottom: "30%",
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
    top: "67%",
    // top: "80%",
    width: "85%",
    alignSelf: "center",
    paddingBottom: 100,
  },
});

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

const IconMarker = () => {
  return (
    <Svg
      version="1.0"
      xmlns="http://www.w3.org/2000/svg"
      width="30.000000pt"
      height="30.000000pt"
      viewBox="0 0 80.000000 128.000000"
      preserveAspectRatio="xMidYMid meet"
    >
      {" "}
      <G
        transform="translate(0.000000,128.000000) scale(0.100000,-0.100000)"
        fill="#000000"
        stroke="none"
      >
        {" "}
        <Path d="M310 1196 c-145 -42 -241 -147 -270 -293 -24 -120 36 -294 171 -497 61 -91 180 -245 189 -245 3 0 37 41 76 92 155 199 253 378 280 507 46 224 -113 432 -341 446 -33 2 -80 -2 -105 -10z m243 -49 c155 -76 222 -248 167 -428 -28 -95 -72 -180 -155 -304 -72 -107 -156 -215 -167 -215 -12 0 -166 206 -208 280 -44 76 -108 217 -119 262 -37 156 21 312 144 386 71 43 109 52 201 49 64 -3 93 -9 137 -30z" />{" "}
        <Path d="M345 987 c-69 -40 -95 -77 -99 -142 -6 -100 104 -186 198 -155 42 13 89 65 106 113 21 66 -21 147 -97 186 -27 14 -82 13 -108 -2z m146 -56 c33 -33 39 -45 39 -82 0 -134 -156 -188 -239 -83 -15 19 -21 41 -21 77 0 44 4 53 39 88 35 35 44 39 91 39 47 0 56 -4 91 -39z" />{" "}
      </G>{" "}
    </Svg>
  );
};

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
