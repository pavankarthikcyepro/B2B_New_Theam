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

const dateFormat = "YYYY-MM-DD";
const currentDate = moment().format(dateFormat);
const lastMonthFirstDate = moment(currentDate, dateFormat)
  .subtract(0, "months")
  .startOf("month")
  .format(dateFormat);
const screenWidth = Dimensions.get("window").width;
const data = [
  {
    title: "Creta",
    value: "15",
    innerVariant: false,
    data: [
      { title: "Creta", value: "15" },
      { title: "Venue", value: "20" },
      { title: "Aura", value: "15" },
    ],
  },
  {
    title: "Venue",
    value: "20",
    innerVariant: false,
    data: [
      { title: "Creta", value: "15" },
      { title: "Venue", value: "20" },
      { title: "Aura", value: "15" },
    ],
  },
  {
    title: "Aura",
    value: "15",
    innerVariant: false,
    data: [
      { title: "Creta", value: "15" },
      { title: "Venue", value: "20" },
      { title: "Aura", value: "15" },
    ],
  },
  {
    title: "i20",
    value: "20",
    innerVariant: false,
    data: [
      { title: "Creta", value: "15" },
      { title: "Venue", value: "20" },
      { title: "Aura", value: "15" },
    ],
  },
  {
    title: "Grand i10 Nios",
    value: "15",
    innerVariant: false,
    data: [
      { title: "Creta", value: "15" },
      { title: "Venue", value: "20" },
      { title: "Aura", value: "15" },
    ],
  },
  {
    title: "Kona",
    value: "20",
    innerVariant: false,
    data: [
      { title: "Creta", value: "15" },
      { title: "Venue", value: "20" },
      { title: "Aura", value: "15" },
    ],
  },
];

const InTransitDetailScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const selector = useSelector((state) => state.homeReducer);
  const [newData, setNewData] = useState(data);

  useEffect(() => {
    navigation.setOptions({
      title: route?.params?.headerTitle ? route?.params?.headerTitle : "Detail",
    });
  }, [navigation]);

  const showVariant = async (item, index, lastParameter) => {
    try {
      let localData = [...newData];
      let current = localData[index].innerVariant;
      for (let i = 0; i < localData.length; i++) {
        localData[i].innerVariant = false;
        if (i === localData.length - 1) {
          localData[index].innerVariant = !current;
        }
      }
      setNewData(...[localData]);
    } catch (error) {
      console.log(error);
    }
  };

  const renderData = (item, index) => {
    return (
      <>
        <View style={styles.boxView}>
          <View style={{ width: "40%" }}>
            <Text
              numberOfLines={1}
              onPress={() => {
                let lastParameter = [...newData];
                showVariant(item, index, lastParameter);
              }}
              style={styles.locationTxt}
            >
              {item.title}
            </Text>
          </View>
          <View style={styles.parameterTitleView}>
            <Text numberOfLines={1} style={styles.valueTxt}>
              {item.value}
            </Text>
            <Text numberOfLines={1} style={styles.valueTxt}>
              {item.value}
            </Text>
            <Text numberOfLines={1} style={styles.valueTxt}>
              {item.value}
            </Text>
          </View>
        </View>
        <View style={{ marginBottom: item.innerVariant ? 15 : 0 }}>
          {item.innerVariant &&
            item.data.map((item1) => {
              return renderChildData(item1);
            })}
        </View>
      </>
    );
  };

  const renderChildData = (item1) => {
    return (
      <View style={styles.boxView1}>
        <View style={{ width: "40%" }}>
          <Text numberOfLines={1} style={styles.locationTxt1}>
            {item1.title}
          </Text>
        </View>
        <View style={styles.parameterTitleView}>
          <Text numberOfLines={1} style={styles.valueTxt}>
            {item1.value}
          </Text>
          <Text numberOfLines={1} style={styles.valueTxt}>
            {item1.value}
          </Text>
          <Text numberOfLines={1} style={styles.valueTxt}>
            {item1.value}
          </Text>
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
              <Text style={styles.titleText}>{"Variant"}</Text>
            </View>
            <View style={styles.parameterTitleView}>
              <Text style={styles.titleText}>{"Petrol"}</Text>
              <Text style={styles.titleText}>{"Diesel"}</Text>
              <Text style={styles.titleText}>{"Electric"}</Text>
            </View>
          </View>
          {newData.map((item, index) => {
            return renderData(item, index);
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default InTransitDetailScreen;

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
  locationTxt1: {
    fontSize: 17,
    color: Colors.BLACK,
    fontWeight: "600",
  },
  boxView: {
    // borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 5,
  },
  boxView1: {
    // borderWidth: 1,
    // borderRadius: 10,
    // paddingVertical: 15,
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    justifyContent: "space-around",
  },
});
