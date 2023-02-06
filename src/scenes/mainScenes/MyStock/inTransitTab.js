import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Keyboard,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  Image,
  ScrollView,
  useWindowDimensions,
  FlatList,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Colors, GlobalStyle } from "../../../styles";
import { client } from "../../../networking/client";
import URL from "../../../networking/endpoints";
import * as AsyncStore from "../../../asyncStore";
import moment from "moment";
import { MyStockTopTabNavigatorIdentifiers } from "../../../navigations/myStockNavigator";
import { updateCurrentScreen } from "../../../redux/myStockReducer";

const dateFormat = "YYYY-MM-DD";
const currentDate = moment().format(dateFormat);
const lastMonthFirstDate = moment(currentDate, dateFormat)
  .subtract(0, "months")
  .startOf("month")
  .format(dateFormat);
const screenWidth = Dimensions.get("window").width;

const InTransitScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const selector = useSelector((state) => state.homeReducer);

  useLayoutEffect(() => {
    navigation.addListener("focus", () => {
      dispatch(updateCurrentScreen("IN_TRANSIT"));
    });
  }, [navigation]);

  const data = [
    { title: "Creta", value: "15" },
    { title: "Venue", value: "20" },
    { title: "Aura", value: "15" },
    { title: "i20", value: "20" },
    { title: "Grand i10 Nios", value: "15" },
    { title: "Kona", value: "20" },
  ];

  const renderData = (item) => {
    return (
      <View style={styles.boxView}>
        <View style={{ width: "40%" }}>
          <Text
            onPress={() => {
              navigation.navigate(
                MyStockTopTabNavigatorIdentifiers.inTransitDetail,
                {
                  headerTitle: item.title,
                }
              );
            }}
            style={styles.locationTxt}
          >
            {item.title}
          </Text>
        </View>
        <View style={styles.parameterTitleView}>
          <Text style={styles.valueTxt}>{item.value}</Text>
          <Text style={styles.valueTxt}>{item.value}</Text>
          <Text style={styles.valueTxt}>{item.value}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.mainView}>
          <View style={styles.titleView}>
            <View style={{ width: "40%" }}>
              <Text style={styles.titleText}>{"Model"}</Text>
            </View>
            <View style={styles.parameterTitleView}>
              <Text style={styles.titleText}>{"Petrol"}</Text>
              <Text style={styles.titleText}>{"Diesel"}</Text>
              <Text style={styles.titleText}>{"Electric"}</Text>
            </View>
          </View>
          {data.map((item) => {
            return renderData(item);
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default InTransitScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: Colors.LIGHT_GRAY,
  },
  mainView: {
    flex: 1,
    width: "95%",
    alignSelf: "center",
    marginTop: 15,
  },
  titleText: {
    fontSize: 20,
    color: Colors.RED,
    fontWeight: "600",
  },
  valueTxt: {
    fontSize: 17,
    color: Colors.RED,
    fontWeight: "600",
    // textDecorationLine: "underline",
  },
  valueBox: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  locationTxt: {
    fontSize: 17,
    color: Colors.BLACK,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  boxView: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 5,
  },
  titleView: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  tableTitle: {
    width: "49.5%",
    backgroundColor: Colors.RED,
    paddingVertical: 5,
    alignContent: "center",
    paddingLeft: 10,
  },
  tableTitleTxt: {
    color: Colors.WHITE,
    fontSize: 17,
    fontWeight: "600",
  },
  tableTitleView: { flexDirection: "row", justifyContent: "space-between" },
  parameterTitleView: {
    width: "60%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
