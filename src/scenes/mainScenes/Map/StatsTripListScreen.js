import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  FlatList,
  View,
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
import { ActivityIndicator, IconButton } from "react-native-paper";
import AnimLoaderComp from "../../../components/AnimLoaderComp";

const dateFormat = "YYYY-MM-DD";
const currentDate = moment().format(dateFormat);

const StatsTripListScreen = ({ route, navigation }) => {
  // const navigation = useNavigation();
  const selector = useSelector((state) => state.homeReducer);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [paginationLoader, setPaginationLoader] = useState(false);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);

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
          onPress={() => {
            navigation.goBack();
          }}
        />
      ),
    });
  }, [navigation]);

  const getLocation = async (params) => {
    try {
      const response = await client.get(
        URL.GEOLOCATION_TRIPS(params.empId, params.orgId, 1, 25, params.status)
      );
      const json = await response.json();

      if (json?.dmsEntity?.geoLocationRes?.content?.length > 0) {
        setData(json.dmsEntity.geoLocationRes.content);
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

  const getLocationAppend = async (params) => {
    try {
      const response = await client.get(
        URL.GEOLOCATION_TRIPS(
          params.empId,
          params.orgId,
          page + 1,
          25,
          params.status
        )
      );
      const json = await response.json();

      if (json.dmsEntity.geoLocationRes.content.length > 0) {
        setData((prevData) => [
          ...prevData,
          ...json.dmsEntity.geoLocationRes.content,
        ]);
        setPaginationLoader(false);
      } else {
      }
    } catch (error) {
      setData([]);
      setPaginationLoader(false);
    }
  };

  const handleLoadMore = () => {
    if (!paginationLoader) {
      setPage(page + 1);
      getLocationAppend(route.params);
    }
  };

  const renderFooter = () => {
    return (
      <View style={{ paddingVertical: 20 }}>
        {
          paginationLoader ? <AnimLoaderComp visible={true} /> : null
          //   <Text style={{ textAlign: "center" }}>End of List</Text>
        }
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderData}
        ListFooterComponent={renderFooter}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
      />
      <LoaderComponent visible={loading} />
    </SafeAreaView>
  );
};

export default StatsTripListScreen;

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
