import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../../../../../styles";
import { achievementPercentage } from "../../../../../utils/helperFunctions";

export const RenderGrandTargetTotal = (parameter) => {
  // const paramsData = ['Enquiry', 'Test Drive', 'Home Visit', 'Booking', 'INVOICE', 'Finance', 'Insurance', 'Exchange', 'EXTENDEDWARRANTY', 'Accessories'];
  const { params, totalParams, displayType, moduleType } = parameter;
  const paramsData = params.map(({ paramName }) => paramName);
  return (
    <>
      {paramsData.map((param) => {
        const selectedParameter = totalParams.filter(
          (item) => item.paramName === param
        )[0];
        const enquiryParameter = totalParams.filter(
          (item) => item.paramName === "Enquiry"
        )[0];
        return (
          <View
            key={param}
            style={[
              styles.itemBox,
              {
                width:
                  moduleType === "live-leads"
                    ? 70
                    : param === "Accessories"
                    ? 60
                    : 55,
                backgroundColor: Colors.RED,
              },
            ]}
          >
            {moduleType !== "live-leads" && (
              <Text
                style={[
                  styles.totalText,
                  {
                    width:
                      moduleType === "live-leads"
                        ? 70
                        : param === "Accessories"
                        ? 65
                        : 56,
                    color: Colors.WHITE,
                    // backgroundColor: Colors.MAROON + "30",
                  },
                ]}
              >
                {Number(selectedParameter.target)}
              </Text>
            )}
          </View>
        );
      })}
    </>
  );
};

const styles = StyleSheet.create({
  itemBox: {
    width: 100,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 2,
  },
  totalText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
    height: 25,
    textAlign: "center",
    paddingTop: 3,
  },
  totalText1: {
    color: "#fff",
    fontWeight: "400",
    fontSize: 12,
    height: 20,
    paddingTop: 2,
    textAlign: "center",
  },
});
