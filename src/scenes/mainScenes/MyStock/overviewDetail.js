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
import { LoaderComponent } from "../../../components";
import { MyStockTopTabNavigatorIdentifiers } from "../../../navigations/myStockNavigator";

const dateFormat = "YYYY-MM-DD";
const currentDate = moment().format(dateFormat);
const lastMonthFirstDate = moment(currentDate, dateFormat)
  .subtract(0, "months")
  .startOf("month")
  .format(dateFormat);
const screenWidth = Dimensions.get("window").width;

let format = {
  branchWise_available_count: [
    // { name: "Hydrabad", price: 15000, count: 15 },
    // { name: "Hydrabad", price: 15000, count: 15 },
    // { name: "Hydrabad", price: 15000, count: 15 },
  ],
  branchWise_intransit_count: [],
  intransit_stock: [],
  available_stock: [],
};

const tableData = [
  { title: ">90", value: "0" },
  { title: ">60", value: "0" },
  { title: ">30", value: "0" },
  { title: ">15", value: "0" },
  { title: "<15", value: "0" },
];

const OverviewDetailScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const selector = useSelector((state) => state.homeReducer);
  const [loading, setLoading] = useState(false);
  const [available, setAvailable] = useState(true);
  const [inventory, setInventory] = useState(format);
  const [availableAgingData, setAvailableAgingData] = useState([]);
  const [inTransitAgingData, setInTransitAgingData] = useState([]);

  useEffect(() => {
    navigation.setOptions({
      title: route?.params?.headerTitle ? route?.params?.headerTitle : "Detail",
    });
  }, [navigation]);

  useEffect(() => {
    if (route?.params?.headerTitle) {
      getDetailInventory(route?.params?.headerTitle);
    }
    if (route?.params?.available) {
      setAvailable(true);
    } else {
      setAvailable(false);
    }
  }, [route?.params]);

  const getDetailInventory = async (location) => {
    try {
      setLoading(true);
      let employeeData = await AsyncStore.getData(
        AsyncStore.Keys.LOGIN_EMPLOYEE
      );
      if (employeeData) {
        const jsonObj = JSON.parse(employeeData);
        let payload = {
          orgId: jsonObj.orgId.toString(),
          locationName: location,
        };
        const response = await client.post(
          URL.GET_INVENTORY_BY_LOCATION(),
          payload
        );
        const json = await response.json();
        if (json) {
          setInventory(json);
          if (json.available_stock) {
            let path = json.available_stock;
            setAvailableAgingData(FormatAging(path));
          } else {
            setAvailableAgingData(tableData);
          }
          if (json.intransit_stock) {
            let path = json.intransit_stock;
            setInTransitAgingData(FormatAging(path));
          } else {
            setAvailableAgingData(tableData);
          }
        } else {
          setInventory({});
          setAvailableAgingData(tableData);
          setAvailableAgingData(tableData);
        }
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      setInventory({});
      setAvailableAgingData(tableData);
      setAvailableAgingData(tableData);
    }
  };

  function FormatAging(path) {
    let latest = [
      {
        title: ">90",
        value: path.filter((i) => Number(i.ageing) > 90).length || 0,
      },
      {
        title: ">60",
        value:
          path.filter((i) => Number(i.ageing) > 60 && Number(i.ageing) <= 90)
            .length || 0,
      },
      {
        title: ">30",
        value:
          path.filter((i) => Number(i.ageing) > 30 && Number(i.ageing) <= 60)
            .length || 0,
      },
      {
        title: ">15",
        value:
          path.filter((i) => Number(i.ageing) > 15 && Number(i.ageing) <= 30)
            .length || 0,
      },
      {
        title: "<15",
        value: path.filter((i) => Number(i.ageing) < 15).length || 0,
      },
    ];
    return latest;
  }

  const renderData = (item) => {
    return (
      <View style={styles.boxView}>
        <View>
          <Text style={styles.locationTxt}>{item.name}</Text>
        </View>
        <View>
          <Text style={{ ...styles.valueTxt, textDecorationLine: "none" }}>
            {item.stockValue || "0.0"}
          </Text>
        </View>
        <View style={styles.valueBox}>
          <Text
            onPress={() => {
              navigation.navigate(MyStockTopTabNavigatorIdentifiers.available, {
                headerTitle: item.name,
                available: available,
              });
            }}
            style={styles.valueTxt}
          >
            {item.count || 0}
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
        <LoaderComponent visible={loading} onRequestClose={() => {}} />
        <View style={styles.mainView}>
          <View style={styles.titleView}>
            <Text style={styles.titleText}>{"Stock Yard"}</Text>
            <Text style={styles.titleText}>{"₹ Stock Value"}</Text>
            <Text style={styles.titleText}>{"Stock"}</Text>
          </View>
          {available
            ? inventory.branchWise_available_count.map((item) => {
                return renderData(item);
              })
            : inventory.branchWise_intransit_count.map((item) => {
                return renderData(item);
              })}
        </View>
        {/* <View style={styles.mainView}>
          <View style={styles.tableTitleView}>
            <View style={styles.tableTitle}>
              <Text style={styles.tableTitleTxt}>{"Aging"}</Text>
            </View>
            <View style={styles.tableTitle}>
              <Text style={styles.tableTitleTxt}>{"Stock"}</Text>
            </View>
          </View> */}
        {/* {available
            ? availableAgingData.map((item, index) => {
                return renderTableData(item, index);
              })
            : inTransitAgingData.map((item, index) => {
                return renderTableData(item, index);
              })} */}
        {/* </View> */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default OverviewDetailScreen;

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
