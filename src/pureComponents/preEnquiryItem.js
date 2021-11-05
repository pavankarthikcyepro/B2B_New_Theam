import React from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";
import { Button, IconButton } from "react-native-paper";
import { Colors } from "../styles";
import { convertTimeStampToDateString } from "../utils/helperFunctions";

export const PreEnquiryItem = ({
  name,
  subName,
  date,
  modelName,
  enquiryCategory,
  bgColor = Colors.WHITE,
  onPress,
  onCallPress
}) => {

  let textColor = Colors.GREEN;
  let displayCategoryText = "";
  if (enquiryCategory) {
    displayCategoryText = enquiryCategory.toUpperCase();
    if (displayCategoryText === "HOT") {
      textColor = Colors.RED;
    } else if (displayCategoryText === "WARM") {
      textColor = Colors.YELLOW;
    } else if (displayCategoryText === "COLD") {
      textColor = Colors.GREEN;
    }
  }

  const myDate = convertTimeStampToDateString(date);

  return (
    <Pressable onPress={onPress}>
      <View style={[styles.container, { backgroundColor: bgColor }]}>
        <View style={styles.leftView}>
          <Text style={styles.text1}>
            {name + " "}{" "}
            <Text
              style={[
                styles.text1,
                { color: textColor, marginLeft: 10, fontSize: 12 },
              ]}
            >
              {displayCategoryText}
            </Text>
          </Text>
          <Text style={[styles.text3, { marginTop: 5 }]}>{subName}</Text>
          <Text style={styles.text2}>{myDate}</Text>
        </View>
        <View style={styles.rightView}>
          <View style={styles.modelBckView}>
            <Text style={styles.text4}>{modelName}</Text>
          </View>
          <IconButton
            icon="phone"
            color={Colors.GREEN}
            size={20}
            onPress={onCallPress}
          />
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: Colors.LIGHT_GRAY,
    alignItems: "center",
  },
  leftView: {},
  rightView: {
    alignItems: "flex-end",
  },
  text1: {
    fontSize: 16,
    fontWeight: "600",
  },
  text2: {
    marginTop: 5,
    fontSize: 12,
    fontWeight: "400",
    color: Colors.GRAY,
  },
  text3: {
    fontSize: 14,
    fontWeight: "400",
  },
  modelBckView: {
    paddingHorizontal: 5,
    paddingVertical: 3,
    backgroundColor: Colors.RED,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4
  },
  text4: {
    fontSize: 12,
    fontWeight: "400",
    color: Colors.WHITE
  }
});
