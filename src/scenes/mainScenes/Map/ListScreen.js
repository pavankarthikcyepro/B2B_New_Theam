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
import { IconButton } from "react-native-paper";

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

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <IconButton 
          icon="arrow-left"
          color={Colors.WHITE}
          size={30}
          onPress={()=>{
            navigation.goBack();
          }}
        />
      ),
    });
  }, [navigation]);

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
        <Text
          style={{
            fontSize: 20,
            fontWeight: "700",
            marginBottom: 10,
            color: Colors.RED,
          }}
        >
          {"Trip No. " + (index + 1)}
        </Text>
        <Text
          style={{
            fontSize: 13,
            fontWeight: "500",
            marginBottom: 2,
            color: Colors.BLACK,
          }}
        >
          {"Start Time :  " +
            moment(item?.createdtimestamp)
              .utcOffset("+05:30")
              .format("YYYY-MM-DD    hh:mm A")}
        </Text>
        <Text
          style={{
            fontSize: 13,
            fontWeight: "500",
            marginBottom: 2,
            color: Colors.BLACK,
          }}
        >
          {"End Time   :  " +
            moment(item?.updatedtimestamp)
              .utcOffset("+05:30")
              .format("YYYY-MM-DD    hh:mm A")}
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
    backgroundColor: Colors.LIGHT_GRAY,
  },
  element: {
    marginVertical: 10,
    width: "95%",
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignSelf: "center",
    borderRadius: 10,
    shadowColor: Colors.BLACK,
    shadowOffset: { width: 3, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
    backgroundColor: Colors.WHITE,
    elevation: 3,
    marginHorizontal: 5,
    marginVertical: 6,
    position: "relative",
  },
});
