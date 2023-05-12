import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  FlatList,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { LoaderComponent } from "../../../components";
import { Colors, GlobalStyle } from "../../../styles";
import { client } from "../../../networking/client";
import URL, { baseUrl } from "../../../networking/endpoints";
import moment from "moment";
import _ from "lodash";
import { GeolocationTopTabNavigatorIdentifiers } from "../../../navigations/geolocationNavigator";
import { AppNavigator } from "../../../navigations";

const dateFormat = "YYYY-MM-DD";
const currentDate = moment().format(dateFormat);

const TripListScreen = ({ route, navigation }) => {
  // const navigation = useNavigation();
  const selector = useSelector((state) => state.homeReducer);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    setLoading(true);
    if (route.params) {
      getLocation(route.params);
    }
  }, [route.params]);

  const getLocation = async (params) => {
    try {
      const response = await client.get(
        URL.GET_MAP_COORDINATES_BY_ID(
          params.empId,
          params.orgId,
          params.date || currentDate
        )
      );
      const json = await response.json();

      if (json.length > 0) {
        setData(json);
        setLoading(false);
      } else {
        Alert.alert("No data are Available", "", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      }
    } catch (error) {
      Alert.alert("Something went wrong", "", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
      setData([]);
      setLoading(false);
    }
  };

  const renderData = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          if (route.params.from === "Home") {
            navigation.navigate(AppNavigator.HomeStackIdentifiers.map, {
              item: item,
            });
          } else {
            navigation.navigate(GeolocationTopTabNavigatorIdentifiers.map, {
              item: item,
            });
          }
        }}
        style={styles.element}
      >
        <Text style={{ fontSize: 20, fontWeight: "600", marginBottom: 10 }}>
          {"Trip No. " + (index + 1)}
        </Text>
        <Text style={{ fontSize: 13, fontWeight: "500", marginBottom: 2 }}>
          {"Start Time: " +
            moment(item.createdtimestamp)
              .utcOffset("+05:30")
              .format("YYYY-MM-DD hh:mm:ssa")}
        </Text>
        <Text style={{ fontSize: 13, fontWeight: "500", marginBottom: 2 }}>
          {"End Time: " +
            moment(item.updatedtimestamp)
              .utcOffset("+05:30")
              .format("YYYY-MM-DD hh:mm:ssa")}
        </Text>
      </TouchableOpacity>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderData}
      />
      <LoaderComponent visible={loading} />
    </SafeAreaView>
  );
};

export default TripListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: Colors.WHITE,
  },
  element: {
    marginVertical: 10,
    backgroundColor: Colors.LIGHT_GRAY,
    width: "95%",
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignSelf: "center",
    borderRadius: 10,
    shadowColor: Colors.LIGHT_PINK,
    shadowOffset: { width: 3, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
    borderWidth: 0.3,
    borderColor: Colors.GRAY,
  },
});
