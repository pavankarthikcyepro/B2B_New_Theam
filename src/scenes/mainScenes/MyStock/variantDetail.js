import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView, StyleSheet, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Colors } from "../../../styles";
import { client } from "../../../networking/client";
import URL from "../../../networking/endpoints";
import * as AsyncStore from "../../../asyncStore";
import { LoaderComponent } from "../../../components";
import _ from "lodash";

const sample = {
  varientWise_intransit_stock: [],
  varientWise_available_stock: [],
  intransit_stock: [],
  available_stock: [],
};

const Total = [
  {
    model: "Total",
    modelId: 0,
    varient: "Total",
    varientId: 0,
    orgId: 25,
    branchId: 0,
    branchName: "Gachibowli",
    petrolCount: 0,
    dieselCount: 0,
    electricCount: 0,
  },
];

const VariantDetailScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const selector = useSelector((state) => state.myStockReducer);
  const [loading, setLoading] = useState(false);
  const [available, setAvailable] = useState(true);
  const [models, setModels] = useState(sample);
  const [totalAvailableData, setTotalAvailableData] = useState(Total);
  const [totalInTransitData, setTotalInTransitData] = useState(Total);
  const [isSelfManager, setIsSelfManager] = useState("N");

  useEffect(() => {
    navigation.setOptions({
      title: route?.params?.headerTitle ? route?.params?.headerTitle : "Detail",
    });
  }, [navigation]);

  useEffect(() => {
    getVariant(route?.params);
  }, [route?.params]);

  const getVariant = async (item) => {
    try {
      setLoading(true);
      let employeeData = await AsyncStore.getData(
        AsyncStore.Keys.LOGIN_EMPLOYEE
      );
      if (employeeData) {
        const jsonObj = JSON.parse(employeeData);
        setIsSelfManager(jsonObj.isSelfManager);
        let payload = {
          orgId: jsonObj?.orgId.toString(),
          model: item?.headerTitle,
          // branchName: item?.branchName,
        };
        if (jsonObj.hrmsRole === "Admin") {
          let newPayload = {
            stockyardBranchName: item?.branchName,
          };
          payload = { ...payload, ...newPayload };
        }  
        if (jsonObj.hrmsRole !== "Admin") {
          let newPayload = {
            branchName: item?.branchName,
          };
          payload = { ...payload, ...newPayload };
        }
        if (selector.agingTo && selector.agingFrom && selector.dealerCode) {
          let data = {
            maxAge: selector.agingTo,
            minAge: selector.agingFrom,
            // branchName: selector.dealerCode.name,
          };
          console.log("selector.dealerCode", selector.dealerCode);
          if (jsonObj.hrmsRole === "Admin") {
            let newPayload = {
              stockyardBranchName: selector.dealerCode.stockyardName,
            };
            payload = { ...payload, ...newPayload };
          }
          if (jsonObj.hrmsRole !== "Admin") {
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
          URL.GET_INVENTORY_BY_VEHICLE_MODEL(),
          payload
        );
        const json = await response.json();
        setAvailable(item.available);
        if (json) {
          let newArr = json;
          setModels(json);
          if (json.varientWise_available_stock) {
            const arr = json.varientWise_available_stock;
            let total = {
              varient: "Total",
              petrolCount: SumUpTheIndividual("petrolCount", arr),
              dieselCount: SumUpTheIndividual("dieselCount", arr),
              electricCount: SumUpTheIndividual("electricCount", arr),
              stockValue: SumUpTheIndividual("stockValue", arr),
            };
            setTotalAvailableData([total]);
          }
          if (json.varientWise_intransit_stock) {
            const arr = json.varientWise_intransit_stock;
            let total = {
              varient: "Total",
              petrolCount: SumUpTheIndividual("petrolCount", arr),
              dieselCount: SumUpTheIndividual("dieselCount", arr),
              electricCount: SumUpTheIndividual("electricCount", arr),
              stockValue: SumUpTheIndividual("stockValue", arr),
            };
            setTotalInTransitData([total]);
          }
        }
        setLoading(false);
      }
    } catch (error) {
      setModels(sample);
      setLoading(false);
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

  const showVariant = async (item, index, lastParameter) => {
    try {
      let employeeData = await AsyncStore.getData(
        AsyncStore.Keys.LOGIN_EMPLOYEE
      );
      if (employeeData) {
        const jsonObj = JSON.parse(employeeData);
        let payload = {
          orgId: item?.orgId.toString(),
          // branchName: item?.branchName,
          model: route.params?.headerTitle,
          varient: item?.varient,
        };
        if (jsonObj.hrmsRole === "Admin") {
          let newPayload = {
            stockyardBranchName: item?.branchName,
          };
          payload = { ...payload, ...newPayload };
        } else {
          let newPayload = {
            branchName: item?.branchName,
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
          URL.GET_INVENTORY_BY_VEHICLE_COLOR(),
          payload
        );
        const json = await response.json();
        if (response.status == "200") {
          let localData0 = { ...models };
          let localData =
            localData0[
              available
                ? "varientWise_available_stock"
                : "varientWise_intransit_stock"
            ];

          let current = localData[index]?.innerVariant || false;
          for (let i = 0; i < localData.length; i++) {
            localData[i].innerVariant = false;
            if (i === localData.length - 1) {
              localData[index].innerVariant = !current;
              localData[index].data = json;
            }
          }
          setModels(localData0);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const renderData = (item, index, noBorder = false) => {
    let Total = item.petrolCount + item.dieselCount + item.electricCount;

    return (
      <>
        <View style={{ ...styles.boxView }}>
          <View style={{ width: isSelfManager === "Y" ? "40%" : "20%" }}>
            <Text
              numberOfLines={1}
              onPress={() => {
                let lastParameter = { ...models };
                !noBorder && showVariant(item, index, lastParameter);
              }}
              style={{
                ...styles.locationTxt,
                textDecorationLine: noBorder ? "none" : "underline",
                color: Colors.RED,
              }}
            >
              {item?.varient}
            </Text>
          </View>
          <View
            style={[
              styles.parameterTitleView,
              { width: isSelfManager === "Y" ? "60%" : "80%" },
            ]}
          >
            <Text
              numberOfLines={1}
              style={[
                styles.valueTxt,
                { width: isSelfManager === "Y" ? "30%" : "20%" },
              ]}
            >
              {parseFloat(item.stockValue).toFixed(0) || "0"}
            </Text>
            {isSelfManager !== "Y" && (
              <>
                <Text numberOfLines={1} style={styles.valueTxt}>
                  {item.petrolCount || 0}
                </Text>
                <Text numberOfLines={1} style={styles.valueTxt}>
                  {item.dieselCount || 0}
                </Text>
              </>
            )}
            <Text
              numberOfLines={1}
              style={[
                styles.valueTxt,
                { width: isSelfManager === "Y" ? "30%" : "20%" },
              ]}
            >
              {item.electricCount || 0}
            </Text>
            {isSelfManager !== "Y" && (
              <Text numberOfLines={1} style={styles.valueTxt}>
                {Total || 0}
              </Text>
            )}
          </View>
        </View>
        <View style={{ marginBottom: item.innerVariant ? 15 : 0 }}>
          {item?.innerVariant &&
            !_.isEmpty(item?.data) &&
            item?.data[
              available
                ? "colourWise_available_stock"
                : "colourWise_intransit_stock"
            ]?.length > 0 &&
            item?.data[
              available
                ? "colourWise_available_stock"
                : "colourWise_intransit_stock"
            ].map((item1) => {
              return renderChildData(item1);
            })}
        </View>
      </>
    );
  };

  const renderChildData = (item1) => {
    let Total = item1.petrolCount + item1.dieselCount + item1.electricCount;

    return (
      <View style={styles.boxView1}>
        <View style={{ width: isSelfManager === "Y" ? "40%" : "20%" }}>
          <Text numberOfLines={1} style={styles.locationTxt1}>
            {item1.colourName}
          </Text>
        </View>
        <View
          style={[
            styles.parameterTitleView,
            { width: isSelfManager === "Y" ? "60%" : "80%" },
          ]}
        >
          <Text
            numberOfLines={1}
            style={[
              styles.valueTxt,
              { width: isSelfManager === "Y" ? "45%" : "20%" },
            ]}
          >
            {parseFloat(item1.stockValue).toFixed(0) || "0.0"}
          </Text>
          {isSelfManager !== "Y" && (
            <>
              <Text numberOfLines={1} style={styles.valueTxt}>
                {item1.petrolCount || 0}
              </Text>
              <Text numberOfLines={1} style={styles.valueTxt}>
                {item1.dieselCount || 0}
              </Text>
            </>
          )}
          <Text
            numberOfLines={1}
            style={[
              styles.valueTxt,
              { width: isSelfManager === "Y" ? "45%" : "20%" },
            ]}
          >
            {item1.electricCount || 0}
          </Text>
          {isSelfManager !== "Y" && (
            <Text numberOfLines={1} style={styles.valueTxt}>
              {Total || 0}
            </Text>
          )}
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
            <View style={{ width: isSelfManager === "Y" ? "40%" : "20%" }}>
              <Text
                style={{
                  ...styles.titleText,
                  width: "100%",
                  alignSelf: "flex-start",
                }}
              >
                {"Variant"}
              </Text>
            </View>
            <View
              style={[
                styles.parameterTitleView,
                { width: isSelfManager === "Y" ? "60%" : "80%" },
              ]}
            >
              <Text
                style={[
                  styles.titleText,
                  { width: isSelfManager === "Y" ? "100%" : "20%" },
                ]}
              >
                {"₹ Stock Value"}
              </Text>
              {isSelfManager !== "Y" && (
                <>
                  <Text style={styles.titleText}>{"Petrol"}</Text>
                  <Text style={styles.titleText}>{"Diesel"}</Text>
                </>
              )}
              <Text
                style={[
                  styles.titleText,
                  { width: isSelfManager === "Y" ? "100%" : "20%" },
                ]}
              >
                {"Electric"}
              </Text>
              {isSelfManager !== "Y" && (
                <Text style={styles.titleText}>{"Total"}</Text>
              )}
            </View>
          </View>
          {available
            ? models?.varientWise_available_stock?.length > 0 &&
              models?.varientWise_available_stock.map((item, index) => {
                return renderData(item, index);
              })
            : models?.varientWise_intransit_stock.length > 0 &&
              models?.varientWise_intransit_stock.map((item, index) => {
                return renderData(item, index);
              })}
          <View style={{ marginTop: 15 }} />
          {available
            ? models?.varientWise_available_stock?.length > 0 &&
              totalAvailableData.map((item, index) => {
                return renderData(item, index, true);
              })
            : models?.varientWise_intransit_stock?.length > 0 &&
              totalInTransitData.map((item, index) => {
                return renderData(item, index, true);
              })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default VariantDetailScreen;

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
  locationTxt1: {
    fontSize: 14,
    color: Colors.BLACK,
    fontWeight: "600",
    width: "100%",
  },
  boxView: {
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 5,
    flexDirection: "row",
    // justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 5,
  },
  boxView1: {
    borderRadius: 10,
    // paddingVertical: 15,
    paddingHorizontal: 5,
    flexDirection: "row",
    // justifyContent: "space-between",
    alignItems: "center",
    // marginVertical: 5,
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
});
