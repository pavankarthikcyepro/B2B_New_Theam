import React, { Fragment } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { achievementPercentage } from "../../../../../utils/helperFunctions";
import { Colors } from "../../../../../styles";
import { AppNavigator } from "../../../../../navigations";
import { EmsTopTabNavigatorIdentifiers } from "../../../../../navigations/emsTopTabNavigator";

const screenWidth = Dimensions.get("window").width;
const itemWidth = (screenWidth - 100) / 5;

export const RenderEmployeeParameters = (parameter) => {
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

  const { params, item, color, displayType, navigation, moduleType } =
    parameter;
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
                  { width: param === "Accessories" ? 65 : 55 },
                ]}
              >
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    height: 23,
                  }}
                >
                  <Text
                    onPress={() =>
                      selectedParameter?.achievment !== "0" &&
                      navigateToEmsScreen(param)
                    }
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
                {selectedParameter?.paramName !== "DROPPED" && (
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
                        backgroundColor:
                          selectedParameter?.paramName !== "DROPPED"
                            ? "lightgray"
                            : "transparent",
                        paddingTop: 4,
                      },
                    ]}
                  >
                    {selectedParameter && selectedParameter?.target
                      ? Number(selectedParameter?.target)
                      : 0}
                  </Text>
                )}
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
  totalText: { textAlign: "center", fontSize: 12, height: 22 },
  totalText1: {
    color: "black",
    fontSize: 14,
    width: "98%",
    textAlign: "center",
    backgroundColor: "rgba(223,228,231,0.67)",
  },
});
