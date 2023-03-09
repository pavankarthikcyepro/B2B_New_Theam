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
import { LoaderComponent } from "../../../components";

const dateFormat = "YYYY-MM-DD";
const currentDate = moment().format(dateFormat);
const lastMonthFirstDate = moment(currentDate, dateFormat)
  .subtract(0, "months")
  .startOf("month")
  .format(dateFormat);
const screenWidth = Dimensions.get("window").width;

const sample = {
  available_stock: [],
  intransit_stock: [],
  modelWise_available_stock: [],
  modelWise_intransit_stock: [],
};

const AvailableScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const selector = useSelector((state) => state.myStockReducer);
  const [available, setAvailable] = useState(true);
  const [loading, setLoading] = useState(false);
  const [inventory, setInventory] = useState(sample);
  useLayoutEffect(() => {
    navigation.addListener("focus", () => {
      dispatch(updateCurrentScreen("AVAILABLE"));
    });
  }, [navigation]);

  useEffect(() => {
    getInventory(selector.dealerCode);
  }, [selector.dealerCode]);

  const getInventory = async (item) => {
    try {
      setLoading(true);
      let employeeData = await AsyncStore.getData(
        AsyncStore.Keys.LOGIN_EMPLOYEE
      );
      if (employeeData) {
        const jsonObj = JSON.parse(employeeData);
        let branchName = jsonObj.branchs.filter(
          (i) => i.branchId === jsonObj.branchId
        )[0].branchName;
        const response = await client.get(
          URL.GET_INVENTORY_BY_VEHICLE(
            jsonObj.orgId,
            item.name ? item.name : branchName // "Gachibowli"
          )
        );
        const json = await response.json();
        if (json) {
          setInventory(json);
        } else {
          setInventory(sample);
        }
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      setInventory(sample);
    }
  };

  const renderData = (item) => {
    return (
      <View style={styles.boxView}>
        <View style={{ width: "40%" }}>
          <Text
            onPress={() => {
              navigation.navigate(MyStockTopTabNavigatorIdentifiers.variant, {
                headerTitle: item.model,
              });
            }}
            style={styles.locationTxt}
          >
            {item?.model}
          </Text>
        </View>
        <View style={styles.parameterTitleView}>
          <Text style={styles.valueTxt}>{item.petrolCount || 0}</Text>
          <Text style={styles.valueTxt}>{item.dieselCount || 0}</Text>
          <Text style={styles.valueTxt}>{item.electricCount || 0}</Text>
        </View>
      </View>
    );
  };

  const NoData = () => {
    return (
      <>
        <View style={styles.noDataView}>
          <Text style={styles.titleText}>{"No Data Found"}</Text>
        </View>
      </>
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <LoaderComponent visible={loading} onRequestClose={() => {}} />
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
            <View style={{ width: "40%" }}>
              <Text style={styles.titleText}>{"Model"}</Text>
            </View>
            <View style={styles.parameterTitleView}>
              <Text style={styles.titleText}>{"Petrol"}</Text>
              <Text style={styles.titleText}>{"Diesel"}</Text>
              <Text style={styles.titleText}>{"Electric"}</Text>
            </View>
          </View>
          {available
            ? inventory?.modelWise_available_stock.map((item) => {
                return renderData(item);
              })
            : inventory?.modelWise_intransit_stock.map((item) => {
                return renderData(item);
              })}

          {available && inventory?.modelWise_available_stock == 0 && <NoData />}
          {!available && inventory?.modelWise_intransit_stock == 0 && <NoData />}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AvailableScreen;

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
    color: Colors.BLACK,
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
    justifyContent: "space-around",
  },
  noDataView: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    marginTop: 150,
  },
});
