import React, { useEffect } from "react";
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AppNavigator } from "../../../../../navigations";
import { IconButton, ProgressBar } from "react-native-paper";
import { Colors, GlobalStyle } from "../../../../../styles";
import moment from "moment/moment";
import TextTicker from "react-native-text-ticker";
import { achievementPercentage } from "../../../../../utils/helperFunctions";
import { useSelector } from "react-redux";
import _ from "lodash";

export const RenderSelfInsights = (args) => {
  const selector = useSelector((state) => state.homeReducer);
  const color = [
    "#9f31bf",
    "#00b1ff",
    "#fb03b9",
    "#ffa239",
    "#d12a78",
    "#0800ff",
    "#1f93ab",
    "#ec3466",
    "#ec3466",
  ];

  const dateFormat = "YYYY-MM-DD";
  const currentDate = moment().format(dateFormat);
  const monthLastDate = moment(currentDate, dateFormat)
    .subtract(0, "months")
    .endOf("month")
    .format(dateFormat);
  const dateDiff =
    (new Date(monthLastDate).getTime() - new Date(currentDate).getTime()) /
      (1000 * 60 * 60 * 24) +
    1;
  const { data, type, navigation, userData = "" } = args;

  const enq = data && data.find((x) => x && x.paramName === "Enquiry");
  const ret = data && data.find((x) => x && x.paramName == "INVOICE");
  const acc = data && data.find((x) => x && x.paramName == "Accessories");

  const navigableParams = [
    "Enquiry",
    "Booking",
    "INVOICE",
    "DROPPED",
    "Test Drive",
    "Home Visit",
  ];

  const getRearrangeArray = () => {
    let newArr = Object.assign([], data);
    let final = [];
    if (newArr.length) {
      let index = data.findIndex((obj) => obj?.paramName === "DROPPED");
      if (index >= 0) {
        newArr.splice(index, 1);
        final = Object.assign([], [...newArr, data[index]]);
      } else {
        final = Object.assign([], [...newArr]);
      }
    }
    return final;
  };

  return getRearrangeArray().map((item, index) => {
    if (item) {
      let newPer = (100 * item?.shortfall) / item?.target;
      let newPerStr = `${newPer?.toFixed(0)}%`;
      let isPerShow = false;

      if (
        item.paramName == "INVOICE" ||
        item.paramName == "Exchange" ||
        item.paramName == "Finance" ||
        item.paramName == "Insurance" ||
        item.paramName == "EXTENDEDWARRANTY" ||
        item.paramName == "Accessories"
      ) {
        isPerShow = true;
      }

      return (
        <View
          style={[
            item.paramName == "INVOICE" || item.paramName == "DROPPED"
              ? styles.highLightRow
              : null,
            { flexDirection: "row", paddingLeft: 8 },
          ]}
          key={`${item?.paramShortName}_${index}`}
        >
          <TouchableOpacity
            style={{ flexDirection: "row", width: "55%" }}
            onPress={() => {
              let param = item.paramName;
              if (
                param === "Enquiry" ||
                param === "Booking" ||
                param === "INVOICE"
              ) {
                navigation.navigate(AppNavigator.TabStackIdentifiers.ems, {
                  screen: "EMS",
                  params: {
                    screen: "LEADS",
                    params: {
                      screenName: "TargetScreenSales",
                      params: param === "INVOICE" ? "INVOICECOMPLETED" : param,
                      moduleType: "",
                      employeeDetail: "",
                      selectedEmpId: !_.isEmpty(selector.filterIds?.empSelected)
                        ? selector.filterIds?.empSelected[0]
                        : "",
                      startDate: "",
                      endDate: "",
                      dealerCodes: !_.isEmpty(selector.filterIds?.levelSelected)
                        ? selector.filterIds?.levelSelected
                        : [],
                      ignoreSelectedId: false,
                      parentId: "",
                      istotalClick: true,
                      self: false,
                    },
                  },
                });
                // setTimeout(() => {
                //   navigation.navigate("LEADS", {
                //     param: param === "INVOICE" ? "Retail" : param,
                //     moduleType: "home",
                //     employeeDetail: "",
                //   });
                // }, 1000);
              } else if (param == "Home Visit" || param == "Test Drive") {
                navigation.navigate(AppNavigator.TabStackIdentifiers.myTask);
                setTimeout(() => {
                  navigation.navigate("CLOSED", {
                    screenName: "TargetScreenSales",
                    selectedEmpId: !_.isEmpty(selector.filterIds?.empSelected)
                      ? selector.filterIds?.empSelected[0]
                      : "",
                    startDate: "",
                    endDate: "",
                    dealerCodes: !_.isEmpty(selector.filterIds?.levelSelected)
                      ? selector.filterIds?.levelSelected
                      : [],
                    isself: false,
                    isTeam: true,
                  });
                }, 700);
              } else if (param === "DROPPED") {
                navigation.navigate(
                  AppNavigator.DrawerStackIdentifiers.dropAnalysis,
                  {
                    screen: "DROP_ANALYSIS",
                    params: {
                      emp_id: !_.isEmpty(selector.filterIds?.empSelected)
                        ? selector.filterIds?.empSelected[0]
                        : userData !== ""
                        ? userData.empId
                        : "",
                      fromScreen: "targetSaleshome",
                      dealercodes: !_.isEmpty(selector.filterIds?.levelSelected)
                        ? selector.filterIds?.levelSelected
                        : [],
                      isFilterApplied: true,
                      parentId: "",
                      isSelf: "",
                    },
                  }
                );
                // navigation.navigate(
                //   AppNavigator.DrawerStackIdentifiers.dropAnalysis,
                //   {
                //     screen: "DROP_ANALYSIS",
                //     params: { emp_id: "", fromScreen: "" },
                //   }
                // );
              } else if (param === "Test Drive" || param === "Home Visit") {
                // navigation.navigate(AppNavigator.TabStackIdentifiers.myTask);
                // setTimeout(() => {
                //   navigation.navigate("CLOSED",{
                //     screenName: "TargetScreenSales",
                //     selectedEmpId: selector.filterIds?.empSelected ? selector.filterIds?.empSelected[0] : "",
                //     startDate: "",
                //     endDate: "",
                //     dealerCodes: [],
                //   });
                // }, 750);
              }
            }}
          >
            {/* row title */}
            <View
              style={{
                width: "20%",
                justifyContent: "center",
                marginTop: 5,
              }}
            >
              <Text>
                {item.paramName === "DROPPED" ? "Lost" : item?.paramShortName}
              </Text>
            </View>

            {/* Progress bar Left */}
            <View
              style={{
                flex: 1,
                height: 20,
                width: "20%",
                marginTop: 10,
                paddingLeft: 5,
                position: "relative",
                borderTopLeftRadius: 3,
                justifyContent: "center",
                borderBottomLeftRadius: 3,
                backgroundColor: color[index % color.length],
              }}
            >
              <TextTicker
                duration={10000}
                loop={true}
                // shouldAnimateTreshold={50}
                bounce={false}
                repeatSpacer={50}
                marqueeDelay={0}
                style={{
                  marginBottom: 0,
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                    textDecorationLine: navigableParams.includes(item.paramName)
                      ? "underline"
                      : "none",
                  }}
                >
                  {type === 0
                    ? item.achievment
                    : item.paramName === "Accessories"
                    ? item.achievment
                    : `${achievementPercentage(
                        item.achievment,
                        item.target,
                        item.paramName,
                        enq,
                        ret,
                        acc
                      )}%`}
                </Text>
              </TextTicker>
            </View>

            {/* Progress bar right */}
            <View
              style={{
                width: "35%",
                marginTop: 10,
                position: "relative",
              }}
            >
              <ProgressBar
                progress={
                  item.achivementPerc.includes("%")
                    ? parseInt(
                        item.achivementPerc.substring(
                          0,
                          item.achivementPerc.indexOf("%")
                        )
                      ) === 0
                      ? 0
                      : parseInt(
                          item.achivementPerc.substring(
                            0,
                            item.achivementPerc.indexOf("%")
                          )
                        ) / 100
                    : parseFloat(item.achivementPerc) / 100
                }
                color={color[index % color.length]}
                style={{
                  height: 20,
                  borderTopRightRadius: 3,
                  borderBottomRightRadius: 3,
                  backgroundColor: "#eeeeee",
                }}
              />
              {item.paramName !== "DROPPED" && (
                <View style={{ position: "absolute", top: 1, right: 5 }}>
                  <TextTicker
                    duration={10000}
                    loop={true}
                    // shouldAnimateTreshold={50}
                    bounce={false}
                    repeatSpacer={50}
                    marqueeDelay={0}
                    style={{
                      marginBottom: 0,
                    }}
                  >
                    <Text
                      style={{
                        color:
                          parseInt(
                            item.achivementPerc.substring(
                              0,
                              item.achivementPerc.indexOf("%")
                            )
                          ) >= 90
                            ? Colors.WHITE
                            : Colors.BLACK,
                      }}
                    >
                      {item.target}
                    </Text>
                  </TextTicker>
                </View>
              )}
            </View>
          </TouchableOpacity>
          {/* Balance and AR/Day */}
          {item.paramName !== "DROPPED" ? (
            <View
              style={{
                width: "35%",
                justifyContent: "center",
                flexDirection: "row",
                height: 25,
                alignItems: "center",
                marginTop: 8,
                marginLeft: 20,
              }}
            >
              <View
                style={{
                  // maxWidth: item.target && item.target.length >= 6 ? 70 : 45,
                  // minWidth: 45,
                  width: 45,
                  height: 25,
                  borderColor: color[index % color.length],
                  borderWidth: 1,
                  borderRadius: 8,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextTicker
                  duration={10000}
                  loop={true}
                  // shouldAnimateTreshold={50}
                  bounce={false}
                  repeatSpacer={50}
                  marqueeDelay={0}
                  style={{
                    marginBottom: 0,
                  }}
                >
                  <Text style={{ padding: 2 }}>
                    {Number(item.achievment) > Number(item.target)
                      ? 0
                      : item.shortfall}
                  </Text>
                </TextTicker>
              </View>
              <View
                style={{
                  // maxWidth: item.target && item.target.length >= 6 ? 70 : 45,
                  // minWidth: 45,
                  width: 45,
                  height: 25,
                  borderColor: color[index % color.length],
                  borderWidth: 1,
                  borderRadius: 8,
                  justifyContent: "center",
                  alignItems: "center",
                  marginLeft: 20,
                  // marginLeft: item.target.length >= 6 ? 5 : 20,
                }}
              >
                <TextTicker
                  duration={10000}
                  loop={true}
                  // shouldAnimateTreshold={50}
                  bounce={false}
                  repeatSpacer={50}
                  marqueeDelay={0}
                  style={{
                    marginBottom: 0,
                  }}
                >
                  <Text style={{ padding: 2 }}>
                    {isPerShow
                      ? newPer != NaN && newPer
                        ? newPerStr
                        : "0"
                      : parseInt(item.achievment) > parseInt(item.target)
                      ? 0
                      : dateDiff > 0 && parseInt(item.shortfall) !== 0
                      ? Math.abs(
                          Math.round(parseInt(item.shortfall) / dateDiff)
                        )
                      : 0}
                  </Text>
                </TextTicker>
              </View>
            </View>
          ) : (
            <View style={{ width: "35%", marginLeft: 20 }} />
          )}
        </View>
      );
    } else {
      return <View key={index} />;
    }
  });
};

const styles = StyleSheet.create({
  highLightRow: {
    ...GlobalStyle.shadow,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    backgroundColor: Colors.LIGHT_GRAY,
    borderRadius: 5,
    paddingBottom: 10,
    marginTop: 5,
    borderWidth: 1,
    borderColor: Colors.LIGHT_GRAY,
    marginHorizontal: 5
  },
});