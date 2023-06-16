import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Colors } from "../../../styles";
import { client } from "../../../networking/client";
import URL from "../../../networking/endpoints";
import * as AsyncStore from "../../../asyncStore";
import { MyStockTopTabNavigatorIdentifiers } from "../../../navigations/myStockNavigator";
import { updateCurrentScreen } from "../../../redux/myStockReducer";
import { RadioTextItem1 } from "../../../pureComponents/radioTextItem";
import { LoaderComponent } from "../../../components";
import _ from "lodash";

let tableData = [
  { title: ">90", value: 0 },
  { title: ">60", value: 0 },
  { title: ">30", value: 0 },
  { title: ">15", value: 0 },
  { title: "<15", value: 0 },
];

let sample = {
  locationWise_available_count: [],
  intransit_stock: [],
  locationWise_intrsnsit_count: [],
  available_stock: [],
};

const OverviewScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const selector = useSelector((state) => state.myStockReducer);
  const [available, setAvailable] = useState(true);
  const [loading, setLoading] = useState(false);
  const [inventory, setInventory] = useState(sample);
  const [availableAgingData, setAvailableAgingData] = useState([]);
  const [inTransitAgingData, setInTransitAgingData] = useState([]);
  const [role, setRole] = useState("");
  const [noAvailableData, setNoAvailableData] = useState(false);
  const [noInTransitData, setNoInTransitData] = useState(false);
  useLayoutEffect(() => {
    navigation.addListener("focus", () => {
      dispatch(updateCurrentScreen("OVERVIEW"));
      // if (selector.dealerCode) {
      //   getInventory(selector.dealerCode);
      // } else {
        getInventory();
      // }
    });
  }, [navigation, selector.dealerCode]);


  const getInventory = async () => {
    try {
      setLoading(true);
      let employeeData = await AsyncStore.getData(
        AsyncStore.Keys.LOGIN_EMPLOYEE
      );
      if (employeeData) {
        const jsonObj = JSON.parse(employeeData);
        setRole(jsonObj.hrmsRole);
        let payload = {
          orgId: jsonObj.orgId.toString(),
        };
        if (jsonObj.hrmsRole !== "Admin") {
          const branchName = jsonObj.branchs.filter(
            (item) => item.branchId === jsonObj.branchId
          )[0].branchName;

          let newPayload = {
            branchName: branchName,
          };
          payload = { ...payload, ...newPayload };
        }
        // if (jsonObj.hrmsRole === "Admin") {
        //   const branchName = jsonObj.branchs.filter(
        //     (item) => item.branchId === jsonObj.branchId
        //   )[0].branchName;

        //   let newPayload = {
        //     stockyardBranchName: branchName,
        //   };
        //   payload = { ...payload, ...newPayload };
        // }
        if (selector.agingTo && selector.agingFrom && selector.dealerCode) {
          let data = {
            maxAge: selector.agingTo,
            minAge: selector.agingFrom,
          };
          if (jsonObj.hrmsRole === "Admin") {
            let data2 = {
              stockyardBranchName: selector.dealerCode.stockyardName,
            };
            payload = { ...payload, ...data2 };
          }
          if (jsonObj.hrmsRole !== "Admin") {
            const branchName = jsonObj.branchs.filter(
              (item) =>
                item.locationId.toString() ===
                selector.dealerCode.refParentId.toString()
            )[0].branchName;
            let data2 = {
              branchName: branchName,
            };
            payload = { ...payload, ...data2 };
          }
          payload = { ...payload, ...data };
        }

        const response = await client.post(URL.GET_INVENTORY(), payload);
        const json = await response.json();
        if (json) {
          setInventory(json);
          if (json.locationWise_available_count.length === 0) {
            setNoAvailableData(true);
          } else {
            setNoAvailableData(false);
          }
          if (json.locationWise_intrsnsit_count.length === 0) {
            setNoInTransitData(true);
          } else {
            setNoInTransitData(false);
          }
          // if (json.available_stock) {
          //   let path = json.available_stock;
          //   setAvailableAgingData(FormatAging(path));
          // } else {
          //   setAvailableAgingData(tableData);
          // }
          // if (json.intransit_stock) {
          //   let path = json.intransit_stock;
          //   setInTransitAgingData(FormatAging(path));
          // } else {
          //   setInTransitAgingData(tableData);
          // }
        } else {
          setInventory({});
          // setAvailableAgingData(tableData);
          // setInTransitAgingData(tableData);
        }
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      setInventory(sample);
      setNoAvailableData(false);
      setNoInTransitData(false);
      // setAvailableAgingData(tableData);
      // setInTransitAgingData(tableData);
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
        <View style={{ width: "40%" }}>
          <Text style={styles.locationTxt}>{item.name}</Text>
        </View>
        <View style={{ width: "30%" }}>
          <Text
            onPress={() => {
              navigation.navigate(MyStockTopTabNavigatorIdentifiers.detail, {
                headerTitle: item.name,
                available: available,
              });
            }}
            style={{ ...styles.valueTxt, textDecorationLine: "none" }}
          >
            {parseFloat(item.stockValue).toFixed(0) || "0"}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate(MyStockTopTabNavigatorIdentifiers.detail, {
              headerTitle: item.name,
              available: available,
            });
          }}
          style={styles.valueBox}
        >
          <Text style={styles.valueTxt}>{item.count}</Text>
        </TouchableOpacity>
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

  const renderTotalData = (item) => {
    const result = _.sumBy(item, "count");
    let sum = 0;
    if (item?.length > 0) {
      for (let i = 0; i < item.length; i++) {
        const element = item[i];
        if (element.stockValue) {
          sum += parseFloat(element.stockValue);
        } else {
          sum += 0;
        }
      }
    }

    return (
      <View style={styles.boxView}>
        <View style={{ width: "40%" }}>
          <Text style={styles.locationTxt}>{"Total"}</Text>
        </View>
        <View style={{ width: "30%" }}>
          <Text style={{ ...styles.valueTxt, textDecorationLine: "none" }}>
            {sum || 0.0}
          </Text>
        </View>
        <View style={styles.valueBox}>
          <Text style={styles.valueTxt}>{result || 0}</Text>
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
            <Text style={styles.titleText}>{"Location"}</Text>
            <Text style={styles.titleText}>{"₹ Stock Value"}</Text>
            <Text style={styles.titleText}>{"Stock"}</Text>
          </View>
          {available
            ? inventory?.locationWise_available_count?.length > 0 &&
              inventory?.locationWise_available_count?.map((item) => {
                return renderData(item);
              })
            : inventory?.locationWise_intrsnsit_count?.length > 0 &&
              inventory?.locationWise_intrsnsit_count?.map((item) => {
                return renderData(item);
              })}
          <View style={{ marginTop: 10 }}>
            {available
              ? inventory?.locationWise_available_count?.length > 0 &&
                renderTotalData(inventory?.locationWise_available_count)
              : inventory?.locationWise_intrsnsit_count?.length > 0 &&
                renderTotalData(inventory?.locationWise_intrsnsit_count)}
            {available && noAvailableData && <NoData />}
            {!available && noInTransitData && <NoData />}
          </View>
        </View>
        <View style={styles.mainView}>
          {/* <View style={styles.tableTitleView}>
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
  noDataView: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    marginTop: 150,
  },
});
