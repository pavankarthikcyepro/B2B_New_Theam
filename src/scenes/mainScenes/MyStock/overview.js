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
import { RadioTextItem1 } from "../../../pureComponents/radioTextItem";
// import { RadioTextItem1 } from "../../../pureComponents";

const dateFormat = "YYYY-MM-DD";
const currentDate = moment().format(dateFormat);
const lastMonthFirstDate = moment(currentDate, dateFormat)
  .subtract(0, "months")
  .startOf("month")
  .format(dateFormat);
const screenWidth = Dimensions.get("window").width;

const OverviewScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const selector = useSelector((state) => state.homeReducer);
  const [available, setAvailable] = useState(true);

  useLayoutEffect(() => {
    navigation.addListener("focus", () => {
      dispatch(updateCurrentScreen("OVERVIEW"));
    });
  }, [navigation]);

  const data = [
    { title: "Hyderabad", value: "15" },
    { title: "Pune", value: "20" },
  ];
  const tableData = [
    { title: ">90", value: "5" },
    { title: ">60", value: "15" },
    { title: ">30", value: "25" },
    { title: ">15", value: "35" },
    { title: "<15", value: "55" },
  ];
  const total = [{ title: "Total", value: "35" }];

  const renderData = (item) => {
    return (
      <View style={styles.boxView}>
        <View>
          <Text style={styles.locationTxt}>{item.title}</Text>
        </View>
        <View style={styles.valueBox}>
          <Text
            onPress={() => {
              navigation.navigate(MyStockTopTabNavigatorIdentifiers.detail, {
                headerTitle: item.title,
              });
            }}
            style={styles.valueTxt}
          >
            {item.value}
          </Text>
        </View>
      </View>
    );
  };

  const renderTableData = (item, index) => {
    return (
      <View style={{ ...styles.tableTitleView, marginTop: 2.5 }}>
        <View
          style={{
            ...styles.tableTitle,
            backgroundColor: index % 2 !== 0 ? Colors.LIGHT_GRAY2 : Colors.GRAY,
          }}
        >
          <Text style={styles.tableTitleTxt}>{item.title}</Text>
        </View>
        <View
          style={{
            ...styles.tableTitle,
            backgroundColor: index % 2 !== 0 ? Colors.LIGHT_GRAY2 : Colors.GRAY,
          }}
        >
          <Text style={styles.tableTitleTxt}>{item.value}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.mainView}>
          <View style={styles.radioView}>
            <RadioTextItem1
              label={"Available"}
              value={"Available"}
              disabled={false}
              status={available}
              onPress={() => {
                setAvailable(true);
              }}
            />
            <View style={{ width: 25 }} />
            <RadioTextItem1
              label={"In Transit"}
              value={"In Transit"}
              disabled={false}
              status={!available}
              onPress={() => {
                setAvailable(false);
              }}
            />
          </View>
          <View style={styles.titleView}>
            <Text style={styles.titleText}>{"Location"}</Text>
            <Text style={styles.titleText}>{"Car Stock"}</Text>
          </View>
          {data.map((item) => {
            return renderData(item);
          })}
          <View style={{ marginTop: 10 }}>{renderData(total[0])}</View>
        </View>
        <View style={styles.mainView}>
          <View style={styles.tableTitleView}>
            <View style={styles.tableTitle}>
              <Text style={styles.tableTitleTxt}>{"Aging"}</Text>
            </View>
            <View style={styles.tableTitle}>
              <Text style={styles.tableTitleTxt}>{"Stock"}</Text>
            </View>
          </View>
          {tableData.map((item, index) => {
            return renderTableData(item, index);
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default OverviewScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: Colors.LIGHT_GRAY,
  },
  radioView: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignSelf: "flex-start",
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
    textDecorationLine: "underline",
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
    fontSize: 18,
    fontWeight: "700",
  },
  tableTitleView: { flexDirection: "row", justifyContent: "space-between" },
});
