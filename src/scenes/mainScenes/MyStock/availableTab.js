import React, { useEffect, useLayoutEffect, useState } from "react";
import { View, Text, SafeAreaView, StyleSheet, ScrollView } from "react-native";
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

const sample = {
  modelWise_intransit_stock: [],
  modelWise_available_stock: [],
};

const Total = [
  {
    model: "Total",
    modelId: 0,
    varient: null,
    varientId: 0,
    orgId: 25,
    branchId: 0,
    branchName: "Gachibowli",
    petrolCount: 0,
    dieselCount: 0,
    electricCount: 0,
  },
];

const AvailableScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const selector = useSelector((state) => state.myStockReducer);
  const [available, setAvailable] = useState(true);
  const [loading, setLoading] = useState(false);
  const [inventory, setInventory] = useState(null);
  const [branchName, setBranchName] = useState("");
  const [orgID, setOrgID] = useState(0);
  const [totalAvailableData, setTotalAvailableData] = useState(Total);
  const [totalInTransitData, setTotalInTransitData] = useState(Total);
  const [isSelfManager, setIsSelfManager] = useState("N");

  useLayoutEffect(() => {
    navigation.addListener("focus", () => {
      dispatch(updateCurrentScreen("AVAILABLE"));
    });
  }, [navigation]);

  useEffect(() => {
    navigation.setOptions({
      title: route?.params?.headerTitle ? route?.params?.headerTitle : "Detail",
    });
  }, [navigation]);

  // useEffect(() => {
  //   if (selector.dealerCode) {
  //     getInventory(selector.dealerCode);
  //   }
  // }, [selector.dealerCode]);

  useEffect(() => {
    if (route.params) {
      getInventory();
      setAvailable(route.params.available);
    }
  }, [route.params]);

  const getInventory = async (item) => {
    try {
      setLoading(true);
      let employeeData = await AsyncStore.getData(
        AsyncStore.Keys.LOGIN_EMPLOYEE
      );
      if (employeeData) {
        const jsonObj = JSON.parse(employeeData);
        setIsSelfManager(jsonObj.isSelfManager);
        let branchName = route?.params?.headerTitle;
        let payload = {
          orgId: jsonObj.orgId.toString(),
          // branchName: branchName,
        };
        if (jsonObj.hrmsRole === "Admin") {
          let newPayload = {
            stockyardBranchName: branchName,
          };
          payload = { ...payload, ...newPayload };
        } else {
          let newPayload = {
            branchName: branchName,
          };
          payload = { ...payload, ...newPayload };
        }
        if (selector.agingTo && selector.agingFrom && selector.dealerCode) {
          let data = {
            maxAge: selector.agingTo,
            minAge: selector.agingFrom,
            // branchName: selector.dealerCode.name,
          };
          if (jsonObj.hrmsRole === "Admin") {
            let newPayload = {
              stockyardBranchName: selector.dealerCode.stockyardName,
            };
            payload = { ...payload, ...newPayload };
          } else {
             const branchName = jsonObj.branchs.filter(
               (item) =>
                 item.locationId.toString() ===
                 selector.dealerCode.refParentId.toString()
             )[0].branchName;
            let newPayload = {
              branchName: branchName,
            };
            payload = { ...payload, ...newPayload };
          }
          payload = { ...payload, ...data };
        }
        const response = await client.post(
          URL.GET_INVENTORY_BY_VEHICLE(),
          payload
        );
        const json = await response.json();
        if (json) {
          setInventory(json);
          if (json.modelWise_available_stock) {
            const arr = json.modelWise_available_stock;
            let total = {
              model: "Total",
              petrolCount: SumUpTheIndividual("petrolCount", arr),
              dieselCount: SumUpTheIndividual("dieselCount", arr),
              electricCount: SumUpTheIndividual("electricCount", arr),
              stockValue: SumUpTheIndividual("stockValue", arr),
            };
            setTotalAvailableData([total]);
          }
          if (json.modelWise_intransit_stock) {
            const arr = json.modelWise_intransit_stock;
            let total = {
              model: "Total",
              petrolCount: SumUpTheIndividual("petrolCount", arr),
              dieselCount: SumUpTheIndividual("dieselCount", arr),
              electricCount: SumUpTheIndividual("electricCount", arr),
              stockValue: SumUpTheIndividual("stockValue", arr),
            };
            setTotalInTransitData([total]);
          }
        } else {
          // setInventory(sample);
        }
        setBranchName(item.name ? item.name : branchName);
        setOrgID(jsonObj.orgId);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      // setInventory(sample);
    }
  };

  function SumUpTheIndividual(key, arr) {
    let total = 0;
    if (arr) {
      for (let i = 0; i < arr.length; i++) {
        const element = arr[i];
        if (element[key]) {
          total += parseFloat(element[key]);
        }
      }
      return total;
    } else {
      return 0;
    }
  }

  const renderData = (item, noBorder = false) => {
    let Total = item.petrolCount + item.dieselCount + item.electricCount;
    return (
      <View style={{ ...styles.boxView, borderWidth: noBorder ? 0 : 1 }}>
        <View style={{ width: "20%" }}>
          <Text
            onPress={() => {
              !noBorder &&
                navigation.navigate(MyStockTopTabNavigatorIdentifiers.variant, {
                  headerTitle: item.model,
                  branchName: !_.isEmpty(selector.dealerCode)
                    ? selector.dealerCode.name
                    : route?.params?.headerTitle,
                  orgId: orgID,
                  available: available,
                });
            }}
            style={{
              ...styles.locationTxt,
              textDecorationLine: noBorder ? "none" : "underline",
            }}
          >
            {item?.model}
          </Text>
        </View>
        <View style={styles.parameterTitleView}>
          <Text style={styles.valueTxt}>{parseFloat(item.stockValue).toFixed(0) || "0"}</Text>
          {isSelfManager !== "Y" && (
            <>
              <Text style={styles.valueTxt}>{item.petrolCount || 0}</Text>
              <Text style={styles.valueTxt}>{item.dieselCount || 0}</Text>
            </>
          )}
          <Text style={styles.valueTxt}>{item.electricCount || 0}</Text>
          {isSelfManager !== "Y" && (
            <Text style={styles.valueTxt}>{Total || 0}</Text>
          )}
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
            <View style={{ width: "20%" }}>
              <Text style={{ ...styles.titleText, width: "100%" }}>
                {"Model"}
              </Text>
            </View>
            <View style={styles.parameterTitleView}>
              <Text style={styles.titleText}>{"₹ Stock Value"}</Text>
              {isSelfManager !== "Y" && (
                <>
                  <Text style={styles.titleText}>{"Petrol"}</Text>
                  <Text style={styles.titleText}>{"Diesel"}</Text>
                </>
              )}
              <Text style={styles.titleText}>{"Electric"}</Text>
              {isSelfManager !== "Y" && (
                <Text style={styles.titleText}>{"Total"}</Text>
              )}
            </View>
          </View>
          {available
            ? inventory?.modelWise_available_stock?.length > 0 &&
              inventory?.modelWise_available_stock.map((item) => {
                return renderData(item);
              })
            : inventory?.modelWise_intransit_stock?.length > 0 &&
              inventory?.modelWise_intransit_stock.map((item) => {
                return renderData(item);
              })}
          <View style={{ marginTop: 15 }} />
          {available
            ? inventory?.modelWise_available_stock?.length > 0 &&
              totalAvailableData.map((item) => {
                return renderData(item, true);
              })
            : inventory?.modelWise_intransit_stock?.length > 0 &&
              totalInTransitData.map((item) => {
                return renderData(item, true);
              })}
          {available && inventory?.modelWise_available_stock == 0 && <NoData />}
          {!available && inventory?.modelWise_intransit_stock == 0 && (
            <NoData />
          )}
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
    fontSize: 14,
    color: Colors.RED,
    fontWeight: "600",
    width: "20%",
    textAlign: "center",
  },
  valueTxt: {
    fontSize: 13,
    color: Colors.BLACK,
    fontWeight: "600",
    textAlign: "center",
    width: "20%",
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
    fontSize: 14,
    color: Colors.BLACK,
    fontWeight: "600",
    textDecorationLine: "underline",
    width: "100%",
  },
  boxView: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 5,
    flexDirection: "row",
    // justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 5,
  },
  titleView: {
    // flex: 1,
    flexDirection: "row",
    // justifyContent: "space-between",
    // marginVertical: 10,
    // marginHorizontal: 10,
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
    width: "80%",
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
