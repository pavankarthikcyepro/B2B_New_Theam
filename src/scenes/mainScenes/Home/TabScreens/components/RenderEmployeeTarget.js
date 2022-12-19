import React, { Fragment } from "react";
import { Dimensions, StyleSheet, Text, TextInput, View } from "react-native";
import { achievementPercentage } from "../../../../../utils/helperFunctions";
import { Colors } from "../../../../../styles";
import { AppNavigator } from "../../../../../navigations";
import { EmsTopTabNavigatorIdentifiers } from "../../../../../navigations/emsTopTabNavigator";

const screenWidth = Dimensions.get("window").width;
const itemWidth = (screenWidth - 100) / 5;

export const RenderEmployeeTarget = (parameter) => {
  // const paramsData = ['Enquiry', 'Test Drive', 'Home Visit', 'Booking', 'INVOICE', 'Finance', 'Insurance', 'Exchange', 'EXTENDEDWARRANTY', 'Accessories'];

  const getColor = (ach, tar) => {
    if (ach > 0 && tar === 0) {
      return "#1C95A6";
    } else if (ach === 0 || tar === 0) {
      return "#FA03B9";
    } else {
      if ((ach / tar) * 100 === 50) {
        return "#EC3466";
      } else if ((ach / tar) * 100 > 50) {
        return "#1C95A6";
      } else if ((ach / tar) * 100 < 50) {
        return "#FA03B9";
      }
    }
  };

  const {
    params,
    item,
    color,
    displayType,
    navigation,
    moduleType,
    editParameters,
    onChangeTeamParamValue,
  } = parameter;
  const paramsData = params.map(({ paramName }) => paramName);
  const navigableParams = [
    "PreEnquiry",
    "Enquiry",
    "Booking",
    "INVOICE",
    "DROPPED",
    "Test Drive",
    "Home Visit",
  ];

  function navigateToEmsScreen(param) {
    const leads = ["enquiry", "booking", "invoice"];
    const isDropped = param.toLowerCase() === "dropped";
    const isContact = param.toLowerCase() === "preenquiry";
    const isLead = leads.includes(param.toLowerCase());
    let employeeDetail = {
      empName: item.empName,
      empId: item.empId,
      orgId: item.orgId,
      branchId: item.branchId,
    };

    if (isLead) {
      navigation.navigate(AppNavigator.TabStackIdentifiers.ems);
      setTimeout(() => {
        navigation.navigate("LEADS", {
          param: param === "INVOICE" ? "Retail" : param,
          employeeDetail: employeeDetail,
          moduleType,
        });
      }, 1000);
    } else if (isContact) {
      navigation.navigate(EmsTopTabNavigatorIdentifiers.preEnquiry, {
        moduleType: "live-leads",
        employeeDetail: employeeDetail,
      });
    } else if (isDropped) {
      navigation.navigate(AppNavigator.DrawerStackIdentifiers.dropAnalysis);
    } else if (param === "Test Drive" || param === "Home Visit") {
      navigation.navigate(AppNavigator.TabStackIdentifiers.myTask);
      setTimeout(() => {
        navigation.navigate("CLOSED");
      }, 750);
    }
  }

  return (
    <>
      {paramsData.map((param, index) => {
        const selectedParameter = item?.isOpenInner
          ? item?.tempTargetAchievements
            ? item?.tempTargetAchievements?.filter(
                (x) => x.paramName === param
              )[0]
            : item.targetAchievements.filter((x) => x.paramName === param)[0]
          : item.targetAchievements.filter((x) => x.paramName === param)[0];
        const enquiryParameter = item?.isOpenInner
          ? item?.tempTargetAchievements
            ? item?.tempTargetAchievements?.filter(
                (item) => item.paramName === "Enquiry"
              )[0]
            : item.targetAchievements.filter(
                (item) => item.paramName === "Enquiry"
              )[0]
          : item.targetAchievements.filter(
              (item) => item.paramName === "Enquiry"
            )[0];
        // const elementColor = getColor(Number(selectedParameter.achievment), Number(selectedParameter.target));
        return (
          <Fragment key={`${index}`}>
            {moduleType !== "live-leads" ? (
              <View
                key={param}
                style={[
                  styles.itemBox,
                  {
                    width: param === "Accessories" ? 65 : 55,
                    backgroundColor:
                      index % 2 == 0 ? "lightgray" : "transparent",
                  },
                ]}
              >
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    height: 23,
                  }}
                >
                  {editParameters && item?.isOpenInner === true ? (
                    <TextInput
                      key={index}
                      editable={editParameters}
                      style={[
                        styles.totalText,
                        {
                          width:
                            moduleType === "live-leads"
                              ? 66
                              : param === "Accessories"
                              ? 63
                              : 53,
                          paddingTop: 4,
                          textDecorationLine: editParameters
                            ? "underline"
                            : "none",
                        },
                      ]}
                      value={selectedParameter?.target}
                      onChangeText={(x) =>
                        onChangeTeamParamValue(index, x, item.id, param)
                      }
                    />
                  ) : (
                    <Text
                      style={[
                        styles.totalText,
                        {
                          width:
                            moduleType === "live-leads"
                              ? 66
                              : param === "Accessories"
                              ? 63
                              : 53,
                          paddingTop: 4,
                          textDecorationLine: "none",
                        },
                      ]}
                    >
                      {selectedParameter && selectedParameter?.target
                        ? Number(selectedParameter?.target)
                        : 0}
                    </Text>
                  )}
                </View>
              </View>
            ) : (
              <View key={param} style={[styles.itemBox, { width: 68 }]}>
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    height: 23,
                  }}
                >
                  <Text
                    onPress={() => navigateToEmsScreen(param)}
                    style={[
                      styles.totalText1,
                      {
                        color: Colors.RED,
                        textDecorationLine: navigableParams.includes(param)
                          ? "underline"
                          : "none",
                      },
                    ]}
                  >
                    {selectedParameter
                      ? displayType === 0
                        ? selectedParameter?.achievment
                        : selectedParameter?.target > 0
                        ? achievementPercentage(
                            selectedParameter?.achievment,
                            selectedParameter?.target,
                            param,
                            enquiryParameter?.achievment
                          )
                        : selectedParameter?.achievment
                      : 0}
                  </Text>
                </View>
              </View>
            )}
          </Fragment>
        );
      })}
    </>
  );
};

const styles = StyleSheet.create({
  itemBox: {
    borderLeftWidth: 1,
    borderLeftColor: "lightgray",
    alignItems: "center",
    justifyContent: "center",
  },
  totalText: { textAlign: "center", fontSize: 12 },
  totalText1: {
    color: "black",
    fontSize: 14,
    width: "98%",
    textAlign: "center",
    backgroundColor: "rgba(223,228,231,0.67)",
  },
  textBox: {
    width: 80,
    height: 40,
    // borderWidth: 1,
    borderRadius: 5,
    // borderColor: "blue",
    marginRight: 5,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
});
