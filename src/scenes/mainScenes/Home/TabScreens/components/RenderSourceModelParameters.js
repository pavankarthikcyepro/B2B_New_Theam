import moment from "moment";
import React from "react";
import {Dimensions, StyleSheet, Text, View} from "react-native";
import {sourceModelPercentage} from "../../../../../utils/helperFunctions";

const screenWidth = Dimensions.get("window").width;
const itemWidth = (screenWidth - 100) / 5;

export const RenderSourceModelParameters = (parameter) => {
  const paramsData = [
    "PreEnquiry",
    "Enquiry",
    "Test Drive",
    "Home Visit",
    "Booking",
    "INVOICE",
    "Exchange",
    "Finance",
    "Insurance",
    "EXTENDEDWARRANTY",
    "Accessories",
    "CONTACT PER CAR",
    "ENQUIRY PER CAR",
    "BOOKING PER CAR",
  ];

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
    moduleType,
    sourceModelTotals,
    isEvent = false,
    eventIndex,
  } = parameter;

  // const paramsData = params.map(({paramName}) => paramName);
  if (moduleType !== "live-leads") {
    paramsData.splice(6, 0, "DROPPED");
  }

  const columnBlock = (value, key = "", color, width = 80, fontSize = 14) => {
    return (
      <View key={key} style={[styles.itemBox, { width: width }]}>
        <Text style={[styles.totalText1, { color: color, fontSize: fontSize }]}>
          {value}
        </Text>
      </View>
    );
  };

  const getFormattedDate = (value) => {
    let date = moment(value, "ddd MMM DD").format("DD-MM-YYYY");
    return date;
  };
  
  return (
    <>
      {isEvent ? (
        <>
          {columnBlock(
            getFormattedDate(item.targetAchievements[0].eventDate),
            `date_${eventIndex}`,
            "#FA03B9",
            100,
            12
          )}
          {columnBlock(
            item.targetAchievements[0].budget,
            `budget_${eventIndex}`,
            "#FA03B9",
            80,
            12
          )}
        </>
      ) : null}
      {paramsData.map((param, i) => {
        if (moduleType === "live-leads") {
          if (
            param === "INVOICE" ||
            param === "Enquiry" ||
            param === "Booking" ||
            param === "PreEnquiry"
          ) {
            const selectedParameter = item.targetAchievements.filter(
              (x) => x.paramName === param
            )[0];

            if (selectedParameter) {
              const elementColor = getColor(
                Number(selectedParameter.achievment),
                Number(selectedParameter.target)
              );
              return (
                <View
                  key={`${param}_${i}`}
                  style={[
                    styles.itemBox,
                    {
                      width: param === "Accessories" || param.includes("PER CAR") ? 80 : 60,
                    },
                  ]}
                >
                  <Text style={[styles.totalText1, { color: elementColor }]}>
                    {selectedParameter
                      ? displayType === 0
                        ? selectedParameter.achievment
                        : selectedParameter.paramName == "DROPPED" ||
                          selectedParameter.target > 0
                        ? `${sourceModelPercentage(
                            selectedParameter.achievment,
                            sourceModelTotals[selectedParameter.paramName]
                          )}%`
                        : `${selectedParameter.achievment}%`
                      : 0}
                  </Text>
                </View>
              );
            }
          }
        } else {
          const selectedParameter = item.targetAchievements.filter(
            (x) => x.paramName === param
          )[0];

          if (selectedParameter) {
            const elementColor = getColor(
              Number(selectedParameter.achievment),
              Number(selectedParameter.target)
            );
            return (
              <View
                key={`${param}_${i}`}
                style={[
                  styles.itemBox,
                  {
                    width:
                      param === "Accessories" || param.includes("PER CAR")
                        ? 80
                        : 60,
                  },
                ]}
              >
                <Text style={[styles.totalText1, { color: elementColor }]}>
                  {selectedParameter
                    ? displayType === 0
                      ? selectedParameter.achievment
                      : selectedParameter.paramName == "DROPPED" ||
                        selectedParameter.target > 0
                      ? `${sourceModelPercentage(
                          selectedParameter.achievment,
                          sourceModelTotals[selectedParameter.paramName]
                        )}%`
                      : `${selectedParameter.achievment}%`
                    : 0}
                </Text>
              </View>
            );
          }
        }
      })}
    </>
  );
};


const styles = StyleSheet.create({
    itemBox: {
        height: 25,
        marginVertical: 6,
    },
    totalText: {textAlign: "center", fontSize: 14, height: 20, textAlignVertical: 'center',},
    totalText1: {
        color: "black",
        height: 25,
        fontSize: 14,
        width: '98%',
        paddingTop: 6,
        textAlign: 'center',
        textAlignVertical: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(223,228,231,0.67)'
    },
});
