import React from "react";
import {StyleSheet, Text, View} from "react-native";
import {Colors} from "../../../../../styles";

export const RenderEmployeeParameters = (parameter) => {

    const getColor = (ach, tar) => {
        if (ach > 0 && tar === 0) {
            return '#1C95A6'
        } else if (ach === 0 || tar === 0) {
            return '#FA03B9'
        } else {
            if ((ach / tar * 100) === 50) {
                return '#EC3466'
            } else if ((ach / tar * 100) > 50) {
                return '#1C95A6'
            } else if ((ach / tar * 100) < 50) {
                return '#FA03B9'
            }
        }
    }

    const {item, color, parameterType} = parameter;
    const selectedParameter = item.targetAchievements.filter((param) => param.paramName === parameterType)[0];
    const elementColor = getColor(Number(selectedParameter.achievment), Number(selectedParameter.target));

    return (
      <View
        style={[
          styles.itemBox,
          { width: parameterType === "Accessories" ? 60 : 50 },
        ]}
      >
        <Text style={styles.totalText1}>
          {Number(selectedParameter.achievment)}
        </Text>
        <View
          style={{
            height: 1,
            backgroundColor: elementColor,
            //  alignSelf: 'stretch'
          }}
        />
        <Text
          style={[
            styles.totalText,
            {
              width: parameterType === "Accessories" ? 80 : 50,
              color: "#FA03B9",
            },
          ]}
        >
          {Number(selectedParameter.target)}
        </Text>
      </View>
    );
}


const styles = StyleSheet.create({
  itemBox: {
    width: 60,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 2,
  },
  totalText: { textAlign: "center", fontSize: 14 },
  totalText1: {
    color: "black",
    fontSize: 14,
    textAlign: "center",
    textDecorationLine: "underline",
  },
});
