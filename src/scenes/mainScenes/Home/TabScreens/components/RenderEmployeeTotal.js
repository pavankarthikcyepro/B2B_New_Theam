import React, {useEffect, useState} from "react";
import {Alert, StyleSheet, Text, View} from "react-native";
import {client} from "../../../../../networking/client";
import URL from "../../../../../networking/endpoints";
import {Colors} from "../../../../../styles";
import moment from "moment";
import * as AsyncStore from "../../../../../asyncStore";
import {achievementPercentage} from "../../../../../utils/helperFunctions";

export const RenderEmployeeTotal = (userData) => {
    const paramsData = ['Enquiry', 'Test Drive', 'Home Visit', 'Booking', 'INVOICE', 'Exchange', 'Finance', 'Insurance',  'EXTENDEDWARRANTY', 'Accessories'];
    const {empId, branchId, level, displayType} = userData;
    const [empParams, setEmpParams] = useState([]);
    const [branches, setBranches] = useState([]);
    useEffect(async () => {

        try {
            const branchData = await AsyncStore.getData("BRANCHES_DATA");
            if (branchData) {
                const branchesList = JSON.parse(branchData);
                setBranches([...branchesList]);
            }
        } catch (e) {
            Alert.alert('Error occurred - Employee total', `${JSON.stringify(e)}`);
        }
        const dateFormat = "YYYY-MM-DD";
        const currentDate = moment().format(dateFormat)
        const monthFirstDate = moment(currentDate, dateFormat).subtract(0, 'months').startOf('month').format(dateFormat);
        const monthLastDate = moment(currentDate, dateFormat).subtract(0, 'months').endOf('month').format(dateFormat);

        const payload = {
            "endDate": monthLastDate,
            "loggedInEmpId": empId,
            "empId": empId,
            "startDate": monthFirstDate,
            "levelSelected": null,
            "pageNo": 0,
            "size": 3
        };
        const response = await client.post(URL.GET_TARGET_PARAMS(), payload);
        const json = await response.json()

        if (!response.ok) {
            // Alert.alert('Error occurred', `${JSON.stringify(response)}`);
        }
        setEmpParams(json);
    }, [empId]);
    return (
      <View style={{ flexDirection: "row" }}>
        {level === 0 && (
          <View
            style={{
              width: "8%",
              minHeight: 40,
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              marginRight: 2,
            }}
          >
            {
              <View
                style={{ marginTop: 7, marginBottom: 7, alignItems: "center" }}
              >
                <Text
                  style={{ fontSize: 14, color: "#000", fontWeight: "600" }}
                >
                  Total
                </Text>
                <Text
                  style={{ fontSize: 8, color: "#000", textAlign: "center" }}
                  numberOfLines={2}
                >
                  {branches.length > 0 &&
                    branches
                      .find((x) => +x.branchId === +branchId)
                      ?.branchName.split(" - ")[0]}
                </Text>
              </View>
            }
          </View>
        )}
        <View
          style={[
            {
              width: "96%",
              minHeight: 40,
              flexDirection: "column",
              paddingHorizontal: 0,
            },
          ]}
        >
          <View
            style={{
              width: "100%",
              minHeight: 40,
              flexDirection: "row",
              borderBottomStartRadius: level > 0 ? 10 : 0,
              backgroundColor: level === 0 ? "#ECF0F1" : Colors.LIGHT_GRAY,
            }}
          >
            {paramsData.map((param) => {
              const selectedParameter =
                empParams &&
                empParams.length &&
                empParams.filter((item) => item.paramName === param)[0];
                const enquiryParameter = empParams.filter((item) => item.paramName === 'Enquiry')[0];
                return (
                <TotalView
                  key={param}
                  item={selectedParameter}
                  enqParam={enquiryParameter}
                  parameterType={param}
                  displayType={displayType}
                />
              );
            })}
          </View>
        </View>
      </View>
    );
}

export const TotalView = (parameter) => {
    const {enqParam, item, parameterType, displayType} = parameter;
    return (
        <View style={[styles.itemBox, {width: parameterType === 'Accessories' ? 60 : 50}]}>
            <Text style={[styles.totalText1]}>{item ?
                        displayType === 0 ? item.achievment : achievementPercentage(item.achievment, item.target, parameterType, enqParam.achievment)
                    : 0}
            </Text>
            <View style={{height: 1, backgroundColor: Colors.BLACK,
              // alignSelf: 'stretch'
              }}/>
            <Text
                style={[styles.totalText, {width: parameterType === 'Accessories' ? 80 : 50}]}>{item ? Number(item.target) : 0}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
  itemBox: {
    width: 60,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 2,
  },
  totalText1: {
    color: "black",
    fontSize: 14,
    //  marginRight: -5,
    textAlign: "center",
    textDecorationLine: "underline",
  },
  totalText: {
    color: "#FA03B9",
    fontSize: 14,
    //   marginRight: -5,
    textAlign: "center",
  },
});
